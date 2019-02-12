//import { GeneralError } from '../../../shared/models/generic-app.model';
import {
    GetSearchBySpecialityResponseModelInterface,
    GetSearchBySpecialityRequestModelInterface,
    GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface
} from './interfaces/getSearchBySpeciality-models.interface';
import { GeneralError } from '../../../models/generic-app.model';

export class GetSearchBySpecialityRequestModel implements GetSearchBySpecialityRequestModelInterface {
    userId: string;
    networkId: string;

    getUserId(): string {
        return this.userId;
    }
    setUserId(userId: string): GetSearchBySpecialityRequestModel {
        this.userId = userId;
        return this;
    }

    getNetworkId(): string {
        return this.networkId;
    }
    setNetworkId(networkId: string): GetSearchBySpecialityRequestModel {
        this.networkId = networkId;
        return this;
    }
}

export class GetSearchBySpecialityResponseModel extends GeneralError implements GetSearchBySpecialityResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
    searchSpecialties: GetSearchBySpecialityResponseSearchSpecialtiesInfo[];
}

export class GetSearchBySpecialityResponseSearchSpecialtiesInfo implements GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface {
    id: number; // This is the id
    name: string; // This is the name of the Specialty
    resourceTypeCode: string; // This is the resourceTypeCode
}
