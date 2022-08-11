import mongo from "../_helper/mongo";
import platformServiceMappingConfig from "../config/platformServiceMapping.json";
import TransactionResponse from "../model/response/transactionResponse";
const rgsDatabaseService = require("./databaseService");
const uuid = require("node-uuid");

import { constants } from '../config/constants';

import isInvalidStatus from "../utills/isInvalidStatus";
import logger from "../logger/logger";
import dbHelper from "./helper/databaseHelper";
import PlayerSession from "../model/database/playerSession";
const log = logger(module);

class RGSService {
    db: any;

    constructor() {
        mongo.getDB();
    }

    public async authenticatePlayer(authRequestData: { authenticatePlayerRequest: any; additionalParams: any; }) {
        const {
            authenticatePlayerRequest,
            additionalParams,
        } = authRequestData

        log.info("Received Auth Request");
        log.info({
            text: authenticatePlayerRequest,
            fn: "authenticatePlayer",
        });

        const platformId = constants[authenticatePlayerRequest["platformId"]];

        const _platformId = platformId as keyof typeof platformServiceMappingConfig

        const Service = require(platformServiceMappingConfig[_platformId]).default;

        const authenticatePlayerResponse = await Service.authenticatePlayer(
            {
                authenticatePlayerRequest,
                additionalParams,
            }
        );

        log.info("Auth Response");
        log.info({
            text: authenticatePlayerResponse,
            fn: "authenticatePlayer",
        });

        if (isInvalidStatus(authenticatePlayerResponse.status)) {
            return {
                status: authenticatePlayerResponse.status,
                message: authenticatePlayerResponse["otherParams"]["message"],
            };
        }

        const playerSession =  new PlayerSession({
            playerId: authenticatePlayerResponse["playerId"],
            token: authenticatePlayerRequest["token"],
            brand: authenticatePlayerRequest["brand"],
            playerName: authenticatePlayerResponse["playerName"],
            currencyCode: authenticatePlayerResponse["currencyCode"],
            platformId: authenticatePlayerRequest["platformId"],
            operatorId: authenticatePlayerRequest["operatorId"],
            aggregatorId: authenticatePlayerRequest["aggregatorId"],
            providerId: authenticatePlayerRequest["providerId"],
            region: authenticatePlayerRequest["region"],
            balance: authenticatePlayerResponse["balance"],
            status: authenticatePlayerResponse["status"],
            otherParams: authenticatePlayerResponse["otherParams"],
        });

        const _playerSession = await rgsDatabaseService.savePlayerSession({
            playerSession,
        });

        if (isInvalidStatus(_playerSession.status)) {
            log.info("Error Creating Player Session");
            log.info({
                text: _playerSession,
                fn: "authenticatePlayer",
            });
            return _playerSession;
        }

        return authenticatePlayerResponse;
    }

