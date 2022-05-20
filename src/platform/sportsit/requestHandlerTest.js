const logger = require("../../logger/logger");

function handleRequest({ path = "", payload }) {
  logger.debug("payload", payload);
  this.post = () => {
    switch (path) {
      case "authenticate":
        return {
          balance: 500,
          currencyCode: "USD",
          isFreeBet: true,
          languageCode: "string",
          message: "string",
          stakeBonus: 0,
          stakeReal: 0,
          statusId: 0,
          userId: "Amit",
        };
      case "bet":
        return {
          balance: 600,
          token: "string",
          transactionId: "string",
          platformTransactionId: "string",
          amount: 0,
          gameReference: "string",
          roundId: "string",
          message: "string",
          alreadyProcessed: false,
        };
      case "win":
        return {
          balance: 600,
          token: "string",
          transactionId: "string",
          platformTransactionId: "string",
          amount: 100,
          gameReference: "string",
          roundId: "string",
          message: "string",
          alreadyProcessed: false,
        };
      case "REFUND":
        return {
          balance: 300,
          token: "string",
          transactionId: "string",
          platformTransactionId: "string",
          amount: -100,
          gameReference: "string",
          roundId: "string",
          message: "string",
          alreadyProcessed: false,
        };
      default:
        break;
    }
  };
}

module.exports = handleRequest;
