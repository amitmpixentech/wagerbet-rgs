import cors from 'cors';
import express from "express"
import jsonParser from "body-parser"
import _ from "underscore"
import xmlparser from "express-xml-bodyparser";
import mongo from "./_helper/mongo"
import { logger } from './logger/logger';
const log = logger(module)

const app = express()
const gameProviderControllerMappingConfig = require("./config/gameProviderControllerMapping.json");

async function start() {
  app.use(jsonParser.json({ limit: "200mb" }));
  app.use(
    jsonParser.urlencoded({
      limit: "200mb",
      extended: true,
    })
  );
  app.use(cors);

  app.use(
    xmlparser({
      explicitArray: false,
      trim: true,
      mergeAttrs: true,
    })
  );

  await mongo.init();

  for (const gameProvider of _.keys(
    gameProviderControllerMappingConfig.mappings
  )) {
    app.use(
      "/api/" + gameProvider,
      require(gameProviderControllerMappingConfig.mappings[gameProvider]).default
    );
  }

  const server = app.listen(8081, function () {
    log.info("Server listening on port " + 8081);
  });
}

start();
