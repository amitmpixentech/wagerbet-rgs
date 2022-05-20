const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json } = format;

const loggerInit = () => {
  return createLogger({
    level: "info",
    format: combine(timestamp(), json()),

    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(),
      new transports.File({
        filename: "sample.log",
      }),
    ],
  });
};
const logger = loggerInit();

export default logger;
