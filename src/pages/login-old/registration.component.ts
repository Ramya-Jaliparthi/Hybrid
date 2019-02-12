import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams, Content } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { ConstantsService } from '../../providers/constants/constants.service';
import { RegisterRequest } from '../../models/login/registerRequest.model';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';

import { AuthenticationService } from '../../providers/login/authentication.service';
import { TermsAndCondition } from '../../pages/about/termsAndConditions';
import { PrivacyPolicy } from '../../pages/about/privacyPolicy';
import { LoginComponent } from '../../pages/login/login.component';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';
import { EncryptedRequest } from '../../models/login/encryptedRequest.model';
import { ConfigProvider } from '../../providers/config/config';
import { NgZone } from '@angular/core';
import { LearnMorePage } from "../about/learnMore";
import { LearnMoreComponent } from '../../components/learn-more/learn-more';
import { RegistrationComponentService } from './registration.service';


declare var scxmlHandler;
declare var evaSecureStorage: any;
@Component({
  selector: 'registration',
  templateUrl: 'registration.component.html'

})
export class RegistrationComponent {
  @ViewChild(Content) content: Content;
  buttonCaption: string = "Show";
  registerType: string = "EMAIL";
  onEmailBlur: boolean = false;
  onMobileBlur: boolean = false;
  onPasswordBlur: boolean = false;
  disableSubmitButton: boolean = false;
  alerts: Array<AlertModel> = null;
  mobileMask: Array<any>;
  wishToReceiveHealthInfo: string = ConstantsService.REGISTRATION_WISHTO_RECEIVE_HEALTHINFO;
  iHaveReadAndAgree: string = ConstantsService.REGISTRATION_IHAVE_READ_AND_AGREE;
  passwordFormat: string = ConstantsService.REGISTRATION_PSWD_FORMAT;
  @ViewChild('continue') continue;
  @ViewChild('alertLinkId') alertElementRef: any;

