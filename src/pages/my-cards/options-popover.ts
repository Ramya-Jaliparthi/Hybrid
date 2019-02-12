import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
declare var scxmlHandler;


@Component({
  selector: 'page-cards-options-popover',
  templateUrl: 'options-popover.html'
})
export class CardsOptionsPopoverPage implements OnDestroy {

  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider) {
    this.userContext.setIsPopoverActive(true);
  }

  userSelection(selection: any) {
    scxmlHandler.playSoundWithHapticFeedback();

    let etarget = 'MyCards';
    if (selection == 1) {
      etarget = 'MyCards.DownloadCard';
    }
    else if (selection == 2) {
      etarget = 'MyCards.EmailCard';
    }
    else if (selection == 3) {
      etarget = 'MyCards.PrintCard';
    }
    let edataobj = { "context": "action" };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

    this.viewCtrl.dismiss(selection);
  }

  ngOnDestroy() {
    this.userContext.setIsPopoverActive(false);
  }

}