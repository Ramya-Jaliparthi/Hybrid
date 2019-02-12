import { Component} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AlertModel } from '../../models/alert/alert.model';
import { LoginComponent } from '../../pages/login/login.component';
import { RegistrationComponent } from '../../pages/login/registration.component';
import { ForgotUserNameService } from './forgot-username.service';
import {VerifyPasscodePage} from '../../pages/verify-passcode/verify-passcode';
import { PasscodeVerificationRequest } from '../../models/login/passcodeVerificationRequest.model';
import { ForgotUsernameResponseModel } from '../../models/forgot-username/forgot-username.model';
declare var scxmlHandler: any;
@Component({
  selector: 'forgot-username',
  templateUrl: 'forgot-username.html',
  host: { 'class': 'forgot-page-css' }
})
export class ForgotUsername {
  isMobileBlur: boolean = false;
  isEmailBlur: boolean = false;
  mobileError: boolean = false;
  emailError: boolean = false;
  mobileNumberValue :any;
  emailValue :any;

  isRequestingServer: boolean = false;

  showForgotUserform: boolean = true;
  isAuthUser: boolean = false;
  showDOBform: boolean = false;
  dateOfBirthBlur: boolean = false;
  mobileMask: Array<any>;
  dobMask: Array<any>;
  email: string = null;
  mobileid: string = null;
  regType: string = null;
  alerts: Array<AlertModel> = null;
  showErrorMsgSection: boolean = false;
  infoNotMatchRecords: string = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"]["-90378"];
  verifyUnuserErrorPart: string = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"]["verifyUnuserErrorPart"];
  errorBannerTitle: string = ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER;
  needInfoFirst: string = ConstantsService.FORGOTUSERNAME_NEEDINFOFIRST;
  weHaveFoundMatch: string = ConstantsService.FORGOTUSERNAME_WEHAVEFOUNDMATCH;
  errorAlerts: Array<any>;
  accessCodeUpdateAttemptCount: number = 0;
  accessCodeMaxAttemptCount: number = 2;
  commType : string = "";
  disableAccessBtn: boolean = false;
  showVerificationform : boolean = false;
  maskingEmail : string = "";
  mask: any = null;
  dob: string;
  userId: string;
  commValue: any;
  //isEmailDisabled: boolean = false;
  //isMobileDisabled: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, private authService: AuthenticationService,
    public alertCtrl: AlertController, private userContext: UserContextProvider, private forgotUserNameService: ForgotUserNameService,
    public platform: Platform) {
    
    window['ForgotUserNameComponentRef'] = {
      component: this
    };
    this.mobileMask = ValidationProvider.mobileMask;
    this.dobMask = ValidationProvider.dobMask;
    this.userId = navParams.get("userNameParameter");
  }

  public forgotUserForm = this.fb.group({
  mobileNumber: ["", Validators.compose([ValidationProvider.mobileNumberValidator])],
  emailAddress: ["", Validators.compose([ValidationProvider.emailValidator])]
  });

  public verityAuthForm = this.fb.group({
    dateOfBirth: ["", Validators.compose([ValidationProvider.requiredDOB, ValidationProvider.dobValidator])]
  });

  ionViewDidLoad() {
  }

  // setEmailBlur() {
  //   setTimeout(() => { this.onEmailBlur = true }, 500);
  // }

  ionViewDidEnter() {
    let etarget = 'ForgotUsername';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.showErrorMsgSection = false;
    this.alerts = null;
    if (this.forgotUserForm.controls) {
      this.forgotUserForm.controls['mobileNumber'].setValue("");
      this.forgotUserForm.controls['emailAddress'].setValue("");
    }
  }

  // deprecated
  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  /*gotoLoginPage() {
    this.navCtrl.push(LoginComponent);
  }*/

  isformDisabled(fromOBJ): boolean {
    return (fromOBJ.dirty && fromOBJ.valid && (fromOBJ.value.mobileNumber != '' || fromOBJ.value.emailAddress != '') && !this.isRequestingServer) 
  }
  /*isformDisabled1(fromOBJ): boolean {
    return !(fromOBJ.controls.emailAddress.invalid && fromOBJ.controls.mobileNumber.invalid)
  }*/

  isDOBformDisabled(fromOBJ): boolean {
    return (fromOBJ.dirty && fromOBJ.valid && (fromOBJ.value.dateOfBirth != ''))
  }

  getUserDetails(event, formData) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.errorAlerts=null;
    
    this.isRequestingServer = true;

    if (!formData.valid) {
      Object.keys(this.forgotUserForm.controls).forEach(field => {
        const control = this.forgotUserForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.isEmailBlur = true;
      this.isMobileBlur = true;

    }

    let mobile_split = this.forgotUserForm.value.mobileNumber.split("-");
    if (mobile_split != "") {
      this.mobileid = mobile_split[0] + mobile_split[1] + mobile_split[2];
    } else {
      this.mobileid = null;
    }
    this.email = this.forgotUserForm.value.emailAddress;
    if (this.email === "") {
      this.email = null
    }
    this.makeVerifyUserNameRequest(this.email, this.mobileid, false,"Verifying...");

  }

  submitAuthFormDetails(event, formData) {
    scxmlHandler.playSoundWithHapticFeedback();

    if (!formData.valid) {
      Object.keys(this.verityAuthForm.controls).forEach(field => {
        const control = this.verityAuthForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.dateOfBirthBlur = true;

      if (this.verityAuthForm.value.dateOfBirth == "" || this.verityAuthForm.value.dateOfBirth == undefined) {
        //this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL,false)];
      }
      return;
    }
    let userAuthVal = "";
    if (this.regType == "MOBILE") {
      userAuthVal = this.mobileid;
    } else {
      userAuthVal = this.email;
    }
    let dobString = this.verityAuthForm.value.dateOfBirth;
    let splitString = dobString.split("/");
    this.dob = splitString[2]+"-"+splitString[0]+"-"+splitString[1];
    this.makeVerifyUserNameRequest(userAuthVal, this.dob, false,"Verifying...");

  }

  makeVerifyUserNameRequest(userAuthVal1: string, userAuthVal2: string, isResendSendAccCode: boolean, maskText: string) {

    this.alerts = null;
    if (!this.authService.token) {
      this.authService.makeTokenRequest(false).subscribe(token => {
        this.authService.token = token;
        this.makeVerifyUserNameHttpRequest(userAuthVal1, userAuthVal2, isResendSendAccCode, maskText);
      },
        err => {
          this.isRequestingServer = false;
          //this.showAlert('ERROR', ConstantsService.ERROR_MESSAGES.FORGOTUNAME_INVALID_SEC_TOKEN);
          this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.ERROR_MESSAGES.FORGOTUNAME_INVALID_SEC_TOKEN, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL,false)];
          return;
        }
      );
    } else {
      this.makeVerifyUserNameHttpRequest(userAuthVal1, userAuthVal2, isResendSendAccCode, maskText);
    }
  }

  makeVerifyUserNameHttpRequest(userAuthVal1: string, userAuthVal2: string, isResendSendAccCode: boolean, maskText: string) {
    setTimeout(() => {
      let request = {};
      let verifyUserNameUrl = "";
      if (!this.isAuthUser) {

        request = {
          "mesg": {
            "email": userAuthVal1,
            "mobilenum": userAuthVal2
          }
        };
        verifyUserNameUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunuser");

      } else {

        request = {
          "mesg": {
            "useridin": this.userId,
            "dob": userAuthVal2
          }
        };
        verifyUserNameUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunauthuser");

      }
      this.isRequestingServer = false;
      console.log('verify user name url :: ' + verifyUserNameUrl);
      this.forgotUserNameService.forgotUserNameRequest(request, verifyUserNameUrl, maskText)
        .subscribe(response => {
          console.log("verifyfunuser/auth request", request);
          //console.log(this.authService.handleDecryptedResponse(response));
          let res = new ForgotUsernameResponseModel();
          res = this.authService.handleDecryptedResponse(response);
          //console.log("verifyfunuser/auth response",JSON.stringify(res));
          this.showErrorMsgSection = false;
          if (response.result == 0) { /** API is not returning 0 value here */
            if(res.commType != undefined){
              this.regType = res.commType;
              this.commValue  = res.commValue;
              this.userId   = res.userId;
              this.maskingEmail = this.phoneNumberEmailMask(this.regType,this.commValue);            
            }

            if(isResendSendAccCode == true){
              this.errorAlerts = [this.prepareAlertModal("Verification Resent", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_RESEND_VERIFICATION_SUCCESS,"info",false)];              
            }

            if(this.regType){
              console.log(this.regType);
               this.commType =  this.regType; 
            }else{

              this.commType = "EMAIL"; 
            }
           
            if(!(this.commValue)){
              this.commValue = this.email;
            }
            //this.commValue  = (res.commType === "MOBILE") ?  res.commValue : this.email;
            //this.email = res.userId;   // it is only needed when we needuserid from response , need tochgnae it .
            if (res.isAuthenticated != undefined && res.isAuthenticated == "TRUE") {
                //if(userAuthVal1 && userAuthVal2){
                 
                  // this.navCtrl.push(VerifyPasscodePage); 
                  //this.gotoVerifyPasscodePage();                 
                  //this.showDOBform = false;
                 // this.showVerificationform = true;
                //}else{     
                  this.showForgotUserform = false;
                  this.isAuthUser = true;
                  this.showDOBform = true;
                //}
              let etarget = 'ForgotUsername.ConfirmIdentity';
              let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            } else {
              // let params: any = {};
              // params.getUserDetails = true;
              // this.navCtrl.push(LoginComponent, params);
              // this.navCtrl.push(VerifyPasscodePage, params);
              this.errorAlerts = null;
              this.showForgotUserform = false;
             // this.showVerificationform = true;
             this.gotoVerifyPasscodePage(); 
              this.showDOBform = false;
              //this.regType = res.commType;
              //this.maskingEmail = this.maskEmail(this.forgotUserForm.value.emailAddress);
              this.setFocusOnFirstBox(); 
            }
          }
          /*
           else if (response.result === "-1") {
            let errMsg = ConstantsService.ERROR_MESSAGES.FORGOTUNAME_INVALID_DOB + "\nIf you don't have an account,�Register Now.";
            this.showErrorMsgSection = true;
            let etarget = 'ForgotUsername.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": errMsg } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          } else if (response.result === "-2") {
            let errMsg = ConstantsService.ERROR_MESSAGES.FORGOTUNAME_INVALID_DOB;
            this.errorBanner(errMsg);
            let etarget = 'ForgotUsername.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": errMsg } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          } else if (response.result === "-3") {
            let errMsg = ConstantsService.ERROR_MESSAGES.FORGOTUNAME_MAX_ATTEMPTS;
            this.errorBanner(errMsg);
            let etarget = 'ForgotUsername.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": errMsg } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

          } else if (response.displaymessage) {
            this.errorBanner(response.displaymessage);
            let etarget = 'ForgotUsername.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": response.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }else if (response.result == -90378){
            let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"][response.result];
            this.errorAlerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(errorMessage, verifyUserNameUrl, response.result);
            
            let etarget = 'ForgotUsername.Error';
            let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": response.displaymessage } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }else if (response.result == -90392){
            let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNAUTHUSER"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNAUTHUSER"][response.result];
            this.errorAlerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(errorMessage, verifyUserNameUrl, response.result);
          }
          */
          else if (response.displaymessage){
            this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL,false)];
          }

        }, err => {
          console.log('Error response from verify user request ' + err);
          this.showErrorMsgSection = false;          
          // if (err.result === "-3") {
          //   let errMsg = ConstantsService.ERROR_MESSAGES.FORGOTUNAME_MAX_ATTEMPTS;
          //   this.errorBanner(errMsg);
          //   let etarget = 'ForgotUsername.Error';
          //   let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": errMsg } };
          //   scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          // } 
          // else if (err.displaymessage) {
          //   this.showErrorMsgSection = true;
          // }
          //else if (err.result == -90378){
            // let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"][err.result];
            // this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            // this.authService.addAnalyticsAPIEvent(errorMessage, verifyUserNameUrl, err.result);
            // this.showErrorMsgSection = true;
            //this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL,false)];
          //}else if (err.result == -90392){
            // let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNAUTHUSER"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNAUTHUSER"][err.result];
           // this.errorAlerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            // this.authService.addAnalyticsAPIEvent(errorMessage, verifyUserNameUrl, err.result);
           // this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyUserNameUrl, err.result);
         // } else if (err){
            // let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNUSER"][err.result];
            // this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            // this.authService.addAnalyticsAPIEvent(errorMessage, verifyUserNameUrl, err.result);
            // this.showErrorMsgSection = true;
          //}
          this.errorAlerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL,false)];
          let etarget = 'ForgotUsername.Error';
          let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.errorMessage": err.displaymessage } };
          scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
        }
        );
    }, 50);
  }

 gotoVerifyPasscodePage(){
  let generatedRequest = {
    // ...request,
    commType:this.commType,
    userIdRequired: "true",
    useridin: this.userId,
    commValue:this.commValue
  };
  this.navCtrl.setRoot(VerifyPasscodePage, { fromPage: 'forgotUsernameFlow', requestData: generatedRequest});
 }

  gotoRegistration() {
    this.navCtrl.push(RegistrationComponent);
  }
  errorBanner(message) {
    let alertObj = {
      messageID: "",
      AlertLongTxt: message,
      AlertShortTxt: "",
      RowNum: ""
    }
    let a: AlertModel = this.prepareAlertModal("Error",alertObj,"error",false);
    if (a != null) {
      this.userContext.setAlerts([a]);
    }
    this.errorAlerts = this.userContext.getAlerts();
  }

  isAlertShowing() {
    let alts: Array<any> = this.userContext.getAlerts();
    return alts.length == 0;
  }

  prepareAlertModal(title: string, msg: any, type: string,hideCloseBtn: boolean ) {
    if (msg) {
      let a: AlertModel = new AlertModel();
      a.id = "1";
      a.message = msg;
      a.alertFromServer = false;
      a.showAlert = true;
      a.title = title;
      a.type = type ? type : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL;
      a.hideCloseButton = hideCloseBtn;
      return a;
    }
    return null;
  }

  closeErrorMsgSection(){
    this.showErrorMsgSection=false;   
  }

  private verificationCodeForm = this.fb.group({
    accesscode1: ["", Validators.required],
    accesscode2: ["", Validators.required],
    accesscode3: ["", Validators.required],
    accesscode4: ["", Validators.required],
    accesscode5: ["", Validators.required],
    accesscode6: ["", Validators.required]

  });

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

  verifyAccessCode(request: PasscodeVerificationRequest) {

     this.mask = this.authService.showLoadingMask('Verifying access code...');
    console.log(this.commType);
    setTimeout(() => {
      const generatedRequest = {
        // ...request,
        accessCode: request.accesscode,
        commType:this.commType,
        userIdRequired: "true",
        useridin: this.email
      };
      // const isKey2Req =false;
      let verifyAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunaccesscode");
      console.log('verifyAccessCodeUrl:' + verifyAccessCodeUrl);

      this.forgotUserNameService.forgotUserNameRequest(generatedRequest, verifyAccessCodeUrl, 'Verifying access code...')
        .subscribe(response => {
          this.authService.hideLoadingMask(this.mask);
          if (response.result === 0) {
            //show change password screen.           
            let params: any = {};
            params.getUserDetails = true;
            this.navCtrl.push(LoginComponent, params);
            this.alerts = null;
          } else {
            this.clearForm();
            if (this.accessCodeUpdateAttemptCount >= this.accessCodeMaxAttemptCount) {
              this.disableAccessButton();
            }
            if (response.displaymessage) {
              this.alerts = [this.prepareAlertModal("Error",response.displaymessage,"error",false)]
              this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUrl, response.result);
            }
          }

        },
        err => {
          var errmsg = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_SERVERERR_ACCESSCODEVERIFI;
          console.log(errmsg);
          console.log("Error:::::" + err);
          this.authService.hideLoadingMask(this.mask);
          this.clearForm();
          if (err.displaymessage)
          {
            errmsg = err.displaymessage;
            console.log("ERROR :: Default error index = " + String(err.errormessage).indexOf("ACCESS CODE MISMATCH"));
            this.alerts = [this.prepareAlertModal("Error", errmsg,"error",false)];
            this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrl, err.result);
          }
          if (this.accessCodeUpdateAttemptCount >= this.accessCodeMaxAttemptCount) {
            this.disableAccessButton();
          } 
          /*
          else {
            if (err.result === "-2" && String(err.errormessage).indexOf("ACCESS CODE EXPIRED") != -1) {
              let msg: string = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED;
              console.log(msg);
              console.log("ERROR :: ACCESS CODE EXPIRED");
              this.alerts = [this.prepareAlertModal("Error",msg,"error",false)];
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
              let errorMessage = ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNACCESSCODE"] && ConstantsService.ERROR_MESSAGES["FORGOTUSERNAME_VERIFYFUNACCESSCODE"][err.result];
              this.errorAlerts = [this.prepareAlertModal("Error", errorMessage,"error",false)];
              this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrl, err.result);
              this.accessCodeUpdateAttemptCount++;
            } else {
              console.log("ERROR :: Default error index = " + String(err.errormessage).indexOf("ACCESS CODE MISMATCH"));
              this.alerts = [this.prepareAlertModal("Error", errmsg,"error",false)];
              this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrl, err.result);
            }
          }
         */
        });
    }, 100);
  }

  disableAccessButton() {
    if (this.platform.is("ios") && this.platform.is("ipad")) {
      this.alerts = [this.prepareAlertModal("Error",ConstantsService.ERROR_MESSAGES.FORGOTPSWD_INCORRECTLOGIN,"error",false)];
    } else {
      this.alerts = [this.prepareAlertModal("Error", ConstantsService.ERROR_MESSAGES.FORGOTPSWD_INCORRECTLOGIN_ANCHOR,"error",false)];
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

  resendVerificationCode() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.disableAccessBtn) {
      this.disableAccessButton();
      return;
    }
    this.isAuthUser = true;
    this.makeVerifyUserNameRequest(this.email, this.dob, true, "Sending...");
    let etarget = 'ForgotPassword.VerificationCodeResent';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous", "RegMethod": this.commType } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

  }

  maskEmail(email: string) {
    let maskedid: string = "";
    let myemailId: string = String(email);  //"mynewemail@gmail.com";
    let index: number = myemailId.lastIndexOf("@");
    let prefix: string = myemailId.substring(0, index);
    let postfix: string = myemailId.substring(index);

    var mask = prefix.split('').map(function (o, i) {
      if (i == 0 || i == 1) {
        return o;
      } else {
        return '*';
      }
    }).join('');

    maskedid = mask + postfix;

    if (index == -1) {
      this.regType = "MOBILE";
    }

    return maskedid;

  }

  phoneNumberEmailMask(regType: string, commVal: string) {
    var phone_email = "";
    var number;
    if(regType == "EMAIL"){
      number=commVal;
      var parts = number.split("@");
      var part1 = parts[0];

      var spliteno = part1.length;
      phone_email = this.replaceBetween(4, spliteno, '*', number);
      return phone_email;
    }
    if(regType == "MOBILE"){
      number=commVal;
      var first = number.slice(0, 3);
      var second = number.slice(3, 6);
      var three = number.slice(6, 10);

      var FirstMask = this.replaceBetween(0, 3, '*', first)
      var SecondMask = this.replaceBetween(0, 3, '*', second)

      phone_email = FirstMask + "-" + SecondMask + "-" + three;
      return phone_email;
    }
    else{
      phone_email = "invalid number US number";
      return phone_email;
    }
  }

  replaceBetween(start, end, what, str) {
    what = what.repeat(end - start);
    return str.substring(0, start) + what + str.substring(end);
  };

  setFocusOnFirstBox() {
    window.setTimeout(() => {
      if (document.getElementById('accesscode1')) {
        document.getElementById('accesscode1').focus();
      }
    }, 300);
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

  //-------Mobile--------

  onMobileFocus() {
    this.isMobileBlur = false;
    //this.isEmailBlur = false;
  }

  onMobileChange(data) {
    if (data.target.value == "") {
      this.isMobileBlur = false;
      this.isEmailBlur = false;
      //this.isEmailDisabled = false;
    }
    else {
      this.isMobileBlur = true;
      this.isEmailBlur = false;
      //this.isEmailDisabled = true;
    }
  }

  onMobileBlur() {
    this.isMobileBlur = true;
  }
  
  onMobileKeyUp() {
    if (this.mobileNumberValue.length == 0) {
      this.mobileError = false;
      this.isMobileBlur = false;
      //this.isMobileDisabled = false;
      //this.enabledOrDisabledMobile(false);
      this.emailError = false;
      this.isEmailBlur = false;
      //this.isEmailDisabled = false;
    }
    else {
      //this.isEmailDisabled = true;
    }
  }

  // deprecated
  enabledOrDisabledMobile(flag){
    var element = <HTMLInputElement> document.getElementById("mobileNumberField");
    element.disabled = flag;
    if(flag == true && this.emailValue != ""){
      element.classList.add("mobileInputPlaceHolder");
    }
    else{
      element.classList.remove("mobileInputPlaceHolder");      
    }
  }
  
  //-------Email--------

  onEmailFocus() {
    //this.isMobileBlur = false;
    this.isEmailBlur = false;
  }

  onEmailBlur() {
    this.isEmailBlur = true;
  }

  onEmailChange(data) {
    if (data.target.value == "") {
      this.isEmailBlur = false;
      this.isMobileBlur = false;
      //this.isMobileDisabled = false;
      //this.enabledOrDisabledMobile(false);
    }
    else {
      this.isEmailBlur = true;
      this.isMobileBlur = false;
      //this.isMobileDisabled = true;
      //this.enabledOrDisabledMobile(true);
    }
  }

  onEmailKeyUp() {
    if (this.emailValue.length == 0) {
      this.emailError = false;
      this.mobileError = false;
      this.isMobileBlur = false;
      //this.isMobileDisabled = false;
      //this.enabledOrDisabledMobile(false);
      this.isEmailBlur = false;
      //this.isEmailDisabled = false;
    }
    else {
      //this.isMobileDisabled = true;
      //this.enabledOrDisabledMobile(true);
    }
  }

  cancelShowForgotUserForm() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(LoginComponent);
  }
  
}
