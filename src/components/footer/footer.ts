import { Component, Input } from '@angular/core';
import { NavController, ViewController, Platform, AlertController } from 'ionic-angular';
import { MyCardsPage } from '../../pages/my-cards/my-cards';
import { MyMedicationsPage } from '../../pages/my-medications/my-medications';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { MyDoctorPage } from '../../pages/my-doctor/my-doctor';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { AuthOptInPromoPage } from '../../pages/authentication/auth-optin-promo';
import { LoginComponent } from '../../pages/login/login.component';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConfigProvider } from '../../providers/config/config';
import { DashboardPage } from '../../pages/dashboard/dashboard';

declare var scxmlHandler: any;
@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {

  @Input() activeTab: string;
  hideFooter: boolean = false;

  constructor(private nav: NavController,
    public userContext: UserContextProvider,
    private authService: AuthenticationService,
    private config: ConfigProvider,
    private platform: Platform,
    private viewController: ViewController,
    private alertCtrl: AlertController) {

    this.viewController.didEnter.subscribe(
      () => {

        this.userContext.setFooterInstance(this);
      }
    );
    if (platform.is('android')) {
      this.hide();
    }

    if (this.userContext.getFooterInstance() && !this.platform.is('android') && this.platform.is('ipad')) {
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

  hide() {
    this.hideFooter = true;
  }

  show() {
    this.hideFooter = false;
  }

  launchApp(app) {
    this.authService.pageName = app;
    scxmlHandler.playSoundWithHapticFeedback();
    // if messagecenter icon was previously clicked and user cliks other menu options, then reset deeplink
    if(this.authService.getDeepLink() == "://messagecenter"){
      this.authService.setDeepLink("");
    }
    if (this.userContext.getLoginState() == LoginState.Anonymous && app != "home") {

      if (this.nav.getActive().component.name != "LoginComponent")
        this.nav.push(LoginComponent);
      return;
    }
    else if (this.userContext.getLoginState() == LoginState.Registered && app != "home") {
      
      this.nav.push(AuthOptInPromoPage);
      return;
    }
    if (app == this.activeTab)
      return;

    if (app == "home") {
      //this.nav.popToRoot({ animate: false, direction: "forward" });
      this.nav.setRoot(DashboardPage);
    } else if (app == "myCards") {
      if (this.config.remoteConfigMap.has("footerMyCard")) {
        let config = this.config.remoteConfigMap.get("footerMyCard");
        if (config && config.action == "disable") {
          this.showAlert(config);
        }
        else {
          this.nav.push(MyCardsPage);
        }
      } else {
        this.nav.push(MyCardsPage);
      }
    } else if (app == "myMedications") {
      if (this.config.remoteConfigMap.has("footerMyMedication")) {
        let config = this.config.remoteConfigMap.get("footerMyMedication");
        if (config && config.action == "disable") {
          this.showAlert(config);
        }
        else {
          scxmlHandler.sendAnalytics('linkClick', app, 'components/footer/footer.html');
          this.nav.push(MyMedicationsPage);
        }
      } else {
        scxmlHandler.sendAnalytics('linkClick', app, 'components/footer/footer.html');
        this.nav.push(MyMedicationsPage);
      }

    } else if (app == "myClaims") {
      if (this.config.remoteConfigMap.has("footerMyClaims")) {
        let config = this.config.remoteConfigMap.get("footerMyClaims");
        if (config && config.action == "disable") {
          this.showAlert(config);
        }
        else {
          this.nav.push(MyClaimsPage);
        }
      } else {
        this.nav.push(MyClaimsPage);
      }
    } else if (app == "myDoctors") {
      if (this.config.remoteConfigMap.has("footerMyDoctor")) {
        let config = this.config.remoteConfigMap.get("footerMyDoctor");
        if (config && config.action == "disable") {
          this.showAlert(config);
        }
        else {
          this.nav.push(MyDoctorPage);
        }
      } else {
        this.nav.push(MyDoctorPage);
      }
    }

  }

  showAlert(config) {
    setTimeout(() => {
      let alert = this.alertCtrl.create({
        message: config.disabledmsg,
        buttons: ['Ok']
      }
      );
      alert.present();
      this.authService.setAlert(alert);
    }, 300);
  }

}
