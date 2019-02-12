import { Component, Renderer, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from "../../providers/constants/constants.service";
import { ConfigProvider } from '../../providers/config/config';
import { NavController } from 'ionic-angular';

declare var scxmlHandler: any;

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})

export class ContactUsPage {

  contactUsData: any;
  @ViewChild('a') anchorItems: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private userContext: UserContextProvider,
    private renderer: Renderer,
    private eleRef: ElementRef,
    public configProvider: ConfigProvider,
    public navCtrl: NavController) {

    if (this.userContext.getContactUs() != null) {
      this.contactUsData = this.userContext.getContactUs();
      this.addListeners();
    } else {
      this.loadData();
    }

  }

  ionViewDidLoad() {
    let etarget = 'ContactUs';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }
  loadData() {
    this.authService.getContactUsInfo()
      .subscribe(response => {
        this.contactUsData = response;
        this.addListeners();
      }, err => {
        console.log(err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("contactUs"), err.result ? err.result : '');
      });
  }
  openFeedBackPage() {
    scxmlHandler.openNewindow(this.configProvider.getProperty("feedbackForm"), "Submit App Feedback");
  }
  addListeners() {
    setTimeout(() => {
      let items = this.eleRef.nativeElement.querySelectorAll('a');
      for (let item of items) {
        this.renderer.listen(item, 'click', (event) => {
          let etarget = "ContactUs.";
          let etargetName = "";
          let targetContent = event.target.getAttribute('href');
          if (targetContent && targetContent.indexOf('tel') != -1) {
            targetContent = targetContent.split(":")[1];
            targetContent = this.formatPhoneNumber(targetContent);
            if (event.target.parentElement.querySelectorAll("strong").length > 0) {
              etargetName = event.target.parentElement.querySelectorAll("strong")[0].innerText;
              if (etargetName.indexOf('&') != -1) {
                etargetName = etargetName.split("&")[0].replace(/\s/g, '');
              } else if (etargetName.indexOf('/') != -1) {
                etargetName = "BlueCareNurseLine";

              } else {
                etargetName = etargetName.replace(/\s/g, '');
              }

            } else {
              etargetName = "Main";
            }
            let edataobj = { "context": "action", "data": { "App.linkSource": etargetName + targetContent } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget + etargetName + targetContent, edataobj);
          } else {
            let feedbackTarget = event.target.getAttribute('click');
            if (feedbackTarget.indexOf("feedback") !== -1) {
              this.openFeedBackPage();
              let edataobj = { "context": "action", "data": { "App.linkSource": etargetName + targetContent } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget + etargetName + targetContent, edataobj);

            }
          }

        });
      }
    }, 300);

  }

  formatPhoneNumber(phno) {
    let tel = ("" + phno).replace(/\D/g, '');
    let telNo = tel.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!telNo) ? null : telNo[1] + "-" + telNo[2] + "-" + telNo[3];
  }
}



