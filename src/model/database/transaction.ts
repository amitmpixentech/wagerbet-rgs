import { ITransaction } from '../../orm/entities/GameRound';

class Transaction {
  rgsTransactionId: any;
  platformTransactionId: any;
  amount: any;
  transactionType: any;
  requestTime: any;
  responseTime: any;
  message: any;

  constructor({
    rgsTransactionId = '',
    platformTransactionId = '',
    amount = null,
    transactionType = '',
    requestTime = null,
    responseTime = null,
    message = '',
  }: ITransaction) {
    this.rgsTransactionId = rgsTransactionId;
    this.platformTransactionId = platformTransactionId;
    this.amount = amount;
    this.transactionType = transactionType;
    this.requestTime = requestTime;
    this.responseTime = responseTime;
    this.message = message;
  }

  getTransaction(): ITransaction {
    return {
      rgsTransactionId: this.rgsTransactionId,
      platformTransactionId: this.platformTransactionId,
      amount: this.amount,
      transactionType: this.transactionType,
      requestTime: this.requestTime,
      responseTime: this.responseTime,
      message: this.message,
    };
  }
}

export default Transaction;
