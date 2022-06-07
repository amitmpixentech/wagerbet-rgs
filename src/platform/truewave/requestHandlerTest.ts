const { config } = require("winston");
const constants = require("../../config/constants");

function handleRequest(handleRequest: { path: string; payload: any; }) {
  const { path, payload } = handleRequest
  return {
    post: () => {
      switch (path) {
        case "authentication":
          return {
            balance: constants["demoBalance"],
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "string",
            statusId: 1,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "bet":
          return {
            balance: "",
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "string",
            statusId: 1,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "win":
          return {
            balance: "",
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "string",
            statusId: 1,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "REFUND":
          return {
            balance: "",
            token: "",
            transactionId: Math.floor(Math.random() * 1000000000),
            platformTransactionId: Math.floor(Math.random() * 1000000000),
            amount: payload["amount"],
            gameReference: payload["gameCode"],
            roundId: payload["roundId"],
            message: payload["message"],
            alreadyProcessed: false,
            statusId: 0,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "balance":
          return {
            balance: "",
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "string",
            statusId: 0,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        default:
          break;
      }
    },
  };
}

module.exports = handleRequest;
