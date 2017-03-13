// Imports
import { Express, Request, Response } from "express";
import * as mongodb from 'mongodb';

// Imports configuration
import { config } from './../config';

export class CastService {

    constructor(private mongoClient: mongodb.MongoClient) {

    }

    public getParameters(): Promise<Boolean> {
        return null;
    }


}