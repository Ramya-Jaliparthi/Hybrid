import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-security-pin',
  templateUrl: 'security-pin.html',
})
export class MySecurityPage {

  pinCaption: string = "Show";
  securitypin: number;
  onPinBlur: boolean = false;
  securitypinchked: boolean;
  disableSecurityPage: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private authService: AuthenticationService
  ) {

    window['SettingsRef'] = {
      component: this
    };

    let secPin: number = navParams.get("securitypin");
    console.log("MySecurityPage :: secPin " + secPin);
    if (!this.securitypin && secPin != null) {
      this.securitypin = secPin;
    }

    let pinChecked: boolean = navParams.get("securitypinchked");
    console.log("MySecurityPage :: pinChecked " + pinChecked);
    if (!this.securitypinchked && pinChecked != null) {
      this.securitypinchked = pinChecked;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySettingsPage');
  }

  toggleSecurityPinSwitch(ele: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    console.log("toggleSecuritySwitch " + this.securitypinchked);

    console.log("toggleSecuritySwitch final value " + ele.disabled);
  }

  togglePinDisplay(input: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'number' : 'password';
    this.pinCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

  cancel() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.viewCtrl.dismiss();
  }

  updateMemberPIN() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (!this.validatePin((this.securitypin))) {
      this.showAlert("", "Invalid Pin");
      this.authService.addAnalyticsClientEvent("Invalid Pin");
      return;
    }
    let params: Array<any> = [];
    params.push({ "memkeyname": "securitypin", "memkeyvalue": String(this.securitypin) });
    params.push({ "memkeyname": "securitypinchked", "memkeyvalue": String(this.securitypinchked) });
    this.updateMemberProfile(params);

  }

  validatePin(value) {
    if (value && value.match(/^[0-9]{4}$/)) {
      return true;
    } else {
      return false;
    }
  }

  updateMemberProfile(jsonArrayProfile: Array<any>) {
    let mask = this.authService.showLoadingMask();

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin,
        memobject: jsonArrayProfile
      };

      const isKey2req = false;

      let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("updatememprofileEndPoint");

      console.log('updateMemberProfile Url: ' + updateMemberProileURL);

      this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
        .map(res1 => {
          let resobj = res1;//.json();
          console.log('updateMemberProfile :: response =', resobj);
          if (resobj.result === "0") {
            return this.authService.handleDecryptedResponse(resobj);
          } else {
            console.log('updateMemberProfile :: error =' + resobj.errormessage);
            let emsg = resobj.displaymessage;
            this.authService.handleAPIResponseError(resobj, emsg, updateMemberProileURL);
          }
        })
        .subscribe(response => {
          console.log('Response updateMemberProfile:', response);
          if (response.result != "0" && response.displaymessage) {
            this.showAlert('', response.displaymessage);
            this.authService.addAnalyticsAPIEvent(response.displaymessage, updateMemberProileURL, response.result);
            this.securitypinchked = !this.securitypinchked;
          }
        },
        err => {
          console.log("Error while updateMemberProfile Info -" + JSON.stringify(err));
          let errmsg = "Error while updateMemberProfile - Server encountered error processing your request"
          if (err.displaymessage) {
            errmsg = err.displaymessage;
          }
          this.securitypinchked = !this.securitypinchked;
          this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemberProileURL, err.result);
        }
        );
    }, 500);
  }

  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: [{
        text: 'Ok',
        handler: data => {
        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }
}
