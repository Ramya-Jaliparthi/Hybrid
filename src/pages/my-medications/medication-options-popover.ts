import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";

declare var scxmlHandler: any;
@Component({
  selector: 'page-medication-options-popover',
  templateUrl: 'medication-options-popover.html'
})

export class MedicationOptionsPopoverPage implements OnDestroy {

  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider) {
    this.userContext.setIsPopoverActive(true);
  }

  userSelection(selection: any) {
    scxmlHandler.playSoundWithHapticFeedback();

    if (selection == 2) {
      let etarget = 'MyMedications.ViewHistory';
      let edataobj = { "context": "action", "data": { "App.linkSource": "My Medications" } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    }
    this.viewCtrl.dismiss(selection);
  }

  ngOnDestroy() {
    this.userContext.setIsPopoverActive(false);
  }
}