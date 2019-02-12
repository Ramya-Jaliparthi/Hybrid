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
  selector: 'page-termsAndConditions',
  templateUrl: 'termsAndConditions.html',
})
export class TermsAndCondition {

  termsAndConditinsData: any;

  constructor(private authService: AuthenticationService,
    private userContext: UserContextProvider,
    public configProvider: ConfigProvider
  ) {
    if (this.userContext.getTermsAndConditions() != null) {
      this.termsAndConditinsData = this.userContext.getTermsAndConditions();
    } else {
      this.loadData();
    }
  }

  ionViewDidLoad() {
  }
  loadData() {
    this.authService.getTermsAndConditions()
      .subscribe(response => {
        console.log(response);
        this.termsAndConditinsData = response

      }, err => {
        console.log(err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("termsAndConditions"), err.result ? err.result : '');
      });
  }
}