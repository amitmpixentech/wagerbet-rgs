import { constants } from '../config/constants';

function isInvalidStatus(status: any) {
  return (
    status == constants['INSUFFICIENT_FUNDS'] ||
    status == constants['INVALID_TOKEN'] ||
    status == constants['INTERNAL_SERVER_ERROR'] ||
    status == constants['USER_LOSS_LIMIT_EXCEEDED'] ||
    status == constants['INVALID_REQUEST'] ||
    status == constants['INVALID_USER'] ||
    status == constants['INVALID_SIGNATURE'] ||
    status == constants['USER_TIME_OUT_SET'] ||
    status == constants['INVALID_STAKE'] ||
    status == constants['DB_ERROR'] ||
    status == constants['USER_SESSION_NOT_EXIST_CODE']
  );
}
export default isInvalidStatus;
