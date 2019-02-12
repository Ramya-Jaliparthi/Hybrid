import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';

@Component({
  selector: 'msgCtrPage3-card',
  template: '<msg-center-drupal-card [articleInfo]="selectedArticle" [title]="selectedArticleTitle"></msg-center-drupal-card>',
  host: { 'class': '' }
})
export class MsgCtrPage3 {

  selectedArticle: any;
  public selectedArticleTitle: string = "article3";

  constructor(private configProvider: ConfigProvider,
    private authService: AuthenticationService,
    private userContext: UserContextProvider,
    private messageProvider: MessageProvider) {
    if (this.userContext.getMessageCenterInfo() != null) {
      this.selectedArticle = this.userContext.getMessageCenterInfo()["article3"];
    } else {
      this.messageProvider.getMessage().subscribe(message => {
        console.log("Received news in Message Center", message);
        if (message.event == "MSGCENTER_NEWS") {
          this.selectedArticle = message.data;
        }
      }, err => {
        console.log('MessageProvider :: Error response =' + err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("news_articles"), err.result);
      });

    }
  }

}