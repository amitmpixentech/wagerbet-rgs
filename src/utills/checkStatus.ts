const _constants = require("../config/constants");

const checkStatus = (status: any) => {
  return (
    status == _constants["INSUFFICIENT_FUNDS"] ||
    status == _constants["INVALID_TOKEN"] ||
    status == _constants["INTERNAL_SERVER_ERROR"] ||
    status == _constants["USER_LOSS_LIMIT_EXCEEDED"] ||
    status == _constants["INVALID_REQUEST"] ||
    status == _constants["INVALID_USER"] ||
    status == _constants["INVALID_SIGNATURE"] ||
    status == _constants["USER_TIME_OUT_SET"] ||
    status == _constants["INVALID_STAKE"] ||
    status == _constants["DB_ERROR"] ||
    status == _constants["USER_SESSION_NOT_EXIST_CODE"]
  );
};
export default checkStatus;
