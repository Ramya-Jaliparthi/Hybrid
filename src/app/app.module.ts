import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';

import { AccordionComponent } from './../components/accordion/accordion';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DashboardCardComponent } from '../components/dashboard-card/dashboard-card';
import { MessageCenterCardComponent } from '../components/message-center-card/message-center-card';
import { CardProvider } from '../providers/card/card';
import { ValidationProvider } from '../providers/validation/ValidationService';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AppProvider } from '../providers/app/app';
import { ConfigProvider } from '../providers/config/config';
import { MyDoctorPage } from '../pages/my-doctor/my-doctor';
import { MyClaimsPage } from '../pages/my-claims/my-claims';
import { MyNewsPage } from '../pages/my-news/my-news';
import { MyNewsFitnessPage } from '../pages/my-news/my-news-fitness';
import { MyNewsWellnessPage } from '../pages/my-news/my-news-wellness';
import { MyNewsInjuriesPage } from '../pages/my-news/my-news-injuries';
import { MyNewsMsgCtrPage1 } from '../pages/my-news/my-news-msgCtrPage1';
import { MyNewsMsgCtrPage2 } from '../pages/my-news/my-news-msgCtrPage2';
import { MyNewsMsgCtrPage3 } from '../pages/my-news/my-news-msgCtrPage3';
import { MyFinancialPage } from '../pages/my-financial/my-financial';
import { MyFitnessPage } from '../pages/my-fitness/my-fitness';
import { CardPersonalizePage } from '../pages/card-personalize/card-personalize';
import { MyDoctorCardComponent } from '../components/my-doctor-card/my-doctor-card';
import { CardDirective } from '../components/dashboard-card/card-directive';
import { MyClaimsCardComponent } from '../components/my-claims-card/my-claims-card';
import { UserContextProvider } from '../providers/user-context/user-context';
import { HintQuestionsPopoverPage } from '../components/hint-questions-popover/hint-questions-popover';
import { IdleTimerService } from '../providers/utils/idle-timer-service';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { HealthNewsCardComponent } from '../components/health-news-card/health-news-card';
import { UserProfileCardComponent } from '../components/user-profile-card/user-profile-card';
import { MsgCenterDrupalCardComponent } from '../components/health-news-card/msg-center-drupal-card';
import { HealthyLiving } from '../components/health-news-card/healthy-living-card';
import { UserProfileCardDrupal } from '../components/user-profile-card/user-profile-drupal';
import { FitnessCard } from '../components/health-news-card/my-fitness-card';
import { Wellness } from '../components/health-news-card/wellness-card';
import { Injuries } from '../components/health-news-card/injuries-card';
import { MsgCtrPage1 } from '../components/health-news-card/msgCtrPage1-card';
import { MsgCtrPage2 } from '../components/health-news-card/msgCtrPage2-card';
import { MsgCtrPage3 } from '../components/health-news-card/msgCtrPage3-card';
import { MessageProvider } from '../providers/message/message';
import { FindADoctorCardComponent } from '../components/find-a-doctor-card/find-a-doctor-card';
import { ContactUsCardComponent } from '../components/contact-us-card/contact-us-card';
import { MyFinancialsCardComponent } from '../components/my-financials-card/my-financials-card';
import { MyMedicationCardComponent } from '../components/my-medications-card/my-medications-card';
import { AuthenticationDetailsComponent } from '../components/authentication-details/authentication-details';
import { MessageCard } from '../components/message-card/message-card';
import { LearnMoreComponent } from '../components/learn-more/learn-more';
import { AuthenticationStateProvider } from '../providers/login/authentication.state';
import { FeatureGuidePage } from '../pages/about/feature-guide/feature-guide';

