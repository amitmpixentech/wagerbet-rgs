module.exports = class TransactionResponse {
  constructor({
    status,
    message,
    playerName,
    balance,
    currencyCode,
    rgsTransactionId,
    platformTransactionId,
    otherParams,
  }) {
    this.status = status;
    this.message = message;
    this.playerName = playerName;
    this.balance = balance;
    this.currencyCode = currencyCode;
    this.rgsTransactionId = rgsTransactionId;
    this.platformTransactionId = platformTransactionId;
    this.otherParams = otherParams;
  }
};
