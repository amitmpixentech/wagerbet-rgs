import config from '../config';

import winston from 'winston';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
const { combine, timestamp, label, printf } = winston.format;

const logDir = 'logs';
// Create the log directory if it does not exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

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
      new (require('winston-daily-rotate-file'))({
        filename: `${logDir}/application-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        auditFile: `${logDir}/audit.json`,
        level: config.logs.level,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
};

export default getLogger;
