import AuthenticatePlayerRequest from "../../model/request/authenticatePlayerRequest";
import TransactionRequest from "../../model/request/transactionRequest";
import rgsService from "../../services/rgsService";
import isInvalidStatus from "../../utills/isInvalidStatus";
import logger from "../../logger/logger";

const log = logger(module);

class RequestHandler {
  public async authenticatePlayer(authenticatePlayerInfo: any, additionalParams: any) {
    const authenticatePlayerRequest = new AuthenticatePlayerRequest(
      {
        ...authenticatePlayerInfo,
        ...additionalParams
      }
    );

    log.info({
      text: authenticatePlayerRequest,
      fn: "authenticatePlayer",
    });

    const authenticatePlayerResponse = await rgsService.authenticatePlayer({
      authenticatePlayerRequest,
      additionalParams,
    });

    var response = authenticatePlayerResponse;

    if (!isInvalidStatus(authenticatePlayerResponse.status)) {
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
  }

  public async bet(betInfo: any, additionalParams: any) {
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
  }

  public async win(winInfo: any, additionalParams: any) {
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
  }

  public async balance(balanceInfo: any) {
    const transactionRequest = new TransactionRequest(balanceInfo);
    log.debug({
      text: transactionRequest,
      fn: "balance",
    });

    const transactionResponse = await rgsService.balance({
      transactionRequest: transactionRequest,
      additionalParams: {},
    });

    if (isInvalidStatus(transactionResponse.status)) {
      return transactionResponse;
    }

    var responseData = {
      ...transactionResponse,
      balance: +(transactionResponse["balance"] / 100).toFixed(2),
      otherParams: {
        ...transactionResponse["otherParams"],
        balance: +(transactionResponse["balance"] / 100).toFixed(2),
      },
    };
    return { ...responseData };
  }
};

export default new RequestHandler();
