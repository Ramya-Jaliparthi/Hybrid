
import { FadConstants } from '../constants/fad.constants';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { FadFacilityCardComponentInputModelInterface } from '../modals/interfaces/fad-facility-card.interface';
//import { FVProSRLocation } from '../modals/fad-vitals-professionals-search-response.model';
import { StarRatingComponentInputModelInterface } from '../../../components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../components/star-rating/star-rating.model';
import { FadSearchResultsService } from '../fad-landing-page-search-results/fad-search-results.service';
import { FadLocationDetails } from '../modals/getSearchByProfessional.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { LoginComponent } from '../../../pages/login/login.component';
import { FadFacilityProfilePage } from '../fad-facility-profile/fad-facility-profile';
import { FadService } from '../fad-landing/fad.service';
import { FadFacilityProfileDetailService } from '../fad-facility-profile/fad-facility-profile.service';
/**
 * Generated class for the FadLandingPageSearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad-facility-card',
  templateUrl: 'fad-facility-card.html',
})

export class FadFacilityCardPage implements OnInit {

  @Input('componentInput') componentInput: FadFacilityCardComponentInputModelInterface;

  public facilityStarRating: StarRatingComponentInputModelInterface;

  public facilityName: string;
  public doctorDegree: string;
  public speciality: string;
  public medicalGroup: string;
  public address: string;
  public phoneNumber: string;
  public noofaddress: string;
  public addresslist;
  public isLocationsMore: boolean;
  public numberOfLocations: number;
  public cost_dollars: string = '00';
  public cost_pennies: string = '00';

  constructor(public navCtrl: NavController,
    private http: Http,
    private fadFacilityProfileDetailService: FadFacilityProfileDetailService,
    private fadSearchResultsService: FadSearchResultsService,
    private authService: AuthenticationService,
    private fadService: FadService) {

  }

  ionViewDidLoad() {
  }

  ngOnInit() {

    this.facilityName = this.componentInput.facility.name;
    //this.doctorDegree = this.componentInput.professional.degrees.join(',');
    this.speciality = this.componentInput.facility.specialty

    if (this.componentInput.facility.locations) {
      this.addresslist = this.componentInput.facility.locations;
      this.numberOfLocations = this.componentInput.facility.locations.length;
      console.log("test locations :" + this.numberOfLocations);
      this.noofaddress = "+" + (this.numberOfLocations - 1) + " more locations";
      if (this.numberOfLocations > 1) {
        this.isLocationsMore = true;
      } else {
        this.isLocationsMore = false;
      }
      const firstLocation = this.componentInput.facility.locations[0];
      this.medicalGroup = firstLocation.name;
      this.address = firstLocation.address;
      this.phoneNumber = firstLocation.phone;
      /***** DO NOT DELETE*******
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
    this.facilityStarRating = new StarRatingComponentInputModel();
    const _overallRating: number = this.componentInput.facility.reviews.overallRating;
    console.log("Reviews", this.componentInput.facility.reviews);
    if (this.componentInput.facility.reviews.overallRating) {
      this.facilityStarRating.numberOfStars = parseInt(this.componentInput.facility.reviews.overallRating.toString());
    }
    this.facilityStarRating.totalRatings = this.componentInput.facility.reviews.totalRatings
    this.facilityStarRating.overAllRating = parseFloat(this.componentInput.facility.reviews.overallRating.toString());
    //this.facilityStarRating.ratingInPercentage =_overallRating * 100/ this.facilityStarRating.numberOfStars;//67;      
    // end of temporary stuff
  }

  gotoLoginPage() {
    this.authService.setDeepLink("finddoctor");
    this.navCtrl.push(LoginComponent);
  }

  openProfile() {
    this.fadFacilityProfileDetailService.facilityProfile = this.componentInput.facility.facilityId;
    this.navCtrl.push(FadFacilityProfilePage);
  }
}
