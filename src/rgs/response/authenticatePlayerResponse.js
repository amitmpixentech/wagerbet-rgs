module.exports = class AuthenticatePlayerResponse {
  constructor(
    status,
    playerId,
    playerName,
    currencyCode,
    balance,
    otherParams
  ) {
    this.status = status;
    this.playerId = playerId;
    this.playerName = playerName;
    this.currencyCode = currencyCode;
    this.balance = balance;
    this.otherParams = otherParams;
  }
};
