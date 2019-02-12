import {
    FadVitalsAutoCompleteSearchRequestModelInterface,
    FadZipCodeSearchResponseModelInterface,
    FadPlanSearchResponseModelInterface,
    FadVitalsSearchHistoryResponseModelInterface,
    FVSHRSearchHistoryInterface,
    FadVitalsZipCodeSearchRequestModelInterface,
    DoctorProfileSearchRequestModelInterface,
    FacilityProfileSearchRequestModelInterface,
    FADPlanSearchRequestModelInterface,
    FadSearchRequestByProfessionalModelInterface
} from './interfaces/fad-vitals-collection.interface';

export class FadVitalsAutoCompleteSearchRequestModel implements FadVitalsAutoCompleteSearchRequestModelInterface {
    public searchParameter: string;
    public geoLocation: string; // "lattitude,longitude"
    public limit: number;
    public page: number;
    public networkId: number;
}

export class FadZipCodeSearchResponseModel implements FadZipCodeSearchResponseModelInterface {
    public cities: FZCSRCity[];
}

export class FadPlanSearchResponseModel implements FadPlanSearchResponseModelInterface {
    public plans: FPSRPlan[];
}

export class FZCSRCity {
    public name: string;
    public city: string;
    public county: string;
    public state: string;
    public state_code: string;
    public score: number;
    public zip: string;
    public geo: string;
    public lat: string;
    public lng: string;
    public place_id: string;
}

export class FPSRPlan {
    public id: number;
    public name: string;
}

export class FadVitalsSearchHistoryResponseModel implements FadVitalsSearchHistoryResponseModelInterface {
    searchHistory: FVSHRSearchHistory[];
}

export class FVSHRSearchHistory implements FVSHRSearchHistoryInterface {
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

export class FadVitalsZipCodeSearchRequestModel implements FadVitalsZipCodeSearchRequestModelInterface {
    public place: string;
    public page: number;
    public limit: number;
}

export class DoctorProfileSearchRequestModel implements DoctorProfileSearchRequestModelInterface {
    public professionalid: string;
    public geo_location: string; // "lattitude,longitude"
    public network_id: string;
    public userid: string;
}

export class FacilityProfileSearchRequestModel implements FacilityProfileSearchRequestModelInterface {
    public facility: string;
    public geolocation: string; // "lattitude,longitude"
    public network_id: string;
    public location_id: string;
}

export class FADPlanSearchRequestModel implements FADPlanSearchRequestModelInterface {
    public uid: string;
}

export class FadSearchRequestByProfessionalModel implements FadSearchRequestByProfessionalModelInterface {
    public geoLocation: string; // "lattitude,longitude"
    public limit: number;
    public page: number;
    public radius: number;
    public networkId: number;
    public searchSpecialtyId: number;
    public name: string;
}