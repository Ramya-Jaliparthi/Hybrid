import {
    FadFacilityProfileRequestModelInterface,
    FadAmenitiesInterface, FadEducationInterface, FadContractsInterface,
    FadHospitalAffiliationsInterface, FadReviewsListInterface,
    FadAwardsInterface, FadIdentifiersInterface, FadGroupAffiliationsInterface,
    FadFacilityResponseModelInterface,
    FadLocationDetailsInterface,
    FacilityInterface
} from "./interfaces/fad-facility-profile-details.interface";
import { clamp } from "ionic-angular/util/util";
import { GeneralError } from "../../../models/generic-app.model";

export class FadFacilityProfileRequestModel implements FadFacilityProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    facilityId: number;
    networkId: number;

    getGeoLocation(): string {
        return this.geoLocation;
    }
    setGeoLocation(geoLocation: string): FadFacilityProfileRequestModelInterface {
        this.geoLocation = geoLocation;
        return this;
    }

    getLocationId(): number {
        return this.locationId;
    }

    setLocationId(locationId: number): FadFacilityProfileRequestModelInterface {
        this.locationId = locationId;
        return this;
    }

    getFacility(): number {
        return this.facilityId;
    }
    setFacility(facilityId: number): FadFacilityProfileRequestModelInterface {
        this.facilityId = facilityId;
        return this;
    }

    getNetworkId(): number {
        return this.networkId;
    }
    setNetworkId(networkId: number): FadFacilityProfileRequestModelInterface {
        this.networkId = networkId;
        return this;
    }

}

export class FadFacilityResponseModel implements FadFacilityResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
    facility: FacilityInterface;
    locations: any[];
}

export class FadEducationModel implements FadEducationInterface {
    name: string;
    type: string;
}


export class FadContractsModel implements FadContractsInterface {
    hospitalAffiliations: FadHospitalAffiliationsModel[];
    groupAffiliations: FadGroupAffiliationsModel[];
    identifiers: FadIdentifiersModel[];
    awards: FadAwardsModel[];
    pcpId: string;
    acceptingNewPatients: string;
}

export class FadLocationDetailsModel extends FadContractsModel implements FadLocationDetailsInterface {
    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
    amenities: FadAmenitiesModel[];
    // contracts: FadContractsModel[];
}

export class FadAmenitiesModel implements FadAmenitiesInterface {
    type: string;
}


export class FadHospitalAffiliationsModel implements FadHospitalAffiliationsInterface {
    name: string;
    facilityId: number;//1.5,
    facilityLocationId: number;//1.5,
    address: string;
}

export class FadGroupAffiliationsModel implements FadGroupAffiliationsInterface {
    name: string;
    facilityId: number;//1.5,
    facilityLocationId: number;//1.5,
}

export class FadIdentifiersModel implements FadIdentifiersInterface {
    typeCode: string;
    value: string;
}

export class FadAwardsModel implements FadAwardsInterface {
    name: string;
    awdAuthorityCode: string;
    typeCode: string;
}

export class FadReviewsListModel implements FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}