import { FadLandingPageCompInputInterface } from './fad-landing-page.interface';
import {
    FadSearchFilterComponentOutputModelInterface,
    FadSearchFilterComponentInputModelInterface,
    FadSearchFilterResponseModelInterface
} from './fad-search-filter.interface';
import { FadNoDocsPageInputDataModelInterface } from './fad-no-docs-page.interface';
import { FadSearchListComponentOutputModelInterface, FadSearchListComponentInputModelInterface } from './fad-search-list.interface';
import { FadProfileCardComponentInputModelInterface, FadProfileCardComponentOutputModelInterface } from './fad-profile-card.interface';
import { GetSearchByProfessionalResponseModel } from '../getSearchByProfessional.model';
//import { FVProSRProfessionalInSearchEntity } from '../fad-vitals-professionals-search-response.model';


export interface FadLandingPageConsumer {
    miniSearchBarData: FadLandingPageCompInputInterface;
}

export interface FadSearchFilterConsumer {
    searchFilterComponentInput: FadSearchFilterComponentInputModelInterface;
    mobileHideByFilterOverlay: boolean;
    onSearchFilterComponentInteraction(fadSearchFilterComponentOutput: FadSearchFilterComponentOutputModelInterface): void;
    createSearchCriteria(): FadSearchFilterResponseModelInterface;
}

export interface FadNoSearchResultsPageConsumer {
    noSearchResultsPageData: FadNoDocsPageInputDataModelInterface;
    isNoSearchResults: boolean;
}

export interface FadSearchListConsumer {
    searchListComponentInput: FadSearchListComponentInputModelInterface;
    onSearchListComponentInteraction(fadSeachListComponentOutput: FadSearchListComponentOutputModelInterface): void;
}

export interface StarRatingComponentConsumer {

}

export interface FadProfileCardConsumer {
    getProfileCardInput(professional: GetSearchByProfessionalResponseModel): FadProfileCardComponentInputModelInterface;
    onProfileCardComponentInteraction(profileCardCompOutput: FadProfileCardComponentOutputModelInterface): void;
}


