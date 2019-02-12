import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';

declare var scxmlHandler: any;
@Component({
  selector: 'page-options-popover',
  templateUrl: 'options-popover.html'
})
export class OptionsPopoverPage implements OnDestroy {

  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider) {
    this.userContext.setIsPopoverActive(true);
  }

  userSelection(selection: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    let etarget = '';
    if (selection == 1) {
      etarget = 'MyDoctors.AddtoContacts';
    }
    else if (selection == 2) {
      etarget = 'MyDoctors.ViewHistory';
    }
    else if (selection == 3) {
      etarget = 'MyDoctors.ViewClaim';
    }
    this.viewCtrl.dismiss(selection);
  }

  ngOnDestroy() {
    this.userContext.setIsPopoverActive(false);
  }

}