// Imports
import * as schedule from 'node-schedule';
import * as request from 'request';

// Imports logger
import { logger } from './logger';

// Imports configuration
import { config } from './config';


import { Agent } from './agent';


let agent = new Agent();

// var j = schedule.scheduleJob('*/1 * * * *', function () {

// });

function getParameters() {
    return new Promise((resolve, reject) => {
        request('http://www.mocky.io/v2/58c6a1cc10000065111b7c4a', function (error, response, body) {

            if (response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

getParameters().then((result: any) => {
    let r = agent.compute(result.seedNumber, result.numberOfSteps, result.match);
    console.log(r);
});









