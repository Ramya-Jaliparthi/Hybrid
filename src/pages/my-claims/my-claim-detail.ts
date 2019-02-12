import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from "../../providers/constants/constants.service";
import { MyClaimsService } from './my-claims-service'

declare var scxmlHandler: any;

@Component({
  selector: 'page-my-claim-detail',
  templateUrl: 'my-claim-detail.html',
})

export class MyClaimDetailPage {

  claimDetails: any;
  providerAddress: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalctrl: ModalController,
    public authService: AuthenticationService,
    public alertCtrl: AlertController,
    public myClaimsService: MyClaimsService) {
    let provName = "";
    if (navParams.get('cardData') != undefined) {
      this.getclaimsforICN(navParams.get('cardData').clmICN);
      provName = navParams.get('cardData').clmPrvName;
    } else {
      this.claimDetails = navParams.get('data');
      this.updateClaimStatus();
      provName = this.claimDetails[0].provName;
    }
  }

  ionViewDidLoad() {
    let etarget = 'MyClaims.ClaimDetails';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
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
  updateClaimStatus() {
    for (let i = 0; i < this.claimDetails.length; i++) {

      // let detail = this.claimDetails[i];
      this.claimDetails[i]["status"] = this.claimDetails[i].clmStatus;
      if (this.claimDetails[i].clmStatus == "Complete") {
        if (this.claimDetails[i].clmPaymtStatus == "Denied") {
          this.claimDetails[i]["status"] = "Denied";
        } else if (this.claimDetails[i].clmPaymtStatus == "Paid") {
          this.claimDetails[i]["status"] = "Completed";
        }
      }
    }
  }
  getclaimsforICN(icn) {
    let mask = this.authService.showLoadingMask('Accessing claims information...');
    setTimeout(() => {

      const request = {
        useridin: this.authService.useridin,
        param1: String(icn)
      };

      let claimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("claimsforICNEndPoint");

      this.claimDetails = null;

      this.myClaimsService.getClaimsforICNEndPointRequest(claimesUrl, mask, request)
        .subscribe(response => {
          if (response) {

            if (response.ROWSET.ROWS instanceof Array) {
              this.claimDetails = response["ROWSET"].ROWS;
            } else {
              this.claimDetails = new Array(response.ROWSET.ROWS);
            }
            this.updateClaimStatus();
          } else {
            this.claimDetails = null;
          }
        },
        error => {
          let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMDETAILS_FEATURE_NOTAVAIL;
          if (error.displaymessage) {
            errmsg = error.displaymessage;
          }
          this.claimDetails = null;

          this.showAlert('ERROR', errmsg);
          this.authService.addAnalyticsAPIEvent(error.displaymessage, claimesUrl, error.result);
        }
        );
    }, 100);

  }
}