  public registerForm = this.fb.group({
    emailAddress: ["", Validators.compose([Validators.required, ValidationProvider.emailValidator])],
    mobileNumber: ["", Validators.compose([Validators.required, ValidationProvider.mobileNumberValidator])],
    password: ["", Validators.compose([Validators.required, ValidationProvider.passwordValidator])],
    enableInfoAlert: [false, null],
    termsAndConditions: ["", Validators.compose([ValidationProvider.termsAndConditionCheck])]
  });
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    private authService: AuthenticationService,
    private authenticationStateProvider: AuthenticationStateProvider,
    private renderer: Renderer,
    private elRef: ElementRef,
    private alertService: AlertService,
    public configProvider: ConfigProvider,
    private ref: NgZone,
    private registrationComponentService: RegistrationComponentService
  ) {
    this.registerForm.removeControl("mobileNumber");
    this.mobileMask = ValidationProvider.mobileMask;
    ConstantsService.REGISTER_TYPE = "EMAIL";
    this.registerType = "EMAIL";
  }

  ionViewDidLoad() {

    let etarget = 'Register';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }
  resetForm() {
    this.registerForm.reset();
    this.registerForm.controls['enableInfoAlert'].setValue(false);
  }
  enableEmailRegistration() {

    this.registerForm.addControl("emailAddress", new FormControl('', [Validators.required, ValidationProvider.emailValidator]));
    this.registerForm.removeControl("mobileNumber");
    this.ref.run(() => {
      this.registerType = "EMAIL";
      ConstantsService.REGISTER_TYPE = "EMAIL";
    });


    this.resetForm();

  }
  enableMobileRegistration() {

    this.registerForm.addControl("mobileNumber", new FormControl('', [Validators.required, ValidationProvider.mobileNumberValidator]));
    this.registerForm.removeControl("emailAddress");


    this.ref.run(() => {
      this.registerType = "MOBILE";
      ConstantsService.REGISTER_TYPE = "MOBILE";
    });

    this.resetForm();


  }
  goToSignInPage() {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => {
      this.navCtrl.push(LoginComponent);
    }, 400);

  }
  showPrivacyStatement() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(PrivacyPolicy);
  }
  goToTermsOfService() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(TermsAndCondition);
  }
  gotoLearnMorePage() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(LearnMorePage);
  }
  registerUser(event, formData) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (!formData.valid) {

      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onEmailBlur = true;
      this.onMobileBlur = true;
      this.onPasswordBlur = true;

      if (this.registerForm.value.termsAndConditions == false || this.registerForm.value.termsAndConditions == "") {
        this.authService.addAnalyticsClientEvent(ConstantsService.TERMS_AND_CONDITIONS);
      }


      if (this.registerType == 'MOBILE') {
        if (this.registerForm.value.mobileNumber == "" || this.registerForm.value.password == "" ||
          this.registerForm.value.mobileNumber == undefined || this.registerForm.value.password == undefined) {
          this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
          this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        }
      } else {
        if (this.registerForm.value.emailAddress == "" || this.registerForm.value.password == "" ||
          this.registerForm.value.emailAddress == undefined || this.registerForm.value.password == undefined) {
          this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
          this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        }
      }
      return;
    }


    let registerRequest = new RegisterRequest();

    registerRequest.regtypein = this.registerType;

    if (this.registerType == 'MOBILE') {
      let mobile_split = this.registerForm.value.mobileNumber.split("-");
      registerRequest.useridin = mobile_split[0] + mobile_split[1] + mobile_split[2];
    } else {
      registerRequest.useridin = this.registerForm.value.emailAddress;
    }
    registerRequest.passwordin = this.registerForm.value.password;
    registerRequest.receiveinfo = this.registerForm.value.enableInfoAlert ? "yes" : "no";
    registerRequest.tandcagreed = "true";

    if (this.authService.token == undefined || this.authService.token == null) {
      this.authService.makeTokenRequest(true).subscribe(token => {
        this.authService.token = token;
        let encryptionService = new EncryptedRequest();
        encryptionService.generateKeys(this.authService.token);
        this.makeRegisterRequest(registerRequest);
      },
        err => {
          this.showAlert('ERROR', ConstantsService.ERROR_MESSAGES.REGISTRATION_REGERROR_INVALID_SEC_TOKEN);
          this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.REGISTRATION_REGERROR_INVALID_SEC_TOKEN, this.configProvider.getProperty("tokenEndPoint"), err.result);
          return;
        }
      );
    }
    else
      this.makeRegisterRequest(registerRequest);


  }

  makeRegisterRequest(registerRequest: RegisterRequest) {

    if (this.authService.token) {
      this.registerRequest(registerRequest);

    }
  }

  registerRequest(registerRequest: RegisterRequest) {
    setTimeout(() => {
      let registerUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("authEndPoint") + 'registermem';
      console.log('register request url:' + registerUrl);

      this.registrationComponentService.registerRequest(registerRequest, registerUrl)
        .subscribe(response => {
          if (response.result === "0") {
            ConstantsService.IS_DASHBOARD = false;
            scxmlHandler.setTestfairyUserId(registerRequest.useridin);
            this.authenticationStateProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, registerRequest);
            let comAlertFlagKey: string = registerRequest.useridin + "_receiveinfo";
            evaSecureStorage.setItem(comAlertFlagKey, registerRequest.receiveinfo);
            evaSecureStorage.setItem("registerType", this.registerType);
          } else {
            // show error
            this.authService.addAnalyticsAPIEvent(response.displaymessage, registerUrl, response.result);
            this.showAlert('ERROR', response.displaymessage);
            this.handleError(response.displayMessage);
          }
        },
        err => {

          if (err.result == -1) {
            let msg: string = "An account already exists with this Mobile Number. ";
            let msg_html: string = "<span class=\"alertSpanLinkCls\" #alertLinkId>Log in</span>";
            let msg_try: string = " or try again with a new Mobile Number.";
            let full_msg: string;
            if (this.registerType == 'MOBILE') {
              full_msg = msg + msg_html + msg_try;
            }
            else {
              msg = msg.replace(/Mobile Number/gi, "email address");
              msg_try = msg_try.replace(/Mobile Number/gi, "email address");
              full_msg = (msg + msg_html + msg_try);
            }
            this.alerts = [this.alertService.prepareAlertModal("Error", full_msg, "error")];
            this.content.scrollToTop();

            this.authService.addAnalyticsAPIEvent(msg + msg_try, registerUrl, err.result);

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
                this.showAlert('', 'Please retry');
                this.authService.addAnalyticsAPIEvent('Please retry', registerUrl, '401 Unauthorized');

              } else
                this.showAlert('', errfault.faultstring);
              this.authService.addAnalyticsAPIEvent(errfault.faultstring, registerUrl, '401 Unauthorized');
            }
          } else {
            console.log("Unhandled Error in http request: ", err);//.json());
            this.authService.handleAPIResponseError(err, err.displaymessage, registerUrl);
          }

        }
        );
    }, 100);

  }

  togglePwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }
  handleError(response) {
    //handle error
    console.log('handleError::' + response);
    this.disableSubmitButton = false;
  }
  showAlert(ptitle, psubtitle) {
    this.disableSubmitButton = false;
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  setPasswordBlur() {
    setTimeout(() => { this.onPasswordBlur = true }, 500);
  }

  setEmailBlur() {
    setTimeout(() => { this.onEmailBlur = true }, 500);

  }
  learnMore() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(LearnMoreComponent, { pageName: 'MarketingCommLearnMore' });
  }
}
