import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-news',
  templateUrl: 'my-news.html'
})
export class MyNewsPage {

  private detailArticleInfo: any;
  private titleName: any;

  constructor(public navCtrl: NavController,
    public config: ConfigProvider,
    public userContext: UserContextProvider,
    public authService: AuthenticationService) {
    this.detailArticleInfo = userContext.getHealthyLivingInfo();
    this.detailArticleInfo[0].Body = this.authService.formatHyperLink(this.detailArticleInfo[0].Body);
    this.titleName = "Health and Wellness";

  }

  ionViewDidLoad() {
    let etarget = 'HealthandWellnessArticle';
    let subTitle = this.detailArticleInfo[0].Title;
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.ArticleTitle": subTitle } };
    console.log('HealthandWellnessArticle', etarget);
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

}
