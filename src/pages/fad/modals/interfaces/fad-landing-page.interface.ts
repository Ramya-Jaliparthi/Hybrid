import { FadLandingPageComponentMode } from '../types/fad.types';
import { FormControl } from '@angular/forms';
import { FadAutoCompleteComplexOption } from '../fad-landing-page.modal';



export interface FadLandingPageCompInputInterface {
    componentMode: FadLandingPageComponentMode;
    fadBaseSearchModel: FadLandingPageSearchControlValuesInterface;
}

export interface FadLandingPageCompOutputInterface {
    searchCriteria: FadLandingPageSearchControlValuesInterface;
}

export interface FadAutoCompleteOptionForSearchTextInterface {
    category: string;
    options: FadAutoCompleteComplexOptionInterface[];

    setCategory(category: string): FadAutoCompleteOptionForSearchTextInterface;
    addOption(option: FadAutoCompleteComplexOptionInterface): FadAutoCompleteOptionForSearchTextInterface;
}

export interface FadAutoCompleteComplexOptionInterface {
    simpleText: string;
    contextText: string;
    infoText: string;
    link: FadLinkOptionInterface;
    profileType: string;
    resourceTypeCode: string;
    profileId: any;
    geoLocation: string;

    setSimpleText(simpleText: string): FadAutoCompleteComplexOptionInterface;
    setContextText(contextText: string): FadAutoCompleteComplexOptionInterface;
    setInfoText(infoText: string): FadAutoCompleteComplexOptionInterface;
    setLink(text: string, href: string): FadAutoCompleteComplexOptionInterface;
    setProfileType(profileType: string): FadAutoCompleteComplexOptionInterface;
    setProfileId(profileId: any): FadAutoCompleteComplexOptionInterface;
    setResourceTypeCode(resourceTypeCode: any): FadAutoCompleteComplexOptionInterface;
    setGeoLocation(geoLocation: string): FadAutoCompleteComplexOptionInterface;
}

export interface FadLinkOptionInterface {
    text: string;
    href: string;
}

export interface FadLandingPageSearchControlsModelInterface {
    searchTypeAheadControl: FormControl;
    zipCodeTypeAheadControl: FormControl;
    dependantNameControl: FormControl;
    planControl: FormControl;

    getValues(): FadLandingPageSearchControlValuesInterface;
    setValues(searchControlValues: FadLandingPageSearchControlValuesInterface): FadLandingPageSearchControlsModelInterface;
    setControls(searchControlValues: FadLandingPageSearchControlsModelInterface): FadLandingPageSearchControlsModelInterface;
}

export interface FadLandingPageSearchControlValuesInterface {
    searchText: string;
    zipCode: string;
    dependantName: string;
    planName: FadAutoCompleteComplexOptionInterface;

    getSearchText(): string;
    setSearchText(searchText: string): FadLandingPageSearchControlValuesInterface;

    getZipCode(): string;
    setZipCode(zipCode: string): FadLandingPageSearchControlValuesInterface;

    getDependantName(): string;
    setDependantNamme(dependantName: string): FadLandingPageSearchControlValuesInterface;

    getPlanName(): FadAutoCompleteComplexOptionInterface;
    setPlanName(planName: FadAutoCompleteComplexOptionInterface): FadLandingPageSearchControlValuesInterface;
}

export interface LandingPageResponseCacheModelInterface {
    dependantsList: string[];
    planOptions: FadAutoCompleteOptionForSearchTextInterface[];
    zipCodeOptions: string[];
}
