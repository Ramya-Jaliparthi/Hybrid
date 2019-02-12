import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoadingMaskProvider } from '../../providers/loading-mask/loading-mask';
import { ValidationProvider } from '../../providers/validation/ValidationService';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AlertModel } from '../../models/alert/alert.model';
import { MySettingsService } from './my-settings-service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage implements OnInit {
  onAddress1Blur: boolean = false;
  onCityBlur: boolean = false;
  onStateBlur: boolean = false;
  onZipCodeBlur: boolean = false;
  onPasswordBlur: boolean = false;
  onEmailBlur: boolean = false;
  onMobileNumberBlur: boolean = false;
  onAddPhoneNumberBlur: boolean = false;
  hintAnswerBlur: boolean = false;
  txtMsgMarketingFlag: boolean = false;
  emailMarketingFlag: boolean = false;
  editPhoneNo: boolean;
  editEmail: boolean;
  emailVerified: boolean = true;
  mobileVerified: boolean = false;
  editEmailInputfield: boolean = false;
  editphoneNumberInputfield: boolean = false;
  emailHide: boolean = true;
  phoneNumberHide: boolean;
  mailingAddressHide: boolean = true;
  editMailingAddress: boolean = false;
  hintquestionHide: boolean = true;
  editHintquestion: boolean = false;
  showAddphoneNumber: boolean;
  addphoneNumber: boolean = false;
  addphoneNumberFlag = "0";

  emailiconcolor: string;
  mobileIconColor: string;

  emailIconName: string;
  mobileIconName: string;

  phoneno: string = "";
  email: string = "";
  settings: string;
  userName: string;
  userDOB: string;
  mandatedCommType: string = null;

  emailForm: FormGroup;
  phonenumberForm: FormGroup;
  addphonenumberForm: FormGroup;
  hintAnswerForm: FormGroup;
  mailingAddressForm: FormGroup;

  states: any
  addressData: any;
  stateOptions: any;
  securityQuestions: any;
  phoneNumberType: any;
  profileData: any;
  loadingMaskHandler: any;
  alerts: Array<any>;
  passwordType: string = 'password';
  passwordText: string = 'Hide';
  hintanswer: any;

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

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthenticationService,
    private userContext: UserContextProvider,
    private loadingMask: LoadingMaskProvider,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public mySettingsService: MySettingsService) {

    window['SettingsRef'] = {
      component: this
    };
    this.stateOptions = ConstantsService.SATES;
    this.securityQuestions = ConstantsService.SECURITY_QUESTIONS_OPTIONS;
    this.phoneNumberType = ConstantsService.PHONE_NUMBER_TYPES;
    //this.userName = this.authService.getMemberName();
    //this.userID=this.authService.useridin;

    /* if (!this.memAuthData) {
      this.memAuthData = this.getMemberAuthInfo();
    } else {
      console.log("MySettingsPage:: populateMemberAuthInfo ");
      this.populateMemberAuthInfo();
    }
 */
    this.updateCommChannelVerificationUI()
    this.emailForm = formBuilder.group({
      email: ['', Validators.compose([ValidationProvider.emailRequiredValidator, ValidationProvider.emailValidator])]
    });
    this.phonenumberForm = formBuilder.group({
      phoneNumber: ['', Validators.compose([ValidationProvider.requiredMobileNumberValidator, ValidationProvider.mobileNumberValidator, Validators.maxLength(10)])],
      phonenumbertype: [''],
    });
    this.addphonenumberForm = formBuilder.group({
      addphoneNumber: ['', Validators.compose([ValidationProvider.requiredMobileNumberValidator, ValidationProvider.mobileNumberValidator, Validators.maxLength(10)])]
    });

    this.hintAnswerForm = formBuilder.group({
      hintquation: [''],
      hintanswer: ['', Validators.compose([ValidationProvider.requiredHintAnswer, ValidationProvider.hintAnswerValidator, Validators.maxLength(30)])]
    });

    this.mailingAddressForm = formBuilder.group({
      address1: ['', Validators.compose([ValidationProvider.requiredMailingAddress, Validators.maxLength(30), ValidationProvider.mailingAddressValidator])],
      address2: ['',],
      city: ['', Validators.compose([ValidationProvider.requiredCity, ValidationProvider.cityValidator])],
      state: ['', Validators.compose([ValidationProvider.requiredHintAnswer])],
      zip: ['', Validators.compose([ValidationProvider.requiredZipcode, Validators.minLength(5), Validators.maxLength(5), ValidationProvider.zipcodeValidator])]

    });

    this.profileData = {};
    this.userName = "John Sample"
    this.email = this.profileData.email = "abc@gmail.com";
    this.phoneno = this.profileData.phoneNumber = "7329105164"
    //this.profileData.selectedType = ""
    this.profileData.selectedType = this.phoneNumberType[0].label;
    this.profileData.addPhoneNumber = "";
    this.profileData.hintquation = "What is the name of your hight school";
    this.profileData.hintanswer = "My blue ";
    this.profileData.address1 = "123 Main Street";
    this.profileData.address2 = "Apt. 321";
    this.profileData.city = "Anytown";
    this.profileData.state = "MA";
    this.profileData.zip = "12345";

    function replaceBetween(start, end, what, str) {
      what = what.repeat(end - start);
      return str.substring(0, start) + what + str.substring(end);
    };
    function hintAnswerMask(number) {
      var phone_email = "";
      var i = number.length;

      phone_email = replaceBetween(0, i, '*', number);

      return phone_email
    }

    this.hintanswer = hintAnswerMask(this.profileData.hintanswer);
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
    // this.updateCommChannelVerificationUI()


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

  uploadComplete() {
    this.loadingMask.hideLoadingMask(this.loadingMaskHandler);
    let alert = this.alertCtrl.create({
      title: 'Logs uploaded successfully.',
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
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

  emailValidator(value: string) {
    value = value.trim();
    if (value && value.match('^([a-zA-Z0-9_\\.\\-])+([+_a-zA-Z0-9])+\\@(([a-zA-Z0-9\\-])+\\.)([a-zA-Z0-9]{2,3})([a-zA-Z0-9.]{3})?$')) {
      // removed validation as per Bob -Mobile App User Registration - Invalid Email error
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }

  verifiedlink(item) {
    this.alerts = null;
    this.authService.preferenceParams = null;
    if (item == "phone") {
      //  this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings_new', type: "mobile_number", no_email: "" });
    } else if (item == "email") {
      // this.navCtrl.push(VerifyPasscodePage, { fromPage: 'profileSettings_new', type: "email_address", no_email: "" });

    }
  }

  updateCommChannelVerificationUI() {
    if (this.emailVerified === true) {
      this.emailiconcolor = 'green';
      this.emailIconName = 'ios-checkmark-circle-outline';
    } else {
      this.emailiconcolor = 'appcolor';
      this.emailIconName = 'ios-alert-outline';
      this.editEmail = true;
    }

    if (this.mobileVerified === true) {
      this.mobileIconColor = 'green';
      this.mobileIconName = 'ios-checkmark-circle-outline';
    } else {
      this.mobileIconColor = 'appcolor';
      this.mobileIconName = 'ios-alert-outline';
      this.editPhoneNo = true;
    }
    if (this.addphoneNumberFlag === '0') {
      this.showAddphoneNumber = false;
      this.phoneNumberHide = true;
    } else {
      this.showAddphoneNumber = true;
      this.phoneNumberHide = false;
    }
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

  addPreferencesAnalytics(screenName) {
    let etarget = screenName;
    let mandatoryPreferenceVal = "none";
    if (this.mandatedCommType != null) {
      mandatoryPreferenceVal = (this.mandatedCommType == "emailMandatedComm") ? "mail" : "text";
    }
    let edataobj = { "context": "state", "data": { "App.emailMarketingPreference": this.emailMarketingFlag, "App.textMarketingPreference": this.txtMsgMarketingFlag, "App.mandatoryPreference": mandatoryPreferenceVal } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }



  emailSave() {

    if (!this.emailForm.valid) {

      this.onEmailBlur = true;

      if (this.emailForm.value.email == "" ||
        this.emailForm.value.email == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);

      }
      return;
    }
    let email = this.profileData.email;
    console.log("data.email : " + email);

  }

  cancelButton() {
    this.navCtrl.push(MyProfilePage);
  }

  phoneNumberSave() {
    if (!this.phonenumberForm.valid) {
      this.onMobileNumberBlur = true;
      if (this.phonenumberForm.value.phoneNumber == "" || this.phonenumberForm.value.phoneNumber == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

  }
  addphoneNumberSave() {
    if (!this.addphonenumberForm.valid) {
      this.onAddPhoneNumberBlur = true;
      if (this.addphonenumberForm.value.addphoneNumber == "" || this.addphonenumberForm.value.addphoneNumber == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

  }

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


  }
  emailEdit() {

    // EDI MAILING ADDRESS
    this.editMailingAddress = false;
    this.mailingAddressHide = true;

    // EMAIL
    this.emailHide = false
    this.editEmailInputfield = true;

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

  }

  phoneNumberEdit() {

    // EDI MAILING ADDRESS
    this.editMailingAddress = false;
    this.mailingAddressHide = true;

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
      this.phoneNumberHide = false;
      this.editphoneNumberInputfield = true
    }
  }
  hintQuestion() {
    // EDI MAILING ADDRESS
    this.editMailingAddress = false;
    this.mailingAddressHide = true;

    // EMAIL
    this.emailHide = true
    this.editEmailInputfield = false;


    if (this.addphoneNumberFlag == "1") {
      // ADD PHONE NUMBER
      this.addphoneNumber = false;
      this.showAddphoneNumber = true
    } else {
      //PHONE NUMBER
      this.phoneNumberHide = true;
      this.editphoneNumberInputfield = false
    }
    // HINT QUESTION
    this.hintquestionHide = false;
    this.editHintquestion = true;

  }
  addPhoneNumber() {
    // ADD PHONE NUMBER
    this.addphoneNumber = true;
    this.showAddphoneNumber = false

    // EDI MAILING ADDRESS
    this.editMailingAddress = false;
    this.mailingAddressHide = true;

    // EMAIL
    this.emailHide = true
    this.editEmailInputfield = false;

    // HINT QUESTION
    this.hintquestionHide = true;
    this.editHintquestion = false;

  }
  hintAnswerSave() {
    if (!this.hintAnswerForm.valid) {
      this.hintAnswerBlur = true;
      if (this.hintAnswerForm.value.hintanswer == "" || this.hintAnswerForm.value.hintanswer == undefined) {
        this.showAlertMessage(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

  }
  updateYourPassword() {

    // this.navCtrl.push(UpdatePassword, { fromPage: 'profileSettings' })
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

}
