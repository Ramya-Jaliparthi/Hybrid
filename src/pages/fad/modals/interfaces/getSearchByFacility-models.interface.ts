
import {
    GetSearchByProfessionalRequestModelInterface,
    FadLocationDetailsInterface,
    FadReviewsListInterface
} from './getSearchByProfessional-models.interface';
import { GeneralErrorInterface } from '../../../interfaces/generic-app-models.interface';
import { AwardInterface } from './fad-facility-profile-details.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetSearchByFacilityRequestModelInterface extends GetSearchByProfessionalRequestModelInterface {

}

export interface GetSearchByFacilityResponseModelInterface extends GeneralErrorInterface {
    totalCount: number;
    facility: FadFacilityInterface[];
    facets: Facets;
}

export interface FadFacilityInterface {
    facilityId: number;
    id: string;
    type: string;
    name: string;
    specialty: string; // This is the name of the city
    locations: FadLocationDetailsInterface[];
    reviews: FadReviewsListInterface;
}

export interface Facets {
    treatedTypeCodes: TreatedTypeCodeInterface[];
    overallRating: OverallRatingInterface[];
    acceptingNewPatients: AcceptingNewPatientsInterface;
    inNetwork: InNetworkInterface;
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
    bdcTypeCodes: BdcTypeCodesInterface[];
    awardTypeCodes: AwardTypeCodesInterface[];
    cqms: CqmsInterface[];
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

export interface BdcTypeCodesInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface AwardTypeCodesInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}

export interface CqmsInterface {
    name: string;
    value: string;
    count: number;
    default: boolean;
    selected: boolean;
}


