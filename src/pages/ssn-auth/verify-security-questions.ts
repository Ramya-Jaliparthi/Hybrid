import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UpdatessnModel } from '../../models/login/updatessn.model';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertModel } from '../../models/alert/alert.model';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { MessageProvider } from '../../providers/message/message';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { SecurityQuestionsPage } from "./security-questions";

declare var scxmlHandler: any;
@Component({
    selector: 'page-verify-security-questions',
    templateUrl: 'verify-security-questions.html',
})
export class VerifySecurityQuestionsPage {

    VerifySecurityQuestions: any;
    authSsnForm: FormGroup;
    alerts: Array<any>;
    // sample variables to check screen for security question count
    count: number;
    isQuestionTried: boolean;
    onSsnBlur: boolean = false;
    showSSN: boolean = true;
    subHeaderTop: string;
    resObj: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public alertCtrl: AlertController,
        private messageProvider: MessageProvider,
        private userContext: UserContextProvider,
        private authService: AuthenticationService,
        public platform: Platform,
        private authenticationStateProvider: AuthenticationStateProvider) {

        let ssnVal = "";
        if (this.authService.memAuthData && this.authService.memAuthData.ssn && this.authService.memAuthData.ssn != null)
            ssnVal = this.authService.memAuthData.ssn;

        this.authSsnForm = this.fb.group({
            ssn: [ssnVal, Validators.compose([Validators.required, ValidationProvider.ssnValidator])],
        });
    }
    ionViewDidEnter() {
        this.prepareAlertModal(null);
        if (this.navParams.data["errorCode"] && this.navParams.data["errorDesc"]) {
            this.isQuestionTried = true;
            this.errorBanner(this.navParams.data["errorDesc"]);
        }
        if (ConstantsService.FAILED_QUES_COUNT >= 2) {
            this.isQuestionTried = true;
            this.errorBanner(ConstantsService.ERROR_MESSAGE_LN_MAX_ATTEMPT);
        } else {
            this.isQuestionTried = false;
            this.errorBanner(ConstantsService.ERROR_MESSAGE_LN_SECOND_ATTEMPT);
        }
    }

    cancel() {
        scxmlHandler.playSoundWithHapticFeedback();

        this.userContext.setLoginState(LoginState.Registered);
        // handle cancel request from any of the auth screens based on user scopename
        // if scopename is 'REGISTERED_NOT_VERIFIED', force user to Verify Account.
        // Else, close the auth screen modal to show Registered Home page
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
                this.gotoAccessCodeVerificationPage();
            }

        }
        else {
            // go to OR render Registered Home page
            this.userContext.setLoginState(LoginState.Registered);
            this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
        }
    }

    handleAndroidBack() {
        this.cancel();
    }

    authenticateSsnInfo(event, formData) {
        let updatessn = new UpdatessnModel();

        updatessn.ssn = 'XXXXX' + this.authSsnForm.value.ssn;

        if (!formData.valid) {

            Object.keys(this.authSsnForm.controls).forEach(field => {
                const control = this.authSsnForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
            this.onSsnBlur = true;
            if (this.authSsnForm.value.ssn == "" || this.authSsnForm.value.ssn == undefined) {
                this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
                this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
                // client error
            }
            return;
        }


        this.authWithSSN(updatessn);

    }

    authWithSSN(request: UpdatessnModel) {

        let mask = this.authService.showLoadingMask('Updating Member Information...');
        setTimeout(() => {
            const generatedRequest = {
                ...request,
                useridin: this.authService.useridin
            };

            let authWithSSNURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'authwithssn';

            const isKey2Req = false;

            this.authService.makeHTTPRequest("post", authWithSSNURL, mask, JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2Req)), this.authService.getHttpOptions(), 'Updating Member Information...')

                .map(res1 => {
                    let resobj = res1;//.json();
                    if (resobj.result === "0") {
                        return resobj;
                    }
                    else {
                        console.log('authWithSSN :: error =' + resobj.errormessage);
                        let emsg = resobj.displaymessage;
                        this.authService.handleAPIResponseError(resobj, emsg, authWithSSNURL);

                    }

                })
                .subscribe(response => {
                    if (response && response.result === "0") {

                        let etarget = 'Authentication.SubmittedSSN';
                        let edataobj = { "context": "action", "data": { "App.authMethod": "Submitted SSN" } };
                        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

                        this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_SSN_UPDATED, response);

                    }
                },
                err => {
                    console.log("Error during Member SSN Update -" + err);
                    this.authService.addAnalyticsAPIEvent(err.displaymessage, authWithSSNURL, err.result);
                }
                );
        }, 100);


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

    gotoAccessCodeVerificationPage() {

        this.navCtrl.push(VerifyPasscodePage);
    }

    goToSecurityQuestionsPage() {
        this.navCtrl.push(SecurityQuestionsPage);
    }

    showSSNForm() {
        this.showSSN = true;
    }

    hideSSNForm() {
        this.showSSN = false;
    }

    errorBanner(message) {
        let alertObj = {
            messageID: "",
            AlertLongTxt: message,
            AlertShortTxt: "",
            RowNum: ""
        }
        let a: AlertModel = this.prepareAlertModal(alertObj);
        if (a != null) {
            this.userContext.setAlerts([a]);
        }
        this.alerts = this.userContext.getAlerts();
    }

    isAlertShowing() {
        let alts: Array<any> = this.userContext.getAlerts();
        return alts.length == 0;
    }
    prepareAlertModal(alert: any) {
        if (alert) {
            let a: AlertModel = new AlertModel();
            a.id = alert.messageID;
            a.message = alert.AlertLongTxt;
            a.alertFromServer = true;
            a.showAlert = true;
            a.title = alert.AlertShortTxt;
            a.type = "info";
            a.RowNum = alert.RowNum;
            return a;
        }
        return null;
    }


}
