interface AuthenticatePlayer {
  status?: any;
  message?: any,
  playerId?: any;
  playerName?: any;
  currencyCode?: any;
  balance?: any;
  otherParams?: any;
}
class AuthenticatePlayerResponse implements AuthenticatePlayer {
  status = ""; message = ""; playerId = ""; playerName = ""; currencyCode = ""; balance = ""; otherParams = "";

  constructor({ status = "", message = "", playerId = "", playerName = "", currencyCode = "", balance = "", otherParams = "" }) {
    this.status = status;
    this.message = message;
    this.playerId = playerId;
    this.playerName = playerName;
    this.currencyCode = currencyCode;
    this.balance = balance;
    this.otherParams = otherParams;
  }
};

export default AuthenticatePlayerResponse
