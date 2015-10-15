'use strict';

import * as angular from 'angular';

import * as array from './array/array.service';
import * as autosave from './autosave/autosave.service';
import * as autosaveAction from './autosaveAction/autosaveAction.service';
import * as boolean from './boolean/boolean.service';
import * as date from './date/date.module';
import * as fileSize from './fileSize/fileSize.module';
import * as genericSearchFilter from './genericSearchFilter/genericSearchFilter.service';
import * as moment from './moment/moment.module';
import * as notification from './notification/notification.service';
import * as numberService from './number/number.service';
import * as objectService from './object/object.service';
import * as observable from './observable/observable.service';
import * as parentChildBehavior from './parentChildBehavior/parentChildBehavior.service';
import * as promise from './promise/promise.service';
import * as stringService from './string/string.service';
import * as synchronizedRequests from './synchronizedRequests/synchronizedRequests.service';
import * as test from './test/test.module';
import * as time from './time/time.service';
import * as validation from './validation/validation.service';

export {
	array,
	autosave,
	autosaveAction,
	boolean,
	date,
	fileSize,
	genericSearchFilter,
	moment,
	notification,
	numberService as number,
	objectService as object,
	observable,
	parentChildBehavior,
	promise,
	stringService as string,
	synchronizedRequests,
	test,
	time,
	validation,
};

export var moduleName: string = 'rl.utilities.services';

angular.module(moduleName, [
	array.moduleName,
	autosave.moduleName,
	autosaveAction.moduleName,
	boolean.moduleName,
	date.moduleName,
	fileSize.moduleName,
	genericSearchFilter.moduleName,
	moment.moduleName,
	notification.moduleName,
	numberService.moduleName,
	objectService.moduleName,
	observable.moduleName,
	parentChildBehavior.moduleName,
	promise.moduleName,
	stringService.moduleName,
	synchronizedRequests.moduleName,
	time.moduleName,
	test.moduleName,
	validation.moduleName,
]);
