module.exports = class InitPlayerRequest {
    constructor(playerId, token,gameCode, brand, playerName, currencyCode, platformId, operatorId, region) {
        this.playerId = playerId;
        this.token = token;
        this.gameCode = gameCode;
        this.brand = brand;
        this.playerName = playerName;
        this.currencyCode = currencyCode;
        this.platformId = platformId;
        this.operatorId = operatorId;
        this.region = region;
    }
}
