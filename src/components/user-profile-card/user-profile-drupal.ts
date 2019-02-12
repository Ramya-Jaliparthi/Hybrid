import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';

@Component({
    selector: 'user-profile-card-drupal',
    template: '<user-profile-card [articleInfo]="selectedArticle" [title]="selectedArticleTitle"></user-profile-card>',
    host: { 'class': 'card-content-cls' }
})
export class UserProfileCardDrupal {

    selectedArticle: any = null;
    public selectedArticleTitle: string = "User Profile Drupal Card";

    constructor(private configProvider: ConfigProvider,
        private authService: AuthenticationService,
        private userContext: UserContextProvider,
        private messageProvider: MessageProvider) {
        window['UserProfileCards'] = {
            component: this
        };
        if (this.userContext.getUserProfileDrupalData() != null) {
            this.selectedArticle = this.userContext.getUserProfileDrupalData();
        }
    }
    ngAfterViewInit() {

    }
    loadData() {
        this.authService.getUserProfileArticle()
            .subscribe(response => {
                console.log(response);
                //this.authService.IS_ARTICLES_LOADED = true;
            },
                error => {
                    //this.authService.IS_ARTICLES_LOADED = false;
                    //this.authService.IS_ARTICLES_CALLED_FIRST = true;
                    console.log("get news article failed : ", error);
                    this.authService.addAnalyticsAPIEvent(error.displaymessage, this.configProvider.getProperty("userprofiledrupal"), error.result);
                });

        this.messageProvider.getMessage().subscribe(message => {
            if (message.event == "USER_PROFILE_DRUPAL_DATA") {
                this.selectedArticle = message.data;
            }
        }, err => {
            console.log('MessageProvider :: Error response =' + err);
            this.authService.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("userprofiledrupal"), err.result);
        });

    }

}
