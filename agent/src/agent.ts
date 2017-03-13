// Imports
let crypto = require('crypto');
let bases = require('bases');

export class Agent {

    private characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    constructor() {
    }


    compute(seedNumber: string, numberOfSteps: number, match: string) {
        for (let i = 0; i < numberOfSteps; i++) {
            let workingString = bases.toAlphabet(seedNumber + i, this.characters);

            let md5 = crypto.createHash('md5').update(workingString).digest("hex");
            let sha1 = crypto.createHash('sha1').update(workingString).digest("hex");
            let sha256 = crypto.createHash('sha256').update(workingString).digest("hex");

            if (md5 == match) {
                return {
                    type: 'md5',
                    answer: workingString
                }
            }

            if (sha1 == match) {
                return {
                    type: 'sha1',
                    answer: workingString
                }
            }

            if (sha256 == match) {
                return {
                    type: 'sha256',
                    answer: workingString
                }
            }
        }

        return null;
    }
}