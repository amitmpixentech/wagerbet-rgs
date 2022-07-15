import { MongoClient } from "mongodb";
const config = require("../config/config.json");
import logger from '../logger/logger';
const log = logger(module)


interface mongo {
  [key: string]: any
}

const mongo: mongo = {
  db: null,
  client: null,
  init: async () => {
    mongo.client = await MongoClient.connect(config.mongoDBURL, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      log.error(err);
    });

    if (!mongo.client) {
      log.error("Error connecting db");
      return;
    }

    mongo.db = mongo.client.db(config.mongoDB);
  },
  getDB: () => mongo.db,
  closeConnection: () => mongo.client.close(),
};

export default mongo;
