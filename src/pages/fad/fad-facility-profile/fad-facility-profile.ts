import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { FadFacilityProfileDetailService } from './fad-facility-profile.service';
import { FadFacilityProfileRequestModel, FadFacilityResponseModel, FadLocationDetailsModel } from '../modals/fad-Facility-profile-details.model';
import { FadFacilityProfileRequestModelInterface, FacilityInterface, FadFacilityResponseModelInterface, FadLocationDetailsInterface } from '../modals/interfaces/fad-Facility-profile-details.interface';
import { FadService } from '../fad-landing/fad.service';
import { StarRatingComponentInputModelInterface } from '../../../components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../components/star-rating/star-rating.model';
import { FadLocationDetails } from '../modals/getSearchByProfessional.model';
import { AlertModel } from '../../../models/alert/alert.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';
declare var scxmlHandler;

@Component({
  selector: 'page-fad-facility-profile',
  templateUrl: 'fad-facility-profile.html',
})
export class FadFacilityProfilePage {

  accordianToggleStatus: any = {};
  selectedLocationIndex: number = 0;
  alertMessageCard: AlertModel = null;
  fadFacilityResponseData: FadFacilityResponseModelInterface;
  selectedLocationDetails: FadLocationDetailsInterface;
  facility: FacilityInterface;
  public startRating: StarRatingComponentInputModelInterface;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fadFacilityProfileDetailService: FadFacilityProfileDetailService,
    public fadService: FadService,
    private platform: Platform,
    public alertCtrl: AlertController,
    private authService: AuthenticationService) { }

  ionViewCanEnter() {
    this.getFadFacilityProfileDetails(false);
  }

  private getFadFacilityProfileDetails(hideMask?: boolean): void {
    const FadFacilityProfileRequestParams: FadFacilityProfileRequestModelInterface = new FadFacilityProfileRequestModel();
    FadFacilityProfileRequestParams.setGeoLocation(this.fadService.zip.geoLocation)
      .setFacility(this.fadFacilityProfileDetailService.facilityProfile)
      .setNetworkId((this.fadService.plan && this.fadService.plan.profileId) ? this.fadService.plan.profileId : 311005011);

    this.fadFacilityProfileDetailService.getFadFacilityProfileDetails(FadFacilityProfileRequestParams, hideMask)
      .subscribe(responseData => {
        console.log('FP', responseData);
        if (responseData) {
          this.fadFacilityResponseData = new FadFacilityResponseModel();
          this.fadFacilityResponseData.facility = responseData.facility;
          this.facility = responseData.facility;
          this.fadFacilityResponseData.locations = responseData.locations;
          this.loadDetailsBasedOnLocation(this.selectedLocationIndex);
          // Hide alert message card
          this.alertMessageCard = null;
        }
      },
      error => {
        // Show alert message card
        this.createAlert("Error", error.displaymessage, "error");
      });
  }

  getRating(reviews) {
    this.startRating = new StarRatingComponentInputModel();
    this.startRating.totalRatings = reviews.totalRatings;
    this.startRating.overAllRating = parseFloat(reviews.overallRating);
    return this.startRating;
  }

  loadDetailsBasedOnLocation(locationId) {
    this.selectedLocationIndex = locationId;
    this.selectedLocationDetails = this.fadFacilityResponseData.locations ? this.fadFacilityResponseData.locations[locationId] : null;
    this.accordianToggleStatus = {};
  }

  // To toggle Accordian List
  toggleAccordianList(listItem) {
    if (this.accordianToggleStatus[listItem] == undefined) {
      this.accordianToggleStatus[listItem] = true;
    } else {
      this.accordianToggleStatus[listItem] = !this.accordianToggleStatus[listItem];
    }
  }

  createAlert(title: string, msg: string, type: string) {
    let alertDetails: AlertModel = new AlertModel();
    alertDetails.id = "1";
    alertDetails.message = msg;
    alertDetails.alertFromServer = false;
    alertDetails.showAlert = true;
    alertDetails.type = type ? type : "error";
    alertDetails.hideCloseButton = true;
    this.alertMessageCard = alertDetails;
  }

  copyToClipboard(val: string) {
    var textArea, copy;
    textArea = document.createElement('textArea');
    textArea.readOnly = true;
    textArea.value = val;
    document.body.appendChild(textArea);
    var range, selection;
    if (this.platform.is("ios")) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
    document.execCommand('copy');
    document.body.removeChild(textArea);
    // this.showAlert('', "Copied");
  }

  showMap(location) {
    if (this.platform.is("ios")) {
      let murl = "http://maps.apple.com/?q=" + encodeURI(location);
      scxmlHandler.openExternalWindow(murl);
    } else {
      let murl = "geo:0,0?q=" + encodeURI(location);
      scxmlHandler.openExternalWindow(murl);
    }
  }

  makeCall(phNumber) {
    if (this.platform.is("ios") && this.platform.is("ipad")) {
      this.showAlert('', "This feature is not available on your device.");
      return;
    }
    let turl = "tel:" + phNumber;
    scxmlHandler.openExternalWindow(turl);
  }

  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }

}
