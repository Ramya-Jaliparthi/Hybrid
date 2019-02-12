import {
    FadFacilityCardComponentOutputModelInterface,
    FadFacilityCardComponentInputModelInterface
} from './interfaces/fad-facility-card.interface';
import { FadProfileCardComponentMode } from './types/fad.types';
import { GetSearchByFacilityRequestModel, FadFacility } from './getSearchByFacility.model';
//import { FVProSRProfessionalInSearchEntity } from './fad-vitals-professionals-search-response.model';

export class FadFacilityCardComponentOutputModel implements FadFacilityCardComponentOutputModelInterface {
    public facility: FadFacility;
    public isSelected: boolean;


}

export class FadFacilityCardComponentInputModel implements FadFacilityCardComponentInputModelInterface {
    public mode: FadProfileCardComponentMode = 'ListItem';

    constructor(public facility: FadFacility) {

    }
}
