import { IDataService, IBaseDomainObject } from '../dataService/data.service';
import { IParentDataService } from '../dataService/parent/parentData.service';
import { ISingletonDataService } from '../singletonDataService/singletonData.service';

export interface IDataTransform {
	(data: any): any;
}

export interface IDataServiceMock<TDataType extends IBaseDomainObject, TSearchParams> extends IDataService<TDataType, TSearchParams> {
	mockGetList(data: any[]): Sinon.SinonSpy;
	mockGetDetail(data: any): Sinon.SinonSpy;
	mockUpdate(dataTransform?: IDataTransform): Sinon.SinonSpy;
	mockCreate(dataTransform?: IDataTransform): Sinon.SinonSpy;
}

export interface IParentDataServiceMock<TDataType extends IBaseDomainObject, TSearchParams, TResourceDictionaryType> extends IParentDataService<TDataType, TSearchParams, TResourceDictionaryType> {
	mockGetList(data: any[]): Sinon.SinonSpy;
	mockGetDetail(data: any): Sinon.SinonSpy;
	mockChild(mockCallback: { (children: any): void }): void;
	mockUpdate(dataTransform?: IDataTransform): Sinon.SinonSpy;
	mockCreate(dataTransform?: IDataTransform): Sinon.SinonSpy;
}

export interface ISingletonDataServiceMock<TDataType> extends ISingletonDataService<TDataType> {
	mockGet(data: any): Sinon.SinonSpy;
	mockUpdate(dataTransform?: IDataTransform): Sinon.SinonSpy;
}
