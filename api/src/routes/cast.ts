// Imports 
import { Express, Request, Response } from "express";
let express = require('express');
import * as mongodb from 'mongodb';

// Imports services
import { CastService } from './../services/cast';

let router = express.Router();

router.get('/parameters', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.getParameters(100).then((result: any) => {
        res.json(result);
    });
});

router.get('/new', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.newItem('hello').then((result: any) => {
        res.json(result);
    });
});

router.post('/result', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.result(req.body.uuid, req.body.answer).then((result: any) => {
        res.json(result);
    });
});


export = router;
