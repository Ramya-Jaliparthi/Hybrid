import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';

declare var scxmlHandler: any;
@Component({
  selector: 'cards=page-dependents-popover',
  templateUrl: 'dependents-popover.html'
})
export class CardsPopoverPage implements OnDestroy {

  isActive: boolean = true;
  dependentsList: Array<any>;
  memberName: string;
  displayName: string;
  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider, private authService: AuthenticationService, public alertCtrl: AlertController) {
    this.dependentsList = userContext.getDependentsList();
    if (this.dependentsList == null) {
      // show error message aon dependents for Subscriber only
      if (this.authService.memberInfo.relationship == 'Subscriber') {
        this.showAlert('', ConstantsService.ERROR_MESSAGES.MYCARDS_DEPENDENTSPOPOVER_INF_NOTAVAIL);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYCARDS_DEPENDENTSPOPOVER_INF_NOTAVAIL);
      }
    }else{
      let temp: Array<any> = [];
      this.dependentsList.forEach((element => {
							let isFoundInTempArray = temp.find((tempElement) => { 
								//return (tempElement.cardMemID  == element.cardMemID && tempElement.depSuffix  == element.depSuffix); 
								return (tempElement.depunqperid  == element.depunqperid); 
							}); 

							if(!isFoundInTempArray) 
							   temp.push(element);
              }));
       
            this.dependentsList = temp;
    }
    this.memberName = authService.getMemberName();
    let navparams = this.viewCtrl.getNavParams();
    this.displayName = navparams.data.displayName;
    this.userContext.setIsPopoverActive(true);
  }

  ngOnDestroy() {
    this.userContext.setIsPopoverActive(false);
  }

  selectUser(user: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.viewCtrl.dismiss(user);
  }

  isDisplayNameEqual(name: string) {

    if (name && this.displayName && this.displayName.toLowerCase() == name.toLowerCase()) {
      return true;
    }
    return false;
  }

  testData: Array<any> = [{
    "depSuffix": 10,
    "depFirstName": "John",
    "depRelationsip": "Dependent",
    "depLastName": "Dependent1",
    "depMemNum": 990000080900010,
    "depCardId": "XXH008302462",
    "depId": 200001990
  },
  {
    "depSuffix": 11,
    "depFirstName": "Jerry",
    "depRelationsip": "Dependent",
    "depLastName": "Dependent2",
    "depMemNum": 990000081000011,
    "depCardId": "XXH008302462",
    "depId": 200001986
  }];

  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }
}
