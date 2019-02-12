import { FadProfileCardComponentMode } from '../types/fad.types';
import { FadProfessional } from '../getSearchByProfessional.model';
//import { FVProSRProfessionalInSearchEntity } from '../fad-vitals-professionals-search-response.model';

export interface FadProfileCardComponentInputModelInterface {
    mode: FadProfileCardComponentMode;
    professional: FadProfessional;
}

export interface FadProfileCardComponentOutputModelInterface {
    professional: FadProfessional;
    isSelected: boolean;
    // selectedProfessionals: FVProSRProfessionalInSearchEntity[];
    // addSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
    // removeSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
}

