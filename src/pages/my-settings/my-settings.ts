import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { LoadingMaskProvider } from '../../providers/loading-mask/loading-mask';
import { ValidationProvider } from '../../providers/validation/ValidationService';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { ConstantsService } from "../../providers/constants/constants.service";
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { LearnMoreComponent } from '../../components/learn-more/learn-more';
import { AlertModel } from '../../models/alert/alert.model';
import { MySettingsService } from './my-settings-service';
import { ChangePassword } from './change-password';
import { PopoverController } from 'ionic-angular';
import { CardConfig } from '../../components/dashboard-card/card-config';
import { ContactUsPage } from '../contact-us/contact-us';
import { CommChannelstatusModel } from '../../models/my-settings/my-settings.model';

declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Component({
  selector: 'page-my-settings',
  templateUrl: 'my-settings.html',
})
export class MySettingsPage implements OnInit {

  loadingMaskHandler: any;
  settings: string;
  userName: string;
  userDOB: string;
  onPasswordBlur: boolean = false;
  onExistingPasswordBlur: boolean = false;
  emailNotifPromo: string = "checked";
  showNameAndDOB: boolean = true;

  phoneno: string = "";
  email: string = "";
  curPwdCaption: string = "show";
  newPwdCaption: string = "show";

  //binding fields for editable
  emailEditable: string = "";
  phonenoEditable: string = "";
  addPhonenoEditable: string = "";
  
  //preferecnce:  - not sure about these flags
  mrkcomemail: string;
  txtmsgchked: boolean;
  alerts: Array<any>;
  //preferecnce check box
  txtMsgMarketingFlag: boolean = false;
  emailMarketingFlag: boolean = false;
  previousMandatedCommType: string = null;
  mandatedCommType: string = null;

  //securityPin
  securitypin: string;
  securitypinchked: boolean;

  memAuthData: any;
  memProfileData: any;
  memPreferenceData: any;

  //disableSecurityPage: boolean = true;
  editPhoneNo: boolean;
  editEmail: boolean;
  disablePreference: boolean = false;
  //buttonDisabled = false;
  //msgColor: string;
  emailiconcolor: string;
  mobileIconColor: string;
  verificationLink: string;
  phone_emai: any;
  toastinstance: any;
  emailIconName: string;
  mobileIconName: string;
  emailVerified: boolean = false;
  mobileVerified: boolean = false;
  resObj: any;
  //emailPrompt: any;
  //mobilePrompt: any;
  showPasswordErrors = false;
  loginResponse : any;
  preferenceEmailHolder: boolean = true;
  emailSliderHolder: boolean = false;

  mobileSliderHolder: boolean = false;
  preferenceMobileHolder: boolean = true;

  saveBtnDisable: boolean = true;

  registrationStatus: string;
  memEmailAddress: string;
  memMobileNumber: number;  
  isVerifiedMobile: boolean;
  isVerifiedEmail: boolean;
  saveBtnFlag: number =0;

  // check user clicks in prompts
  tappedOnEmailPrompt: boolean = false;

  onAddress1Blur: boolean = false;
  onCityBlur: boolean = false;
  onStateBlur: boolean = false;
  onZipCodeBlur: boolean = false;
  //onPasswordBlur: boolean = false;
  onEmailBlur: boolean = false;
  onMobileNumberBlur: boolean = false;
  onAddMobileNumberBlur:boolean = false;
  hintAnswerBlur: boolean = false;
  //txtMsgMarketingFlag: boolean = false;
  //emailMarketingFlag: boolean = false;
  //editPhoneNo: boolean;
  //editEmail: boolean;
  //emailVerified: boolean = true;
  //mobileVerified: boolean = false;
  editEmailInputfield: boolean = false;
  editphoneNumberInputfield: boolean = false;
  showEmailInputfield: boolean = true;
  showPhoneNumberInputfield: boolean=true;
  //showMailingAddress: boolean = true;
  //editMailingAddress: boolean = false;
  showHintquestionInputfield: boolean = true;
  editHintquestionInputfield: boolean = false;
  //showAddphoneNumber: boolean;
  //addphoneNumber: boolean = false;
  //addphoneNumberFlag = "0";

  //emailiconcolor: string;
  //mobileIconColor: string;

  //emailIconName: string;
  //  mobileIconName: string;

  //phoneno: string = "";
  //email: string = "";
  //settings: string;
  //userName: string;
  //userDOB: string;
  //mandatedCommType: string = null;

  emailForm: FormGroup;
  phonenumberForm: FormGroup;
  addPhoneNumberForm: FormGroup;
  mailingAddressForm: FormGroup;
  hintAnswerForm: FormGroup;

  states: any
  addressData: any;
  stateOptions: any;
  securityQuestions: any;
  //phoneNumberType: any;
  profileData: any = {};
  //loadingMaskHandler: any;
  //alerts: Array<any>;
  passwordType: string = 'password';
  passwordText: string = 'Show';
  hintQuestion: string = "";
  hintQuestionEditable: string = "";
  hintanswer: string="";
  hintanswerEditable: string="";
  hintanswerEditableBackup: string="";
  cards: Array<CardConfig>;
  showUserProfileDrupal: boolean = true;
  isPhoneNumberAvailable: boolean = false;
  addphoneNumberInputfield: boolean = false;
  isAddPhoneNumberBtnVisible: boolean = false;
  //hideEditPhoneNumberSectionIfEmpty : boolean = true;
  userState:any=null;
  isAVUser:boolean = false;
  regType:string="EMAIL";
  hintQuestionsSelectOptions = {
    title: 'Hint Question',
    subTitle: ''
  };
  stateSelectOptions = {
    title: 'State',
    subTitle: ''
  };
  phoneNumberTypeSelectOptions = {
    title: 'Phone Number Type',
    subTitle: ''
  };
  popover:any; 

