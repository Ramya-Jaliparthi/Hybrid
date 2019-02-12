import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';

@Component({
    selector: 'healthy-living-card',
    template: '<health-news-card [articleInfo]="selectedArticle" [title]="selectedArticleTitle"></health-news-card>',
    host: { 'class': 'card-content-cls' }
})
export class HealthyLiving {

    selectedArticle: any = null;
    public selectedArticleTitle: string = "Health and Wellness";

    constructor(private configProvider: ConfigProvider,
        private authService: AuthenticationService,
        private userContext: UserContextProvider,
        private messageProvider: MessageProvider) {
        window['HomeDrupalCards'] = {
            component: this
        };
        if (this.userContext.getHealthyLivingInfo() != null) {
            this.selectedArticle = this.userContext.getHealthyLivingInfo();
        }
    }
    ngAfterViewInit() {

    }
    loadData() {
        this.authService.getNewsArticle()
            .subscribe(response => {
                console.log(response);
                this.authService.IS_ARTICLES_LOADED = true;
                this.loadMessageCenterMessage1();
                this.loadMessageCenterMessage2();
                this.loadMessageCenterMessage3();
            },
                error => {
                    this.authService.IS_ARTICLES_LOADED = false;
                    this.authService.IS_ARTICLES_CALLED_FIRST = true;
                    console.log("get news article failed : ", error);
                    this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
                });

        this.messageProvider.getMessage().subscribe(message => {
            if (message.event == "HEALTHY_LIVING_NEWS") {
                this.selectedArticle = message.data;
            }
        }, err => {
            console.log('MessageProvider :: Error response =' + err);
            this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("news_articles"), err.result);
        });

    }

    loadMessageCenterMessage1() {
        this.authService.loadMessageCenterMessage1()
            .subscribe(response => {

            },
                error => {
                    console.log("get news article failed : ", error);
                    this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
                });
    }

    loadMessageCenterMessage2() {
        this.authService.loadMessageCenterMessage2()
            .subscribe(response => {

            },
                error => {
                    console.log("get news article failed : ", error);
                    this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
                });
    }

    loadMessageCenterMessage3() {
        this.authService.loadMessageCenterMessage3()
            .subscribe(response => {

            },
                error => {
                    console.log("get news article failed : ", error);
                    this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("news_articles"), error.result);
                });
    }
}
