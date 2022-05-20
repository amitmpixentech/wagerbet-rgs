const AuthenticatePlayerResponse = require("../../rgs/response/authenticatePlayerResponse");
const TransactionResponse = require("../../rgs/response/transactionResponse");
const config = require("./../../config/config.json");
import crypto from "crypto";
const constants = require("./constants.json");
const gconstants = require("../../config/constants");
const logger = require("../../logger/logger");

let requestHandler: any;
if (config.isDev) {
  requestHandler = require("./requestHandlerTest");
} else {
  requestHandler = require("./requestHandler");
}

const self = {
  authenticatePlayer: async (playerRequest: any, additionalParams: any) => {
    logger.debug("sportsit:authenticatePlayer", playerRequest);
    const { token } = playerRequest;
    let response = await new requestHandler({
      path: "authentication",
      payload: { token },
    }).post();
    const authenticatePlayerResponse = new AuthenticatePlayerResponse(
      response.statusId,
      response.userId,
      response.userName,
      response.currencyCode,
      response.balance,
      response
    );
    return authenticatePlayerResponse;
  },

  transact: async (transactionRequest: any, additionalParams: any) => {
    logger.debug("transactionRequest", transactionRequest);
    let response;
    const {
      playerId,
      amount,
      gameCode,
      currencyCode,
      roundId,
      transactionType,
    } = transactionRequest;
    const timeStamp = new Date().toISOString();
    const message = `${playerId}+${timeStamp}+${constants.merchant_id}`;
    const signature = crypto
      .createHmac(constants.map, constants.key)
      .update(message)
      .digest(constants.base);
    if (transactionType == gconstants.bet) {
      response = await new requestHandler({
        path: "bet",
        payload: {
          amount: amount,
          gameCode,
          currencyCode,
          playerId,
          roundId,
          signature,
          timeStamp,
        },
      }).post();
    }
    if (transactionType == gconstants.win) {
      response = await new requestHandler({
        path: "win",
        payload: {
          amount: amount,
          gameCode,
          currencyCode,
          playerId,
          roundId,
          signature,
          timeStamp,
        },
      }).post();
    }

    const transactionResponse = new TransactionResponse(
      response.statusId,
      response.message,
      response.playerName,
      response.balance,
      response.currencyCode,
      response.rgsTransactionId,
      response.platformTransactionId,
      response
    );
    return transactionResponse;
  },

  balance: async (transactionRequest: any, additionalParams: any) => {
    logger.debug("transactionRequest", transactionRequest);
    let response;
    const { playerId } = transactionRequest;
    const timeStamp = new Date().toISOString();
    const message = `${playerId}+${timeStamp}+${constants.merchant_id}`;
    const signature = crypto
      .createHmac(constants.map, constants.key)
      .update(message)
      .digest(constants.base);
    response = await new requestHandler({
      path: "balance",
      payload: {
        playerId,
        signature,
        timeStamp,
      },
    }).post();

    logger.debug("sportsit:balance", transactionRequest);

    const transactionResponse = new TransactionResponse(
      response.statusId,
      response.message,
      response.playerName,
      response.balance,
      response.currencyCode,
      response.rgsTransactionId,
      response.platformTransactionId,
      response
    );
    return transactionResponse;
  },
};

module.exports = self;
