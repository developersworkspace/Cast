// Imports
import express = require("express");
import bodyParser = require("body-parser");
import expressWinston = require('express-winston');


// Import Routes
import * as castRouter from './routes/cast';

// Import middleware
import * as cors from 'cors';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';

export class WebApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cors());
        app.use(expressWinston.logger({
            winstonInstance: logger,
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
        }));
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/cast", castRouter);
    }

    public run() {
        this.app.listen(this.port);
    }
}

import * as mongodb from 'mongodb';

let database: mongodb.Db;
mongodb.MongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
    database = db;
    let collection = database.collection('items');
    return collection.remove({});
}).then((result: any) => {
    database.close();
    return true;
});

let port = 3000;
let api = new WebApi(express(), port);
api.run();
logger.info(`Listening on ${port}`);


