import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { FadDoctorProfileDetailService } from './fad-doctor-profile.service';
import { FadDoctorProfileRequestModel, FadProfessionalResponseModel, FadLocationDetailsModel } from '../modals/fad-doctor-profile-details.model';
import { FadDoctorProfileRequestModelInterface,  FadProfessionalResponseModelInterface, FadLocationDetailsInterface } from '../modals/interfaces/fad-doctor-profile-details.interface';
import { FadService } from '../fad-landing/fad.service';
import { StarRatingComponentInputModelInterface } from '../../../components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../components/star-rating/star-rating.model';
import { FadLocationDetails } from '../modals/getSearchByProfessional.model';
import { AlertModel } from '../../../models/alert/alert.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';
declare var scxmlHandler;

@Component({
  selector: 'page-fad-doctor-profile',
  templateUrl: 'fad-doctor-profile.html'
})
export class FadDoctorProfilePage {

  accordianToggleStatus: any = {};
  selectedLocationIndex:number = 0;
  alertMessageCard: AlertModel = null;
  fadProfessionalResposeData: FadProfessionalResponseModelInterface;
  selectedLocationDetails: FadLocationDetailsInterface;
  public startRating: StarRatingComponentInputModelInterface;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public fadDoctorProfileDetailService:FadDoctorProfileDetailService,
    public fadService: FadService,
    private platform: Platform,
    public alertCtrl: AlertController,
    private authService: AuthenticationService) {}

  ionViewCanEnter() {
    this.getFadGetprofessionalprofileDetails(false);
  }
        
  private getFadGetprofessionalprofileDetails(hideMask?: boolean): void {
    const FadDoctorProfileRequestParams:FadDoctorProfileRequestModelInterface = new FadDoctorProfileRequestModel();
    FadDoctorProfileRequestParams.setGeoLocation(this.fadService.zip.geoLocation)
    .setProfessional(this.fadDoctorProfileDetailService.doctorProfile)
    .setNetworkId((this.fadService.plan && this.fadService.plan.profileId) ? this.fadService.plan.profileId : 311005011);
    
    this.fadDoctorProfileDetailService.getFadGetprofessionalprofileDetails(FadDoctorProfileRequestParams, hideMask)
    .subscribe(responseData => {
      console.log('DP', responseData);
      if (responseData) {
          this.fadProfessionalResposeData = new FadProfessionalResponseModel();
          this.fadProfessionalResposeData = responseData;
          this.fadProfessionalResposeData.locations = responseData.locations;
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
    this.selectedLocationDetails = this.fadProfessionalResposeData.locations[locationId];
    this.accordianToggleStatus = {};
  }

  // To toggle Accordian List
  toggleAccordianList(listItem) {
    if (this.accordianToggleStatus[listItem]== undefined) {
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
    var textArea,copy;
    textArea = document.createElement('textArea');
    textArea.readOnly = true;
    textArea.value = val;
    document.body.appendChild(textArea);
    var range,selection;
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
