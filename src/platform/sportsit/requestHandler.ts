import fetch from "node-fetch";
import logger from "../../logger/logger";
const constants = require("./constants.json");

function handleRequest({
  path = "",
  baseUrl = "https://dev.platform-pps.sportsit-tech.net/rgs",
  payload,
}) {
  logger.info("path", { path });
  const _options = {};

  const _url = (() => {
    let _path = path;

    if (_path[0] !== "/") _path = "/" + _path;

    return baseUrl + _path;
  })();

  if (payload) {
    _options.body = JSON.stringify(payload);
    logger.debug("payload", payload);
  }

  const _handleError = (error) => {
    console.error(error);
    throw error;
  };

  const _fetch = async (...args) => {
    try {
      const response = await fetch(...args);
      const responseJson = await response.json();

      return { ...responseJson };
    } catch (error) {
      _handleError(error);
    }
  };

  //POST request to remote service

  this.post = () =>
    _fetch(_url, {
      ..._options,
      method: "POST",
      headers: {
        merchantId: constants.merchant_id,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
}

module.exports = handleRequest;
