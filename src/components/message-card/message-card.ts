import { Component } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from "../../providers/constants/constants.service";

declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Component({
  selector: 'message-card',
  templateUrl: 'message-card.html'
})
export class MessageCard {
  constructor(public messageProvider: MessageProvider, private authService: AuthenticationService) {

    console.log("user congragulated storage : ", evaSecureStorage.getItem(this.authService.useridin + "_VisitedRegdHomePage"))
    if (evaSecureStorage.getItem(this.authService.useridin + "_VisitedRegdHomePage") == "true") {
      this.messageProvider.sendMessage("Remove_Card", "AuthenticationMessageCard");
    } else {
      evaSecureStorage.setItem(this.authService.useridin + "_VisitedRegdHomePage", "true");
    }
  }

  addEvent() {
    let etarget = 'HomeRegistered.SuccessfulRegistration';
    let regType = evaSecureStorage.getItem("userid").indexOf('@') > 0 ? 'EMAIL' : 'MOBILE'
    let edataobj = { "context": "state", "data": { "RegMethod": regType } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_DISPLAY + etarget, edataobj);
  }

  closeMessageCard() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.messageProvider.sendMessage("Remove_Card", "AuthenticationMessageCard");
  }
}
