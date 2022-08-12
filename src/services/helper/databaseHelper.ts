import { constants } from '../../config/constants';
import isInvalidStatus from "../../utills/isInvalidStatus";
import rgsDatabaseService from "../databaseService";

class DatabaseHelper {
    public async recordTransaction(recordRequest: any) {
        const {
            transactionRequest,
            playerSession,
            rgsTransactionId,
        } = recordRequest
        let transactionRecordData = {
            roundId: transactionRequest["roundId"],
            rgsTransactionId: rgsTransactionId,
            amount: transactionRequest["amount"],
            transactionType: transactionRequest["transactionType"],
            brand: transactionRequest["brand"],
            gameCode: transactionRequest["gameCode"],
            playerId: playerSession["data"]["playerId"],
            platformId: transactionRequest["platformId"],
            operatorId: transactionRequest["operatorId"],
            aggregatorId: transactionRequest["aggregatorId"],
            providerId: transactionRequest["providerId"],
            currencyCode: transactionRequest["currencyCode"],
            region: transactionRequest["region"],
            status: null,
        };

        if (transactionRequest["transactionType"] == constants["bet"]) {
            transactionRecordData["status"] = constants["DEBIT_INITIATED_STATUS"];
        } else if (transactionRequest["transactionType"] == constants["win"]) {
            transactionRecordData["status"] = constants["CREDIT_INITIATED_STATUS"];
        } else if (transactionRequest["transactionType"] == constants["refund"]) {
            transactionRecordData["status"] = constants["ROLLBACK_MANUAL_STATUS"];
        }

        return await rgsDatabaseService.recordTransaction(transactionRecordData);
    }

    public async updateTransaction (updateRequest: any) {
        const {
            transactionRequest,
            rgsTransactionId,
            playerSession,
            transactionResponse,
            gameRoundDbID
        } = updateRequest
        let updateTransactionData = {
            roundId: transactionRequest["roundId"],
            rgsTransactionId: rgsTransactionId,
            brand: transactionRequest["brand"],
            gameCode: transactionRequest["gameCode"],
            playerId: playerSession["data"]["playerId"],
            platformTransactionId: transactionResponse["platformTransactionId"],
            message: transactionResponse["message"],
            gameRoundDbID,
            status: null,
        };

        switch (transactionRequest["transactionType"]) {
            case constants["bet"]:
                isInvalidStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] = constants["DEBIT_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["DEBIT_COMPLETED_STATUS"]);
                break;
            case constants["win"]:
                isInvalidStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] =
                        constants["CREDIT_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["CREDIT_COMPLETED_STATUS"]);
                break;
            case constants["refund"]:
                isInvalidStatus(transactionResponse["status"])
                    ? (updateTransactionData["status"] =
                        constants["ROLLBACK_FAILED_STATUS"])
                    : (updateTransactionData["status"] =
                        constants["ROLLBACK_SUCCESS_STATUS"]);
                break;
            default:
        }

        return await rgsDatabaseService.updateTransaction(updateTransactionData);
    }
}

export default new DatabaseHelper();