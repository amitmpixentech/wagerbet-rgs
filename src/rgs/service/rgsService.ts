import mongo from "../../_helper/mongo";
const platformServiceMappingConfig = require("../../config/platformServiceMapping.json");
const PlayerSession = require("../model/playerSession");
const rgsDatabaseService = require("../db/rgsDatabaseService");
const TransactionResponse = require("../response/transactionResponse");
const uuid = require("node-uuid");
const constants = require("./../../config/constants");
const logger = require("../../logger/logger");

const self = {
  db: mongo.getDB(),
  authenticatePlayer: async (authenticatePlayerRequest: any, additionalParams: any) => {
    logger.info("rgsService:authenticatePlayer", authenticatePlayerRequest);
    const platformId = authenticatePlayerRequest.platformId;
    const platformService = require(platformServiceMappingConfig[platformId]);
    const authenticatePlayerResponse = await platformService.authenticatePlayer(
      authenticatePlayerRequest,
      additionalParams
    );
    const playerSession = new PlayerSession(
      authenticatePlayerResponse.playerId,
      authenticatePlayerRequest.token,
      authenticatePlayerRequest.brand,
      authenticatePlayerResponse.playerName,
      authenticatePlayerResponse.currencyCode,
      authenticatePlayerRequest.platformId,
      authenticatePlayerRequest.operatorId,
      authenticatePlayerRequest.region,
      authenticatePlayerResponse.balance,
      authenticatePlayerResponse.status,
      authenticatePlayerResponse.otherParams
    );
    await rgsDatabaseService.savePlayerSession(playerSession);
    return authenticatePlayerResponse;
  },

  transact: async (transactionRequest: any, additionalParams: any) => {
    logger.info("rgsService:bet", transactionRequest);
    const playerSession = await rgsDatabaseService.getPlayerSession(
      transactionRequest.token,
      transactionRequest.brand
    );
    if (!playerSession) {
      const transactionResponse = new TransactionResponse(
        constants.USER_SESSION_NOT_EXIST_CODE,
        constants.USER_SESSION_NOT_EXIST_MESSAGE,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      return transactionResponse;
    }
    !transactionRequest.playerId &&
      (transactionRequest.playerId = playerSession.playerId);

    !transactionRequest.currencyCode &&
      (transactionRequest.currencyCode = playerSession.currencyCode);

    !transactionRequest.gameCode &&
      (transactionRequest.gameCode = playerSession.gameCode);

    const rgsTransactionId = uuid.v4();
    const transactionRecord = await rgsDatabaseService.recordTransaction(
      transactionRequest.roundId,
      rgsTransactionId,
      transactionRequest.amount,
      transactionRequest.transactionType,
      transactionRequest.brand,
      transactionRequest.gameCode,
      playerSession.playerId
    );

    if (transactionRequest.transactionType == constants.bet) {
      const rgsroundID = uuid.v4();
      const recorderDataNotExist =
        await rgsDatabaseService.recordProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          rgsroundID: rgsroundID,
          status: constants.DEBIT_INITIATED_STATUS,
        });
      !recorderDataNotExist &&
        (await rgsDatabaseService.updateProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          status: constants.DEBIT_INITIATED_STATUS,
        }));
    }
    if (transactionRequest.transactionType == constants.win) {
      await rgsDatabaseService.updateProviderGameRoundMap({
        gameRoundId: transactionRequest.roundId,
        status: constants.CREDIT_INITIATED_STATUS,
      });
    }

    if (!transactionRecord) {
      const transactionResponse = new TransactionResponse(
        constants.USER_BET_NOT_EXIST_CODE,
        constants.USER_BET_NOT_EXIST_MESSAGE,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      return transactionResponse;
    }

    const platformService = require(platformServiceMappingConfig[
      transactionRequest.platformId
    ]);
    const transactionResponse = await platformService.transact(
      transactionRequest,
      additionalParams
    );
    await rgsDatabaseService.updateTransaction(
      transactionRequest.roundId,
      rgsTransactionId,
      transactionRequest.brand,
      transactionRequest.gameCode,
      playerSession.playerId,
      transactionResponse.platformTransactionId,
      transactionResponse.message
    );

    if (transactionRequest.transactionType == constants.bet) {
      if (self.checkStatus(transactionResponse.status)) {
        await rgsDatabaseService.updateProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          status: constants.DEBIT_FAILED_STATUS,
        });
      } else {
        await rgsDatabaseService.updateProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          status: constants.DEBIT_COMPLETED_STATUS,
        });
      }
    }
    if (transactionRequest.transactionType == constants.win) {
      if (self.checkStatus(transactionResponse.status)) {
        await rgsDatabaseService.updateProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          status: constants.CREDIT_FAILED_STATUS,
        });
      } else {
        await rgsDatabaseService.updateProviderGameRoundMap({
          gameRoundId: transactionRequest.roundId,
          status: constants.CREDIT_COMPLETED_STATUS,
        });
      }
    }
    return transactionResponse;
  },
  balance: async (transactionRequest: any, additionalParams: any) => {
    logger.info("rgsService:balance", transactionRequest);
    if (!transactionRequest.playerId) {
      const playerSession = await rgsDatabaseService.getPlayerSession(
        transactionRequest.token,
        transactionRequest.brand
      );
      transactionRequest.playerId = playerSession.playerId;
    }

    const platformService = require(platformServiceMappingConfig[
      transactionRequest.platformId
    ]);
    const transactionResponse = await platformService.balance(
      transactionRequest,
      additionalParams
    );
    return transactionResponse;
  },
  checkStatus: (status: Number) => {
    return (
      status == 1001 ||
      status == 1002 ||
      status == 1003 ||
      status == 1095 ||
      status == 1096 ||
      status == 1097 ||
      status == 1098 ||
      status == 1099 ||
      status == 1100
    );
  },
};

module.exports = self;
