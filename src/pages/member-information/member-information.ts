import { Component, Renderer, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SsnAuthPage } from '../../pages/ssn-auth/ssn-auth';
import { AuthPersonalInfoPage } from '../../pages/authentication/auth-personal-info-page';
import { MemauthRequest } from '../../models/login/memauthRequest.model';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { MessageProvider } from '../../providers/message/message';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { ConfigProvider } from '../../providers/config/config';
import { AlertService } from '../../providers/utils/alert-service';
import { AlertModel } from '../../models/alert/alert.model';
import { MemberInformationService } from './member-information.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-member-information',
  templateUrl: 'member-information.html',
})
export class MemberInformationPage {

  authMemberCardInfoForm: FormGroup;
  //onSuffixBlur: boolean = false;
  onMemIdBlur: boolean = false;
  memIDError: boolean = false;
  alertMessageTitle: string = "";
  alertMessage: string = "";
  alertMessageType = "";
  showAlertMessage: boolean = false;
  alert: AlertModel = null;
  quesError: boolean = false;
  disableSubmitButton: boolean = false;
  quesErrorCode: string = "";
  alerts: Array<any>;
  resObj: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    private messageProvider: MessageProvider,
    private userContext: UserContextProvider,
    public config: ConfigProvider,
    private authService: AuthenticationService,
    private authenticationStateProvider: AuthenticationStateProvider,
    private renderer: Renderer,
    private elRef: ElementRef,
    private alertService: AlertService,
    private memberInformationService: MemberInformationService) {

    this.userContext.setLoginState(LoginState.Registered);
    //let isvalidMEMID = false;
    let memberAuthData = this.authService.memAuthData;
    let memNumber: string = "";
    if (memberAuthData && memberAuthData['ROWSET'].ROWS.memNum != null && memberAuthData['ROWSET'].ROWS.memNum != 'null') {

      memNumber = memberAuthData['ROWSET'].ROWS.memNum;
      //suffix = this.authService.removeLeadingJunkChar(memberAuthData['ROWSET'].ROWS.memSuffix);
      //suffix = suffix + "";
      //isvalidMEMID = this.isMemberIdInvalidOnLoad(memberAuthData['ROWSET'].ROWS);      
    }
    this.authMemberCardInfoForm = this.fb.group({
      memberid: [memNumber, Validators.compose([ValidationProvider.requiredmemberIdValidator, ValidationProvider.memberIdValidator])]
      //suffix: [suffix, Validators.compose([ValidationProvider.requiredmemberSuffixValidator, ValidationProvider.memberSuffixValidator])],
    });
    /*if(isvalidMEMID){
      const memberIdControl = this.authMemberCardInfoForm.get('memberid');
      ///memberIdControl.setErrors({ incorrectMemberId: { value: true } });

    }*/

  

  }

  isMemberIdInvalidOnLoad(memberDetails) {
    setTimeout(() => {
        const invalidFields = memberDetails['ROWSET'].ROWS.lastMemResult; 
        if(invalidFields && invalidFields.includes(ValidationProvider.AUTH_INVALID_IDENTIFITERS.memberId)){
            const memberIdControl = this.authMemberCardInfoForm.get('memberid');
            memberIdControl.setErrors({ invalidMemberId: true });
            memberIdControl.markAsTouched({ onlySelf: true });
            this.onMemIdBlur = true;
        }
    }, 100);

  }

  ionViewDidEnter() {
    this.userContext.setCustomBackHandler(this);
    let quesError = this.navParams.get('quesError');
    let errmsg = this.navParams.get('errmsg');
    if (quesError != undefined && quesError == "-1") {
      this.errorBanner(errmsg);
      this.quesError = true;
      this.quesErrorCode = quesError;
    } else if (quesError == true) {
      this.quesError = true;
    } else {
      this.quesError = false;
    }
  }

  ngOnInit(){
    this.isMemberIdInvalidOnLoad(this.authService.memAuthData);
  }

  ionViewDidLoad() {
    let etarget = 'Authentication.MemberInfo';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }
  goToSignInPage() {
    scxmlHandler.playSoundWithHapticFeedback();
    //this.navCtrl.push(LoginComponent);
    this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
  }
  
 

  authenticateMemberCardInfo(event, formData) {
    if (!formData.valid) {
      Object.keys(this.authMemberCardInfoForm.controls).forEach(field => {
        console.log('field :: ' + field);
        const control = this.authMemberCardInfoForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onMemIdBlur = true;
      //this.onSuffixBlur = true;
      //if (this.authMemberCardInfoForm.value.memberid == "" || this.authMemberCardInfoForm.value.memberid == undefined || this.authMemberCardInfoForm.value.suffix == "" || this.authMemberCardInfoForm.value.suffix == undefined)
      if (this.authMemberCardInfoForm.value.memberid == "" || this.authMemberCardInfoForm.value.memberid == undefined) {
        //this.showAlertModal('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        this.alerts = [this.alertService.prepareAlertModal(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE, ConstantsService.ALERT_TYPE.ERROR)];
        this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

    let memAuthRequest = new MemauthRequest();

    memAuthRequest.memberid = this.authMemberCardInfoForm.value.memberid.toUpperCase().trim();
    memAuthRequest.useridin = this.authService.useridin;
    //memAuthRequest.suffix = this.authMemberCardInfoForm.value.suffix;

    this.updateMemAuthInfo(memAuthRequest);
  }

  updateMemAuthInfo(request) {
    setTimeout(() => {
      let updateMemAuthUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'updatememauthinfo';
      this.memberInformationService.memberInformationRequest(updateMemAuthUrl, request)
        .subscribe(res => {
          let response = res;
          if (response.displaymessage == "") {
            this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, response);
          } else {
            //this.authService.handleAPIResponseError(response, response.displaymessage, updateMemAuthUrl);
            //this.handleError(response.displaymessage, updateMemAuthUrl, response.result);

            //this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, response);
            
          this.handleUpdateMemberAuthInfoErrorCodes(response);
          }
        },
        err => {
          if (err.fault) {
            let errfault = err.fault;
            if (errfault.faultstring) {
              if (errfault.faultstring === 'Unexpected EOF at target') {
                this.showAlertModal('', 'Please retry');
                this.authService.addAnalyticsAPIEvent('Please retry', updateMemAuthUrl, err.result);
              } else
                //this.showAlertModal('', errfault.faultstring);
                this.handleUpdateMemberAuthInfoErrorCodes(err);
                //this.authService.addAnalyticsAPIEvent(errfault.faultstring, updateMemAuthUrl, err.result);
            }
          } else {
            console.log("Unhandled Error in http request: ", err);//.json());
            //this.authService.handleAPIResponseError(err, err.displaymessage, updateMemAuthUrl);
            this.handleUpdateMemberAuthInfoErrorCodes(err);
          }
        }
        );
    }, 100);
  }

  //keeping it for reference only
  /*
  updateMemAuthInfo_old(request) {

    setTimeout(() => {

      let updateMemAuthUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'updatememauthinfo';

      this.memberInformationService.memberInformationRequest(updateMemAuthUrl, request)
        .subscribe(response => {
          //if (response.result == 0) {
          if (response) {
            // call getmemauthinfo by setting imaginary event REGISTERED_NOT_VERIFIED to trigger getmemauthinfo api
            this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, response);
          } else {
            // show error
            this.authService.handleAPIResponseError(response, response.displaymessage, updateMemAuthUrl);
            this.handleError(response.displaymessage, updateMemAuthUrl, response.result);
          }
        },
        err => {

          if (String(err.errormessage).indexOf("Sorry, that user name cannot be used.  Please try another user name.") != -1) {

            this.alert = this.alertService.prepareAlertModal("",
              ConstantsService.ERROR_MESSAGES.MEMBERINFO_AC_ALREADYEXISTS, "error");

            this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.MEMBERINFO_AC_ALREADYEXISTS_WITHOUTSIGNIN,
              updateMemAuthUrl, err.result ? err.result : '');

            let me = this;

            window.setTimeout(() => {
              let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
              me.renderer.listen(aElement[0], 'click', (event) => {
                me.goToSignInPage();
              });
            }, 10);

          } else if (err.fault) {
            let errfault = err.fault;
            if (errfault.faultstring) {
              if (errfault.faultstring === 'Unexpected EOF at target') {
                this.showAlertModal('', 'Please retry');
                this.authService.addAnalyticsAPIEvent('Please retry', updateMemAuthUrl, err.result);
              } else
                this.showAlertModal('', errfault.faultstring);
              this.authService.addAnalyticsAPIEvent(errfault.faultstring, updateMemAuthUrl, err.result);
            }
          } else {
            console.log("Unhandled Error in http request: ", err);//.json());
            this.authService.handleAPIResponseError(err, err.displaymessage, updateMemAuthUrl);
          }
        }
        );
    }, 100);
  }
  */

  handleUpdateMemberAuthInfoErrorCodes(res){
    if (res) {
      if (res['displaymessage']) {
        const displayMessage = res['displaymessage'];
        let errorHandled = false;
        errorHandled = this.isMemberIdInvalid(displayMessage);
        if (!errorHandled) {
          errorHandled = this.isDuplicateRecord(displayMessage);
        }
        if (!errorHandled) {
          //this.authService.memAuthInfo = null;
          //redirect to Page1 with error banner.
         // this.navCtrl.push(AuthPersonalInfoPage, { "personalInfoError": true });
         this.authService.memberInfoError = true;
         this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, res);
        }
        

      }
   }
  }

  isMemberIdInvalid(response): boolean {
    if (response.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.memberId) > -1) {
      this.showIncorrectMemberIdError();
      return true;
    }
    return false;
  }
  
  isDuplicateRecord(response): boolean {
    if (response === 'Card Number Exisits') {
      const memberIdControl = this.authMemberCardInfoForm.get('memberid');
      memberIdControl.clearValidators();
      memberIdControl.setErrors(null);
      this.authMemberCardInfoForm.disable();
      this.authMemberCardInfoForm.markAsUntouched();
      this.memIDError =true;
      this.isformDisabled(this.authMemberCardInfoForm,"isDuplicate");      
      this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.ERROR_MESSAGES.MEMBERINFO_AC_ALREADYEXISTS, ConstantsService.ALERT_TYPE.ERROR)]; 
      let me = this;
            window.setTimeout(() => {
              let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
              me.renderer.listen(aElement[0], 'click', (event) => {
                me.goToSignInPage();
              });
            }, 10);
      return true;
    }
    if (response === 'REQUEST TIMED OUT') {
      this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response, ConstantsService.ALERT_TYPE.ERROR)]; 
      return true;
    }
    return false;
  }

  showIncorrectMemberIdError(){
    const memberIdControl = this.authMemberCardInfoForm.get('memberid');
    memberIdControl.setErrors({ invalidMemberId: { value: true } });
    this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.ERROR_MESSAGES.infoMismatchMsg, ConstantsService.ALERT_TYPE.ERROR)];
  } 


  setMaxLength(input, length) {
    if (input.value && input.value.length > length) {
      input.value = input.value.substring(0, length);
    }
  }
  setSuffixLength(input, length) {
    let testexpr = input.value.match(/^[0-9]{2}$/);

    if (testexpr && testexpr.length > 0) {
      input.value = testexpr[0];
    } else {
      input.value = input.value.substring(0, input.value.length);
    }
  }

  handleError(rspmsg, url, errorcode) {
    //handle error
    console.log('handleError::' + rspmsg);
    var errmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_SERVER_ERROR;
    if (rspmsg)
      errmsg = rspmsg;
    this.showAlert('ERROR', errmsg);
    this.authService.addAnalyticsAPIEvent(errmsg, url, errorcode);

  }
  showAlert(ptitle, psubtitle) {
    this.alert = this.alertService.prepareAlertModal(ptitle, psubtitle, "error");

  }

  showAlertPopup(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }
  cancel() {
    scxmlHandler.playSoundWithHapticFeedback();

    // handle cancel request from any of the auth screens based on user scopename
    // if scopename is 'REGISTERED_NOT_VERIFIED', force user to Verify Account. 
    // Else, close the auth screen modal to show Registered Home page
    if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED) {
      // RK: TESTING. swap comments in follwoing 2 lines to test bypassing verifyAccessCode API
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

  handleProgressIconTap(index) {

    if (index == 1)
      this.gotoAuthPersonalInfoPage();
    else if (index == 3)
      this.gotoUpdateSSNPage();
  }

  gotoAuthPersonalInfoPage() {
    this.navCtrl.push(AuthPersonalInfoPage);
  }

  gotoUpdateSSNPage() {
    this.navCtrl.push(SsnAuthPage);
  }

  gotoAccessCodeVerificationPage() {

    this.navCtrl.push(VerifyPasscodePage);
  }
  showAlertModal(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
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
  isformDisabled(fromOBJ,fromwhere): boolean {
    if(fromwhere == "ionbtn"){
      this.disableSubmitButton = (fromOBJ.valid);
    }else{
      this.disableSubmitButton = true;
    }    
    return this.disableSubmitButton;
  }
}
