module.exports = class AuthenticatePlayerRequest {
  constructor({
    token,
    brand,
    platformId,
    operatorId,
    region,
    aggregatorId,
    providerId,
  }) {
    this.token = token;
    this.brand = brand;
    this.platformId = platformId;
    this.operatorId = operatorId;
    this.region = region;
    this.aggregatorId = aggregatorId;
    this.providerId = providerId;
  }
};
