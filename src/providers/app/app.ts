import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../../components/dashboard-card/app-config';
import { MyDoctorPage } from '../../pages/my-doctor/my-doctor';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { MyFinancialPage } from '../../pages/my-financial/my-financial';
import { LoginState } from '../../providers/user-context/user-context';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { MyCardsPage } from '../../pages/my-cards/my-cards';
import { MyMedicationsPage } from '../../pages/my-medications/my-medications';
import { MyPlanPage } from '../../pages/my-plan/my-plan';
import { MySettingsPage } from '../../pages/my-settings/my-settings';
import { AboutPage } from '../../pages/about/about';
import { ContactUsPage } from '../../pages/contact-us/contact-us';
import { ConfigProvider } from '../../providers/config/config';
import { FindADoctorCardComponent } from '../../components/find-a-doctor-card/find-a-doctor-card';

//Visiblity of app in the menu items.
export enum AppVisibility { Anonymous, LoggedIn, AnonymousOnly, Hidden, Registered, RegisteredOnly }

@Injectable()
export class AppProvider {

  private appConfig: AppConfig[] = [
    { id: DashboardPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "Home", icon: this.config.assets_url + "/images/icons-ios/Asset81@2x.png", order: 1 },
    // {id: CardPersonalizePage, visibilityState: AppVisibility.LoggedIn, title: "Personalize", icon: this.config.assets_url+"/images/icons-ios/Asset88@2x.png", order: 2},
    { id: MyCardsPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "My Cards", icon: this.config.assets_url + "/images/icons-ios/Asset85@2x.png", order: 3 },
    { id: MyClaimsPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "My Claims", icon: this.config.assets_url + "/images/icons-ios/Asset86@2x.png", order: 4 },
    { id: MyDoctorPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "My Doctors", icon: this.config.assets_url + "/images/icons-ios/Asset84@2x.png", order: 5 },
    { id: MyFinancialPage, enabled: false, visibilityState: AppVisibility.Anonymous, title: "My Financials", icon: this.config.assets_url + "/images/icons-ios/Asset82@2x.png", order: 6 },
    { id: FindADoctorCardComponent, enabled: true, visibilityState: AppVisibility.Anonymous, title: "Find a Doctor & Estimate Costs", icon: this.config.assets_url + "/images/icons-ios/Asset83@2x.png", order: 7 },
    { id: MyMedicationsPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "My Medications", icon: this.config.assets_url + "/images/icons-ios/Asset87@2x.png", order: 8 },
    { id: MyPlanPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "My Plan", icon: this.config.assets_url + "/images/icons-ios/mobile-menu-myplan-ios@2x.png", order: 9 },
    { id: MySettingsPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "Settings", icon: this.config.assets_url + "/images/icons-ios/Asset90@2x.png", order: 11, startGroup: true },
    { id: AboutPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "About MyBlue App", icon: this.config.assets_url + "/images/icons-ios/Asset89@2x.png", order: 12 },
    { id: ContactUsPage, enabled: true, visibilityState: AppVisibility.Anonymous, title: "Contact Us", icon: this.config.assets_url + "/images/icons-ios/Asset88@2x.png", order: 13 },
  ];
  constructor(public http: HttpClient, private config: ConfigProvider) {
    //On Opening the app clear the localstorage, since we are not clearing while closing
  }

  getAppConfig(loginState: number, loginResponse?: any): AppConfig[] {
  //getAppConfig(loginState: number): AppConfig[] {
    let appConfig: AppConfig[];
    if (loginState == LoginState.Anonymous) {
      appConfig = this.appConfig.filter(config => {
        return config.enabled && ((config.visibilityState == AppVisibility.AnonymousOnly) || (config.visibilityState == AppVisibility.Anonymous));
      });
    } else if (loginState == LoginState.Registered) {
      appConfig = this.appConfig.filter(config => {
        return config.enabled && ((config.visibilityState == AppVisibility.RegisteredOnly) || (config.visibilityState == AppVisibility.Registered) || (config.visibilityState == AppVisibility.Anonymous));
      });
    } else if (loginState == LoginState.LoggedIn) {
      appConfig = this.appConfig.filter(config => {
        return config.enabled && ((config.visibilityState != AppVisibility.AnonymousOnly) && (config.visibilityState != AppVisibility.RegisteredOnly));
      });
      let menu = [];
      let verify = ['My Cards', 'My Plan', 'My Financials'];
      appConfig.forEach(function (data) {
        if (verify.indexOf(data.title) === -1) {
          menu.push(data);
        } else if (loginResponse.HasActivePlan == "true") {
          menu.push(data);
        }
      });
      appConfig = menu;
    }
    return appConfig;
  }

  disableApp(id) {
    this.appConfig.forEach(app => {
      if (app.id.name == id) {
        app.enabled = false;
      }
    });
  }

  enableApp(id) {
    this.appConfig.forEach(app => {
      if (app.id.name == id) {
        app.enabled = true;
      }
    });
  }

}
