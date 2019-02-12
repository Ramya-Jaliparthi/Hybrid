import { Component, Input, ViewChild } from '@angular/core';
import { NavController, ViewController, MenuController, Platform, Navbar, AlertController } from 'ionic-angular';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { AuthOptInPromoPage } from '../../pages/authentication/auth-optin-promo';
import { MyCardsPage } from '../../pages/my-cards/my-cards';
import { MyMedicationsPage } from '../../pages/my-medications/my-medications';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { MyDoctorPage } from '../../pages/my-doctor/my-doctor';
import { LoginComponent } from '../../pages/login/login.component';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { MessageCenterPage } from "../../pages/message-center/message-center";
import { ConstantsService } from '../../providers/constants/constants.service';
import { DashboardPage } from '../../pages/dashboard/dashboard';

declare var scxmlHandler: any;
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input() title: string;
  @Input() hideTitle: boolean = false;;
  @Input() hideMenu: boolean = false;
  @Input() hideBackButton: boolean;
  @Input() activeTab: string;

  @Input() showTabberMenu: boolean = true;

  @ViewChild(Navbar) navBar: Navbar;

  constructor(public nav: NavController, private authService: AuthenticationService, private alertCtrl: AlertController, public platform: Platform, private config: ConfigProvider, public userContext: UserContextProvider, private viewCtrl: ViewController, private menu: MenuController) {
    this.viewCtrl.didEnter.subscribe(
      () => {
        if (this.hideMenu) {
          this.menu.enable(false);
        } else {
          this.menu.enable(true);
        }
      }
    );

    if (platform.is('android')) {
      this.showTabberMenu = true;
    } else {
      this.showTabberMenu = false;
    }


  }

  ngOnInit() {
    if (this.hideBackButton) {
      this.viewCtrl.showBackButton(false);
    }

    this.navBar.backButtonClick = (e: UIEvent) => {
      scxmlHandler.playSoundWithHapticFeedback();
      if (this.nav.canGoBack()) {
        this.nav.pop();
      }
    }
  }


  launchApp(app) {
    this.authService.pageName = app;
    scxmlHandler.playSoundWithHapticFeedback();
    // if messagecenter icon was previously clicked and user cliks other menu options, then reset deeplink
    if(app != "messageCenter" && this.authService.getDeepLink() == "://messagecenter"){
      this.authService.setDeepLink("");
    }
    //if current state is Register and not authenticated then always go to auth flow
    if (this.userContext.getLoginState() == LoginState.Anonymous && app != "home") {

      if (this.nav.getActive().component.name != "LoginComponent"){
        if(app == "messageCenter"){
          this.authService.setDeepLink("://messagecenter");
        }
        this.nav.push(LoginComponent);
      }
      return;
    }
    else if (this.userContext.getLoginState() == LoginState.Registered && app != "home" && app != "messageCenter") {
      
      this.nav.push(AuthOptInPromoPage);
      return;
    }
    //if the tab clicked is the active tab.
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
          scxmlHandler.sendAnalytics('linkClick', app, 'components/header/header.html');
          this.nav.push(MyMedicationsPage);
        }
      } else {
        scxmlHandler.sendAnalytics('linkClick', app, 'components/header/header.html');
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
    } else if (app == "messageCenter") {

      let etarget = 'Header.MessageCenter';
      let edataobj = { "context": "action" };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      this.nav.push(MessageCenterPage);
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

  isStateAnonymous() {
    return (this.userContext.getLoginState() == LoginState.Anonymous);
  }

  isAuthenticatedUser() {
    let scopeName = this.authService.currentUserScopename;
    return (scopeName && scopeName.indexOf('AUTHENTICATED') >= 0 ? true : false);
  }

  showMessageCenter() {
    let showMsgCtr = true;
    if (this.title === 'Message Center' || this.hideMenu || this.title === 'Forgot Password?' || this.title === 'Forgot Username?' || this.title === 'Verify Your Account' || this.title === 'Sign In' || this.title === 'Register' || 
   this.title === 'User Migration' || this.title === 'Update Your Password' || (!this.title && this.userContext.getLoginState() === LoginState.Registered)) {
      showMsgCtr = false;
    }
    return showMsgCtr;
  }


}
