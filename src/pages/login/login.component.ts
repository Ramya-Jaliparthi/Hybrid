import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistrationComponent } from '../../pages/login/registration.component';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageProvider } from '../../providers/message/message';
import { AlertController } from 'ionic-angular';

import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { LoginRequest } from '../../models/login/loginRequest.model';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { ForgotUsername } from '../../pages/forgot-username/forgot-username';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ConfigProvider } from '../../providers/config/config';
import { ResetUserName } from '../../pages/login/resetUserName';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';
import { EncryptedRequest } from '../../models/login/encryptedRequest.model';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginService } from './login.service';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { LoginResponse } from '../../models/login/loginResponse.model';

declare var scxmlHandler;
declare var evaSecureStorage: any;
@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  host: { 'class': 'login-page-css' }

})

export class LoginComponent {

  useridin: string = null;
  access_token: string = null;
  loginForm: FormGroup;
  showInfoAlerSection: boolean = true;
  buttonCaption: string = "Show";
  onUserNameBlur: boolean = false;
  onPasswordBlur: boolean = false;

  isTouchIDUsed: string = "";
  isRemembermeEnabled: boolean = true;	// on by default
  userpwd: string;
  isUserAlertedOnTouchId: boolean = false;
  isUserIdFieldDisabled: boolean = false;
  touchIDAttemptFailureCount: number = 0;
  savedTouchUserId: string = null;
  isTouchIdEnrolledInApp: boolean = false;
  isTouchIdKeySaved: boolean = false;
  isTouchIdLockedOut: boolean = false;
  curLoginResponse: any = null;
  isRegisterNowEnabled: boolean = false;
  dectType:string = "";
  istouchNowEnabled: boolean = false;
  alerts: Array<AlertModel> = null;
  memPreferenceData: any;
  @ViewChild('pwdInput') pwdInput: any;
  @ViewChild('usernameInput') usernameInput: any;
  showUserNameInfoSection: boolean = false;

