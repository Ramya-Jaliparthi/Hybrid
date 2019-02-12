import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertModel } from '../../models/alert/alert.model';

@Injectable()
export class AlertService {
  private alert: Alert = null;
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthenticationService
  ) { }

  showAlert(ptitle, psubtitle, buttonHandlers, callBackHandler?, scopeParam?) {
    this.alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: [{
        text: 'OK',
        handler: () => {
          console.log('alert OK button clicked');
          this.alert.dismiss().then(() => {
            console.log('alert view dismiss complete.');
            if (callBackHandler) {
              callBackHandler.call(scopeParam);
            }
          });
          return false;
        }
      }]
    });
    this.alert.present();
    this.authService.setAlert(this.alert);
  }
  prepareAlertModal(title: string, msg: string, type: string, shouldHideCloseButton?: boolean) {
    if (msg) {
      let a: AlertModel = new AlertModel();
      a.id = "1";
      a.message = msg;
      a.alertFromServer = false;
      a.showAlert = true;
      a.title = title;
      a.type = type ? type : "error";
      a.hideCloseButton = shouldHideCloseButton != undefined ? shouldHideCloseButton : false;
      return a;
    }
    return null;
  }

}