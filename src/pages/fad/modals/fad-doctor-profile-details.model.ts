import { FadDoctorProfileRequestModelInterface,
        FadAmenitiesInterface, FadEducationInterface, FadContractsInterface, 
        FadHospitalAffiliationsInterface, FadReviewsListInterface, 
        FadAwardsInterface, FadIdentifiersInterface, FadGroupAffiliationsInterface, 
        FadProfessionalResponseModelInterface, 
        FadLocationDetailsInterface} from "./interfaces/fad-doctor-profile-details.interface";
import { clamp } from "ionic-angular/util/util";
import { GeneralError } from "../../../models/generic-app.model";

export class FadDoctorProfileRequestModel implements FadDoctorProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    professionalId: number;
    networkId: number;
    
    getGeoLocation(): string {
        return this.geoLocation;
    }
    setGeoLocation(geoLocation: string): FadDoctorProfileRequestModelInterface {
        this.geoLocation = geoLocation;
        return this;
    }

    getLocationId(): number {
        return this.locationId;
    }

    setLocationId(locationId: number): FadDoctorProfileRequestModelInterface {
        this.locationId = locationId;
        return this;
    }

    getProfessional(): number {
        return this.professionalId;
    }
    setProfessional(professionalId: number): FadDoctorProfileRequestModelInterface {
        this.professionalId = professionalId;
        return this;
    }
    
    getNetworkId(): number {
        return this.networkId;
    }
    setNetworkId(networkId: number): FadDoctorProfileRequestModelInterface {
        this.networkId = networkId;
        return this;
    }
    
}

export class FadProfessionalResponseModel implements FadProfessionalResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
    doctorName: string;
    specialty: string;
    languages: string;
    education: FadEducationModel[];
    locations: FadLocationDetailsModel[];
    reviews: FadReviewsListModel;
}

export class FadEducationModel implements FadEducationInterface {
    name: string;
    type: string;
}


export class FadContractsModel implements FadContractsInterface{
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

export class FadAmenitiesModel implements FadAmenitiesInterface{
    type: string;
}


export class FadHospitalAffiliationsModel implements FadHospitalAffiliationsInterface{
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