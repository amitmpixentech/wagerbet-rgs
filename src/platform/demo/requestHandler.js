const fetch = require("node-fetch");
const logger = require("../../logger/logger")(module);
const constants = require("./constants.json");

function handleRequest({
  path = "",
  baseUrl = "*******************",
  payload,
  merchantId,
}) {
  logger.info({
    text: { path },
    fn: "handleRequest",
  });

  const _options = {};

  const _url = (() => {
    let _path = path;

    if (_path[0] !== "/") _path = "/" + _path;

    return baseUrl + _path;
  })();

  if (payload) {
    _options.body = JSON.stringify(payload);
    logger.info({
      text: payload,
      fn: "handleRequest",
    });
  }

  const _handleError = (error) => {
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

  this.post = () => {
    if (path == "authentication") {
      return _fetch(_url, {
        method: "POST",
        headers: {
          Authorisation: payload?.token,
        },
      });
    } else {
      return _fetch(_url, {
        ..._options,
        method: "POST",
        headers: {
          merchantId: constants[merchantId],
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    }
  };
}

module.exports = handleRequest;