import { AuthPersonalInfo } from '../pages/authentication/auth-personal-info';
import { AuthPersonalInfoService } from '../pages/authentication/auth-personal-info.service';
import { MyCardsPage } from '../pages/my-cards/my-cards';
import { MyCardsService } from '../pages/my-cards/my-cards.service';
import { MyMedicationsPage } from '../pages/my-medications/my-medications';
import { MyMedicationsService } from '../pages/my-medications/my-medications.service';
import { MyPlanPage } from '../pages/my-plan/my-plan';
import { MyPlanService } from '../pages/my-plan/my-plan-service';
import { MySettingsPage } from '../pages/my-settings/my-settings';
import { ChangePassword } from '../pages/my-settings/change-password';
import { AboutPage } from '../pages/about/about';
import { TermsAndCondition } from '../pages/about/termsAndConditions';
import { PrivacyPolicy } from '../pages/about/privacyPolicy';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { MemberInformationPage } from '../pages/member-information/member-information';
import { MemberInformationService } from '../pages/member-information/member-information.service';
import { SsnAuthPage } from '../pages/ssn-auth/ssn-auth';
import { SsnAuthService } from '../pages/ssn-auth/ssn-auth.service';
import { VerifyPasscodePage } from '../pages/verify-passcode/verify-passcode';
import { AuthVerificationSuccessPage } from '../pages/auth-verification-success/auth-verification-success';
import { UMVerificationSuccessPage } from '../pages/user-migration-success/user-migration-success';
import { ForgotUsername } from '../pages/forgot-username/forgot-username';
import { ForgotUserNameService } from '../pages/forgot-username/forgot-username.service';
import { ForgotPassword } from '../pages/forgot-password/forgot-password';
import { ForgotPasswordService } from '../pages/forgot-password/forgot-password.service';
import { AuthPersonalInfoPage } from '../pages/authentication/auth-personal-info-page';
import { AuthPromoPage } from '../pages/authentication/auth-promo';
import { AuthOptInPromoPage } from '../pages/authentication/auth-optin-promo';
import { TextMaskModule } from 'angular2-text-mask';

import { MyClaimDetailPage } from '../pages/my-claims/my-claim-detail';
import { MyClaimsFilterPopoverPage } from '../pages/my-claims/filter-popover';
import { ClaimsFilter } from '../pages/my-claims/my-claim-filter';
import { visitTypeFilter } from '../utils/visit-type-filter';
import { OrderByPipe } from '../utils/sort';
import { PhonePipe } from '../utils/PhonePipe';
import { SafeHtmlPipe } from '../utils/SafeHtmlPipe';
import { dateFilter } from '../utils/dateFilter';


/**
 * Login module related components and services
 */
import { LoginComponent } from '../pages/login/login.component';
import { RegistrationComponent } from '../pages/login/registration.component';
import { RegistrationComponentService } from '../pages/login/registration.service';
import { ControlMessages } from '../utils/ControlMessages.component'
import { ComponentRegistryProvider } from '../providers/component-registry/component-registry';

import { LoginService } from '../pages/login/login.service';
import { AuthenticationService } from '../providers/login/authentication.service';
import { LoadingMaskProvider } from '../providers/loading-mask/loading-mask';
import { PopoverPage } from '../pages/my-doctor/dependents-popover';
import { OptionsPopoverPage } from '../pages/my-doctor/options-popover';
import { MedicationPopoverPage } from '../pages/my-medications/dependents-popover';
import { MedicationOptionsPopoverPage } from '../pages/my-medications/medication-options-popover';
import { MyCardsDetailPage } from '../pages/my-cards/my-cards-detail';
import { CardsPopoverPage } from '../pages/my-cards/dependents-popover';
import { CardsOptionsPopoverPage } from '../pages/my-cards/options-popover';
import { VisitHistoryPage } from '../pages/my-doctor/visit-history';
import { MedicationPrescriptionHistoryPage } from '../pages/my-medications/medication-prescription-history';
import { AlertMessage } from '../components/alert-message-card/alert-message-card';
import { MySecurityPage } from '../pages/my-settings/security-pin';
import { MyPlanInfoPage } from '../pages/my-plan/my-plan-info';
import { ResetUserName } from '../pages/login/resetUserName';

import { AlertService } from '../providers/utils/alert-service';

import { UserDevicesMappingProvider } from '../evacafe/providers/user-devices-mapping/user-devices-mapping';
import { MessageCenterPage } from "../pages/message-center/message-center";
import { MessageCenterDetailPage } from "../pages/message-center/message-center-detail";
import { SecurityQuestionsPage } from "../pages/ssn-auth/security-questions";
import { SecurityQuestionsService } from "../pages/ssn-auth/security-questions.service";
import { VerifySecurityQuestionsPage } from "../pages/ssn-auth/verify-security-questions";
import { LearnMorePage } from "../pages/about/learnMore";
import { MyClaimsService } from '../pages/my-claims/my-claims-service';
import { MyDoctorService } from '../pages/my-doctor/my-doctor-service';
import { MessageCenterService } from '../pages/message-center/message-center.service';
import { MySettingsService } from '../pages/my-settings/my-settings-service';
import { ChangePasswordService } from '../pages/my-settings/change-password-service';
import { VerifyPasscodeService } from '../pages/verify-passcode/verifi-password-service';
import { PasswordValidation } from '../components/password-validation/password-validation';
import { UpdatePassword } from '../pages/user-migration/update-password';
import { UserMigrationComponent } from '../pages/user-migration/user-migration';
import { UserMigrationService } from '../pages/user-migration/user-migration-service';
import { MyProfilePage } from '../pages/my-settings/my-profile';
import { UpdateForgorPasswordComponent } from '../pages/forgot-password/update-password';
import { SettingsInfoPopOver } from '../components/settings-info-popoever/settings-info-popoever';
import { MyFinancialService } from './../pages/my-financial/my-financial-service';

