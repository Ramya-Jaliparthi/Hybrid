import { Injectable } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { AlertController } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';

@Injectable()
export class IdleTimerService {

  private idleTimerHandler: any = null;
  private appIdleTimeoutMillisec: number = 5 * 60 * 1000;
  private sessionConfirmationAlert: any;
  private hasAddedEventListener: boolean = false;

  constructor(private messageProvider: MessageProvider,
    private alertCtrl: AlertController
  ) {

    window['IdleTimerServiceRef'] = {
      component: this
    };
  }

  startIdleTimer() {
    if (!this.hasAddedEventListener) {
      this.hasAddedEventListener = true;
      document.addEventListener("click", this.restartIdleTimer, true);
    }
    if (this.idleTimerHandler == null) {
      this.idleTimerHandler = window.setTimeout(() => {
        this.showIdleTimeoutAlert();
      }, this.appIdleTimeoutMillisec);
    }

  }
  showIdleTimeoutAlert() {
    this.clearIdleTimer();
    this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
    this.sessionConfirmationAlert = this.alertCtrl.create({
      title: '',
      message: 'For your security, your session has timed out due to inactivity. Please sign in again.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.sessionConfirmationAlert = null;
          }
        }
      ]
    });
    this.sessionConfirmationAlert.present();
  }

  restartIdleTimer() {
    let me = window['IdleTimerServiceRef'].component;
    if (me.idleTimerHandler != null) {
      window.clearTimeout(me.idleTimerHandler);
      me.idleTimerHandler = null;
      me.startIdleTimer();
    }
  }
  clearIdleTimer() {
    if (this.idleTimerHandler != null) {
      window.clearTimeout(this.idleTimerHandler);
      this.idleTimerHandler = null;
      this.hasAddedEventListener = false;
      document.removeEventListener("click", this.restartIdleTimer);
    }
  }
}