  public updatePasswordForm = this.fb.group({
    userpwd: ["", Validators.compose([Validators.required, null])],
    password: ["", Validators.compose([Validators.required, ValidationProvider.passwordValidator])]

  });

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private userContext: UserContextProvider,
    private loadingMask: LoadingMaskProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public mySettingsService: MySettingsService,
    public popoverCtrl: PopoverController) {

    window['SettingsRef'] = {
      component: this
    };
    this.stateOptions = ConstantsService.SATES;
    this.securityQuestions = ConstantsService.SECURITY_QUESTIONS_OPTIONS;
    //this.phoneNumberType = ConstantsService.PHONE_NUMBER_TYPES;
    this.userName = this.authService.getMemberName();

    if (!this.memAuthData) {
      this.memAuthData = this.getMemberAuthInfo();
    } else {
      console.log("MySettingsPage:: populateMemberAuthInfo ");
      this.populateMemberAuthInfo();
      this.populateFromMemberProfile();
    }

    this.emailForm = fb.group({
      email: ['', Validators.compose([ValidationProvider.emailRequiredValidator, ValidationProvider.emailValidatorForProfile])]
    });
    this.phonenumberForm = fb.group({
      phoneNumber: ['', Validators.compose([ValidationProvider.requiredPhoneNumberValidator, ValidationProvider.mobileNumberValidatorForProfile, Validators.maxLength(10)])]
    });
    this.addPhoneNumberForm = fb.group({
      phoneNumber: ['', Validators.compose([ValidationProvider.requiredPhoneNumberValidator, ValidationProvider.mobileNumberValidatorForProfile, Validators.maxLength(10)])]
    });
    
    /*
    this.addphonenumberForm = fb.group({
      addphoneNumber: ['', Validators.compose([ValidationProvider.requiredMobileNumberValidator, ValidationProvider.mobileNumberValidator, Validators.maxLength(10)])]
    });
    */
    this.hintAnswerForm = fb.group({
      hintquation: [''],
      hintanswer: ['', Validators.compose([ValidationProvider.requiredHintAnswer, ValidationProvider.hintAnswerValidatorForProfile, Validators.maxLength(30),Validators.minLength(3)])]
    });

    this.mailingAddressForm = fb.group({
      address1: ['', Validators.compose([ValidationProvider.requiredMailingAddress, Validators.maxLength(30), ValidationProvider.mailingAddressValidator])],
      address2: ['',],
      city: ['', Validators.compose([ValidationProvider.requiredCity, ValidationProvider.cityValidator])],
      state: ['', Validators.compose([ValidationProvider.requiredHintAnswer])],
      zip: ['', Validators.compose([ValidationProvider.requiredZipcode, Validators.minLength(5), Validators.maxLength(5), ValidationProvider.zipcodeValidator])]
    });

  }

  ionViewDidLoad() {
    //this.msgColor = 'appcolor';
    this.settings = "";
    this.showNameAndDOB = (this.userContext.getLoginState() == LoginState.Registered) ? false : true;
    if (!this.showNameAndDOB) {
      this.disablePreference = true;
      this.settings = "profileSettings";
    } else {
      let redirectToPreference = this.navParams.get('redirectToPreference');     
      if (redirectToPreference != "undefined" && redirectToPreference) {
        this.settings = "preferenceSettings";
        let marketingErr = this.navParams.get('marketingErr');
        if (marketingErr) {
          let errCode = this.navParams.get('resultCode');
          if (errCode == null) {
            this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPREFERENCE_SERVER_ERROR);
          } else if (errCode === "-10") {
            this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_UPDATEPREFERENCE_SERVER_ERROR);
          } else if (errCode === "-11" || errCode === "-12") {
            this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR);
          } else {
            this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR);
          }
        }

      } else {
        this.settings = "profileSettings";
        this.addAnalytics('Settings.ProfileSettings');
      }
    }
    this.updateCommChannelVerificationUI();
    
    let bannerMessagesToShow = this.navParams.get('bannerMessages');
    if(bannerMessagesToShow != null){
      this.showBanner(bannerMessagesToShow,this.navParams.get('bannerType'),false);
    }
  }

  ionViewWillEnter() {
    if (!this.userContext.getUserProfileDrupalData() && window["UserProfileCards"] && window["UserProfileCards"].component) {
      window["UserProfileCards"].component.loadData();
    }
  }
  
  ionViewDidLeave(){
    if(this.popover != null){
      this.popover.dismiss();
    }
  }

  ionViewDidEnter() {
    this.resetAllEditableFieldsInProfileTab();
  }

  ngOnInit() {
    this.getCommChannelstatus();
    this.cards = this.getUserProfileCards();
    this.loginResponse = this.authService.loginResponse;
    const numberRegEx = new RegExp('^[0-9]{10}'); 
    this.regType = numberRegEx.test(this.authService.useridin) ? 'MOBILE' : 'EMAIL';
  }

  swiped($event) {

    if (this.disablePreference) {
      console.log("disable to swipe in user registered state.");
      return;
    }
    if ($event.direction == 4) {
      this.settings = "profileSettings";
      this.addAnalytics('Settings.ProfileSettings');
    }
    else if ($event.direction == 2) {
      this.addPreferencesAnalytics('Settings.PreferenceSettings');
      this.settings = "preferenceSettings";
    }
    else {
      if (this.settings === "profileSettings") {
        this.addPreferencesAnalytics('Settings.PreferenceSettings');
        this.settings = "preferenceSettings";
      } else {
        this.addAnalytics('Settings.ProfileSettings');
        this.settings = "profileSettings";
      }
    }
  }

  addAnalytics(screenName) {
    let etarget = screenName;
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  uploadLogs() {
    console.log("Uploading logs.");
    this.loadingMaskHandler = this.loadingMask.showLoadingMask("Uploading logs. Please wait.");
    scxmlHandler.uploadLogs();
  }

  /*
  showSecurityPinPage(event) {
    console.log("ShowSecurityPinPage start..... check if security is disbled" + this.disableSecurityPage);
    if (!this.disableSecurityPage) {
      this.navCtrl.push(MySecurityPage, { "securitypinchked": this.securitypinchked, "securitypin": this.securitypin });
    }
  }
  */

  /*
  uploadComplete() {
    this.loadingMask.hideLoadingMask(this.loadingMaskHandler);
    let alert = this.alertCtrl.create({
      title: 'Logs uploaded successfully.',
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }
  */

  /*
  cancelSettings() {
    console.log("Cancel button is pressed.");
    this.viewCtrl.dismiss();
  }
 
  toggleCurPwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.curPwdCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

  toggleNewPwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.newPwdCaption = input.type === 'password' ? 'Show' : 'Hide';
  }
  */

  updateMandatoryCommPreferences(ele: any) {
    this.alerts = [];
    this.authService.preferenceParams = null;
    if (ele != this.previousMandatedCommType) {
      let params: Array<any> = [];
      params.push({ "memkeyname": "MAND_OPTIN_TEXT", "memkeyvalue": ((this.mandatedCommType == "txtMsgMandatedComm") ? "YES" : "NO") });
      params.push({ "memkeyname": "MAND_OPTIN_EMAIL", "memkeyvalue": ((this.mandatedCommType == "emailMandatedComm") ? "YES" : "NO") });
      this.previousMandatedCommType = this.mandatedCommType;
      let mandatoryPreferenceVal = (this.mandatedCommType == "emailMandatedComm") ? "email" : "text";
      let etarget = "PreferenceSettings.Update";
      let edataobj = { "context": "action", "data": { "App.mandatedPreference": mandatoryPreferenceVal } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      this.updateCommChnlStatus(params, "updateMandatoryCommunicationPreference", null);
      return true;
    }
  }

 /* updateMarketingCommPreferences(ele: any) {
    this.alerts = [];
    let params: Array<any> = [];
    let backUpValues: Array<any> = [];
    // if (ele && ele.currentTarget && ele.currentTarget.id) {
      if(ele.id){
      // if (ele.currentTarget.id == "emailMarketingChkBox") {
      if (ele.id == "emailMarketingChkBox") {
        params.push(
          {"memKeyName":"EmailOptInStatus","memKeyValue":"false"},
          {"memKeyName":"EmailOptInSource","memKeyValue":"WEB"},
          {"memKeyName":"MobileOptInStatus","memKeyValue":"false"},
          {"memKeyName":"MobileOptInSource","memKeyValue":"WEB"}
        // { "memKeyName": "EmailOptInStatus", "memKeyValue": String(this.emailMarketingFlag) === "true" ? "true" : "false" }
        // ,{"memKeyName":"EmailOptInSource","memKeyValue":"APP"},
        // {"memKeyName":"MobileOptInStatus","memKeyValue":String(this.txtMsgMarketingFlag) === "true" ? "true" : "false" },
        // {"memKeyName":"MobileOptInSource","memKeyValue":"APP"}
      );
      } else {
        params.push({ "memkeyname": "MobileOptInStatus", "memkeyvalue": String(this.txtMsgMarketingFlag) === "true" ? "true" : "false" });
      }
    }
    backUpValues.push({ "memkeyname": "MobileOptInSource", "memkeyvalue": String(this.txtMsgMarketingFlag) === "true" ? "true" : "false" });
    backUpValues.push({ "memkeyname": "EmailOptInSource", "memkeyvalue": String(this.emailMarketingFlag) === "true" ? "true" : "false" });

    this.authService.preferenceParams = backUpValues;

    let etarget = "PreferenceSettings.Update";
    let marketingPreferenceVal = "";
    marketingPreferenceVal = String(this.emailMarketingFlag) === "true" ? 'email' : "";
    marketingPreferenceVal += String(this.txtMsgMarketingFlag) === "true" ? (marketingPreferenceVal.length > 0 ? '/text' : 'text') : "";
    marketingPreferenceVal += marketingPreferenceVal === "" ? "none" : "";
    let edataobj = { "context": "action", "data": { "App.marketingPreference": marketingPreferenceVal } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

    // if (ele.currentTarget.id == "emailMarketingChkBox" && !this.emailVerified && String(this.emailMarketingFlag) === "true") {
      if (ele.id == "emailMarketingChkBox" && !this.emailVerified && String(this.emailMarketingFlag) === "true") {
      this.authService.isPreferenceVerified = false;
      this.updateMemberEmailAddress(this.email);
      // this.updateMemberEmailAddress("appmed01@yopmail.com");
    // } else if (ele.currentTarget.id == "textMsgMarketingChkBox" && !this.mobileVerified && String(this.txtMsgMarketingFlag) === "true") {
    } else if (ele.id == "textMsgMarketingChkBox" && !this.mobileVerified && String(this.txtMsgMarketingFlag) === "true") {
      this.authService.isPreferenceVerified = false;
      this.updateMemberMobileNumber(this.phoneno);
    } else {

      this.updateCommChnlStatus(params, "updateMarketingCommunicationPreference", null);
    }
    this.saveBtnDisable = true;
    return true;
   
  }*/

  updateMarketingCommPreferences(ele: any)   
  { 	
  
    this.alerts = [];
  	let params:Array<any> = [];
    let backUpValues:Array<any>=[];
   
    if(ele && ele.currentTarget && ele.currentTarget.id){
      if(ele.currentTarget.id == "emailMarketingChkBox"){
        params.push({"memkeyname": "PROMO_OPTIN_EMAIL", "memkeyvalue":  String(this.emailMarketingFlag)==="true"?"YES":"NO"});   
      }else{
        params.push({"memkeyname": "PROMO_OPTIN_TEXT", "memkeyvalue": String(this.txtMsgMarketingFlag)==="true"?"YES":"NO" });
      }
    }
    backUpValues.push({"memkeyname": "PROMO_OPTIN_TEXT", "memkeyvalue": String(this.txtMsgMarketingFlag)==="true"?"YES":"NO" });
    backUpValues.push({"memkeyname": "PROMO_OPTIN_EMAIL", "memkeyvalue":  String(this.emailMarketingFlag)==="true"?"YES":"NO"});

    this.authService.preferenceParams = backUpValues;

      let etarget = "PreferenceSettings.Update";
      let marketingPreferenceVal = "";
      marketingPreferenceVal = String(this.emailMarketingFlag)==="true" ? 'email' : "";
      marketingPreferenceVal +=  String(this.txtMsgMarketingFlag)==="true" ? (marketingPreferenceVal.length > 0 ? '/text':'text'): "";
      marketingPreferenceVal +=  marketingPreferenceVal === "" ? "none" : "";
      let edataobj = {"context":"action", "data":{"App.marketingPreference": marketingPreferenceVal}};
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK+etarget, edataobj);

    /*if(ele.currentTarget.id == "emailMarketingChkBox" && !this.emailVerified && String(this.emailMarketingFlag) === "true"){
        this.authService.isPreferenceVerified = false;
        this.updateMemberEmailAddress(this.email);
    }else if(ele.currentTarget.id == "textMsgMarketingChkBox" && !this.mobileVerified && String(this.txtMsgMarketingFlag)==="true"){
        this.authService.isPreferenceVerified = false;
        this.updateMemberMobileNumber(this.phoneno);
    }else{*/
      
      this.updateCommChnlStatus(params, "updateMarketingCommunicationPreference", null);
    //}     
    return true;

  }

  showAlertMessage(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: [{
        text: 'Ok',
        handler: data => {

        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  /*
  promptMobileNumber(event) {

    event.preventDefault();
    this.authService.preferenceParams = null;
    this.alerts = [];
    if (this.isChangeAllowed()) {
      if (!this.tappedOnEmailPrompt) {
        this.tappedOnEmailPrompt = true;
        window.setTimeout(() => {
          this.mobilePrompt = this.alertCtrl.create({
            title: 'Mobile Number',
            message: "Enter your 10-digit mobile number",
            cssClass: 'alertCustomCss',
            inputs: [
              {
                name: 'phoneNo',
                placeholder: 'ie. 1234567890',
                type: "tel",
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  if (this.toastinstance) {
                    this.toastinstance.dismiss();
                  }
                  console.log('Cancel clicked Mobile Number ' + data.phoneNo);
                }
              },
              {
                text: 'Save',
                handler: data => {
                  return this.updateMemberMobileNumber(data.phoneNo);
                }
              }
            ]
          });
          this.mobilePrompt.present({
            keyboardClose: false
          })
            .then(() => {
              this.tappedOnEmailPrompt = false;
            });
          this.authService.setAlert(this.mobilePrompt);
        }, 100);
      }
    }
  }
  */

  /*
  promptEmail(event) {

    event.preventDefault();
    this.authService.preferenceParams = null;
    this.alerts = [];
    if (this.isChangeAllowed()) {
      if (!this.tappedOnEmailPrompt) {
        this.tappedOnEmailPrompt = true;
        window.setTimeout(() => {
          this.emailPrompt = this.alertCtrl.create({
            title: 'Email Address',
            message: "Enter your email address below",
            cssClass: 'alertCustomCss',
            inputs: [
              {
                name: 'EmailAdd',
                placeholder: 'ie. name@address.com',
                type: 'email',
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  if (this.toastinstance) {
                    this.toastinstance.dismiss();
                  }

                  console.log('Cancel clicked Email Address ' + data.emailAdd);
                }
              },
              {
                text: 'Save',
                handler: data => {
                  return this.updateMemberEmailAddress(data.EmailAdd);
                }
              }
            ]
          });

          this.emailPrompt.present({
            keyboardClose: false
          }).then(() => {
            this.tappedOnEmailPrompt = false;
          });
          this.authService.setAlert(this.emailPrompt);
        }, 100);
      }
    }
  }
  */

  showPreferences(event: any) {
    this.alerts = [];
    if (event.value == "preferenceSettings") {
      this.resetAllEditableFieldsInProfileTab();
      this.addPreferencesAnalytics('Settings.PreferenceSettings');
    } else if (event.value == "profileSettings") {
      this.addAnalytics('Settings.ProfileSettings');
    }
  }

  populateMemberAuthInfo() {

    if (this.memAuthData) {
      //let validator: any = ValidationProvider.mobileNumberValidator({ value: this.memAuthData.userID.toString() });
      let validator: any = ValidationProvider.mobileNumberValidator({ value: this.userName.toString() });
      let isValidPhone: boolean = true;

      if (validator != null && validator.invalidMobile) {
        isValidPhone = false;
      }
      this.userDOB = (!this.userDOB) ? this.memAuthData.dob : this.userDOB;
    }
  }

  populateFromMemberProfile() {
    if (this.memAuthData) {
      this.profileData.phoneNumber = this.memAuthData["phoneNumber"];
      this.profileData.email=this.memAuthData["emailAddress"];
      //this.profileData.selectedType = this.phoneNumberType[0].label;
      this.profileData.hintquation = this.memAuthData["hintQuestion"];
      this.profileData.hintanswer = this.memAuthData["hintAnswer"];
      this.profileData.address1 = this.memAuthData["address1"];
      this.profileData.address2 = this.memAuthData["address2"];
      this.profileData.city = this.memAuthData["city"];
      this.profileData.state = this.memAuthData["state"];
      this.profileData.zip = this.memAuthData["zip"];
      this.userState = this.memAuthData["userState"];
      this.isAVUser = (this.userState == ConstantsService.ACTIVE_AUTHENTICATED_USER);

      this.email=this.profileData.email;
      this.emailEditable=this.profileData.email;
      this.phoneno=this.profileData.phoneNumber;
      this.phonenoEditable=this.profileData.phoneNumber;
      this.userDOB = this.memAuthData["dob"];
      //this.userDOB = this.formatDate(this.memAuthData["dob"]);
      this.hintQuestion = this.profileData.hintquation;
      this.hintQuestionEditable = this.profileData.hintquation;
      this.hintanswer = this.hintAnswerMask(this.profileData.hintanswer);
      this.hintanswerEditable = this.profileData.hintanswer;
      this.hintanswerEditableBackup = this.profileData.hintanswer;
      console.log(this.profileData);

    }
  }

  // not used any more
  populateFromMemberProfile_old() {
    console.log("populateFromMemberProfile start");
    console.log(this.memProfileData);
    if (this.memProfileData) {
      console.log("Initializing the data start..");
      let src: string = this.memProfileData.source;
      console.log("Source value = " + src);
      console.log("Phone value = " + this.memProfileData[src + "_phoneno"]);
      if (this.memProfileData[src + "_phoneno"]) {
        this.phoneno = this.memProfileData[src + "_phoneno"];
        this.profileData.phoneNumber = this.phoneno;
      }
      console.log("Email value = " + this.memProfileData[src + "_email"]);
      console.log("Email value = " + this.memProfileData.usr_email);
      if (this.memProfileData[src + "_email"]) {
        this.email = this.memProfileData[src + "_email"];
        this.profileData.email = this.email;
      }

      //not used
      if (this.memProfileData[src + "_securitypin"]) {
        this.securitypin = this.memProfileData[src + "_securitypin"];
      }

      //not used
      if (this.memProfileData[src + "_securitypinchked"]) {
        this.securitypinchked = this.memProfileData[src + "_securitypinchked"];
      }

      console.log("DOB value = " + this.memProfileData[src + "_dob"]);
      if (this.memProfileData[src + "_dob"]) {
        this.userDOB = this.memProfileData[src + "_dob"];
      }

      // below code may put in recursive method invocations.
      /*if (!this.userDOB) {
        if (!this.authService.memAuthData) {
          this.getMemberAuthInfo();
        } else {
          this.memAuthData = this.authService.memAuthData;
          this.populateMemberAuthInfo();
        }
      }*/
      this.hintanswer = this.hintAnswerMask(this.profileData.hintanswer);

    }
  }

  //currently, method not used.
  //but logic is correct
  populateFromMemberPreferences() {
    if (this.memPreferenceData) {
      let source: string = this.memPreferenceData.source;
      this.mrkcomemail = this.memPreferenceData[source + "_mrkcomemail"];

      this.emailMarketingFlag = (this.memPreferenceData[source + "_emlnotifpromochked"] == true) ? true : false;
      this.txtMsgMarketingFlag = (this.memPreferenceData[source + "_mrkcomemlchked"] == true) ? true : false;

      if (this.memPreferenceData[source + "_MAND_OPTIN_TEXT"] == true) {
        this.mandatedCommType = "txtMsgMandatedComm";
      }
      else if (this.memPreferenceData[source + "_MAND_OPTIN_EMAIL"] == true) {
        this.mandatedCommType = "emailMandatedComm";
      }
      this.previousMandatedCommType = this.mandatedCommType;

    }
  }

  getMemberAuthInfo() {

    setTimeout(() => {

      let memberAuthInfoURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getMemProfileEndPoint");
      this.memAuthData = null;
      this.mySettingsService.getMemberProfileAndMemberAuthInfoRequest(memberAuthInfoURL)
        .subscribe(response => {
          if (response) {
            //let res = this.authService.handleDecryptedResponse(response);
            //this.memAuthData = res.ROWSET.ROWS;
            this.memAuthData = response;
          }
          if(this.memAuthData.phoneNumber == ""){
              this.isPhoneNumberAvailable = false;
              this.isAddPhoneNumberBtnVisible = true;
              this.showPhoneNumberInputfield=false;
          }else{
            this.isPhoneNumberAvailable = true;
            this.isAddPhoneNumberBtnVisible = false;            
            this.showPhoneNumberInputfield=true;
          }
          this.populateMemberAuthInfo();
          this.populateFromMemberProfile();
        },
          err => {
            console.log("Error while getting Member Auth Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_ALERTS_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.memAuthData = null;
            this.populateMemberAuthInfo();
            this.populateFromMemberProfile();
            this.authService.addAnalyticsAPIEvent(err.displaymessage, memberAuthInfoURL, err.result);
          }
        );
    }, 500);
  }

  // not invoked
  /*
  getMemberProfile() {

    setTimeout(() => {

      let memberProfileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getmemprofileEndPoint");

      this.memProfileData = null;

      this.mySettingsService.getMemberProfileAndMemberAuthInfoRequest(memberProfileURL)
        .subscribe(response => {
          console.log('Response getMemberProfile:', response);
          if (response) {
            this.memProfileData = response.ROWSET.ROWS;
          }
          this.populateFromMemberProfile();
        },
          err => {
            console.log("Error while getting Member profile info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PROFILEINFO_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.memProfileData = null;
            this.authService.addAnalyticsAPIEvent(err.displaymessage, memberProfileURL, err.result);
          }
        );
    }, 500);
  }
  */

  updateMemberMobileNumber(updatedPhoneNo) {

    let validator: any = ValidationProvider.mobileNumberValidator({ value: String(updatedPhoneNo).trim() });

    if (validator != null) {
      if (validator.invalidMobile == true) {
        this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_PHONENUM);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_PHONENUM);
        //this.mobilePrompt.dismiss();
        return false;
      }
    }
    else {
      if (updatedPhoneNo == "") {
        return false;
      }
      else if (updatedPhoneNo != "") {
        if (this.toastinstance) {
          this.toastinstance.dismiss();
        }
        this.updateMemberProfile(String(updatedPhoneNo).trim(), "updateMemberMobileNumber","");
      }

    }

  }

  // use it for updating email
  updateMemberEmailAddress(emailAddress) {

    let validator: any = this.emailValidator(emailAddress);

    if (emailAddress == "") {
      return false;
    }

    if (validator != null && validator.invalidEmail) {
      // this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_EMAIL);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_EMAIL);
      //this.emailPrompt.dismiss();
      return false;
    }
    if (this.toastinstance) {
      this.toastinstance.dismiss();
    }
    this.updateMemberProfile(emailAddress, "updateMemberEmailAddress","");
  }

  /*
  updateMemberPassword(event, formData) {
    this.alerts = [];
    this.authService.preferenceParams = null;
    if (!formData.valid) {

      Object.keys(this.updatePasswordForm.controls).forEach(field => {
        const control = this.updatePasswordForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onExistingPasswordBlur = true;
      this.onPasswordBlur = true;
      return;
    }
    this.updatePassword(this.updatePasswordForm.value.password, this.updatePasswordForm.value.userpwd, "updateMemberPassword", null);

    let etarget = 'ProfileSettings.Update';
    let edataobj = { "context": "action" };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
  }
  */

  updateMemberProfileInfo(fromWhere: string, value: any) {
    if (fromWhere == "updateMemberMobileNumber") {
      this.phoneno = value;
    } else if (fromWhere == "updateMemberEmailAddress") {
      this.email = value;
    } else if (fromWhere == "updateMemberPassword") {
      this.updatePasswordForm.reset();
    }
  }

  updateMemberProfileUsingNewApi(value: any, value2: any, fromWhere: string) {

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin
      };

      if (fromWhere == "updateMemberMobileNumber" || fromWhere == "addMemberMobileNumber") {
        request["phoneNumber"] = value;
        request["phoneType"] = "MOBILE";
      }

      if (fromWhere == "updateMemberEmailAddress") {
        request["emailAddress"] = value;
      }

      if (fromWhere == "updateMemberHintQuestion") {
        request["hintAnswer"]= this.hintAnswerForm.value.hintanswer,
        request["hintQuestion"]= this.hintAnswerForm.value.hintquation
      }

      let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("updatememprofileEndPoint");
      this.memPreferenceData = null;

      this.mySettingsService.updateMemberProfileData(updateMemberProileURL, request)
        .subscribe(response => {
          if (response && response.result == "0") {
            this.updateMemberProfileInfo(fromWhere, value);
            if (fromWhere == "updateMemberMobileNumber" || fromWhere == "addMemberMobileNumber") {
              this.verifiedlink("phone",value);              
              //this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings', type: "mobile_number", no_email: String(value).trim() });
              this.authService.addAnalyticsAPIEvent("Phone Number updated", updateMemberProileURL, "Phone Number updated");
            } else if (fromWhere == "updateMemberEmailAddress") {
              //this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings', type: "email_address", no_email: String(value) });
              this.verifiedlink("email",value);    
              this.authService.addAnalyticsAPIEvent("Email updated", updateMemberProileURL, "Email updated");
            }
            else if(fromWhere == "updateMemberHintQuestion"){
              //show update success message
              //this.showAlertMessage("", "Hint Questions and Password updated");
               
               this.getMemberAuthInfo();
               setTimeout(() => {
               this.showHintquestionInputfield = true;
               this.editHintquestionInputfield = false;
               })
              this.authService.addAnalyticsAPIEvent("Hint Questions and Password updated", updateMemberProileURL,"Hint Questions and Password updated");
            }
          } else {
            console.log('updateMemberProfile :: error =' + response.errormessage);
            let emsg = response.displaymessage;
            this.memPreferenceData = null;
            //this.revertPreferenceValues(fromWhere, value);
            this.errorBanner(emsg);
          }
        },
          err => {
            console.log("Error while updateMemberProfile Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPROFILE_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.memPreferenceData = null;
            //this.revertPreferenceValues(fromWhere, value);
            this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemberProileURL, err.result);
            this.errorBanner(errmsg);
          }
        );
    }, 500);
  }

  updateMemberProfile(value: any, fromWhere: string,tab: string) {

    setTimeout(() => {
      // request object format changed as per web 
      const request = {
        useridin: this.authService.useridin,
        email :  (fromWhere == "updateMemberEmailAddress") ? value : "",
        mobile:(fromWhere == "updateMemberMobileNumber") ? value:"",
        userIDToVerify:this.authService.useridin
      };

      // if (fromWhere == "updateMemberMobileNumber") {
      //   request["mobile"] = value
      // }

      // if (fromWhere == "updateMemberEmailAddress") {
      //   request["email"] = value
      // }

      let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("sendcommchlacccodeEndPoint");
      this.memPreferenceData = null;

      this.mySettingsService.getupdateMemberProfileRequest(updateMemberProileURL, request)

        .subscribe(response => {

          if (response && response.result == "0") {
            this.updateMemberProfileInfo(fromWhere, value);
            if (fromWhere == "updateMemberMobileNumber") {
              this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings', type: "mobile_number", no_email: String(value).trim() });
              if(tab == "preferences"){
              this.navCtrl.push(VerifyPasscodePage, { fromPage: 'preferenceSettings', type: "mobile_number", no_email: String(value).trim() });                
              }
            } else if (fromWhere == "updateMemberEmailAddress") {
              //this.verifiedlink("email");
              this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings', type: "email_address", no_email: String(value) });
              if(tab == "preferences"){
                this.navCtrl.push(VerifyPasscodePage, { fromPage: 'preferenceSettings', type: "email_address", no_email: String(value) });                
                }
            }
          } else {
            console.log('updateMemberProfile :: error =' + response.errormessage);
            let emsg = response.displaymessage;
            this.memPreferenceData = null;
            this.revertPreferenceValues(fromWhere, value);
            this.errorBanner(emsg);
          }
        },
          err => {
            console.log("Error while updateMemberProfile Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPROFILE_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.memPreferenceData = null;
            this.revertPreferenceValues(fromWhere, value);
            this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemberProileURL, err.result);
          }
        );
    }, 500);
  }

  /*
  updatePassword(newPassword: string, currentPassword: string, fromWhere: string, value: any) {

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin,
        currentpassword: currentPassword,
        newpassword: newPassword
      };

      let changePasswordURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("changePasswordEndPoint");

      this.memPreferenceData = null;

      this.mySettingsService.getupdatePasswordRequest(changePasswordURL, request)
        .subscribe(response => {
          if (response.result === "0") {
            this.populateMemberAuthInfo();
            this.updateMemberProfileInfo(fromWhere, value);
            this.showAlertMessage("", "Password updated.");
            this.showPasswordErrors = false;
            this.authService.addAnalyticsClientEvent("Password updated.");
            // delete current user's touch data as user has changed
            scxmlHandler.touchId.deleteTouchBiodataKey();
          } else {
            this.updatePasswordForm.reset();
          }
        },
          err => {
            console.log("Error while updatePassword Info -" + JSON.stringify(err));
            this.memPreferenceData = null;
            this.authService.addAnalyticsAPIEvent(err.displaymessage, changePasswordURL, err.result);
          }
        );
    }, 500);
  } */

  revertPreferenceValues(fromWhere: string, value: any) {
    if (fromWhere == "updateMarketingCommunicationPreference") {
      this.txtMsgMarketingFlag = this.authService.previousTxtMsgMarketingFlag;
      this.emailMarketingFlag = this.authService.previousEmailMarketingFlag;
    }
    else if (fromWhere == "updateMandatoryCommunicationPreference") {
      this.mandatedCommType = this.previousMandatedCommType;
    }
    else if (fromWhere == "updateTextMessagePreference") {
      // not used
      this.txtmsgchked = !this.txtmsgchked;
    }
    else if (fromWhere == "updateMemberMobileNumber") {
      this.txtMsgMarketingFlag = this.authService.previousTxtMsgMarketingFlag;
    }
    else if (fromWhere == "updateMemberEmailAddress") {
      this.emailMarketingFlag = this.authService.previousEmailMarketingFlag;
    }
  }

  updateCommChnlStatus(jsonArrayProfile: Array<any>, fromWhere: string, value: any) {
    let mask = this.authService.showLoadingMask();

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin

      };

      if (jsonArrayProfile != null) {
         request["memobject"] = jsonArrayProfile;
        //request["preferences"] = jsonArrayProfile;
      }

      this.authService.updateCommChannelStatus(request, mask).subscribe(response => {
        if (response.result == "0") {
          //this.populateMemberAuthInfo();
          if (fromWhere == "updateMandatoryCommunicationPreference") {
            this.previousMandatedCommType = this.mandatedCommType;
          } else if (fromWhere == "updateMarketingCommunicationPreference") {
            this.authService.previousTxtMsgMarketingFlag = this.txtMsgMarketingFlag;
            this.authService.previousEmailMarketingFlag = this.emailMarketingFlag;
          }
        } else {
          let errmsg = response.displaymessage;
          if (response.result === "-10") {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_UPDATEPREFERENCE_SERVER_ERROR;
          } else if (response.result === "-11" || response.result === "-12") {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR;
          } else {
            errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SYSTEM_ERROR;
          }
          this.errorBanner(errmsg);
          this.revertPreferenceValues(fromWhere, value);
          this.authService.addAnalyticsAPIEvent(errmsg);
        }
      },
        err => {
          console.log("Error while updateMemberPreferences Info -" + JSON.stringify(err));
          this.saveBtnFlag = 0;
          let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPREFERENCE_SERVER_ERROR;
          if (err.displaymessage) {
            errmsg = err.displaymessage;
          }
          this.errorBanner(errmsg);
          this.memPreferenceData = null;
          this.revertPreferenceValues(fromWhere, value);
          this.authService.addAnalyticsAPIEvent(err.displaymessage, this.authService.configProvider.getProperty("updatemempreferenceEndPoint"), err.result);
        }
      );
    }, 500);
  }

  emailValidator(value: string) {

    value = value.trim();
    if (value && value.match('^([a-zA-Z0-9_\\.\\-])+([+_a-zA-Z0-9])+\\@(([a-zA-Z0-9\\-])+\\.)([a-zA-Z0-9]{2,3})([a-zA-Z0-9.]{3})?$')) {
      // removed validation as per Bob -Mobile App User Registration - Invalid Email error
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }
  showErrorToast(name: string) {
    this.toastinstance = this.toastCtrl.create({
      message: name,
      duration: 30000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'Close',
      dismissOnPageChange: true
    });

    this.toastinstance.onDidDismiss(() => {
    });

    this.toastinstance.present();
  }
  verifiedlink(item,_val) {
    this.alerts = null;
    this.authService.preferenceParams = null;
    if (item == "phone") {

      //this.verificationLink = String(this.phoneno);
      this.phone_emai = "mobile_number";
      this.updateMemberProfile(_val, "updateMemberMobileNumber","");
    } else if (item == "email") {

      //this.verificationLink = this.email;
      this.phone_emai = "email_address";
      this.updateMemberProfile(_val, "updateMemberEmailAddress","");
    }
  }

  learnMore() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(LearnMoreComponent, { pageName: 'MarketingCommLearnMore',fromPage: 'preferenceSettings' });
  }

  getCommChannelstatus() {
    setTimeout(() => {

      let getcommstatusURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getcommstatusEndPoint");

      this.mySettingsService.getMemberProfileAndMemberAuthInfoRequest(getcommstatusURL)
        .subscribe(response => {
          if (response) {
            console.log(response)
            let res = this.authService.handleDecryptedResponse(response);
            let resobj = new CommChannelstatusModel();
            resobj= res.ROWSET.ROWS;
            this.memEmailAddress = resobj.MemEmailAddress;
            this.memMobileNumber = resobj.MemMobileNumber;
            this.isVerifiedEmail = resobj.IsVerifiedEmail == "YES" ? true : false;
            this.isVerifiedMobile = resobj.IsVerifiedMobile == "YES" ? true : false;
            this.registrationStatus = resobj.RegistrationStatus;
            // if(this.registrationStatus != "AV"){
            if(this.authService.currentUserScopename != "AUTHENTICATED-AND-VERIFIED"){              
              this.disablePreference = true;
            }
            //marketing comm
            if (resobj.PromoOptinEmail != undefined && resobj.PromoOptinEmail != null && resobj.PromoOptinEmail == "YES") {
              this.emailMarketingFlag = true;
            }
            else {
              this.emailMarketingFlag = false;
            }
            this.authService.previousEmailMarketingFlag = this.emailMarketingFlag;
            if (resobj.PromoOptinText != undefined && resobj.PromoOptinText != null && resobj.PromoOptinText == "YES") {
              this.txtMsgMarketingFlag = true;
            }
            else {
              this.txtMsgMarketingFlag = false;
            }
            this.authService.previousTxtMsgMarketingFlag = this.txtMsgMarketingFlag;

            // mandated comm value
            if (resobj.MandOptinEmail != undefined) {
              if (resobj.MandOptinEmail == "YES") {
                this.mandatedCommType = "emailMandatedComm";

              } else {
                this.mandatedCommType = "txtMsgMandatedComm";
              }
            } else if (resobj.MandOptinText != undefined) {
              if (resobj.MandOptinText == "YES") {
                this.mandatedCommType = "txtMsgMandatedComm";

              } else {
                this.mandatedCommType = "emailMandatedComm";
              }
            }

            this.previousMandatedCommType = this.mandatedCommType;

            // email
            if (resobj.IsVerifiedEmail == "YES") {
              this.emailVerified = true;
              this.editEmail = false;
            }
            else {
              this.emailVerified = false;
              this.editEmail = true;
            }

            //mobile
            if (resobj.IsVerifiedMobile == "YES") {
              this.mobileVerified = true;
              this.editPhoneNo = false;
            } else {
              this.mobileVerified = false
              this.editPhoneNo = true;
            }

            this.email = resobj.MemEmailAddress;
            this.phoneno = resobj.MemMobileNumber;

            this.updateCommChannelVerificationUI();
            if (this.navParams.get('redirectToPreference') != "undefined" && this.navParams.get('redirectToPreference')) {
              this.addPreferencesAnalytics('Settings.PreferenceSettings');
            }

          }

        },
          err => {
            console.log("Error while getting Member preferences Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PREFERENCE_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.errorBanner(errmsg);
            this.authService.addAnalyticsAPIEvent(err.displaymessage, getcommstatusURL, err.result);
          }
        );
    }, 500);
  }

  updateCommChannelVerificationUI() {
    if (this.emailVerified === true) {
      this.emailiconcolor = 'green';
      this.emailIconName = 'checkmark-circle';
    } else {
      this.emailiconcolor = 'red';
      this.emailIconName = 'ios-alert-outline';
      this.editEmail = true;
    }

    if (this.mobileVerified === true) {
      this.mobileIconColor = 'green';
      this.mobileIconName = 'checkmark-circle';
    } else {
      this.mobileIconColor = 'red';
      this.mobileIconName = 'ios-alert-outline';
      this.editPhoneNo = true;
    }
  }

  isChangeAllowed() {
    if (this.authService.currentUserScopename == ConstantsService.REGISTERED_AND_VERIFIED || this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
      return true;
    } else {
      return false;
    }
  }

  errorBanner(message){
    this.showBanner(message,"error",true);
  }
  showBanner(message,alertType,isHideCloseButton) {
    let alertObj = {
      messageID: "",
      AlertLongTxt: message,
      AlertShortTxt: "",
      RowNum: ""
    }
    let a: AlertModel = this.prepareAlertModal(alertObj,alertType,isHideCloseButton);
    if (a != null) {
      this.userContext.setAlerts([a]);
    }
    this.alerts = this.userContext.getAlerts();
  }

  isAlertShowing() {
    let alts: Array<any> = this.userContext.getAlerts();
    return alts.length == 0;
  }
  prepareAlertModal(alert: any,alertType: string, isHideCloseButton:boolean) {
    if (alert) {
      let a: AlertModel = new AlertModel();
      a.id = alert.messageID;
      a.message = alert.AlertLongTxt;
      a.alertFromServer = true;
      a.showAlert = true;
      a.title = alert.AlertShortTxt;
      a.type = alertType;
      a.RowNum = alert.RowNum;
      a.hideCloseButton = isHideCloseButton;
      return a;
    }
    return null;
  }

  addPreferencesAnalytics(screenName) {
    let etarget = screenName;
    let mandatoryPreferenceVal = "none";
    if (this.mandatedCommType != null) {
      mandatoryPreferenceVal = (this.mandatedCommType == "emailMandatedComm") ? "mail" : "text";
    }
    let edataobj = { "context": "state", "data": { "App.emailMarketingPreference": this.emailMarketingFlag, "App.textMarketingPreference": this.txtMsgMarketingFlag, "App.mandatoryPreference": mandatoryPreferenceVal } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  showErrorOnBlur() {
    this.showPasswordErrors = true;
  }
  preferenceEmail(){
    // navigating to access code page
    this.updateMemberProfile(this.memEmailAddress,'updateMemberEmailAddress',"preferences");    
  }
  editEmailPreference(){
    let ptab: HTMLElement = document.getElementById("profileTab") as HTMLElement;
    ptab.click();
    this.emailEdit();
  }  
  editMobilePreference(){ 
    let ptab: HTMLElement = document.getElementById("profileTab") as HTMLElement;
    ptab.click();
    this.editPhoneNumber();
  }
  preferenceMobile(){
    //navigating to access code page    
    this.updateMemberProfile(this.memMobileNumber,'updateMemberMobileNumber',"preferences");    
  }

 /* preferenceSave(){ 
    if(this.authService.previousTxtMsgMarketingFlag != this.txtMsgMarketingFlag){
      this.updateMarketingCommPreferences(document.getElementById("textMsgMarketingChkBox"));
    }
    if(this.authService.previousEmailMarketingFlag != this.emailMarketingFlag){
      this.updateMarketingCommPreferences(document.getElementById("emailMarketingChkBox"));
    }   
  }
*/
  enableEmailSaveBtn(){ 
     if(this.saveBtnFlag%2 == 0){
      this.saveBtnDisable = false;    
    } else{
      this.saveBtnDisable = true;      
    }   
    this.saveBtnFlag++;
  }
  mobileSaveBtnEnable(){
    if(this.saveBtnFlag%2 == 0){
      this.saveBtnDisable = false;    
    } else{
      this.saveBtnDisable = true;      
    }   
    this.saveBtnFlag++;
  } 

  updateEmail() {
    let emailAddress= this.emailForm.value.email;
    let validator: any = this.emailValidator(emailAddress);
    if (emailAddress == "") {
      return false;
    }
    if (validator != null && validator.invalidEmail) {
      this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_EMAIL);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_EMAIL);
      return false;
    }
    if (this.toastinstance) {
      this.toastinstance.dismiss();
    }
    //this.updateMemberProfileUsingNewApi(emailAddress,null,"updateMemberEmailAddress");
    this.verifiedlink('email',emailAddress)
  }

  updateHintQuestion() {
    if (!this.hintAnswerForm.valid) {
      this.hintAnswerBlur = true;
      // if (this.hintAnswerForm.value.hintanswer == "" || this.hintAnswerForm.value.hintanswer == undefined) {
      //   this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      // }
      return;
    }
    else{
      this.updateMemberProfileUsingNewApi(this.hintAnswerForm.value.hintquation,this.hintAnswerForm.value.hintanswer, "updateMemberHintQuestion");
    }
  }

  resetAllEditableFieldsInProfileTab(){
    this.emailEditable=this.email;
    this.phonenoEditable=this.phoneno;
    this.hintQuestionEditable=this.hintQuestion;
    this.hintanswerEditable=this.hintanswerEditableBackup;
    this.addPhonenoEditable = "";
    this.hideEditableForms();
  }

  cancelEditEmail(){
    this.emailEditable=this.email;
    this.hideEditableForms();
  }
  cancelEditPhoneNumber(){
    this.phonenoEditable=this.phoneno;
    this.hideEditableForms();
  }
  cancelAddPhoneNumber(){
    this.addPhonenoEditable = "";
    this.hideEditableForms();
  }
  cancelEditHintQuestion(){
    this.hintQuestionEditable=this.hintQuestion;
    this.hintanswerEditable=this.hintanswerEditableBackup;
    this.hideShowPassword();
    this.hideEditableForms();
  }

  hideEditableForms(){
    this.showEmailInputfield = true;
    this.editEmailInputfield = false;

    this.showHintquestionInputfield = true;
    this.editHintquestionInputfield = false;
    
    this.resetPhoneNumberSections();

    /*
    if(this.memAuthData){  
      this.memAuthData.phoneNumber == "" ?   this.showPhoneNumberInputfield = false: this.showPhoneNumberInputfield = true;
    }else{
      this.showPhoneNumberInputfield = true;
    }
    this.editphoneNumberInputfield = false;

    if(this.phonenoEditable == "" ||  this.phonenoEditable == undefined){      
      this.addphoneNumberInputfield = false;
      this.isAddPhoneNumberBtnVisible = true;
    }
    */
    
  }

  cancelButton() {
    this.navCtrl.push(MySettingsPage);
  }

  addPhoneNumber(){
    let addedPhoneNumber = this.addPhoneNumberForm.value.phoneNumber;
    let validator: any = ValidationProvider.mobileNumberValidator({ value: String(addedPhoneNumber).trim() });

    if (validator != null) {
      if (validator.invalidMobile == true) {
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_PHONENUM);
        return false;
      }
    }
    else {
      this.updateMemberProfileUsingNewApi(this.addPhoneNumberForm.value.phoneNumber,null,"addMemberMobileNumber");
    }
  }

  updatePhoneNumber() {
    let updatedPhoneNo = this.phonenumberForm.value.phoneNumber;
    let validator: any = ValidationProvider.mobileNumberValidator({ value: String(updatedPhoneNo).trim() });

    if (validator != null) {
      if (validator.invalidMobile == true) {
        // this.errorBanner(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_PHONENUM);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYSETTINGS_INVALID_PHONENUM);
        return false;
      }
    }
    else {
      //this.updateMemberProfileUsingNewApi(this.phonenumberForm.value.phoneNumber,null,"updateMemberMobileNumber");
      this.verifiedlink('phone',updatedPhoneNo);
    }
    
  }

