// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { CastService } from './../services/cast';

let router = express.Router();

router.get('/nextItem', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.nextItem(2000).then((item: any) => {
        res.json(item);
    });
});

router.get('/new', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.saveNewItem('31a841af7b2f732799f0457318848625089a63a7').then((result: any) => {
        res.json(result);
    });
});

router.post('/result', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.saveProcessedResult(req.body.uuid, req.body.answer).then((result: any) => {
        res.json(result);
    });
});


export = router;
