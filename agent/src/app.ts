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
        request(config.api.uri +  '/cast/nextItem', function (error, response, body) {

            if (error) {
                reject(error);
            } else if (response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(new Error(`Status Code: ${response.statusCode} Body: ${body}`));
            }
        });
    });
}

function sendProcessedResult(uuid: string, answer: any) {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            uri: config.api.uri + '/cast/result',
            body: {
                uuid: uuid,
                answer: answer
            },
            json: true
        }, function (error, response, body) {

            if (error) {
                reject(error);
            } else if (response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(new Error(`Status Code: ${response.statusCode} Body: ${body}`));
            }
        });
    });
}

var j = schedule.scheduleJob('*/5 * * * * *', function () {
    getNextItemToProcess().then((item: any) => {
        logger.info('Processing');
        if (item == null) {
            logger.info(`Nothing to process`);
            return false;
        }

        let answer = agent.compute(item.seedNumber, item.numberOfSteps, item.match);
        logger.info(`Processed ${item.seedNumber} (${answer != null})`);

        return sendProcessedResult(item.uuid, answer);
    }).then((result: Boolean) => {

    }).catch((err: Error) => {

        logger.error(err.message);
    });
});
















