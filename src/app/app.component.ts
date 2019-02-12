import { Component, ViewChild, OnDestroy, ElementRef } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MemauthRequest } from '../models/login/memauthRequest.model';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ConfigProvider } from '../providers/config/config';
import { AppProvider } from '../providers/app/app';
import { AppConfig } from '../components/dashboard-card/app-config';
import { MessageProvider } from '../providers/message/message';
import { Subscription } from 'rxjs/Subscription';
import { LoginState } from '../providers/user-context/user-context';
import { LoginComponent } from '../pages/login/login.component';
import { ConstantsService } from '../providers/constants/constants.service';
import { RegistrationComponent } from '../pages/login/registration.component';
import { UserContextProvider } from '../providers/user-context/user-context';
import { AuthenticationStateProvider } from '../providers/login/authentication.state';
import { AuthenticationService } from '../providers/login/authentication.service';
import { MemberInformationPage } from '../pages/member-information/member-information';
import { SsnAuthPage } from '../pages/ssn-auth/ssn-auth';
import { LoginRequest } from '../models/login/loginRequest.model';
import { ModalController } from 'ionic-angular';
import { AuthOptInPromoPage } from '../pages/authentication/auth-optin-promo';
import { VerifyPasscodePage } from '../pages/verify-passcode/verify-passcode';
import { AuthPersonalInfoPage } from '../pages/authentication/auth-personal-info-page';
import { FeatureGuidePage } from '../pages/about/feature-guide/feature-guide';
import { ValidationProvider } from '../providers/validation/ValidationService';
import { MySettingsService } from '../pages/my-settings/my-settings-service';
// import { FindadoctorService } from '../pages/find-doctor/find-doctor.services';
import { MyFinancialService } from '../pages/my-financial/my-financial-service';
import { FadPage } from '../pages/fad/fad-landing/fad';
import { FinancialLandingPage } from '../pages/financials/financial-landing/financial-landing';
import { UserMigrationService } from '../pages/user-migration/user-migration-service';
import { AlertModel } from '../models/alert/alert.model';
import { AlertService } from '../providers/utils/alert-service';
import { AuthVerificationSuccessPage } from '../pages/auth-verification-success/auth-verification-success';