//Financials
import { FinancialLandingPage } from '../pages/financials/financial-landing/financial-landing';
import { FinancialAccountDetailsPage } from './../pages/financials/financial-account-details/financial-account-details';
import { FinancialsService } from '../pages/financials/common/financials-service';
import { MakePaymentPage } from '../pages/financials/make-payment/make-payment';
import { ManageBankAccPage } from '../pages/financials/manage-bank-accounts/manage-bank-account';
import { SchedulePaymentPage } from '../pages/financials/schedule-payment/schedule-payment';
import { AlegeusTermsPage } from '../pages/financials/alegeus-terms/alegeus-terms';
import { PreviousAccountPage } from '../pages/financials/previous-account/previous-account';
import { ManageDebitCardsPage } from '../pages/financials/manage-debit-cards/manage-debit-cards';
import { ManageCardDetailsPage } from '../pages/financials/manage-card-details/manage-card-details';
import { ManageCardsService } from '../pages/financials/manage-debit-cards/manage-cards-service';
import { MakePaymentLandingPage } from '../pages/financials/make-payment-landing/make-payment-landing';
import { PaymentSuccessPage } from '../pages/financials/payment-success/payment-success';
import { PaymentSavePage } from '../pages/financials/payment-save/payment-save';
import { TranscationDetailsPage } from '../pages/financials/transcation-details/transcation-details';

// FAD
import { FadPage } from '../pages/fad/fad-landing/fad';
import { FadHomeSearchPage } from '../pages/fad/fad-home-search/fad-home-search';
import { FadAllProcedureAndSpecialityPage } from '../pages/fad/fad-all-procedure-and-speciality/fad-all-procedure-and-speciality';
import { FadLandingPageSearchResultsPage } from '../pages/fad/fad-landing-page-search-results/fad-landing-page-search-results';
import { FadSearchListPage } from '../pages/fad/fad-search-list/fad-search-list';
import { FadMedicalIndexPage } from '../pages/fad/fad-medical-index/fad-medical-index.component'
import { FindDoctorPage } from '../pages/find-doctor/find-doctor';
import { FindadoctorService } from '../pages/find-doctor/find-doctor.services';
import { FadMedicalIndexService } from '../pages/fad/fad-medical-index/fad-medical-index.service';
import { FadSearchResultsService } from '../pages/fad/fad-landing-page-search-results/fad-search-results.service';
import { FadService } from '../pages/fad/fad-landing/fad.service';
import { FadHomeSearchService } from '../pages/fad/fad-home-search/fad-home-search.service';
import { FadProfileCardPage } from '../pages/fad/fad-profile-card/fad-profile-card';
import { FadDoctorProfilePage } from '../pages/fad/fad-doctor-profile/fad-doctor-profile';
import { FadFacilityCardPage } from '../pages/fad/fad-facility-card/fad-facility-card';
import { FadFacilityListPage } from '../pages/fad/fad-facility-list/fad-facility-list';
import { FadFacilityProfilePage } from '../pages/fad/fad-facility-profile/fad-facility-profile';
import { FadDoctorProfileDetailService } from '../pages/fad/fad-doctor-profile/fad-doctor-profile.service';
import { FadFacilityProfileDetailService } from '../pages/fad/fad-facility-profile/fad-facility-profile.service';

import { MatchTextHighlightPipe } from '../pipes/match-text-hightlight/match-text-hightlight.pipe'
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { AddProviderPage } from '../pages/financials/add-provider/add-provider';
import { MakePaymentService } from "../pages/financials/make-payment/make-payment-service";

// 
import { ControlMessagesComponent } from './app-control-messages/app-control-messages.component';
import { ValidationService } from './app-control-messages/validation.service'


