import {
    FadSearchListComponentOutputModelInterface,
    FadSearchListComponentInputModelInterface,
    FadFacilityListComponentInputModelInterface,
    FadFacilityListComponentOutputModelInterface
} from './interfaces/fad-search-list.interface';
import { FadVitalsProfessionalsSearchResponseModelInterface, FadVitalsFacilitiesSearchResponseModelInterface } from './interfaces/fad-vitals-collection.interface';

export class FadSearchListComponentInputModel implements FadSearchListComponentInputModelInterface {
    public searchResults: FadVitalsProfessionalsSearchResponseModelInterface;
}

export class FadSearchListComponentOutputModel implements FadSearchListComponentOutputModelInterface {

}

export class FadFacilityListComponentInputModel implements FadFacilityListComponentInputModelInterface {
    public searchResults: FadVitalsFacilitiesSearchResponseModelInterface;
}

export class FadFacilityListComponentOutputModel implements FadFacilityListComponentOutputModelInterface {

}
