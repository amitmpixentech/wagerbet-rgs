import { PlayerSession } from '../orm/entities/PlayerSession';
import { dataSource } from '../orm/ormconfig';
import { constants } from '../config/constants';
import { GameRound, ITransaction } from '../orm/entities/GameRound';
import { ProviderGameRoundMap } from '../orm/entities/ProviderGameRoundMap';

const self = {
  savePlayerSession: async (savePlayerSession: { playerSession: PlayerSession }) => {
    const { playerSession } = savePlayerSession;
    try {
      const PlayerSessionModel = dataSource.getRepository(PlayerSession);
      const data = await PlayerSessionModel.insert(playerSession);
      return { status: constants['DB_SUCCESS'], data: data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  getPlayerSession: async (getPlayerSession: { token: any; brand: any }) => {
    const { token, brand } = getPlayerSession;
    try {
      const PlayerSessionModel = dataSource.getRepository(PlayerSession);
      const data = await PlayerSessionModel.findOneBy({ token, brand });
      return { status: constants['DB_SUCCESS'], data: data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  getGameRoundId: async (getGameRoundId: { roundId: any; brand: any; gameCode: any; playerId: any }) => {
    const { roundId, brand, gameCode, playerId } = getGameRoundId;
    try {
      const GameRoundModel = dataSource.getRepository(GameRound);
      const data = await GameRoundModel.findOneBy({
        roundId: roundId,
        brand: brand,
        gameCode: gameCode,
        playerId: playerId,
      });
      return { status: constants['DB_SUCCESS'], data: data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  getRoundForPlacedBet: async (getRoundForPlacedBet: { roundId: any; brand: any; gameCode: any; playerId: any }) => {
    const { roundId, brand, gameCode, playerId } = getRoundForPlacedBet;
    try {
      const GameRoundModel = dataSource.getRepository(GameRound);
      const query = GameRoundModel.createQueryBuilder('gr')
        .select()
        .where(
          'gr.roundId = :roundId and gr.brand = :brand and gr.gameCode = :gameCode and gr.playerId = :playerId and gr.transactions ::jsonb @> :transactions',
          {
            roundId,
            brand,
            gameCode,
            playerId,
            transactions: JSON.stringify([{ transactionType: 'BET' }]),
          },
        );
      const data = await query.getOne();
      return { status: constants['DB_SUCCESS'], data: data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  insertGameRoundIfDoesNotExist: async (insertGameRoundIfDoesNotExist: {
    roundId: any;
    brand: any;
    gameCode: any;
    playerId: any;
    platformId: any;
    operatorId: any;
    aggregatorId: any;
    providerId: any;
    currencyCode: any;
    region: any;
    status: any;
  }) => {
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
    } = insertGameRoundIfDoesNotExist;
    try {
      const gameRound = await self.getGameRoundId({
        roundId,
        brand,
        gameCode,
        playerId,
      });
      let gameRoundId: number = null;
      if (!gameRound['data']) {
        const GameRoundModel = dataSource.getRepository(GameRound);
        const data = await GameRoundModel.insert({
          brand: brand,
          gameCode: gameCode,
          playerId: playerId,
          platformId: platformId,
          operatorId: operatorId,
          aggregatorId: aggregatorId,
          providerId: providerId,
          roundId: roundId,
          startDate: new Date(),
          endDate: null,
          status: status,
          betAmount: 0,
          winAmount: 0,
          jpWinAmount: 0,
          refundAmount: 0,
          currencyCode: currencyCode,
          transactions: [],
          region: region,
          otherParams: {},
        });
        gameRoundId = data.generatedMaps[0].id;
      } else {
        gameRoundId = gameRound.data.id;
      }

      return { status: constants.DB_SUCCESS, data: { gameRoundId } };
    } catch (error) {
      throw new Error(error);
    }
  },

  recordTransaction: async ({
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
  }): Promise<{ status: number; data?: GameRound; message?: string }> => {
    try {
      if (transactionType === 'WIN') {
        const getRoundIfBetPlaced = await self.getRoundForPlacedBet({
          roundId,
          brand,
          gameCode,
          playerId,
        });
        if (!getRoundIfBetPlaced) {
          throw constants['PLAYER_BET_NOT_FOUND_FOR_THIS_ROUND'];
        }
      }
      const gameRound = await self.insertGameRoundIfDoesNotExist({
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

      const gameRoundDbId = gameRound.data.gameRoundId;

      const transaction: ITransaction = {
        rgsTransactionId,
        platformTransactionId: '',
        amount,
        transactionType: transactionType,
        requestTime: new Date(),
        responseTime: null,
        message: '',
      };

      let incrQuery: any = {};
      if (transactionType === constants['bet']) {
        incrQuery['betAmount'] = () => `bet_amount + ${amount}`;
      }
      if (transactionType === constants['win']) {
        incrQuery['winAmount'] = () => `win_amount + ${amount}`;
      }
      if (transactionType === constants['refund']) {
        incrQuery['refundAmount'] = () => `refund_amount + ${amount}`;
      }

      const GameRoundModel = dataSource.getRepository(GameRound);
      const query = GameRoundModel.createQueryBuilder()
        .update(GameRound)
        .set({ status, transactions: () => `transactions || '${JSON.stringify(transaction)}' ::jsonb`, ...incrQuery })
        .where('id = :id', { id: gameRoundDbId });

      const data = await query.returning('*').execute();

      return { status: constants['DB_SUCCESS'], data: data.raw[0] };
    } catch (error) {
      console.log('error: ', error);
      return { status: constants['DB_ERROR'], message: error.message || error };
    }
  },

  updateTransaction: async (updateTransaction: {
    roundId: any;
    rgsTransactionId: any;
    brand: any;
    gameCode: any;
    playerId: any;
    platformTransactionId: any;
    message: any;
    status: any;
    gameRoundDbID: number;
  }) => {
    const { rgsTransactionId, platformTransactionId, message, status, gameRoundDbID } = updateTransaction;
    try {
      const today = new Date();
      const _platformTransactionId = platformTransactionId || '';
      const data = await dataSource.query(
        `WITH "unique_transaction" AS 
      (select ('{'||index-1||',platformTransactionId}')::text[] as platformTransactionIdPath,
              ('{'||index-1||',message}')::text[] as messagePath,
              ('{'||index-1||',responseTime}')::text[] as responseTimePath
          from game_rounds,
              jsonb_array_elements (transactions) with ordinality arr(transaction, index)
          where transaction->>'rgsTransactionId' = '${rgsTransactionId}' and id = ${gameRoundDbID})
  UPDATE "game_rounds" SET "status" = ${status}, "end_date" = '${today.toISOString()}',
                      "transactions" = jsonb_set(
                          jsonb_set(
                              jsonb_set(transactions, unique_transaction.platformTransactionIdPath, '"${_platformTransactionId}"', false),
                              unique_transaction.responseTimePath, '"${today.toISOString()}"'
                          ),unique_transaction.messagePath, '"${message}"',false),
         "updated_at" = CURRENT_TIMESTAMP  from unique_transaction WHERE "id" = ${gameRoundDbID} RETURNING *;`,
      );
      return { status: constants['DB_SUCCESS'], data: data[0][0] };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  recordProviderGameRoundMap: async (providerGameRoundMap: ProviderGameRoundMap) => {
    try {
      const getProviderGameRoundMap = await self.getProviderGameRoundMap(providerGameRoundMap);

      if (getProviderGameRoundMap?.data) {
        throw constants['ROUND_ALREADY_EXIST'];
      }

      const ProviderGameRoundMapModel = dataSource.getRepository(ProviderGameRoundMap);
      const data = await ProviderGameRoundMapModel.save(providerGameRoundMap);

      return { status: constants['DB_SUCCESS'], data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },

  getProviderGameRoundMap: async (providerGameRoundMap: any) => {
    try {
      const ProviderGameRoundMapModel = dataSource.getRepository(ProviderGameRoundMap);
      const data = await ProviderGameRoundMapModel.findOneBy({ gameRoundId: providerGameRoundMap.gameRoundId });
      return { status: constants['DB_SUCCESS'], data };
    } catch (error) {
      return { status: constants['DB_ERROR'], message: error };
    }
  },
};

export default self;
