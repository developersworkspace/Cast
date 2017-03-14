// Imports
import * as schedule from 'node-schedule';
import * as request from 'request';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';


import { Agent } from './agent';


let agent = new Agent();

function getNextItemToProcess() {
    return new Promise((resolve, reject) => {
        request('http://localhost:3000/api/cast/nextItem', function (error, response, body) {

            if (response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

function sendProcessedResult(uuid: string, answer: any) {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            uri: 'http://localhost:3000/api/cast/result',
            body: {
                uuid: uuid,
                answer: answer
            },
            json: true
        }, function (error, response, body) {

            if (response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

var j = schedule.scheduleJob('*/5 * * * * *', function () {
    getNextItemToProcess().then((item: any) => {

        let answer = agent.compute(item.seedNumber, item.numberOfSteps, item.match);
        logger.info(`Processed ${item.seedNumber} (${answer != null})`);

        return sendProcessedResult(item.uuid, answer);
    }).then((result: Boolean) => {

    });
});














