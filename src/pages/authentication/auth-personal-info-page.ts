import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SsnAuthPage } from '../../pages/ssn-auth/ssn-auth';
import { MemberInformationPage } from '../../pages/member-information/member-information';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';

declare var scxmlHandler: any;
@Component({
  selector: 'auth-personal-info-page',
  templateUrl: 'auth-personal-info-page.html'
})
export class AuthPersonalInfoPage {
  resObj: any;

  constructor(public navCtrl: NavController,
    private userContext: UserContextProvider,
    private messageProvider: MessageProvider,
    private authService: AuthenticationService,
  ) {

  }

  ionViewDidEnter() {
    this.userContext.setCustomBackHandler(this);
    this.userContext.setLoginState(LoginState.Registered);
  }
  cancelAuth(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED) {
      if (this.authService.isVerifycodeRequested != "true") {
        this.authService.sendAccessCode().then((result) => {
          this.resObj = result;
          if (this.resObj.result === "0") {
            this.authService.isVerifycodeRequested = "true";
            this.gotoAccessCodeVerificationPage();

            return this.resObj;
          } else {
            console.log('sendaccesscode :: error =' + this.resObj.displaymessage);
            let emsg = this.resObj.displaymessage;
            this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);

          }

        }, (err) => {
          console.log(err);
        });
      } else {
        console.log('verify access code already requested. Going to veify code entry page');
        this.gotoAccessCodeVerificationPage();
      }

    }
    else {
      // go to OR render Registered Home page
      this.userContext.setLoginState(LoginState.Registered);
      this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
    }
    if (event != null) {
      event.cancelBubble = true;
    }
  }

  handleAndroidBack() {
    this.cancelAuth(null);
  }
  handleProgressIconTap(index) {
    if (index == 2)
      this.gotoMemberInfoPage();
    else if (index == 3)
      this.gotoUpdateSSNPage();
  }

  gotoMemberInfoPage() {
    this.navCtrl.push(MemberInformationPage);
  }

  gotoUpdateSSNPage() {
    this.navCtrl.push(SsnAuthPage);
  }


  gotoAccessCodeVerificationPage() {

    this.navCtrl.push(VerifyPasscodePage);
  }
}
