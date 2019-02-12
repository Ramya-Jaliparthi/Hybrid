import { Component, OnDestroy } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ContactUsPage } from '../../pages/contact-us/contact-us';

@Component({
  selector: 'settings-info-popoever',
  templateUrl: 'settings-info-popoever.html'
})
export class SettingsInfoPopOver implements OnDestroy {

  constructor(public viewCtrl: ViewController, public config: ConfigProvider, public userContext: UserContextProvider, public navCtrl: NavController, ) {

  }

  ngOnDestroy() {

  }

  gotoContactUsPage() {
    this.navCtrl.push(ContactUsPage);
    //setTimeout(() => {
      //this.navCtrl.push(ContactUsPage);
    //}, 20);
    //this.viewCtrl.dismiss();
  }

}