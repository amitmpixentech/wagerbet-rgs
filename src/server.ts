import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import _ from "underscore";
import mongo from "./_helper/mongo"
import gameProviderControllerMappingConfig from "./config/gameProviderControllerMapping.json";

import logger from './logger/logger';
const log = logger(module)

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
        for (let gameProvider of _.keys(
            gameProviderControllerMappingConfig.mappings
        )) {
            let key = gameProvider as keyof typeof gameProviderControllerMappingConfig.mappings
            this.app.use(
                "/api/" + gameProvider,
                require(gameProviderControllerMappingConfig.mappings[key])
            );
        }

    }

    private configureDB() { mongo.init() }

    public start() {
        this.app.listen(this.app.get("port"), () => {
            log.info(
                `Platform is running at http:localhost:${this.app.get("port")}`
            );
        });
    }
}

const server = new Server();

server.start();
