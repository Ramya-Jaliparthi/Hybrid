import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';
import { ContactUsPage } from "../contact-us/contact-us";

declare var openstream;
declare var scxmlHandler: any;
@Component({
  selector: 'page-my-cards-detail',
  templateUrl: 'my-cards-detail.html',
})
export class MyCardsDetailPage {

  @ViewChild(Slides) slides: Slides;

  cardFrontData: any;
  cardBackData: any;
  contacts: any;
  memberType: any;
  index: any = 1;
  hideCls: string = "enableCallCls";
  workingHoursCheckingTimer: any = null;

  constructor(public navCtrl: NavController,
    public config: ConfigProvider,
    private authService: AuthenticationService,
    public navParams: NavParams) {

    this.cardFrontData = navParams.get("cardFront");
    this.cardBackData = navParams.get("cardBack")['ROWSET'].ROWS;
    this.memberType = navParams.get("memberType");
    this.index = navParams.get("index");

    if (this.cardBackData && this.cardBackData.length > 0) {
      for (var k = 0; k < this.cardBackData.length; k++) {
        var entry = this.cardBackData[k];
        if (entry['CopyLoc'] == 'Para4') {
          let para4 = entry['Copy'];
          this.contacts = para4.split('|');
        }
      }
    }

  }


  closeModal(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => { this.navCtrl.pop(); }, ConstantsService.EVENT_HANDLING_TIMEOUT);
    event.cancelBubble = true;
  }

  dialNumber(phoneNumber) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.hideCls == "enableCallCls") {
      let turl = "tel:" + phoneNumber;
      scxmlHandler.openExternalWindow(turl);
    }
  }

  ionViewDidLoad() {
    if (this.index == 2)
      window.setTimeout(() => this.slides.slideTo(1), 100);

    this.canCallNowHoursOfOperationWeekDays8amTo6pmET();
  }
  ionViewDidLeave() {
    if (this.workingHoursCheckingTimer) {
      window.clearTimeout(this.workingHoursCheckingTimer);
    }
  }
  canCallNowHoursOfOperationWeekDays8amTo6pmET() {
    // defaults: 8am - 6pm, ET; monday - friday
    if (this.canCallNow(8, 18, [1, 2, 3, 4, 5], "America/New_York")) {
      this.hideCls = "enableCallCls";
    }
    else {
      this.hideCls = "disableCallCls";
    }

    this.workingHoursCheckingTimer = window.setTimeout(() => { this.canCallNowHoursOfOperationWeekDays8amTo6pmET(); }, 2000)
  }
  canCallNow(hoursOfOperationStartHourOfDay, hoursOfOperationEndHourOfDay, daysOfWeekArray, whichTimezone) {
    return openstream.common.dateutil.isCurrentTimeInRange(hoursOfOperationStartHourOfDay, hoursOfOperationEndHourOfDay, daysOfWeekArray, whichTimezone);
  }

  removeLeadingJunkChar(val) {
    return this.authService.removeLeadingJunkChar(val);
  }
  goToContactUs() {

    this.navCtrl.push(ContactUsPage);
  }
}