    public async transact(transactRequestData: { transactionRequest: any; additionalParams: any; }) {
        const { transactionRequest, additionalParams } = transactRequestData
        log.info("Received Transact Request");
        log.info({
            text: transactionRequest,
            fn: "transact",
        });

        const playerSession = await this.getPlayerSession(transactionRequest);


        if (isInvalidStatus(playerSession.status) || !playerSession.data) {
            log.info("Player Session Not found");
            log.info({
                text: playerSession,
                fn: "transact",
            });

            const transactionResponse = new TransactionResponse({
                status: constants["USER_SESSION_NOT_EXIST_CODE"],
                message: constants["USER_SESSION_NOT_EXIST_MESSAGE"],
            });
            return transactionResponse;
        }

        const _transactionRequest = await this.updateTransactionRequest({
            transactionRequest,
            playerSession,
        });

        const rgsTransactionId = uuid.v4();

        const transactionRecord = await dbHelper.recordTransaction({
            transactionRequest: _transactionRequest,
            playerSession: playerSession,
            rgsTransactionId: rgsTransactionId,
        })

        if (isInvalidStatus(transactionRecord.status)) {
            log.info("Error creating Transaction Record");
            log.info({
                text: transactionRecord,
                fn: "transact",
            });

            const transactionResponse = new TransactionResponse(transactionRecord);

            return transactionResponse;
        }

        const platformId = constants[_transactionRequest["platformId"]];
        const _platformId = platformId as keyof typeof platformServiceMappingConfig
        const platformService = require(platformServiceMappingConfig[_platformId]).default;

        log.info(`Calling provider ${platformId}`);
        
        const transactionResponse = await platformService.transact(
            _transactionRequest,
            additionalParams
        );

        const _updateTransaction = await dbHelper.updateTransaction({
            transactionRequest: _transactionRequest,
            rgsTransactionId: rgsTransactionId,
            playerSession: playerSession,
            transactionResponse: transactionResponse,
        });

        if (isInvalidStatus(_updateTransaction.rgsService)) {
            log.info("Invalid Transaction Response");
            log.info({
                text: _updateTransaction,
                fn: "transact",
            });
            return _updateTransaction;
        }

        if (_transactionRequest["transactionType"] == constants["bet"]) {
            const _recordProviderGameRoundMap =
                await rgsDatabaseService.recordProviderGameRoundMap({
                    gameRoundId: _transactionRequest["roundId"],
                    rgsRoundID: uuid.v4(),
                });

            if (isInvalidStatus(_recordProviderGameRoundMap.status)) {
                // return _recordProviderGameRoundMap;
            }
        }

        if (transactionRequest?.brand === "demo") {
            var { data } = await rgsDatabaseService.getGameRoundId({
                roundId: transactionRequest.roundId,
                brand: transactionRequest.brand,
                gameCode: transactionRequest.gameCode,
                playerId: transactionRequest.playerId,
            });
            if (data) {
                transactionResponse.balance =
                    constants["demoBalance"] - data.betAmount + data.winAmount;
            }
        }
        log.info({
            text: transactionResponse,
            fn: "transact",
        });

        return transactionResponse;
    }

    public async balance(balanceRequest: { transactionRequest: any; additionalParams: any; }) {
        const { transactionRequest, additionalParams } = balanceRequest
        log.info({
            text: transactionRequest,
            fn: "balance",
        });
        if (!transactionRequest["playerId"]) {
            const _playerSession = await this.getPlayerSession(transactionRequest);
            if (
                _playerSession.status === constants["DB_ERROR"] ||
                !_playerSession["data"]
            ) {
                return _playerSession;
            }
            transactionRequest["playerId"] = _playerSession["data"]["playerId"];
        }

        const platformId = constants[transactionRequest["platformId"]];
        const _platformId = platformId as keyof typeof platformServiceMappingConfig
        const platformService = require(platformServiceMappingConfig[_platformId]);
        const transactionResponse = await platformService.balance({
            transactionRequest: transactionRequest,
            additionalParams: additionalParams,
        });
        log.info({
            text: transactionResponse,
            fn: "balance",
        });

        return transactionResponse;
    }

    public async getPlayerSession(playerSessionRequest: { token: any; brand: any; }) {
        const { token, brand } = playerSessionRequest
        return await rgsDatabaseService.getPlayerSession({
            token,
            brand,
        });
    }

    public async updateTransactionRequest(updateTransactionRequest: { transactionRequest: any; playerSession: any; }) {
        const { transactionRequest, playerSession } = updateTransactionRequest
        if (!transactionRequest["playerId"]) {
            transactionRequest["playerId"] = playerSession["data"]["playerId"];
        }
        if (!transactionRequest["currencyCode"]) {
            transactionRequest["currencyCode"] =
                playerSession["data"]["currencyCode"];
        }
        if (!transactionRequest["gameCode"]) {
            transactionRequest["gameCode"] = playerSession["data"]["gameCode"];
        }

        return transactionRequest;
    }
};

export default new RGSService();
