
import { FadConstants } from '../constants/fad.constants';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { FadProfileCardComponentInputModelInterface } from '../modals/interfaces/fad-profile-card.interface';
//import { FVProSRLocation } from '../modals/fad-vitals-professionals-search-response.model';
import { StarRatingComponentInputModelInterface } from '../../../components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../components/star-rating/star-rating.model';
import { FadSearchResultsService } from '../fad-landing-page-search-results/fad-search-results.service';
import { FadLocationDetails } from '../modals/getSearchByProfessional.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { LoginComponent } from '../../../pages/login/login.component';
import { FadDoctorProfilePage } from '../fad-doctor-profile/fad-doctor-profile';
import { FadService } from '../fad-landing/fad.service';
import { FadDoctorProfileDetailService } from '../fad-doctor-profile/fad-doctor-profile.service';
/**
 * Generated class for the FadLandingPageSearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad-profile-card',
  templateUrl: 'fad-profile-card.html',
})

export class FadProfileCardPage implements OnInit {

  @Input('componentInput') componentInput: FadProfileCardComponentInputModelInterface;



  public doctorStarRating: StarRatingComponentInputModelInterface;

  public doctorName: string;
  public doctorDegree: string;
  public speciality: string;
  public medicalGroup: string;
  public address: string;
  public phoneNumber: string;
  public numberOfLocations: number;
  public noofaddress:string;
  public addresslist;
  public isLocationsMore:boolean;
  public cost_dollars: string = '00';
  public cost_pennies: string = '00';
  public starNumberRange: number[];

  constructor(public navCtrl: NavController, private http: Http, 
    private fadSearchResultsService: FadSearchResultsService, 
    private authService: AuthenticationService,
    private fadService: FadService,
    private fadDoctorProfileDetailService: FadDoctorProfileDetailService) {

  }

  ionViewDidLoad() {
  }

  ngOnInit() {

    this.doctorName = this.componentInput.professional.doctorName;
    //this.doctorDegree = this.componentInput.professional.degrees.join(',');
    this.speciality = this.componentInput.professional.specialty

    if (this.componentInput.professional.locations) {
      this.addresslist=this.componentInput.professional.locations;
      this.numberOfLocations = this.componentInput.professional.locations.length;
      this.noofaddress = "+" + (this.numberOfLocations-1) + " more locations";
      if(this.numberOfLocations >1)
      {
        this.isLocationsMore = true;
      }else{
        this.isLocationsMore = false;
      }
      const firstLocation = this.componentInput.professional.locations[0];
      this.medicalGroup = firstLocation.name;
      this.address = firstLocation.address;
      this.phoneNumber = firstLocation.phone;
      /***** DO NOT DELETE*********
      NEED TO SEEK CLARIFICATION FROM PRAGATHEESH
      COST VALUE MANADATORY FOR DISPLAY ON DOCTOR PROFILE CARD
      
      ******* VALUE MISSING IN API RESPONSE / SWAGGER MODEL******
      */
      //   if (firstLocation.cost) {
      //     const costString: string = firstLocation.cost + '';
      //     this.cost_dollars = costString.split('.')[0];
      //     this.cost_pennies = costString.split('.')[0];
      //   }
      // } else {
      this.numberOfLocations = 0;
    }

    // temporary stuff  
    this.doctorStarRating = new StarRatingComponentInputModel();
    // const _overallRating:number=this.componentInput.professional.reviews.overallRating;
    console.log("Reviews", this.componentInput.professional.reviews);
    if(this.componentInput.professional.reviews.overallRating){
      this.doctorStarRating.numberOfStars =  parseInt(this.componentInput.professional.reviews.overallRating.toString());
    }
    this.doctorStarRating.totalRatings =  this.componentInput.professional.reviews.totalRatings;
    this.starNumberRange = Array.from(Array(this.doctorStarRating.numberOfStars).keys());
    this.doctorStarRating.ratingInPercentage = this.componentInput.professional.reviews.percentRecommended;
    this.doctorStarRating.overAllRating = parseInt(this.componentInput.professional.reviews.overallRating.toString());
    // if (this.componentInput.professional.reviews.percentRecommended === 0) {
    //   this.doctorStarRating.isInActive = true;
    // }
    //_overallRating * 100/ this.doctorStarRating.numberOfStars;    
    // end of temporary stuff
  }

  gotoLoginPage() {
    this.authService.setDeepLink("finddoctor");
    this.navCtrl.push(LoginComponent);
  }

  openProfile() {
    this.fadService.professional = this.componentInput.professional;
    this.fadDoctorProfileDetailService.doctorProfile = this.fadService.professional.providerId;
    this.navCtrl.push(FadDoctorProfilePage);
  }

}
