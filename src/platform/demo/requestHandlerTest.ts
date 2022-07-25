import isInvalidStatus from "../../utills/isInvalidStatus";
import mongo from "../../_helper/mongo";

const constants = require("../../config/constants");

function handleRequest(handleRequest: { path: string; payload: any; }) {
  const { path, payload } = handleRequest
  return {
    post: async () => {
      const user = await getUser(payload)
      
      switch (path) {
        case "authentication":
          if (isInvalidStatus(user.status)) {
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
          if (isInvalidStatus(user.status) || user.data) {
            return {
              balance: "",
              currencyCode: "",
              languageCode: "",
              message: "User Not found",
              statusId: 1001,
              playerId: "",
              userName: "",
            };
          }
          await betWin(payload, user)
          var updateUser: any = await getUser(payload)
          return {
            balance: updateUser.data.balance,
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
            statusId: 1000,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "win":
          if (isInvalidStatus(user.status) || user.data) {
            return {
              balance: "",
              currencyCode: "",
              languageCode: "",
              message: "User Not found",
              statusId: 1001,
              playerId: "",
              userName: "",
            };
          }
          await betWin(payload, user)
          var updateUser: any = await getUser(payload)
          return {
            balance: updateUser.data.balance,
            currencyCode: payload["currencyCode"],
            languageCode: payload["languageCode"],
            message: "",
            statusId: 1000,
            playerId: payload["playerId"],
            userName: payload["playerId"],
          };
        case "REFUND":
          if (isInvalidStatus(user.status) || user.data) {
            return {
              balance: "",
              currencyCode: "",
              languageCode: "",
              message: "User Not found",
              statusId: 1001,
              playerId: "",
              userName: "",
            };
          }
          await betWin(payload, user)
          var updateUser: any = await getUser(payload)
          return {
            balance: updateUser.data.balance,
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

async function betWin(payload: { playerId?: any; amount?: any }, user: any) {
  const { playerId, amount } = payload
  try {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("users")
          .updateOne(
            {
              playerId: playerId,
            },
            {
              $set: { balance: user.data.balance - payload.amount },
            }, function (error: any, data: unknown) {
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

module.exports = handleRequest;
