import { Component } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-privacyPolicy',
  templateUrl: 'privacyPolicy.html',
})
export class PrivacyPolicy {

  privacyPolicyData: any;

  constructor(private authService: AuthenticationService,
    private userContext: UserContextProvider,
    public configProvider: ConfigProvider) {
    if (this.userContext.getPrivacyPolicy() != null) {
      this.privacyPolicyData = this.userContext.getPrivacyPolicy();
    } else {
      this.loadData();
    }
  }

  ionViewDidLoad() {
  }
  loadData() {

    this.authService.getPrivayPolicy()
      .subscribe(response => {
        console.log(response);
        this.privacyPolicyData = response
      }, err => {
        console.log(err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("privacyPolicy"), err.result ? err.result : '');
      }
      );
  }
}