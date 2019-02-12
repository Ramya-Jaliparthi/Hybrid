import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { ConstantsService } from '../../providers/constants/constants.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasscodeVerificationRequest } from '../../models/login/passcodeVerificationRequest.model'
import { AuthVerificationSuccessPage } from '../../pages/auth-verification-success/auth-verification-success';
import { UMVerificationSuccessPage } from '../../pages/user-migration-success/user-migration-success';
import { MySettingsPage } from '../../pages/my-settings/my-settings';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { VerifyPasscodeService } from './verifi-password-service';
import { MessageProvider } from '../../providers/message/message';
import { ValidationProvider } from '../../providers/validation/ValidationService';

declare var scxmlHandler: any;
@Component({
  selector: 'verify-passcode',
  templateUrl: 'verify-passcode.html',
})

export class VerifyPasscodePage {

  verifyaccesscodeForm: FormGroup;
  editCommChannelInfoForm: FormGroup;
  alerts: Array<AlertModel> = null;
  registerType: string = "";
  title: string;
  public fromPage;
  public typeOf;
  whichtype: string;
  public number_Email;
  typeCheck: string;
  meassageName: string;
  settingProfile: boolean = false;
  validateProfile: boolean = false;
  public userId;
  resObj: any;
  fromWhere: any;
  selectedUserId: any;
  updatePassEmail: any;
  codeType: any;
  codeTypeData: any;
  codeTypeVal:string;
  forgotUsernameReqData: any;
  isEditCommChannelInfoFormShown : boolean = false;
  onMobileNumberBlur = false;
  onEmailBlur = false;
  mobileMask: Array<any>;
  editCommChannelEmailvalue:string="";
  editCommChannelMobileValue:string="";
  disableEditCommChanngelFormSubmitButton:boolean = false;
  mobileNumberRegEx = new RegExp('^[0-9]{10}');
  commChannelValue:string;
  commChannelType:string = 'EMAIL';
  
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private authService: AuthenticationService,
    private authenticationStateProvider: AuthenticationStateProvider,
    private messageProvider:MessageProvider,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private renderer: Renderer,
    public navParams: NavParams,
    public alertService: AlertService,
    public verifyPasscodeService: VerifyPasscodeService) {

    this.verifyaccesscodeForm = this.fb.group({
      accesscode1: ['', Validators.required],
      accesscode2: ['', Validators.required],
      accesscode3: ['', Validators.required],
      accesscode4: ['', Validators.required],
      accesscode5: ['', Validators.required],
      accesscode6: ['', Validators.required]
    });

    this.mobileMask = ValidationProvider.mobileMask;

    this.fromPage = navParams.get("fromPage");
    this.typeOf = navParams.get("type");
    this.number_Email = navParams.get("no_email");

    let paramUpdatePass = navParams.get("updatePasswordVerifyReq");
    if (paramUpdatePass) {
      this.updatePassEmail = paramUpdatePass.email;
      this.selectedUserId = paramUpdatePass.userIDToVerify;
      this.fromPage = paramUpdatePass.fromPage;
      this.meassageName = phoneNumberMask(false, paramUpdatePass.commValue);
      //since updatePasswordVerifyReq is called only from user-migration scenarios, commChannelType will be EMAIL only
      this.commChannelType = "EMAIL";
    }
    let paramUpdateRV = navParams.get("updateRVOBJVerifyReq");
    if (paramUpdateRV) {
      this.updatePassEmail = paramUpdateRV.email;
      this.selectedUserId = paramUpdateRV.userIDToVerify;
      this.fromPage = paramUpdateRV.fromPage;
      this.meassageName = phoneNumberMask(true, paramUpdateRV.commValue);
      const numberRegEx = new RegExp('^[0-9]{10}'); 
      this.registerType = numberRegEx.test(this.authService.useridin) ? 'MOBILE' : 'EMAIL';
    }

    if(this.fromPage == "accountRegistrationFlow"){
      const numberRegEx = new RegExp('^[0-9]{10}'); 
      this.codeType =  navParams.get("codeType");
      this.registerType = numberRegEx.test(this.authService.useridin) ? 'MOBILE' : 'EMAIL';
      if(navParams.get("codeTypeData") == undefined || navParams.get("codeTypeData") == null){
       
        if(this.registerType == "EMAIL"){
          this.codeTypeData = {emailAddress:this.authService.useridin};
        }
        if(this.registerType == "MOBILE"){
          this.codeTypeData = {phoneNumber:this.authService.useridin};
        }
        this.codeTypeVal =  phoneNumberMask(false, this.authService.useridin);
        this.commChannelType = this.registerType;
      }
      else{
        this.codeTypeData =  navParams.get("codeTypeData");
        this.codeTypeVal =  phoneNumberMask(false, navParams.get("commValue"));
        this.commChannelType = navParams.get("commType");
      }
      
    }else if(this.fromPage == "forgotUsernameFlow"){
     
      this.forgotUsernameReqData = navParams.get("requestData");
      this.meassageName = phoneNumberMask(true,this.forgotUsernameReqData.commValue);
    }

    function replaceBetween(start, end, what, str) {
      what = what.repeat(end - start);
      return str.substring(0, start) + what + str.substring(end);
    };

    function phoneNumberMask(isMaskingEnabled, number) {

      if(isMaskingEnabled){
          var phone_email = "";
          var i = number.length;

          if (i == 10) {
            var first = number.slice(0, 3);
            var second = number.slice(3, 6);
            var three = number.slice(6, 10);

            var FirstMask = replaceBetween(0, 3, '*', first)
            var SecondMask = replaceBetween(0, 3, '*', second)

            phone_email = FirstMask + "-" + SecondMask + "-" + three;
          } else if (i != 10) {

            var parts = number.split("@");
            var part1 = parts[0];

            var spliteno = part1.length;
            phone_email = replaceBetween(4, spliteno, '*', number);

          }
          else {
            phone_email = "invalid number US number";
          }
          return phone_email
      }
      else{
        return number;
      }
      
    }

    if (this.fromPage === "profileSettings" || this.fromPage === "preferenceSettings") {
      this.settingProfile = true;
      if (this.authService.preferenceParams != null) {
        this.validateProfile = true;
      } else {
        this.validateProfile = false;

      }

      if (this.typeOf === "mobile_number") {
        this.whichtype = "mobile number";

        this.meassageName = phoneNumberMask(true, this.number_Email);

      } else if (this.typeOf === "email_address") {
        this.whichtype = "email address";

        this.meassageName = phoneNumberMask(true, this.number_Email);
      }
      //this.title = "Verification";

    } //else {

      this.title = "Verify Your Account";
    //}

  }

  ionViewDidLoad() {

    window.setTimeout(() => { document.getElementById('accesscode1').focus(); }, 200);

  }
  ngOnInit() {
    let etarget = 'AuthenticationVerificationCode';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.authMethod": "Submittted VerificationCode" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

    this.editCommChannelInfoForm = this.fb.group({
      mobileNumber: [this.editCommChannelMobileValue, Validators.compose([ValidationProvider.requiredMobileNumberValidator, ValidationProvider.mobileNumberValidatorForPersonalInfo])],
      emailAddress: [this.editCommChannelEmailvalue, Validators.compose([ValidationProvider.emailRequiredValidatorForPersonalInfo])],
    });
    
  }
  ionViewDidEnter() {

      if(this.fromPage == "accountRegistrationFlow" || this.fromPage == "updatePassword"){
        
        if(this.meassageName != null && this.meassageName != ""){
          this.commChannelValue = this.meassageName;
        }
        else if(this.codeTypeVal != null && this.codeTypeVal != ""){
          this.commChannelValue = this.codeTypeVal;
        }
        else if(this.number_Email != null && this.number_Email != ""){
          this.commChannelValue = this.number_Email;
        }        
        //this.commChannelValue = this.meassageName ? this.meassageName : this.codeTypeVal;      
        //this.commChannelType = this.mobileNumberRegEx.test(this.commChannelValue) ? 'MOBILE' : 'EMAIL';
        if (this.commChannelType == 'EMAIL') {
          this.editCommChannelInfoForm.removeControl("mobileNumber");
          this.editCommChannelEmailvalue = this.commChannelValue;
        } else if (this.commChannelType == 'MOBILE') {
          this.editCommChannelInfoForm.removeControl("emailAddress");
          this.editCommChannelMobileValue = this.commChannelValue;
        }
      }

  }

  onSubmit() {

    let verificationrequestModel = new PasscodeVerificationRequest();
    console.log(this.verifyaccesscodeForm.value);

    verificationrequestModel.accesscode = String(this.verifyaccesscodeForm.value.accesscode1) +
      String(this.verifyaccesscodeForm.value.accesscode2) +
      String(this.verifyaccesscodeForm.value.accesscode3) +
      String(this.verifyaccesscodeForm.value.accesscode4) +
      String(this.verifyaccesscodeForm.value.accesscode5) +
      String(this.verifyaccesscodeForm.value.accesscode6);

    if (this.fromPage === "profileSettings" || this.fromPage === "preferenceSettings") {
      this.verifyAccessCode(verificationrequestModel);
    } else if (this.fromPage === "updatePassword") {   // this is for user migration

      if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
        this.verifyAccessCode(verificationrequestModel);
      } else {
        this.verifyAccessCodeForAccountRegistrationFlow(verificationrequestModel);
      }

    }else if (this.fromPage === "authRV") {
        this.verifyAccessCodeForRV(verificationrequestModel)
    } else {
      this.verifyAccessCodeForAccountRegistrationFlow(verificationrequestModel);
    }
  }

  verifyAccessCode(request: PasscodeVerificationRequest) {
    setTimeout(() => {

      if (this.fromPage === "updatePassword") {
        this.verifyAccessCodeUpdatePassword(request);
      } else {
        this.verifyAccessCodeRegistrationFlow(request);
      }

    }, 100);

  }
  verifyAccessCodeForAccountRegistrationFlow(request: PasscodeVerificationRequest) {

    setTimeout(() => {

      if (this.fromPage === "updatePassword") {
        this.verifyAccessCodeForUpdatePassword(request);
      } else {
        this.verifyAccessCodeForRegistrationFlow(request);
      }

    }, 100);

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
      if (this.verifyaccesscodeForm.valid)
        this.onSubmit();
    }

    else if (firstElement1.value.length >= 0 && firstElement1.value.match(/^[0-9]$/)) {
      if (firstElement1 === secondElement1) {
        secondElement1.blur();
        if (this.verifyaccesscodeForm.valid)
          this.onSubmit();
      } else {
        secondElement1.focus();
      }

    }
  }

  isEditCommChanngelFormSubmitDisabled(fromOBJ): boolean {
    this.disableEditCommChanngelFormSubmitButton = (fromOBJ.valid);
    return this.disableEditCommChanngelFormSubmitButton;
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

  showResendAccessCode(){
    scxmlHandler.playSoundWithHapticFeedback();
      if(!this.isEditCommChannelInfoFormShown){
        //this.changeAccessCodeFormState(false);
        this.isEditCommChannelInfoFormShown = true;

      }else{
        //this.changeAccessCodeFormState(true);
        this.isEditCommChannelInfoFormShown = false;
        this.resetEditCommChannelInfoForm();
      }
  }

  resetEditCommChannelInfoForm(){
    if(this.fromPage == "accountRegistrationFlow" || this.fromPage == "updatePassword"){
        
      if(this.meassageName != null && this.meassageName != ""){
        this.commChannelValue = this.meassageName;
      }
      else if(this.codeTypeVal != null && this.codeTypeVal != ""){
        this.commChannelValue = this.codeTypeVal;
      }
      else if(this.number_Email != null && this.number_Email != ""){
        this.commChannelValue = this.number_Email;
      }        
      
      if (this.commChannelType == 'EMAIL') {
        this.editCommChannelEmailvalue = this.commChannelValue;
      } else if (this.commChannelType == 'MOBILE') {
        this.editCommChannelMobileValue = this.commChannelValue;
      }
    }
  }

  cancelEditCommChannelForm(){
    scxmlHandler.playSoundWithHapticFeedback();
    //this.changeAccessCodeFormState(true);
    this.isEditCommChannelInfoFormShown = false;
    this.resetEditCommChannelInfoForm();
  }

  submitEditCommChannelInfoForm(event, formData) {
    console.log('formData', formData);
    if (!formData.valid) {
        Object.keys(this.editCommChannelInfoForm.controls).forEach(field => {
            console.log('field :: ' + field);
            const control = this.editCommChannelInfoForm.get(field);
            control.markAsTouched({ onlySelf: true });
        });

        if (this.commChannelType == "EMAIL" && !this.isValidEmailAddress(this.editCommChannelInfoForm.value.emailAddress)) {
           this.onEmailBlur = true;
           //this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_EMAIL_ERROR);
        } else if (this.commChannelType == "MOBILE" && !this.isValidMobileNumber(this.editCommChannelInfoForm.value.mobileNumber)) {
           this.onMobileNumberBlur = true;
           //this.authService.addAnalyticsClientEvent(ConstantsService.INVALID_MOBILE_NUMBER_ERROR);
        }
        return;
    }

    this.clearForm();
    this.resetAlerts();
    //this.updateCommChannelInProfile();
    this.editcommchannel();
  }
  editcommchannel(){
    if(this.fromPage == "accountRegistrationFlow"){
      let commValue;
      if (this.editCommChannelInfoForm.value.mobileNumber && (this.editCommChannelInfoForm.value.mobileNumber != "" && this.editCommChannelInfoForm.value.mobileNumber.indexOf("-") >= 0)) {
        let mobile_split = this.editCommChannelInfoForm.value.mobileNumber.split("-");
        commValue = mobile_split[0] + mobile_split[1] + mobile_split[2];
      } else {
        commValue = this.editCommChannelInfoForm.value.emailAddress;
      }
      this.resendUpdatePassAccessCode(commValue);    
    }else if(this.fromPage == "updatePassword"){
      this.resendAccessCodeForUserMigrationflow(this.editCommChannelInfoForm.value.emailAddress);
    } 
  }

  splitValidPhoneNumber(phonenumber){
    if (phonenumber && (phonenumber != "" && phonenumber.indexOf("-") >= 0)) {
      let mobile_split = phonenumber.split("-");
      return mobile_split[0] + mobile_split[1] + mobile_split[2];
    } else {
        return phonenumber;
    }
  }

  updateCommChannelInProfile(){
    const request = {
      useridin: this.authService.useridin
    };

    if (this.commChannelType == "EMAIL") {
      request["emailAddress"] = this.editCommChannelInfoForm.value.emailAddress;
    }
    else if (this.commChannelType == "MOBILE") {
      let mobile_split = this.splitValidPhoneNumber(this.editCommChannelInfoForm.value.mobileNumber);
      request["phoneType"] = "MOBILE";
      if(mobile_split != null){
        request["phoneNumber"] =  mobile_split;
      }
    }
    
    let mask = this.authService.showLoadingMask();
    const isKey2req = false;
    let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("updatememprofileEndPoint");
    console.log('updateMemberProfile Url: ' + updateMemberProileURL);
    this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Updating Communication Channel...')
        .map(res1 => {
            let resobj = res1;
            if (resobj.result == "0") {
                return resobj;
            } else {
                // alert message needs to be show if failure
                console.log('updateMemberProfile :: error =' + resobj.errormessage);
                let emsg = resobj.displaymessage;
                //this.alerts = [this.alertService.prepareAlertModal(resobj.displaymessage, resobj.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS)];
                this.handleAPIResponseError(resobj, emsg, updateMemberProileURL);
            }
        })
        .subscribe(response => {
            console.log('Response updateMemberProfile:', response);
            
            if(this.fromPage == "accountRegistrationFlow" ){
              if(this.registerType == "EMAIL"){
                this.codeTypeData = {emailAddress:request["emailAddress"]};
              }
              if(this.registerType == "MOBILE"){
                this.codeTypeData = {phoneNumber:request["phoneNumber"]};
              }
              this.resendAccessCode();
            }
            if(this.fromPage == "updatePassword"){
              if (this.commChannelType == "EMAIL") {
                this.resendAccessCodeForUserMigrationflow(request["emailAddress"]);
              }              
            }
            
            if (this.commChannelType == "MOBILE") {
              if(this.codeTypeVal != null && this.codeTypeVal != ""){
                this.codeTypeVal = request["phoneNumber"];
              }
              else if(this.meassageName != null && this.meassageName != ""){
                this.meassageName = request["phoneNumber"];
                this.number_Email = request["phoneNumber"];
              }
              this.commChannelValue= request["phoneNumber"];
            }
            else if (this.commChannelType == "EMAIL") {
              if(this.codeTypeVal != null && this.codeTypeVal != ""){
                this.codeTypeVal = request["emailAddress"];
              }
              else if(this.meassageName != null && this.meassageName != ""){
                this.meassageName = request["emailAddress"];
                this.number_Email = request["emailAddress"];
              }
              this.commChannelValue= request["emailAddress"];
            }            
            this.isEditCommChannelInfoFormShown = false;
        },
        err => {
            console.log("Error while updateMemberProfile Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_MEMPROFILE_UPDATE_ERROR;
            if (err.displaymessage) {
                errmsg = err.displaymessage;
            }
            //this.authService.addAnalyticsAPIEvent(errmsg, updateMemberProileURL, err.result);
        }
        );
  }

  resendAccessCodeForUserMigrationflow(updatedCommChannelValue){
      if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
        this.resendUpdatePassCommChannelCode(updatedCommChannelValue);
      } else {
        this.resendUpdatePassAccessCode(updatedCommChannelValue);
      }
    
  }

  resendAccessCode() {
    if (this.fromPage === "profileSettings" || this.fromPage === "preferenceSettings") {
      this.userId = this.number_Email;
      if (this.typeOf === "mobile_number") {
        this.fromWhere = "updateMemberMobileNumber";
      } else if (this.typeOf === "email_address") {
        this.fromWhere = "updateMemberEmailAddress";
      }

      this.authService.updateMemberProfile(this.userId, this.fromWhere).then((result) => {
        this.resObj = result;
        if (this.resObj.result == "0") {
          return this.resObj;
        } else {
          console.log('updateMemberProfile :: error =' + this.resObj.errormessage);
          let emsg = this.resObj.displaymessage;
          this.handleAPIResponseError(this.resObj, emsg, this.authService.updateMemberProileURL);
        }
      });
    }
    // moved to resendAccessforUserMigrationflow()
    /* else if (this.fromPage === "updatePassword") {
      if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
        this.resendUpdatePassCommChannelCode();
      } else {
        this.resendUpdatePassAccessCode();
      }
    } */
    else if(this.fromPage == "forgotUsernameFlow"){
         this.resendCodeApiCallForgotUsername(this.forgotUsernameReqData);
    }
    else {
      this.userId = this.authService.useridin;
      this.resendApiCall(this.userId);
    }

    let etarget = 'AuthenticationVerificationCodeResent';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.authMethod": "Verification resent" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  accesscode_mask(acelem) {
    let myMask = "_ _ _ _ _ _";

    let myNumbers = [];
    let myOutPut = ""
    let theLastPos = 1;
    let myText = acelem.value;
    let numcnt = 0;

    //get numbers
    for (let i = 0; i < myText.length; i++) {
      if (!isNaN(myText.charAt(i)) && myText.charAt(i) != " " && myText.charAt(i).match(/^[0-9]$/)) {
        myNumbers.push(myText.charAt(i));
        numcnt++;
      }
    }
    //write over mask
    for (let j = 0; j < myMask.length; j++) {
      if (myMask.charAt(j) == "_") { //replace "_" by a number
        if (myNumbers.length == 0)
          myOutPut = myOutPut + myMask.charAt(j);
        else {
          myOutPut = myOutPut + myNumbers.shift();
          theLastPos = j + 1; //set caret position
        }
      } else {
        myOutPut = myOutPut + myMask.charAt(j);
      }
    }
    acelem.value = myOutPut;

    acelem.setSelectionRange(theLastPos, theLastPos);
    if (numcnt == 6)
      this.onSubmit();
  }

  handleError(response) {
    //handle error
    console.log('handleError::' + response);

  }

  showAlert(ptitle, psubtitle) {
    let me = this;
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: [{
        text: 'OK',
        handler: () => {

          alert.dismiss().then(() => {
            me.clearForm();
          });
          return false;
        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }
  clearForm() {
    this.verifyaccesscodeForm.reset();
    document.getElementById('accesscode1').focus();
  }

  /*
  changeAccessCodeFormState(isEnable){
    if(isEnable){
      this.verifyaccesscodeForm.enable();
      this.verifyaccesscodeForm.reset();
      document.getElementById('accesscode1').focus();
    }
    else{
      this.verifyaccesscodeForm.reset();
      this.verifyaccesscodeForm.disable();
    }
  }
  */

  resetAlerts(){
    this.alerts=[];
  }

  resendApiCall(data: any) {
    scxmlHandler.playSoundWithHapticFeedback();

    if(this.codeType && this.codeType == "codeForUsername")
    {
      this.authService.reSendAccessCodeUsername(data, this.codeTypeData).then((result) => {
        this.resObj = result;
        if (this.resObj.result === "0") {
          if(this.resObj.displaymessage){
            this.alerts = [this.alertService.prepareAlertModal("",this.resObj.displaymessage, "info",false)];
          }else{
            this.alerts = [this.alertService.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT, "info",false)];
          }
          return this.resObj;
        } else {
          console.log('sendaccesscode :: error =' + this.resObj.errormessage);
          this.clearForm();
          let emsg = this.resObj.displaymessage;
          this.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);
  
        }
      });
    }else{
      this.authService.reSendAccessCode(data).then((result) => {
        this.resObj = result;
        if (this.resObj.result === "0") {
          if(this.resObj.displaymessage){
            this.alerts = [this.alertService.prepareAlertModal("",this.resObj.displaymessage, "info",false)];
          }else{
            this.alerts = [this.alertService.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT, "info", false)];
          }
          return this.resObj;
        } else {
          console.log('sendaccesscode :: error =' + this.resObj.errormessage);
          this.clearForm();
          let emsg = this.resObj.displaymessage;
          this.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);
  
        }
      });
    }

  }

  //  resent verificaiton code in caseof forgot username 
  resendCodeApiCallForgotUsername(data: any) {
    scxmlHandler.playSoundWithHapticFeedback();

      this.authService.reSendAccessCodeForgotUsername(data).then((result) => {

        console.log("resendapi for forgotusernae request", data);
        console.log("response for resendapi forgotusername", JSON.stringify(result));

        this.resObj = result;
        if ((this.resObj.result === "0") || (this.resObj.result === 0) ) {
          if(data.commType == "EMAIL"){
          this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT,ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT_BODYTXT, "info",false)];                     
          }else{
          this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT,"", "info",false)];                                 
          }
          return this.resObj;
        } else {
          console.log('sendaccesscode :: error =' + this.resObj.errormessage);
          this.clearForm();
          let emsg = this.resObj.displaymessage;
          //this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);
         this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, emsg, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
        }
      });
  }

  // resend verification for send access code in user migration

  resendUpdatePassAccessCode(updatedCommChannelValue) {
    return new Promise((resolve, reject) => {
      let mask = this.authService.showLoadingMask('Sending access code...');
      let selectedUserId;
      setTimeout(() => {
        const numberRegEx = new RegExp('^[0-9]{10}'); 
        let commChannelType = numberRegEx.test(updatedCommChannelValue) ? 'MOBILE' : 'EMAIL';
        if(this.fromPage == "accountRegistrationFlow"){
          selectedUserId = this.authService.useridin;
        }else{
          selectedUserId = this.selectedUserId;
        }
        const request = {
          useridin: this.authService.useridin,
          commChannel: updatedCommChannelValue,
          commChannelType: commChannelType,
          userIDToVerify: selectedUserId,
          editCommChannel:'true'
        };
        let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendaccesscode';
        console.log('send access code url:' + sendAccessCodeUrl);
        const isKey2Req = false;
        this.authService.makeHTTPRequest("post", sendAccessCodeUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), 'Sending access code...')
          .subscribe(res => {
            if(res && !(res.displaymessage)) {
                this.alerts = [this.alertService.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT, "info",false)];
                this.updatePassEmail = updatedCommChannelValue;
                if(this.codeTypeVal != null && this.codeTypeVal != ""){
                  this.codeTypeVal = updatedCommChannelValue;
                }
                if(this.meassageName != null && this.meassageName != ""){
                  this.meassageName = updatedCommChannelValue;
                }
                this.isEditCommChannelInfoFormShown = false;
            }else{
             
              // if (res.result == "-90300"||res.result == "-90320") {
              //     let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDACCESSCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDACCESSCODE"][res.result];
              //     this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
              //     this.authService.addAnalyticsAPIEvent(errorMessage, sendAccessCodeUrl, res.result);
              // }
              if(res.displaymessage){
                this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, res.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
               this.authService.addAnalyticsAPIEvent(res.displaymessage, sendAccessCodeUrl, res.result);
             }
          }
          }, (err) => {
            reject(err);
            console.log(err);
            if(err.displaymessage){
              this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
             this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result);
           }
          });
      },
        100);
    });
  }

  // resend verification code for send comm channel in user migration
  resendUpdatePassCommChannelCode(updatedCommChannelValue) {
    return new Promise((resolve, reject) => {
      let mask = this.authService.showLoadingMask('Sending access code...');
      setTimeout(() => {
        const request = {
          useridin: this.authService.useridin,
          email: updatedCommChannelValue,
          mobile: '',
          userIDToVerify: this.selectedUserId,
          editCommChannel:'true'
        };

        const isKey2req = false;
        let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("sendcommchlmigration");
        // let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token });
        this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Veryfiying access code ...')
          .subscribe(response => {
            if(response && !(response.displaymessage)) {
                this.alerts = [this.alertService.prepareAlertModal("", ConstantsService.ERROR_MESSAGES.FORGOTUNAME_VERIFICATION_RESENT, "info", false)];
                 this.updatePassEmail = updatedCommChannelValue;
                 if(this.meassageName != null && this.meassageName != ""){
                  this.meassageName = updatedCommChannelValue;
                }
                 this.isEditCommChannelInfoFormShown = false;
            }else{
            
            if(response.displaymessage){
              this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
              this.authService.addAnalyticsAPIEvent(response.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', response.result);
            }

            }            
          },
            err => {
              reject(err);
              console.log(err);
              // let errmsg = "Error while sendCommunicationChannel access code - Server encountered error processing your request"
              // if (err.displaymessage) {
              //   errmsg = err.displaymessage;
              // }
              
        if(err.displaymessage){
         
           this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
           this.authService.addAnalyticsAPIEvent(err.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', err.result);
         }

            }
          );
      }, 500);
    });
  }

  updateCommChnlStatus(jsonArrayProfile: Array<any>) {
    let mask = this.authService.showLoadingMask();

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin

      };

      if (jsonArrayProfile != null) {
        request["memobject"] = jsonArrayProfile;
      }

      this.authService.updateCommChannelStatus(request, mask).subscribe(response => {
        if (response.result === "0") {
          this.authService.previousTxtMsgMarketingFlag = this.authService.preferenceParams[0].memkeyvalue === "YES" ? true : false;
          this.authService.previousEmailMarketingFlag = this.authService.preferenceParams[1].memkeyvalue === "YES" ? true : false;
          this.authService.preferenceParams = null;
          this.authService.isPreferenceVerified = true;
          this.navCtrl.push(MySettingsPage, { 'redirectToPreference': true, 'marketingErr': false });
        } else {
          let errmsg = response.displaymessage;
          if (response.result === "-10") {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_UPDATEPREFERENCE_SERVER_ERROR;
          } else if (response.result === "-11" || response.result === "-12") {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR;
          } else {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR;
          }
          this.authService.addAnalyticsAPIEvent(errmsg);
          this.navCtrl.push(MySettingsPage, { 'redirectToPreference': true, 'marketingErr': true, 'resultCode': response.result });
        }
      },
        err => {
          console.log("Error while updateMemberPreferences Info -" + JSON.stringify(err));
          let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPREFERENCE_SERVER_ERROR;
          if (err.displaymessage) {
            errmsg = err.displaymessage;
          }
          this.navCtrl.push(MySettingsPage, { 'redirectToPreference': true, 'marketingErr': true, 'resultCode': null });
          this.authService.addAnalyticsAPIEvent(err.displaymessage, this.authService.configProvider.getProperty("updatemempreferenceEndPoint"), err.result);
        }
      );
    }, 500);
  }
  verifyAccessCodeForUpdatePassword(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin,
      commChannel: this.updatePassEmail,
      commChannelType: 'EMAIL',
      userIDToVerify: this.selectedUserId
    };

    let verifyAccessCodeUrlForAccountRegistrationFlow = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'verifyaccesscode';
    this.verifyPasscodeService.getverifyAccessCodeForAccountRegistrationRequest(verifyAccessCodeUrlForAccountRegistrationFlow, generatedRequest)
      .subscribe(response => {
        if (response && !(response.displaymessage))  {
          //If password verified before authentication, continue with authentication flow.
          if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED){
            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_PASSCODE_VERIFIED, null);
          // else if (this.fromPage === "updatePassword") {
          //     this.navCtrl.setRoot(LoginComponent);
          //   } 
          }else {
              this.navCtrl.setRoot(DashboardPage);
              //this.navCtrl.push(AuthVerificationSuccessPage);
              this.sendNotification(this.updatePassEmail);
              this.navCtrl.push(UMVerificationSuccessPage,{"migratedUser":generatedRequest.userIDToVerify});
            }

          if (this.authService.currentUserScopename == ConstantsService.AUTHENTICATED_NOT_VERIFIED) {

          }
        }else{
          console.log("Error:::::" + response);
          // if (response.result == "-90321" || response.result == "-90300" || response.result == "-90322") {
          //   let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYACCESSCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYACCESSCODE"][response.result];
          //   this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          //   this.authService.addAnalyticsAPIEvent(errorMessage, verifyAccessCodeUrlForAccountRegistrationFlow, response.result);
          // }
          if(response.displaymessage){
                     
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUrlForAccountRegistrationFlow, response.result);
           }

          this.clearForm();
        }

      },
        err => {
          console.log("Error:::::" + err);
          if(err.displaymessage){
                     
          this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrlForAccountRegistrationFlow, err.result);
         }
         this.clearForm();
          
        });
  }
  verifyAccessCodeForRV(request) {
    /*const generatedRequest = {
      ...request,
      useridin: this.authService.useridin,
      commChannel: this.updatePassEmail,
      commChannelType:this.registerType,
      userIDToVerify: this.selectedUserId
    };*/
    let generatedRequest = {}
    if(this.registerType == "EMAIL"){
      generatedRequest = {
        ...request,
        useridin: this.authService.useridin,
        email: this.updatePassEmail,
        mobile: '',
        userIDToVerify: this.selectedUserId
      }
    }else{
       generatedRequest = {
        ...request,
        useridin: this.authService.useridin,
        email:'',
        mobile: this.updatePassEmail,
        userIDToVerify: this.selectedUserId
      }
    }
    //let verifyAccessCodeUrlForAccountRegistrationFlow = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'verifyaccesscode';
    let verifyAccessCodeUrlForAccountRegistrationFlow = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifycommchlmigration");
    this.verifyPasscodeService.getverifyAccessCodeForAccountRegistrationRequest(verifyAccessCodeUrlForAccountRegistrationFlow, generatedRequest)
      .subscribe(response => {
        if (response && !(response.displaymessage))  {
          //If password verified before authentication, continue with authentication flow.
          //if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED){
            //this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_PASSCODE_VERIFIED, null);
          // else if (this.fromPage === "updatePassword") {
          //     this.navCtrl.setRoot(LoginComponent);
          //   } 
         // }else {
              this.navCtrl.setRoot(DashboardPage);
              this.navCtrl.push(AuthVerificationSuccessPage);
           // }
          //if (this.authService.currentUserScopename == ConstantsService.AUTHENTICATED_NOT_VERIFIED) {
          //}
        }else{
          console.log("Error:::::" + response);
          // if (response.result == "-90321" || response.result == "-90300" || response.result == "-90322") {
          //   let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYACCESSCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYACCESSCODE"][response.result];
          //   this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          //   this.authService.addAnalyticsAPIEvent(errorMessage, verifyAccessCodeUrlForAccountRegistrationFlow, response.result);
          // }
          if(response.displaymessage){
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUrlForAccountRegistrationFlow, response.result);
           }
          this.clearForm();
        }
      },
        err => {
          console.log("Error:::::" + err);
          if(err.displaymessage){
          this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUrlForAccountRegistrationFlow, err.result);
         }
         this.clearForm();
        });
  }
  verifyAccessCodeForRegistrationFlow(request) {

    let generatedRequest = {};
    let verifyAccessCodeUrlForAccountRegistrationFlow = "";
    if(this.fromPage == "forgotUsernameFlow"){

      generatedRequest = {
        //...request,
        accessCode: request.accesscode,
        commType: this.forgotUsernameReqData.commType,
        userIdRequired: this.forgotUsernameReqData.userIdRequired,
        useridin: this.forgotUsernameReqData.useridin,
        commValue:this.forgotUsernameReqData.commValue
      };

      verifyAccessCodeUrlForAccountRegistrationFlow = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunaccesscode");

    }else{
       generatedRequest = {
        ...request,
        useridin: this.authService.useridin
      };
  
       verifyAccessCodeUrlForAccountRegistrationFlow = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyaccesscode");
    }

    this.verifyPasscodeService.getverifyAccessCodeForAccountRegistrationRequest(verifyAccessCodeUrlForAccountRegistrationFlow, generatedRequest)
      .subscribe(response => {
        console.log("verifyfunaccesscode request ",generatedRequest);
        console.log("verifyfunaccesscode response",JSON.stringify(response));
        if (response && (response.result === "0" || response.result === 0)) {
          
          if(this.fromPage == "forgotUsernameFlow"){
            //let params: any = {};
            //params.getUserDetails = true;
           // this.navCtrl.setRoot(DashboardPage);
           // this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
           // this.navCtrl.push(LoginComponent);
           this.navCtrl.setRoot(DashboardPage);
           this.authService.getUserDetails = true;
           scxmlHandler.playSoundWithHapticFeedback();
           this.messageProvider.sendMessage(ConstantsService.RE_LOGIN, null);
          }else{
          //If password verified before authentication, continue with authentication flow.
          if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED)
            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_PASSCODE_VERIFIED, null);
          else if (this.fromPage === "profileSettings" || this.fromPage === "preferenceSettings") {
              this.navCtrl.push(MySettingsPage);
            }
            // else if(this.codeType && this.codeType == "codeForUsername"){
            //   this.navCtrl.push(LoginComponent);
            // } 
            else {
              this.navCtrl.setRoot(DashboardPage);
              this.navCtrl.push(AuthVerificationSuccessPage);
            }
          }
        }else{
         
          if(response.displaymessage){
            if(response.result == "-90300"){
              this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER,ConstantsService.ERROR_MESSAGES.REGISTRATION[response.result],ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];               
            }else{                
              this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
           }

          this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUrlForAccountRegistrationFlow, response.result);
        }
        this.clearForm();
        }

      },
        err => {
          console.log("Error:::::" + err);
          var errmsg = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_SERVERERR_ACCESSCODEVERIFI;
          this.clearForm();
          if (err.result === "-2" && String(err.errormessage).indexOf("ACCESS CODE EXPIRED") != -1) {
            let msg: string = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED;
            console.log(msg);
            console.log("ERROR :: ACCESS CODE EXPIRED");
            this.alerts = [this.alertService.prepareAlertModal("Oops", msg, "error")];

            this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED_NOTAG, verifyAccessCodeUrlForAccountRegistrationFlow, err.result);

            let me = this;

            window.setTimeout(() => {
              let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
              me.renderer.listen(aElement[0], 'click', (event) => {
                me.resendAccessCode();
              });
            }, 10);
          } else if (err.result === "-3" && String(err.errormessage).indexOf("ACCESS CODE MISMATCH") != -1) {
            console.log("ERROR :: ACCESS CODE MISMATCH");
            this.alerts = [this.alertService.prepareAlertModal("Oops", err.displaymessage, "error")];
            this.authService.addAnalyticsAPIEvent("ACCESS CODE MISMATCH", verifyAccessCodeUrlForAccountRegistrationFlow, err.result);
          } else {
            console.log("ERROR :: Default error index = " + String(err.errormessage).indexOf("ACCESS CODE MISMATCH"));
            if(err.displaymessage){
              this.alerts = [this.alertService.prepareAlertModal("Oops", err.displaymessage, "error")];
            }else{
              this.alerts = [this.alertService.prepareAlertModal("Oops", errmsg, "error")];
            }
            
            this.authService.addAnalyticsAPIEvent("ACCESS CODE MISMATCH", verifyAccessCodeUrlForAccountRegistrationFlow, err.result);
          }

        });

  }
  verifyAccessCodeUpdatePassword(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin,
      email: this.updatePassEmail,
      mobile: '',
      userIDToVerify: this.selectedUserId
    };

    let verifyAccessCodeUpdatePassword = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifycommchlmigration");

    this.verifyPasscodeService.getverifyAccessCodeRequest(verifyAccessCodeUpdatePassword, generatedRequest)
      .subscribe(response => {
        if (response && !(response.displaymessage)) {
          //If password verified before authentication, continue with authentication flow.
          if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED)
            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_PASSCODE_VERIFIED, null);
          // else if (this.fromPage === "updatePassword") {
          //     this.navCtrl.push(LoginComponent);
          //   }
            else {
              this.navCtrl.setRoot(DashboardPage);
              //this.navCtrl.push(AuthVerificationSuccessPage); , { "updatePasswordVerifyReq": objForVerifyPasscode });
              this.navCtrl.push(UMVerificationSuccessPage,{"migratedUser":generatedRequest.userIDToVerify});
            }
          
          //if (this.authService.currentUserScopename == ConstantsService.AUTHENTICATED_NOT_VERIFIED) {

          //}
        }else{
          // if (response.result == "-90326" || response.result == "-90300" || response.result == "-90327") {
          //   let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYCOMMCHLACCCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_VERIFYCOMMCHLACCCODE"][response.result];
          //   this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          //   this.authService.addAnalyticsAPIEvent(errorMessage, verifyAccessCodeUpdatePassword, response.result);
          // }
          if(response.displaymessage){
                     
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
           this.authService.addAnalyticsAPIEvent(response.displaymessage, verifyAccessCodeUpdatePassword, response.result);
         }
          this.clearForm();
        }

      },
        err => {
          console.log("Error:::::" + err);
         if(err.displaymessage){
                     
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
           this.authService.addAnalyticsAPIEvent(err.displaymessage, verifyAccessCodeUpdatePassword, err.result);
         }
         this.clearForm();

        });
  }

  handleAPIResponseError(response, emsg, url?, callBackHandler?, scopeParam?) {
    console.log('handleAPIResponseError ::' + emsg);
    if (response.errormessage == "Invalid Access token. Access token expired") {
        this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
    } else {
        //this.showAlert('ERROR', emsg, callBackHandler, scopeParam);
        this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, emsg, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
        this.authService.addAnalyticsAPIEvent(emsg, url, response.result);
    }
  }

  verifyAccessCodeRegistrationFlow(request) {
    let generatedRequest = {};
    let verifyAccessCodeUrl = "";
    if(this.fromPage == "forgotUsernameFlow"){

      generatedRequest = {
        //...request,
        accessCode: request.accesscode,
        commType: this.forgotUsernameReqData.commType,
        userIdRequired: this.forgotUsernameReqData.userIdRequired,
        useridin: this.forgotUsernameReqData.useridin,
        commValue:this.forgotUsernameReqData.commValue
      };

      verifyAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifyfunaccesscode");

    }else{
       generatedRequest = {
        ...request,
        useridin: this.authService.useridin
      };
    if (this.typeOf == "mobile_number") {
      generatedRequest["mobile"] = this.number_Email;
    }
    else if (this.typeOf == "email_address") {
      generatedRequest["email"] = this.number_Email;
    }

    verifyAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("verifycommchlacccode");
  }

    //let verifyAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("newAuthEndPoint") + 'verifycommchlacccode';

    this.verifyPasscodeService.getverifyAccessCodeRequest(verifyAccessCodeUrl, generatedRequest)
      .subscribe(response => {
        console.log("verifyfunaccesscode request ",generatedRequest);
        console.log("verifyfunaccesscode response",JSON.stringify(response));
        if (response && response.result === "0") {

          if(this.fromPage == "forgotUsernameFlow"){
            //let params: any = {};
            //params.getUserDetails = true;
           // this.navCtrl.setRoot(DashboardPage);
           // this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
           // this.navCtrl.push(LoginComponent);
           this.authService.getUserDetails = true;
           this.navCtrl.setRoot(DashboardPage);
           scxmlHandler.playSoundWithHapticFeedback();
           this.messageProvider.sendMessage(ConstantsService.RE_LOGIN, null);
          }else{

          //If password verified before authentication, continue with authentication flow.
          if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED){
            this.authenticationStateProvider.sendMessage(ConstantsService.APP_EVENT_PASSCODE_VERIFIED, null);
          }
          else {
            if (this.fromPage === "profileSettings" || this.fromPage === "preferenceSettings") {
              this.navCtrl.remove(this.navCtrl.length() - 1);
              this.navCtrl.remove(this.navCtrl.length() - 1);
              if (!this.authService.isPreferenceVerified && this.authService.preferenceParams) {
                this.updateCommChnlStatus(this.authService.preferenceParams);
              } else {
                this.navCtrl.push(MySettingsPage);
              }
              this.sendNotification(this.number_Email);
            }
            // else if(this.codeType && this.codeType == "codeForUsername"){
            //   this.navCtrl.push(LoginComponent);
            // }
            else {
              this.navCtrl.setRoot(DashboardPage);
              this.navCtrl.push(AuthVerificationSuccessPage);
            }
          }
        }
      }
        else{
          this.clearForm();
          this.alerts = [this.alertService.prepareAlertModal("Oops", response.displaymessage, "error")];
        }

      },
        err => {
          console.log("Error:::::" + err);
          var errmsg = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_SERVERERR_ACCESSCODEVERIFI;
          this.clearForm();
          if (err.displaymessage)
            errmsg = err.displaymessage;

          if (err.result === "-2" && String(err.errormessage).indexOf("ACCESS CODE EXPIRED") != -1) {
            let msg: string = ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED;
            console.log(msg);
            console.log("ERROR :: ACCESS CODE EXPIRED");
            this.alerts = [this.alertService.prepareAlertModal("Oops", msg, "error")];

            this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.FORGOTPSWD_VERIFICODE_EXPIRED_NOTAG, verifyAccessCodeUrl, err.result);

            let me = this;

            window.setTimeout(() => {
              let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
              me.renderer.listen(aElement[0], 'click', (event) => {
                me.resendAccessCode();
              });
            }, 10);
          } else if (err.result === "-3" && String(err.errormessage).indexOf("ACCESS CODE MISMATCH") != -1) {
            console.log("ERROR :: ACCESS CODE MISMATCH");
            this.alerts = [this.alertService.prepareAlertModal("Oops", err.displaymessage, "error")];
            this.authService.addAnalyticsAPIEvent("ACCESS CODE MISMATCH", verifyAccessCodeUrl, err.result);
          } else {
            console.log("ERROR :: Default error index = " + String(err.errormessage).indexOf("ACCESS CODE MISMATCH"));
            if(err.displaymessage){
              this.alerts = [this.alertService.prepareAlertModal("Oops", err.displaymessage, "error")];
            }else{
              this.alerts = [this.alertService.prepareAlertModal("Oops", errmsg, "error")];
            }
            
            this.authService.addAnalyticsAPIEvent("ACCESS CODE MISMATCH", verifyAccessCodeUrl, err.result);
          }

        });
  }

  sendNotification(commChannel) {
    const numberRegEx = new RegExp('^[0-9]{10}'); 
    let commType = numberRegEx.test(commChannel) ? 'MOBILE' : 'EMAIL';
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.verifyPasscodeService.sendUpdateNotification(commType !== 'MOBILE',commChannel,commType).subscribe(response => {
          console.log(response);
        },
          err => {
            reject(err);
          }
        );
      }, 200);
    });
  }
}
