import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { CardConfig } from '../../components/dashboard-card/card-config';
import { MyDoctorPage } from '../../pages/my-doctor/my-doctor';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { MyFitnessPage } from '../../pages/my-fitness/my-fitness';
import { MyFinancialPage } from '../../pages/my-financial/my-financial';
import { MyDoctorCardComponent } from '../../components/my-doctor-card/my-doctor-card';
import { MyClaimsCardComponent } from '../../components/my-claims-card/my-claims-card';
import { LoginState } from '../../providers/user-context/user-context';
import { ComponentRegistryProvider } from '../../providers/component-registry/component-registry';
import { HealthyLiving } from '../../components/health-news-card/healthy-living-card';
import { FitnessCard } from '../../components/health-news-card/my-fitness-card';
import { Wellness } from '../../components/health-news-card/wellness-card';
import { Injuries } from '../../components/health-news-card/injuries-card';
import { MsgCtrPage1 } from '../../components/health-news-card/msgCtrPage1-card';
import { MsgCtrPage2 } from '../../components/health-news-card/msgCtrPage2-card';
import { MsgCtrPage3 } from '../../components/health-news-card/msgCtrPage3-card';
import { FindADoctorCardComponent } from '../../components/find-a-doctor-card/find-a-doctor-card';
import { ContactUsCardComponent } from '../../components/contact-us-card/contact-us-card';
import { MyFinancialsCardComponent } from '../../components/my-financials-card/my-financials-card';
import { MyMedicationCardComponent } from '../../components/my-medications-card/my-medications-card';
import { AuthenticationDetailsComponent } from '../../components/authentication-details/authentication-details';
import { MessageCard } from '../../components/message-card/message-card';
import { ContactUsPage } from '../../pages/contact-us/contact-us';
import { MyMedicationsPage } from '../../pages/my-medications/my-medications';
import { MyNewsPage } from '../../pages/my-news/my-news';
import { MyNewsFitnessPage } from '../../pages/my-news/my-news-fitness';
import { MyNewsWellnessPage } from '../../pages/my-news/my-news-wellness';
import { MyNewsInjuriesPage } from '../../pages/my-news/my-news-injuries';
import { MyNewsMsgCtrPage1 } from '../../pages/my-news/my-news-msgCtrPage1';
import { MyNewsMsgCtrPage2 } from '../../pages/my-news/my-news-msgCtrPage2';
import { MyNewsMsgCtrPage3 } from '../../pages/my-news/my-news-msgCtrPage3';
import { FadPage } from '../../pages/fad/fad-landing/fad';
import { ConfigProvider } from '../../providers/config/config';
// import { FindDoctorPage } from '../../pages/find-doctor/find-doctor';
import { UserProfileCardDrupal } from '../../components/user-profile-card/user-profile-drupal';

//Visiblity of app in the menu items.
export enum CardVisibility { Anonymous, LoggedIn, AnonymousOnly, Hidden, Registered, RegisteredOnly }
declare var evaSecureStorage: any;
@Injectable()
export class CardProvider {

