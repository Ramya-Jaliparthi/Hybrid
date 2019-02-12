import { Component } from '@angular/core';
import { ConstantsService } from '../../providers/constants/constants.service';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'auth-verification-success',
  templateUrl: 'auth-verification-success.html'
})
export class AuthVerificationSuccessPage {

  constructor(
    public config: ConfigProvider,
    private messageProvider: MessageProvider,
    private authService: AuthenticationService
  ) {

  }

  ionViewDidLoad() {
    let etarget = 'AuthenticationComplete';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

  goNext(pevent) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.messageProvider.sendMessage(ConstantsService.RE_LOGIN, null);
  }
  cancel(pevent) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => {
      this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
      pevent.cancelBubble = true;

    }, ConstantsService.EVENT_HANDLING_TIMEOUT);
  }
}
