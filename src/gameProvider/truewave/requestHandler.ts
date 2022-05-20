const AuthenticatePlayerRequest = require("../../rgs/request/authenticatePlayerRequest");
const TransactionRequest = require("../../rgs/request/transactionRequest");
const rgsService = require("../../rgs/service/rgsService");
const logger = require("../../logger/logger");

interface self {
  [key: string]: any
}
const self: self = {
  authenticatePlayer: async (authenticatePlayerInfo: any) => {
    const authenticatePlayerRequest = new AuthenticatePlayerRequest(
      authenticatePlayerInfo
    );
    logger.debug(
      "truewave:requestHandler:authenticatePlayer",
      authenticatePlayerRequest
    );
    const authenticatePlayerResponse = await rgsService.authenticatePlayer(
      authenticatePlayerRequest,
      {}
    );
    var response = {
      ...authenticatePlayerResponse,
      balance: +(authenticatePlayerResponse.balance / 100).toFixed(2),
      otherParams: {
        ...authenticatePlayerResponse.otherParams,
        balance: +(authenticatePlayerResponse.balance / 100).toFixed(2),
      },
    };
    logger.debug("truewave - response", response);
    return { ...response };
  },

  bet: async (betInfo: any) => {
    const transactionRequest = new TransactionRequest(betInfo);
    logger.debug("truewave:requestHandler:bet", transactionRequest);
    const transactionResponse = await rgsService.transact(
      transactionRequest,
      {}
    );
    logger.debug("truewave - response", transactionResponse);
    var response = {
      ...transactionResponse,
      balance: +(transactionResponse.balance / 100).toFixed(2),
      otherParams: {
        ...transactionResponse.otherParams,
        balance: +(transactionResponse.balance / 100).toFixed(2),
      },
    };
    logger.debug("truewave - response", response);
    return { ...response };
  },

  win: async (winInfo: any) => {
    const transactionRequest = new TransactionRequest(winInfo);
    logger.debug("truewave:requestHandler:win", transactionRequest);
    const transactionResponse = await rgsService.transact(
      transactionRequest,
      {}
    );
    var response = {
      ...transactionResponse,
      balance: +(transactionResponse.balance / 100).toFixed(2),
      otherParams: {
        ...transactionResponse.otherParams,
        balance: +(transactionResponse.balance / 100).toFixed(2),
      },
    };
    logger.debug("truewave - response", response);
    return { ...response };
  },

  balance: async (balanceInfo: any) => {
    const transactionRequest = new TransactionRequest(balanceInfo);
    logger.debug("truewave:requestHandler:balance", transactionRequest);
    const transactionResponse = await rgsService.balance(
      transactionRequest,
      {}
    );
    var response = {
      ...transactionResponse,
      balance: +(transactionResponse.balance / 100).toFixed(2),
      otherParams: {
        ...transactionResponse.otherParams,
        balance: +(transactionResponse.balance / 100).toFixed(2),
      },
    };
    logger.debug("truewave - response", response);
    return { ...response };
  },
};

export default self;
