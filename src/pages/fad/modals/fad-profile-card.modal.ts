import {
    FadProfileCardComponentOutputModelInterface,
    FadProfileCardComponentInputModelInterface
} from './interfaces/fad-profile-card.interface';
import { FadProfileCardComponentMode } from './types/fad.types';
import { GetSearchByProfessionalRequestModel, FadProfessional } from './getSearchByProfessional.model';
//import { FVProSRProfessionalInSearchEntity } from './fad-vitals-professionals-search-response.model';

export class FadProfileCardComponentOutputModel implements FadProfileCardComponentOutputModelInterface {
    public professional: FadProfessional;
    public isSelected: boolean;


}

export class FadProfileCardComponentInputModel implements FadProfileCardComponentInputModelInterface {
    public mode: FadProfileCardComponentMode = 'ListItem';

    constructor(public professional: FadProfessional) {

    }
}
