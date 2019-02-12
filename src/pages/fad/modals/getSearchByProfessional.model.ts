import {
    GetSearchByProfessionalResponseModelInterface,
    FadProfessionalInterface,
    FadLocationDetailsInterface,
    FadReviewsListInterface,
    GetSearchByProfessionalRequestModelInterface,
    Facets,
    TechSavvyInterface,
    AcceptingNewPatientsInterface,
    InNetworkInterface
} from './interfaces/getSearchByProfessional-models.interface';
import { GeneralError } from '../../../models/generic-app.model';
//import { GeneralError } from '../../../shared/models/generic-app.model';

export class GetSearchByProfessionalRequestModel implements GetSearchByProfessionalRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    radius: number;
    networkId: number;
    searchSpecialtyId: number;
    name: string;
    userId: string;
    sort: string;

    getGeoLocation(): string {
        return this.geoLocation;
    }

    setGeoLocation(geoLocation: string): GetSearchByProfessionalRequestModel {
        this.geoLocation = geoLocation;
        return this;
    }

    getLimit(): number {
        return this.limit;
    }

    setLimit(limit: number): GetSearchByProfessionalRequestModel {
        this.limit = limit;
        return this;
    }

    getPage(): number {
        return this.page;
    }

    setPage(page: number): GetSearchByProfessionalRequestModel {
        this.page = page;
        return this;
    }

    getRadius(): number {
        return this.radius;
    }

    setRadius(radius: number): GetSearchByProfessionalRequestModel {
        this.radius = radius;
        return this;
    }

    getNetworkId(): number {
        return this.networkId;
    }

    setNetworkId(networkId: number): GetSearchByProfessionalRequestModel {
        this.networkId = networkId;
        return this;
    }

    getSearchSpecialtyId(): number {
        return this.searchSpecialtyId;
    }

    setSearchSpecialtyId(searchSpecialtyId: number): GetSearchByProfessionalRequestModel {
        this.searchSpecialtyId = searchSpecialtyId;
        return this;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): GetSearchByProfessionalRequestModel {
        this.name = name;
        return this;
    }

    getUserId(): string {
        return this.userId;
    }

    setUserId(userId: string): GetSearchByProfessionalRequestModel {
        this.userId = userId;
        return this;
    }

    getSort(): string {
        return this.sort;
    }

    setSort(sort: string): GetSearchByProfessionalRequestModel {
        this.sort = sort;
        return this;
    }
}

export class GetSearchByProfessionalResponseModel extends GeneralError implements GetSearchByProfessionalResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
    professionals: FadProfessional[];
    totalCount: number;
    facets: Facets;
}

export class FadProfessional implements FadProfessionalInterface {
    doctorName: string; // This is the city/state of the location
    specialty: string; // This is the name of the city
    locations: FadLocationDetails[];
    reviews: FadReviewsList;
}



export class FadLocationDetails implements FadLocationDetailsInterface {
    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
}

export class FadReviewsList implements FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}

export class AcceptingNewPatients implements AcceptingNewPatientsInterface {
    value: string;
    name: string;
    count: number;
    selected: boolean;
}

export class TechSavvy implements TechSavvyInterface {
    value: string;
    name: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export class InNetwork implements InNetworkInterface {
    value: string;
    name: string;
    count: number;
    selected: boolean;
}
