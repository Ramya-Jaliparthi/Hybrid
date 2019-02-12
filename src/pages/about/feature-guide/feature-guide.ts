import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams } from 'ionic-angular';
import { ConstantsService } from '../../../providers/constants/constants.service';
import { DashboardPage } from '../../../pages/dashboard/dashboard';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { CardProvider } from '../../../providers/card/card';
import { LoginState } from '../../../providers/user-context/user-context';


declare var scxmlHandler: any;
@Component({
  selector: 'page-feature-guide',
  templateUrl: 'feature-guide.html',
})
export class FeatureGuidePage {
  @ViewChild(Slides) slides: Slides;
  firstLoad: boolean = true;

  activeIndex: number = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, private cardProvider: CardProvider,
    private authService: AuthenticationService) {
    if (navParams.data.firstLoad != undefined) {
      this.firstLoad = navParams.data.firstLoad;
    }
    console.log("First load of feature guide : ", this.firstLoad, navParams.data);
  }

  ionViewDidLoad() {
    let etarget = 'About.FeatureGuides.EasyAccess';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  slideChanged() {
    this.activeIndex = this.slides.getActiveIndex();
    if (this.activeIndex == 0) {
      let etarget = 'About.FeatureGuides.EasyAccess';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    } else if (this.activeIndex == 1) {
      let etarget = 'About.FeatureGuides.LookupClaims';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    } else if (this.activeIndex == 2) {
      let etarget = 'About.FeatureGuides.LookupDoctor';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    } else if (this.activeIndex == 3) {
      let etarget = 'About.FeatureGuides.MedHistory';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    } else if (this.activeIndex == 4) {
      let etarget = 'About.FeatureGuides.ViewCard';
      let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    }

  }

  closeGuide() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.firstLoad) {
      // initialize and save the available cards in secureStorage before going to Dashboard
      this.cardProvider.getCardConfig(LoginState.Anonymous);
      this.navCtrl.setRoot(DashboardPage);
    } else {
      window.setTimeout(() => { this.navCtrl.pop(); }, ConstantsService.EVENT_HANDLING_TIMEOUT_600);
    }

  }

}
