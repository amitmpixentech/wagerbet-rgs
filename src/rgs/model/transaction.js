module.exports = class Transaction {
    constructor(rgsTransactionId, platformTransactionId, amount, transactionType, requestTime, responseTime, message) {
        this.rgsTransactionId = rgsTransactionId;
        this.platformTransactionId = platformTransactionId;
        this.amount = amount;
        this.transactionType = transactionType;
        this.requestTime = requestTime;
        this.responseTime = responseTime;
        this.message = message;
    }

    getTransaction() {
        return {
            rgsTransactionId: this.rgsTransactionId,
            platformTransactionId: this.platformTransactionId,
            amount: this.amount,
            transactionType: this.transactionType,
            requestTime: this.requestTime,
            responseTime: this.responseTime,
            message: this.message
        }
    }
}
