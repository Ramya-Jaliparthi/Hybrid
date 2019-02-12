import { Component, Input } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';
import { MessageCenterPage } from "../../pages/message-center/message-center";
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
import { ConfigProvider } from '../../providers/config/config';
@Component({
  selector: 'page-message-center-detail',
  templateUrl: 'message-center-detail.html',
})
export class MessageCenterDetailPage {
  messageCenterDetails: any;
  messageAlerts: any;
  isDeleted: boolean;
  @Input() showTabberMenu: boolean = true;
  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public platform: Platform,
    private authService: AuthenticationService,
    private configProvider: ConfigProvider) {
    this.messageCenterDetails = navParams.get('data');
    if (platform.is('android')) {
      this.showTabberMenu = true;
    } else {
      this.showTabberMenu = false;
    }
  }
  ionViewDidLoad() {
    let etarget = 'MessageCenter.ViewMessage';
    let edataobj = { "context": "action", "data": { "App.linkSource": "Message Center", "App.MessageTitle": this.messageCenterDetails.AlertShortTxt, " App.MessageType": "Notification/Alert" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    this.isDeleted = false;
    this.messageAlerts = this.authService.messageAlertsInMemoryVals;
    this.messageAlerts.forEach(msgalert => {
      if (msgalert.messageID == this.messageCenterDetails.messageID) {
        if (msgalert.messageRead == false && this.authService.messageAlertsCount > 0) {
          this.authService.messageAlertsCount = this.authService.messageAlertsCount - 1;
          this.authService.handleBadgeCount(this.authService.messageAlertsCount);
        }
        msgalert.messageRead = true;
        this.isDeleted = true;
      }
    });
    this.setValuetolocalStorage(this.messageAlerts)
  }

  deletememAlert(messagecenterData: any) {
    this.messageAlerts.forEach(msgalert => {
      if (msgalert.messageID == messagecenterData.messageID) {
        msgalert.isDeleted = true;
        this.isDeleted = true;
      }
    });
    this.setValuetolocalStorage(this.messageAlerts);
    this.navCtrl.push(MessageCenterPage, { deletedmemAlert: this.isDeleted, data: messagecenterData });
  }

  setValuetolocalStorage(messageAlerts: any) {
    let totalcount = 0;
    if (messageAlerts != null) {
      for (var i = 0; i < messageAlerts.length; i++) {
        if (messageAlerts[i].messageRead == false && messageAlerts[i].isDeleted == false) {
          totalcount++;
        }
      }
    }
    this.authService.messageAlertsCount = totalcount;
    this.authService.messageAlertsInMemoryVals = messageAlerts;
  }

  readMessageById(mId) {
    this.authService.getAlerts().subscribe(response => {
      if (response.displaymessage) {
      } else {
        this.messageAlerts = response.ROWSET.ROWS;
        let etarget = 'MessageCenter';
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.MessageTitle": "" } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
        console.log("rowsets in message center", this.messageAlerts);
        this.messageCenterDetails = this.getMessageById(mId);
      }
    },
      err => {
        console.log('Response getAlerts: in Error message ', err.displaymessage);
        if (err.displaymessage) {
          let alerturl = this.configProvider.getProperty("getAlertsEndPoint");
          this.authService.addAnalyticsAPIEvent(err.displaymessage, alerturl, err.result);

        }
      }
    );

  }

  getMessageById(messageId) {
    let messagecenterData = this.messageAlerts.filter((alert) => {
      return alert.messageID.toString() === messageId;
    });
    if (messagecenterData.length > 0) {
      return messagecenterData[0];
    } else {
      return null;
    }
  }

  getActivePage(): string {
    return this.navCtrl.getActive().name;
  }
  getLinkdetails(event) {
    let etarget = 'MessageCenter.Link';
    let edataobj = { "context": "action", "data": { "App.MessageLinkClicked": event.target.innerText } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
  }
}
