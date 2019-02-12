import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { FooterComponent } from '../../components/footer/footer';
import { MessageProvider } from '../../providers/message/message';
import { Platform } from 'ionic-angular';
import { IdleTimerService } from '../../providers/utils/idle-timer-service';

export enum LoginState { Anonymous, LoggedIn, Registered };

declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Injectable()
export class UserContextProvider {

  private loginState: number = LoginState.Anonymous;
  private privacyPolicy: any = null;
  private termsAndConditions: any = null;
  private contactUs: any = null;
  private wellnessNewsData: any = null;
  private fitnessNewsData: any = null;
  private healthyLivingNewsData: any = null;
  private injuriesNewsData: any = null;
  private msgCenterNewsData: Array<any> = [];
  private dependentsList: Array<any> = null;
  private cardsFrontData: any = null;
  private cardsBackData: any = null;
  private footerInstance: FooterComponent = null;
  private authenticateNowPromoTaped = false;
  private alerts: Array<any> = [];
  private isPopoverActive: boolean = false;
  private refreshTimerHandler: any = null;
  private isVerifycodeRequested: any = "false";
  private financialsData: any = null;
  private financialsErrorMsg: string = null;
  private customBackHandler: any = null;
  private currentView: any = null;
  private myPlanInfo: any = null;
  private showFeatureGuide: boolean = false;
  private showLoginAlert: boolean = false;
  private userProfileDrupalData: any = null;

  //Required for Evacafe internal handling.
  private dmId: string;
  private loginId: string;
  private deviceType: string;
  private deviceIdentifier: string;

  constructor(public http: HttpClient, private messageProvider: MessageProvider,
    private platform: Platform,
    private idleTimerService: IdleTimerService) {
    this.dmId = scxmlHandler.getDMId();
    this.deviceIdentifier = scxmlHandler.getDeviceIdentifier();
  }

  clearSessionData() {
    this.privacyPolicy = null;
    this.termsAndConditions = null;
    this.contactUs = null;
    //this.wellnessNewsData = null;
    this.injuriesNewsData = null;
    //this.fitnessNewsData = null;
    //this.healthyLivingNewsData = null;
    this.dependentsList = null;
    this.cardsFrontData = null;
    this.cardsBackData = null;
    this.loginState = LoginState.Anonymous;
    this.footerInstance = null;
    this.alerts = [];
    this.authenticateNowPromoTaped = false;
    this.isVerifycodeRequested = "false";
    this.isPopoverActive = false;
    this.financialsData = null;
    this.clearRefreshTimerHandle();
    this.customBackHandler = null;
    this.currentView = null;
    this.myPlanInfo = null;
    this.financialsErrorMsg = null;
    this.userProfileDrupalData = null;

    //Required for Evacafe internal handling
    this.dmId = null;
    this.loginId = null;
    this.deviceType = null;
    this.deviceIdentifier = null;
    this.idleTimerService.clearIdleTimer();
  }

  getShowFeatureGuide() {
    return this.showFeatureGuide;
  }

  setShowFeatureGuide(featureGuideFlag) {
    this.showFeatureGuide = featureGuideFlag;
  }

  getShowLoginAlert() {
    if (!evaSecureStorage.getItem("SHOW_LOGIN_ALERT")) {
      this.showLoginAlert = true;
      evaSecureStorage.setItem("SHOW_LOGIN_ALERT", "done");
    } else {
      this.showLoginAlert = false;
    }
    return this.showLoginAlert;
  }

  setDMId(dmId) {
    this.dmId = dmId;
  }

  getDMId() {
    return this.dmId;
  }

  setLoginId(loginId) {
    this.loginId = loginId;
  }

  getLoginId() {
    return this.loginId;
  }

  getDeviceType() {

    if (!this.deviceType) {
      let os = "";
      if (this.platform.is('android'))
        os = "Android";
      else if (this.platform.is('ios'))
        os = "iOS";
      else if (this.platform.is('windows'))
        os = "Windows";
      else
        os = "Desktop";
      this.deviceType = os;
    }
    return this.deviceType;
  }

  setDeviceIdentifier(deviceId) {
    this.deviceIdentifier = deviceId;
  }

  getDeviceIdentifier() {
    return this.deviceIdentifier;
  }

  setIsPopoverActive(isActive) {
    this.isPopoverActive = isActive;
    if (isActive) {
      this.messageProvider.sendMessage("POPOVER_ACTIVE", true);
    } else {
      this.messageProvider.sendMessage("POPOVER_ACTIVE", false);
    }
  }

  getCurrentView() {
    return this.currentView;
  }

  setCurrentView(view) {
    this.currentView = view;
  }

  getCustomBackHandler() {
    return this.customBackHandler;
  }

  setCustomBackHandler(handler) {
    this.customBackHandler = handler;
  }

  getIsPopoverActive() {
    return this.isPopoverActive;
  }

  setFooterInstance(footer: FooterComponent) {
    this.footerInstance = footer;
  }

