class TransactionResponse {
  status: any;
  message: any;
  playerName: any;
  balance: any;
  currencyCode: any;
  otherParams: any;

  constructor({ status = '', message = '', playerName = '', balance = '', currencyCode = '', otherParams = '' }: any) {
    this.status = status;
    this.message = message;
    this.playerName = playerName;
    this.balance = balance;
    this.currencyCode = currencyCode;
    this.otherParams = otherParams;
  }
}

export default TransactionResponse;
