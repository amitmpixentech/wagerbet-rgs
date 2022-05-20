import mongo from "../../_helper/mongo";
const PlayerGameRound = require("../model/playerGameRound");
const Transaction = require("../model/transaction");

const self = {
  db: mongo.getDB(),
  savePlayerSession: async (playerSession: any) => {
    playerSession.insertDate = new Date();
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        self.db
          .collection("playerSessions")
          .insertOne(playerSession, function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          });
      });
    };

    return await myPromise();
  },
  getPlayerSession: async (token: any, brand: any) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("playerSessions")
          .findOne({ token: token, brand: brand }, function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          });
      });
    };
    return await myPromise();
  },
  getGameRoundId: async (roundId: any, brand: any, gameCode: any, playerId: any) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("gameRounds")
          .findOne(
            {
              roundId: roundId,
              brand: brand,
              gameCode: gameCode,
              playerId: playerId,
            },
            function (err: any, data: any) {
              err ? reject(err) : resolve(data);
            }
          );
      });
    };
    return await myPromise();
  },

  getRoundForPlacedBet: async (roundId: any, brand: any, gameCode: any, playerId: any) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("gameRounds")
          .findOne(
            {
              roundId: roundId,
              brand: brand,
              gameCode: gameCode,
              playerId: playerId,
              "transactions.transactionType": "BET",
            },
            function (err: any, data: any) {
              err ? reject(err) : resolve(data);
            }
          );
      });
    };
    return await myPromise();
  },

  insertGameRoundIfDoesNotExist: async (roundId: any, brand: any, gameCode: any, playerId: any) => {
    const gameRound = await self.getGameRoundId(
      roundId,
      brand,
      gameCode,
      playerId
    );
    if (!gameRound) {
      const playerGameRound = new PlayerGameRound(
        brand,
        gameCode,
        playerId,
        "sportsit",
        "sportsit",
        roundId,
        new Date(),
        undefined,
        0,
        0,
        0,
        0,
        "USD",
        [],
        "UK",
        {}
      );
      const myPromise = () => {
        return new Promise((resolve, reject) => {
          self.db
            .collection("gameRounds")
            .insertOne(playerGameRound.getPlayerRound(), function (err: any, data: any) {
              err ? reject(err) : resolve(data);
            });
        });
      };

      return await myPromise();
    }
  },

  recordTransaction: async (
    roundId: any,
    rgsTransactionId: any,
    amount: any,
    transactionType: any,
    brand: any,
    gameCode: any,
    playerId: any
  ) => {
    if (transactionType === "WIN") {
      const getRoundIfBetPlaced = await self.getRoundForPlacedBet(
        roundId,
        brand,
        gameCode,
        playerId
      );
      if (!getRoundIfBetPlaced) return;
    }
    await self.insertGameRoundIfDoesNotExist(
      roundId,
      brand,
      gameCode,
      playerId
    );

    const transaction = new Transaction(
      rgsTransactionId,
      undefined,
      amount,
      transactionType,
      new Date(),
      undefined,
      undefined
    );

    interface incrQuery {
      [key: string]: any
    }
    let incrQuery: incrQuery = {
    };
    if (transactionType === "BET") {
      incrQuery["betAmount"] = +amount;
    }
    if (transactionType === "WIN") {
      incrQuery["winAmount"] = +amount;
    }

    const myPromise = () => {
      return new Promise((resolve, reject) => {
        self.db.collection("gameRounds").updateOne(
          {
            roundId: roundId,
            brand: brand,
            gameCode: gameCode,
            playerId: playerId,
          },
          {
            $push: { transactions: transaction.getTransaction() },
            $inc: incrQuery,
          },
          function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          }
        );
      });
    };
    return await myPromise();
  },

  updateTransaction: async (
    roundId: any,
    rgsTransactionId: any,
    brand: any,
    gameCode: any,
    playerId: any,
    platformTransactionId: any,
    message: any
  ) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        self.db.collection("gameRounds").updateOne(
          {
            roundId: roundId,
            brand: brand,
            gameCode: gameCode,
            playerId: playerId,
            "transactions.rgsTransactionId": rgsTransactionId,
          },
          {
            $set: {
              "transactions.$.platformTransactionId": platformTransactionId,
              "transactions.$.responseTime": new Date(),
              "transactions.$.message": message,
            },
          },
          function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          }
        );
      });
    };
    return await myPromise();
  },

  recordProviderGameRoundMap: async (providerGameRoundMap: any) => {
    const getProviderGameRoundMap = await self.getProviderGameRoundMap(
      providerGameRoundMap
    );

    if (getProviderGameRoundMap) {
      return;
    }
    providerGameRoundMap.insertDate = new Date();
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        self.db
          .collection("providerGameRoundMap")
          .insertOne(providerGameRoundMap, function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          });
      });
    };
    return await myPromise();
  },

  getProviderGameRoundMap: async (providerGameRoundMap: any) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        mongo
          .getDB()
          .collection("providerGameRoundMap")
          .findOne(
            { gameRoundId: providerGameRoundMap.gameRoundId },
            function (err: any, data: any) {
              err ? reject(err) : resolve(data);
            }
          );
      });
    };
    return await myPromise();
  },

  updateProviderGameRoundMap: async (providerGameRoundMap: any) => {
    const myPromise = () => {
      return new Promise((resolve, reject) => {
        self.db.collection("providerGameRoundMap").updateOne(
          {
            gameRoundId: providerGameRoundMap.gameRoundId,
          },
          {
            $set: {
              status: providerGameRoundMap.status,
              insertDate: new Date(),
            },
          },
          function (err: any, data: any) {
            err ? reject(err) : resolve(data);
          }
        );
      });
    };
    return await myPromise();
  },
};

module.exports = self;
