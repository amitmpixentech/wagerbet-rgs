module.exports = class TransactionRequest {
  constructor({
    playerId,
    token,
    brand,
    transactionId,
    amount,
    gameCode,
    currencyCode,
    roundId,
    platformId,
    operatorId,
    aggregatorId,
    providerId,
    transactionType,
    referenceTransactionId,
  }) {
    this.playerId = playerId;
    this.token = token;
    this.brand = brand;
    this.transactionId = transactionId;
    this.amount = amount;
    this.gameCode = gameCode;
    this.currencyCode = currencyCode;
    this.roundId = roundId;
    this.platformId = platformId;
    this.operatorId = operatorId;
    this.aggregatorId = aggregatorId;
    this.providerId = providerId;
    this.transactionType = transactionType;
    this.referenceTransactionId = referenceTransactionId;
  }
};
