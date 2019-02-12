import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { MyCardsPage } from '../my-cards/my-cards';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MyPlanInfoPage } from './my-plan-info';
import { ConstantsService } from "../../providers/constants/constants.service";
import { ConfigProvider } from '../../providers/config/config';
import { MyPlanService } from './my-plan-service';
import { AlertModel } from '../../models/alert/alert.model';
declare var scxmlHandler: any;

@Component({
  selector: 'page-my-plan',
  templateUrl: 'my-plan.html',
})
export class MyPlanPage implements OnInit{

  whoIsCoveredHidden: any = {};
  coPaysHidden: any = {};
  deductibleHidden: boolean = true;
  outOfPocketHidden: boolean = true;
  benefitHidden: boolean = true;
  subscriberId: string = "";
  subscriberName: string = "";
  subscriberSuffix: string = "00";
  relationship: string = "Subscriber";
  name: string = "";
  planInformationList: any = [];
  whoIsCoveredIcon: any = {};
  coPayIcon: any = {};
  HasActivePlan: string;
  alerts: Array<any>;
  depList: Array<any> = [];
  constructor(public navCtrl: NavController,
    private authService: AuthenticationService,
    public userContext: UserContextProvider,
    public config: ConfigProvider,
    public alertCtrl: AlertController,
    public myplanservice: MyPlanService) {

    //let auth = authService.getMemberInfo();
    let authInfo = authService.getMemberInfo();// auth.ROWSET ? auth.ROWSET.ROWS : null;

    this.name = authService.getMemberName();
    //this.subscriberId = authInfo.memNum;
    this.relationship = authInfo.relationship;
    this.subscriberSuffix = this.relationship != null && this.relationship.toLowerCase() == "subscriber" ? "00" : this.authService.removeLeadingJunkChar(authInfo.memSuffix);
    this.depList = userContext.getDependentsList();
    this.getLimitedPlanInfo();

  }
  ngOnInit(): void {
    this.HasActivePlan = this.authService.loginResponse.HasActivePlan;
    if(this.HasActivePlan == 'false'){
      this.errorBanner(ConstantsService.ERROR_MESSAGES.MYPLAN_FEATURE_INACTIVE);
    }
  }
  prepareAlertModal(alert: any) {
    if (alert) {
        let a: AlertModel = new AlertModel();
        a.id = alert.messageID;
        a.message = alert.AlertLongTxt;
        a.alertFromServer = true;
        a.showAlert = true;
        a.title = alert.AlertShortTxt;
        a.type = "error";
        a.RowNum = alert.RowNum;
        a.hideCloseButton = true;
        return a;
    }
    return null;
}
errorBanner(message) {
    let alertObj = {
        messageID: "",
        AlertLongTxt: message,
        AlertShortTxt: "",
        RowNum: ""
    }
    let a: AlertModel = this.prepareAlertModal(alertObj);
    if (a != null) {
        this.userContext.setAlerts([a]);
    }
    this.alerts = this.userContext.getAlerts();
  }

  ionViewDidLoad() {
    let etarget = 'MyPlan';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    if(this.depList != null){
      let temp: Array<any> = [];
      this.depList.forEach((element => {
							let isFoundInTempArray = temp.find((tempElement) => { 
								//return (tempElement.cardMemID  == element.cardMemID && tempElement.depSuffix  == element.depSuffix); 
								return (tempElement.depunqperid  == element.depunqperid); 
							}); 

							if(!isFoundInTempArray) 
							   temp.push(element);
              }));
       
            this.depList = temp;
    }
  }

  getLimitedPlanInfo() {

    setTimeout(() => {
      let planEndPoint: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getLimitedPlanInfo");
      this.myplanservice.getLimitedPlanInfoRequest(planEndPoint).
        subscribe(response => {

          if (response.result && !(response.result === "0")) {
            let errmsg = ConstantsService.ERROR_MESSAGES.MYPLAN_FEATURE_NOTAVAIL;
            if (response.displaymessage) {
              errmsg = response.displaymessage;
              this.showAlert('ERROR', errmsg);
              this.authService.addAnalyticsAPIEvent(errmsg, planEndPoint, response.result ? response.result : '');
            }
          } else if (response) {
            response["ROWSET"].totRows > 1 ? this.planInformationList = response["ROWSET"].ROWS : this.planInformationList.push(response["ROWSET"].ROWS); 
          }

        }, error => {
          let errmsg = ConstantsService.ERROR_MESSAGES.MYPLAN_FEATURE_NOTAVAIL;
          if (error.displaymessage)
            errmsg = error.displaymessage;
          this.authService.addAnalyticsAPIEvent(error.displaymessage, planEndPoint, error.result ? error.result : '');
        }


        );
    }, 500);

  }

  objectToArray(object) {
    return Array.from(object);
  }

  toggleWhoIsCovered(index) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.whoIsCoveredHidden[index] || this.whoIsCoveredHidden[index]== undefined) {
      let etarget = "MyPlan.WhosCoveredAccordion";
      let edataobj = { "context": "action" };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      this.whoIsCoveredIcon[index] = "arrow-up";
      this.whoIsCoveredHidden[index] = false;
    } else {
      this.whoIsCoveredIcon[index] = "arrow-down";
      this.whoIsCoveredHidden[index] = true;
    }
  }

  toggleCoPays(index) {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.coPaysHidden[index] || this.coPaysHidden[index]== undefined) {
      let etarget = "MyPlan.Co-paysAccordion";
      let edataobj = { "context": "action" };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      this.coPayIcon[index] = "arrow-up";
      this.coPaysHidden[index] = false;
    } else {
      this.coPaysHidden[index] = true;
      this.coPayIcon[index] = "arrow-down";
    }
  }

  toggleDeductible() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.deductibleHidden) {
      this.deductibleHidden = false;
    } else {
      this.deductibleHidden = true;
    }
  }

  toggleOutOfPocket() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.outOfPocketHidden) {
      this.outOfPocketHidden = false;
    } else {
      this.outOfPocketHidden = true;
    }
  }

  toggleBenefit() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.benefitHidden) {
      this.benefitHidden = false;
    } else {
      this.benefitHidden = true;
    }
  }
  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  goToCard(MemSuff: string, depFirstName: string, ProdDesc: string) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(MyCardsPage, { "MemSuff": MemSuff, "depFirstName": depFirstName, "ProdDesc" : ProdDesc });
  }

  goToPlanInfoPage() {
    let etarget = 'MyPlan.InformationIconModal';
    let edataobj = { "context": "action" };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(MyPlanInfoPage);
  }

  removeLeadingJunkChar(val) {
    return this.authService.removeLeadingJunkChar(val);
  }

}
