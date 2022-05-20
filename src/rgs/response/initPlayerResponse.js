module.exports = class InitPlayerResponse {
  constructor(status, playerName, balance, otherParams) {
    this.status = status;
    this.playerName = playerName;
    this.balance = balance;
    this.otherParams = otherParams;
  }
};
