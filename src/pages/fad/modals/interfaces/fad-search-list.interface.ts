import { FadVitalsProfessionalsSearchResponseModelInterface, FadVitalsFacilitiesSearchResponseModelInterface } from "./fad-vitals-collection.interface";

export interface FadSearchListComponentOutputModelInterface {

}

export interface FadSearchListComponentInputModelInterface {
    searchResults: FadVitalsProfessionalsSearchResponseModelInterface;
}

export interface FadFacilityListComponentOutputModelInterface {

}

export interface FadFacilityListComponentInputModelInterface {
    searchResults: FadVitalsFacilitiesSearchResponseModelInterface;
}

export interface SortInterface {
    value: string;
    selected: boolean;
}