  createMyblueAccount: string = ConstantsService.LOGIN_CREATE_MYBLUE_ACCOUNT;
  checkEmailOrMobileno: string = ConstantsService.LOGIN_CHECK_EMAIL_OR_MOBILENO;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private config: ConfigProvider,
    public alertCtrl: AlertController,
    private messageProvider: MessageProvider,
    public ngzone: NgZone,
    private alertService: AlertService,
    private authenticationStateProvider: AuthenticationStateProvider,
    private authService: AuthenticationService,
    private userContext: UserContextProvider,
    private loginService: LoginService) {

    window['LoginComponentRef'] = {
      component: this
    };

    let savedUserid = null;
    let defaultRemeberMe = '';
    this.dectType = scxmlHandler.touchId.dectType;
    //console.log("============================>",this.dectType);
    if(this.dectType == "face"){
      this.dectType = "Face ID";      
    }else{
      this.dectType = "Touch ID";
      this.istouchNowEnabled = true;
    }
    this.loginService.biometricType = this.dectType;
    let changeUsername = this.navParams.get('changeUsername');
    if (changeUsername) {
      let isTouchIDEnabledStr = evaSecureStorage.getItem("isTouchIDEnabled");
      if (isTouchIDEnabledStr == "true") {
        this.alerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORMESSAGE, ConstantsService.ERROR_MESSAGES.LOGINPAGE_REMEMBER_REENABLE, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
        this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_RESET_REM_TOUCH, ConstantsService.ERROR_MESSAGES.LOGINPAGE_REENABLE, this.showChangeUserNameAlert, this);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_RESET_REM_TOUCH);
      } else {
        this.alerts = [this.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_REMEMBER_DISABLE, ConstantsService.ERROR_MESSAGES.LOGINPAGE_REENABLE, ConstantsService.ALERT_TYPE.NOTIFICATION)];
        this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_REMEMBER_RESET, ConstantsService.ERROR_MESSAGES.LOGINPAGE_REENABLE, this.showChangeUserNameAlert, this);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_REMEMBER_RESET);
      }
      this.alerts[0].showAlert = false;
      this.isTouchIDUsed = "";
      evaSecureStorage.setItem("isTouchIDEnabled", "");
      this.isRemembermeEnabled = false;
      evaSecureStorage.setItem("isRememberEnabled", "");
      evaSecureStorage.setItem("userid", "");

    } else {

      savedUserid = evaSecureStorage.getItem("userid");
      if (savedUserid == null || savedUserid == undefined || savedUserid.trim() != "") {
        defaultRemeberMe = 'true';
      }

      let name = navParams.get('userId');
      if (name != undefined) {
        savedUserid = name;
      }

      //if (navParams.get('getUserDetails') != undefined) {
     if(this.authService.getUserDetails){ 
        //this.showUserNameInfoSection = navParams.get('getUserDetails');
        this.showUserNameInfoSection = this.authService.getUserDetails;
        this.authService.getUserDetails = false;
        let etarget = 'ForgotUsername.RetrieveNotification';
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      }

      // make username field readonly if not empty. This can be changed on tap on username field
      if (savedUserid != null && savedUserid.trim() != "") {
        this.isUserIdFieldDisabled = true;

      }

      let isRememberEnabledStr = evaSecureStorage.getItem("isRememberEnabled");
      if (isRememberEnabledStr == "true") {
        this.isRemembermeEnabled = true;
      }

    }
    this.loginForm = this.fb.group({
      userName: [savedUserid, Validators.compose([ValidationProvider.requiredUsernameForLoginScreen])],
      password: ["", Validators.compose([ValidationProvider.requiredPasswordForLoginScreen])],
      rememberme: [defaultRemeberMe, null],
      biometric: [this.isTouchIDUsed, null]
    });
    let showLoginAlert = this.userContext.getShowLoginAlert();
    if (showLoginAlert) {
      this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_NEEDTOREREGISTER);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_NEEDTOREREGISTER);
    }
  }

  ionViewDidEnter() {
    let etarget = 'SignIn';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    if (document.getElementById('passwordErrorMsg'))
      document.getElementById('passwordErrorMsg').innerHTML = '';
    if (this.alerts)
      this.alerts[0].showAlert = false;

    if(this.isRemembermeEnabled == false || ((this.isRemembermeEnabled == true) && (this.loginForm.value.userName == null || this.loginForm.value.userName == ''))){
      this.isRegisterNowEnabled = true;
    }
  }

  //for test only.
  logout() {
    this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
  }

  ngOnInit() {
    let saveduser = evaSecureStorage.getItem("userid");
    let isTouchIDEnabledStr = evaSecureStorage.getItem("isTouchIDEnabled");
    if (isTouchIDEnabledStr == "true" && saveduser != null && saveduser.trim() != "") {
      this.isTouchIDUsed = "checked";
      document.getElementById('touchSectionContainer').style.display = 'block';
      let deeplinkkey = this.navParams.get('deeplinkkey');
      if (deeplinkkey) {
        setTimeout(() => {
          scxmlHandler.touchId.isTouchBiodataKeySaved();
        }, 500);
      } else {
        scxmlHandler.touchId.isTouchBiodataKeySaved();
      }
    } else {
      this.isTouchIDUsed = "";
      document.getElementById('touchSectionContainer').style.display = 'none';
    }
  }

  initiateTouchId() {
    let saveduser = evaSecureStorage.getItem("userid");
    if (saveduser != null && saveduser.trim() != "") {
      scxmlHandler.playSoundWithHapticFeedback();
      scxmlHandler.touchId.isTouchBiodataKeySaved();
    }
  }

  showChangeUserNameAlert() {
    this.alerts[0].showAlert = true;
  }
  submitLoginForm(event) {
    scxmlHandler.playSoundWithHapticFeedback();

    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(field => {
        console.log('field :: ' + field);
        const control = this.loginForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onUserNameBlur = true;
      this.onPasswordBlur = true;

      if (this.loginForm.value.userName == "" ||
        this.loginForm.value.password == "" ||
        this.loginForm.value.userName == undefined ||
        this.loginForm.value.password == undefined) {
        //this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
        this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
        this.authService.addAnalyticsClientEvent(ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
      }
      return;
    }

    this.authService.makeTokenRequest(true).subscribe(token => {

      this.authService.token = token;
      let encryptionService = new EncryptedRequest();
      encryptionService.generateKeys(this.authService.token);
      this.performLogin(this.loginForm.value.userName, this.loginForm.value.password);
    },
      err => {
        this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN);
        this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN, this.config.getProperty("tokenEndPoint"), err.result);
        return;
      }
    );
  }

  gotoRegistrationPage() {
    this.resetDeepLinks();
    this.userpwd = "";
    this.showUserNameInfoSection = false;
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(RegistrationComponent);
  }
  
  resetDeepLinks(){
    if(this.authService.getDeepLink() == "://messagecenter"){
      this.authService.setDeepLink("");
    }
  }

  performLogin(userId: string, password: string) {

    let loginrequest: LoginRequest = new LoginRequest();
    this.useridin = userId;
    loginrequest.useridin = userId;
    loginrequest.passwordin = password;

    if (this.authService.token) {
      this.makeLoginRequest(loginrequest, userId, password);
    } else {
      this.authService.makeTokenRequest(true).subscribe(token => {
        this.authService.token = token;
        let encryptionService = new EncryptedRequest();
        encryptionService.generateKeys(this.authService.token);

        this.makeLoginRequest(loginrequest, userId, password);
      },
        err => {
          this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN);
          this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_INVALIDSECURITYTOKEN, this.config.getProperty("tokenEndPoint"), err.result);
          return;
        }
      );
    }
  }

  makeLoginRequest(request: LoginRequest, userId: string, password: string) {

    this.curLoginResponse = null; //reset before every Login request

    setTimeout(() => {
      this.authService.useridin = request.useridin;

      this.loginService.loginRequest(request)

        .subscribe(res => {

          let response = new LoginResponse();
          response=res;
          //Check for remember me and update value
          if (this.loginForm.value.rememberme) {
            if (this.loginForm.value.biometric && scxmlHandler.touchId.isTouchBiodataFeatureSupported && !this.isTouchIdLockedOut) {
              evaSecureStorage.setItem("isTouchIDEnabled", "true");
              this.isTouchIDUsed = "checked";
              if ((userId != evaSecureStorage.getItem("userid")) || !this.isTouchIdKeySaved) {
                // save Touch ID data if form username is different than the saved value
                // if password has changed, this should be performed in change password form also

                // delete current user's touch data as user has changed

                scxmlHandler.touchId.deleteTouchBiodataKey();
                this.curLoginResponse = response;
                setTimeout(() => {
                  let touchdata = { "userId": userId, "password": password };
                  // let usrmask = userId.substring(0,4) + '****';

                  scxmlHandler.touchId.saveTouchBiodata(touchdata);

                  //this.showAlert("","Touch ID will be enabled on your next sign in");
                  evaSecureStorage.setItem("userid", userId);

                  // send message from touch ID saveFailed and saveSuccess callbacks
                  //this.authenticationStateProvider.sendMessage(response.scopename, response);      
                }, 100);

              } else {
                evaSecureStorage.setItem("userid", userId);
                this.authenticationStateProvider.sendMessage(response.scopename, response);
              }
            } else {
              evaSecureStorage.setItem("userid", userId);
              this.authenticationStateProvider.sendMessage(response.scopename, response);
            }
          }
          else {
            evaSecureStorage.setItem("userid", "");
            evaSecureStorage.setItem("isTouchIDEnabled", "");
            this.authenticationStateProvider.sendMessage(response.scopename, response);
          }

        }, err => {

          console.log('Error response from member login api ' + err);

          if (err.result == "-90301" || err.result == "-90300" ||  err.result == "-90305", err.result == "-90306" ) {
            let errorMessage = ConstantsService.ERROR_MESSAGES["MEMBERLOGIN"][err.result] ? ConstantsService.ERROR_MESSAGES["MEMBERLOGIN"][err.result] : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY;
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(errorMessage, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);
          } 
          else if (err.displaymessage) {
            let errorMessage = err.displaymessage ? err.displaymessage.replace("1-888-772-1722", "<a href='tel:8887721722'>1-888-772-1722</a>") : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY;
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
            this.authService.addAnalyticsAPIEvent(errorMessage, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);
          }
          else if (err.fault) {
            let errfault = err.fault;
            if (errfault.faultstring) {
              if (errfault.faultstring === 'Unexpected EOF at target') {
                this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER,
                  ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];

                this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);

              } else
                this.loginService.showAlert('', errfault.faultstring);

              this.authService.addAnalyticsAPIEvent(errfault.faultstring, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);

            }
          } else {
            console.log("Unhandled Error in http request: " + err);
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER,
              ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];

            this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORBODY, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);

          }
        }
        );
    }, 100);

  }

  validateLoginForm(c: FormControl) {

    return {
      noMagic: true
    }
  }

  handleError(rspmsg) {
    //handle error
    var errmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_SERVER_ERROR;
    if (rspmsg)
      errmsg = rspmsg;
    this.loginService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, errmsg);
    this.authService.addAnalyticsClientEvent(errmsg);

  }

  showTouchIdAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      //buttons: ['OK']
      buttons: [{
        text: 'Ok',
        handler: () => {
          // user has clicked the alert button
          // begin the alert's dismiss transition

          alert.dismiss().then(() => {
            this.sendMessageToAuthenticationStateProvider();
          });
          return false;

        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  showAlertWithCallback(ptitle, psubtitle, callBackHandler?, scopeParam?) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss().then(() => {
            if (callBackHandler) {
              callBackHandler.call(scopeParam);
            }
          });
          return false;
        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }
  gotoForgotUsername(event: any) {
    this.resetDeepLinks();
    this.userpwd = "";
    this.showUserNameInfoSection = false;
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(ForgotUsername);

  }
  gotoForgotPassword() {
    this.resetDeepLinks();
    this.userpwd = "";
    this.showUserNameInfoSection = false;
    scxmlHandler.playSoundWithHapticFeedback();
    let useNameVal=this.loginForm.value.userName;
    console.log("useNameId :"+useNameVal);
    this.navCtrl.push(ForgotPassword,{ userNameParameter :useNameVal});
  }

  closeAlert() {
    this.showInfoAlerSection = false;
  }
  togglePwdDisplay(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

  toggleRememberme() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.loginForm.get('rememberme').value) {
      // enable Touch ID also by default 
      this.isRemembermeEnabled = true;

      evaSecureStorage.setItem("isRememberEnabled", "true");
    } else {
      this.isRemembermeEnabled = false;
      evaSecureStorage.setItem("isRememberEnabled", "");

      // disable touch ID also - MMR-10
      document.getElementById('touchSectionContainer').style.display = 'none';
      this.isTouchIDUsed = "";
      this.loginForm.value.biometric = false;

    }
  }

  handleToggleAction() {

    if (this.loginForm.get('biometric').value)
      scxmlHandler.touchId.getSupportedBiometricsData();

    else {
      document.getElementById('touchSectionContainer').style.display = 'none';
      this.isTouchIDUsed = "";
      evaSecureStorage.setItem("isTouchIDEnabled", "");
      this.loginForm.value.biometric = false;
    }
  }

  toggleTouchId(touchElement) {
    scxmlHandler.playSoundWithHapticFeedback();

    if (scxmlHandler.touchId.isTouchBiodataFeatureSupported) {
      if (!this.isTouchIdLockedOut) {
        this.isTouchIDUsed = "checked";
        // show sign in using touch id link only if touchId was already enrolled in app
        if (this.isTouchIdEnrolledInApp && this.isTouchIdKeySaved)
          document.getElementById('touchSectionContainer').style.display = 'block';
        evaSecureStorage.setItem("isTouchIDEnabled", "true");

        // enable Remember Me also if not already - MMR-10
        if (!this.isRemembermeEnabled) {
          this.isRemembermeEnabled = true;

        }
        let dectBioType = this.dectType;        
        if(dectBioType.indexOf("Touch") != -1){
        this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHIDENABLE);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHIDENABLE);
        }else{
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_FACEIDENABLE);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_FACEIDENABLE);
        }
      } else {
        // touch ID is locked out
        if(this.istouchNowEnabled){
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_TEMP_DISABLE);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_TEMP_DISABLE);
        }else{
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_FACEID_TEMP_DISABLE);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_FACEID_TEMP_DISABLE);
        }
        let touchElement: any = document.getElementById('touchId');
        touchElement.checked = false;
        this.disableTouchID();
      }
    } else {
      let terrmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_NOTSUPPORTED;
      if (scxmlHandler.touchId.touchBiodataNotsupportedReason != "")
        terrmsg = scxmlHandler.touchId.touchBiodataNotsupportedReason;
      this.loginService.showAlert("", terrmsg);
      this.authService.addAnalyticsClientEvent(terrmsg);

      let touchElement: any = document.getElementById('touchId');
      touchElement.checked = false;
      this.disableTouchID();
    }
  }

  touchIdKeyData(kflag): void {
    if (kflag == "true") {
      this.isTouchIdKeySaved = true;
      if (this.loginForm.value.userName) {
        let usrmask = this.loginForm.value.userName.substring(0, 4) + '****';
        this.isTouchIdEnrolledInApp = true;
        scxmlHandler.touchId.readTouchBiodata(usrmask);
      } else {
        this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_UN_BEFORE_TOUCHID);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_UN_BEFORE_TOUCHID);
      }
    } else {
      this.isTouchIdKeySaved = false;
      this.disableTouchID();
      document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");

    }
  }

  readTouchIdSuccess(bdsts) {
    let userId = bdsts.userId;
    let pwd = bdsts.password;
    this.savedTouchUserId = userId;
    this.touchIDAttemptFailureCount = 0;
    this.isTouchIdLockedOut = false;
    // validate the username entered on form with the value obtained from touchdata
    if (this.loginForm.value.userName == userId) {
      this.userpwd = pwd;
      this.performLogin(userId, pwd);
    } else {

    }
  }

  readTouchidFailed(bderr) {
    console.log("touch id read failed. error=" + JSON.stringify(bderr));
    this.savedTouchUserId = null;

    // RK added 11dec to enable Save dialog after 
    this.isTouchIdKeySaved = false;

    if (bderr.errorMessage && bderr.errorMessage != 'USER_CANCELLED') {
      ;
      // MMR-12
      if (bderr.errorMessage == 'LOCKOUT') {
        setTimeout(() => {

          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_FINGERPRINTFAILED);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_FINGERPRINTFAILED);
          this.alerts = [this.prepareAlertModal("Error!", ConstantsService.ERROR_MESSAGES.LOGINPAGE_FINGERPRINTFAILED, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.disableTouchID();
          this.isTouchIdLockedOut = true;
          document.getElementById('touchSectionContainer').style.display = 'none';
          this.isTouchIDUsed = "";
          evaSecureStorage.setItem("isTouchIDEnabled", "");
        }, 300);
      }
      else if (bderr.errorMessage == 'USER_FALLBACK') {
        this.pwdInput.setFocus();
      }
      else if (bderr.errorMessage == 'KEY_PERMANENTLY_INVALIDATED') {
        setTimeout(() => {
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_CHANGE);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_CHANGE);
          this.disableTouchID();
          document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");
        }, 300);

      } else if (bderr.errorMessage == 'NOT_ENROLLED') {
        setTimeout(() => {
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_NO_SETUP);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_NO_SETUP);
          this.disableTouchID();
          document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");
        }, 300);
      } else if (bderr.errorMessage == 'AUTHENTICATION_FAILED') {
        setTimeout(() => {
          // to prevent from getting into LOCKOUT situation, disable touch ID here
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.alerts = [this.prepareAlertModal("Error!", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.disableTouchID();
          this.isTouchIdLockedOut = true;
          document.getElementById('touchSectionContainer').style.display = 'none';
          this.isTouchIDUsed = "";
          evaSecureStorage.setItem("isTouchIDEnabled", "");
        }, 300);
      } else {
        setTimeout(() => {
          this.loginService.showAlert("", bderr.errorDescription);
          this.authService.addAnalyticsClientEvent(bderr.errorDescription);
          this.disableTouchID();
        }, 300);

      }
    } else {
      // user canceled. do not count as retry
    }
  }

  launchChangeUsername(usernameInput) {
    if (this.isUserIdFieldDisabled && usernameInput.value.length > 0) {
      scxmlHandler.playSoundWithHapticFeedback();
      this.navCtrl.push(ResetUserName);
    }
  }

  saveTouchidFailed(bderr) {

    console.log("touch id save failed. error=" + JSON.stringify(bderr));
    if (bderr.errorMessage && bderr.errorMessage != 'USER_CANCELLED') {
      if (bderr.errorMessage == 'LOCKOUT') {
        setTimeout(() => {
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.alerts = [this.prepareAlertModal("Error!", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.disableTouchID();
          // disable touch ID for this user as Save failed - MMR-370
          evaSecureStorage.setItem("isTouchIDEnabled", "");
          document.getElementById('touchSectionContainer').style.display = 'none';
          this.isTouchIDUsed = "";

          if (this.curLoginResponse != null)
            this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);

        }, 300);
      }
      else if (bderr.errorMessage == 'KEY_PERMANENTLY_INVALIDATED') {
        setTimeout(() => {
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_CHANGE_DETECT);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_CHANGE_DETECT);
          this.disableTouchID();
          document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");
          // disable touch ID for this user as Save failed - MMR-370
          evaSecureStorage.setItem("isTouchIDEnabled", "");
          if (this.curLoginResponse != null)
            this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);
        }, 300);
      } else if (bderr.errorMessage == 'NOT_ENROLLED') {
        setTimeout(() => {
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_NO_SETUP);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_NO_SETUP);
          this.disableTouchID();
          document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");
          // disable touch ID for this user as Save failed - MMR-370
          evaSecureStorage.setItem("isTouchIDEnabled", "");
          if (this.curLoginResponse != null)
            this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);
        }, 300);
      } else if (bderr.errorMessage == 'AUTHENTICATION_FAILED') {
        setTimeout(() => {
          // to prevent from getting into LOCKOUT situation, disable touch ID here
          this.loginService.showAlert("", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED);
          this.alerts = [this.prepareAlertModal("Error!", ConstantsService.ERROR_MESSAGES.LOGINPAGE_TOUCHID_DISABLED, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.disableTouchID();
          this.isTouchIdLockedOut = true;
          document.getElementById('touchSectionContainer').style.display = 'none';
          this.isTouchIDUsed = "";
          evaSecureStorage.setItem("isTouchIDEnabled", "");

          if (this.curLoginResponse != null)
            this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);

        }, 300);
      } else {
        setTimeout(() => {
          this.loginService.showAlert("", bderr.errorDescription);
          this.authService.addAnalyticsClientEvent(bderr.errorDescription);
          this.disableTouchID();
          document.getElementById('touchSectionContainer').setAttribute("style", "pointer-events: none; opacity: 0.4;");
          // disable touch ID for this user as Save failed - MMR-370
          evaSecureStorage.setItem("isTouchIDEnabled", "");
          if (this.curLoginResponse != null)
            this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);
        }, 300);
      }
    } else {

      evaSecureStorage.setItem("isTouchIDEnabled", "");
      document.getElementById('touchSectionContainer').style.display = 'none';
      this.isTouchIDUsed = "";

      if (this.curLoginResponse != null)
        this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);
    }

  }

  sendMessageToAuthenticationStateProvider() {
    if (this.curLoginResponse != null)
      this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);
  }

  saveTouchidSuccess() {
    evaSecureStorage.setItem("isTouchIDEnabled", "true");
    if (this.curLoginResponse != null)
      this.authenticationStateProvider.sendMessage(this.curLoginResponse.scopename, this.curLoginResponse);

  }
  deleteTouchidFailed(bsts) {
    console.log("touch id delete failed: " + bsts);
  }
  deleteTouchidSuccess(bsts) {
  }

  disableTouchID() {
    this.loginForm.value.biometric = false;
    this.isTouchIDUsed = "";
    this.touchIDAttemptFailureCount = 0;
    this.isTouchIdKeySaved = false;
  }

  onSupportedBiometricsData() {
    this.toggleTouchId(null);
  }

  prepareAlertModal(title: string, msg: string, type: string) {
    if (msg) {
      let a: AlertModel = new AlertModel();
      a.id = "1";
      a.message = msg;
      a.alertFromServer = false;
      a.showAlert = true;
      a.title = title;
      a.type = type ? type : ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL;
      return a;
    }
    return null;
  }

}
