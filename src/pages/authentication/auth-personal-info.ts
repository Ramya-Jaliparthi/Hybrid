import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { ConstantsService } from '../../providers/constants/constants.service';
import { MemauthRequest } from '../../models/login/memauthRequest.model';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import * as moment from 'moment';
import { MemberInformationPage } from '../../pages/member-information/member-information';
import { AlertModel } from '../../models/alert/alert.model';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AuthPersonalInfoService } from './auth-personal-info.service';
import { RegType } from '../../models/login/regType.enum';
import { UpdateMemAuthinfoResponse } from './updatememauthinfo.model';
import { AlertService } from '../../providers/utils/alert-service';

declare var scxmlHandler;

@Component({
    selector: 'auth-personal-info',
    templateUrl: 'auth-personal-info.html'
})
export class AuthPersonalInfo {

    personalInfoForm: FormGroup;
    onMobileNumberBlur = false;
    onEmailBlur = false;
    onDobBlur = false;
    onLastNameBlur = false;
    onFirstNameBlur = false;
    hintAnswerBlur = false;
    dobMask: Array<any>;
    mobileMask: Array<any>;
    maxdob: string = '';
    registerType: string;
    quesError: boolean = false;
    quesErrorCode: string = "";
    useridin: string = null;
    alerts: Array<any>;
    gender: string;
    defaultSelectQuestion = 0;
    securityQuestions: any = ConstantsService.SECURITY_QUESTIONS_OPTIONS;
    type: string;
    invalidFields:any;
    showHide = false;
    message = '';
    invalidDate: boolean = false;
    invalidFN: boolean = false;
    invalidLN: boolean = false;
    disableSubmitButton:boolean = false;
    phoneNumberTypes: any = ConstantsService.PHONE_NUMBER_TYPES;
    buttonCaption: string = "Show";
    hintQuestionsSelectOptions = {
        title: 'Hint Question',
        subTitle: ''
    };
    phoneNumberTypesSelectOptions = {
        title: 'Phone Number Type',
        subTitle: ''
    };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public alertCtrl: AlertController,
        private authService: AuthenticationService,
        private userContext: UserContextProvider,
        private authenticationStateProvider: AuthenticationStateProvider,
        private authPersonalInfoService: AuthPersonalInfoService,
        private alertService: AlertService) {

        this.dobMask = ValidationProvider.dobMask;
        this.maxdob = moment().format('MM/DD/YYYY');
        this.mobileMask = ValidationProvider.mobileMask;
        this.init();
        let quesError = this.navParams.get('quesError');
        let errmsg = this.navParams.get('errmsg');
        this.type = "underline";

        if (quesError === "-2") {
            this.quesError = true;
            this.quesErrorCode = quesError;
            this.errorBanner(errmsg);
        } else if (quesError == true) {
            this.errorBanner("Some Error description");
            this.quesError = true;
        } else {
            this.quesError = false;
        }

        /*let personalInfoError = this.navParams.get('personalInfoError');
        if(personalInfoError){
            this.useridin = this.authService.useridin;
            this.getauthDetails({ useridin: this.useridin });
        }*/

    }
    ngOnInit() {
        ConstantsService.IS_DASHBOARD = false;
        console.log('ionViewDidLoad verification page 1');
        let etarget = 'Authentication.UserInfo';
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    }
    init() {
        /*let personalInfoError = this.navParams.get('personalInfoError');
        if(personalInfoError){
            this.useridin = this.authService.useridin;
            this.getauthDetails({ useridin: this.useridin });
        }*/
        
        let memberAuthData = this.authService.memAuthData;

        let fName = "";
        let lName = "";
        let dob = "";
        let mobile = "";
        let hintQues = "";
        let hintAns = "";

        //RegisterType is not available on login, so take the register type from userid
        this.registerType = this.authService.useridin.indexOf('@') > 0 ? 'EMAIL' : 'MOBILE';

        //alert(type);
        if (memberAuthData && memberAuthData['ROWSET'].ROWS.firstName != null && memberAuthData['ROWSET'].ROWS.lastName != 'null') {

            fName = memberAuthData['ROWSET'].ROWS.firstName;
            lName = memberAuthData['ROWSET'].ROWS.lastName;
            dob = memberAuthData['ROWSET'].ROWS.DOB;
            mobile = String(memberAuthData['ROWSET'].ROWS.mobilePhone);
            hintQues = memberAuthData['ROWSET'].ROWS.hintQuestion;
            hintAns = memberAuthData['ROWSET'].ROWS.hintAnswer;
        }
        this.personalInfoForm = this.fb.group({
            firstName: [fName, Validators.compose([ValidationProvider.requiredfirstname, ValidationProvider.firstnameValidator])],
            lastName: [lName, Validators.compose([ValidationProvider.requiredlastname, ValidationProvider.lastnameValidator])],
            dob: [dob, Validators.compose([ValidationProvider.requiredDOBForPersonalInfo, ValidationProvider.dobValidatorForPersonalInfo])],
            mobileNumber: [mobile, Validators.compose([ValidationProvider.requiredMobileNumberValidator, ValidationProvider.mobileNumberValidatorForPersonalInfo])],
            emailAddress: ["", Validators.compose([ValidationProvider.emailRequiredValidatorForPersonalInfo])],
            //phoneNumberType: ["", Validators.compose([Validators.required])],
            hintAnswer: [hintAns, Validators.compose([ValidationProvider.requiredHintAnswer, ValidationProvider.hintAnswerValidator])],
            hintQuetion: [hintQues, Validators.compose([ValidationProvider.requiredHintQuestion])]
        });

        if (this.registerType == 'EMAIL') {

            this.personalInfoForm.removeControl("emailAddress");
        } else {

            this.personalInfoForm.removeControl("mobileNumber");
        }
        
        if(this.authService.memAuthData && this.authService.memAuthData['ROWSET'].ROWS.lastMemResult != null){
            Object.keys(this.personalInfoForm.controls).forEach(field => {
                console.log('field :: ' + field);
                const control = this.personalInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
            this.invalidFields = this.authService.memAuthData['ROWSET'].ROWS.lastMemResult.split('|').filter((field) => field);    
            this.setValidatorsForInvalidFields();    
        }
         //let _isvalid =  (this.personalInfoForm.valid && !this.invalidFN && !this.invalidLN && !this.invalidDate);
         //alert(_isvalid);
    }
    
    somethingChanged(formObj){
        //alert(1)
        setTimeout(() => {
        formObj.get('firstName').valueChanges.subscribe(e => {
            this.invalidFN = false;
          }); 
          formObj.get('lastName').valueChanges.subscribe(e => {
            this.invalidLN = false;
          });  
          formObj.get('dob').valueChanges.subscribe(e => {
            this.invalidDate = false;
        });
    },500);
    }
    
    setValidatorsForInvalidFields() {
        if (this.isDateOfBirthInValid()) {
          //this.dobValidators = [...this.dobValidators, this.validationService.inCorrectDynamicDateValidator()];
          //alert("DOB");
          const dobControl = this.personalInfoForm.get('dob');
          dobControl.setErrors({ invalidDate: { value: true } });
          this.invalidDate =true;
        }
        if (this.isFirstNameInvalid()) {
          //this.firstNameValidators = [...this.firstNameValidators, this.validationService.inCorrectDynamicFirstNameValidator()];
          //alert("FN");
          const fnControl = this.personalInfoForm.get('firstName');
          fnControl.setErrors({ invalidFN: { value: true } });
          this.invalidFN =true;
        }
        if (this.isLastNameInvalid()) {
          //this.lastNameValidators = [...this.lastNameValidators, this.validationService.inCorrectDynamicLastNameValidator()];
          //alert("LN");
          const lnControl = this.personalInfoForm.get('lastName');
          lnControl.setErrors({ invalidLN: { value: true } });
          this.invalidLN =true;
        }
         //return { 'invalidDateOfBirth': true };
      }
      fnChanged(){
        this.invalidFN =false;
      }
      lnChanged(){
        this.invalidLN =false;
      }

      onDOBKeyUp(){
          if((this.authService.memAuthData != null && this.authService.memAuthData != undefined) && (this.authService.memAuthData['ROWSET'] != undefined && this.authService.memAuthData['ROWSET'] != null)){
            let previousDOBValue = this.authService.memAuthData['ROWSET'].ROWS.DOB;
            let currentDOBValue = this.personalInfoForm.get('dob').value;
            if((previousDOBValue != undefined || previousDOBValue != null) && (currentDOBValue != undefined && currentDOBValue != null)){
                if((previousDOBValue != currentDOBValue)){
                    this.invalidDate =false;
                }
                else{
                    this.invalidDate =true;
                }
                
            }
          }
      }

      isDateOfBirthInValid() {
        return (this.authService.memAuthData && this.authService.memAuthData.lastAuthFailtxt === 'DOB_NOT_FOUND')
          || this.isValidField(ValidationProvider.AUTH_INVALID_IDENTIFITERS.dateOfBirth);
      }
      isFirstNameInvalid() {
        return this.isValidField(ValidationProvider.AUTH_INVALID_IDENTIFITERS.firstName);
      }
      isLastNameInvalid() {
        return this.isValidField(ValidationProvider.AUTH_INVALID_IDENTIFITERS.lastName);
      }
      isValidField(fieldIndentifier: string) {
        return this.invalidFields && this.invalidFields.includes(fieldIndentifier);
      }

    getauthDetails(request: MemauthRequest) {
        
      let mask = this.authService.showLoadingMask('Accessing Member Information');  
      const isKey2req = false;
      let getMemAuthUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'getmemauthinfo';

      console.log('getMemAuth URL ' + getMemAuthUrl);
      this.authService.makeHTTPRequest("post", getMemAuthUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Member Information')
        .map(res1 => {
          let resobj = res1;
          if (resobj.result == 0) {
            return this.authService.handleDecryptedResponse(resobj);
          }
        }).subscribe(memAuthResponse => {
            this.authService.memAuthData = memAuthResponse;
            console.log("===========================================");
            console.log(this.authService.memAuthData);
            console.log("===========================================");
        });
   
}

    authenticatePersonalInfo(event, formData) {
        console.log('formData', formData);
        if (!formData.valid) {
            console.log(this.personalInfoForm.value.mobileNumber);
            Object.keys(this.personalInfoForm.controls).forEach(field => {
                console.log('field :: ' + field);
                const control = this.personalInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
            this.onMobileNumberBlur = true;
            this.onEmailBlur = true;
            this.onDobBlur = true;
            this.onLastNameBlur = true;
            this.onFirstNameBlur = true;
            this.hintAnswerBlur = true;

            if (this.personalInfoForm.value.firstName == "" || this.personalInfoForm.value.firstName == undefined ||
                this.personalInfoForm.value.lastName == "" || this.personalInfoForm.value.lastName == undefined ||
                this.personalInfoForm.value.dob == "" || this.personalInfoForm.value.dob == undefined ||
                (this.registerType == "MOBILE" && (this.personalInfoForm.value.emailAddress == "" || this.personalInfoForm.value.emailAddress == undefined)) || 
                (this.registerType == "EMAIL" && (this.personalInfoForm.value.mobileNumber == "" || this.personalInfoForm.value.mobileNumber == undefined))
                )
            {
                //this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
                this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE, ConstantsService.ALERT_TYPE.ERROR)];
                this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
                //return;
            }

            if (!this.isNameValid(this.personalInfoForm.value.firstName, this.personalInfoForm.value.lastName)) {
                //this.showAlert('ERROR', ConstantsService.INVALID_NAME_ERROR);
                this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_NAME_ERROR);
                //return;
            }
            if (!this.isValidDOB(this.personalInfoForm.value.dob)) {
                //this.showAlert('ERROR', ConstantsService.INVALID_DOB_ERROR);
                this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_DOB_ERROR);
                //return;
            }          

            if (this.registerType == "MOBILE" && !this.isValidEmailAddress(this.personalInfoForm.value.emailAddress)) {
                //this.showAlert('ERROR', ConstantsService.INVALID_EMAIL_ERROR);
                this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_EMAIL_ERROR);
                //return;
            } else if (this.registerType == "EMAIL" && !this.isValidMobileNumber(this.personalInfoForm.value.mobileNumber)) {
                //this.showAlert('ERROR', ConstantsService.INVALID_MOBILE_NUMBER_ERROR);
                this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_MOBILE_NUMBER_ERROR);
                //return;
            }
            return;
        }

        let memAuthRequest = new MemauthRequest();

        console.log('update called.......');

        memAuthRequest.firstname = this.personalInfoForm.value.firstName.trim();
        memAuthRequest.lastname = this.personalInfoForm.value.lastName.trim();
        memAuthRequest.DOB = this.personalInfoForm.value.dob;
        memAuthRequest.email=this.personalInfoForm.value.emailAddress;
        memAuthRequest.useridin = this.authService.useridin;
        if (this.personalInfoForm.value.mobileNumber && (this.personalInfoForm.value.mobileNumber != "" && this.personalInfoForm.value.mobileNumber.indexOf("-") >= 0)) {
            let mobile_split = this.personalInfoForm.value.mobileNumber.split("-");
            memAuthRequest.mobile = mobile_split[0] + mobile_split[1] + mobile_split[2];
        } else {
            memAuthRequest.mobile = this.personalInfoForm.value.mobileNumber;
        }
        memAuthRequest.phoneNumberType="Mobile";//this.personalInfoForm.value.phoneNumberType;
        memAuthRequest.hintQuestion=this.personalInfoForm.value.hintQuetion;
        memAuthRequest.hintAnswer=this.personalInfoForm.value.hintAnswer;

        console.log("Authenticating personal information", memAuthRequest);
        this.updateMemAuthInfo(memAuthRequest);

    }

    isNameValid(firstName, lastName) {
        let regex = /^[a-zA-Z() ]+$/;
        if (!regex.test(firstName) || !regex.test(lastName)) {
            return false;
        }

        return true;
    }

    isValidDOB(dateofbirth) {
        const dateValue = moment(dateofbirth, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateOfBirth': true };
        } else {
            // check min. 18 yrs and greater than or equal to Jan 1, 1900
            let now = moment();
            let usrdt = moment(dateofbirth, 'MM/DD/YYYY');
            if (usrdt.isAfter('1899-12-31') && now.diff(usrdt, 'years') >= 18)
                return true;
            else
                return false;

        }
    }

    isValidMobileNumber(mobileNumber) {
        if (mobileNumber === "") {
            return false;
        }
        if (mobileNumber && mobileNumber.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

            if (mobileNumber != null && (mobileNumber.startsWith('000') || mobileNumber.startsWith('555') || mobileNumber.startsWith('999') || mobileNumber.startsWith('1'))) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    isValidEmailAddress(emailAddress) {
        if (emailAddress === "") {
            return false;
        }

        if (emailAddress && emailAddress.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return true;
        } else {
            return false;
        }
    }

    updateMemAuthInfo(request) {
        console.log('update called.......');

        let updatememauthinfo = new UpdateMemAuthinfoResponse()
        let updateMemAuthUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'updatememauthinfo';
        setTimeout(() => {
            this.authPersonalInfoService.authPersonalInfoRequest(request, this.registerType, updateMemAuthUrl)
                .subscribe(response => {
                    console.log('Response for update member auth info 1 ', response);
                    if (response) {
                        updatememauthinfo = response;
                        if (response.result == 0) {
                            // call getmemauthinfo by setting imaginary event REGISTERED_NOT_VERIFIED to trigger getmemauthinfo api
                            this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, response);
                        } else {
                            // show error
                            this.handleUpdateMemberAuthInfoErrorCodes(response,updateMemAuthUrl);
                            //this.handleError(response.displaymessage);
                        }
                    }
                },
                err => {
                    console.log("Error during Member Update -" + err);
                    this.handleUpdateMemberAuthInfoErrorCodes(err,updateMemAuthUrl);
                    //this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemAuthUrl, err.result ? err.result : '');
                }
                );
        }, 100);
    }

    handleUpdateMemberAuthInfoErrorCodes(err,updateMemAuthUrl){
        if(err.result == -1 ||err.result == -20980 || err.result == -20981 || err.result == -20982 || err.result == -20983 || err.result == -20984 || err.result == -20985){
            let errorMessage = ConstantsService.ERROR_MESSAGES["UPDATE_MEM_AUTHINFO"][err.result] ? ConstantsService.ERROR_MESSAGES["UPDATE_MEM_AUTHINFO"][err.result] : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY;
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ALERT_TYPE.ERROR)];
            this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemAuthUrl, err.result ? err.result : '');
        }
        else{
            let errorMessage = ConstantsService.ERROR_MESSAGES["UPDATE_MEM_AUTHINFO"][err.result] ? ConstantsService.ERROR_MESSAGES["UPDATE_MEM_AUTHINFO"]["-20980"] : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY;
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ALERT_TYPE.ERROR)];
            this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemAuthUrl, err.result ? err.result : '');
        }
        this.authService.handleInvalidAccessTokenError(err, err.displaymessage, updateMemAuthUrl);
    }

    addSlash(input, event) {
        console.log("dob", input.value, event);
        let dobLenth = input.value.length;
        if (event.keyCode != 8 && (dobLenth === 2 || dobLenth === 5)) {
            let thisVal = input.value;
            thisVal += '/';
            input.value = thisVal;
        }
    }

    validatename(input) {
        console.log('validatename :: input=' + input);
        let testexpr = input.value.match(/[a-zA-Z][a-zA-Z ]+/);

        if (testexpr && testexpr.length > 0) {
            input.value = testexpr[0];
        } else {
            input.value = input.value.substring(0, input.value.length);
        }
    }
    validatenumber(input) {
        let testexpr = input.value.match(/^[0-9]{10}$/);

        if (testexpr && testexpr.length > 0) {
            input.value = testexpr[0];
        } else {
            input.value = input.value.substring(0, input.value.length);
        }
    }

    gotoMemberInfoPage() {
        if (this.quesErrorCode == "-3") {
            this.navCtrl.push(MemberInformationPage, { "quesError": this.quesErrorCode });
        } else {
            this.navCtrl.push(MemberInformationPage);
        }
    }

    handleError(rspmsg) {
        //handle error
        console.log('handleError::' + rspmsg);
        var errmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_SERVER_ERROR;
        if (rspmsg)
            errmsg = rspmsg;
        this.showAlert('ERROR', errmsg);

    }
    showAlert(ptitle, psubtitle) {
        let alert = this.alertCtrl.create({
            title: ptitle,
            subTitle: psubtitle,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    alert.dismiss();
                    return false;
                }
            }]
        });
        alert.present();
        this.authService.setAlert(alert);
    }

    showAlertPopup(ptitle, psubtitle) {
        setTimeout(() => {
            let alert = this.alertCtrl.create({
                title: ptitle,
                subTitle: psubtitle,
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alert.dismiss();
                        return false;
                    }
                }]
            });
            alert.present();
        }, 1000);
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
    phoneNumberType(val: any) {
        console.log('phoneNumberType :', val);
    }
    hintQuestions(val: any) {
        console.log('hintQuestions :', val);
    }
    changeShowStatus() {
        this.type = "underlinenone";
        this.showHide = !this.showHide;
        this.message = this.authService.userRegType === RegType.EMAIL ?
            'We need your phone number for serving you better.' : 'We need your email id for serving you better.';
    }
    togglePwdDisplay(input: any): any {
        input.type = input.type === 'password' ? 'text' : 'password';
        this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
        //input.setFocus();
    }
    isformDisabled(fromOBJ): boolean {
        this.disableSubmitButton = (fromOBJ.valid && !this.invalidFN && !this.invalidLN && !this.invalidDate);
        return this.disableSubmitButton;
      }
}
