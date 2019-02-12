import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { LoginComponent } from '../../pages/login/login.component';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-authPromo',
  templateUrl: 'auth-promo.html',
})
export class AuthPromoPage {

  constructor(public navCtrl: NavController,
    private userContext: UserContextProvider, private authService: AuthenticationService,
    private authenticationStateProvider: AuthenticationStateProvider) {
  }

  ionViewDidLoad() {
  }

  cancel(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.popToRoot({ animate: false, direction: "forward" });
    event.cancelBubble = true;

  }
  authenticateNow() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.userContext.getLoginState() == LoginState.Registered) {

      this.authenticationStateProvider.sendMessage(this.authService.currentUserScopename, null);
    } else if (this.userContext.getLoginState() == LoginState.Anonymous) {
      this.navCtrl.push(LoginComponent);
    }
  }
}
