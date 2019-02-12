import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-visit-history',
  templateUrl: 'visit-history.html'
})
export class VisitHistoryPage {
  data: any;
  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private nav: NavController, public navParams: NavParams) {
    this.data = navParams.data;
  }

  close(event) {
    scxmlHandler.playSoundWithHapticFeedback();
    window.setTimeout(() => { this.nav.pop(); }, ConstantsService.EVENT_HANDLING_TIMEOUT);

    event.cancelBubble = true;

  }

}