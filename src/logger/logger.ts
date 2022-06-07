const winston = require("winston");
const path = require("path");
const { combine, timestamp, label, printf } = winston.format;

const getLabel = function (module: any) {
  const parts = module.filename.split(path.sep);
  return parts[parts.length - 2] + path.sep + parts.pop();
};

const customFormat = printf((data: { message: { [x: string]: any; }; level: any; timestamp: any; label: any; }) => {
  if (data.message && typeof data.message === "object") {
    return `${data.level}: ${data.timestamp} [${data.label} - ${data.message["fn"]
      }()] ${JSON.stringify(data.message["text"])}`;
  } else {
    return `${data.level}: ${data.timestamp} [${data.label}] ${data.message}`;
  }
});

const getLogger = function (module: any) {
  return new winston.createLogger({
    format: combine(
      label({ label: getLabel(module) }),
      timestamp(),
      customFormat
    ),
    transports: [new winston.transports.File({ filename: "combined.log" })],
  });
};

export default getLogger;
