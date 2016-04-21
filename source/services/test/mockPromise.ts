import * as ng from 'angular';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export interface IMockPromiseService {
	promise<TData>(result: TData | { (...args: any[]): TData }): IMockedPromise<TData>;
	rejectedPromise<TData>(...params: any[]): IMockedPromise<TData>;
	flushAll(service: any): void;
}

export interface IMockedPromise<TData> extends Sinon.SinonSpy {
	(...args: any[]): Promise<TData>;
	reject(...params: any[]): void;
	rejected: boolean;
	flush(): void;
}

interface IMockedPromiseInternal<TData> extends IMockedPromise<TData> {
	rejectParams: any[];
}

class MockPromiseService implements IMockPromiseService {
	promise<TData>(result: TData | { (...args: any[]): TData }): IMockedPromise<TData> {
		if (ng.isFunction(result)) {
			return this.makeDynamicMockPromise(<{ (...args: any[]): TData }>result);
		} else {
			return this.makeMockPromise(<TData>result);
		}
	}

	rejectedPromise<TData>(...params: any[]): IMockedPromise<TData> {
		let mocked: IMockedPromiseInternal<TData> = this.makeMockPromise(null);
		mocked.rejected = true;
		mocked.rejectParams = params;
		return mocked;
	}

	flushAll(service: any): void {
		_.each(service, (promise: IMockedPromise<any>): void => {
			if (promise && _.isFunction(promise.flush)) {
				promise.flush();
			}
		});
	}

	private makeMockPromise<TData>(result: TData): IMockedPromiseInternal<TData> {
		return this.makeDynamicMockPromise(() => result);
	}

	private makeDynamicMockPromise<TData>(result: { (...args: any[]): TData }): IMockedPromiseInternal<TData> {
		let request: any;
		let promise: Promise<TData>;

		let promiseBuilder: any = ((...args: any[]): Promise<TData> => {
			if (request) {
				return promise;
			}

			promise = new Promise<TData>(function (resolve, reject) {
				request = {
					resolve,
					reject,
					params: args,
				};
			});

			return promise;
		});

		let spiedBuilder: any = sinon.spy(promiseBuilder);
		let mocked: IMockedPromiseInternal<TData> = <IMockedPromiseInternal<TData>> spiedBuilder;

		mocked.reject = (...params: any[]) => {
			mocked.rejected = true;
			mocked.rejectParams = params;
		};

		mocked.flush = () => {
			if (request) {
				if (mocked.rejected) {
					request.reject(...mocked.rejectParams);
				} else {
					request.resolve(result(...request.params));
				}

				request = null;
			}
		};

		return mocked;
	}
}

export const mock: IMockPromiseService = new MockPromiseService();