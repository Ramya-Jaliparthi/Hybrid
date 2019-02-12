import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavController, NavParams } from 'ionic-angular';
import { FadPage } from '../fad-landing/fad';
import { FadMedicalIndexPage } from '../fad-medical-index/fad-medical-index.component';
import { FadDoctorProfilePage } from '../fad-doctor-profile/fad-doctor-profile';
import { FadFacilityProfilePage } from '../fad-facility-profile/fad-facility-profile';
import { FadLandingPageSearchResultsPage } from '../fad-landing-page-search-results/fad-landing-page-search-results';
import { LoginComponent } from '../../login/login.component';
import { RegistrationComponent } from '../../login/registration.component';
import { FadSearchType, FadSearchCategories, FadResourceTypeCode } from '../modals/types/fad.types';
import { FadHomeSearchService } from './fad-home-search.service';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { FadService } from '../fad-landing/fad.service';
import {
  FadVitalsAutoCompleteSearchRequestModelInterface,
  FadVitalsAutoCompleteSearchResponseModelInterface,
  FadZipCodeSearchResponseModelInterface,
  FadPlanSearchResponseModelInterface,
  FadVitalsSearchHistoryResponseModelInterface,
  FadVitalsZipCodeSearchRequestModelInterface,
  DoctorProfileSearchRequestModelInterface,
  FadVitalsProfessionalsSearchResponseModelInterface,
  FacilityProfileSearchRequestModelInterface,
  FadVitalsFacilitiesSearchResponseModelInterface,
  FADPlanSearchRequestModelInterface
} from '../modals/interfaces/fad-vitals-collection.interface';
import {
  FadLandingPageCompInputInterface,
  FadAutoCompleteOptionForSearchTextInterface,
  FadAutoCompleteComplexOptionInterface,
  FadLinkOptionInterface,
  FadLandingPageSearchControlValuesInterface,
  FadLandingPageCompOutputInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
  FadAutoCompleteOptionForSearchText,
  FadAutoCompleteComplexOption, FadLandingPageSearchControlsModel,
  FadLandingPageSearchControlValues, FadLandingPageCompOutput, LandingPageResponseCacheModel
} from '../modals/fad-landing-page.modal';
import { FadVitalsAutoCompleteSearchRequestModel, FPSRPlan, FadVitalsZipCodeSearchRequestModel, DoctorProfileSearchRequestModel, FacilityProfileSearchRequestModel, FADPlanSearchRequestModel } from '../modals/fad-vitals-collection.model';
import { FadConstants } from '../constants/fad.constants';
import { MatchTextHighlightPipe } from '../../../pipes/match-text-hightlight/match-text-hightlight.pipe'
import { FadDoctorProfileDetailService } from '../fad-doctor-profile/fad-doctor-profile.service';
import { FadFacilityProfileDetailService } from '../fad-facility-profile/fad-facility-profile.service';
/**
 * Generated class for the FadHomeSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad-home-search',
  templateUrl: 'fad-home-search.html',
})
export class FadHomeSearchPage implements OnDestroy {
  public fadConstants = FadConstants;
  searchText: string;
  searchType: string;
  placeholderText: string;
  fadSearchType = FadSearchType;
  zipCodeList;
  planList = [];
  filteredPlanList = [];
  searchSubscription;
  autoCompleteOptionsForSearchText = [];
  specialtyList;
  procedureList;
  doctorList;
  facilityList;
  textToHighlight: string = '';
  searchForm: FormGroup;
  onEnter: boolean = false;
  debounceTime: number = 450;
  @ViewChild('search') search;
  @ViewChild('allDoctors') allDoctors;
  @ViewChild('allFacility') allFacility;
  @ViewChildren('specialtyElements') specialtyElements;
  @ViewChildren('zipElements') zipElements;
  @ViewChildren('planElements') planElements;


  constructor(public navCtrl: NavController, public navParams: NavParams, private fadSearchService: FadHomeSearchService, private fadService: FadService,
    public fb: FormBuilder, private authService: AuthenticationService, public ngzone: NgZone, private fadFacilityProfileDetailService: FadFacilityProfileDetailService, private fadDoctorProfileDetailService: FadDoctorProfileDetailService) {
    this.searchType = this.navParams.get('searchType');
    switch (this.searchType) {
      case FadSearchType.plan:
        this.placeholderText = 'Select a plan';
        if (this.fadService.plan) {
          this.searchText = this.fadService.plan.simpleText;
        }
        break;
      case FadSearchType.zip:
        this.placeholderText = 'Zip code or city, state';
        this.searchText = this.fadService.zip.profileId;
        break;
      case FadSearchType.member:
        this.placeholderText = 'Select a member';
        this.searchText = this.fadService.member;
        break;
      default:
        this.placeholderText = 'Doctor, procedure, hospital, facility';
        if (this.fadService.search) {
          this.searchText = this.fadService.search.contextText || this.fadService.search.simpleText;
        }
    }

    this.searchForm = this.fb.group({
      searchTextField: ['', [this.searchFieldValidator(this.searchType)]],
    });

    this.searchSubscription = this.searchForm.get('searchTextField').valueChanges.debounceTime(this.debounceTime)
      .distinctUntilChanged().switchMap((searchText): any => {
        return this.onSearch({});
      }).subscribe(response => {
        // response
      }, error => {
        this.authService.showAlert('', error.displaymessage || error.errormessage);
      });
  }

  ionViewDidEnter() {
    this.setFocus();
  }

  ngOnDestroy() {
    this.requestUnsubscribe();
  }

  requestUnsubscribe() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  onSearch(event) {
    this.zipCodeList = [];
    this.planList = [];
    this.specialtyList = [];
    this.procedureList = [];
    this.doctorList = [];
    this.facilityList = [];
    this.textToHighlight = this.searchText;

    if (this.searchType === FadSearchType.zip && this.searchText && this.searchText.length > 2) {
      // cancelling the api event if form is not valid //
      if (this.searchForm && !this.searchForm.valid) {
        return Observable.of(null);
      }
      return this.searchZipObservable().map(response => {
        const zipCodeList = (new FadAutoCompleteOptionForSearchText());
        response.cities.map((cityData) => {
          const locationListOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
          locationListOption.setContextText(`${cityData.zip} - ${cityData.city}, ${cityData.state_code}`)
            .setInfoText(`${cityData.zip} - ${cityData.city}, ${cityData.state_code}`).setProfileId(cityData.zip)
            .setGeoLocation(`${cityData.geo}`);

          zipCodeList.options.push(locationListOption);
        });

        this.zipCodeList = zipCodeList;
        this.zipCodeList.options = this.zipCodeList.options.filter(option => {
          return option.contextText.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
        });

        if (this.zipCodeList.options.length == 0) {
          this.searchForm.get('searchTextField').setErrors({ 'zipNoMatch': true })
        }
        this.setFocus();
      });
    } else if (this.searchType === FadSearchType.plan) {
      return this.searchPlanObservable().map(response => {
        const planOption = new FadAutoCompleteOptionForSearchText();
        response.plans.map(plan => {
          planOption.addOption((new FadAutoCompleteComplexOption()).setSimpleText(plan.name).setProfileId(plan.id));
        });
        this.planList.push(planOption);
        this.filteredPlanList = this.planList[0].options.filter(option => option.simpleText.toLowerCase().indexOf(this.searchText ? this.searchText.toLowerCase() : '') !== -1);
        this.setFocus();
      });
    } else if (this.searchType === FadSearchType.search && this.searchText && this.searchText.length > 2) {
      return this.searchAllObservable().map(response => {
        if (response) {
          console.log('all response', response);
          const specialtyList = (new FadAutoCompleteOptionForSearchText()).setCategory(FadConstants.areYouLookingFor);
          // const procedureList = (new FadAutoCompleteOptionForSearchText()).setCategory(`${FadConstants.allProcedureText} "${this.searchText}"`);
          const doctorsList = (new FadAutoCompleteOptionForSearchText()).setCategory(`${FadConstants.allProfessionalText} "${this.searchText}"`);
          const facilityList = (new FadAutoCompleteOptionForSearchText()).setCategory(`${FadConstants.allFacilityText} "${this.searchText}"`);

          response.searchSpecialties.map((speciality) => {
            const specialtyOption: FadAutoCompleteComplexOption = new FadAutoCompleteComplexOption();
            specialtyOption.setSimpleText(speciality.name).setProfileId(speciality.id).setProfileType(FadSearchCategories.speciality).setResourceTypeCode(speciality.resourceTypeCode);
            specialtyList.options.push(specialtyOption);
          });

          response.professionals.map((professional) => {
            const doctorNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
            doctorNameOption.setContextText(professional.name)
              .setInfoText(professional.specialty).setProfileId(professional.id).setProfileType(FadSearchCategories.professional);
            doctorsList.options.push(doctorNameOption);
          });
          response.facilities.map((facility) => {
            const facilityNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
            facilityNameOption.setContextText(facility.name)
              .setInfoText(facility.specialty).setProfileId(facility.id).setProfileType(FadSearchCategories.facility);
            facilityList.options.push(facilityNameOption);
          });

          this.specialtyList = specialtyList;
          // this.procedureList = procedureList;
          this.doctorList = doctorsList;
          this.facilityList = facilityList;
          // this.filterAutoCompleteSearchOptions(this.searchText);
        }
        this.ngzone.run(() => {
          this.setFocus();
        });
      });
    } else {
      return Observable.of(null);
    }
  }

  private filterAutoCompleteSearchOptions(searchText: string): FadAutoCompleteOptionForSearchText[] {
    let filteredOptions: FadAutoCompleteOptionForSearchText[] = [];
    try {
      if (searchText && searchText.length > 2) {
        this.specialtyList.options = this.specialtyList.options.filter(option => {
          return option.simpleText.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        });
        // this.procedureList.options = this.procedureList.options.filter(option => {
        //   return option.contextText.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        // });
        this.doctorList.options = this.doctorList.options.filter(option => {
          return option.contextText.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        });
        this.facilityList.options = this.facilityList.options.filter(option => {
          return option.contextText.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
        });
      }
    } catch (exception) {
      console.log(exception);
    }
    return filteredOptions;
  }

  searchZipObservable() {
    return this.searchZip(this.searchText);
  }

  searchPlanObservable() {
    return this.searchPlan(this.searchText);
  }

  searchAllObservable() {
    return this.searchAll(this.searchText);
  }

  searchAll(val) {
    const vitalsAutoCompleteSearchRequest: FadVitalsAutoCompleteSearchRequestModelInterface = new FadVitalsAutoCompleteSearchRequestModel();
    vitalsAutoCompleteSearchRequest.searchParameter = this.searchText;
    vitalsAutoCompleteSearchRequest.networkId = FadConstants.defaultNetwork;
    vitalsAutoCompleteSearchRequest.geoLocation = this.fadService.zip.geoLocation ? this.fadService.zip.geoLocation : '';
    vitalsAutoCompleteSearchRequest.page = 1;
    vitalsAutoCompleteSearchRequest.limit = 5;

    return this.fadSearchService.getVitalsSearchResponse(vitalsAutoCompleteSearchRequest);
  }

  searchPlan(val) {
    const planSearchRequest: FADPlanSearchRequestModelInterface = new FADPlanSearchRequestModel();
    planSearchRequest.uid = '';
    return this.fadSearchService.getVitalsPlanInfo(planSearchRequest)
  }

  searchZip(val) {
    const vitalsZipCodeSearchRequest: FadVitalsZipCodeSearchRequestModelInterface = new FadVitalsZipCodeSearchRequestModel();
    vitalsZipCodeSearchRequest.place = val;
    vitalsZipCodeSearchRequest.limit = 10;
    vitalsZipCodeSearchRequest.page = 1;

    return this.fadSearchService.getVitalsZipCodeInfo(vitalsZipCodeSearchRequest)
  }

  cancelSearch() {
    if (this.searchType === FadSearchType.search) {
      this.fadService.search = null;
    }
    this.navCtrl.pop();
  }

  planSelect(event, data) {
    event.preventDefault();
    this.fadService.plan = data || new FadAutoCompleteComplexOption().setSimpleText('I don’t know my plan').setProfileId(-1);;
    this.navCtrl.push(FadPage);
  }

  zipSelect(event, data) {
    event.preventDefault();
    this.fadService.zip = data;
    this.navCtrl.push(FadPage);
  }

  memberSelect(event, data) {
    event.preventDefault();
    this.fadService.member = data;
    this.navCtrl.push(FadPage);
  }

  procedureSelect(event, data) {
    event.preventDefault();
    this.fadService.search = data;
    this.navCtrl.push(FadPage);
  }

  specialtySelect(event, data) {
    event.preventDefault();
    this.fadService.search = data;
    if (this.onEnter) {
      this.navCtrl.push(FadLandingPageSearchResultsPage);
    } else {
      this.navCtrl.push(FadPage);
    }
    this.onEnter = false;
  }

  doctorSelect(event, data) {
    event.preventDefault();
    this.fadService.search = data;
    this.fadDoctorProfileDetailService.doctorProfile = data.profileId;
    this.navCtrl.push(FadDoctorProfilePage); // Goto DoctorProfile
  }

  facilitySelect(event, data) {
    event.preventDefault();
    this.fadService.search = data;
    this.fadFacilityProfileDetailService.facilityProfile = data.profileId;
    this.navCtrl.push(FadFacilityProfilePage); // Goto FacilityProfile
  }

  searchOnEnter(event) {
    let ev = new MouseEvent('click', { bubbles: true });
    switch (this.searchType) {
      case FadSearchType.plan:
        if (this.planElements && this.planElements.first) {
          this.planElements.first.nativeElement.dispatchEvent(ev);
        }
        break;
      case FadSearchType.zip:
        if (this.zipElements && this.zipElements.first) {
          this.zipElements.first.nativeElement.dispatchEvent(ev);
        }
        break;
      case FadSearchType.member:
        // To do
        break;
      default:
        if (this.specialtyList && this.specialtyList.options && this.specialtyList.options.length > 0) {
          if (this.specialtyElements && this.specialtyElements.first) {
            this.onEnter = true;
            this.specialtyElements.first.nativeElement.dispatchEvent(ev);
          }
          break;
        }
        if (this.doctorList && this.doctorList.options.length > 0 && this.allDoctors) {
          this.allDoctors.nativeElement.dispatchEvent(ev);
          break;
        }
        if (this.facilityList && this.facilityList.options.length > 0 && this.allFacility) {
          this.allFacility.nativeElement.dispatchEvent(ev);
          break;
        }
    }

  }

  allSpecialitySelect(event) {
    event.preventDefault();
    this.navCtrl.push(FadMedicalIndexPage);
  }

  allProcedureSelect(event) {
    event.preventDefault();
  }

  allDoctorsSelect(event) {
    event.preventDefault();
    const doctorNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
    doctorNameOption.setContextText(this.searchText)
      .setInfoText('').setProfileId(-1).setProfileType(FadSearchCategories.allProfessional);
    this.fadService.search = doctorNameOption;
    this.navCtrl.push(FadLandingPageSearchResultsPage);
  }

  allFacilitiesSelect(event) {
    event.preventDefault();
    const facilityNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
    facilityNameOption.setContextText(this.searchText)
      .setInfoText('').setProfileId(-1).setProfileType(FadSearchCategories.allFacility);
    this.fadService.search = facilityNameOption;
    this.navCtrl.push(FadLandingPageSearchResultsPage);
  }

  goToLogin(event) {
    event.preventDefault();
    this.navCtrl.push(LoginComponent);
  }

  goToRegistration(event) {
    event.preventDefault();
    this.navCtrl.push(RegistrationComponent);
  }

  searchForMatchingText() {
    console.log('Search tap');
  }

  getMatchHighlightedText(optionText: string): string {
    if (!optionText) {
      return '';
    }
    return (new MatchTextHighlightPipe()).transform(optionText, this.searchText);
  }

  clearTargetValue() {
    this.searchText = '';
    this.onSearch({});
    this.setFocus();
  }

  setFocus() {
    setTimeout(() => {
      this.search.setFocus();
    }, 250);
  }

  private searchFieldValidator(searchType) {
    return function (control: AbstractControl): { [key: string]: boolean } | null {
      var validZipCodeRegxp = /^(?:[\d\s-]+|[a-zA-Z\s-]+)$/;
      // if(validZipCodeRegxp.test(control.value))
      // { console.log("Pass"); } else {  console.log("Fail"); }
      if (searchType === FadSearchType.zip && !validZipCodeRegxp.test(control.value)) {
        return { 'invalidZipSearch': true };
      }
      return null;
    };
  }


}
