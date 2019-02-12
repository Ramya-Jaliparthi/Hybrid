import { GeneralErrorInterface } from "../../../interfaces/generic-app-models.interface";

export interface GetSearchByProviderRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    networkId: number;
    searchParameter: number;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): GetSearchByProviderRequestModelInterface;

    getLimit(): number;
    setLimit(limit: number): GetSearchByProviderRequestModelInterface;

    getPage(): number;
    setPage(page: number): GetSearchByProviderRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): GetSearchByProviderRequestModelInterface;

    getSearchParameter(): number;
    setSearchParameter(searchParameter: number): GetSearchByProviderRequestModelInterface;
}

export interface GetSearchByProviderResponseModelInterface extends GeneralErrorInterface {
    searchParameter: string;
    professionalsCount: number;
    facilitiesCount: number;
    searchSpecialtyCount: number;

    professionals: GSBPRProfessionalEntityInterface[];
    facilities: GSBPRFacilityEntityInterface[];
    search_specialties: GSBPRSearchSpecialtiesEntityInterface[];
}

export interface GSBPRProfessionalEntityInterface {
    provider_id: number;
    name: string;
    specialty: string;
}


// tslint:disable-next-line:no-empty-interface
export interface GSBPRFacilityEntityInterface extends GSBPRProfessionalEntityInterface {

}

export interface GSBPRSearchSpecialtiesEntityInterface {
    id: number;
    name: string;
    resource_type_code: string;
}
