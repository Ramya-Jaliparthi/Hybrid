import { FadProfileCardComponentMode } from '../types/fad.types';
import { FadFacility } from '../getSearchByFacility.model';
//import { FVProSRProfessionalInSearchEntity } from '../fad-vitals-professionals-search-response.model';

export interface FadFacilityCardComponentInputModelInterface {
    mode: FadProfileCardComponentMode;
    facility: FadFacility;
}

export interface FadFacilityCardComponentOutputModelInterface {
    facility: FadFacility;
    isSelected: boolean;
    // selectedProfessionals: FVProSRProfessionalInSearchEntity[];
    // addSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
    // removeSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
}

