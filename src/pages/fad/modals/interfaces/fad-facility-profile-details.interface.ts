import { GeneralErrorInterface } from "../../../interfaces/generic-app-models.interface";
import { GeneralError } from "../../../../models/generic-app.model";

export interface FadFacilityProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    facilityId: number;
    networkId: number;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): FadFacilityProfileRequestModelInterface;

    getLocationId(): number;
    setLocationId(locationId: number): FadFacilityProfileRequestModelInterface;

    getFacility(): number;
    setFacility(FacilityId: number): FadFacilityProfileRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): FadFacilityProfileRequestModelInterface;

}

export interface FadFacilityResponseModelInterface extends GeneralError {
    facility: FacilityInterface;
    locations: any[];
}

export interface FacilityInterface {
    facilityName: string;
    specialty: string;
    facilityId: number;
    address: string;
    phone: string;
    geoLocation: GeoLocationInterface;
    amenities: AmenityInterface[];
    awards: AwardInterface[];
    identifiers: IdentifierInterface[];
    ratings: RatingsInterface;
    quality: QualityInterface[];
    additionalInformation: AdditionalInformationInterface[];
}

export interface GeoLocationInterface {
    latitude: number;
    longitude: number;
}

export interface AmenityInterface {
    type: string;
}

export interface AwardInterface {
    name: string;
    typeCode: string;
}

export interface IdentifierInterface {
    typeCode: string;
    value: string;
}

export interface RatingsInterface {
    overallRating: number;
    percentRecommended: number;
    totalRatings: number;
}

export interface QualityInterface {
    name: string;
    score: number;
}

export interface AdditionalInformationInterface {
    typeCode: string;
    type: string;
}

// export interface FadFacilityResponseModelInterface extends GeneralError {
//     facilityName: string; // This is the city/state of the location
//     specialty: string; // This is the name of the city
//     languages: string;
//     education: FadEducationInterface[];
//     locations: FadLocationDetailsInterface[];
//     reviews: FadReviewsListInterface;
// }

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

