import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';

@Component({
  selector: 'wellness-card',
  template: '<health-news-card [articleInfo]="selectedArticle" [title]="selectedArticleTitle"></health-news-card>',
  host: { 'class': 'card-content-cls' }
})
export class Wellness {

  selectedArticle: any;
  public selectedArticleTitle: string = "Tools and Resources";

  constructor(private configProvider: ConfigProvider,
    private authService: AuthenticationService,
    private userContext: UserContextProvider,
    private messageProvider: MessageProvider) {
    if (this.userContext.getWellnessInfo() != null) {
      this.selectedArticle = this.userContext.getWellnessInfo();
    } else {
      this.messageProvider.getMessage().subscribe(message => {
        if (message.event == "WELLNESS_NEWS") {
          this.selectedArticle = message.data;
        }
      }, err => {
        console.log('MessageProvider :: Error response =' + err);
        this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("news_articles"), err.result);
      });
    }
  }
}