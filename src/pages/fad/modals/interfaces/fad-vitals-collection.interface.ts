import { FVACSRMeta, FVACSRSearchResultEntity, FVACSRProcedureEntity } from '../fad-vitals-auto-complete-search-response.model';
//import { FVSSRSpecialityEntity } from '../fad-vitals-specilities-search-response.model';
import { FZCSRCity, FPSRPlan } from '../fad-vitals-collection.model';
//import { FVProSRProfessionalInSearchEntity, FVProSRMeta } from '../fad-vitals-professionals-search-response.model';
import { FVPSRProvider, FVPSRMeta } from '../fad-vitals-providers-summary-response.model';
import { FadProfessional } from './../getSearchByProfessional.model';
import { GetSearchBySpecialityResponseSearchSpecialtiesInfo } from '../getSearchBySpeciality.model';
import { GetSearchByProfessionalResponseModel, GetSearchByProfessionalRequestModel } from '../getSearchByProfessional.model';
import { FadFacility } from './../getSearchByFacility.model';
import { GetSearchByFacilityResponseModel, GetSearchByFacilityRequestModel } from '../getSearchByFacility.model';
import { FadFacilityInterface, Facets as FacetsFacility } from './getSearchByFacility-models.interface';
import { Facets as FacetsProfessional } from './getSearchByProfessional-models.interface';


export interface FadVitalsAutoCompleteSearchRequestModelInterface {
    searchParameter: string;
    geoLocation: string; // 'lattitude,longitude'
    limit: number;
    page: number;
    networkId: number;
}

export interface FadVitalsAutoCompleteSearchResponseModelInterface {
    searchParameter: string;
    professionalsCount: number;
    facilitiesCount: number;
    searchSpecialtyCount: number;
    professionals: FVACSRSearchResultEntity[];
    facilities: FVACSRSearchResultEntity[];
    searchSpecialties: GetSearchBySpecialityResponseSearchSpecialtiesInfo[];
    procedures: FVACSRProcedureEntity[];
}

export interface FadZipCodeSearchResponseModelInterface {
    cities: FZCSRCity[];
}

export interface FadPlanSearchResponseModelInterface {
    plans: FPSRPlan[];
}

export interface FadVitalsProfessionalsSearchResponseModelInterface {
    totalCount: number;
    professionals: FadProfessional[];
    facets: FacetsProfessional;
}


export interface FadVitalsFacilitiesSearchResponseModelInterface {
    totalCount: number;
    facilities: FadFacility[];
    facets: FacetsFacility;
}

export interface FadVitalsProvidersSummaryResponseModelInterface {
    _meta: FVPSRMeta;
    provides: FVPSRProvider[];
}

export interface FadVitalsSpecialitiesSearchResponseModelInterface {
    searchSpecialties: GetSearchBySpecialityResponseSearchSpecialtiesInfo[];
}

export interface FadVitalsSearchHistoryResponseModelInterface {
    searchHistory: FVSHRSearchHistoryInterface[];
}

export interface FVSHRSearchHistoryInterface {
    planId: number;
    searchKeyword: string;
    zipcode: string;
    planName: string;
    userId: string;
    city: string;
    state: string;
    dependant: string;
    date: string;
}

export interface FadVitalsZipCodeSearchRequestModelInterface {
    place: string;
    page: number;
    limit: number;
}

export interface DoctorProfileSearchRequestModelInterface {
    professionalid: string;
    geo_location: string; // 'lattitude,longitude'
    network_id: string;
    userid: string;
}

export interface FacilityProfileSearchRequestModelInterface {
    facility: string;
    geolocation: string; // 'lattitude,longitude'
    network_id: string;
    location_id: string;
}

export interface FADPlanSearchRequestModelInterface {
    uid: string;
}

export interface FadSearchRequestByProfessionalModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    radius: number;
    networkId: number;
    searchSpecialtyId: number;
    name: string;
}
