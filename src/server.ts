import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import _ from 'underscore';
import mongo from './_helper/mongo';
import appDataSourceLoader from './orm/dbCreateConnection';
import gameProviderControllerMappingConfig from './config/gameProviderControllerMapping.json';

import logger from './logger/logger';
import config from './config';
const log = logger(module);

class Server {
  public app: Application;

  constructor() {
    this.app = express();

    this.configureWebServer();
    this.configureRoutes();
    this.configureDB();
  }

  private configureWebServer() {
    this.app.set('port', config.port);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
  }

  private configureRoutes() {
    for (let gameProvider of _.keys(gameProviderControllerMappingConfig.mappings)) {
      let key = gameProvider as keyof typeof gameProviderControllerMappingConfig.mappings;
      this.app.use('/rgs-api/' + gameProvider, require(gameProviderControllerMappingConfig.mappings[key]));
    }
  }

  private configureDB() {
    mongo.init();
    appDataSourceLoader();
  }

  public start() {
    this.app.listen(this.app.get('port'), () => {
      log.info(`Platform is running at http:localhost:${this.app.get('port')}`);
    });
  }
}

export default Server;
