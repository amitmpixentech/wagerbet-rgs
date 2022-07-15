class AuthenticatePlayerResponse {

  status: any;
  playerId: any;
  playerName: any;
  currencyCode: any;
  balance: any;
  otherParams: any;

  constructor(
    status = "",
    playerId = "",
    playerName = "",
    currencyCode = "",
    balance = "",
    otherParams = ""
  ) {
    this.status = status;
    this.playerId = playerId;
    this.playerName = playerName;
    this.currencyCode = currencyCode;
    this.balance = balance;
    this.otherParams = otherParams;
  }
};

export default AuthenticatePlayerResponse