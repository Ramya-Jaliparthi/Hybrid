import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UpdatessnModel } from '../../models/login/updatessn.model';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { MessageProvider } from '../../providers/message/message';
import { AuthPersonalInfoPage } from '../../pages/authentication/auth-personal-info-page';
import { MemberInformationPage } from '../../pages/member-information/member-information';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { SecurityQuestionsPage } from "./security-questions";
import { VerifySecurityQuestionsPage } from "../../pages/ssn-auth/verify-security-questions";
import { AlertModel } from '../../models/alert/alert.model';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { SsnAuthService } from './ssn-auth.service';
import { SsnAuthResponseModel } from '../../models/ssn-auth/ssn-auth.model';

declare var scxmlHandler: any;
@Component({
  selector: 'page-ssn-auth',
  templateUrl: 'ssn-auth.html',
})
export class SsnAuthPage {
  maxLength = '4';
  authSsnForm: FormGroup;

  isSsnBlur: boolean = false;
  isStudentIdBlur: boolean = false;
  quesError: boolean = false;
  showFailurePage: boolean = false;
  ssnError: boolean = false;
  studentError: boolean = false;
  disableSubmitButton: boolean = false;
  alerts: Array<any>;
  isSsnDisabled = false;
  isStudentIdDisabled = false;
  failureMessage = "";
  ssnValue: string = "";
  studentIdValue: string = "";
  exceedauthLNAttempt: boolean = false;
  memAuthResponse: any;
  appAuthLock: boolean = false;
  ssnAuthLock: boolean = false;
  studentAuthLock: boolean = false;
  isLNError: boolean = false;
  resObj: any;
  ssnNumber: any;
  studentIdNumber: any;
  isMediCareUser: boolean = false;
  msgObj:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    private messageProvider: MessageProvider,
    private userContext: UserContextProvider,
    private authService: AuthenticationService,
    private authenticationStateProvider: AuthenticationStateProvider,
    private ssnAuthService: SsnAuthService) {

    this.userContext.setLoginState(LoginState.Registered);
    let ssnVal = "";
    let studentIdVal = "";
    if (this.authService.memAuthData && this.authService.memAuthData.ssn && this.authService.memAuthData.ssn != null)
      ssnVal = this.authService.memAuthData.ssn;

    this.authSsnForm = this.fb.group({
      ssn: [ssnVal, Validators.compose([ValidationProvider.requiredssnValidator, ValidationProvider.ssnValidator])],
      studentId: [studentIdVal, Validators.compose([ValidationProvider.requiredstudentIdValidator, ValidationProvider.studentIdValidator])]
    });

  }

  ionViewDidEnter() {
    this.userContext.setCustomBackHandler(this);
    this.prepareAlertModal(null);
    if(this.navParams.get('LNError')) {
        //this.getMemberAuthInfo();
     } 
    this.memAuthResponse = this.authService.memAuthData;
    if(this.memAuthResponse['ROWSET'].ROWS.userType === 'MEDICARE'){
      this.ssnAuthService.isMediCareUser = true; 
      this.isMediCareUser = this.ssnAuthService.isMediCareUser;    
    }

    let lnError = this.navParams.get('LNError');
    if (lnError && !this.ssnAuthService.isMediCareUser) {
      this.errorBanner(lnError);
    }

    let etarget = 'Authentication.LexisNexis.Error';
    
    if(this.ssnAuthService.isMediCareUser == true){
      //meicare users
        if (this.authService.authlnattemptcount == 1) {
            this.errorBanner(lnError);
        }
        else if (this.authService.authlnattemptcount == 2) {
            this.showFailurePage = true;
            this.appAuthLock = true;
            this.studentAuthLock = false;
            this.ssnAuthLock = false;
            this.exceedauthLNAttempt = true;
        } 
    }
    else{
      // non medicare user
    if (this.authService.authlnattemptcount >= 3) {
      this.showFailurePage = true;
      this.studentAuthLock = false;
      this.appAuthLock = true;
      this.ssnAuthLock = false;
      let edataobj = { "context": "state", "data": { "App.errorMessage": ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_LN_AUTH_COUNT, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    } else if (this.authService.authlnattemptcount == 2) {
      if (this.authService.authLNQuestionTried) {
        let edataobj = { "context": "state", "data": { "App.errorMessage": ConstantsService.LN_FAILURE_ATTEMPT_SECOND, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
        if(this.navParams.get('LNError') != ""){
          this.errorBanner(ConstantsService.LN_FAILURE_ATTEMPT_SECOND);        
        }
        this.authService.authLNQuestionTried = false;
      }
      this.exceedauthLNAttempt = true;
    } else if (this.authService.authlnattemptcount == 1) {
      if (this.authService.authLNQuestionTried) {
        let edataobj = { "context": "state", "data": { "App.errorMessage": ConstantsService.LN_FAILURE_ATTEMPT_FIRST, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
        if(this.navParams.get('LNError') != ""){
          this.errorBanner(ConstantsService.LN_FAILURE_ATTEMPT_FIRST);
        }
        this.authService.authLNQuestionTried = false;
      }
    }

    

    this.authService.authLNAllowed = this.memAuthResponse['ROWSET'].ROWS.lnallowedflag;

    if (this.authService.authLNAllowed == "FALSE") {
      this.exceedauthLNAttempt = true;
      if (this.authService.authlnattemptcount <= 0) {//IF LN server throws error on submitting answers
        //this.errorBanner(ConstantsService.LN_SERVER_ERROR);
      }
    }

    if (this.memAuthResponse['ROWSET'].ROWS.authAllowed == "FALSE") {
      this.showFailurePage = true;
      this.appAuthLock = true;
      this.ssnAuthLock = false;
      this.studentAuthLock = false;
      }
    }

  }

  setMaxLength(input, length) {
    if (input.value && input.value.length > length) {
      input.value = input.value.substring(0, length);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsnAuthPage');
    let etarget = 'Authentication.SSNorLexisNexis';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  authenticateUser(event, formData) {

    if (!formData.valid) {
      let isAnyOneFieldValid: boolean = false;
      Object.keys(this.authSsnForm.controls).forEach(field => {
        const control = this.authSsnForm.get(field);
        if (control.status == "VALID") {
          isAnyOneFieldValid = true;
        }
        else if (control.status == "INVALID") {
          control.markAsTouched({ onlySelf: true });
          if (field == "ssn" && this.isSsnDisabled == false) {
            this.isSsnBlur = true;
          }
          else if (field == "studentId" && this.isStudentIdDisabled == false) {
            this.isStudentIdBlur = true;
          }
        }
      });

      if (isAnyOneFieldValid == false) {
        if ((this.authSsnForm.value.ssn == "" || this.authSsnForm.value.ssn == undefined) && (this.authSsnForm.value.studentId == "" || this.authSsnForm.value.studentId == undefined)) {
          this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
          this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        }
      }
      else {
        this.isStudentIdBlur = false;
        this.isSsnBlur = false;

        if (this.isStudentIdDisabled) {
          let updatessn = new UpdatessnModel();
          updatessn.ssn = 'XXXXX' + this.authSsnForm.value.ssn.trim();
          this.authWithSSN(updatessn);
        }
        else if (this.isSsnDisabled) {
          this.authWithStudentID();
        }

      }
      return;
    }

    if (this.isStudentIdDisabled) {
      let updatessn = new UpdatessnModel();
      updatessn.ssn = 'XXXXX' + this.authSsnForm.value.ssn.trim();
      this.authWithSSN(updatessn);
    }
    else if (this.isSsnDisabled) {
      this.authWithStudentID();
    }
  }

  authWithSSN(request: UpdatessnModel) {
    let etarget = 'Authentication.SSN';
    let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.alerts = null;
    let mask = this.authService.showLoadingMask('Updating Member Information...');
    setTimeout(() => {
      const generatedRequest = {
        ...request,
        useridin: this.authService.useridin
      };

      let authWithSSNURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'authwithssn';

      this.ssnAuthService.ssnAuthRequest(authWithSSNURL, mask, generatedRequest, this.authService.getHttpOptions(), 'Updating Member Information...')

        .subscribe(res => {
          let response = new SsnAuthResponseModel();
          response = res;
          console.log('Response for SSN auth info 1 ', response);
          if (response && response.result == 0) {

            let etarget = 'Authentication.SubmittedSSN';
            let edataobj = { "context": "action", "data": { "App.authMethod": "Submitted SSN" } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_SSN_UPDATED, response);

          } else if (response && (response.result === "-90605" || response.result === "-50")) {
            let emessage = ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_SSN_AUTH_COUNT;
            this.showFailurePage = true;
            this.appAuthLock = false;
            this.studentAuthLock = false;
            this.ssnAuthLock = true;
            let etarget = 'Authentication.SSN.Error';
            let edataobj = { "context": "state", "data": { "App.errorMessage": emessage, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
          }
          else {
            console.log('authWithSSN :: error =' + response.errormessage);
            let emsg = response.displaymessage;
            this.authService.addAnalyticsAPIEvent(emsg, authWithSSNURL, response.result);
            //if (response.result === "-90604" || response.result == "-90605") {
            if (response.result === "-1") { 
              this.gotoMemberInfoPageWithCode(response.result, emsg);
            //} else if (response.result === "-90607" || response.result === "-90608") {
            } else if (response.result === "-2") {
              this.gotoAuthPersonalInfoPageWithCode(response.result, emsg);
            } else if (response.result === "-5") {
              emsg = ConstantsService.SSN_RES_5;
              this.errorBanner(emsg);
              this.isSsnBlur = true;
              this.ssnError = true;
              this.isStudentIdBlur = false;
              this.studentError = false;
              let etarget = 'Authentication.SSN.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            } else if (response.result === "-9") {
              emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_UNABLETOREGISTER;
              this.errorBanner(emsg);
              this.isSsnBlur = true;
              this.ssnError = true;
              this.isStudentIdBlur = false;
              this.studentError = false;
              let etarget = 'Authentication.SSN.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            }
            else if (response.result === "-52") {
              // both dob and ssn are incorrect
              this.gotoAuthPersonalInfoPageWithCode(response.result, emsg);
            }
            else if (response.result === "-90610" || response.result === "-90604" || response.result == "-90605" || response.result == "-90609" ) {
              emsg = ConstantsService.SSN_INVALID_RECORD;
              this.ssnError = true;
              this.studentError = false;
              this.errorBanner(emsg);
            }
            else if(response.result === "-90602"){
              emsg = ConstantsService.LN_SERVER_ERROR;
              this.ssnError = true;
              this.studentError = false;
              this.errorBanner(emsg);
            }
          }

        },
        err => {
          console.log("Error during Member SSN Update -" + err);
          if(err.displaymessage){
            this.errorBanner(err.displaymessage);
          }
          this.authService.addAnalyticsAPIEvent(err.displaymessage, authWithSSNURL, err.result);
        }
        );
    }, 100);

  }

  accesscodeCheck() {
    if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED || this.authService.currentUserScopename == ConstantsService.AUTHENTICATED_NOT_VERIFIED) {

      // if (this.userContext.getIsVerifycodeRequested(this.authService.useridin) == "false") {
        this.authService.sendAccessCode().then((result) => {
          this.resObj = result;
          if (this.resObj.result == 0) {
            
            this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");
            this.msgObj = this.authService.handleDecryptedResponse(this.resObj);
            let codeTypeData;
            if(this.msgObj.commChannelType == "EMAIL"){
              codeTypeData = {emailAddress:this.msgObj.commChannel};
            }else{
              codeTypeData = {phoneNumber:this.msgObj.commChannel};
            }
            this.gotoAccessCodeVerificationPage(codeTypeData);
            return this.resObj;
          } else {
            console.log('sendaccesscode :: error =' + this.resObj.displaymessage);
            let emsg = this.resObj.displaymessage;
            this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);

          }

        }, (err) => {
          console.log(err);

        });
      // } else {
      //   console.log('verify access code already requested. Going to veify code entry page');
      //   this.gotoAccessCodeVerificationPage();
      // }

    } else {
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  cancel() {
    scxmlHandler.playSoundWithHapticFeedback();
    console.log('cancel ssn auth flow');

    this.userContext.setLoginState(LoginState.Registered);
    // handle cancel request from any of the auth screens based on user scopename
    // if scopename is 'REGISTERED_NOT_VERIFIED', force user to Verify Account. 
    // Else, close the auth screen modal to show Registered Home page
    if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED) {
     // if (this.userContext.getIsVerifycodeRequested(this.authService.useridin) == "false") {
        this.authService.sendAccessCode().then((result) => {
          this.resObj = result;
          if (this.resObj.result == 0) {
            this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");            
            this.msgObj = this.authService.handleDecryptedResponse(this.resObj);
            let codeTypeData;
            if(this.msgObj.commChannelType == "EMAIL"){
              codeTypeData = {emailAddress:this.msgObj.commChannel};
            }else{
              codeTypeData = {phoneNumber:this.msgObj.commChannel};
            }
            this.gotoAccessCodeVerificationPage(codeTypeData);
            return this.resObj;
          } else {
            console.log('sendaccesscode :: error =' + this.resObj.displaymessage);
            let emsg = this.resObj.displaymessage;
            this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);

          }

        }, (err) => {
          console.log(err);

        });
      //} 
      //else {
        //console.log('verify access code already requested. Going to veify code entry page');
        //this.gotoAccessCodeVerificationPage();
      //}

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

  handleError(rspmsg) {
    //handle error
    console.log('handleError::' + rspmsg);
    var errmsg = 'Server encountered error in updating Member information with SSN';
    if (rspmsg.errormessage)
      errmsg = rspmsg.displaymessage;
    this.showAlert('ERROR', errmsg);

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

  handleProgressIconTap(index) {

    if (this.authService.memAuthData)
      this.authService.memAuthData.ssn = this.authSsnForm.value.ssn;

    if (index == 1)
      this.gotoAuthPersonalInfoPage();
    else if (index == 2)
      this.gotoMemberInfoPage();
  }

  gotoAuthPersonalInfoPage() {
    this.navCtrl.push(AuthPersonalInfoPage, { "quesError": true });
  }

  gotoMemberInfoPage() {
    this.navCtrl.push(MemberInformationPage, { "quesError": true });
  }
  gotoMemberInfoPageWithCode(error_code, errmsg) {
    this.authService.addAnalyticsClientEvent(ConstantsService.LN_INFORMATION_DOESNOT_MATCH);
    this.navCtrl.push(MemberInformationPage, { "quesError": error_code, "errmsg": ConstantsService.LN_INFORMATION_DOESNOT_MATCH });
  }

  gotoAuthPersonalInfoPageWithCode(error_code, errmsg) {
    this.authService.addAnalyticsClientEvent(ConstantsService.LN_INFORMATION_DOESNOT_MATCH);
    this.navCtrl.push(AuthPersonalInfoPage, { "quesError": error_code, "errmsg": ConstantsService.LN_INFORMATION_DOESNOT_MATCH });
  }

  goToSecurityQuestionsPage(questions) {
    this.navCtrl.push(SecurityQuestionsPage, { "questions": questions });
  }
  goToVerifyQuestionsPage(errorCode, errorDesc) {
    this.navCtrl.push(VerifySecurityQuestionsPage, { "errorCode": errorCode, "errorDesc": errorDesc ? errorDesc : "Lexis Nexis Failure" });
  }

  // get questions api
  getAuthLexisNexis() {
    let etarget = 'Authentication.LexisNexis';
    let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.alerts = null;
    let mask = this.authService.showLoadingMask('Validating Member Information...');
    setTimeout(() => {
      const generatedRequest = {
        useridin: this.authService.useridin
      };
      let authwithLNUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'authwithln';;

      this.ssnAuthService.ssnAuthRequest(authwithLNUrl, mask, generatedRequest, this.authService.getHttpOptions(), 'Validating Member Information...')
        .subscribe(res => {
          let response = new SsnAuthResponseModel();
          response = res;
          if (response) {
            // If its success, result is not available in encrypted message
            if (!response.result || (response.result && response.result == 0)) {
              //this.authService.updateLNAttempt(response, true);
              this.goToSecurityQuestionsPage(response);
            } else {
              let emsg = response.displaymessage;
              this.authService.addAnalyticsAPIEvent(emsg, authwithLNUrl, response.result);
              if (response.result === "-1") {
                this.gotoMemberInfoPageWithCode(response.result, emsg);
              } else if (response.result === "-2") {
                this.gotoAuthPersonalInfoPageWithCode(response.result, emsg);
              } else if (response.result === "-3") {
                this.exceedauthLNAttempt = true;
                emsg = ConstantsService.LN_SERVER_ERROR;
                this.errorBanner(emsg);
                let etarget = 'Authentication.LexisNexis.Error';
                let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
              } else if (response.result === "-9") {
                emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_UNABLETOREGISTER;
                this.errorBanner(emsg);
                let etarget = 'Authentication.LexisNexis.Error';
                let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
              } else if (response.result === "-50" || response.result === "-90650" ) {
                emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_LN_AUTH_COUNT;
                this.showFailurePage = true;
                this.studentAuthLock = false;
                this.appAuthLock = true;
                this.ssnAuthLock = false;
                let etarget = 'Authentication.LexisNexis.Error';
                let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
              } else if (response.result === "-150") {
                this.exceedauthLNAttempt = response.authlnallowed && response.authlnallowed.toUpperCase() === "TRUE" ? false : true;
                emsg = ConstantsService.LN_UNABLE_TO_ACCESS_SECURITY_QUESTIONS;
                this.errorBanner(emsg);
                let etarget = 'Authentication.LexisNexis.Error';
                let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

              } else if (response.result === "-250" || response.result === "-90641") {
                //this.exceedauthLNAttempt = response.authlnallowed && response.authlnallowed.toUpperCase() === "TRUE" ? false : true;
                emsg = ConstantsService.LN_SERVER_UNAVAILABLE;
                this.errorBanner(emsg);
                let etarget = 'Authentication.LexisNexis.Error';
                let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
              }else if (response.result === "-90649" || response.result === "-90651") {
                emsg = ConstantsService.LN_MEMBER_NOT_FOUND;
                this.errorBanner(emsg);
              }else if (response.result === "-90652") {
                emsg = ConstantsService.MEM_RECORDMSG;
                this.errorBanner(emsg);
              } 
              else
                this.errorBanner(response.displaymessage);
              let etarget = 'Authentication.LexisNexis.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            }
          }

        },
        err => {
          var errmsg = 'Server encountered error in Lexis Nexis authentication';

          if (err.displaymessage)
            errmsg = err.displaymessage;
          this.errorBanner(errmsg);

        });
    }, 100);
  }

  gotoAccessCodeVerificationPage(codeTypeData) {
    this.navCtrl.push(VerifyPasscodePage, { fromPage: 'accountRegistrationFlow', codeType: "codeForUsername",type: null, no_email: null ,commType:this.msgObj.commChannelType, commValue:this.msgObj.commChannel,codeTypeData:codeTypeData});
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

  onSsnFocus() {
    this.isSsnBlur = false;
    this.isStudentIdBlur = false;
  }

  onSsnChange(data) {
    this.ssnError = false;
    this.studentError = false;
    if (data.target.value == "") {
      this.isSsnBlur = false;
      this.isStudentIdBlur = false;
      this.isStudentIdDisabled = false;
    }
    else {
      this.isSsnBlur = true;
      this.isStudentIdBlur = false;
      this.isStudentIdDisabled = true;
    }
  }

  onSsnBlur() {
    this.isSsnBlur = true;
  }

  onSsnKeyUp() {
    if (this.ssnNumber.length == 0) {
      this.ssnError = false;
      this.isSsnBlur = false;
      this.isSsnDisabled = false;
      this.studentError = false;
      this.isStudentIdBlur = false;
      this.isStudentIdDisabled = false;
    }
    else {
      this.isStudentIdDisabled = true;
    }
  }

  onStudentIdFocus() {
    this.isSsnBlur = false;
    this.isStudentIdBlur = false;
  }

  onStudentIdBlur() {
    this.isStudentIdBlur = true;
  }

  onStudentIdChange(data) {
    if (data.target.value == "") {
      this.isStudentIdBlur = false;
      this.isSsnBlur = false;
      this.isSsnDisabled = false;
    }
    else {
      this.isStudentIdBlur = true;
      this.isSsnBlur = false;
      this.isSsnDisabled = true;
    }
  }

  onStudentIdKeyUp() {
    if (this.studentIdNumber.length == 0) {
      this.studentError = false;
      this.ssnError = false;
      this.isSsnBlur = false;
      this.isSsnDisabled = false;
      this.isStudentIdBlur = false;
      this.isStudentIdDisabled = false;
    }
    else {
      this.isSsnDisabled = true;
    }
  }

  // authenticate with Student ID
  authWithStudentID() {
    let etarget = 'Authentication.StudentID';
    let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.alerts = null;
    let mask = this.authService.showLoadingMask('Updating Member Information...');
    setTimeout(() => {
      const generatedRequest = {
        useridin: this.authService.useridin,
        studentid: this.authSsnForm.value.studentId.trim()
      };
      //  const isKey2Req =false;
      let authwithStudentUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") +"authwithstudentid";

      this.ssnAuthService.ssnAuthRequest(authwithStudentUrl, mask, generatedRequest, this.authService.getHttpOptions(), 'Updating Member Information...')
        .subscribe(res => {
          let response = new SsnAuthResponseModel();
          response =res;
          if (response && response.result == 0) {
            let etarget = 'Authentication.SubmittedStudentID';
            let edataobj = { "context": "action", "data": { "App.authMethod": "Submitted StudentID" } };
            scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_SSN_UPDATED, response);
          } else if (response && (response.result === "-50" || response.result === "-90624")) {
            this.showFailurePage = true;
            this.studentAuthLock = true;
            this.appAuthLock = false;
            this.ssnAuthLock = false;
            // probably not used
            this.failureMessage = ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_STUDENTID_AUTH_COUNT;
            this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_STUDENTID_AUTH_COUNT);
          }
          else {
            console.log('authWithStudentID :: error =' + response.errormessage);
            let emsg = response.displaymessage;
            if (response.result == "-1") {
              this.gotoMemberInfoPageWithCode(response.result, emsg);
            } else if (response.result == "-2") {
              this.gotoAuthPersonalInfoPageWithCode(response.result, emsg);
            } else if (response.result == "-5") {
              emsg = ConstantsService.LN_INFORMATION_DOESNOT_MATCH;
              this.errorBanner(emsg);
              this.isStudentIdBlur = true;
              this.studentError = true;
              this.ssnError = false;
              this.isSsnBlur = false;
              let etarget = 'Authentication.StudentID.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            } else if (response.result == "-9") {
              emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_UNABLETOREGISTER;
              this.showFailurePage = true;
              this.appAuthLock = false;
              this.ssnAuthLock = false;
              this.studentAuthLock = true;
              this.errorBanner(emsg);
              let etarget = 'Authentication.StudentID.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            }else if (response.result == "-90632" || response.result == "-90610") {
              emsg = ConstantsService.SSN_INVALID_RECORD;
              this.studentError = true;
              this.ssnError = false;
              this.errorBanner(emsg);
            }else {
              emsg = ConstantsService.ERROR_MESSAGES.SSN_AUTH_EXCEED_STUDENTID_AUTH_COUNT;
              this.showFailurePage = true;
              this.appAuthLock = false;
              this.ssnAuthLock = false;
              this.studentAuthLock = true;
              this.errorBanner(emsg);
              let etarget = 'Authentication.StudentID.Error';
              let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
              scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
            }
          }
        },
        err => {
          console.log("Error during Member Student ID Update -" + err);
          this.authService.addAnalyticsAPIEvent(err.displaymessage, authwithStudentUrl, err.result);
        }
        );
    }, 100);
  }

  isDisableSubmitButton(): boolean {
    if((this.authSsnForm.get('ssn').valid || this.authSsnForm.get('studentId').valid) && (!this.ssnError && !this.studentError)) {
      return false;
    } 
    return true;
  }

}