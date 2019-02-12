import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { AlertController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';

declare var scxmlHandler: any;
@Component({
    selector: 'page-authPromoOptIn',
    templateUrl: 'auth-optin-promo.html',
})
export class AuthOptInPromoPage {
    resObj: any;
    pageName:any;
    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        public config: ConfigProvider,
        private userContext: UserContextProvider,
        private authService: AuthenticationService,
        private authenticationStateProvider: AuthenticationStateProvider,
        private messageProvider: MessageProvider) {
            this.pageName = this.authService.pageName;
    }


    ngOnInit() {
        
        let etarget = 'AuthenticationOptInModal';
        let edataobj = { "context": "state", "data": { "App.displayName": "Authentication OptIn Modal" } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_DISPLAY + etarget, edataobj);
        
    }

    /* Close should take user to registered dashboard page*/
    close(event) {
        window.setTimeout(() => {
            this.userContext.setLoginState(LoginState.Registered);
            this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
        }, ConstantsService.EVENT_HANDLING_TIMEOUT);

    }

    /* Cancel will send verification code and navigate to passcode verification code page */
    cancel(event) {
        scxmlHandler.playSoundWithHapticFeedback();
        window.setTimeout(() => {
            if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED) {


                if (this.userContext.getIsVerifycodeRequested(this.authService.useridin) == "false") {
                    this.authService.sendAccessCode().then((result) => {
                        this.resObj = result;
                        if (this.resObj.result === "0") {
                            this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");
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
                    this.navCtrl.push(VerifyPasscodePage);
                }



            }
            else {
                this.userContext.setLoginState(LoginState.Registered);
                this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
            }
        }, ConstantsService.EVENT_HANDLING_TIMEOUT);

        event.cancelBubble = true;
    }
    showAuth(event) {
        //scxmlHandler.playSoundWithHapticFeedback();
        //this.userContext.setAuthenticateNowPromoTaped(true);
        //this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, null);
        // this.navCtrl.popToRoot({ animate: false, direction: "forward" });
        this.navCtrl.popToRoot();
        event.preventDefault();
    }

    verifynow(){
        scxmlHandler.playSoundWithHapticFeedback();
        this.userContext.setAuthenticateNowPromoTaped(true);
        this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, null);

    }

    gotoAccessCodeVerificationPage() {

        this.navCtrl.push(VerifyPasscodePage);
    }

    showAlert(ptitle, psubtitle) {
        let alert = this.alertCtrl.create({
            title: ptitle,
            subTitle: psubtitle,
            buttons: ['OK']
        });
        alert.present();
    }
}