declare var scxmlHandler;
declare var evaSecureStorage: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  @ViewChild(Nav) nav: Nav;

  // initialize rootPage to ssnull. Depending on value of evaSecureStorage.SHOW_GUIDE, 
  // utility-handler will set root to FeatureGuide or Dashboard
  rootPage: any = null;
  pages: Array<AppConfig>;
  subscription: Subscription;
  useridin: string = null;
  access_token: string = null;
  userName: string;
  backClickCount: number = 0;
  resObj: any;
  alerts: Array<any>;
  invalidFields: any;
  lastMemResult :any;
  msgObj :any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public alertCtrl: AlertController,
    private config: ConfigProvider,
    private appProvider: AppProvider,
    private messageProvider: MessageProvider,
    private userContext: UserContextProvider,
    private authenticationStateProvider: AuthenticationStateProvider,
    private authService: AuthenticationService,
    public modalCtrl: ModalController,
    private alertService: AlertService,
    private elRef: ElementRef,
    private userMigrationService: UserMigrationService,    
    public validationService: ValidationProvider,
    public mySettingsService: MySettingsService,
    // private FindadoctorService: FindadoctorService,
    private MyFinancialService: MyFinancialService
  ) {

    window['AppPageRef'] = {
      component: this
    };
    this.subscription = this.messageProvider.getMessage().subscribe(message => {
      if (message.event == ConstantsService.LOGIN_SUCCESS) {
        this.onLoginSuccess();
      } else if (message.event == ConstantsService.LOGOUT_SUCCESS) {
        this.onLogoutSuccess();
      } else if (message.event == ConstantsService.SESSION_EXPIRED) {
        this.onSessionExpired();
      }
      else if (message.event == ConstantsService.RE_LOGIN) {
        this.performRelogin();
      } else if (message.event == "POPOVER_ACTIVE") {
        this.onPopOverToggle(message.data);
      }
    }, err => {
      console.log('MessageProvider :: Error response =' + err);
    });

    this.authenticationStateProvider.getMessage().subscribe(message => {
      try {
        this.handleResponse(message);
      } catch (e) {
      }
    }, err => {
      console.log('authenticationStateProvider :: Error response =' + err);
    });
    this.initializeApp();
  }

  onPopOverToggle(data) {
    if (data) {
      this.menuOpened();
    } else {
      this.menuClosed();
    }
  }

  ngOnInit() {

    setTimeout(() => {

      if (!this.config.showFeature("FindADoctorMenu")) {
        this.appProvider.disableApp("FindADoctorCardComponent");
      } else if (this.config.showFeature("FindADoctorMenu")) {
        this.appProvider.enableApp("FindADoctorCardComponent");
      }
      //first time when app is initialized the login state will be anonymous.
      this.pages = this.appProvider.getAppConfig(LoginState.Anonymous);
    }, 100);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showUserGuide() {
    console.log("Show guide from secure storage : " + evaSecureStorage.getItem("SHOW_GUIDE"));
    if (evaSecureStorage.getItem("SHOW_GUIDE") != "done") {
      this.userContext.setShowFeatureGuide(true);
      this.nav.setRoot(FeatureGuidePage);
      evaSecureStorage.setItem("SHOW_GUIDE", "done");
    }
  }

  setFeatureGuideRootPage() {
    this.nav.setRoot(FeatureGuidePage);
  }
  setDashboardRootPage() {
    this.nav.setRoot(DashboardPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //document.getElementById("progress-loader").style.display="none";
      //this.config.load();          
      //setTimeout(() => {
      scxmlHandler.platformReady();
      //}, 100);

      //Remove the menu item of the current view
      this.nav.viewDidEnter.subscribe(view => {
        this.userContext.setCurrentView(view);
        setTimeout(() => {

          this.nav.getViews().filter((stackedView, index) => {

            if (stackedView.component.name == view.component.name && view.component.name != "DashboardPage") {
              if (index < this.nav.getViews().length - 1) {
                this.nav.removeView(stackedView);
              }
            }
          });
        }, 100);

        this.pages = this.appProvider.getAppConfig(this.userContext.getLoginState(), this.authService.loginResponse).filter(page => {
          console.log('res');
          if (page.id.name == view.component.name) {
            page.active = true;
          } else {
            page.active = false;
          }
          return true;
        });

      });
    });
  }

  onLoginSuccess() {
    console.log('data');
    this.pages = this.appProvider.getAppConfig(this.userContext.getLoginState(), this.authService.loginResponse);
    let uName = this.authService.getMemberName();
    if (uName.length > 20) {
      uName = uName.substring(0, 17) + "...";
    }
    this.userName = uName;

  }

  onLogoutSuccess() {
    this.userName = "";
    this.appProvider.disableApp("MyFinancialPage");
    this.pages = this.appProvider.getAppConfig(LoginState.Anonymous);
    this.authService.messageAlertsInMemoryVals = null;
    this.authService.messageAlertsCount = null;
    this.authService.isMessageAlertsAPIInvoked = false;
  }

  menuOpened() {
    let hElement: HTMLElement = this.elRef.nativeElement;
    let ele = hElement.getElementsByClassName('scroll-content');
    for (let i = 1; i < ele.length; i++) {
      ele[i].setAttribute("style", "overflow: hidden;");
    }
  }

  menuClosed() {
    let hElement: HTMLElement = this.elRef.nativeElement;
    let ele = hElement.getElementsByClassName('scroll-content');
    for (let i = 1; i < ele.length; i++) {
      ele[i].setAttribute("style", "overflow-x: hidden;overflow-y: scroll;");
    }

  }

  performRelogin() {
    this.userName = "";
    this.userContext.setLoginState(LoginState.Anonymous);
    this.authService.clearSession();
    this.userContext.clearSessionData();
    this.nav.popToRoot().then(() => {
      this.nav.push(LoginComponent);
    });
  }

  onSessionExpired() {
    this.userName = "";
    this.userContext.setLoginState(LoginState.Anonymous);
    this.authService.clearSession();
    this.userContext.clearSessionData();
    this.authService.messageAlertsInMemoryVals = null;
    this.authService.messageAlertsCount = null;
    this.authService.isMessageAlertsAPIInvoked = false;
    this.showAlertWithHandler("", "Your session has expired. Please sign in.");
  }

  openPage(page) {
    scxmlHandler.playSoundWithHapticFeedback();
    // if messagecenter icon was previously clicked and user cliks other menu options, then reset deeplink
    if (this.authService.getDeepLink() == "://messagecenter") {
      this.authService.setDeepLink("");
    }
    setTimeout(() => {

      if (page == "signin") {
        this.nav.push(LoginComponent);
        this.menu.close();
      } else if (page == "signout") {
        this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
        ConstantsService.IS_DASHBOARD = true;
        this.menu.close();
      } else if (page == "register") {
        this.nav.push(RegistrationComponent);
        this.menu.close();
      } else if (page.id.name == "DashboardPage") {
        this.nav.popToRoot({ animate: false, direction: "forward" });
        this.menu.close();
      } else if (page.id.name == "MyFinancialPage") {
        //this.financialSso();
        this.nav.push(FinancialLandingPage);
      } else if (page.id.name == "FindADoctorCardComponent") { // && this.userContext.getLoginState() != LoginState.Anonymous) {
        let etarget = 'Menu.FindaDoctor';
        let edataobj = {};
        if (this.userContext.getLoginState() == LoginState.Anonymous) {
          edataobj = { "context": "action", "data": { "App.linkSource": "HomeAnonymous" } };
        } else {
          edataobj = { "context": "action", "data": { "App.linkSource": "Menu" } };
          // this.findDoctorSso();
        }
        this.nav.push(FadPage);
        // scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        //scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      } else {

        // changes for swrve tags alone
        if (page.id.name == "ContactUsPage") {
          let etarget = 'Menu.ContactUs';
          let edataobj = { "context": "action", "data": { "App.linkSource": "Menu" } };
          scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        }
        // chagnes for swrve tag ends

        if (this.userContext.getLoginState() == LoginState.Anonymous && !(page.id.name == "AboutPage" || page.id.name == "ContactUsPage")) {
          if (this.nav.getActive().component.name != "LoginComponent")
            this.nav.push(LoginComponent);
          this.menu.close();
        }
        else if (this.userContext.getLoginState() == LoginState.Registered &&
          !(page.id.name == "MySettingsPage" || page.id.name == "AboutPage" || page.id.name == "ContactUsPage")) {
          this.nav.push(AuthOptInPromoPage);
        } else {
          this.nav.push(page.id);
          this.menu.close();
        }
      }

      // close the menu when clicking a link from the menu
      this.menu.close();
    }, 300);

  }

  isStateAnonymous() {
    return (this.userContext.getLoginState() == LoginState.Anonymous);
  }

  isStateLoggedIn() {
    return (this.userContext.getLoginState() == LoginState.LoggedIn);
  }

  invokesendcommChannel(){
    let generatedRequest = {}
      return new Promise((resolve, reject) => {
        //useridin: this.authService.useridin,
    setTimeout(() => {
          //const�numberRegEx�=�new�RegExp('^[0-9]{10}'); 
          const numberRegEx = new RegExp('^[0-9]{10}'); 
          let registerType = numberRegEx.test(this.authService.useridin) ? 'MOBILE' : 'EMAIL';
         
            if(registerType == "EMAIL"){
              generatedRequest = {
                useridin: this.authService.useridin,
                email: this.authService.useridin,
                mobile: '',
                userIDToVerify: this.authService.useridin
              }
            }else{
              generatedRequest = {
                useridin: this.authService.useridin,
                email: '',
                mobile: this.authService.useridin,
                userIDToVerify: this.authService.useridin
              }
            }
          this.userMigrationService.makeCommChannelSendCodeReq(generatedRequest).subscribe(response => {
            if(response && !(response.displaymessage)) {
            this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");
            let objForVerifyPasscode = {
              fromPage: "authRV",
              email: this.authService.useridin,
              userIDToVerify: this.authService.useridin
            }
            this.nav.setRoot(VerifyPasscodePage, { "updateRVOBJVerifyReq": objForVerifyPasscode });
            //this.gotoAccessCodeVerificationPage(objForVerifyPasscode);  // landing to verification code page
          }else{
            if(response.displaymessage){
              this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
              this.authService.addAnalyticsAPIEvent(response.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', response.result);
               }
               this.showAlert('', response.displaymessage);   
          }
        },
        err => {
              reject(err);
              console.log(err);
          if (err.displaymessage) {
                this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                this.authService.addAnalyticsAPIEvent(err.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', err.result);
                this.showAlert('', err.displaymessage);  
              } else{
                this.showAlert('',"Error occured during Authentication.");
          }
          //this.showAlert('', displaymsg);
            }
          );
        }, 500);
        });
  
  }

  handleResponse(message: any) {

    if (message.event.trim() === ConstantsService.REGISTER_SUCCESS) {
      this.performLogin(message.data.useridin, message.data.passwordin);
    }

    if ((message.event.trim() === ConstantsService.ACTIVE_AUTHENTICATED_USER) && (this.authService.migrationType == "NONE")) {
      this.makeMemberInfoRequest();
    }

    if ((message.event.trim() === ConstantsService.ACTIVE_AUTHENTICATED_USER && this.authService.migrationType != "NONE") ||
      (message.event.trim() === ConstantsService.AUTHENTICATED_NOT_VERIFIED && this.authService.migrationType != "NONE")) {  //Show logged in dashboard



      //if(this.authService.migrationType == "NONE"){  
      //this.makeMemberInfoRequest();
      // }else{
      this.gotoLoggedInDashboard();
      // }

    }

    
     if (message.event.trim() === ConstantsService.APP_EVENT_PASSCODE_VERIFIED) { 
       //re-login again to get new scope
       this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, message);
     } 
    if( message.event.trim() === ConstantsService.APP_EVENT_SSN_UPDATED || message.event.trim() === ConstantsService.APP_EVENT_LN_UPDATED ){  //re-login again to get new scope
    /*this.authService.resendLoginRequest().subscribe(loginResponse => {
        this.authenticationStateProvider.sendMessage(loginResponse.scopename, loginResponse);
      }, err => {
        console.log('Error response from resendLoginrequest ' + err);
        let displaymsg
        if(err.displaymessage != ""){
          displaymsg = err.displaymessage;
          }else{
              displaymsg = "Error occured during Authentication."
          }
          //this.showAlert('', displaymsg);
          this.getScopefromProfile();
          this.authService.addAnalyticsAPIEvent(displaymsg, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', err.result);
          });*/
         // this.getScopefromProfile(); 
         if(this.authService.currentUserScopename == ConstantsService.REGISTERED_AND_VERIFIED){
            //this.invokesendcommChannel();
            this.nav.setRoot(DashboardPage);
            this.nav.push(AuthVerificationSuccessPage);
         }else{
         this.authService.currentUserScopename = ConstantsService.AUTHENTICATED_NOT_VERIFIED;
         this.authenticationStateProvider.sendMessage(ConstantsService.AUTHENTICATED_NOT_VERIFIED,message);
         }
    }

    /*if (message.event.trim() === ConstantsService.APP_EVENT_SSN_UPDATED || message.event.trim() === ConstantsService.APP_EVENT_LN_UPDATED) {
      this.authenticationStateProvider.sendMessage(ConstantsService.AUTHENTICATED_NOT_VERIFIED, message);
    }*/

    if ((message.event.trim() === ConstantsService.AUTHENTICATED_NOT_VERIFIED) && (this.authService.migrationType == "NONE")) {

      // TODO: what to do here if memAuthData is NULL? In this scope, API wont return memAuthData and user cannot be forced to Registered Home page also without memAUthData.
      console.log('In AUTHENTICATED_NOT_VERIFIED scope:: memAuthData = ' + this.authService.memAuthData);

              let isUsedIdValidEmailOrPhoneNumber  = this.validationService.isUsedIdValidEmailOrPhoneNumber(this.authService.useridin);

              if(isUsedIdValidEmailOrPhoneNumber){
                    this.authService.sendAccessCode().then((result) => {
                      this.resObj = result;
                      let codeTypeData;
                      if (this.resObj.result == 0) {
                        this.userContext.setIsVerifycodeRequested(this.useridin, "true");
                        this.msgObj = this.authService.handleDecryptedResponse(this.resObj);
                        if(this.msgObj.commChannelType == "EMAIL"){
                          codeTypeData = {emailAddress:this.msgObj.commChannel};
                        }else{
                          codeTypeData = {phoneNumber:this.msgObj.commChannel};
                        }
                        this.nav.setRoot(VerifyPasscodePage, { fromPage: 'accountRegistrationFlow', type: null, no_email: null ,commType:this.msgObj.commChannelType, commValue:this.msgObj.commChannel,"codeTypeData":codeTypeData});
                        return this.resObj;
                      } else {
                        console.log('sendaccesscode :: error =' + this.resObj.displaymessage);
                        let emsg = this.resObj.displaymessage;
                        this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);
                      }
                    }, (err) => {
                      console.log(err);
                    });
              } else{
                  // get profile and send access code 
                  this.getProfileAndSendAccessCode();
           }
    }

    if (message.event.trim() === ConstantsService.REGISTERED_NOT_VERIFIED || message.event.trim() === ConstantsService.REGISTERED_AND_VERIFIED) {     //Show anonymous dashboard

      this.useridin = this.authService.useridin;
      this.makeMemberAuthenticationInfoRequest({ useridin: this.useridin });

    }

  }

  sendAccessCodeForUsername(profieResponse){
            // currently usernme harcoded we change with getMemProfile info
            this.authService.sendAccessCodeForUsername(profieResponse).then((result) => {
              this.resObj = result;
              let codeTypeData;
              if (this.resObj.result == 0) {
                this.userContext.setIsVerifycodeRequested(this.useridin, "true");
                this.msgObj = this.authService.handleDecryptedResponse(this.resObj);
                if(this.msgObj.commChannelType == "EMAIL"){
                  codeTypeData = {emailAddress:this.msgObj.commChannel};
                }else{
                  codeTypeData = {phoneNumber:this.msgObj.commChannel};
                }
                this.nav.setRoot(VerifyPasscodePage, { fromPage: 'accountRegistrationFlow', type: null, no_email: null,codeType: "codeForUsername",commValue:this.msgObj.commChannel,codeTypeData:codeTypeData ,commType:this.msgObj.commChannelType});
                return this.resObj;
              } else {
                console.log('sendaccesscode :: error =' + this.resObj.displaymessage);
                let emsg = this.resObj.displaymessage;
                this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl);
              }
            }, (err) => {
              console.log(err);
            });
    }


  getProfileAndSendAccessCode() {

    setTimeout(() => {
      let memberAuthInfoURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getMemProfileForMigration");
      let memAuthData = null;
      this.mySettingsService.getMemberProfileAndMemberAuthInfoRequest(memberAuthInfoURL)
        .subscribe(response => {
          if (response) {
            memAuthData = response;
            //response.rowset.rows
            this.sendAccessCodeForUsername(memAuthData);
          }
        },
          err => {
            console.log("Error while getting Member Auth Info -" + JSON.stringify(err));
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_ALERTS_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.authService.addAnalyticsAPIEvent(err.displaymessage, memberAuthInfoURL, err.result);
          });
    }, 500);
  }


  makeGetDependentsListRequest() {

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin
      };

      const isKey2req = false;
      let getDependentsUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getDependnetsListEndPoint");

      console.log('makeGetDependentsListRequest: ' + getDependentsUrl);

      this.authService.makeHTTPRequest("post", getDependentsUrl, null, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptionsWithoutBearerToken(), 'Accessing Dependent List')
        .map(res1 => {
          let resobj = res1;
          if (resobj.result === "0") {
            return this.authService.handleDecryptedResponse(resobj);
          } else {
            console.log('makeGetDependentsListRequest :: error =' + resobj.displaymessage);
            let emsg = resobj.displaymessage;
            this.authService.handleAPIResponseError(resobj, emsg, getDependentsUrl);

          }

        })
        .subscribe(response => {
          if (response.displaymessage) {
            this.handleError(response.displaymessage);
          } else {
            console.log('handle response');
            let dependentsList = response.ROWSET.ROWS;
            this.userContext.setDependentsList(dependentsList);
          }
        },
          err => {
            console.log("Error while getting dependents list -" + JSON.stringify(err));
            let errmsg = "Error while getting dependents list - Server encountered error processing your request"
            if (err.displaymessage)
              errmsg = err.displaymessage;
            this.showAlert('ERROR', errmsg);
          }
        );
    }, 500);

  }

  makeMemberInfoRequest() {

    let mask = this.authService.showLoadingMask('Accessing Member Information...');
    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin
      };

      const isKey2req = false;
      let getMemInfoUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memberInfoEndPoint");
      console.log('getMemInfoUrl ' + getMemInfoUrl);

      let encmsg = JSON.stringify(this.authService.encryptPayload(request, isKey2req));
      this.authService.makeHTTPRequest("post", getMemInfoUrl, mask, encmsg, this.authService.getHttpOptions(), 'Accessing Member Information')
        .map(res1 => {
          let resobj = res1;
          if (resobj.result == 0) {
            this.authService.memberInfoRowSet = this.authService.handleDecryptedResponse(resobj);
            this.authService.memberInfo = this.authService.memberInfoRowSet.ROWSET.ROWS;
            let uName = this.authService.getMemberName();
            if (uName.length > 20) {
              uName = uName.substring(0, 17) + "...";
            }
            this.userName = uName;

            this.gotoLoggedInDashboard();
            return this.authService.memberInfo;

          } else {
            console.log('makeMemberInfoRequest :: error =' + resobj.displaymessage);
            let emsg = resobj.displaymessage;
            this.authService.handleAPIResponseError(resobj, emsg, getMemInfoUrl);
          }
        })
        .subscribe(response => {

        }, err => {
          console.log('ACTIVE_AUTHENTICATED_USER :: Error response from memInfo and dependnet list ', err);
        });

    }, 100);

  }

  makeMemberAuthenticationInfoRequest(request: MemauthRequest) {

    let mask = this.authService.showLoadingMask('Accessing Member Information');
    setTimeout(() => {
      const isKey2req = false;
      let getMemAuthUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memAppAuthEndPoint") + 'getmemauthinfo';

      console.log('getMemAuth URL ' + getMemAuthUrl);
      this.authService.makeHTTPRequest("post", getMemAuthUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Member Information')
        .map(res1 => {
          let resobj = res1;
          if (resobj.result == 0) {
            return this.authService.handleDecryptedResponse(resobj);
          } else {
            console.log('memAuth :: error =' + resobj.errormessage);
            let emsg = resobj.displaymessage;
            if (resobj.errormessage.indexOf('GET_MEM_AUTH_ENTRY_PR - NO MEM_AUTH_ENTRY RECORD FOUND') == -1)
              this.authService.handleAPIResponseError(resobj, emsg, getMemAuthUrl);
            return resobj;
          }

        })
        .subscribe(memAuthResponse => {
          console.log("=================");
          console.log(memAuthResponse);
          console.log("======================");
          if (memAuthResponse.errormessage) {

            this.authService.memAuthData = null;
            this.authService.authLNAllowed = true;
            this.authService.authLNQuestionTried = false;
            this.authService.authlnattemptcount = 0;
            if (this.userContext.getAuthenticateNowPromoTaped()) {
              this.userContext.setAuthenticateNowPromoTaped(false);
              this.nav.push(AuthPersonalInfoPage);
            }
            else
              this.gotoRegistredDashboard();
            //this.gotoUpdateSSNPage();
            return;
          }

          if (this.authService.memberInfoError) {
            //memAuthResponse['ROWSET'].ROWS.lastMemResult = "|MEM_DOB|MEM_LNAME|MEM_FNAME|";
            this.authService.memberInfoError = false;
          }
          /*if(this.authService.redirecttoMemPage){
            memAuthResponse['ROWSET'].ROWS.memNum = 'null';
          }*/ 
          this.authService.memAuthData = memAuthResponse;

          this.authService.updateLNAttempt(memAuthResponse['ROWSET'].ROWS);
          let uName = this.authService.getMemberName();
          if (uName.length > 20) {
            uName = uName.substring(0, 17) + "...";
          }
          this.userName = uName;

          ///this.invalidFields = memAuthResponse['ROWSET'].ROWS.lastMemResult.split('|').filter((field) => field);
          if (memAuthResponse['ROWSET'].ROWS.memNum === null && memAuthResponse['ROWSET'].ROWS.lastName === 'null') {

            if (this.userContext.getAuthenticateNowPromoTaped()) {
              this.userContext.setAuthenticateNowPromoTaped(false);
              this.nav.push(AuthPersonalInfoPage);
            }
            else
              this.gotoRegistredDashboard();
          }
          //this.lastMemResult = memAuthResponse['ROWSET'].ROWS.lastMemResult;
          //ValidationProvider.AUTH_INVALID_IDENTIFITERS

          /*if (((this.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.dateOfBirth) > -1 ||
          this.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.firstName) > -1 ||
            this.lastMemResult.indexOf('FIRST_SCREEN') > -1 ||
            this.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.lastName) > -1))
            && !(this.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.memberId) > -1)
          ) {
            //url = this.REDIRECTION_URLS['DOB_NOT_FOUND'];
            this.nav.push(AuthPersonalInfoPage);
          } else if (this.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.memberId) > -1) {
          //..url = this.REDIRECTION_URLS['MEMBER_NOT_FOUND'];
          this.gotoMemberInfoPage();
          } */
          //else {
          //sessionStorage.setItem('updatessn', 'true');
          //url = this.REDIRECTION_URLS['SSN_MISMATCH'];
          //} 
          else if (memAuthResponse['ROWSET'].ROWS.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.firstName) != -1 ||
            memAuthResponse['ROWSET'].ROWS.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.lastName) != -1 ||
            memAuthResponse['ROWSET'].ROWS.lastMemResult.indexOf(ValidationProvider.AUTH_INVALID_IDENTIFITERS.dateOfBirth) != -1) {
            this.nav.push(AuthPersonalInfoPage);
            this.authService.redirecttoMemPage = true;
          }else if(memAuthResponse['ROWSET'].ROWS.lastMemResult.indexOf("FIRST_SCREEN") != -1 && !this.authService.redirecttoMemPage  && memAuthResponse['ROWSET'].ROWS.memNum != 'null'){
            this.authService.redirecttoMemPage = true;
            this.nav.push(AuthPersonalInfoPage);            
          }else if(this.authService.redirecttoMemPage){
            this.gotoMemberInfoPage();
            this.authService.redirecttoMemPage = false;
          } else if (memAuthResponse['ROWSET'].ROWS.lastMemResult.indexOf('MEM_NUM') != -1) {
            this.gotoMemberInfoPage();
          } else if (memAuthResponse['ROWSET'].ROWS.memNum === 'null' && memAuthResponse['ROWSET'].ROWS.lastName !== 'null') {
            this.gotoMemberInfoPage();
          } else if ((memAuthResponse['ROWSET'].ROWS.memNum !== 'null' && memAuthResponse['ROWSET'].ROWS.lastName !== 'null')) {
            this.gotoUpdateSSNPage();
          } else {
            console.log('Unhandled Event subscribed');
          }

        }, err => {
          console.log('Error response from Mem authentication api ' + err);
          // As per Bobby's email "Test environment - getmemauthinfo failing", go to home page even on error
          //this.gotoRegistredDashboard();
          let emsg = err.displaymessage;
          if (err.errormessage.indexOf('GET_MEM_AUTH_ENTRY_PR - NO MEM_AUTH_ENTRY RECORD FOUND') == -1)
            this.authService.handleAPIResponseError(err, emsg, getMemAuthUrl);
        });
    }, 100);

  }

  gotoRegistredDashboard() {
    this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
  }
  gotoLoggedInDashboard() {
    this.messageProvider.sendMessage(ConstantsService.LOGIN_SUCCESS, null);
  }
  gotoMemberInfoPage() {
    this.nav.push(MemberInformationPage);
  }

  gotoUpdateSSNPage() {
    this.nav.push(SsnAuthPage);
  }

  performLogin(userId: string, password: string) {

    let loginrequest: LoginRequest = new LoginRequest();
    this.useridin = userId;
    loginrequest.useridin = userId;
    loginrequest.passwordin = password;
    this.makeLoginRequest(loginrequest);
  }

  makeLoginRequest(request: LoginRequest) {

    let mask = this.authService.showLoadingMask('Signing In');
    setTimeout(() => {
      this.authService.useridin = request.useridin;
      const isKey2Req = false;

      let loginUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin';
      console.log('login request url:' + loginUrl);

      this.authService.encloginreq = this.authService.encryptPayload(request, isKey2Req);
      this.authService.makeHTTPRequest("post", loginUrl, mask, JSON.stringify(this.authService.encloginreq), this.authService.getHttpOptionsWithoutBearerToken(), 'Signing In')
        .map((res) => {
          let resobj = res;
          if (resobj.access_token) {
            this.authService.setLoginResponse(resobj,false);
            return res;
          } else if (resobj.result && resobj.result != "0") {
            console.log('resendLoginRequest :: error =' + resobj.displaymessage);
            this.authService.showAlert('ERROR', resobj.displaymessage);
          }
        })
        .subscribe(response => {
          this.authenticationStateProvider.sendMessage(response.scopename, response);
        }, err => {
          console.log('Error response from member login api ' + err);

        }
        );
    }, 100);
  }

  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  handleError(rspmsg) {
    console.log('handleError::' + rspmsg);
    var errmsg = 'Server encountered error processing your request';
    if (rspmsg)
      errmsg = rspmsg;
    this.showAlert('ERROR', errmsg);
  }

  showAlertWithHandler(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: [{
        text: 'Ok',
        handler: () => {
          // user has clicked the alert button
          // begin the alert's dismiss transition
          // let navTransition = alert.dismiss();

          alert.dismiss().then(() => {
            this.nav.popToRoot().then(() => {
              this.nav.push(LoginComponent);
            });
          });

          return false;
        }
      }]
    });
    alert.present();
  }

  // check current page name
  getActivePage(): string {
    return this.nav.getActive().name;
  }

  financialSso() {
    setTimeout(() => {
      console.log(this.authService.loginResponse);
      let url = "";
      if (this.authService.loginResponse.isHEQ == "true") {
        url = this.authService.configProvider.getProperty("heqSso");
      } else {
        url = this.authService.configProvider.getProperty("alegeusSso");
      }
      let myFinancialUrl: string = this.authService.configProvider.getProperty("loginUrl") + url;
      this.MyFinancialService.alegeusReq(myFinancialUrl).
        subscribe(response => {
          if (response.result && !(response.result === 0)) {
            let data = this.authService.handleDecryptedResponse(response);
            let url = data.samlUrl;
            let samlKey = data.samlKey;
            let req = { NameValue: data.samlValue }
            scxmlHandler.postNewindow(url, "My Financials", req);
          }
        }, error => {
          this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
        }
        );
    }, 500);
  }
  // findDoctorSso() {
  //   setTimeout(() => {
  //     let findadoctorUrl: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("vitalsSso");
  //     this.FindadoctorService.demoLoginReqest(findadoctorUrl).
  //       subscribe(response => {
  //         if (response.result && !(response.result === 0)) {
  //           let data = this.authService.handleDecryptedResponse(response);
  //           let url = data.samlUrl;
  //           let samlKey = data.samlKey;
  //           let req = { NameValue: data.samlValue };
  //           scxmlHandler.postNewindow(url, "Find a Doctor", req);
  //         } else {
  //           scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
  //         }
  //       }, error => {
  //         this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
  //       });
  //   }, 500);
  // }
}
