import mongo from "../../_helper/mongo";
import platformServiceMappingConfig from "../../config/platformServiceMapping.json";
import PlayerSession from "../model/playerSession";
import TransactionResponse from "../response/transactionResponse";
const rgsDatabaseService = require("../db/rgsDatabaseService");
const uuid = require("node-uuid");
const constants = require("./../../config/constants");
import checkStatus from "../../utills/checkStatus";
import logger from "./../../logger/logger";
const log = logger(module);

const rgsService = {
    db: mongo.getDB(),
    authenticatePlayer: async (authRequestData: { authenticatePlayerRequest: any; additionalParams: any; }) => {
        const {
            authenticatePlayerRequest,
            additionalParams,
        } = authRequestData
        log.info({
            text: authenticatePlayerRequest,
            fn: "authenticatePlayer",
        });

        const platformId = constants[authenticatePlayerRequest["platformId"]];
        const _platformId = platformId as keyof typeof platformServiceMappingConfig
        const platformService = require(platformServiceMappingConfig[_platformId]);
        const authenticatePlayerResponse = await platformService.authenticatePlayer(
            {
                authenticatePlayerRequest,
                additionalParams,
            }
        );

        if (checkStatus(authenticatePlayerResponse.status)) {
            return {
                status: authenticatePlayerResponse.status,
                message: authenticatePlayerResponse["otherParams"]["message"],
            };
        }

        const playerSession = await new PlayerSession({
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

        if (checkStatus(_playerSession.status)) {
            return _playerSession;
        }

        log.info({
            text: authenticatePlayerResponse,
            fn: "authenticatePlayer",
        });

        return authenticatePlayerResponse;
    },

    transact: async (transactRequestData: { transactionRequest: any; additionalParams: any; }) => {
        const { transactionRequest, additionalParams } = transactRequestData
        log.info({
            text: transactionRequest,
            fn: "transact",
        });

        const playerSession = await rgsService.getPlayerSession(transactionRequest);

        if (checkStatus(playerSession.status) || !playerSession.data) {
            const transactionResponse = new TransactionResponse({
                status: constants["USER_SESSION_NOT_EXIST_CODE"],
                message: constants["USER_SESSION_NOT_EXIST_MESSAGE"],
            });
            return transactionResponse;
        }

        const _transactionRequest = await rgsService.updateTransactionRequest({
            transactionRequest,
            playerSession,
        });

        const rgsTransactionId = uuid.v4();

        const transactionRecord = await rgsService.recordTransaction({
            transactionRequest: _transactionRequest,
            playerSession: playerSession,
            rgsTransactionId: rgsTransactionId,
        });

        if (checkStatus(transactionRecord.status)) {
            const transactionResponse = new TransactionResponse(transactionRecord);

            return transactionResponse;
        }
        const platformId = constants[_transactionRequest["platformId"]];
        const _platformId = platformId as keyof typeof platformServiceMappingConfig
        const platformService = require(platformServiceMappingConfig[_platformId]);
        const transactionResponse = await platformService.transact(
            _transactionRequest,
            additionalParams
        );

        const _updateTransaction = await rgsService.updateTransaction({
            transactionRequest: _transactionRequest,
            rgsTransactionId: rgsTransactionId,
            playerSession: playerSession,
            transactionResponse: transactionResponse,
        });
        if (checkStatus(_updateTransaction.rgsService)) {
            return _updateTransaction;
        }

        if (_transactionRequest["transactionType"] == constants["bet"]) {
            const _recordProviderGameRoundMap =
                await rgsDatabaseService.recordProviderGameRoundMap({
                    gameRoundId: _transactionRequest["roundId"],
                    rgsRoundID: uuid.v4(),
                });
            if (checkStatus(_recordProviderGameRoundMap.status)) {
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
    },

    recordTransaction: async (recordRequest: any) => {
        const {
            transactionRequest,
            playerSession,
            rgsTransactionId,
        } = recordRequest
        let transactionRecordData = {
            roundId: transactionRequest["roundId"],
            rgsTransactionId: rgsTransactionId,
            amount: transactionRequest["amount"],
            transactionType: transactionRequest["transactionType"],
            brand: transactionRequest["brand"],
            gameCode: transactionRequest["gameCode"],
            playerId: playerSession["data"]["playerId"],
            platformId: transactionRequest["platformId"],
            operatorId: transactionRequest["operatorId"],
            aggregatorId: transactionRequest["aggregatorId"],
            providerId: transactionRequest["providerId"],
            currencyCode: transactionRequest["currencyCode"],
            region: transactionRequest["region"],
            status: "",
        };

        if (transactionRequest["transactionType"] == constants["bet"]) {
            transactionRecordData["status"] = constants["DEBIT_INITIATED_STATUS"];
        } else if (transactionRequest["transactionType"] == constants["win"]) {
            transactionRecordData["status"] = constants["CREDIT_INITIATED_STATUS"];
        } else if (transactionRequest["transactionType"] == constants["refund"]) {
            transactionRecordData["status"] = constants["ROLLBACK_MANUAL_STATUS"];
        }

        return await rgsDatabaseService.recordTransaction(transactionRecordData);
    },

    updateTransaction: async (updateRequest: any) => {
        const {
            transactionRequest,
            rgsTransactionId,
            playerSession,
            transactionResponse,
        } = updateRequest
        let updateTransactionData = {
            roundId: transactionRequest["roundId"],
            rgsTransactionId: rgsTransactionId,
            brand: transactionRequest["brand"],
            gameCode: transactionRequest["gameCode"],
            playerId: playerSession["data"]["playerId"],
            platformTransactionId: transactionResponse["platformTransactionId"],
            message: transactionResponse["message"],
            status: "",
        };

        switch (transactionRequest["transactionType"]) {
            case constants["bet"]:
                checkStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] = constants["DEBIT_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["DEBIT_COMPLETED_STATUS"]);
                break;
            case constants["win"]:
                checkStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] =
                        constants["CREDIT_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["CREDIT_COMPLETED_STATUS"]);
                break;
            case constants["refund"]:
                checkStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] =
                        constants["ROLLBACK_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["ROLLBACK_SUCCESS_STATUS"]);
                break;
            default:
        }

        return await rgsDatabaseService.updateTransaction(updateTransactionData);
    },

    balance: async (balanceRequest: { transactionRequest: any; additionalParams: any; }) => {
        const { transactionRequest, additionalParams } = balanceRequest
        log.info({
            text: transactionRequest,
            fn: "balance",
        });
        if (!transactionRequest["playerId"]) {
            const _playerSession = await rgsService.getPlayerSession(transactionRequest);
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
    },

    getPlayerSession: async (playerSessionRequest: { token: any; brand: any; }) => {
        const { token, brand } = playerSessionRequest
        return await rgsDatabaseService.getPlayerSession({
            token,
            brand,
        });
    },

    updateTransactionRequest: async (updateTransactionRequest: { transactionRequest: any; playerSession: any; }) => {
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
    },
};

export default rgsService;
