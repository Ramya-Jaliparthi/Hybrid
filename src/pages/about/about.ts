import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FeatureGuidePage } from './feature-guide/feature-guide';
import { PrivacyPolicy } from './privacyPolicy';
import { TermsAndCondition } from './termsAndConditions';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';


declare var scxmlHandler: any;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  buildNumber: any = '2.4.3';
  versionNumber: any = '3.1.4.4';
  swrveUserId: any = '';
  constructor(public navCtrl: NavController, public config: ConfigProvider, public authService: AuthenticationService) {
    if (scxmlHandler.getBuildNumber() && scxmlHandler.getBuildNumber() != '')
      this.buildNumber = scxmlHandler.getBuildNumber();


    if (scxmlHandler.getUserIdFromSwrve() != '')
      this.swrveUserId = scxmlHandler.getUserIdFromSwrve();

    console.log('Build:' + this.buildNumber);
  }

  ionViewDidLoad() {
    let etarget = 'About';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  itemSelected(item) {
    scxmlHandler.playSoundWithHapticFeedback();
    console.log("itemSelected  ", item);
    console.log(item);
    if (item == "feature-guide") {
      let etarget = 'About.FeatureGuides';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      this.navCtrl.push(FeatureGuidePage, { firstLoad: false });
    } else if (item == "privacy") {
      let etarget = 'About.Confidentiality';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      this.navCtrl.push(PrivacyPolicy);
    } else if (item == "terms") {
      let etarget = 'About.TermsofUse';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      this.navCtrl.push(TermsAndCondition);
    }
  }

}
