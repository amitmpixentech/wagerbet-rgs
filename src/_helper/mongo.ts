import { MongoClient } from "mongodb";
import DatabaseInterface from "./databaseInterface";
import logger from '../logger/logger';

const config = require("../config/config.json");
const log = logger(module)

class Mongo implements DatabaseInterface {

  db: any;
  client: any;

  constructor() {
    this.db = null;
    this.client = null;
  }

  public async init() {
    this.client = await MongoClient.connect(config.mongoDBURL, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      log.error(err);
    });

    if (!this.client) {
      log.error("Error connecting db");
      return;
    }

    this.db = this.client.db(config.mongoDB);
  }

  public getDB() { return this.db }
  public closeConnection() { this.client.close() }
};

export default new Mongo();
