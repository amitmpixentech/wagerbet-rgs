import isInvalidStatus from '../../utills/isInvalidStatus';
import { dataSource } from '../../orm/ormconfig';
import { User } from '../../orm/entities/User';

import { constants } from '../../config/constants';

function handleRequest(handleRequest: { path: string; payload: any }) {
  const { path, payload } = handleRequest;
  return {
    post: async () => {
      const user = await getUser(payload);
      let res: { status: number; data?: User; message?: string };

      switch (path) {
        case 'authentication':
          if (isInvalidStatus(user.status)) {
            return {
              balance: '',
              currencyCode: '',
              languageCode: '',
              message: 'Internal Error',
              statusId: user.status,
              playerId: '',
              userName: '',
            };
          }

          const data: any = user?.data;
          if (!data) {
            await addUser(payload);
          }
          return {
            balance: data?.balance || constants['demoBalance'],
            currencyCode: payload['currencyCode'],
            languageCode: payload['languageCode'],
            message: '',
            statusId: 1000,
            playerId: payload['playerId'],
            userName: payload['playerId'],
          };
        case 'bet':
        case 'win':
          if (isInvalidStatus(user.status) || !user.data) {
            return {
              balance: '',
              currencyCode: '',
              languageCode: '',
              message: 'User Not found',
              statusId: 1001,
              playerId: '',
              userName: '',
            };
          }
          res = await betWin(payload, user.data);
          return {
            balance: res.data.balance,
            currencyCode: payload['currencyCode'],
            languageCode: payload['languageCode'],
            message: '',
            statusId: 1000,
            playerId: payload['playerId'],
            userName: payload['playerId'],
          };
        // case 'win':
        //   if (isInvalidStatus(user.status) || user.data) {
        //     return {
        //       balance: '',
        //       currencyCode: '',
        //       languageCode: '',
        //       message: 'User Not found',
        //       statusId: 1001,
        //       playerId: '',
        //       userName: '',
        //     };
        //   }
        //   await betWin(payload, user.data);
        //   var updateUser: any = await getUser(payload);
        //   return {
        //     balance: updateUser.data.balance,
        //     currencyCode: payload['currencyCode'],
        //     languageCode: payload['languageCode'],
        //     message: '',
        //     statusId: 1000,
        //     playerId: payload['playerId'],
        //     userName: payload['playerId'],
        //   };
        case 'REFUND':
          if (isInvalidStatus(user.status) || user.data) {
            return {
              balance: '',
              currencyCode: '',
              languageCode: '',
              message: 'User Not found',
              statusId: 1001,
              playerId: '',
              userName: '',
            };
          }
          res = await betWin(payload, user.data);
          return {
            balance: res.data.balance,
            token: '',
            transactionId: Math.floor(Math.random() * 1000000000),
            platformTransactionId: Math.floor(Math.random() * 1000000000),
            amount: payload['amount'],
            gameReference: payload['gameCode'],
            roundId: payload['roundId'],
            message: payload['message'],
            alreadyProcessed: false,
            statusId: 0,
            playerId: payload['playerId'],
            userName: payload['playerId'],
          };
        case 'balance':
          return {
            balance: constants['demoBalance'],
            currencyCode: payload['currencyCode'],
            languageCode: payload['languageCode'],
            message: '',
            statusId: 0,
            playerId: payload['playerId'],
            userName: payload['playerId'],
          };
        default:
          break;
      }
    },
  };
}

async function getUser(payload: { playerId?: any }) {
  const { playerId } = payload;
  try {
    const UserModel = dataSource.getRepository(User);
    var data = await UserModel.findOneBy({ playerId });

    return { status: constants['DB_SUCCESS'], data: data };
  } catch (error) {
    return { status: constants['DB_ERROR'], message: error };
  }
}

async function addUser(payload: { currencyCode?: any; languageCode?: any; playerId?: any }) {
  const { currencyCode, languageCode, playerId } = payload;
  try {
    const UserModel = dataSource.getRepository(User);
    const data = await UserModel.insert({
      balance: constants['demoBalance'],
      currencyCode: currencyCode,
      languageCode: languageCode,
      playerId: playerId,
      userName: playerId,
    });

    return { status: constants['DB_SUCCESS'], data: data };
  } catch (error) {
    return { status: constants['DB_ERROR'], message: error };
  }
}

async function betWin(payload: { playerId?: any; amount?: any }, user: User) {
  const { playerId, amount } = payload;
  try {
    const UserModel = dataSource.getRepository(User);

    const data = await UserModel.save({
      ...user,
      balance: user.balance - amount,
    });

    return { status: constants['DB_SUCCESS'], data };
  } catch (error) {
    return { status: constants['DB_ERROR'], message: error };
  }
}

module.exports = handleRequest;
