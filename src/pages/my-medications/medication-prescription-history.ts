import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-medication-prescription-history',
  templateUrl: 'medication-prescription-history.html'
})
export class MedicationPrescriptionHistoryPage {
  data: any;
  constructor(public viewCtrl: ViewController, private nav: NavController, public config: ConfigProvider, public navParams: NavParams) {
    this.data = navParams.data;
  }

  close(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => { this.nav.pop(); }, ConstantsService.EVENT_HANDLING_TIMEOUT);
    event.cancelBubble = true;
  }

}