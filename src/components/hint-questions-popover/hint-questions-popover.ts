import { Component, OnDestroy  } from '@angular/core';
import { ViewController  } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';
//import {ConstantsService} from "../../providers/constants/constants.service";

declare var scxmlHandler: any;
@Component({
  selector: 'page-hintques-popover',
  templateUrl: 'hint-questions-popover.html'
})
export class HintQuestionsPopoverPage implements OnDestroy {

  securityQuestionsOptions = ConstantsService.SECURITY_QUESTIONS_OPTIONS;

    constructor(public viewCtrl: ViewController, public config: ConfigProvider,	public userContext: UserContextProvider, public authService: AuthenticationService, public alertCtrl: AlertController) {

    }

    selectQuestions(question) {
      scxmlHandler.playSoundWithHapticFeedback();
      this.viewCtrl.dismiss({key: 'selectQuestion', value : question});
      }

    ngOnDestroy(){

      }

}