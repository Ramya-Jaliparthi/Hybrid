import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { FormBuilder } from '@angular/forms';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { Observable } from "rxjs/Observable";
import { SsnAuthPage } from './ssn-auth';
import { AlertModel } from '../../models/alert/alert.model';
import { SecurityQuestionsService } from './security-questions.service';
import { SsnAuthService } from './ssn-auth.service';


declare var scxmlHandler: any;
@Component({
    selector: 'page-security-questions',
    templateUrl: 'security-questions.html',
})
export class SecurityQuestionsPage {

    securityQuestions: any;
    selectedChoice: any = [];
    timer: any;
    timer_seconds: any;
    alerts: Array<any>;
    lnResponse: any;
    isMediCareUser: boolean = false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public alertCtrl: AlertController,
        private userContext: UserContextProvider,
        private authService: AuthenticationService,
        private authenticationStateProvider: AuthenticationStateProvider,
        private securityQuestionsService: SecurityQuestionsService,
        private ssnAuthService: SsnAuthService) {

        this.lnResponse = this.navParams.data["questions"];
        this.securityQuestions = this.navParams.data["questions"].Products[0].QuestionSet.Questions;

        this.startTimer();

    }

    ionViewDidEnter() {
        let etarget = 'Authentication.LexisNexis';
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
        this.isMediCareUser = this.ssnAuthService.isMediCareUser;
    }

    cancel() {
        scxmlHandler.playSoundWithHapticFeedback();
        this.timer_seconds = -1;
        this.timer.unsubscribe();
        this.gotoVerifySecurityQuestionsPage("");
    }
    // TODO check if below method is used. 
    sendaccesscode() {
        if (this.userContext.getIsVerifycodeRequested(this.authService.useridin) == "false") {
            let mask = this.authService.showLoadingMask('Sending access code...');

            setTimeout(() => {
                const request = {
                    useridin: this.authService.useridin
                };
                let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAuthEndPoint") + 'sendaccesscode';
                console.log('send access code url:' + sendAccessCodeUrl);

                this.securityQuestionsService.securityQuestionsRequest(sendAccessCodeUrl, mask, request, this.authService.getHttpOptions(), 'Sending access code...')

                    .subscribe(res => {
                        let resobj = res;//.json();
                        if (resobj.result === "0") {
                            this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");
                            this.gotoAccessCodeVerificationPage();
                            return resobj;
                        } else {
                            console.log('sendaccesscode :: error =' + resobj.errormessage);
                            let emsg = resobj.displaymessage;
                            this.authService.handleAPIResponseError(resobj, emsg, sendAccessCodeUrl);
                            this.authService.addAnalyticsAPIEvent(resobj.errormessage, sendAccessCodeUrl, '');
                        }
                    }, err => {
                        this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result);
                    });
            }, 100);
        } else {
            this.gotoAccessCodeVerificationPage();
        }
    }

    postAnsweres() {
        var questions = [];
        for (var i = 0; i < this.securityQuestions.length; i++) {
            var quesId = this.securityQuestions[i].QuestionId;

            var choice_id = this.selectedChoice[quesId];
            if (typeof choice_id == "undefined") {
                let eMsg = ConstantsService.ERROR_MESSAGES.SSNAUTH_SECURITYQUES_YOUMUST_ANSWERQUESTIONS;
                this.errorBanner(eMsg);
                this.authService.addAnalyticsClientEvent(eMsg);
                return;
            }
            var choices = [];
            var choice_obj = {
                "Choice": choice_id
            }

            choices.push(choice_obj);

            var questions_obj = {
                "QuestionId": quesId,
                "Choices": choices
            }

            questions.push(questions_obj);

        }

        var questionSetId = this.lnResponse.Products[0].QuestionSet.QuestionSetId;

        var postJson = {

            "Answers": {
                "QuestionSetId": questionSetId,
                "Questions": questions
            }
        }


        this.timer_seconds = -1;
        this.timer.unsubscribe();


        let mask = this.authService.showLoadingMask('Validating Security Questions...');
        setTimeout(() => {
            const generatedRequest = {
                useridin: this.authService.useridin,
                "convid": this.lnResponse.Status.ConversationId,
                "answerobject": postJson

            };
            let authwithLNUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'validatelnanswers';

            this.securityQuestionsService.securityQuestionsRequest(authwithLNUrl, mask, generatedRequest, this.authService.getHttpOptions(), 'Verifying access code...')

                .subscribe(response => {
                    console.log('Response verifyAccessCode ', response);
                    if (response && response.result == 0) {
                        //this.authService.updateLNAttempt(response);
                        let edataobj = { "context": "action", "data": { "App.authMethod": "Lexis Nexis Security Questions" } };
                        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + 'Authentication.SubmittedToLexisNexis', edataobj);
                        this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_LN_UPDATED, response);

                    } else if (response.result === "-1" || response.result === "-10") {
                        //this.authService.updateLNAttempt(response, true);
                        let emsg = ConstantsService.LN_FAILURE_ATTEMPT_FIRST;
                        let etarget = 'Authentication.LexisNexis.Error';
                        let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                        this.gotoVerifySecurityQuestionsPage(emsg);
                    } else if (response.result === "-2" || response.result === "-11") {
                        //this.authService.updateLNAttempt(response, true);
                        let emsg = ConstantsService.LN_FAILURE_ATTEMPT_SECOND;
                        let etarget = 'Authentication.LexisNexis.Error';
                        let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                        this.gotoVerifySecurityQuestionsPage(emsg);
                    } else if (response.result === "-350" || response.result === "-3") {
                        //this.authService.updateLNAttempt(response, true);
                        let emsg = ConstantsService.LN_SERVER_UNAVAILABLE;
                        let etarget = 'Authentication.LexisNexis.Error';
                        let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                        this.gotoVerifySecurityQuestionsPage(emsg);
                    } else if (response.result === "-450") {
                        this.getMemberAuthInfo(response);
                    } else if (response.errormessage) {
                        console.log('verifyAccessCode :: error =' + response.errormessage);
                        this.authService.addAnalyticsAPIEvent(response.errormessage, authwithLNUrl, '');
                        //this.authService.updateLNAttempt(response, true);
                        let errMessage = response.displaymessage ? response.displaymessage : response.errormessage;
                        this.gotoVerifySecurityQuestionsPage(errMessage);
                    }
                },
                err => {
                    var errmsg = ConstantsService.ERROR_MESSAGES.SSNAUTH_SECURITYQUES_LNAUTH_SERVER_ERROR;
                    console.log(err);

                    if (err.displaymessage)
                        errmsg = err.displaymessage;
                    this.authService.addAnalyticsAPIEvent(errmsg, authwithLNUrl, err.result);
                    this.gotoVerifySecurityQuestionsPage(err.displaymessage);

                });
        }, 100);

    }

    startTimer() {
        this.timer_seconds = 240000;
        var minutes;
        var seconds;

        this.timer = Observable.interval(1000).take(240).subscribe(x => {
            minutes = Math.floor(this.timer_seconds / 60);
            seconds = Math.floor(this.timer_seconds % 60);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            //   display.textContent = minutes + ":" + seconds;  if want to show the timer

            this.timer_seconds = this.timer_seconds - 1000;
            if (this.timer_seconds == 0) {
                this.timer.unsubscribe();
                this.gotoVerifySecurityQuestionsPage(ConstantsService.TIME_OUT_MESSAGE);
                this.showAlert("Timeout", ConstantsService.TIME_OUT_MESSAGE);
            }
        })
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

    gotoVerifySecurityQuestionsPage(errorMsg) {
        this.navCtrl.push(SsnAuthPage, { "LNError": errorMsg });
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
            a.type = "error";
            a.RowNum = alert.RowNum;
            a.hideCloseButton = true;
            return a;
        }
        return null;
    }

    getMemberAuthInfo(errorResult) {
        let mask = this.authService.showLoadingMask();

        setTimeout(() => {
            const request = {
                useridin: this.authService.useridin

            };
            //dependentRecentRxEndPoint            
            let memberAuthInfoURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'getmemauthinfo';

            this.securityQuestionsService.securityQuestionsRequest(memberAuthInfoURL, mask, request, this.authService.getHttpOptions(), 'Accessing Dependent List...')
                .subscribe(response => {
                    if (response) {
                        response = this.authService.handleDecryptedResponse(response);
                        let memAuthData = response.ROWSET.ROWS;
                        //this.authService.updateLNAttempt(memAuthData, true);
                        if (!memAuthData.authAllowed && !memAuthData.authLNAllowed && memAuthData.authAttemptCnt >= 3) {
                            // If LN throws MAx error update the LN count to attempt count bcoz "-50" is not thrown by LN API
                            this.authService.authlnattemptcount = memAuthData.authAttemptCnt;
                            let emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_LN_AUTH_COUNT;
                            let etarget = 'Authentication.LexisNexis.Error';
                            let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                            this.gotoVerifySecurityQuestionsPage("");
                        } else {
                            let emsg = "";
                            if (this.authService.authlnattemptcount === "1") {
                                emsg = ConstantsService.LN_FAILURE_ATTEMPT_FIRST;
                            } else {
                                emsg = ConstantsService.LN_FAILURE_ATTEMPT_SECOND;
                            }
                            let etarget = 'Authentication.LexisNexis.Error';
                            let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                            this.gotoVerifySecurityQuestionsPage(emsg);
                        }
                    }
                },
                err => {
                    console.log("Error while getting Member Auth Info -" + JSON.stringify(err));
                    let errmsg = ConstantsService.ERROR_MESSAGES.MEMBERINFO_SERVER_ERROR;
                    if (err.displaymessage) {
                        errmsg = err.displaymessage;
                    }
                    this.authService.addAnalyticsAPIEvent(err.displaymessage, memberAuthInfoURL, err.result);
                }
                );
        }, 500);
    }

}
