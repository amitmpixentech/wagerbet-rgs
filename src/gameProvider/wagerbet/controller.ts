import express, { Request, Response, NextFunction } from 'express';
import _gameConstants from './constants.json';
import isInvalidStatus from '../../utills/isInvalidStatus';
import handler from './requestHandler';

const router = express.Router();
import { constants } from '../../config/constants';

router.post('/v2/init', authenticatePlayer);
router.post('/v2/bet', checkAmount, bet);
router.post('/v2/win', checkAmount, win);
router.post('/v2/balance', balance);

module.exports = router;

function authenticatePlayer(req: Request, res: Response, next: NextFunction) {
  if (!req?.body?.token) {
    const response = {
      message: _gameConstants['INVALID_TOKEN'],
    };
    res.status(400).send(response);
    return;
  }

  if (
    !req?.body?.extraData?.region ||
    isNaN(req?.body?.extraData?.platformId) ||
    !req?.body?.extraData?.operatorId ||
    !req?.body?.extraData?.brand ||
    !req?.body?.extraData?.currencyCode ||
    !req?.body?.extraData?.language ||
    !req?.body?.extraData?.gameCode ||
    !req?.body?.extraData?.playerId
  ) {
    const response = {
      message: _gameConstants['INVALID_PKT'],
    };
    res.status(400).send(response);
    return;
  }

  handler
    .authenticatePlayer(
      {
        token: req?.body?.token,
        brand: req?.body?.extraData?.brand,
        platformId: req?.body?.extraData?.platformId,
        operatorId: req?.body?.extraData?.operatorId,
        region: req?.body?.extraData?.region,
        aggregatorId: '',
        providerId: '',
      },
      {
        currencyCode: req?.body?.extraData?.currencyCode,
        language: req?.body?.extraData?.language,
        gameCode: req?.body?.extraData?.gameCode,
        playerId: req?.body?.extraData?.playerId,
      },
    )
    .then((response: { status: any; message: any }) => {
      res.header('Content-Type', 'application/json');
      if (isInvalidStatus(response?.status)) {
        res.status(400).send({ message: response.message });
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => next(err));
}

function checkAmount(req: Request, res: Response, next: NextFunction) {
  if (isNaN(+req?.body?.amount)) {
    const response = {
      message: _gameConstants['INVALID_AMOUNT'],
    };
    res.status(400).send(response);
    return;
  }
  next();
}

function bet(req: Request, res: Response, next: NextFunction) {
  if (
    !req?.body?.token ||
    !req?.body?.amount ||
    !req?.body?.transactionId ||
    !req?.body?.extraData?.playerId ||
    !req?.body?.extraData?.currencyCode ||
    !req?.body?.roundId ||
    !req?.body?.extraData?.gameCode ||
    !req?.body?.extraData?.brand ||
    isNaN(req?.body?.extraData?.platformId) ||
    !req?.body?.extraData?.operatorId
  ) {
    const response = {
      message: _gameConstants['INVALID_PKT'],
    };
    res.status(400).send(response);
    return;
  }
  handler
    .bet(
      {
        playerId: req?.body?.extraData?.playerId,
        token: req?.body?.token,
        brand: req?.body?.extraData?.brand,
        transactionId: req?.body?.transactionId,
        amount: req?.body?.amount * 100,
        gameCode: req?.body?.extraData?.gameCode,
        currencyCode: req?.body?.extraData?.currencyCode,
        roundId: req?.body?.roundId,
        platformId: req?.body?.extraData?.platformId,
        operatorId: req?.body?.extraData?.operatorId,
        aggregatorId: '',
        providerId: '',
        transactionType: constants?.bet,
        referenceTransactionId: '',
      },
      {
        language: req?.body?.extraData?.language,
      },
    )
    .then((response: any) => {
      res.header('Content-Type', 'application/json');
      if (isInvalidStatus(response?.status)) {
        res.status(400).send({ message: response.message });
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => next(err));
}

function win(req: Request, res: Response, next: NextFunction) {
  if (
    !req?.body?.extraData?.playerId ||
    !req?.body?.token ||
    !req?.body?.amount ||
    !req?.body?.transactionId ||
    !req?.body?.extraData?.currencyCode ||
    !req?.body?.roundId ||
    !req?.body?.extraData?.gameCode ||
    !req?.body?.extraData?.brand ||
    isNaN(req?.body?.extraData?.platformId) ||
    !req?.body?.extraData?.operatorId
  ) {
    const response = {
      message: _gameConstants['INVALID_PKT'],
    };
    res.status(400).send(response);
    return;
  }
  handler
    .win(
      {
        playerId: req?.body?.extraData?.playerId,
        token: req?.body?.token,
        brand: req?.body?.extraData?.brand,
        transactionId: req?.body?.transactionId,
        amount: req?.body?.amount * 100,
        gameCode: req?.body?.extraData?.gameCode,
        currencyCode: req?.body?.extraData?.currencyCode,
        roundId: req?.body?.roundId,
        platformId: req?.body?.extraData?.platformId,
        operatorId: req?.body?.extraData?.operatorId,
        aggregatorId: '',
        providerId: '',
        transactionType: constants?.win,
        referenceTransactionId: '',
      },
      {
        language: req?.body?.extraData?.language,
      },
    )
    .then((response: any) => {
      res.header('Content-Type', 'application/json');
      if (isInvalidStatus(response?.status)) {
        res.status(400).send({ message: response.message });
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => next(err));
}

function balance(req: Request, res: Response, next: NextFunction) {
  if (
    !req?.body?.token ||
    !req?.body?.extraData?.playerId ||
    !req?.body?.extraData?.currencyCode ||
    !req?.body?.extraData?.brand ||
    isNaN(req?.body?.extraData?.platformId) ||
    !req?.body?.extraData?.operatorId ||
    !req?.body?.extraData?.gameCode
  ) {
    const response = { message: _gameConstants['INVALID_PKT'] };
    res.status(400).send(response);
    return;
  }
  handler
    .balance({
      playerId: req?.body?.extraData?.playerId,
      token: req?.body?.token,
      brand: req?.body?.extraData?.brand,
      transactionId: '',
      amount: '',
      gameCode: req?.body?.extraData?.gameCode,
      currencyCode: req?.body?.extraData?.currencyCode,
      roundId: '',
      platformId: req?.body?.extraData?.platformId,
      operatorId: req?.body?.extraData?.operatorId,
      aggregatorId: '',
      providerId: '',
      transactionType: constants?.balance,
      referenceTransactionId: '',
    })
    .then((response: any) => {
      res.header('Content-Type', 'application/json');
      if (isInvalidStatus(response?.status)) {
        res.status(400).send({ message: response.message });
      } else {
        res.status(200).send(response);
      }
    })
    .catch((err: any) => next(err));
}
