import { HashMapInterface } from "./hash-map.interface";

export interface FadSearchFilterComponentOutputModelInterface {
    searchCriteriaData: FadSearchFilterResponseModelInterface;
    filterOverlayFlag: boolean;
}

export interface FadSearchFilterComponentInputModelInterface {
    searchCriteriaData: FadSearchFilterResponseModelInterface;
}

export interface FadSearchFilterResponseModelInterface {

    sortByFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    distanceFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    genderFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    languageFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    ratingFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    agesTreatedFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    specialitiesFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    disordersTreatedFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    treatmentMethodFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    hospitalsAndMedicalGroupsFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    blueDistinctionRecognitionFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    awardsFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;
    clinicalQualityMeasureFilterMap: HashMapInterface<FadSearchCriteriaItemInterface>;

    addSortByFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addDistanceFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addGenderFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addLanguageFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addRatingFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addAgesTreatedFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addSpecialitiesFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addDisordersTreatedFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addTreatmentMethodFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addHospitalsAndMedicalGroupsFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addBlueDistinctionRecognitionFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addAwardsFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
    addClinicalQualityMeasureFilter(searchCriteriaItem: FadSearchCriteriaItemInterface): FadSearchFilterResponseModelInterface;
}

export interface FadSearchCriteriaItemInterface {
    criteriaName: string;
    criteriaSelected: boolean;
    matchingResultsCount?: number;

    setCriteriaName(criteriaName: string): FadSearchCriteriaItemInterface;
    setCriteriaSelected(criteriaSelected: boolean): FadSearchCriteriaItemInterface;
    setMatchingResultsCount(matchingResultsCount: number): FadSearchCriteriaItemInterface;
}
