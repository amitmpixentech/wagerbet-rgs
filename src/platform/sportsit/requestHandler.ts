import fetch from "node-fetch";
import { logger } from './../../logger/logger';
const constants = require("./constants.json");
const log = logger(module)

interface _options {
  [key: string]: any
}

export function handleRequest({
  path = "",
  baseUrl = "https://dev.platform-pps.sportsit-tech.net/rgs",
  payload,
}: any) {
  log.info("path", { path });

  const _options: _options = {};

  const _url = (() => {
    let _path = path;

    if (_path[0] !== "/") _path = "/" + _path;

    return baseUrl + _path;
  })();

  if (payload) {
    _options.body = JSON.stringify(payload);
    log.debug("payload", payload);
  }

  const _handleError = (error: any) => {
    console.error(error);
    throw error;
  };

  const _fetch = async (...args: any) => {
    try {
      // @ts-ignore
      const response = await fetch(...args);
      const responseJson = await response.json();
      // @ts-ignore
      return { ...responseJson };
    } catch (error) {
      _handleError(error);
    }
  };

  //POST request to remote service
  // @ts-ignore
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

