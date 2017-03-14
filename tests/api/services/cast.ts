// Imports
import 'mocha';
import { expect } from 'chai';

// Imports mocks
import * as mongodb from 'mongo-mock';


import * as mongodbIntegration from 'mongodb';

// Imports configuration
import { config } from './../../../api/src/config';

// Imports services
import { CastService, Item } from './../../../api/src/services/cast';

describe('CastService', () => {

    let castService: CastService = null;

    beforeEach((done: Function) => {

        let mongoClient = mongodbIntegration.MongoClient;

        castService = new CastService(mongoClient);

         mongoClient.connect(config.datastores.mongo.uri, (err: Error, db: any) => {
            let collection = db.collection('items');
            collection.remove({}, (err: Error) => {
                done();
            });
        });
    });

    describe('nextItem', () => {
        it('should return null given no items exist', () => {
            return castService.nextItem(100).then((item: Item) => {
                expect(item).to.be.null;
            });
        });

        it('should return item given one unprocessed items, zero processed(without answer) items, zero processed(with answer) exist', () => {
            return castService.saveNewItem('7516fd43adaa5e0b8a65a672c39845d2').then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                expect(item).to.be.not.null;
                expect(item.seedNumber).to.be.eq(0);
                expect(item.match).to.be.eq('7516fd43adaa5e0b8a65a672c39845d2');
                expect(item.answer).to.be.null;
                expect(item.hasBeenProcess).to.be.false;
                expect(item.matchHasAnswer).to.be.false;
                expect(item.nextSeedNumber).to.be.eq(item.seedNumber + item.numberOfSteps);
                expect(item.uuid).to.be.not.null;
            });
        });


        it('should return item given one unprocessed items, one processed(without answer) items, zero processed(with answer) exist', () => {
            return castService.saveNewItem('7516fd43adaa5e0b8a65a672c39845d2').then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                return castService.saveProcessedResult(item.uuid, null);
            }).then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                expect(item).to.be.not.null;
                expect(item.seedNumber).to.be.eq(100);
                expect(item.match).to.be.eq('7516fd43adaa5e0b8a65a672c39845d2');
                expect(item.answer).to.be.null;
                expect(item.hasBeenProcess).to.be.false;
                expect(item.matchHasAnswer).to.be.false;
                expect(item.nextSeedNumber).to.be.eq(item.seedNumber + item.numberOfSteps);
                expect(item.uuid).to.be.not.null;
            });
        });


        it('should return null given zero unprocessed items, one processed(without answer) items, one processed(with answer) exist', () => {
            return castService.saveNewItem('7516fd43adaa5e0b8a65a672c39845d2').then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                return castService.saveProcessedResult(item.uuid, null);
            }).then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                return castService.saveProcessedResult(item.uuid, {
                    type: 'md5',
                    answer: 'US'
                });
            })
            .then((result: Boolean) => {
                return castService.nextItem(100);
            }).then((item: Item) => {
                expect(item).to.be.null;
            });
        });
    });
});