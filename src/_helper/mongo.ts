import { MongoClient } from "mongodb";
const config = require("../config/config.json");
const logger = require("../logger/logger");


interface self {
  [key: string]: any
}

const self: self = {
  db: null,
  client: null,
  init: async () => {
    self.client = await MongoClient.connect(config.mongoDBURL, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((err) => {
      logger.error(err);
    });

    if (!self.client) {
      logger.error("Error connecting db");
      return;
    }

    self.db = self.client.db(config.mongoDB);
  },
  getDB: () => self.db,
  closeConnection: () => self.client.close(),
};

export default self;
