import checkStatus from "../../utills/checkStatus";
import mongo from "../../_helper/mongo";

const { config } = require("winston");
const constants = require("../../config/constants");

function handleRequest(handleRequest: { path: string; payload: any; }) {
  const { path, payload } = handleRequest
  return {
    post: async () => {
      switch (path) {
        case "authentication":
          const user = await getUser(payload)
          if (checkStatus(user.status)) {
            return {
              balance: "",
              currencyCode: "",
              languageCode: "",
              message: "Internal Error",
              statusId: user.status,
              playerId: "",
              userName: "",
            };
          }

          const data: any = user?.data
          if (!data) {
            await addUser(payload)
          }
          return {
            balance: data?.balance || constants["demoBalance"],
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
            statusId: 1000,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "bet":
          return {
            balance: "",
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
            statusId: 1000,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "win":
          return {
            balance: "",
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
            statusId: 1000,
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
            balance: constants["demoBalance"],
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
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

async function getUser(payload: { playerId?: any; }) {
  const { playerId } = payload
  try {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("users")
          .findOne({ playerId: playerId, }, function (error: any, data: unknown) {
            error ? reject(error) : resolve(data);
          });
      });
    };
    var data = await myPromise();
    return { status: constants["DB_SUCCESS"], data: data };
  } catch (error) {
    return { status: constants["DB_ERROR"], message: error };
  }
}

async function addUser(payload: { currencyCode?: any; languageCode?: any; playerId?: any; }) {
  const { currencyCode, languageCode, playerId } = payload
  try {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("users")
          .insertOne({
            balance: constants["demoBalance"],
            currencyCode: currencyCode,
            languageCode: languageCode,
            playerId: playerId,
            userName: playerId,
          }, function (error: any, data: unknown) {
            error ? reject(error) : resolve(data);
          });
      });
    };
    const data = await myPromise();
    return { status: constants["DB_SUCCESS"], data: data };
  } catch (error) {
    return { status: constants["DB_ERROR"], message: error };
  }
}
module.exports = handleRequest;
