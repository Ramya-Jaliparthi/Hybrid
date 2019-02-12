import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-news-msgCtrPage1',
  templateUrl: 'my-news-msgCtrPage1.html'
})
export class MyNewsMsgCtrPage1 {

  private detailArticleInfo: any;
  private titleName: any;

  constructor(public navCtrl: NavController,
    private userContext: UserContextProvider,
    public authService: AuthenticationService) {
    this.detailArticleInfo = this.userContext.getMessageCenterInfo()["article1"];
    this.titleName = "Message Center";

  }

  ionViewDidLoad() {
    let etarget = this.detailArticleInfo[0]["Title"];
    etarget = etarget.replace(/ /g, '');
    let subTitle = this.detailArticleInfo[0].Title;
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.ArticleTitle": subTitle } };
    console.log('Message 1', etarget);
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

}
