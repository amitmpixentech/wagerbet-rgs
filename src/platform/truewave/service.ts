const AuthenticatePlayerResponse = require("../../rgs/response/authenticatePlayerResponse");
const TransactionResponse = require("../../rgs/response/transactionResponse");
const config = require("../../config/config.json");
const uuid = require("node-uuid");
const crypto = require("crypto");

let requestHandler = require("./requestHandlerTest");
import logger from "../../logger/logger";
const log = logger(module);;

const self = {
  authenticatePlayer: async (authenticatePlayer: { authenticatePlayerRequest: any; additionalParams: any; }) => {
    const {
      authenticatePlayerRequest,
      additionalParams,
    } = authenticatePlayer
    log.info({
      text: authenticatePlayerRequest,
      fn: "authenticatePlayer",
    });
    const { token } = authenticatePlayerRequest;
    const { currencyCode, languageCode, playerId } = additionalParams;
    let response = requestHandler({
      path: "authentication",
      payload: { token, currencyCode, languageCode, playerId },
    }).post();
    const authenticatePlayerResponse = new AuthenticatePlayerResponse(
      1,
      response.playerId,
      response.userName,
      response.currencyCode,
      response.balance,
      response
    );
    return authenticatePlayerResponse;
  },

  transact: async (transactionRequest: { playerId: any; token: any; transactionId: any; amount: any; gameCode: any; roundId: any; currencyCode: any; transactionType: any; referenceTransactionId: any; }, additionalParams: any) => {
    log.info({
      text: transactionRequest,
      fn: "transact",
    });
    let response;
    const {
      playerId,
      token,
      transactionId,
      amount,
      gameCode,
      roundId,
      currencyCode,
      transactionType,
      referenceTransactionId,
    } = transactionRequest;
    if (transactionType == "BET") {
      response = requestHandler({
        path: "bet",
        payload: {
          amount,
          gameCode,
          currencyCode,
          playerId,
          roundId,
        },
      }).post();
    }
    if (transactionType == "WIN") {
      response = requestHandler({
        path: "win",
        payload: {
          amount,
          gameCode,
          currencyCode,
          playerId,
          roundId,
        },
      }).post();
    }
    if (transactionType == "REFUND") {
      response = requestHandler({
        path: "refund",
        payload: {
          playerId,
          token,
          transactionId,
          requestId: uuid.v4(),
          amount,
          gameCode,
          roundId,
          referenceTransactionId,
        },
      }).post();
    }

    const transactionResponse = new TransactionResponse({
      status: 1,
      message: response.message,
      playerName: response.playerName,
      balance: response.balance,
      currencyCode: response.currencyCode,
      rgsTransactionId: response.rgsTransactionId,
      platformTransactionId: response.platformTransactionId,
      otherParams: response,
    });
    log.info({
      text: transactionResponse,
      fn: "transact",
    });
    return transactionResponse;
  },
  balance: async (transactionRequest: { playerId: any; }, additionalParams: any) => {
    let response;
    const { playerId } = transactionRequest;

    //need to fetch from db

    response = requestHandler({
      path: "balance",
      payload: {
        playerId,
      },
    }).post();
    log.info({
      text: transactionRequest,
      fn: "balance",
    });

    const transactionResponse = new TransactionResponse({
      status: 1,
      message: response.message,
      playerName: response.userName,
      balance: response.balance,
      currencyCode: response.currencyCode,
      rgsTransactionId: response.rgsTransactionId,
      platformTransactionId: response.platformTransactionId,
      otherParams: response,
    });
    log.info({
      text: transactionResponse,
      fn: "balance",
    });

    return transactionResponse;
  },
};

module.exports = self;
