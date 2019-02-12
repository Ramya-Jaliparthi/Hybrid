import { FadSearchCategories } from './../modals/types/fad.types';
import { FadConstants } from './../constants/fad.constants';
import { FadVitalsProfessionalsSearchResponseModelInterface } from './../modals/interfaces/fad-vitals-collection.interface';
import { FadSearchResultsService } from './fad-search-results.service';
import { AuthenticationService } from './../../../providers/login/authentication.service';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FadFacilityListComponentInputModel, FadSearchListComponentInputModel } from '../modals/fad-search-list.modal';
import { FadSearchListComponentInputModelInterface, FadFacilityListComponentInputModelInterface } from '../modals/interfaces/fad-search-list.interface';
import { FadService } from '../fad-landing/fad.service';
import { GetSearchByProfessionalRequestModel } from '../modals/getSearchByProfessional.model';
import { GetSearchByProfessionalRequestModelInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
import { LoginComponent } from '../../login/login.component';
import { RegistrationComponent } from '../../login/registration.component';
import { FadPage } from '../fad-landing/fad';
import { FadVitalsFacilitiesSearchResponseModelInterface } from './../modals/interfaces/fad-vitals-collection.interface';
import { GetSearchByFacilityRequestModel, GetSearchByFacilityResponseModel } from '../../../pages/fad/modals/getSearchByFacility.model';
import { GetSearchByFacilityRequestModelInterface, GetSearchByFacilityResponseModelInterface } from '../../../pages/fad/modals/interfaces/getSearchByFacility-models.interface'

/**
 * Generated class for the FadLandingPageSearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad-landing-page-search-results',
  templateUrl: 'fad-landing-page-search-results.html',
})
export class FadLandingPageSearchResultsPage implements OnInit {
  public isNoSearchResults: boolean = false;
  public mask: any = null;
  public searchResults: FadVitalsProfessionalsSearchResponseModelInterface;
  public facilityResults: FadVitalsFacilitiesSearchResponseModelInterface;
  public search: string;
  public professionalPage: number = 1;
  public facilityPage: number = 1;
  public professionalTotalCount: number;
  public facilityTotalCount: number;
  public infiniteScrollEvent;
  // fad-search-list component consumption requirement
  public searchListComponentInput: FadSearchListComponentInputModelInterface;
  public facilityListComponentInput: FadFacilityListComponentInputModelInterface;
  public resourceTypeCode: string;
  public profileType: string;
  private totalCount: number;
  private pageTitle: string;
  public fadSearchCategories = FadSearchCategories;
  public fadConstants = FadConstants;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthenticationService, private fadSearchResultsService: FadSearchResultsService, public fadService: FadService) {
  }

  ngOnInit() {
    this.search = this.fadService.search.contextText || this.fadService.search.simpleText;
    this.resourceTypeCode = this.fadService.search && this.fadService.search.resourceTypeCode ? this.fadService.search.resourceTypeCode : "";
    this.profileType = this.fadService.search && this.fadService.search.profileType ? this.fadService.search.profileType : "";

    if (this.profileType === FadSearchCategories.allProfessional || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.ProfessionalCode)) {
      this.getFadProfileSearchResults();
      this.pageTitle = "Find a Doctor";
    } else if (this.profileType === FadSearchCategories.allFacility || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.FacilityCode)) {
      this.getFadFacilitySearchResults();
      this.pageTitle = "Find a Facility";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FadLandingPageSearchResultsPage');
    console.log("SERACH DATA", this.fadService);
  }

  private getFadProfileSearchResults(hideMask?: boolean, filterData?: any): void {
    if (!hideMask) {
      this.mask = this.authService.showLoadingMask('Accessing fad search results ...');
      this.mask.present();
    }

    const vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface = new GetSearchByProfessionalRequestModel();

    vitalsSearchRequestbyProfessional.setGeoLocation(this.fadService.zip.geoLocation)
      .setUserId(this.authService.useridin ? this.authService.useridin : "")
      .setLimit(FadConstants.professionalSearchLimit)
      .setPage(this.professionalPage)
      .setRadius(FadConstants.professionalSearchRadius)
      .setNetworkId((this.fadService.plan && this.fadService.plan.profileId) ? this.fadService.plan.profileId : 311005011)
      .setSort(FadConstants.defaultSort);
    //.setSearchSpecialtyId((this.fadService.search && this.fadService.search.profileId) ? this.fadService.search.profileId : 311000253)
    //.setName((this.fadService.search && this.fadService.search.simpleText) ? this.fadService.search.simpleText  : 'Audiology');

    //Either Specialty Id should be passed or Doctor name should be passed
    if (this.fadService.search && this.fadService.search.profileId && this.fadService.search.profileId != "-1") {
      vitalsSearchRequestbyProfessional.setSearchSpecialtyId(this.fadService.search.profileId);
    } else {
      vitalsSearchRequestbyProfessional.setName(this.fadService.search.contextText);
    }
    this.fadSearchResultsService.getFadProfileSearchResults(vitalsSearchRequestbyProfessional, hideMask)
      .subscribe(data => {
        console.log("searchbyprofessional Response", data, this.infiniteScrollEvent);
        this.hideMask();
        if (data) {
          if (this.searchListComponentInput && this.searchListComponentInput.searchResults && this.searchListComponentInput.searchResults.professionals && this.searchListComponentInput.searchResults.professionals.length > 0) {
            if ((data.professionals)) {
              data.professionals = [...this.searchListComponentInput.searchResults.professionals, ...data.professionals];
            }
          }
          this.searchListComponentInput = new FadSearchListComponentInputModel();
          this.searchListComponentInput.searchResults = data;

          this.professionalTotalCount = data.totalCount;
          this.totalCount = data.totalCount;
          if (data && data.professionals && data.professionals.length > 0) {
            this.totalCount = this.totalCount || data.professionals.length;
            this.isNoSearchResults = false;
          } else {
            if (this.professionalTotalCount <= 0) {
              this.isNoSearchResults = true;
            }
          }
          this.professionalPage++;
        }
        this.infiniteScrollComplete();
      },
      error => {
        // this.hideMask();
        this.infiniteScrollComplete();
        this.authService.showAlert('', error.displaymessage || error.errormessage);
      }
      );
  }

  private getFadFacilitySearchResults(hideMask?: boolean, filterData?: any): void {
    if (!hideMask) {
      this.mask = this.authService.showLoadingMask('Accessing fad search results ...');
      this.mask.present();
    }
    const vitalsSearchRequestbyFacility: GetSearchByFacilityRequestModelInterface = new GetSearchByFacilityRequestModel();

    vitalsSearchRequestbyFacility.setGeoLocation(this.fadService.zip.geoLocation)
      .setUserId(this.authService.useridin ? this.authService.useridin : "")
      .setLimit(FadConstants.facilitySearchLimit)
      .setPage(this.facilityPage)
      .setRadius(FadConstants.facilitySearchRadius)
      .setNetworkId((this.fadService.plan && this.fadService.plan.profileId) ? this.fadService.plan.profileId : 311005011)
      .setSort(FadConstants.defaultSort);

    //Either Specialty Id should be passed or Doctor name should be passed
    if (this.fadService.search && this.fadService.search.profileId && this.fadService.search.profileId != "-1") {
      vitalsSearchRequestbyFacility.setSearchSpecialtyId(this.fadService.search.profileId);
    } else {
      vitalsSearchRequestbyFacility.setName(this.fadService.search.contextText);
    }
    this.fadSearchResultsService.getFadFacilitySearchResults(vitalsSearchRequestbyFacility, hideMask)
      .subscribe(data => {
        console.log("searchbyfacilities Response", data);
        this.hideMask();
        if (data) {
          if (this.facilityListComponentInput && this.facilityListComponentInput.searchResults && this.facilityListComponentInput.searchResults.facilities && this.facilityListComponentInput.searchResults.facilities.length > 0) {
            if ((data.facilities)) {
              data.facilities = [...this.facilityListComponentInput.searchResults.facilities, ...data.facilities];
            }
          }
          this.facilityListComponentInput = new FadFacilityListComponentInputModel();
          this.facilityListComponentInput.searchResults = data;
          this.facilityTotalCount = data.totalCount;
          this.totalCount = data.totalCount;
          if (data && data.facilities && data.facilities.length > 0) {
            this.totalCount = this.totalCount || data.facilities.length;
            this.isNoSearchResults = false;
          } else {
            this.isNoSearchResults = true;
          }
          this.facilityPage++;
        }
        this.infiniteScrollComplete();
      },
      error => {
        // this.hideMask();
        this.infiniteScrollComplete();
        this.authService.showAlert('', error.displaymessage || error.errormessage);
      }
      );
  }

  public infiniteScrollComplete() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.complete();
    }
  }

  public loadMoreProfessionals(data) {
    this.infiniteScrollEvent = data.infiniteScroll;
    if (((this.professionalPage - 1) * 10) < this.professionalTotalCount) {
      this.getFadProfileSearchResults(true);
    } else {
      data.infiniteScroll.enable(false);
    }
  }

  public loadMoreFacilities(data) {
    this.infiniteScrollEvent = data.infiniteScroll;
    if (((this.facilityPage - 1) * 10) < this.facilityTotalCount) {
      this.getFadFacilitySearchResults(true);
    } else {
      data.infiniteScroll.enable(false);
    }
  }

  applyFilter(data) {
    if (this.profileType === FadSearchCategories.allProfessional || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.ProfessionalCode)) {
      this.getFadProfileSearchResults(false, data.filter);
    } else if (this.profileType === FadSearchCategories.allFacility || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.FacilityCode)) {
      this.getFadFacilitySearchResults(false, data.filter);
    }
  }

  clearFilter(data) {
    console.log(data);
    if (this.profileType === FadSearchCategories.allProfessional || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.ProfessionalCode)) {
      this.getFadProfileSearchResults(false, data.filter);
    } else if (this.profileType === FadSearchCategories.allFacility || (this.profileType === FadSearchCategories.speciality && this.resourceTypeCode === FadConstants.FacilityCode)) {
      this.getFadFacilitySearchResults(false, data.filter);
    }
  }

  hideMask() {
    this.authService.hideLoadingMask(this.mask);
  }

  private isAnonymousUser() {
    return this.authService.useridin && this.authService.useridin !== "undefined" ? true : false;
  }

  gotoLogin(event) {
    event.preventDefault();
    this.authService.setDeepLink("finddoctor");
    this.navCtrl.push(LoginComponent);
  }

  gotoRegistration(event) {
    event.preventDefault();
    this.navCtrl.push(RegistrationComponent);
  }
  gotoLandingPage() {
    this.navCtrl.push(FadPage);
  }

}
