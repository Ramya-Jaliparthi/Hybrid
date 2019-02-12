import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyNewsPage } from '../../pages/my-news/my-news';
import { MyNewsWellnessPage } from '../../pages/my-news/my-news-wellness';
import { MyNewsFitnessPage } from '../../pages/my-news/my-news-fitness';
import { MyNewsInjuriesPage } from '../../pages/my-news/my-news-injuries';
import { MyNewsMsgCtrPage1 } from '../../pages/my-news/my-news-msgCtrPage1';
import { MyNewsMsgCtrPage2 } from '../../pages/my-news/my-news-msgCtrPage2';
import { MyNewsMsgCtrPage3 } from '../../pages/my-news/my-news-msgCtrPage3';
import { ConstantsService } from '../../providers/constants/constants.service';

declare var scxmlHandler: any;
@Component({
  selector: 'msg-center-drupal-card',
  templateUrl: 'msg-center-drupal-card.html'
})
export class MsgCenterDrupalCardComponent {

  @Input() articleInfo: any;
  @Input() title: any;

  constructor(public navCtrl: NavController) {
    window['HealthNewsCardComponentRef'] = {
      component: this
    };

  }

  trimLongTxt(msg): string {
    return msg.slice(0, 38) + "...";
  }

  trimShortTxt(msg): string {
    return msg.slice(0, 34) + "...";
  }

  readArticle() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.title == "Wellness") {

      this.navCtrl.push(MyNewsWellnessPage);
    } else if (this.title == "Fitness") {
      this.navCtrl.push(MyNewsFitnessPage);
    } else if (this.title == "Healthy Living") {
      this.navCtrl.push(MyNewsPage);
    } else if (this.title == "Injuries") {
      this.navCtrl.push(MyNewsInjuriesPage);
    } else if (this.title == "article1") {
      this.navCtrl.push(MyNewsMsgCtrPage1);
    } else if (this.title == "article2") {
      this.navCtrl.push(MyNewsMsgCtrPage2);
    } else if (this.title == "article3") {
      this.navCtrl.push(MyNewsMsgCtrPage3);
    }
    let etarget = 'MessageCenter.ViewMessage';
    let edataobj = { "context": "action", "data": { "App.linkSource": "Message Center", "App.MessageTitle": this.articleInfo[0].Title, "App.MessageType": "Message" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
  }
  readMsgCtrArticleById(aid) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (aid == 3) {
      this.navCtrl.push(MyNewsMsgCtrPage3);
    } else if (aid == 2) {
      this.navCtrl.push(MyNewsMsgCtrPage2);
    } else if (aid == 1) {
      this.navCtrl.push(MyNewsMsgCtrPage1);
    }
  }
}
