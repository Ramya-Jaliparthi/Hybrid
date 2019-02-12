import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { LoginComponent } from '../../pages/login/login.component';
declare var evaSecureStorage: any;
@Component({
  selector: 'resetUserName',
  templateUrl: 'resetUserName.html'
})
export class ResetUserName {

  isTouchIdEnabled: boolean = false;
  username: string = "";

  constructor(public navCtrl: NavController,
    public config: ConfigProvider,
    public navParams: NavParams) {

    let W = evaSecureStorage.getItem("userid");
    if (W == null || W == undefined || W.trim() != "") {
      this.username = W.substring(0, 4) + '****';
    }

    let isTouchIDEnabledStr = evaSecureStorage.getItem("isTouchIDEnabled");
    if (isTouchIDEnabledStr == "true") {
      this.isTouchIdEnabled = true;
    } else {
      this.isTouchIdEnabled = false;
    }

  }

  chooseUsername() {
    this.navCtrl.push(LoginComponent, { "changeUsername": true });
  }
}