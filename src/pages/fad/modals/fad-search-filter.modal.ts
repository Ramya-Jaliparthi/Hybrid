import {
    FadSearchFilterComponentOutputModelInterface,
    FadSearchFilterComponentInputModelInterface,
    FadSearchFilterResponseModelInterface,
    FadSearchCriteriaItemInterface
} from './interfaces/fad-search-filter.interface';
import { HashMap } from './hash-map.model';

export class FadSearchFilterComponentOutputModel implements FadSearchFilterComponentOutputModelInterface {
    searchCriteriaData: FadSearchFilterResponseModel = new FadSearchFilterResponseModel();
    filterOverlayFlag: boolean = false;
}

export class FadSearchFilterComponentInputModel implements FadSearchFilterComponentInputModelInterface {
    searchCriteriaData: FadSearchFilterResponseModelInterface = new FadSearchFilterResponseModel();
}

export class FadSearchFilterResponseModel implements FadSearchFilterResponseModelInterface {

    sortByFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    distanceFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    genderFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    languageFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    ratingFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    agesTreatedFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    specialitiesFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    disordersTreatedFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    treatmentMethodFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    hospitalsAndMedicalGroupsFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    blueDistinctionRecognitionFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    awardsFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();
    clinicalQualityMeasureFilterMap: HashMap<FadSearchCriteriaItem> = new HashMap<FadSearchCriteriaItem>();

    addSortByFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.sortByFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addDistanceFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.distanceFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addGenderFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.genderFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addLanguageFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.languageFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addRatingFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.ratingFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addAgesTreatedFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.agesTreatedFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addSpecialitiesFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.specialitiesFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addDisordersTreatedFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.disordersTreatedFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addTreatmentMethodFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.treatmentMethodFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addHospitalsAndMedicalGroupsFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.hospitalsAndMedicalGroupsFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addBlueDistinctionRecognitionFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.blueDistinctionRecognitionFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addAwardsFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.awardsFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
    addClinicalQualityMeasureFilter(searchCriteriaItem: FadSearchCriteriaItem): FadSearchFilterResponseModel {
        this.clinicalQualityMeasureFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }
}

export class FadSearchCriteriaItem implements FadSearchCriteriaItemInterface {
    criteriaName: string;
    criteriaSelected: boolean;
    matchingResultsCount?: number;

    public setCriteriaName(criteriaName: string): FadSearchCriteriaItem {
        this.criteriaName = criteriaName;
        return this;
    }

    public setCriteriaSelected(criteriaSelected: boolean): FadSearchCriteriaItem {
        this.criteriaSelected = criteriaSelected;
        return this;
    }

    public setMatchingResultsCount(matchingResultsCount: number): FadSearchCriteriaItem {
        this.matchingResultsCount = matchingResultsCount;
        return this;
    }
}
