import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import _ from "underscore";
import xmlparser from "express-xml-bodyparser";
import compression from "compression";
import logger from "./logger/logger";
const log = logger(module);
import mongo from "./_helper/mongo";
const rgsDatabaseService = require("./rgs/db/rgsDatabaseService");
const gameProviderControllerMappingConfig = require("./config/gameProviderControllerMapping.json");

class Server {
    public app: Application;

    constructor() {
        this.app = express();

        this.configureWebServer();
        this.configureRoutes();
        this.configureDB();
    }

    private configureWebServer() {
        this.app.set("port", process.env.PORT || 8080);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cors());
    }

    private configureRoutes() {
        for (const gameProvider of _.keys(
            gameProviderControllerMappingConfig.mappings
        )) {
            this.app.use(
                "/api/" + gameProvider,
                require(gameProviderControllerMappingConfig.mappings[gameProvider]).default
            );
        }
    }

    private async configureDB() {
        await mongo.init();
    }

    public start() {
        this.app.listen(this.app.get("port"), () => {
            log.info(
                `Platform is running at http://localhost:${this.app.get("port")}`
            );
        });
    }
}

const server = new Server();

server.start();

