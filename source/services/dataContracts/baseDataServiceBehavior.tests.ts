/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />

'use strict';

import { IBaseDataServiceBehavior, BaseDataServiceBehavior } from './baseDataServiceBehavior';
import { moduleName } from './dataContracts.module';

import { IArrayUtility, serviceName as arrayService, moduleName as arrayModule } from '../array/array.service';

import { angularFixture } from '../test/angularFixture';

import * as angular from 'angular';
import 'angular-mocks';

interface ITestMock {
	id?: number;
	prop?: string;
}

describe('base data service behavior', () => {
	let dataServiceBehavior: IBaseDataServiceBehavior<ITestMock>;

	beforeEach(() => {
		angular.mock.module(arrayModule);
		angular.mock.module(moduleName);
	});

	describe('use http', (): void => {
		let $httpBackend: angular.IHttpBackendService;
		let testUrl: string;

		beforeEach((): void => {
			let services: any = angularFixture.inject('$httpBackend', '$q', '$http');
			$httpBackend = services.$httpBackend;

			testUrl = '/api/test';
			dataServiceBehavior = new BaseDataServiceBehavior<ITestMock>(services.$http, services.$q, null);
		});

		afterEach((): void => {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should make an http request to get a list of data', (done: MochaDone): void => {
			let mockList: ITestMock[] = [
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 },
				{ id: 5 },
			];

			$httpBackend.expectGET(testUrl).respond(200, mockList);

            dataServiceBehavior.getList({
                endpoint: testUrl,
                useMock: false,
                logRequests: false,
                getMockData: null,
                params: null,
            }).then((data: ITestMock[]): void => {
				expect(data).to.have.length(5);
				expect(data[0].id).to.equal(1);
				expect(data[1].id).to.equal(2);
				expect(data[2].id).to.equal(3);
				expect(data[3].id).to.equal(4);
				expect(data[4].id).to.equal(5);
				done();
			});

			$httpBackend.flush();
		});

		it('should make an http request to get a domain object', (done: MochaDone): void => {
			let id: number = 1;
			let mockItem: ITestMock = { id: id };

			$httpBackend.expectGET(testUrl).respond(200, mockItem);

            dataServiceBehavior.getItem({
                endpoint: testUrl,
                useMock: false,
                logRequests: false,
                getMockData: null,
            }).then((data: ITestMock): void => {
				expect(data).to.deep.equal(mockItem);
				done();
			});

			$httpBackend.flush();
		});

		it('should make an http request to create a domain object', (done: MochaDone): void => {
			let mockItem: ITestMock = { id: 1 };

			$httpBackend.expectPOST(testUrl, mockItem).respond(200, mockItem);

            dataServiceBehavior.create({
                domainObject: mockItem,
                endpoint: testUrl,
                useMock: false,
                logRequests: false,
                addMockData: null,
            }).then((data: ITestMock): void => {
				expect(data).to.deep.equal(mockItem);
				done();
			});

			$httpBackend.flush();
		});

		it('should make an http request to save an existing domain object', (done: MochaDone): void => {
			let mockItem: ITestMock = { id: 1 };

			$httpBackend.expectPUT(testUrl, mockItem).respond(200, mockItem);

            dataServiceBehavior.update({
                domainObject: mockItem,
                endpoint: testUrl,
                useMock: false,
                logRequests: false,
                updateMockData: null,
            }).then((data: ITestMock): void => {
                expect(data).to.deep.equal(mockItem);
                done();
			});

			$httpBackend.flush();
		});

		it('should make an http request to delete an existing domain object', (done: MochaDone): void => {
			let mockItem: ITestMock = { id: 1 };

			$httpBackend.expectDELETE(testUrl).respond(200);

            dataServiceBehavior.delete({
                domainObject: mockItem,
                endpoint: testUrl,
                useMock: false,
                logRequests: false,
                removeMockData: null,
            }).then((): void => {
				done();
			});

			$httpBackend.flush();
		});
	});

	describe('use mock', (): void => {
		let $rootScope: angular.IRootScopeService;
        let dataSet: ITestMock[];
        let array: IArrayUtility;

		beforeEach((): void => {
			dataSet = [
				{ id: 1, prop: 'item1' },
				{ id: 2, prop: 'item2' },
				{ id: 3, prop: 'item3' },
			];

			let services: any = angularFixture.inject('$rootScope', '$q', '$http', arrayService);
            $rootScope = services.$rootScope;
            array = services[arrayService];

			dataServiceBehavior = new BaseDataServiceBehavior<ITestMock>(services.$http, services.$q, null);
		});

		it('should get the mocked data set', (done: MochaDone): void => {
            dataServiceBehavior.getList({
                useMock: true,
                getMockData(): ITestMock[] { return dataSet; },
                endpoint: null,
                logRequests: false,
                params: null,
            }).then((data: ITestMock[]): void => {
				expect(data).to.have.length(3);
				expect(data[0]).to.equal(dataSet[0]);
				expect(data[1]).to.equal(dataSet[1]);
				expect(data[2]).to.equal(dataSet[2]);
				done();
			});

			$rootScope.$digest();
		});

		it('should get an item from the mocked data set', (done: MochaDone): void => {
            dataServiceBehavior.getItem({
                useMock: true,
                getMockData(): ITestMock { return dataSet[1]; },
                endpoint: null,
                logRequests: false,
            }).then((data: ITestMock): void => {
				expect(data).to.equal(dataSet[1]);
				done();
			});

			$rootScope.$digest();
		});

		it('should create an item and call the add callback to add it to the mock data set', (done: MochaDone): void => {
            let newItem: ITestMock = { id: null, prop: 'item4' };
            let addSpy: Sinon.SinonSpy = sinon.spy((item: ITestMock): void => {
                dataSet.push(item);
            });

            dataServiceBehavior.create({
                domainObject: newItem,
                useMock: true,
                addMockData: addSpy,
                endpoint: null,
                logRequests: false,
            }).then((data: ITestMock): void => {
				expect(data).to.equal(newItem);
				done();
			});

			$rootScope.$digest();

            sinon.assert.calledOnce(addSpy);
            sinon.assert.calledWith(addSpy, newItem);
			expect(dataSet[3]).to.equal(newItem);
		});

		it('should update an item', (done: MochaDone): void => {
			let updatedItem: ITestMock = { id: 2, prop: 'made changes' };
            let updateSpy: Sinon.SinonSpy = sinon.spy((item: ITestMock): void => {
                dataSet[1] = item;
            });

            dataServiceBehavior.update({
                domainObject: updatedItem,
                useMock: true,
                updateMockData: updateSpy,
                endpoint: null,
                logRequests: false,
            }).then((data: ITestMock): void => {
				expect(data).to.equal(updatedItem);
				done();
			});

			$rootScope.$digest();

            sinon.assert.calledOnce(updateSpy);
            sinon.assert.calledWith(updateSpy, updatedItem);
			expect(dataSet[1]).to.equal(updatedItem);
		});

		it('should delete an item', (): void => {
            let removedItem: ITestMock = dataSet[1];
            let removeSpy: Sinon.SinonSpy = sinon.spy((item: ITestMock): void => {
                array.remove(dataSet, item);
            });

            dataServiceBehavior.delete({
                domainObject: removedItem,
                useMock: true,
                removeMockData: removeSpy,
                endpoint: null,
                logRequests: false,
            });

			$rootScope.$digest();

            sinon.assert.calledOnce(removeSpy);
            sinon.assert.calledWith(removeSpy, removedItem);
			expect(dataSet).to.have.length(2);
			expect(dataSet[0].id).to.equal(1);
			expect(dataSet[1].id).to.equal(3);
		});
	});

	describe('transform', (): void => {
		let $rootScope: angular.IRootScopeService;
		let dataSet: ITestMock[];
		let transform: any;

		beforeEach((): void => {
			dataSet = [
				{ id: 1, prop: 'item1' },
				{ id: 2, prop: 'item2' },
				{ id: 3, prop: 'item3' },
			];

			let services: any = angularFixture.inject('$rootScope', '$q', '$http');
			$rootScope = services.$rootScope;

			transform = {
				fromServer: sinon.spy((rawData: ITestMock): string => {
					return rawData.prop;
                }),
                toServer: sinon.spy((data: string): ITestMock => {
                    return {
                        prop: data,
                    };
                }),
			};

			dataServiceBehavior = new BaseDataServiceBehavior<ITestMock>(services.$http, services.$q, transform);
		});

		it('should transform each entry in the list', (done: MochaDone): void => {
            dataServiceBehavior.getList({
                useMock: true,
                getMockData(): ITestMock[] { return dataSet; },
                endpoint: null,
                logRequests: false,
                params: null,
            }).then((data: ITestMock[]): void => {
				expect(data).to.have.length(3);
				expect(data[0]).to.equal(dataSet[0].prop);
				expect(data[1]).to.equal(dataSet[1].prop);
				expect(data[2]).to.equal(dataSet[2].prop);
				sinon.assert.calledThrice(transform.fromServer);
				done();
			});

			$rootScope.$digest();
		});

		it('should transform the single item', (done: MochaDone): void => {
			dataServiceBehavior.getItem({
                useMock: true,
                getMockData(): ITestMock { return dataSet[1]; },
                endpoint: null,
                logRequests: false,
            }).then((data: ITestMock): void => {
				expect(data).to.equal(dataSet[1].prop);
				sinon.assert.calledOnce(transform.fromServer);
				done();
			});

			$rootScope.$digest();
        });

        it('should reverse transform the data when sending it back to the server', (done: MochaDone): void => {
            let updateSpy: Sinon.SinonSpy = sinon.spy((item: ITestMock): void => {
                dataSet[1] = item;
            });

            dataServiceBehavior.update({
                domainObject: 'made some changes',
                useMock: true,
                updateMockData: updateSpy,
                endpoint: null,
                logRequests: false,
            }).then((data: ITestMock): void => {
                expect(data).to.equal('made some changes');
				sinon.assert.calledOnce(transform.fromServer);
				done();
            });

            expect(updateSpy.firstCall.args[0].prop).to.equal('made some changes');
            sinon.assert.calledOnce(transform.toServer);

			$rootScope.$digest();
        });
	});
});