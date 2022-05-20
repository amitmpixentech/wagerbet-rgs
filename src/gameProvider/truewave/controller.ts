import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
const handler = require("./requestHandler");
const constants = require("../../config/constants");

router.post("/v2/init", authenticatePlayer);
router.post("/v2/bet", bet);
router.post("/v2/win", win);
router.post("/v2/balance", balance);

export default router;

function authenticatePlayer(req: Request, res: Response, next: NextFunction) {
  if (!req.body.token) {
    const response = {
      message: "Token invalid.",
    };
    res.status(400).send(response);
    return;
  }
  if (
    !req.body.extraData ||
    !req.body.extraData.region ||
    !req.body.extraData.platformId ||
    !req.body.extraData.operatorId ||
    !req.body.extraData.brand
  ) {
    const response = {
      message: "Invalid PKT. Method element expected",
    };
    res.status(400).send(response);
    return;
  }
  handler
    .authenticatePlayer({
      token: req.body.token,
      brand: req.body.extraData.brand,
      platformId: constants[req.body.extraData.platformId],
      operatorId: req.body.extraData.operatorId,
      region: req.body.extraData.region,
      aggregatorId: "",
      providerId: "",
    })
    .then((response: any) => {
      res.header("Content-Type", "application/json");
      res.status(200).send(response);
    })
    .catch((err: any) => next(err));
}

function bet(req: Request, res: Response, next: NextFunction) {
  if (
    !req.body.playerId ||
    !req.body.token ||
    !req.body.amount ||
    !req.body.transactionId ||
    !req.body.gameCode ||
    !req.body.currency ||
    !req.body.roundId ||
    !req.body.extraData ||
    !req.body.extraData.brand ||
    !req.body.extraData.platformId ||
    !req.body.extraData.operatorId
  ) {
    const response = {
      message: "Invalid PKT. Method element expected",
    };
    res.status(400).send(response);
    return;
  }
  handler
    .bet({
      playerId: req.body.playerId,
      token: req.body.token,
      brand: req.body.extraData.brand,
      transactionId: req.body.transactionId,
      amount: req.body.amount * 100,
      gameCode: req.body.gameCode,
      currencyCode: req.body.currency,
      roundId: req.body.roundId,
      platformId: constants[req.body.extraData.platformId],
      operatorId: req.body.extraData.operatorId,
      aggregatorId: "",
      providerId: "",
      transactionType: constants.bet,
      referenceTransactionId: "",
    })
    .then((response: any) => {
      res.header("Content-Type", "application/json");
      res.status(200).send(response);
    })
    .catch((err: any) => next(err));
}

function win(req: Request, res: Response, next: NextFunction) {
  if (
    !req.body.playerId ||
    !req.body.token ||
    !req.body.amount ||
    !req.body.transactionId ||
    !req.body.gameCode ||
    !req.body.currency ||
    !req.body.roundId ||
    !req.body.extraData ||
    !req.body.extraData.brand ||
    !req.body.extraData.platformId ||
    !req.body.extraData.operatorId
  ) {
    const response = {
      message: "Error description",
    };
    res.status(400).send(response);
    return;
  }
  handler
    .win({
      playerId: req.body.playerId,
      token: req.body.token,
      brand: req.body.extraData.brand,
      transactionId: req.body.transactionId,
      amount: req.body.amount * 100,
      gameCode: req.body.gameCode,
      currencyCode: req.body.currency,
      roundId: req.body.roundId,
      platformId: constants[req.body.extraData.platformId],
      operatorId: req.body.extraData.operatorId,
      aggregatorId: "",
      providerId: "",
      transactionType: constants.win,
      referenceTransactionId: "",
    })
    .then((response: any) => {
      res.header("Content-Type", "application/json");
      res.status(200).send(response);
    })
    .catch((err: any) => next(err));
}

function balance(req: Request, res: Response, next: NextFunction) {
  if (
    !req.body.playerId ||
    !req.body.token ||
    !req.body.currency ||
    !req.body.extraData ||
    !req.body.extraData.brand ||
    !req.body.extraData.platformId ||
    !req.body.extraData.operatorId
  ) {
    const response = { message: "user doesn’t exists." };
    res.status(400).send(response);
    return;
  }
  handler
    .balance({
      playerId: req.body.playerId,
      token: req.body.token,
      brand: req.body.extraData.brand,
      transactionId: "",
      amount: "",
      gameCode: "",
      currencyCode: req.body.currency,
      roundId: "",
      platformId: constants[req.body.extraData.platformId],
      operatorId: req.body.extraData.operatorId,
      aggregatorId: "",
      providerId: "",
      transactionType: constants.balance,
      referenceTransactionId: "",
    })
    .then((response: any) => {
      res.header("Content-Type", "application/json");
      res.status(200).send(response);
    })
    .catch((err: any) => next(err));
}
