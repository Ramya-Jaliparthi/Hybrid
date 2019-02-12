import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfigProvider } from '../../../providers/config/config';
import { UserContextProvider } from '../../../providers/user-context/user-context';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { ConstantsService } from '../../../providers/constants/constants.service';

declare var scxmlHandler: any;

@Component({
  selector: 'page-alegeus-terms',
  templateUrl: 'alegeus-terms.html',
})
export class AlegeusTermsPage {

  private termsConditions: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private nav: NavController, public config: ConfigProvider, private userContext: UserContextProvider,
    private authService: AuthenticationService) {
    this.termsConditions = this.navParams.get('agreementText');
  }

  close(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => {
      this.nav.pop();
    }, ConstantsService.EVENT_HANDLING_TIMEOUT);
    event.cancelBubble = true;
  }

}
