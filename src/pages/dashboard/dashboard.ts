import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, MenuController } from 'ionic-angular';
import { CardConfig } from '../../components/dashboard-card/card-config';
import { CardProvider } from '../../providers/card/card';
import { MessageProvider } from '../../providers/message/message';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { LoginComponent } from '../../pages/login/login.component';
import { RegistrationComponent } from '../../pages/login/registration.component';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { MyCardsPage } from '../../pages/my-cards/my-cards';
import { MyPlanPage } from '../../pages/my-plan/my-plan';
import { FooterComponent } from '../../components/footer/footer';
import { HeaderComponent } from '../../components/header/header';
import { AlertModel } from '../../models/alert/alert.model';
import { ConfigProvider } from '../../providers/config/config';
import { UserDevicesMappingProvider } from '../../evacafe/providers/user-devices-mapping/user-devices-mapping';
import { AppProvider } from '../../providers/app/app';
import { MessageCenterPage } from '../../pages/message-center/message-center';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { MyClaimDetailPage } from '../../pages/my-claims/my-claim-detail';
import { MyDoctorPage } from '../../pages/my-doctor/my-doctor';
import { MyMedicationsPage } from '../../pages/my-medications/my-medications';
// import { FindDoctorPage } from '../../pages/find-doctor/find-doctor';
import { UserMigrationComponent } from '../../pages/user-migration/user-migration';
import { MySettingsPage } from '../../pages/my-settings/my-settings';
import { SsnAuthPage } from '../ssn-auth/ssn-auth';
import { MemberInformationPage } from '../member-information/member-information';
import { MyProfilePage } from '../my-settings/my-profile';
import { FindadoctorService } from '../find-doctor/find-doctor.services';
import { FadPage } from '../fad/fad-landing/fad';

declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {
  cards: Array<CardConfig>;
  userData: any;
  userDispName: string;
  backClickCount: number = 0;
  originalSize: number;
  alerts: Array<any>;
  isChildWindowShown: boolean = false;

  @ViewChild(FooterComponent) footer: FooterComponent;

  @ViewChild(HeaderComponent) header: HeaderComponent;

  subHeaderTop: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    private cardProvider: CardProvider,
    private messageProvider: MessageProvider,
    private userContext: UserContextProvider,
    public alertCtrl: AlertController,
    private authService: AuthenticationService,
    private config: ConfigProvider,
    public platform: Platform,
    private appProvider: AppProvider,
    public ngzone: NgZone,
    private userMapping: UserDevicesMappingProvider,
    // private FindadoctorService: FindadoctorService
  ) {

    window['DashboardPageRef'] = {
      component: this
    };
    this.messageProvider.getMessage().subscribe(message => {
      if (message.event == "PersonalizeCards") {
        this.onCardPersonalize(message.data);
      } else if (message.event == ConstantsService.LOGIN_SUCCESS) {
        if (this.authService.migrationType != "NONE") {
          this.navCtrl.push(UserMigrationComponent);
        } else {
          this.onLoginSuccess();
        }
      } else if (message.event == ConstantsService.REGISTER_SUCCESS) {
        this.onRegisterSuccess();
      } else if (message.event == "Remove_Card") {
        this.onRemoveCard(message.data);
      } else if (message.event == "Enable_Card") {
        this.onEnableCard(message.data);
      }
      else if (message.event == ConstantsService.LOGOUT_SUCCESS) {
        this.onLogoutSuccess();
      } else if (message.event == ConstantsService.SESSION_EXPIRED || message.event == ConstantsService.RE_LOGIN) {
        this.onSessionExpired();
      } else if (message.event == "KEYBOARD_DOWN") {
        this.onKeyBoardDown();
      } else if (message.event == "KEYBOARD_UP") {
        this.onKeyBoardUp();
      } else if (message.event == ConstantsService.APP_UNAVAILABLE_404) {

        let alertObj = {
          messageID: "",
          AlertLongTxt: ConstantsService.ERROR_MESSAGES.DASHBOARD_MYBLUEAPP_CURRENTLY_UNAVAIL
          , AlertShortTxt: "We're Sorry",
          RowNum: ""
        }

        let a: AlertModel = this.prepareAlertModal(alertObj);
        if (a != null) {
          this.userContext.setAlerts([a]);
        }

        this.alerts = this.userContext.getAlerts();
      } else {
        this.alerts = null;
      }
    });
    this.originalSize = window.innerHeight + window.innerWidth;
    if (platform.is('android')) {
      this.subHeaderTop = "106px"; // increased from 108px as per Vlad
    } else {
      this.subHeaderTop = "56px";
    }

  }



  onResize(event) {
    let resizedSize = window.innerHeight + window.innerWidth;

    if (this.originalSize == resizedSize) {
      this.messageProvider.sendMessage("KEYBOARD_DOWN", null);
    } else if (this.originalSize > resizedSize) {
      this.messageProvider.sendMessage("KEYBOARD_UP", null);
    }
  }

  ionViewWillEnter() {
    if (!this.userContext.getHealthyLivingInfo() && window["HomeDrupalCards"] && window["HomeDrupalCards"].component && !this.authService.IS_ARTICLES_LOADED) {
      window["HomeDrupalCards"].component.loadData();
    }
    this.backClickCount = 0;

  }

  ionViewDidEnter() {
    setTimeout(() => {

      if (evaSecureStorage.getItem(this.authService.useridin + "_VisitedRegdHomePage")) {
        let regType = this.authService.useridin.indexOf('@') > 0 ? 'EMAIL' : 'MOBILE';
        let etarget = 'HomeRegistered.SuccessfulRegistration';
        let edataobj = { "context": "state", "data": { "App.regMethod": regType } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_DISPLAY + etarget, edataobj);
      }

      if (this.userContext.getLoginState() == LoginState.Anonymous) {
        let etarget = 'HomeAnonymous';
        let edataobj = { "context": "state", "data": { "App.userState": "anonymous", "App.userID": scxmlHandler.getUserIdFromSwrve() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      }
      else if (this.userContext.getLoginState() == LoginState.Registered) {
        let etarget = 'HomeRegistered';
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.userID": scxmlHandler.getUserIdFromSwrve() } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      }
      else if (this.userContext.getLoginState() == LoginState.LoggedIn) {
        let etarget = 'HomeAuthenticated';
        let memberInfo = this.authService.getMemberInfo();
        let synthId = memberInfo.sythID;
        let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.userID": scxmlHandler.getUserIdFromSwrve(), "App.synthID": synthId } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
      }
    }, 2000);

    document.getElementById("dashboardTop").scrollIntoView();
    this.config.remoteConfigData.filter(data => {
      if (data && data.type == "card" && data.action == "hide") {
        this.onRemoveCard(data.id);
      } else if (data && data.type == "card" && data.action == "show") {
        this.onEnableCard(data.id);
      }
    });

    if (this.userContext.getLoginState() == LoginState.Anonymous && this.authService.getDeepLink().indexOf("://messagecenter") >= 0) {
      this.authService.setDeepLink("");
    }
    if(this.authService.memFirstName ){
      this.userDispName = this.authService.memFirstName;
    }
  }


  onAndroidBackButton() {
    // MMR-857 fix
    if (this.isChildWindowShown) {
      this.isChildWindowShown = false;
      return;
    }
    // MMR-417 fix
    if (this.menu.getOpen()) {
      this.menu.close();
      return;
    }
    if (this.userContext.getCurrentView().component.name == "VerifyPasscodePage") {
      return;
    }
    // MMR-417 fix END
    if (this.userContext.getIsPopoverActive()) {
      this.messageProvider.sendMessage("ANDROID_BACK", null);
    } else if (this.navCtrl.getActive().name == "AuthVerificationSuccessPage") {
    } else if (this.userContext.getCustomBackHandler()) {
      this.userContext.getCustomBackHandler().handleAndroidBack();
      this.userContext.setCustomBackHandler(null);
    } else if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
    if (this.navCtrl.getActive().name == "DashboardPage") {
      ++this.backClickCount;
      //Exit application if back is clicked twice within 1 sec.
      setTimeout(() => {
        if (this.backClickCount == 2) {
          this.showConfirm();
        }
        this.backClickCount = 0;
      }, 1000);
    }
  }



  ngOnInit() {
    scxmlHandler.beginTestfairy();
    if (this.userContext.getLoginState() == LoginState.LoggedIn) {  
      this.cards = this.cardProvider.getCardConfig(LoginState.LoggedIn);
    }else{
      this.cards = this.cardProvider.getCardConfig(LoginState.Anonymous);
    }
    if (scxmlHandler.cuemeReadyIdFired) {

    } else {
      scxmlHandler.sendHomeScreenEvent = true;

      setTimeout(() => {

      }, 1000);

    }
  }

  onCardPersonalize(cards) {
    this.cards = cards;
  }

  onLoginSuccess() {
    let isAlertsAPIInvoked = false;
    this.userContext.setLoginState(LoginState.LoggedIn);
    let memberInfo = this.authService.getMemberInfo();

    this.userContext.setLoginId(this.authService.useridin);
    this.userMapping.registerUser();

    this.userDispName = (memberInfo.memFistName ? memberInfo.memFistName : "");
    this.userData = this.authService.loginResponse;
    this.navCtrl.popToRoot();
    this.cards = this.cardProvider.getCardConfig(LoginState.LoggedIn);
    if (this.userContext.getLoginState() == LoginState.LoggedIn) {
      //this.getAlerts();
      if ((memberInfo.hasALG || memberInfo.hasHEQ) && this.authService.loginResponse.HasActivePlan == 'true') {
        // special handling for MyFinancialPage app
        this.appProvider.enableApp("MyFinancialPage");

        //Commenting the above line and adding below code to load the cards for AV user
        // Issue : For AV user cards were not loading
        // Solution : instead of sending message , the cards are enabled here itself
        this.cards.forEach(card => {
          if (card.id == 'MyFinancialsCard') {
            card.enabled = true;
          }
        });
        localStorage.setItem("DashboardCards", JSON.stringify(this.cards));
        //this.authService.makeFinamcialsRequest();
      }
      this.authService.makeGetDependentsListRequest();
      //this.updatePrefereceSetting();

      let deepLink = this.authService.getDeepLink();
      if (deepLink) {
        if (deepLink.indexOf("messagecenter") >= 0) {
          isAlertsAPIInvoked = true;
          if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
            this.authService.getAlerts().subscribe(tempRes => {
              this.processDeepLink(deepLink);
            },
              tempErr => {
                console.log(tempErr);
                this.authService.addAnalyticsAPIEvent(tempErr.displaymessage, this.config.getProperty("loginUrl") + this.config.getProperty("getAlertsEndPoint"), tempErr.result);
                this.processDeepLink(deepLink);
              });
          }
        }
        else {
          this.processDeepLink(deepLink);
        }

      }
    }

    //invoke all API to get notificationAndAlerts and other types of messages
    if (isAlertsAPIInvoked == false) {
      if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
        this.authService.getAlerts().subscribe(tempRes => {
        },
          tempErr => {
            console.log(tempErr);
            scxmlHandler.clearBadgeCount();
            this.authService.addAnalyticsAPIEvent(tempErr.displaymessage, this.config.getProperty("loginUrl") + this.config.getProperty("getAlertsEndPoint"), tempErr.result);
          });
      }
    }
    if (this.authService.destinationURL == "/myprofile") {
      //if (this.authService.destinationURL == null){ 
      this.navCtrl.push(MySettingsPage);
    }
  }

  updatePrefereceSetting() {
    let comAlertFlagKey: string = this.authService.useridin + "_receiveinfo";
    let storedFlgValue: string = evaSecureStorage.getItem(comAlertFlagKey);
    let updateMemberPreferenceURL = this.config.getProperty("loginUrl") + this.config.getProperty("updatemempreferenceEndPoint");

    if (storedFlgValue != null && storedFlgValue.length > 0) {
      let mrkcomemlchked: string = storedFlgValue != null && storedFlgValue === "yes" ? "true" : "false";
      let params: Array<any> = [];
      params.push({ "memkeyname": "mrkcomemlchked", "memkeyvalue": String(mrkcomemlchked) });
      params.push({ "memkeyname": "emlnotifpromochked", "memkeyvalue": String(mrkcomemlchked) });

      const request = {
        useridin: this.authService.useridin
      };
      request["memobject"] = params;
      this.authService.updateMemberPreference(request, null).subscribe(response => {
        if (response.result === "0") {
          evaSecureStorage.removeItem(this.authService.useridin + "_receiveinfo");
        }
      },
        err => {
          console.log("Error while getting getAlerts list -" + JSON.stringify(err));
          this.authService.addAnalyticsAPIEvent(err.displaymessage, updateMemberPreferenceURL, err.result ? err.result : '');
        }
      );
    } else {
    }
  }


  prepareAlertModal(alert: any) {
    if (alert) {
      let a: AlertModel = new AlertModel();
      a.id = alert.messageID;
      a.message = alert.AlertLongTxt;
      a.alertFromServer = true;
      a.showAlert = true;
      a.title = alert.AlertShortTxt;
      a.type = "info";
      a.RowNum = alert.RowNum;
      return a;
    }
    return null;
  }

  onKeyBoardUp() {
    if (this.userContext.getFooterInstance() && !this.platform.is('android')) {
      this.userContext.getFooterInstance().hide();
      let ele = document.getElementsByClassName('scroll-content');
      let eleLength = ele.length;
      let footer = document.getElementsByClassName('tabbarMenu');
      if (footer) {
        let footerLen = footer.length;
        if (footer[footerLen - 1]) {
          let footerHeight = footer[footerLen - 1].clientHeight;
          ele[eleLength - 1].setAttribute("style", "margin-bottom: " + footerHeight + "px !important;");
        }
      }
    }
  }

  onKeyBoardDown() {
    if (this.userContext.getFooterInstance() && !this.platform.is('android')) {
      this.userContext.getFooterInstance().show();
      let ele = document.getElementsByClassName('scroll-content');
      let eleLength = ele.length;
      let footer = document.getElementsByClassName('tabbarMenu');
      if (footer) {
        let footerLen = footer.length;
        if (footer[footerLen - 1]) {
          let footerHeight = footer[footerLen - 1].clientHeight;
          ele[eleLength - 1].setAttribute("style", "margin-bottom: " + footerHeight + "px !important;");
        }
      }
    }
  }

  onLogoutSuccess() {
    scxmlHandler.uploadLogs();
    this.alerts = null;
    this.userContext.setLoginState(LoginState.Anonymous);
    this.authService.clearSession();
    this.userContext.clearSessionData();
    this.authService.closeAlert();
    this.navCtrl.popToRoot({ animate: false, direction: "forward" });
    this.cardProvider.resetLocalStorage();
    this.appProvider.disableApp("MyFinancialPage");
    this.cards = this.cardProvider.getCardConfig(LoginState.Anonymous);

    let etarget = 'HomeAnonymous';
    let edataobj = { "context": "state", "data": { "App.userState": "anonymous" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);

  }

  onSessionExpired() {
    this.cardProvider.resetLocalStorage();
    this.cards = this.cardProvider.getCardConfig(LoginState.Anonymous);
    //Clear the localstorage on session expiry
    //localStorage.clear();
  }

  onRegisterSuccess() {
    this.userContext.setLoginState(LoginState.Registered);
    this.navCtrl.popToRoot({ animate: false, direction: "forward" });
    this.cards = this.cardProvider.getCardConfig(LoginState.Registered);

    let authData = this.authService.memAuthData;

    if ((authData && authData['ROWSET'].ROWS.lastName !== 'null') ||
      this.authService.currentUserScopename == ConstantsService.AUTHENTICATED_NOT_VERIFIED) {
      this.cards = this.cards.filter(card => {
        return card.id != 'AuthenticationDetailsCard';
      });
    }
  }

  onRemoveCard(cardId) {
    this.cards.forEach(card => {
      if (card.id == cardId) {
        card.enabled = false;
      }
    });

    evaSecureStorage.setItem("DashboardCards", JSON.stringify(this.cards));
  }

  onEnableCard(cardId) {
    this.cards.forEach(card => {
      if (card.id == cardId) {
        this.ngzone.run(() => {
          card.enabled = true;

        });
      }
    });

    evaSecureStorage.setItem("DashboardCards", JSON.stringify(this.cards));
  }

  isAlertShowing() {
    let alts: Array<any> = this.userContext.getAlerts();
    return alts.length == 0;
  }

  isStateAnonymous() {
    return (this.userContext.getLoginState() == LoginState.Anonymous);
  }

  isStateAnonymousAndAlert() {
    return ((this.userContext.getLoginState() == LoginState.Anonymous) && (this.isAlertShowing()));
  }

  isStateLoggedIn() {
    return (this.userContext.getLoginState() == LoginState.LoggedIn);
  }
  openPage(page) {
    let etarget = "";
    let edataobj = { "context": "action" };
    //let edataobj={};
    //edataobj.context="action";
    scxmlHandler.playSoundWithHapticFeedback();
    if (page == "signin") {
      // call sign-in page after timeout to fix the MMR-872
      setTimeout(() => {
        this.navCtrl.push(LoginComponent);
      }, 300);
    } else if (page == "register") {
      this.navCtrl.push(RegistrationComponent);
    } else if (page == "myCards") {
      this.navCtrl.push(MyCardsPage);
    } else if (page == "myPlan") {
      this.navCtrl.push(MyPlanPage);
    } else if (page == "findDoctor") {
      console.log("this.userContext.getLoginState() :" + this.userContext.getLoginState());
      if (this.userContext.getLoginState() == LoginState.Registered) {

        etarget = 'HomeRegistered.FindaDoctor';
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        this.navCtrl.push(FadPage);
        // scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      }
      else if (this.userContext.getLoginState() == LoginState.LoggedIn) {
        etarget = 'HomeAuthenticated.FindaDoctor';
        this.navCtrl.push(FadPage);
        //this.findDoctorSso();
      }
      else if (this.userContext.getLoginState() == LoginState.Anonymous) {
        etarget = 'HomeAnonymous.FindaDoctor';
        //edataobj.data = {"App.linkSource":"HomeAnonymous"};
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        this.navCtrl.push(FadPage);
        // scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      }

      //scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      // scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
    }
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Exit',
      message: 'Do you want to exit?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            scxmlHandler.uploadLogs();
            scxmlHandler.exitApplication();
          }
        }
      ]
    });
    confirm.present();
    this.authService.setAlert(confirm);
  }


  deepLinkRedirect(url: string) {
    this.setAdobeEventDeeplink(url);
    url = this.changeDeepLinkUrl(url);
    switch (url) {
      case 'signin':
        if (this.userContext.getLoginState() !== 0) {
          //no redirection
        } else {
          this.navCtrl.push(LoginComponent, {
            deeplinkkey: url
          });
        }
        break;
      case 'register':
        if (this.userContext.getLoginState() !== 0) {
          //no redirection
        } else {
          this.navCtrl.push(RegistrationComponent);
        }
        break;
      default:
        this.authService.setDeepLink(url);
        if (this.userContext.getLoginState() !== 0) {
          this.processDeepLink(url.toLowerCase());
        } else {
          this.navCtrl.push(LoginComponent);
        }
        break;

    }
  }

  processDeepLink(url: string) {
    let msgCtrPageName = "messagecenter";
    let myCardsPageName = "mycards";
    let myClaimsPageName = "myclaims";
    let myClaimsDetailPageName = "myclaims?";
    let myDoctorsPageName = "mydoctors"
    let myMedicationsPageName = "mymedications";
    let findDoctorPageName = "finddoctor";

    let userNameParam = "username";
    let userId = "";
    let userNameIndex = url.indexOf(userNameParam);
    if (userNameIndex >= 0) {
      userId = url.substring(userNameIndex + 9);
      if (this.authService.useridin !== userId) {
        return;
      }
    }
    if (url.indexOf(msgCtrPageName) >= 0) {
      this.navCtrl.push(MessageCenterPage);
    } else if (url.indexOf(myCardsPageName) >= 0) {
      this.authService.setDeepLink("");
      this.navCtrl.push(MyCardsPage);
    } else if (url.indexOf(myClaimsDetailPageName) >= 0) {
      this.navCtrl.push(MyClaimsPage);
      this.navCtrl.push(MyClaimDetailPage);
    } else if (url.indexOf(myClaimsPageName) >= 0) {
      this.authService.setDeepLink("");
      this.navCtrl.push(MyClaimsPage);
    } else if (url.indexOf(myDoctorsPageName) >= 0) {
      this.authService.setDeepLink("");
      this.navCtrl.push(MyDoctorPage);
    } else if (url.indexOf(myMedicationsPageName) >= 0) {
      this.authService.setDeepLink("");
      this.navCtrl.push(MyMedicationsPage);
    } else if (url.indexOf(findDoctorPageName) >= 0) {
      this.authService.setDeepLink("");
      // this.navCtrl.push(FindDoctorPage);
      //this.findDoctorSso();
      this.navCtrl.push(FadPage);
    }
  }

  // check current page name
  getActivePage(): string {
    return this.navCtrl.getActive().name;
  }


  setAdobeEventDeeplink(url) {
    console.log("AdobeEventDeeplink " + url);
    if (url.indexOf("campaignID") != -1) {
      let campaignID = url.split("campaignID=")[1];
      if (campaignID == "") {
        return false;
      }
      let etarget = 'SwrveMessage';
      let edataobj = { "context": "action", "data": { "App.campaignID": campaignID, "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.userID": scxmlHandler.getUserIdFromSwrve() } };
      console.log(campaignID);
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    }
  }

  changeDeepLinkUrl(url) {

    if (url.indexOf("&campaignID=") >= 0) {
      let splitDeepLink = url.split("&campaignID=");
      return splitDeepLink[0]; // changed url of deeplink after removing compain id from here
    } else if (url.indexOf("?campaignID=") >= 0) {
      let splitDeepLink2 = url.split("?campaignID=");
      return splitDeepLink2[0];
    } else {
      return url;
    }

  }

  findDoctorSso() {
    // setTimeout(() => {
    //   let findadoctorUrl: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("vitalsSso");
    //   this.FindadoctorService.demoLoginReqest(findadoctorUrl).
    //     subscribe(response => {
    //         if (response.result && !(response.result === 0)) {
    //           let data = this.authService.handleDecryptedResponse(response);
    //           let url= data.samlUrl;
    //           let samlKey = data.samlKey;
    //           let req = {NameValue : data.samlValue};
    //           scxmlHandler.postNewindow(url, "Find a Doctor", req);             
    //         } else {
    //           scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
    //         }
    //       }, error => {
    //         this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
    //     });
    // }, 500);
  }

}
