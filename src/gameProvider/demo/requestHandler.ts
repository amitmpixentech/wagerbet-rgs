import AuthenticatePlayerRequest from "./../../rgs/request/authenticatePlayerRequest";
import TransactionRequest from "../../rgs/request/transactionRequest";
import rgsService from "../../rgs/service/rgsService";
import checkStatus from "../../utills/checkStatus";
import logger from "../../logger/logger";
const log = logger(module);;

const self = {
  authenticatePlayer: async (authenticatePlayerInfo: any, additionalParams: any) => {
    const authenticatePlayerRequest = new AuthenticatePlayerRequest(
      {
        ...authenticatePlayerInfo,
        ...additionalParams
      }
    );

    log.debug({
      text: authenticatePlayerRequest,
      fn: "authenticatePlayer",
    });
    const authenticatePlayerResponse = await rgsService.authenticatePlayer({
      authenticatePlayerRequest,
      additionalParams,
    });
    var response = authenticatePlayerResponse;
    if (!checkStatus(authenticatePlayerResponse.status)) {
      response = {
        ...authenticatePlayerResponse,
        balance: +(authenticatePlayerResponse["balance"] / 100).toFixed(2),
        otherParams: {
          ...authenticatePlayerResponse["otherParams"],
          balance: +(authenticatePlayerResponse["balance"] / 100).toFixed(2),
        },
      };
      return { ...response };
    } else {
      return authenticatePlayerResponse;
    }
  },

  bet: async (betInfo: any, additionalParams: any) => {
    const transactionRequest = new TransactionRequest(betInfo);

    log.debug({
      text: transactionRequest,
      fn: "bet",
    });
    const transactionResponse = await rgsService.transact({
      transactionRequest,
      additionalParams,
    });
    var response = {
      ...transactionResponse,
      balance: +(transactionResponse["balance"] / 100).toFixed(2),
      otherParams: {
        ...transactionResponse["otherParams"],
        balance: +(transactionResponse["balance"] / 100).toFixed(2),
      },
    };
    log.debug({
      text: response,
      fn: "bet",
    });
    return { ...response };
  },

  win: async (winInfo: any) => {
    const transactionRequest = new TransactionRequest(winInfo);
    log.debug({
      text: transactionRequest,
      fn: "win",
    });
    const transactionResponse = await rgsService.transact({
      transactionRequest: transactionRequest,
      additionalParams: {},
    });
    var response = {
      ...transactionResponse,
      balance: +(transactionResponse.balance / 100).toFixed(2),
      otherParams: {
        ...transactionResponse.otherParams,
        balance: +(transactionResponse.balance / 100).toFixed(2),
      },
    };
    log.debug({
      text: response,
      fn: "win",
    });
    return { ...response };
  },

  balance: async (balanceInfo: any) => {
    const transactionRequest = new TransactionRequest(balanceInfo);
    log.debug({
      text: transactionRequest,
      fn: "balance",
    });
    const transactionResponse = await rgsService.balance({
      transactionRequest: transactionRequest,
      additionalParams: {},
    });
    if (!checkStatus(transactionResponse.status)) {
      var responseData = {
        ...transactionResponse,
        balance: +(transactionResponse["balance"] / 100).toFixed(2),
        otherParams: {
          ...transactionResponse["otherParams"],
          balance: +(transactionResponse["balance"] / 100).toFixed(2),
        },
      };
      return { ...responseData };
    } else {
      return transactionResponse;
    }
  },
};

module.exports = self;
