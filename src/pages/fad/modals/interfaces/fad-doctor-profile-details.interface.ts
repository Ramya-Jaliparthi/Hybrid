import { GeneralErrorInterface } from "../../../interfaces/generic-app-models.interface";
import { GeneralError } from "../../../../models/generic-app.model";

export interface FadDoctorProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    professionalId: number;
    networkId: number;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): FadDoctorProfileRequestModelInterface;

    getLocationId(): number;
    setLocationId(locationId: number): FadDoctorProfileRequestModelInterface;

    getProfessional(): number;
    setProfessional(professionalId: number): FadDoctorProfileRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): FadDoctorProfileRequestModelInterface;

}

export interface FadProfessionalResponseModelInterface extends GeneralError {
    doctorName: string; // This is the city/state of the location
    specialty: string; // This is the name of the city
    languages: string;
    education: FadEducationInterface[];
    locations: FadLocationDetailsInterface[];
    reviews: FadReviewsListInterface;
}

export interface FadLocationDetailsInterface extends FadContractsInterface {
    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
    amenities: FadAmenitiesInterface[],
    // contracts: FadContractsInterface[]
}

export interface FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}

export interface FadEducationInterface {
    name: string;
    type: string;
}

export interface FadAmenitiesInterface {
    type: string;
}

export interface FadContractsInterface {
    hospitalAffiliations: FadHospitalAffiliationsInterface[];
    groupAffiliations: FadGroupAffiliationsInterface[];
    identifiers: FadIdentifiersInterface[];
    awards: FadAwardsInterface[];
    pcpId: string;
    acceptingNewPatients: string;
}

export interface FadHospitalAffiliationsInterface {
    name: string;
    facilityId: number;
    facilityLocationId: number;
    address: string;
}
export interface FadGroupAffiliationsInterface {
    name: string;
    facilityId: number;
    facilityLocationId: number;
}
export interface FadIdentifiersInterface {
    typeCode: string;
    value: string;
}
export interface FadAwardsInterface {
    name: string;
    awdAuthorityCode: string;
    typeCode: string;
}

