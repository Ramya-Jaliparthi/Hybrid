import { GeneralErrorInterface } from "../../../interfaces/generic-app-models.interface";

export interface GetSearchByProfessionalRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    radius: number;
    networkId: number;
    searchSpecialtyId: number;
    name: string;
    userId: string;
    sort: string;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): GetSearchByProfessionalRequestModelInterface;

    getLimit(): number;
    setLimit(limit: number): GetSearchByProfessionalRequestModelInterface;

    getPage(): number;
    setPage(page: number): GetSearchByProfessionalRequestModelInterface;

    getRadius(): number;
    setRadius(radius: number): GetSearchByProfessionalRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): GetSearchByProfessionalRequestModelInterface;

    getSearchSpecialtyId(): number;
    setSearchSpecialtyId(searchSpecialtyId: number): GetSearchByProfessionalRequestModelInterface;

    getName(): string;
    setName(name: string): GetSearchByProfessionalRequestModelInterface;

    getUserId(): string;
    setUserId(userId: string): GetSearchByProfessionalRequestModelInterface;

    getSort(): string;
    setSort(sort: string): GetSearchByProfessionalRequestModelInterface;

}

export interface GetSearchByProfessionalResponseModelInterface extends GeneralErrorInterface {
    totalCount: number;
    professionals: FadProfessionalInterface[];
    facets: Facets;
}

export interface FadProfessionalInterface {
    doctorName: string; // This is the city/state of the location
    specialty: string; // This is the name of the city
    locations: FadLocationDetailsInterface[];
    reviews: FadReviewsListInterface;
}

export interface Facets {
    treatedTypeCodes: TreatedTypeCodeInterface[];
    overallRating: OverallRatingInterface[];
    inNetwork: InNetworkInterface;
    acceptingNewPatients: AcceptingNewPatientsInterface;
    fieldSpecialtyIds: FieldSpecialtyIdInterface[];
    grpHospitalAffiliationIds: GrpHospitalAffiliationIdInterface[];
    isChoicePcp: IsChoicePcpInterface[];
    isPcp: IsPcpInterface[];
    locationGeo: LocationGeoInterface[];
    professionalGender: ProfessionalGenderInterface[];
    professionalLanguages: ProfessionalLanguageInterface[];
    techSavvy: TechSavvyInterface;
    treatmentMethodsTypeCodes: TreatmentMethodsTypeCodeInterface[];
    disordersTreatedTypeCodes: DisordersTreatedTypeCodeInterface[];
}

export interface TreatedTypeCodeInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface OverallRatingInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface InNetworkInterface {
    value: string | boolean;
    name: string;
    count: number;
    selected: boolean;
}

export interface AcceptingNewPatientsInterface {
    value: string | boolean;
    name: string;
    count: number;
    selected: boolean;
}

export interface FieldSpecialtyIdInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface GrpHospitalAffiliationIdInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface IsChoicePcpInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface IsPcpInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface LocationGeoInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface ProfessionalGenderInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface ProfessionalLanguageInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface TechSavvyInterface {
    value: string | boolean;
    name: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface TreatmentMethodsTypeCodeInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface DisordersTreatedTypeCodeInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface FadLocationDetailsInterface {

    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
}

export interface FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}