  private cardConfig: CardConfig[] = [

    {
      id: "MyFinancialsCard",
      title: "My Financials",
      icon: this.config.assets_url + "/images/icons-ios/Asset40@2x.png",
      entryPage: "MyFinancialPage",
      enabled: false,
      component: "MyFinancialsCardComponent",
      visibilityState: CardVisibility.LoggedIn.valueOf()

    },

    {
      id: "MyClaimsCard",
      title: "My Claims",
      icon: this.config.assets_url + "/images/icons-ios/Asset41@2x.png",
      entryPage: "MyClaimsPage",
      enabled: true,
      component: "MyClaimsCardComponent",
      visibilityState: CardVisibility.LoggedIn.valueOf()
    },
    {
      id: "MyDoctorCard",
      title: "My Doctors",
      icon: this.config.assets_url + "/images/icons-ios/home-mydoctors-icon2-ios@2x.png",
      entryPage: "MyDoctorPage",
      enabled: true,
      component: "MyDoctorCardComponent",
      visibilityState: CardVisibility.LoggedIn.valueOf()
    },
    {
      id: "MyMedicationsCard",
      title: "My Medications",
      icon: this.config.assets_url + "/images/icons-ios/home-mymeds-icon-ios@2x.png",
      entryPage: "MyMedicationsPage",
      enabled: true,
      component: "MyMedicationCardComponent",
      visibilityState: CardVisibility.LoggedIn.valueOf()
    },
    {
      id: "AuthenticationMessageCard",
      title: "Message Card",
      icon: this.config.assets_url + "/images/icons-ios/Asset51@2x.png",
      hideHeader: true,
      enabled: true,
      component: "MessageCardComponent",
      visibilityState: CardVisibility.RegisteredOnly.valueOf()
    },
    {
      id: "AuthenticationDetailsCard",
      title: "Authentication Card",
      icon: this.config.assets_url + "/images/icons-ios/Asset51@2x.png",
      hideHeader: true,
      enabled: true,
      component: "AuthenticationDetailsComponent",
      visibilityState: CardVisibility.RegisteredOnly.valueOf()
    },
    {
      id: "FindADoctorCard",
      title: "Find a Doctor & Estimate Costs",
      icon: this.config.assets_url + "/images/icons-ios/Asset51@2x.png",
      entryPage: "findDoctorPage",
      enabled: true,
      component: "FindADoctorCardComponent",
      visibilityState: CardVisibility.AnonymousOnly.valueOf()
    },

    {
      id: "WellnessCard",
      title: "Tools and Resources",
      icon: this.config.assets_url + "/images/icons-ios/Asset33@2x.png",
      entryPage: "wellnessPage",
      enabled: true,
      component: "WellnessCardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    },
    {
      id: "FitnessCard",
      title: "News and Updates",
      icon: this.config.assets_url + "/images/icons-ios/home-fitness-news-icon-ios@2x.png",
      entryPage: "fitnessPage",
      enabled: true,
      component: "FitnessCardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    },

    {
      id: "HealthyLivingPage",
      title: "Health and Wellness",
      icon: this.config.assets_url + "/images/icons-ios/Asset34@2x.png",
      entryPage: "healthyLivingPage",
      enabled: true,
      component: "HealthyLivingCardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf(),
      hideHeader: false
    },

    {
      id: "ContactUsCard",
      title: "Contact Us",
      icon: this.config.assets_url + "/images/icons-ios/Asset47@2x.png",
      entryPage: "",
      enabled: true,
      component: "ContactUsCardComponent",
      hideHeader: true,
      visibilityState: CardVisibility.Anonymous.valueOf()
    },

  ];

  private msgCenterCardConfig: CardConfig[] = [
    {
      id: "MessageCenterCard1",
      title: "",
      icon: this.config.assets_url + "/images/icons-ios/Asset33@2x.png",
      entryPage: "msgCtr1Page",
      enabled: true,
      component: "MsgCtrPage1CardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    },
    {
      id: "MessageCenterCard2",
      title: "",
      icon: this.config.assets_url + "/images/icons-ios/Asset33@2x.png",
      entryPage: "msgCtr2Page",
      enabled: true,
      component: "MsgCtrPage2CardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    },
    {
      id: "MessageCenterCard3",
      title: "",
      icon: this.config.assets_url + "/images/icons-ios/Asset33@2x.png",
      entryPage: "msgCtr3Page",
      enabled: true,
      component: "MsgCtrPage3CardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    }
  ];

  private userProfileCardsConfig: CardConfig[] = [
    {
      id: "UserProfileCard",
      title: "",
      icon: this.config.assets_url + "/images/icons-ios/Asset33@2x.png",
      entryPage: "UserProfileCardComponent",
      enabled: true,
      component: "UserProfileCardComponent",
      visibilityState: CardVisibility.Anonymous.valueOf()
    }
  ];

  constructor(public http: HttpClient, private config: ConfigProvider, componentRegistry: ComponentRegistryProvider) {

    componentRegistry.register("MyDoctorPage", MyDoctorPage);
    componentRegistry.register("MyDoctorCardComponent", MyDoctorCardComponent);

    componentRegistry.register("MyClaimsPage", MyClaimsPage);
    componentRegistry.register("MyClaimsCardComponent", MyClaimsCardComponent);

    componentRegistry.register("MyFinancialPage", MyFinancialPage);

    componentRegistry.register("MyFitnessPage", MyFitnessPage);
    componentRegistry.register("FitnessCardComponent", FitnessCard);

    componentRegistry.register("HealthyLivingCardComponent", HealthyLiving);
    componentRegistry.register("WellnessCardComponent", Wellness);
    componentRegistry.register("InjuriesCardComponent", Injuries);
    componentRegistry.register("MsgCtrPage1CardComponent", MsgCtrPage1);
    componentRegistry.register("MsgCtrPage2CardComponent", MsgCtrPage2);
    componentRegistry.register("MsgCtrPage3CardComponent", MsgCtrPage3);
    componentRegistry.register("FindADoctorCardComponent", FindADoctorCardComponent);
    componentRegistry.register("ContactUsCardComponent", ContactUsCardComponent);
    componentRegistry.register("MyFinancialsCardComponent", MyFinancialsCardComponent);
    componentRegistry.register("MyMedicationCardComponent", MyMedicationCardComponent);
    componentRegistry.register("AuthenticationDetailsComponent", AuthenticationDetailsComponent);
    componentRegistry.register("MessageCardComponent", MessageCard);

    componentRegistry.register("ContactUsPage", ContactUsPage);
    componentRegistry.register("MyMedicationsPage", MyMedicationsPage);

    componentRegistry.register("healthyLivingPage", MyNewsPage);
    componentRegistry.register("fitnessPage", MyNewsFitnessPage);
    componentRegistry.register("wellnessPage", MyNewsWellnessPage);
    componentRegistry.register("injuriesPage", MyNewsInjuriesPage);
    componentRegistry.register("msgCtr1Page", MyNewsMsgCtrPage1);
    componentRegistry.register("msgCtr2Page", MyNewsMsgCtrPage2);
    componentRegistry.register("msgCtr3Page", MyNewsMsgCtrPage3);
    componentRegistry.register("findDoctorPage", FadPage);
    // componentRegistry.register("findDoctorPage", FindDoctorPage);

    componentRegistry.register("UserProfileCardComponent", UserProfileCardDrupal);

    //Store card data from configuration only the first time.
    //if(!localStorage.getItem("DashboardCards")){
    evaSecureStorage.setItem("DashboardCards", JSON.stringify(this.cardConfig));
    //}
    evaSecureStorage.setItem("MessageCenterCards", JSON.stringify(this.msgCenterCardConfig));

    evaSecureStorage.setItem("UserProfileCards", JSON.stringify(this.userProfileCardsConfig));
  }

  getCardConfig(loginState: number): CardConfig[] {
    let cardConfig: CardConfig[];
    if (loginState == LoginState.Anonymous) {
      cardConfig = JSON.parse(evaSecureStorage.getItem("DashboardCards")).filter(config => {
        return (config.visibilityState == CardVisibility.AnonymousOnly) || (config.visibilityState == CardVisibility.Anonymous);
      });
    } else if (loginState == LoginState.Registered) {
      cardConfig = JSON.parse(evaSecureStorage.getItem("DashboardCards")).filter(config => {
        return (config.visibilityState == CardVisibility.RegisteredOnly) || (config.visibilityState == CardVisibility.Registered) || (config.visibilityState == CardVisibility.Anonymous) || (config.visibilityState == CardVisibility.AnonymousOnly);
      });
    } else if (loginState == LoginState.LoggedIn) {
      cardConfig = JSON.parse(evaSecureStorage.getItem("DashboardCards")).filter(config => {
        return (config.visibilityState != CardVisibility.AnonymousOnly) && (config.visibilityState != CardVisibility.RegisteredOnly);
      });
    }
    return cardConfig;
  }

  getMessageCenterCards(): CardConfig[] {
    let cardConfig: CardConfig[];
    cardConfig = JSON.parse(evaSecureStorage.getItem("MessageCenterCards"));
    return cardConfig;
  }

  getUserProfileCards(): CardConfig[] {
    let cardConfig: CardConfig[];
    cardConfig = JSON.parse(evaSecureStorage.getItem("UserProfileCards"));
    return cardConfig;
  }

  resetLocalStorage() {
    evaSecureStorage.setItem("DashboardCards", JSON.stringify(this.cardConfig));
    evaSecureStorage.setItem("MessageCenterCards", JSON.stringify(this.msgCenterCardConfig));
    evaSecureStorage.setItem("UserProfileCards", JSON.stringify(this.userProfileCardsConfig));
  }
}
