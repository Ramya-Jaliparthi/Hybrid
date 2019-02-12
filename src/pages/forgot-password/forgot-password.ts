import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, Platform,NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';
import { LoginComponent } from '../../pages/login/login.component';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { PasscodeVerificationRequest } from '../../models/login/passcodeVerificationRequest.model'
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { RegistrationComponent } from '../../pages/login/registration.component';
import * as moment from 'moment';
import { AlertModel } from '../../models/alert/alert.model';
import { ForgotPasswordService } from './forgot-password.service';
import {UpdateForgorPasswordComponent} from '../../pages/forgot-password/update-password';
import { ForgotPasswordResponseModel } from '../../models/forgot-password/forgot-password.model';

declare var scxmlHandler: any;
@Component({
  selector: 'forgot-password',
  templateUrl: 'forgot-password.html',
  host: { 'class': 'forgot-page-css' }
})
export class ForgotPassword {

  showForgotform: boolean = true;
  authenticated: boolean = true;
  //showresentMsg:boolean = false; /**This is not required. */
  showVerificationform: boolean = false;
  showSetNewPassword: boolean = false;
  disableSubmitButton:boolean = false;
  userid: string;
  buttonCaption: string = "Show";
  dobMask: Array<any>;
  maxdob: string = '';
  userNameBlur: boolean = false;
  dateOfBirthBlur: boolean = false;
  hintquationBlur: boolean = false;
  weHaveFoundMatch: string = ConstantsService.FORGOTUSERNAME_WEHAVEFOUNDMATCH;
  alerts: Array<AlertModel> = null;
  showRegisterSection: boolean = false;
  email: string = null;
  onNewPasswordBlur: boolean = false;
  isRequestingServer: boolean = false;
  accessCodeUpdateAttemptCount: number = 0;
  accessCodeMaxAttemptCount: number = 2;
  disableAccessBtn: boolean = false;
  dobBtnCaption: string = "Show";
  registerType: string = "EMAIL";
  letsSetupNewpswd: string = ConstantsService.FORGOTPSWD_LETS_SETUP_NEWPSWD;
  forgotUserNameNeedInfoFirst: string = ConstantsService.FORGOTUSERNAME_NEEDINFOFIRST;
  hintQuestion: string;
  hintQuestionValu: number = 0;
  hintquationDisabled: boolean = false;
  hintQuationPlaceholder: string;
  basicForgotPasswordForm: boolean = true;
  dobRegistrationForm: boolean = false;
  commType: string = "";
  commValue: string = "";
  userId:string;
  constructor(public navCtrl: NavController,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public alertCtrl: AlertController,
    public platform: Platform,
    private elRef: ElementRef,
    private renderer: Renderer,
    private forgotPasswordService: ForgotPasswordService,
    private navParams: NavParams
  ) {
    this.userId = this.navParams.get("userNameParameter");
    console.log("userId : "+this.userId);
    this.dobMask = ValidationProvider.dobMask;
    // this.maxdob = moment().format('MM/DD/YYYY');
    this.maxdob = moment().format('YYYY-MM-DD');
    this.hintQuationPlaceholder = ""

    /*if (this.hintQuestionValu === 0) {
      this.hintQuestion = "Unavailable";
      this.hintQuationPlaceholder = "Unavailable"
      this.hintquationDisabled = true;
    } else {
      this.hintquationDisabled = false;
      this.hintQuestion = "";
      this.hintQuationPlaceholder = ""
    }*/


  }

