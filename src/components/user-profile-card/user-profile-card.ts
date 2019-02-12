import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

declare var scxmlHandler: any;
@Component({
  selector: 'user-profile-card',
  templateUrl: 'user-profile-card.html'
})
export class UserProfileCardComponent {

  @Input() articleInfo: any;
  @Input() title: any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public configProvider: ConfigProvider) {
    window['HealthNewsCardComponentRef'] = {
      component: this
    };

  }
  /*
  readArticle() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.title == "Tools and Resources") {
      this.navCtrl.push(MyNewsWellnessPage);
    } else if (this.title == "News and Updates") {
      this.navCtrl.push(MyNewsFitnessPage);
    } else if (this.title == "Health and Wellness") {

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
  }
  */

  /*
  readArticleById(aid) {
    scxmlHandler.playSoundWithHapticFeedback();
    console.log('readArticleById::aid=' + aid);
    if (aid == 3) {
      if (this.userContext.getWellnessInfo() != null) {
        this.navCtrl.push(MyNewsWellnessPage);
      } else {
        this.authService.getNewsArticle()
          .subscribe(response => {

          },
            error => {
              console.log("get news article failed : ", error)
              this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
            });

        this.navCtrl.push(MyNewsWellnessPage);
      }
    } else if (aid == 2) {
      if (this.userContext.getFitnessInfo() != null) {
        this.navCtrl.push(MyNewsFitnessPage);
      } else {
        this.authService.getNewsArticle()
          .subscribe(response => {

          },
            error => {
              console.log("get news article failed : ", error)
              this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
            });

        this.navCtrl.push(MyNewsFitnessPage);
      }
    } else if (aid == 1) {
      if (this.userContext.getHealthyLivingInfo() != null) {
        this.navCtrl.push(MyNewsPage);
      } else {
        this.authService.getNewsArticle()
          .subscribe(response => {

          },
            error => {
              console.log("get news article failed : ", error)
              this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
            });

        this.navCtrl.push(MyNewsPage);

      }
    } else
      this.navCtrl.push(MyNewsPage);
  }*/

  openDrupalVideo(url){
    scxmlHandler.playSoundWithHapticFeedback();
    //scxmlHandler.openExternalWindow(url);
    scxmlHandler.openNewindow(url,"My Blue");
    
}

}