  getFooterInstance(): FooterComponent {
    return this.footerInstance;
  }

  setLoginState(loginState: number) {
    this.loginState = loginState;
  }

  getLoginState(): number {
    return this.loginState;
  }
  getHealthyLivingInfo() {
    return this.healthyLivingNewsData;
  }
  setHealthyLivingInfo(healthyLivingInfo: any) {
    this.healthyLivingNewsData = healthyLivingInfo;
    this.messageProvider.sendMessage("HEALTHY_LIVING_NEWS", this.healthyLivingNewsData);
  }
  getFitnessInfo() {
    return this.fitnessNewsData;
  }
  setFitnessInfo(fitnessInfo: any) {
    this.fitnessNewsData = fitnessInfo;
    this.messageProvider.sendMessage("FITNESS_INFO_NEWS", this.fitnessNewsData);
  }
  getWellnessInfo() {
    return this.wellnessNewsData;
  }
  setWellnessInfo(wellnessInfo: any) {
    this.wellnessNewsData = wellnessInfo;
    this.messageProvider.sendMessage("WELLNESS_NEWS", this.wellnessNewsData);
  }
  getMessageCenterInfo() {
    return this.msgCenterNewsData;
  }
  setMessageCenterInfo(messagesInfo: any) {
    this.msgCenterNewsData = messagesInfo;
    this.messageProvider.sendMessage("MSGCENTER_NEWS", this.injuriesNewsData);
  }
  getInjuriesInfo() {
    return this.injuriesNewsData;
  }
  setInjuriesInfo(injuriesInfo: any) {
    this.injuriesNewsData = injuriesInfo;
    this.messageProvider.sendMessage("INJURIES_NEWS", this.injuriesNewsData);
  }

  getPrivacyPolicy() {
    return this.privacyPolicy;
  }
  setPrivacyPolicy(privacyPolicy: any) {
    this.privacyPolicy = privacyPolicy;
  }

  getTermsAndConditions() {
    return this.termsAndConditions;
  }

  setTermsAndConditions(termsAndConditions: any) {
    this.termsAndConditions = termsAndConditions;
  }

  getContactUs() {
    return this.contactUs;
  }

  setContactUs(contactUs: any) {
    this.contactUs = contactUs;
  }

  setDependentsList(dependentsList: Array<any>) {

    let temp: Array<any> = [];
    dependentsList.forEach((element => {
      if (element.depFirstName)
        element.depFirstName = element.depFirstName.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

      if (element.depLastName)
        element.depLastName = element.depLastName.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

      temp.push(element);
    }));

    this.dependentsList = temp;

  }
  getDependentsList() {
    return this.dependentsList;
  }

  setCardsFrontData(cardsFrontData: any) {
    this.cardsFrontData = cardsFrontData;
  }

  getCardsFrontData() {
    return this.cardsFrontData;
  }

  setCardsBackData(cardsBackData: any) {
    this.cardsBackData = cardsBackData;
  }

  getCardsBackData() {
    return this.cardsBackData;
  }

  setAuthenticateNowPromoTaped(value: boolean) {
    this.authenticateNowPromoTaped = value;
  }

  getAuthenticateNowPromoTaped() {
    return this.authenticateNowPromoTaped;
  }

  setAlerts(serviceAlerts: Array<any>) {
    this.alerts = serviceAlerts;
  }

  getAlerts() {
    return this.alerts;
  }

  setIsVerifycodeRequested(userId, booleanVal) {
    evaSecureStorage.setItem(userId + "_isVerifycodeRequested", booleanVal);

  }
  getIsVerifycodeRequested(userId) {

    if (this.isVerifycodeRequested == "false") {
      let savedStatus = evaSecureStorage.getItem(userId + "_isVerifycodeRequested");
      if (savedStatus != null && savedStatus == "true")
        this.isVerifycodeRequested = "true";
    }

    return this.isVerifycodeRequested;
  }

  setRefreshTimerHandle(handler) {
    this.refreshTimerHandler = handler;
  }
  clearRefreshTimerHandle() {
    if (this.refreshTimerHandler != null)
      window.clearTimeout(this.refreshTimerHandler);
  }

  setFinancialsData(financialsData) {
    this.financialsData = financialsData;
  }

  getFinancialsData() {
    return this.financialsData;
  }
  setFinancialsDataError(errorMsg) {
    this.financialsErrorMsg = errorMsg;
  }
  getFinancialsDataError() {
    return this.financialsErrorMsg;
  }
  getPlanInfo() {
    return this.myPlanInfo;
  }
  setPlanInfo(info: any) {
    this.myPlanInfo = info;
  }

  getUserProfileDrupalData() {
    return this.userProfileDrupalData;
  }
  setUserProfileDrupalData(userProfileDrupalData: any) {
    this.userProfileDrupalData = userProfileDrupalData;
    this.messageProvider.sendMessage("USER_PROFILE_DRUPAL_DATA", this.userProfileDrupalData);
  }
}
