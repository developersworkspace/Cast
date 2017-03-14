// Imports
import 'mocha';
import { expect } from 'chai';

// Imports mocks
import * as mongodb from 'mongo-mock';

// Imports services
import { CastService, Item } from './../../../api/src/services/cast';

describe('CastService', () => {

    let castService: CastService = null;

    beforeEach(() => {
        
        let mongoClient = mongodb.MongoClient;

        castService = new CastService(mongoClient);
    });

    describe('nextItem', () => {
        it('should return null given not items exist', () => {
            return castService.nextItem(100).then((item: Item) => {
                expect(item).to.be.null;
            });
        });
    });
});