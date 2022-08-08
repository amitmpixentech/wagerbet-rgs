import config from '../config';

import winston from 'winston';
import path from 'path';
const { combine, timestamp, label, printf } = winston.format;

const getLabel = function (module: any) {
  const parts = module.filename.split(path.sep);
  return parts[parts.length - 2] + path.sep + parts.pop();
};

const customFormat = printf((data: winston.Logform.TransformableInfo) => {
  if (data.message && typeof data.message === 'object') {
    return `${data.level}: ${data.timestamp} [${data.label} - ${data.message['fn']}()] ${JSON.stringify(
      data.message['text'],
    )}`;
  } else {
    return `${data.level}: ${data.timestamp} [${data.label}] ${data.message}`;
  }
});

const getLogger = function (module: any) {
  return winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: combine(label({ label: getLabel(module) }), timestamp(), customFormat),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.cli(), winston.format.splat()),
      }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
};

export default getLogger;
