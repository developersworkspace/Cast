// Imports
let crypto = require('crypto');

export class Agent {

    private characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    constructor() {
    }


    compute(startingString: string, numberOfSteps: number, match: string) {
        let workingString: string = startingString;

        for (let i = 0; i < numberOfSteps; i++) {
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

            workingString = this.plusOne(workingString);
        }

        return null;
    }

    private plusOne(str: string) {
        let arr: number[] = this.toNumericArray(str);

        arr[arr.length - 1] = arr[arr.length - 1] + 1;

        return this.toCharArray(arr);
    }

    private toCharArray(arr: number[]) {
        let str: string = '';

        let carryOver: number = null;

        for (let i = arr.length - 1; i >= 0; i--) {

            if (carryOver != null) {
                arr[i] = arr[i] + carryOver;
                carryOver = null;
            }

            if (arr[i] > (this.characters.length - 1)) {
                arr[i] = arr[i] % (this.characters.length - 1) - 1;
                carryOver = Math.floor(arr[i] / (this.characters.length - 1));
                carryOver = carryOver + 1;
            }
        }

        if (carryOver != null) {
            arr = [carryOver - 1].concat(arr);
        }

        str = arr.map(x => this.characters[x]).join('');

        return str;
    }

    private toNumericArray(str: string) {
        let arr: number[] = [];

        for (let i = 0; i < str.length; i++) {
            arr.push(this.characters.indexOf(str[i]));
        }

        return arr;
    }

}