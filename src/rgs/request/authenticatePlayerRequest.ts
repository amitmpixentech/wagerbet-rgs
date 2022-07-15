class AuthenticatePlayerRequest {
  token: any;
  brand: any;
  platformId: any;
  operatorId: any;
  region: any;
  aggregatorId: any;
  providerId: any;
  constructor({
    token = "",
    brand = "",
    platformId = "",
    operatorId = "",
    region = "",
    aggregatorId = "",
    providerId = "",
  }) {
    this.token = token;
    this.brand = brand;
    this.platformId = platformId;
    this.operatorId = operatorId;
    this.region = region;
    this.aggregatorId = aggregatorId;
    this.providerId = providerId;
  }
}

export default AuthenticatePlayerRequest;
