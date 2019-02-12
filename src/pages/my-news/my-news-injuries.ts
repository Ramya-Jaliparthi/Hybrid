import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-news-injuries',
  templateUrl: 'my-news-injuries.html'
})
export class MyNewsInjuriesPage {

  private detailArticleInfo: any;
  private titleName: any;

  constructor(public navCtrl: NavController,
    public config: ConfigProvider,
    private userContext: UserContextProvider,
    public authService: AuthenticationService) {
    console.log('my-news');
    this.detailArticleInfo = this.userContext.getInjuriesInfo();
    this.titleName = "Injuries";

  }

  ionViewDidLoad() {
    let etarget = 'Injuries Article';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    console.log('InjuriesArticle', etarget);
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }

}