  ionViewDidLoad() {
    let etarget = 'ForgotPassword';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  compareFn(option1: any, option2: any) {
    return option1.value === option2.value;
  }
  private forgotPasswordForm1 = this.fb.group({
    userName: ["", Validators.compose([ValidationProvider.requiredUsername])]
  });

  private forgotPasswordForm = this.fb.group({
    // userName: ["", Validators.compose([Validators.required, ValidationProvider.usernameValidator])],
    dateOfBirth: ["", Validators.compose([ValidationProvider.requiredDOB, ValidationProvider.dobValidator])],
    //hintquation: ["",]
    hintquation: ["", Validators.compose([ValidationProvider.requiredHintAnswer, ValidationProvider.hintAnswerValidator])],
  });

  private verificationCodeForm = this.fb.group({
    accesscode1: ["", Validators.required],
    accesscode2: ["", Validators.required],
    accesscode3: ["", Validators.required],
    accesscode4: ["", Validators.required],
    accesscode5: ["", Validators.required],
    accesscode6: ["", Validators.required]

  });
  private submitNewPasswordForm = this.fb.group({
    newPassword: ["", Validators.compose([Validators.required, ValidationProvider.passwordValidator])],

  });

  togglePwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

  gotoRegistrationPage() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(RegistrationComponent);
  }

  setFocusOnFirstBox() {
    window.setTimeout(() => {
      if (document.getElementById('accesscode1')) {
        document.getElementById('accesscode1').focus();
      }
    }, 300);
  }

  toggleDOBDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.dobBtnCaption === 'Hide') {
      this.dobBtnCaption = 'Show'
      document.getElementById('dobInput').setAttribute("style", "width: 40%; padding-left: 15px; border: 0px !important;  text-align: left; -webkit-text-security: disc;");
    } else {
      this.dobBtnCaption = 'Hide'
      document.getElementById('dobInput').setAttribute("style", "width: 40%; padding-left: 15px; border: 0px !important;  text-align: left; -webkit-text-security: none;");
    }
  }
  maskDobInput(input: any): any {
    if (this.dobBtnCaption == 'Show') {
      document.getElementById('dobInput').setAttribute("style", "width: 40%; padding-left: 15px; border: 0px !important;  text-align: left; -webkit-text-security: disc;");
    } else {
      document.getElementById('dobInput').setAttribute("style", "width: 40%; padding-left: 15px; border: 0px !important;  text-align: left; -webkit-text-security: none;");
    }
  }

  submitForgotpasswordUserFrom(){
      let isFromSendAccCode = false;
      this.isRequestingServer = true;
      if (!this.forgotPasswordForm1.valid) {
        Object.keys(this.forgotPasswordForm1.controls).forEach(field => {
          console.log('field :: ' + field);
          const control = this.forgotPasswordForm1.get(field);
          control.markAsTouched({ onlySelf: true });
        });
        this.userNameBlur = true;
        if(this.forgotPasswordForm1.get('userName').value == "" || this.forgotPasswordForm1.get('userName').value == undefined){
          this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
          this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        }
        return;
      }
      this.userid = this.forgotPasswordForm1.get('userName').value;
      this.email = this.maskEmail(this.userid); 
      this.forgotPasswordService.userId = this.userid;
      this.makeVerifyUserNameRequest(this.userid,isFromSendAccCode); 
  }
  makeVerifyUserNameRequest(userid,isFromSendAccCode){
    this.alerts = null;
    if (!this.authService.token) {
      this.authService.makeTokenRequest(false).subscribe(token => {
        this.authService.token = token;
        this.makeVerifyUserNameHttpRequest(userid,isFromSendAccCode);
      },
        err => {
          this.isRequestingServer = false;
          this.showAlert('ERROR', 'Error - Invalid Security Token');
          this.authService.addAnalyticsClientEvent("Error - Invalid Security Token");
          return;
        }
      );
    } else {
      this.makeVerifyUserNameHttpRequest(userid,isFromSendAccCode);
    }

  }
  makeVerifyUserNameHttpRequest(userNameIn: string, isFromSendAccCode: boolean) {
    let pMsg: string = isFromSendAccCode ? "Sending..." : "Verifying...";
    let mask = this.authService.showLoadingMask(pMsg);
    setTimeout(() => {

      let verifyUserUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfpuser");
      // const isKey2Req = false; 
      let request = {
       "mesg": {
          "useridin": userNameIn
       }
      };
      this.isRequestingServer = false;
      console.log('verify user url :: ' + verifyUserUrl);      
      this.forgotPasswordService.forgotPasswordRequest(verifyUserUrl, mask, request, this.authService.getHttpOptions(), 'Verifying access code...')
        .subscribe(response => {

          console.log(response);
          //console.log(this.authService.handleDecryptedResponse(res));
          let res = new ForgotPasswordResponseModel();
          res= this.authService.handleDecryptedResponse(response);
          this.commType = res.commType;
          this.commValue = res.commValue;
          this.hintQuestion = res.hintQuestion;
          this.forgotPasswordService.webNonMigratedUser = res.webNonMigratedUser;
          //this.commType = this.authService.handleDecryptedResponse(response);
          if (response.result === "0") { /** API is not returning 0 value here */
            this.alerts = null;
            if(res.isAuthenticated == "TRUE"){
              this.basicForgotPasswordForm = false;
              this.dobRegistrationForm = true; 
              
                if (this.hintQuestion != "") {
                  this.hintquationDisabled = false;
                  this.hintQuationPlaceholder = ""; 
                  this.forgotPasswordForm = this.fb.group({
                    dateOfBirth: ["", Validators.compose([ValidationProvider.requiredDOB, ValidationProvider.dobValidator])],
                    hintquation: ["", Validators.compose([ValidationProvider.requiredHintAnswer, ValidationProvider.hintAnswerValidator])]
                  });                 
                } else {
                  this.hintQuestion = "Unavailable";
                  this.hintquationDisabled = true;
                  this.hintQuationPlaceholder = "Unavailable";
                  this.forgotPasswordForm = this.fb.group({                    
                    dateOfBirth: ["", Validators.compose([ValidationProvider.requiredDOB, ValidationProvider.dobValidator])],
                    hintquation: [""]
                  });
                }
            } else {
            this.basicForgotPasswordForm = false;
            this.email = this.maskEmail(this.commValue );
            this.showVerificationform = true
          }
        }
          if (isFromSendAccCode) {
            this.alerts = [this.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICATION_RESENT, "info")];
            this.clearForm();
          }

          if (response.displaymessage) {
            this.alerts = [this.prepareAlertModal("Verification", response.displaymessage, "error")];
            let etarget = 'ForgotPassword.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": response.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }
        }, err => {
          console.log('Error response from verify user request ' + err);
          if (err.displaymessage) {
            let etarget = 'ForgotPassword.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": err.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }
          if(err.displaymessage == ConstantsService.ERROR_MESSAGES.FORGOTPSWD_APIERROR_DUP){
            this.alerts = [this.prepareAlertModal("Verification", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_APIERROR, "error")];
            let me = this;
            window.setTimeout(() => {
              let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
              me.renderer.listen(aElement[0], 'click', (event) => {
                me.gotoRegistrationPage();
              });
            }, 10);
          }else{
            this.alerts = [this.prepareAlertModal("Verification", err.displaymessage, "error")];
          } 
        }
        );
    });
  }

  submitForgotpasswordForm() { 

    if (!this.forgotPasswordForm.valid) {
      Object.keys(this.forgotPasswordForm.controls).forEach(field => {
        console.log('field :: ' + field);
        const control = this.forgotPasswordForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.dateOfBirthBlur = true;
      this.hintquationBlur = true;

      if (this.forgotPasswordForm.get('dateOfBirth').value == "" || this.forgotPasswordForm.get('dateOfBirth').value == undefined 
      || this.forgotPasswordForm.get('hintquation').value == "" || this.forgotPasswordForm.get('hintquation').value == undefined
      ) {

        this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

    this.userid = this.forgotPasswordForm1.get('userName').value;
    this.forgotPasswordService.userId = this.userid;
    this.email = this.maskEmail(this.commValue );
    let dobString = this.forgotPasswordForm.get('dateOfBirth').value;
    let splitString = dobString.split("/");
    let dob = splitString[2]+"-"+splitString[0]+"-"+splitString[1];
    let hintAns = this.forgotPasswordForm.get('hintquation').value;
    console.log("hintquation :" + hintAns);
    this.makeVerifyUserRequest(this.userid, dob, false,hintAns);

    let etarget = 'ForgotPassword.VerificationCode';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous", "RegMethod": this.registerType } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

  }

  showSetNewPasswordForm() {
    this.showVerificationform = false;
    //this.showSetNewPassword = true;
    this.navCtrl.push(UpdateForgorPasswordComponent);
    let etarget = 'ForgotPassword.CreateNewPassword';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  resendVerificationCode() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.disableAccessBtn) {
      this.disableAccessButton();
      return;
    }
    this.makeVerifyUserRequest(this.forgotPasswordForm1.get('userName').value, this.forgotPasswordForm.get('dateOfBirth').value, true,"");

    let etarget = 'ForgotPassword.VerificationCodeResent';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous", "RegMethod": this.registerType } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

  }
  showVerificationForm() {

    this.showForgotform = false;
    this.showVerificationform = true;
  }

  showLoginPage() {
    this.navCtrl.push(LoginComponent, { "userId": this.userid });
  }

  handleBackspace(previousElement: any, firstElement1: any, secondElement1: any, event) {
    if (event.which === 8) {
      if (firstElement1.value != "") {
        firstElement1.value = "";
        firstElement1.focus();
      }
      else if (previousElement != null) {
        previousElement.value = "";
        previousElement.focus();
      }
    }
  }

  setFocus(previousElement: any, firstElement1: any, secondElement1: any, event) {
    if (event.which === 13) {
      if (this.verificationCodeForm.valid) {
        if (this.disableAccessBtn) {
          this.disableAccessButton();
          return;
        }
        this.onSubmit();
      }
    }
    else if (firstElement1.value.length >= 0 && firstElement1.value.match(/^[0-9]$/)) {
      if (firstElement1 === secondElement1) {
        secondElement1.blur();
        /* Do not submit the form on last entered digit. User will press the continue button.
         if(this.forgotPasswordForm.valid)
           this.onSubmit();
          */
      } else {
        secondElement1.focus();
      }

    }
  }
  onSubmit() {
    if (!this.verificationCodeForm.valid) {
      Object.keys(this.verificationCodeForm.controls).forEach(field => {
        const control = this.verificationCodeForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    let verificationrequestModel = new PasscodeVerificationRequest();
    console.log(this.verificationCodeForm.value);
    verificationrequestModel.accesscode = String(this.verificationCodeForm.value.accesscode1) +
      String(this.verificationCodeForm.value.accesscode2) +
      String(this.verificationCodeForm.value.accesscode3) +
      String(this.verificationCodeForm.value.accesscode4) +
      String(this.verificationCodeForm.value.accesscode5) +
      String(this.verificationCodeForm.value.accesscode6);

    if (this.accessCodeUpdateAttemptCount >= this.accessCodeMaxAttemptCount) {
      this.disableAccessButton();
      return;
    }
    this.verifyAccessCode(verificationrequestModel);
  }

  disableAccessButton() {
    if (this.platform.is("ios") && this.platform.is("ipad")) {
      this.alerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_ACCOUNTLOCKED, ConstantsService.ERROR_MESSAGES.FORGOTPSWD_INCORRECTLOGIN, "error")];
    } else {
      this.alerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_ACCOUNTLOCKED, ConstantsService.ERROR_MESSAGES.FORGOTPSWD_INCORRECTLOGIN_ANCHOR, "error")];
    }
    this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_INCORRECTLOGIN_NOTAG);
    this.disableAccessBtn = true;
    document.getElementById('sendAnchorTagId').setAttribute("style", "pointer-events: none; opacity: 0.4;");
  }


  clearForm() {
    this.verificationCodeForm.reset();
    window.setTimeout(() => {
      if (document.getElementById('accesscode1')) {
        document.getElementById('accesscode1').focus();
      }
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

  prepareAlertModal(title: string, msg: string, type: string) {
    if (msg) {
      let a: AlertModel = new AlertModel();
      a.id = "1";
      a.message = msg;
      a.alertFromServer = false;
      a.showAlert = true;
      a.title = title;
      a.type = type ? type : "error";
      a.hideCloseButton = false;
      return a;
    }
    return null;
  }
  replaceBetween(start, end, what, str) {
    what = what.repeat(end - start);
    return str.substring(0, start) + what + str.substring(end);
  };
  maskEmail(number) {
    var phone_email = "";
      var i = number.length;

      if (i == 10) {
        var first = number.slice(0, 3);
        var second = number.slice(3, 6);
        var three = number.slice(6, 10);

        var FirstMask = this.replaceBetween(0, 3, '*', first)
        var SecondMask = this.replaceBetween(0, 3, '*', second)

        phone_email = FirstMask + "-" + SecondMask + "-" + three;
      } else if (i != 10) {

        var parts = number.split("@");
        var part1 = parts[0];

        var spliteno = part1.length;
        phone_email = this.replaceBetween(4, spliteno, '*', number);

      }
      else {
        phone_email = "invalid number US number";
      }
      return phone_email;

  }

  verifyAccessCode(request: PasscodeVerificationRequest) {

    let mask = this.authService.showLoadingMask('Verifying access code...');
    setTimeout(() => {
      const generatedRequest = {
        // ...request,
        accessCode: request.accesscode,
        commType:this.commType,
        userIdRequired: "false",
        useridin: this.userid,
        commValue: this.commValue
      };
      // const isKey2Req =false;
      let verifyAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunaccesscode");
      console.log('verifyAccessCodeUrl:' + verifyAccessCodeUrl);


      this.forgotPasswordService.forgotPasswordRequest(verifyAccessCodeUrl, mask, generatedRequest, this.authService.getHttpOptions(), 'Verifying access code...')
        .subscribe(res => {
          let response = new ForgotPasswordResponseModel();
          response=res;
          if (res.result === 0) {
            //show change password screen.
            this.showSetNewPasswordForm();
            this.alerts = null;
          } else {
            this.clearForm();
            if (this.accessCodeUpdateAttemptCount >= this.accessCodeMaxAttemptCount) {
              this.disableAccessButton();
            }
            if (response.displaymessage) {
              this.alerts = [this.prepareAlertModal("Oops", response.displaymessage, "error")]
              this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUrl, response.result);
            }
          }

        },
        err => {
          var errmsg = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_SERVERERR_ACCESSCODEVERIFI;
          console.log(errmsg);
          console.log("Error:::::" + err);

          this.clearForm();
          if (err.displaymessage)
            errmsg = err.displaymessage;

          if (this.accessCodeUpdateAttemptCount >= this.accessCodeMaxAttemptCount) {
            this.disableAccessButton();
          } else {
            if (err.result === "-2" && String(err.errormessage).indexOf("ACCESS CODE EXPIRED") != -1) {
              let msg: string = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED;
              console.log(msg);
              console.log("ERROR :: ACCESS CODE EXPIRED");
              this.alerts = [this.prepareAlertModal("Oops", msg, "error")];
              this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED_NOTAG, verifyAccessCodeUrl, err.result);
              let me = this;

              window.setTimeout(() => {
                let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
                me.renderer.listen(aElement[0], 'click', (event) => {
                  me.resendVerificationCode();
                });
              }, 10);
            } else if (err.result === "-3" && String(err.errormessage).indexOf("ACCESS CODE MISMATCH") != -1) {
              console.log("ERROR :: ACCESS CODE MISMATCH");
              this.alerts = [this.prepareAlertModal("Oops", err.displaymessage, "error")];
              this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrl, err.result);
              this.accessCodeUpdateAttemptCount++;
            } else {
              console.log("ERROR :: Default error index = " + String(err.errormessage).indexOf("ACCESS CODE MISMATCH"));
              this.alerts = [this.prepareAlertModal("Oops", errmsg, "error")];
              this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrl, err.result);
            }

          }

        });
    }, 100);
  }

  makeVerifyUserHttpRequest(userNameIn: string, dob: string, isFromSendAccCode: boolean,hintAns: string) {
    let pMsg: string = isFromSendAccCode ? "Sending..." : "Verifying...";
    let mask = this.authService.showLoadingMask(pMsg);
    setTimeout(() => {

      // let verifyUserUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyUserEndPoint");
      let verifyUserUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfphintanswer");       
      hintAns = (hintAns == "") ? "" : hintAns;
      let hintQuestionRequired = (hintAns == "") ? "false" : "true";
      const request = {
          "dob": dob,
          "hintQuestionRequired": hintQuestionRequired,
          "hintAnswer":hintAns,
          "useridin":userNameIn
      };
      // if (dob != undefined && dob != "") {
      //   request["dob"] = dob;
      // }
      console.log('verify user url :: ' + verifyUserUrl);
      console.log('Request :: ' + JSON.stringify(request));
      this.forgotPasswordService.forgotPasswordRequest(verifyUserUrl, mask, request, this.authService.getHttpOptions(), 'Verifying access code...')
        .subscribe(res => {
          let response = new ForgotPasswordResponseModel();
          response = res;
          console.log(res);
          if (response.result == 0) { /** API is not returning 0 value here */

            this.alerts = null;
            // this.showVerificationForm();
            // this.showRegisterSection = true;
            // this.setFocusOnFirstBox();
            this.showVerificationform = true;
            this.dobRegistrationForm = false;

          } else{             
          }

          if (isFromSendAccCode) {
            this.alerts = [this.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICATION_RESENT, "info")];
            this.clearForm();
          }

          if (response.displaymessage) {
            this.alerts = [this.prepareAlertModal("Verification", response.displaymessage, "error")];
            let etarget = 'ForgotPassword.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": response.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }
        }, err => {
          console.log('Error response from verify user request ' + err);
          if (err.displaymessage) {
            let etarget = 'ForgotPassword.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": err.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            this.alerts = [this.prepareAlertModal("Verification", err.displaymessage, "error")];
          }
        }
        );
    }, 100);
  }

  makeVerifyUserRequest(userNameIn: string, dob: string, isFromSendAccCode: boolean,hintAns:string) {

    this.alerts = null;
    if (!this.authService.token) {
      this.authService.makeTokenRequest(false).subscribe(token => {
        this.authService.token = token;
        this.makeVerifyUserHttpRequest(userNameIn, dob, isFromSendAccCode,hintAns);
      },
        err => {
          this.showAlert('ERROR', 'Error - Invalid Security Token');
          this.authService.addAnalyticsClientEvent("Error - Invalid Security Token");
          return;
        }
      );
    } else {
      this.makeVerifyUserHttpRequest(userNameIn, dob, isFromSendAccCode,hintAns);
    }
  }

  sendaccesscode() {

    let mask = this.authService.showLoadingMask('Sending access code...');

    setTimeout(() => {
      const request = {
        useridin: this.userid
      };
      let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAuthEndPoint") + 'sendaccesscode';
      console.log('send access code url:' + sendAccessCodeUrl);

      this.forgotPasswordService.forgotPasswordRequest(sendAccessCodeUrl, mask, request, this.authService.getHttpOptions(), 'Sending access code...')

        .subscribe(response => {
          let res = new ForgotPasswordResponseModel();
          res = response;
          if (res.result === "0") {
            this.showVerificationForm();
            return res;
          } else {
            console.log('sendaccesscode :: error =' + res.errormessage);
            if (res.errormessage) {
              this.alerts = [this.prepareAlertModal("Verification", res.displaymessage, "error")];
              this.authService.addAnalyticsAPIEvent(res.displaymessage, sendAccessCodeUrl, res.result ? res.result : '');
            }

          }
          this.alerts = [this.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICATION_RESENT, "info")];
          this.clearForm();
        }, err => {
          console.log(err);
          this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result ? err.result : '');
        });
    }, 100);
  }

  submitnewPassword() {


    if (!this.submitNewPasswordForm.valid) {

      Object.keys(this.submitNewPasswordForm.controls).forEach(field => {
        const control = this.submitNewPasswordForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onNewPasswordBlur = true;
      return;
    }


    let pwd = this.submitNewPasswordForm.get('newPassword').value;
    let mask = this.authService.showLoadingMask('Creating new password...');

    setTimeout(() => {
      const request = {
        useridin: this.userid,
        passwordin: pwd
      };
      let newPwdUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("resetpassword");
      console.log('send access code url:' + newPwdUrl);

      const isKey2Req = false;

      this.authService.makeHTTPRequest("post", newPwdUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), 'Creating new password...')

        .map(res1 => {
          let resobj = res1;//.json();
          if (resobj.result === "0") {
            // delete current user's touch data as user has changed
            scxmlHandler.touchId.deleteTouchBiodataKey();

            this.showLoginPage();
            return resobj;
          } else {
            console.log('sendaccesscode :: error =' + resobj.errormessage);
            let emsg = resobj.displaymessage;
            this.alerts = [this.prepareAlertModal("", emsg, "info")];
            this.authService.addAnalyticsAPIEvent(emsg, newPwdUrl, resobj.result);

          }
        })
        .subscribe(res => {
          if (res.result === "0") {
            // delete current user's touch data as user has changed
            scxmlHandler.touchId.deleteTouchBiodataKey();

            this.showLoginPage();
            return res;
          } else {
            console.log('sendaccesscode :: error =' + res.errormessage);
            let emsg = res.displaymessage;
            this.alerts = [this.prepareAlertModal("", emsg, "info")];
            this.authService.addAnalyticsAPIEvent(emsg, newPwdUrl, res.result);

          }
        }, err => {
          console.log('Error updating new password ' + err);
          if (err.displaymessage) {
            this.alerts = [this.prepareAlertModal("", err.displaymessage, "error")];
            this.authService.addAnalyticsAPIEvent(err.displaymessage, newPwdUrl, err.result ? err.result : '');
          }
        }
        );
    }, 100);
  }

  isformDisabled(fromOBJ): boolean {
    this.disableSubmitButton = (fromOBJ.valid && !this.isRequestingServer);
    return this.disableSubmitButton;
  }

  resendaccesscode() {

    let mask = this.authService.showLoadingMask('Sending access code...');

    setTimeout(() => {
      const fp_request = {
        useridin: this.userid,
        commType: this.commType,
        commValue: this.commValue,
        userIdRequired: "false",
        webNonMigratedUser:this.forgotPasswordService.webNonMigratedUser
      };
      let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + '/member/app/v1/access/resendaccesscode';
      console.log('send access code url:' + sendAccessCodeUrl);

      this.forgotPasswordService.forgotPasswordRequest(sendAccessCodeUrl, mask, fp_request, this.authService.getHttpOptions(), 'Sending access code...')

        .subscribe(response => {
          let res = new ForgotPasswordResponseModel();
          res = response;
          if (res.result === "0") {
            //this.showVerificationForm();
            return res;
          } else {
            console.log('sendaccesscode :: error =' + res.errormessage);
            if (res.errormessage) {
              this.alerts = [this.prepareAlertModal("Verification", res.displaymessage, "error")];
              this.authService.addAnalyticsAPIEvent(res.displaymessage, sendAccessCodeUrl, res.result ? res.result : '');
            }

          }
          this.alerts = [this.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICATION_RESENT, "info")];
          this.clearForm();
        }, err => {
          console.log(err);
          this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result ? err.result : '');
        });
    }, 100);
  } 

  
}