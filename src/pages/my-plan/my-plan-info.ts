import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from '../../providers/constants/constants.service';

declare var scxmlHandler: any;

@Component({
  selector: 'page-my-plan-info',
  templateUrl: 'my-plan-info.html'
})
export class MyPlanInfoPage {
  planInfoList: any;
  constructor(public viewCtrl: ViewController,
    private nav: NavController,
    public config: ConfigProvider,
    private userContext: UserContextProvider,
    private authService: AuthenticationService) {
    this.planInfoList = this.userContext.getPlanInfo();
    if (this.planInfoList == null) {
      this.loadMyPlanInfo();

    }
  }

  ionViewDidLoad() {
  }

  close(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => { this.nav.pop(); }, ConstantsService.EVENT_HANDLING_TIMEOUT);
    event.cancelBubble = true;
  }

  loadMyPlanInfo() {
    this.authService.getPlanInfo()

      .subscribe(response => {
        this.planInfoList = response;
      },
      err => {
        //todo handle error flow
        console.log('Wellness :: loadData Error - ' + err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, "getPlanInfo", err.result);
      });
  }
}