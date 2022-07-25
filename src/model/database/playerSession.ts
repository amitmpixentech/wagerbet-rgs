class PlayerSession {
  playerId: any;
  token: any;
  brand: any;
  playerName: any;
  currencyCode: any;
  platformId: any;
  operatorId: any;
  aggregatorId: any;
  providerId: any;
  region: any;
  balance: any;
  status: any;
  otherParams: any;

  constructor({
    playerId = "",
    token = "",
    brand = "",
    playerName = "",
    currencyCode = "",
    platformId = "",
    operatorId = "",
    aggregatorId = "",
    providerId = "",
    region = "",
    balance = "",
    status = "",
    otherParams = "",
  }) {
    this.playerId = playerId;
    this.token = token;
    this.brand = brand;
    this.playerName = playerName;
    this.currencyCode = currencyCode;
    this.platformId = platformId;
    this.operatorId = operatorId;
    this.aggregatorId = aggregatorId;
    this.providerId = providerId;
    this.region = region;
    this.balance = balance;
    this.status = status;
    this.otherParams = otherParams;
  }

  getPlayerSession() {
    return {
      playerId: this.playerId,
      token: this.token,
      brand: this.brand,
      playerName: this.playerName,
      currencyCode: this.currencyCode,
      platformId: this.platformId,
      operatorId: this.operatorId,
      aggregatorId: this.aggregatorId,
      providerId: this.providerId,
      region: this.region,
      balance: this.balance,
      status: this.status,
      otherParams: this.otherParams,
    };
  }
};

export default PlayerSession;