// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { CastService } from './../services/cast';

let router = express.Router();

router.get('/parameters', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.getParameters().then((result: Boolean) => {
        res.send('OK');
    });    
});


export = router;
