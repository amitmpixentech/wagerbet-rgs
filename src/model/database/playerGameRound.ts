class PlayerGameRound {
  brand: any;
  gameCode: any;
  playerId: any;
  platformId: any;
  operatorId: any;
  aggregatorId: any;
  providerId: any;
  roundId: any;
  startDate: any;
  endDate: any;
  status: any;
  betAmount: any;
  winAmount: any;
  jpWinAmount: any;
  currencyCode: any;
  transactions: any;
  region: any;
  otherParams: any;

  constructor({
    brand = "",
    gameCode = "",
    playerId = "",
    platformId = "",
    operatorId = "",
    aggregatorId = "",
    providerId = "",
    roundId = "",
    startDate = "",
    endDate = "",
    status = "",
    betAmount = "",
    winAmount = "",
    jpWinAmount = "",
    currencyCode = "",
    transactions = "",
    region = "",
    otherParams = "",
  }) {
    this.brand = brand;
    this.gameCode = gameCode;
    this.playerId = playerId;
    this.platformId = platformId;
    this.operatorId = operatorId;
    this.aggregatorId = aggregatorId;
    this.providerId = providerId;
    this.roundId = roundId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.betAmount = betAmount;
    this.winAmount = winAmount;
    this.jpWinAmount = jpWinAmount;
    this.currencyCode = currencyCode;
    this.transactions = transactions; //Array
    this.region = region;
    this.otherParams = otherParams;
  }

  getPlayerRound() {
    return {
      brand: this.brand,
      gameCode: this.gameCode,
      playerId: this.playerId,
      platformId: this.platformId,
      operatorId: this.operatorId,
      aggregatorId: this.aggregatorId,
      providerId: this.providerId,
      roundId: this.roundId,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      betAmount: this.betAmount,
      winAmount: this.winAmount,
      jpWinAmount: this.jpWinAmount,
      currencyCode: this.currencyCode,
      transactions: this.transactions,
      region: this.region,
      otherParams: this.otherParams,
    };
  }
};

export default PlayerGameRound