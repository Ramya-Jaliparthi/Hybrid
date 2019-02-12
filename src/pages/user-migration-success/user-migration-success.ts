import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { AuthenticationStateProvider } from '../../providers/login/authentication.state';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { AlertController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';


declare var scxmlHandler: any;
@Component({
    selector: 'page-user-migration-success',
    templateUrl: 'user-migration-success.html',
})
export class UMVerificationSuccessPage {
    resObj: any;
    pageName:any;
    selectedUserID:any;
    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        public config: ConfigProvider,
        private userContext: UserContextProvider,
        private authService: AuthenticationService,
        public navParams: NavParams,
        private authenticationStateProvider: AuthenticationStateProvider,
        private messageProvider: MessageProvider) {
            this.pageName = this.authService.pageName;
    }


    ngOnInit() {
        this.selectedUserID = this.navParams.get("migratedUser");
        
    }

    goNext(pevent) {
        scxmlHandler.playSoundWithHapticFeedback();
        this.messageProvider.sendMessage(ConstantsService.RE_LOGIN, null);
      }
      cancel(pevent) {
        scxmlHandler.playSoundWithHapticFeedback();
        window.setTimeout(() => {
            
          this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
          pevent.cancelBubble = true;
    
        }, ConstantsService.EVENT_HANDLING_TIMEOUT);
      }

}
