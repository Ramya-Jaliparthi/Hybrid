import { MyFinancialService } from './my-financial-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AlertModel } from '../../models/alert/alert.model';
import { ConstantsService } from "../../providers/constants/constants.service";
import { AuthenticationService } from '../../providers/login/authentication.service';
declare var scxmlHandler: any;
@Component({
  selector: 'page-my-financial',
  templateUrl: 'my-financial.html',
})
export class MyFinancialPage {

  financialsData: Array<any> = [];
  alert: AlertModel = null;

  public chartColors: any[] = [
    {
      backgroundColor: '#3DA148',
      borderColor: '#000',

    },
    {
      backgroundColor: '#92278F ',
      borderColor: '#000',
      borderWidth: 0
    },
    {
      backgroundColor: '#B2B2B2',
      borderColor: '#8C8B8C',
      borderWidth: 1
    }
  ];

  public barChartOptions: any = null;
  public barChartLabels: string[] = ['2017'];
  public barChartType: string = 'horizontalBar';
  public barChartLegend: boolean = false;
  public barChartDataDummy: any[] = [
    { data: [2092.36], label: 'Spent' },
    { data: [1107.64], label: 'Balance' },

  ];
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private userContext: UserContextProvider,
    public authService: AuthenticationService,
    private MyFinancialService: MyFinancialService) {


    //this.financeBlalanceData = this.userContext.getFinancialsData();
    this.barChartOptions = {
      maintainAspectRatio: false,
      scaleShowVerticalLines: false,
      scaleShowLabels: false,
      responsive: false,
      hover: {
        mode: false,
        animationDuration: 0
      },
      layout: {

        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
          display: false,
          ticks: {
            beginAtZero: false,

          }
        }],
        yAxes: [{
          stacked: true,
          barThickness: 25,
          display: false,

        }]
      },
      animation: {
        duration: 0,
        onComplete: function () {
        }
      },
      tooltips: { enabled: false }
    };
  }

  ionViewDidLoad() {
    let errorMsg = this.userContext.getFinancialsDataError();
    if (errorMsg && errorMsg != '') {
      this.createAlert("Error", errorMsg, "error");
      this.authService.addAnalyticsClientEvent(errorMsg);
    }
    else {
      this.alert = null;
    }
  }

  ngOnInit() {
    let etarget = 'MyFinancials';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.financialSso();
  }

  createAlert(title: string, msg: string, type: string) {
    let a: AlertModel = new AlertModel();
    a.id = "1";
    a.message = msg;
    a.alertFromServer = false;
    a.showAlert = true;
    a.type = type ? type : "error";
    a.hideCloseButton = true;
    this.alert = a;
  }

  callUrl(resp){
    const myElement: HTMLElement = document.getElementById('myFinancial');
    myElement.innerHTML = "<FORM METHOD='POST' ACTION='" + resp.samlUrl + "'><INPUT TYPE='HIDDEN' NAME='NameValue' VALUE='" + resp.samlValue + "'></FORM>";
    const currForm: HTMLFormElement =   <HTMLFormElement>myElement.children[0];
    currForm.submit();
  }

  financialSso(){
    setTimeout(() => {
      console.log(this.authService.loginResponse);
      let url = "";
      if(this.authService.loginResponse.isHEQ == "true"){
        url= this.authService.configProvider.getProperty("heqSso");
      }else{
        url= this.authService.configProvider.getProperty("alegeusSso");
      }
      let myFinancialUrl: string = this.authService.configProvider.getProperty("loginUrl") + url;
      this.MyFinancialService.alegeusReq(myFinancialUrl).
        subscribe(response => {
          if (response.result && !(response.result === 0)) {
            let data = this.authService.handleDecryptedResponse(response);
            let url= data.samlUrl;
            let req = {NameValue : data.samlValue}
            scxmlHandler.postNewindow(url, "My Financials", req);
          }
        }, error => {
          this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
        }  
        );
    }, 500); 
  }
}
