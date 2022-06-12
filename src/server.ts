import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import config from "./_helpers/config.json";

import logger from './logger/logger';
const log = logger(module)



const mongoDBURI = process.env.MONGODB_URI || config.mongoDBURI;

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
    }

    private configureDB() {
        const connection = mongoose.connection;

        connection.on("connected", () => {
            log.info("Mongo Connection Established");
        });

        connection.on("reconnected", () => {
            log.info("Mongo Connection Reestablished");
        });

        connection.on("disconnected", () => {
            log.info("Mongo Connection Disconnected");
            log.info("Trying to reconnect to Mongo ...");

            setTimeout(() => {
                mongoose.connect(mongoDBURI, {
                    keepAlive: true,
                    socketTimeoutMS: 3000,
                    connectTimeoutMS: 3000,
                });
            }, 3000);
        });

        connection.on("close", () => {
            log.info("Mongo Connection Closed");
        });

        connection.on("error", (error: Error) => {
            log.error("Mongo Connection ERROR: " + error);
        });

        const run = async () => {
            await mongoose.connect(mongoDBURI, {
                keepAlive: true,
            });
        };

        run().catch((error) => console.error(error));
    }

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