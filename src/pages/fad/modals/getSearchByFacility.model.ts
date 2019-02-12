

import {
    GetSearchByFacilityRequestModelInterface,
    GetSearchByFacilityResponseModelInterface,
    FadFacilityInterface,
    Facets,
    AcceptingNewPatientsInterface,
    TechSavvyInterface,
    InNetworkInterface
} from './interfaces/getSearchByFacility-models.interface';
import { GetSearchByProfessionalRequestModel, FadLocationDetails, FadReviewsList } from './getSearchByProfessional.model';
import { GeneralError } from '../../../models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class GetSearchByFacilityRequestModel extends GetSearchByProfessionalRequestModel
    implements GetSearchByFacilityRequestModelInterface {

}

export class GetSearchByFacilityResponseModel extends GeneralError implements GetSearchByFacilityResponseModelInterface {
    facility: FadFacility[];
    totalCount: number;
    facets: Facets;
}

export class FadFacility implements FadFacilityInterface {
    facilityId: number;
    id: string;
    type: string;
    name: string;
    specialty: string; // This is the name of the city
    locations: FadLocationDetails[];
    reviews: FadReviewsList;
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



