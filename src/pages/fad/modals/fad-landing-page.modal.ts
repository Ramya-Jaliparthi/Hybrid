import {
  FadLandingPageCompInputInterface,
  FadAutoCompleteOptionForSearchTextInterface,
  FadAutoCompleteComplexOptionInterface,
  FadLinkOptionInterface,
  FadLandingPageSearchControlsModelInterface,
  FadLandingPageSearchControlValuesInterface,
  FadLandingPageCompOutputInterface,
  LandingPageResponseCacheModelInterface
} from './interfaces/fad-landing-page.interface';
import { FadLandingPageComponentMode } from './types/fad.types';
import { FormControl } from '@angular/forms';



export class FadLandingPageCompInput implements FadLandingPageCompInputInterface {
  componentMode: FadLandingPageComponentMode;
  fadBaseSearchModel: FadLandingPageSearchControlValues;
}

export class FadLandingPageCompOutput implements FadLandingPageCompOutputInterface {
  public searchCriteria: FadLandingPageSearchControlValues;
}

export class FadAutoCompleteOptionForSearchText implements FadAutoCompleteOptionForSearchTextInterface {
  public category: string = '';
  public options: FadAutoCompleteComplexOptionInterface[] = [];

  public setCategory(category: string): FadAutoCompleteOptionForSearchTextInterface {
    this.category = category;
    return this;
  }
  public addOption(option: FadAutoCompleteComplexOptionInterface): FadAutoCompleteOptionForSearchTextInterface {
    this.options.push(option);
    return this;
  }
}

export class FadAutoCompleteComplexOption implements FadAutoCompleteComplexOptionInterface {
  public simpleText: string = '';
  public contextText: string = '';
  public infoText: string = '';
  public link: FadLinkOptionInterface;
  public profileType: string = '';
  public profileId: any;
  public resourceTypeCode: string;
  public geoLocation: string;

  public setSimpleText(simpleText: string): FadAutoCompleteComplexOptionInterface {
    this.simpleText = simpleText;
    return this;
  }
  public setContextText(contextText: string): FadAutoCompleteComplexOptionInterface {
    this.contextText = contextText;
    return this;
  }
  public setInfoText(infoText: string): FadAutoCompleteComplexOptionInterface {
    this.infoText = infoText;
    return this;
  }
  public setLink(text: string, href: string) {
    this.link = new FadLinkOption();
    this.link.text = text;
    this.link.href = href;
    return this;
  }
  public setProfileType(profileType: string): FadAutoCompleteComplexOptionInterface {
    this.profileType = profileType;
    return this;
  }
  public setProfileId(profileId: any): FadAutoCompleteComplexOptionInterface {
    this.profileId = profileId;
    return this;
  }
  public setResourceTypeCode(resourceTypeCode: any): FadAutoCompleteComplexOptionInterface {
    this.resourceTypeCode = resourceTypeCode;
    return this;
  }
  public setGeoLocation(geoLocation: string): FadAutoCompleteComplexOptionInterface {
    this.geoLocation = geoLocation;
    return this;
  }
}

class FadLinkOption implements FadLinkOptionInterface {
  public text: string;
  public href: string;
}

export class FadLandingPageSearchControlsModel implements FadLandingPageSearchControlsModelInterface {
  public searchTypeAheadControl: FormControl;
  public zipCodeTypeAheadControl: FormControl;
  public dependantNameControl: FormControl;
  public planControl: FormControl;

  private searchControlValues: FadLandingPageSearchControlValues;

  constructor() {
    this.searchTypeAheadControl = new FormControl();
    this.zipCodeTypeAheadControl = new FormControl();
    this.dependantNameControl = new FormControl();
    this.planControl = new FormControl();
  }

  public getValues(): FadLandingPageSearchControlValues {
    if (!this.searchControlValues) {
      this.searchControlValues = new FadLandingPageSearchControlValues();
    }

    this.searchControlValues.searchText = this.searchTypeAheadControl.value;
    this.searchControlValues.zipCode = this.zipCodeTypeAheadControl.value;
    this.searchControlValues.dependantName = this.dependantNameControl.value;
    this.searchControlValues.planName = this.planControl.value;
    return this.searchControlValues;
  }

  public setValues(searchControlValues: FadLandingPageSearchControlValues): FadLandingPageSearchControlsModelInterface {
    if (!searchControlValues) {
      searchControlValues = new FadLandingPageSearchControlValues();
    }
    this.searchControlValues = searchControlValues;
    try {
      this.searchTypeAheadControl.setValue(searchControlValues.searchText);
      this.zipCodeTypeAheadControl.setValue(searchControlValues.zipCode);
      this.dependantNameControl.setValue(searchControlValues.dependantName);
      this.planControl.setValue(searchControlValues.planName);
    } catch (ignoreException) {
      // if the controls are valid and alive, update their values, else ignore

    }
    return this;
  }

  public setControls(searchControl: FadLandingPageSearchControlsModelInterface): FadLandingPageSearchControlsModelInterface {
    if (!searchControl) {
      searchControl = new FadLandingPageSearchControlsModel();
    }
    this.searchTypeAheadControl = searchControl.searchTypeAheadControl;
    this.planControl = searchControl.planControl;
    this.zipCodeTypeAheadControl = searchControl.zipCodeTypeAheadControl;
    this.dependantNameControl = searchControl.dependantNameControl;

    this.searchControlValues = new FadLandingPageSearchControlValues();
    this.searchControlValues.searchText = searchControl.searchTypeAheadControl.value;
    this.searchControlValues.zipCode = searchControl.zipCodeTypeAheadControl.value;
    this.searchControlValues.dependantName = searchControl.dependantNameControl.value;
    this.searchControlValues.planName = searchControl.planControl.value;

    return this;
  }
}

export class FadLandingPageSearchControlValues implements FadLandingPageSearchControlValuesInterface {
  public searchText: string = '';
  public zipCode: string = '';
  public dependantName: string = '';
  public planName: FadAutoCompleteComplexOptionInterface;

  public getSearchText(): string {
    return this.searchText;
  }
  public setSearchText(searchText: string): FadLandingPageSearchControlValues {
    this.searchText = searchText;
    return this;
  }

  public getZipCode(): string {
    return this.zipCode;
  }
  public setZipCode(zipCode: string): FadLandingPageSearchControlValues {
    this.zipCode = zipCode;
    return this;
  }

  public getDependantName(): string {
    return this.dependantName;
  }
  public setDependantNamme(dependantName: string): FadLandingPageSearchControlValues {
    this.dependantName = dependantName;
    return this;
  }

  public getPlanName(): FadAutoCompleteComplexOptionInterface {
    return this.planName;
  }
  public setPlanName(planName: FadAutoCompleteComplexOptionInterface): FadLandingPageSearchControlValues {
    this.planName = planName;
    return this;
  }
}

export class LandingPageResponseCacheModel implements LandingPageResponseCacheModelInterface {
  public dependantsList: string[] = null;
  public planOptions: FadAutoCompleteOptionForSearchText[] = null;
  public zipCodeOptions: string[] = null;
}
