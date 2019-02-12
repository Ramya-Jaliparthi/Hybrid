import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";

declare var scxmlHandler: any;
@Component({
  selector: 'page-dependents-popover',
  templateUrl: 'dependents-popover.html'
})
export class MedicationPopoverPage implements OnDestroy {

  isActive: boolean = true;
  dependentsList: Array<any>;
  memberName: string;
  displayName: string;
  genericNamesHidden: boolean = true;
  memberListHidden: boolean = true;
  sortByOption: number = -1;
  GenericNames: any;

  constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider, private authService: AuthenticationService, public alertCtrl: AlertController) {
    this.dependentsList = userContext.getDependentsList();
    if (this.dependentsList == null) {
      if (this.authService.memberInfo.relationship == 'Subscriber')
        this.showAlert('', ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_DEPENDENTSPOPOVER_INF_NOTAVAIL);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_DEPENDENTSPOPOVER_INF_NOTAVAIL);
    }else{
      let temp: Array<any> = [];
      this.dependentsList.forEach((element => {
							let isFoundInTempArray = temp.find((tempElement) => { 
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
    this.sortByOption = navparams.get('sortOption');
    this.GenericNames = navparams.get('genericNames');
    this.userContext.setIsPopoverActive(true);
  }

  ngOnDestroy() {
    this.userContext.setIsPopoverActive(false);
  }

  selectUser(user: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.viewCtrl.dismiss({ key: 'selectMember', value: user });
  }
  toggleList(listType: string, event) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (listType == "GenericNames") {
      this.memberListHidden = true;
      this.genericNamesHidden = this.genericNamesHidden ? false : true;
    } else if (listType == "members") {
      this.genericNamesHidden = true;
      this.memberListHidden = this.memberListHidden ? false : true;
    }
    event.cancelBubble = true;
  }
  sortBy(sortType: any) {
    scxmlHandler.playSoundWithHapticFeedback();
    let filterOption = { key: 'showByDateOrder', value: sortType }
    this.viewCtrl.dismiss(filterOption);
  }
  resetFilters() {
    scxmlHandler.playSoundWithHapticFeedback();
    let filterOption = { key: 'resetFilters', value: "" }
    this.viewCtrl.dismiss(filterOption);
  }
  selectGenericName(item: any) {
    let filterOption = { key: 'GenericNameKey', value: item.GenericName }
    this.viewCtrl.dismiss(filterOption);
  }

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