/*
  addphoneNumberSave() {
    if (!this.addphonenumberForm.valid) {
      this.onAddPhoneNumberBlur = true;
      if (this.addphonenumberForm.value.addphoneNumber == "" || this.addphonenumberForm.value.addphoneNumber == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }
  }
*/

  /*
  mailingAddressEdit() {
    // EDI MAILING ADDRESS
    this.editMailingAddress = true;
    this.mailingAddressHide = false;

    // EMAIL
    this.emailHide = true
    this.editEmailInputfield = false;

    // HINT QUESTION
    this.hintquestionHide = true;
    this.editHintquestion = false;
    if (this.addphoneNumberFlag == "1") {
      // ADD PHONE NUMBER
      this.addphoneNumber = false;
      this.showAddphoneNumber = true
    } else {
      //PHONE NUMBER
      this.phoneNumberHide = true;
      this.editphoneNumberInputfield = false
    }

  }*/

  emailEdit() {

    // EMAIL
    this.showEmailInputfield = false
    this.editEmailInputfield = true;

    // HINT QUESTION
    this.showHintquestionInputfield = true;
    this.editHintquestionInputfield = false;

    //PHONE NUMBER
    this.resetPhoneNumberSections();
    
  }

  editPhoneNumber() {

    // EMAIL
    this.showEmailInputfield = true
    this.editEmailInputfield = false;

    // HINT QUESTION
    this.showHintquestionInputfield = true;
    this.editHintquestionInputfield = false;

    //PHONE NUMBER
    this.showPhoneNumberInputfield = false;
    this.editphoneNumberInputfield = true
  }

  showAddPhoneNumberDiv(){
    // EMAIL
    this.showEmailInputfield = true
    this.editEmailInputfield = false;

    // HINT QUESTION
    this.showHintquestionInputfield = true;
    this.editHintquestionInputfield = false;
    
    // ADD PHONE NUMBER
    this.isAddPhoneNumberBtnVisible = false;  
    this.onAddMobileNumberBlur=false;
    this.addphoneNumberInputfield = true;
  }

  editHintQuestion() {

    // EMAIL
    this.showEmailInputfield = true
    this.editEmailInputfield = false;

    this.resetPhoneNumberSections();
    
      // HINT QUESTION
    this.showHintquestionInputfield = false;
    setTimeout(() => {
      this.editHintquestionInputfield = true;
    },50);
    
  }

  resetPhoneNumberSections(){
    if(this.isPhoneNumberAvailable == true){
      this.isAddPhoneNumberBtnVisible = false;
      this.addphoneNumberInputfield = false;
      this.showPhoneNumberInputfield = true;
      this.editphoneNumberInputfield = false;
    }
    else{
      this.isAddPhoneNumberBtnVisible = true;
      this.addphoneNumberInputfield = false;
      this.showPhoneNumberInputfield = false;
      this.editphoneNumberInputfield = false;
    }
  }

  /*
  addPhoneNumber() {
    // PHONE NUMBER
    this.addphoneNumber = true;
    this.showAddphoneNumber = false

    // MAILING ADDRESS
    //this.editMailingAddress = false;
    this.showMailingAddress = true;

    // EMAIL
    this.showEmail = true
    this.editEmailInputfield = false;

    // HINT QUESTION
    this.showHintquestion = true;
    this.editHintquestion = false;
  }
  */
 
  updateYourPassword() {
    this.navCtrl.push(ChangePassword, { fromPage: 'profileSettings' })
  }
  addYourRaceEthnicityLanguage() {

  }
  updateYourNotoficationPreferences() {

  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordText = this.passwordText === 'Hide' ? 'Show' : 'Hide';
  }
  mailingAddressSave() {
    if (!this.mailingAddressForm.valid) {
      this.onAddress1Blur = true;
      this.onCityBlur = true;
      this.onStateBlur = true;
      this.onZipCodeBlur = true;
      if (this.mailingAddressForm.value.address1 == "" || this.hintAnswerForm.value.address1 == undefined ||
        this.mailingAddressForm.value.city == "" || this.hintAnswerForm.value.city == undefined ||
        this.mailingAddressForm.value.state == "" || this.hintAnswerForm.value.state == undefined ||
        this.mailingAddressForm.value.zip == "" || this.hintAnswerForm.value.zip == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

  }

  replaceBetween(start, end, what, str) {
    what = what.repeat(end - start);
    return str.substring(0, start) + what + str.substring(end);
  };
  
  hintAnswerMask(number) {
    var phone_email = "";
    var i = number.length;
    phone_email = this.replaceBetween(0, i, '*', number);

    return phone_email
  }

  formatDate(str) {
    var d1 = new Date(str);
    var formattedDateStr= (d1.getMonth()+1)+"/"+d1.getDate()+"/"+d1.getFullYear();
    return formattedDateStr;
  }

  /*
  presentInfoPopover(myEvent) {
    this.popover = this.popoverCtrl.create(SettingsInfoPopOver,{showBackdrop:false});
    this.popover.present({
      ev: myEvent
    });
  }
  */

  getUserProfileCards(): CardConfig[]{
    let cardConfig: CardConfig[];
    cardConfig = JSON.parse(evaSecureStorage.getItem("UserProfileCards"));
    return cardConfig;
  }

  gotoContactUsPage() {
    this.navCtrl.push(ContactUsPage);
  }
  
}