@NgModule({
  declarations: [
    MyApp,
    AccordionComponent,
    FindDoctorPage,
    DashboardPage,
    DashboardCardComponent,
    MessageCenterCardComponent,
    MyDoctorPage,
    MyClaimsPage,
    MyNewsPage,
    MyFinancialPage,
    MyFitnessPage,
    CardPersonalizePage,
    MyDoctorCardComponent,
    CardDirective,
    MyClaimsCardComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    ControlMessages,
    HealthNewsCardComponent,
    UserProfileCardComponent,
    MsgCenterDrupalCardComponent,
    HealthyLiving,
    UserProfileCardDrupal,
    FitnessCard,
    Wellness,
    Injuries,
    HintQuestionsPopoverPage,
    MsgCtrPage1,
    MsgCtrPage2,
    MsgCtrPage3,
    UserMigrationComponent,
    FindADoctorCardComponent,
    ContactUsCardComponent,
    MyFinancialsCardComponent,
    MyMedicationCardComponent,
    AuthenticationDetailsComponent,
    AuthPersonalInfo,
    MessageCard,
    LearnMoreComponent,
    MyCardsPage,
    MyMedicationsPage,
    MyMedicationsPage,
    MyPlanPage,
    MySettingsPage,
    ChangePassword,
    AboutPage,
    ContactUsPage,
    MemberInformationPage,
    SsnAuthPage,
    VerifyPasscodePage,
    AuthVerificationSuccessPage,
    UMVerificationSuccessPage,
    PrivacyPolicy,
    TermsAndCondition,
    FeatureGuidePage,
    ForgotUsername,
    ForgotPassword,
    AuthPersonalInfoPage,
    AuthPromoPage,
    MyNewsFitnessPage,
    MyNewsWellnessPage,
    MyNewsInjuriesPage,
    MyNewsMsgCtrPage1,
    MyNewsMsgCtrPage2,
    MyNewsMsgCtrPage3,
    MyClaimDetailPage,
    PopoverPage,
    OptionsPopoverPage,
    MedicationPopoverPage,
    MedicationOptionsPopoverPage,
    MyCardsDetailPage,
    VisitHistoryPage,
    CardsPopoverPage,
    CardsOptionsPopoverPage,
    MedicationPrescriptionHistoryPage,
    MyClaimsFilterPopoverPage,
    ClaimsFilter,
    AuthOptInPromoPage,
    OrderByPipe,
    AlertMessage,
    MySecurityPage,
    visitTypeFilter,
    PhonePipe,
    MyPlanInfoPage,
    ResetUserName,
    MessageCenterPage,
    MessageCenterDetailPage,
    SafeHtmlPipe,
    dateFilter,
    SecurityQuestionsPage,
    VerifySecurityQuestionsPage,
    LearnMorePage,
    PasswordValidation,
    UpdatePassword,
    MyProfilePage,
    UpdateForgorPasswordComponent,
    SettingsInfoPopOver,
    FadPage,
    FadHomeSearchPage,
    FadAllProcedureAndSpecialityPage,
    FadLandingPageSearchResultsPage,
    FadDoctorProfilePage,
    FadSearchListPage,
    FinancialLandingPage,
    MakePaymentLandingPage,
    PreviousAccountPage,
    TranscationDetailsPage,
    ManageCardDetailsPage,
    ManageDebitCardsPage,
    FadMedicalIndexPage,
    FadProfileCardPage,
    FadFacilityListPage,
    FadFacilityProfilePage,
    FadFacilityCardPage,
    FinancialAccountDetailsPage,
    MatchTextHighlightPipe,
    StarRatingComponent,
    MakePaymentPage,
    ManageBankAccPage,
    SchedulePaymentPage,
    AddProviderPage,
    ControlMessagesComponent,
    AlegeusTermsPage,
    PaymentSuccessPage,
    PaymentSavePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { animate: false }),
    CommonModule,
    HttpModule,
    HttpClientModule,
    TextMaskModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FindDoctorPage,
    DashboardPage,
    DashboardCardComponent,
    MessageCenterCardComponent,
    MyDoctorPage,
    MyClaimsPage,
    MyNewsPage,
    MyFinancialPage,
    MyFitnessPage,
    CardPersonalizePage,
    MyDoctorCardComponent,
    MyClaimsCardComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    ControlMessages,
    HealthNewsCardComponent,
    UserProfileCardComponent,
    MsgCenterDrupalCardComponent,
    HealthyLiving,
    UserProfileCardDrupal,
    FitnessCard,
    Wellness,
    Injuries,
    MsgCtrPage1,
    MsgCtrPage2,
    MsgCtrPage3,
    UserMigrationComponent,
    HintQuestionsPopoverPage,
    FindADoctorCardComponent,
    ContactUsCardComponent,
    MyFinancialsCardComponent,
    MyMedicationCardComponent,
    AuthenticationDetailsComponent,
    AuthPersonalInfo,
    MessageCard,
    LearnMoreComponent,
    MyCardsPage,
    MyMedicationsPage,
    MyMedicationsPage,
    MyPlanPage,
    MySettingsPage,
    ChangePassword,
    AboutPage,
    ContactUsPage,
    MemberInformationPage,
    SsnAuthPage,
    VerifyPasscodePage,
    AuthVerificationSuccessPage,
    UMVerificationSuccessPage,
    PrivacyPolicy,
    TermsAndCondition,
    FeatureGuidePage,
    ForgotUsername,
    ForgotPassword,
    AuthPersonalInfoPage,
    AuthPromoPage,
    MyNewsFitnessPage,
    MyNewsWellnessPage,
    MyNewsInjuriesPage,
    MyNewsMsgCtrPage1,
    MyNewsMsgCtrPage2,
    MyNewsMsgCtrPage3,
    MyClaimDetailPage,
    PopoverPage,
    OptionsPopoverPage,
    MedicationPopoverPage,
    MedicationOptionsPopoverPage,
    MyCardsDetailPage,
    VisitHistoryPage,
    CardsPopoverPage,
    CardsOptionsPopoverPage,
    MedicationPrescriptionHistoryPage,
    MyClaimsFilterPopoverPage,
    AuthOptInPromoPage,
    MySecurityPage,
    AlertMessage,
    MyPlanInfoPage,
    ResetUserName,
    MessageCenterPage,
    MessageCenterDetailPage,
    SecurityQuestionsPage,
    VerifySecurityQuestionsPage,
    LearnMorePage,
    PasswordValidation,
    UpdatePassword,
    MyProfilePage,
    UpdateForgorPasswordComponent,
    SettingsInfoPopOver,
    FadPage,
    FadHomeSearchPage,
    FadAllProcedureAndSpecialityPage,
    FadLandingPageSearchResultsPage,
    FadSearchListPage,
    FinancialLandingPage,
    MakePaymentLandingPage,
    PreviousAccountPage,
    ManageCardDetailsPage,
    ManageDebitCardsPage,
    TranscationDetailsPage,
    FadMedicalIndexPage,
    FadProfileCardPage,
    FadDoctorProfilePage,
    FadFacilityListPage,
    FadFacilityProfilePage,
    FadFacilityCardPage,
    FinancialAccountDetailsPage,
    StarRatingComponent,
    MakePaymentPage,
    ManageBankAccPage,
    SchedulePaymentPage,
    AddProviderPage,
    AlegeusTermsPage,
    PaymentSuccessPage,
    PaymentSavePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CardProvider,
    AppProvider,
    FindadoctorService,
    ConfigProvider,
    LoadingMaskProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigFactory,
      deps: [ConfigProvider],
      multi: true
    },
    DatePipe,
    UserContextProvider,
    MessageProvider,
    ValidationProvider,
    ComponentRegistryProvider,
    AuthenticationService,
    AuthenticationStateProvider,
    ClaimsFilter,
    visitTypeFilter,
    OrderByPipe,
    PhonePipe,
    UserDevicesMappingProvider,
    IdleTimerService,
    AlertService,
    SafeHtmlPipe,
    dateFilter,
    LoginService,
    ForgotUserNameService,
    AuthPersonalInfoService,
    MemberInformationService,
    RegistrationComponentService,
    MyPlanService,
    MyClaimsService,
    MyDoctorService,
    MessageCenterService,
    MyCardsService,
    MySettingsService,
    ChangePasswordService,
    VerifyPasscodeService,
    ForgotPasswordService,
    MyMedicationsService,
    SsnAuthService,
    SecurityQuestionsService,
    UserMigrationService,
    MyFinancialService,
    FinancialsService,
    FadMedicalIndexService,
    FadSearchResultsService,
    FadDoctorProfileDetailService,
    FadFacilityProfileDetailService,
    FadHomeSearchService,
    FadService,
    MakePaymentService,
    ValidationService,
    ManageCardsService,
  ]
})
export class AppModule { }

export function ConfigFactory(config: ConfigProvider) {
  return () => config.load();
}
