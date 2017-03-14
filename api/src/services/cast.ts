// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

// Imports configuration
import { config } from './../config';

export class CastService {

    constructor(private mongoClient: mongodb.MongoClient) {

    }

    public nextItem(numberOfSteps: number): Promise<Item> {

        return this.findUnprocessedItem().then((result: Item) => {
            if (result == null) {
                return this.findItemByHighestNextSeedNumber();
            }
            return result;
        }).then((result: Item) => {

            if (result == null) {
                return null;
            } else if (result.hasBeenProcess) {
                let newItem = new Item(result.match, result.nextSeedNumber, numberOfSteps);
                newItem.lastProcessedTime = this.getUTCMiliseconds();

                this.insertItem(newItem).then((result: any) => {

                });

                return newItem;
            } else if (!result.hasBeenProcess && result.lastProcessedTime > this.getUTCMiliseconds() - 5000) {

                let newItem = new Item(result.match, result.nextSeedNumber, numberOfSteps);
                newItem.lastProcessedTime = this.getUTCMiliseconds();

                this.insertItem(newItem).then((result: any) => {

                });

                return newItem;
            } else if (!result.hasBeenProcess) {
                result.lastProcessedTime = this.getUTCMiliseconds();
                this.updateItem(result).then((result: any) => {

                });

                return result;
            }
        });
    }

    public saveNewItem(match: string): Promise<Boolean> {
        let item = new Item(match, 0, 100);

        return this.insertItem(item);
    }

    public saveProcessedResult(uuid: string, answer: any): Promise<Boolean> {
        return this.findItemByUUID(uuid).then((item: Item) => {
            if (item == null) {
                return false;
            } else {
                item.answer = answer;
                item.hasBeenProcess = true;

                return this.updateItem(item);
            }
        });
    }

    private updateItem(item: Item): Promise<Boolean> {
        let database: mongodb.Db;
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            database = db;
            let collection = database.collection('items');
            return collection.updateOne({
                uuid: item.uuid
            }, item);
        }).then((result: any) => {
            database.close();
            return true;
        });
    }

    private insertItem(item: Item): Promise<Boolean> {
        let database: mongodb.Db;
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            database = db;
            let collection = database.collection('items');
            return collection.insertOne(item);
        }).then((result: any) => {
            database.close();
            return true;
        });
    }

    private findItemByUUID(uuid: string): Promise<Item> {
        let database: mongodb.Db;
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            database = db;
            let collection = database.collection('items');

            return collection.findOne({
                uuid: uuid
            });
        }).then((result: any) => {
            database.close();

            if (result == null) {
                return null;
            }

            let item = new Item(result.match, result.seedNumber, result.numberOfSteps);
            item.answer = result.answer;
            item.hasBeenProcess = result.hasBeenProcess;
            item.lastProcessedTime = result.lastProcessedTime;
            item.uuid = result.uuid;

            return item;
        });
    }

    private findItemByHighestNextSeedNumber(): Promise<Item> {
        let database: mongodb.Db;
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            database = db;
            let collection = database.collection('items');

            return collection.find({}).sort({
                nextSeedNumber: -1
            });
        }).then((result: mongodb.Cursor<Item>) => {
            return result.toArray();
        }).then((result: Item[]) => {
            database.close();

            if (result.length == 0) {
                return null;
            } else {
                let item = new Item(result[0].match, result[0].seedNumber, result[0].numberOfSteps);
                item.answer = result[0].answer;
                item.hasBeenProcess = result[0].hasBeenProcess;
                item.lastProcessedTime = result[0].lastProcessedTime;
                item.uuid = result[0].uuid;

                return item;
            }
        });
    }

    private findUnprocessedItem(): Promise<Item> {
        let database: mongodb.Db;
        return this.mongoClient.connect(config.datastores.mongo.uri).then((db: mongodb.Db) => {
            database = db;
            let collection = database.collection('items');

            return collection.findOne({
                hasBeenProcessed: false,
                answer: null,
                lastProcessedTime: { $lt: this.getUTCMiliseconds() - 5000 }
            });
        }).then((result: any) => {
            database.close();

            if (result == null) {
                return null;
            }

            let item = new Item(result.match, result.seedNumber, result.numberOfSteps);
            item.answer = result.answer;
            item.hasBeenProcess = result.hasBeenProcess;
            item.lastProcessedTime = result.lastProcessedTime;
            item.uuid = result.uuid;

            return item;
        });
    }


    private getUTCMiliseconds(): number {
        let dateTime = new Date();
        return (dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000);
    }
}

class Item {

    public nextSeedNumber: number;
    public lastProcessedTime: number;
    public hasBeenProcess: Boolean;
    public answer: any;
    public uuid: string;

    constructor(
        public match: string,
        public seedNumber: number,
        public numberOfSteps: number
    ) {
        this.uuid = this.guid();
        this.nextSeedNumber = seedNumber + numberOfSteps;
        this.hasBeenProcess = false;
        this.answer = null;
    }

    private guid() {

        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}