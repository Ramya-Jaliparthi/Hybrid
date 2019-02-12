import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FadHomeSearchPage } from '../fad-home-search/fad-home-search';
import { FadLandingPageSearchResultsPage } from '../fad-landing-page-search-results/fad-landing-page-search-results';
import { FadSearchType } from '../modals/types/fad.types';
import { FadService } from './fad.service';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { EncryptedRequest } from '../../../models/login/encryptedRequest.model';
import { ConstantsService } from '../../../providers/constants/constants.service';
import { ConfigProvider } from '../../../providers/config/config';
/**
 * Generated class for the FadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad',
  templateUrl: 'fad.html',
})
export class FadPage {
  plan: string;
  member: string;
  zip: string;
  search: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fadService: FadService,private authService: AuthenticationService,private config: ConfigProvider,) {
  }

  ionViewDidEnter() {
    if(!this.authService.token){
      this.authService.makeTokenRequest(true).subscribe(token => {
        this.authService.token = token;
        let encryptionService = new EncryptedRequest();
        encryptionService.generateKeys(this.authService.token);
      },
        err => {
          this.fadService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN);
          this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN, this.config.getProperty("tokenEndPoint"), err.result);
          return;
        }
      );
    }
    this.initModel();
  }

  initModel() {
    if (this.fadService.zip) {
      this.zip = this.fadService.zip.contextText;
    } else {
      this.zip = '';
    }
    this.member = this.fadService.member;
    if (this.fadService.plan) {
      this.plan = this.fadService.plan.simpleText;
    } else {
      this.plan = '';
    }
    if (this.fadService.search) {
      this.search = this.fadService.search.contextText || this.fadService.search.simpleText;
    } else {
      this.search = '';
    }
  }

  searchForMatchingText() {
    this.navCtrl.push(FadHomeSearchPage, {
      searchType: FadSearchType.search
    });
  }

  searchForMatchingZipCode() {
    this.navCtrl.push(FadHomeSearchPage, {
      searchType: FadSearchType.zip
    });
  }

  searchForMatchingPlanName() {
    this.navCtrl.push(FadHomeSearchPage, {
      searchType: FadSearchType.plan
    });
  }

  searchForMatchingMember() {
    this.navCtrl.push(FadHomeSearchPage, {
      searchType: FadSearchType.member
    });
  }

  openSearchResultsPage() {
    this.navCtrl.push(FadLandingPageSearchResultsPage);
  }

  isSearchDisabled() {
    if (!this.plan || !this.zip || !this.search) {
      return true;
    }
    return false;
  }

}
