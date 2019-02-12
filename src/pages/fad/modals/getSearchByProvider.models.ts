
import {
    GetSearchByProviderRequestModelInterface,
    GetSearchByProviderResponseModelInterface,
    GSBPRProfessionalEntityInterface,
    GSBPRFacilityEntityInterface,
    GSBPRSearchSpecialtiesEntityInterface
} from './interfaces/getSearchByProvider-models.interface';
import { GeneralError } from '../../../models/generic-app.model';

export class GetSearchByProviderRequestModel implements GetSearchByProviderRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    networkId: number;
    searchParameter: number;

    getGeoLocation(): string {
        return this.geoLocation;
    }
    setGeoLocation(geoLocation: string): GetSearchByProviderRequestModel {
        this.geoLocation = geoLocation;
        return this;
    }

    getLimit(): number {
        return this.limit;
    }
    setLimit(limit: number): GetSearchByProviderRequestModel {
        this.limit = limit;
        return this;
    }

    getPage(): number {
        return this.page;
    }
    setPage(page: number): GetSearchByProviderRequestModel {
        this.page = page;
        return this;
    }

    getNetworkId(): number {
        return this.networkId;
    }
    setNetworkId(networkId: number): GetSearchByProviderRequestModel {
        this.networkId = networkId;
        return this;
    }

    getSearchParameter(): number {
        return this.searchParameter;
    }
    setSearchParameter(searchParameter: number): GetSearchByProviderRequestModel {
        this.searchParameter = searchParameter;
        return this;
    }
}

export class GetSearchByProviderResponseModel extends GeneralError implements GetSearchByProviderResponseModelInterface {
    search_specialties: GSBPRSearchSpecialtiesEntityInterface[];
    result: number;
    errormessage: string;
    displaymessage: string;
    searchParameter: string;
    professionalsCount: number;
    facilitiesCount: number;
    searchSpecialtyCount: number;

    professionals: GSBPRProfessionalEntity[];
    facilities: GSBPRFacilityEntity[];
    searchSpecialties: GSBPRSearchSpecialtiesEntity[];
}

export class GSBPRProfessionalEntity implements GSBPRProfessionalEntityInterface {
    provider_id: number;
    name: string;
    specialty: string;
}


// tslint:disable-next-line:no-empty-interface
export class GSBPRFacilityEntity extends GSBPRProfessionalEntity implements GSBPRFacilityEntityInterface {

}

export class GSBPRSearchSpecialtiesEntity implements GSBPRSearchSpecialtiesEntityInterface {
    id: number;
    name: string;
    resource_type_code: string;
}
