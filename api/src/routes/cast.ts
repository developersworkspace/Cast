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
    }).catch((err: Error) => {
        res.status(500).send(err.message);
    });
});

router.get('/new', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.saveNewItem(req.query.match).then((result: any) => {
        res.json(result);
    }).catch((err: Error) => {
        res.status(500).send(err.message);
    });
});

router.post('/result', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.saveProcessedResult(req.body.uuid, req.body.answer).then((result: any) => {
        res.json(result);
    }).catch((err: Error) => {
        res.status(500).send(err.message);
    });
});


router.get('/list', (req: Request, res: Response, next: Function) => {
    let castService = new CastService(mongodb.MongoClient);

    castService.listAnswers().then((result: any) => {
        res.json(result);
    }).catch((err: Error) => {
        res.status(500).send(err.message);
    });
});


export = router;
