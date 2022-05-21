import winston from "winston"
import path from 'path'
const { combine, timestamp, label, printf } = winston.format;
// @ts-ignore

const getLabel = function (module: any) {
  console.log('====================================');
  console.log(module);
  console.log('====================================');
  const parts = module.filename.split(path.sep);
  return parts[parts.length - 2] + path.sep + parts.pop();
};

const customFormat = printf(({ level, message, label, timestamp }) => {
  if (message && typeof message === "object") {
    return `${level}: ${timestamp} [${label} - ${message['fn']}()] ${message['text']}`;
  } else {
    return `${level}: ${timestamp} [${label}] ${message}`;
  }
});

export const logger = function (module: any) {
  // @ts-ignore
  return new winston.createLogger({

    format: combine(
      label({ label: getLabel(module) }),
      timestamp(),
      customFormat
    ),
    transports: [
      new (winston.transports.File)({ filename: 'combined.log' })
    ]
  });
};


