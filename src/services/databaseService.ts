import mongo from "../_helper/mongo";
const constants = require("../config/constants");
const PlayerGameRound = require("../model/database/playerGameRound");
const Transaction = require("../model/database/transaction");

const self = {
    db: mongo.getDB(),
    savePlayerSession: async (savePlayerSession: { playerSession: any; }) => {
        const { playerSession } = savePlayerSession
        try {
            playerSession.insertDate = new Date();
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("playerSessions")
                        .insertOne(playerSession, function (error: any, data: unknown) {
                            error ? reject(error) : resolve(data);
                        });
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    getPlayerSession: async (getPlayerSession: { token: any; brand: any; }) => {
        const { token, brand } = getPlayerSession
        try {
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("playerSessions")
                        .findOne({ token: token, brand: brand }, function (error: any, data: unknown) {
                            error ? reject(error) : resolve(data);
                        });
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    getGameRoundId: async (getGameRoundId: { roundId: any; brand: any; gameCode: any; playerId: any; }) => {
        const { roundId, brand, gameCode, playerId } = getGameRoundId
        try {
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
                            function (error: any, data: unknown) {
                                error ? reject(error) : resolve(data);
                            }
                        );
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    getRoundForPlacedBet: async (getRoundForPlacedBet: { roundId: any; brand: any; gameCode: any; playerId: any; }) => {
        const { roundId, brand, gameCode, playerId } = getRoundForPlacedBet
        try {
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
                            function (error: any, data: unknown) {
                                error ? reject(error) : resolve(data);
                            }
                        );
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    insertGameRoundIfDoesNotExist: async (insertGameRoundIfDoesNotExist: { roundId: any; brand: any; gameCode: any; playerId: any; platformId: any; operatorId: any; aggregatorId: any; providerId: any; currencyCode: any; region: any; status: any; }) => {
        const {
            roundId,
            brand,
            gameCode,
            playerId,
            platformId,
            operatorId,
            aggregatorId,
            providerId,
            currencyCode,
            region,
            status,
        } = insertGameRoundIfDoesNotExist
        try {
            const gameRound = await self.getGameRoundId({
                roundId,
                brand,
                gameCode,
                playerId,
            });
            if (!gameRound["data"]) {
                const playerGameRound = new PlayerGameRound({
                    brand: brand,
                    gameCode: gameCode,
                    playerId: playerId,
                    platformId: platformId,
                    operatorId: operatorId,
                    aggregatorId: aggregatorId,
                    providerId: providerId,
                    roundId: roundId,
                    startDate: new Date(),
                    endDate: undefined,
                    status: status,
                    betAmount: 0,
                    winAmount: 0,
                    jpWinAmount: 0,
                    currencyCode: currencyCode,
                    transactions: [],
                    region: region,
                    otherParams: {},
                });
                const myPromise = () => {
                    return new Promise((resolve, reject) => {
                        mongo
                            .getDB()
                            .collection("gameRounds")
                            .insertOne(
                                playerGameRound.getPlayerRound(),
                                function (error: any, data: unknown) {
                                    error ? reject(error) : resolve(data);
                                }
                            );
                    });
                };

                const data = await myPromise();
                return { status: constants["DB_SUCCESS"], data: data };
            }
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    recordTransaction: async (recordTransaction: { roundId: any; rgsTransactionId: any; amount: any; transactionType: any; brand: any; gameCode: any; playerId: any; platformId: any; operatorId: any; aggregatorId: any; providerId: any; currencyCode: any; region: any; status: any; }) => {
        const {
            roundId,
            rgsTransactionId,
            amount,
            transactionType,
            brand,
            gameCode,
            playerId,
            platformId,
            operatorId,
            aggregatorId,
            providerId,
            currencyCode,
            region,
            status,
        } = recordTransaction
        try {
            if (transactionType === "WIN") {
                const getRoundIfBetPlaced = await self.getRoundForPlacedBet({
                    roundId,
                    brand,
                    gameCode,
                    playerId,
                });
                if (!getRoundIfBetPlaced) {
                    throw constants["PLAYER_BET_NOT_FOUND_FOR_THIS_ROUND"];
                }
            }
            await self.insertGameRoundIfDoesNotExist({
                roundId,
                brand,
                gameCode,
                playerId,
                platformId,
                operatorId,
                aggregatorId,
                providerId,
                currencyCode,
                region,
                status,
            });

            const transaction = new Transaction({
                rgsTransactionId: rgsTransactionId,
                platformTransactionId: null,
                amount: amount,
                transactionType: transactionType,
                requestTime: new Date(),
                responseTime: null,
                message: null,
            });

            let incrQuery: any = {};
            if (transactionType === constants["bet"]) {
                incrQuery["betAmount"] = +amount;
            }
            if (transactionType === constants["win"]) {
                incrQuery["winAmount"] = +amount;
            }
            if (transactionType === constants["refund"]) {
                incrQuery["refundAmount"] = +amount;
            }

            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("gameRounds")
                        .updateOne(
                            {
                                roundId: roundId,
                                brand: brand,
                                gameCode: gameCode,
                                playerId: playerId,
                            },
                            {
                                $set: { status: status },
                                $push: { transactions: transaction.getTransaction() },
                                $inc: incrQuery,
                            },
                            function (error: any, data: unknown) {
                                error ? reject(error) : resolve(data);
                            }
                        );
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    updateTransaction: async (updateTransaction: { roundId: any; rgsTransactionId: any; brand: any; gameCode: any; playerId: any; platformTransactionId: any; message: any; status: any; }) => {
        const {
            roundId,
            rgsTransactionId,
            brand,
            gameCode,
            playerId,
            platformTransactionId,
            message,
            status,
        } = updateTransaction
        try {
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("gameRounds")
                        .updateOne(
                            {
                                roundId: roundId,
                                brand: brand,
                                gameCode: gameCode,
                                playerId: playerId,
                                "transactions.rgsTransactionId": rgsTransactionId,
                            },
                            {
                                $set: {
                                    status: status,
                                    endDate: new Date(),
                                    "transactions.$.platformTransactionId": platformTransactionId,
                                    "transactions.$.responseTime": new Date(),
                                    "transactions.$.message": message,
                                },
                            },
                            function (error: any, data: unknown) {
                                error ? reject(error) : resolve(data);
                            }
                        );
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    recordProviderGameRoundMap: async (providerGameRoundMap: any) => {
        try {
            const getProviderGameRoundMap = await self.getProviderGameRoundMap(
                providerGameRoundMap
            );

            if (getProviderGameRoundMap?.data) {
                throw constants["ROUND_ALREADY_EXIST"];
            }
            providerGameRoundMap.insertDate = new Date();
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("providerGameRoundMap")
                        .insertOne(providerGameRoundMap, function (error: any, data: unknown) {
                            error ? reject(error) : resolve(data);
                        });
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },

    getProviderGameRoundMap: async (providerGameRoundMap: any) => {
        try {
            const myPromise = () => {
                return new Promise((resolve, reject) => {
                    mongo
                        .getDB()
                        .collection("providerGameRoundMap")
                        .findOne(
                            { gameRoundId: providerGameRoundMap.gameRoundId },
                            function (error: any, data: unknown) {
                                error ? reject(error) : resolve(data);
                            }
                        );
                });
            };
            const data = await myPromise();
            return { status: constants["DB_SUCCESS"], data: data };
        } catch (error) {
            return { status: constants["DB_ERROR"], message: error };
        }
    },
};

module.exports = self;
