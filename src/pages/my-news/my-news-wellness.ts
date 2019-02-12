import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-news-wellness',
  templateUrl: 'my-news-wellness.html',

})
export class MyNewsWellnessPage {

  private detailArticleInfo: any;
  private titleName: any;

  constructor(public navCtrl: NavController,
    public config: ConfigProvider,
    private userContext: UserContextProvider,
    public authService: AuthenticationService) {
    this.detailArticleInfo = this.userContext.getWellnessInfo();
    this.detailArticleInfo[0].Body = this.authService.formatHyperLink(this.detailArticleInfo[0].Body);
    this.titleName = "Tools and Resources";
  }

  ionViewDidLoad() {
    let etarget = 'ToolsandResourcesArticle';
    let subTitle = this.detailArticleInfo[0].Title;
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.ArticleTitle": subTitle } };
    console.log('ToolsandResourcesArticle', etarget);
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

}
