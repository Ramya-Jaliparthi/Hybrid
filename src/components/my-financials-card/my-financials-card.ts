import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController, Slides } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { NavController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';
import { MyFinancialService } from '../../pages/my-financial/my-financial-service';
import {FinancialLandingPage} from "../../pages/financials/financial-landing/financial-landing";
declare var scxmlHandler;
@Component({
  selector: 'my-financials-card',
  templateUrl: 'my-financials-card.html'
})
export class MyFinancialsCardComponent {

  @ViewChild(Slides) slides: Slides;

  private financeBlalanceData: Array<any> = [];
  private isPagerNeeded: boolean = false;
  memberInfo: any;


  public barChartOptions: any = null;
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


  public barChartType: string = 'horizontalBar';
  public barChartLegend: boolean = false;
  public barChartData: any[] = [
    { data: [2500], label: 'Available' },
    { data: [2950], label: 'Invested' },
    { data: [2250], label: 'Balance' },
    { data: [2250], label: 'Series D' }
  ];

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  constructor(public alertCtrl: AlertController,
    public authService: AuthenticationService,
    private userContext: UserContextProvider,
    public navCtrl: NavController,
    private config: ConfigProvider,
    private MyFinancialService: MyFinancialService
  ) {


    this.authService.makeFinamcialsRequest().subscribe(response => {
      if (response.result && !(response.result === "0")) {
        let errmsg = "Sorry this feature is not available at the moment, please try again later. ";
        if (response.displaymessage) {
          errmsg = response.displaymessage;
          this.authService.showAlert('ERROR', errmsg);
        }
      } else if (response) {

        let allAccounts: Array<any> = [];

        if (response["heqmsg"] && (response["heqmsg"] != "")) {
          let payLoad = { "message": response["heqmsg"] };
          let decryptedPayLoad = this.authService.decryptPayload(payLoad);
          let heqAccounts: any = decryptedPayLoad;
          if (heqAccounts) {
            allAccounts = allAccounts.concat(heqAccounts);
          }
        }
        if (response["algmsg"] && (response["algmsg"] != "")) {
          let payLoad = { "message": response["algmsg"] };
          let algAccounts: any = this.authService.decryptPayload(payLoad);
          if (algAccounts && algAccounts.length > 0) {
            allAccounts = allAccounts.concat(algAccounts);
          }
        }

        if (allAccounts.length > 0) {
          this.processAllAccounts(allAccounts);

        }
        else {
          let errmsg = "Sorry this feature is not available at the moment, please try again later. ";
          this.userContext.setFinancialsDataError(errmsg);
          document.getElementById('fincard_placeholder').innerHTML = 'Your financial accounts data is not available at this time.';
          this.authService.addAnalyticsAPIEvent(errmsg, this.config.getProperty("getFinanceBalance"), '');
        }
      }
    },
      error => {
        let errmsg = "Sorry this feature is not available at the moment, please try again later. ";
        if (error.displaymessage)
          errmsg = error.displaymessage;
        this.userContext.setFinancialsDataError(errmsg);
        document.getElementById('fincard_placeholder').innerHTML = 'Your financial accounts data is not available at this time.';
        this.authService.addAnalyticsAPIEvent(error.displaymessage, this.config.getProperty("getFinanceBalance"), error.result);

      }
    );

    this.barChartOptions = {

      scaleShowVerticalLines: false,
      scaleShowLabels: false,
      responsive: false,
      hover: {
        mode: false,
        animationDuration: 0
      },
      scales: {
        xAxes: [{
          stacked: true,
          display: false,
          ticks: {
            beginAtZero: false,
            callback: label => `T${label}`
          }
        }],
        yAxes: [{
          stacked: true,
          barThickness: 25,
          display: false,

        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },

      animation: {

        duration: 0,
        onComplete: function () {

          return;

        }
      },
      tooltips: { enabled: false }
    };

  }


  processAllAccounts(allAccounts: any) {
    let tempArray: Array<any> = [];
    if (allAccounts && allAccounts.length > 0) {
      allAccounts.forEach(account => {

        if (account.GetMemberBalanceResponse) {

          if (account.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos) {
            let savingAcct = account.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos.SavingsAccountInfo;
            if (savingAcct) {

              let savingActs = [];
              if (savingAcct instanceof Array) {
                savingActs = savingAcct;
              } else {
                savingActs = new Array(savingAcct);
              }

              savingActs.forEach(element => {

                let tempObject: any = element;
                let barChartData = [];

                let greenBarSize: number = 0;
                let greenBarValue = "";
                let greenBarLable = "Available";

                let purpleBarSize: number = 0;
                let purpleBarValue = "";
                let purpleBarLable = "Investment";

                let greyBarSize: number = 0;
                let greyBarValue = "";
                let greyBarLable = "Spent";


                let total: number = element.AvailableBalance + element.Investments;
                greenBarSize = element.AvailableBalance / total;
                greenBarValue = parseFloat(element.AvailableBalance).toFixed(2);
                purpleBarSize = element.Investments / total;
                purpleBarValue = parseFloat(element.Investments).toFixed(2);


                if (element.AccountId)
                  tempObject.AccountDisplaySubHeader = this.maskAccountNumber(element.AccountId);
                else
                  tempObject.AccountDisplaySubHeader = "";

                tempObject.firstLable = "Available";
                tempObject.firstLableAmount = greenBarValue;
                tempObject.firstBarColorCls = 'barGreenCls';

                tempObject.secondLable = "Investment";
                tempObject.secondLableAmount = purpleBarValue;
                tempObject.secondBarColorCls = 'barPurpleCls';

                barChartData.push({ 'label': greenBarLable, 'data': [greenBarSize], 'value': greenBarValue });
                barChartData.push({ 'label': purpleBarLable, 'data': [purpleBarSize], 'value': purpleBarValue });
                barChartData.push({ 'label': greyBarLable, 'data': [greyBarSize], 'value': greyBarValue });

                if (element.Type && (element.Type == "FSA" || element.Type == "HRA" || element.Type == "HSA")) {
                  tempObject.AccountDisplayHeader = ConstantsService.FINANCIALS_ACCOUNT_NAMES[element.Type];
                }

                tempObject.dashboardBarChartData = barChartData;

                tempArray.push(tempObject);

              });

            } else {
              console.log("SavingsAccountInfo  not found.");
            }

          } else {
            console.log("SavingsAccountInfos  not found.");
          }

          if (account.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos) {
            let reimbAct: any = account.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos.ReimbursementAccountInfo;

            if (reimbAct) {

              let reimbActs = [];
              if (reimbAct instanceof Array) {
                reimbActs = reimbAct;
              } else {
                reimbActs = new Array(reimbAct);
              }

              console.log(reimbActs);
              reimbActs.forEach(element => {

                let tempObject: any = element;
                let barChartData = [];

                let greenBarSize: number = 0;
                let greenBarValue = "";
                let greenBarLable = "Available";

                let purpleBarSize: number = 0;
                let purpleBarValue = "";
                let purpleBarLable = "Investment";

                let greyBarSize: number = 0;
                let greyBarValue = "";
                let greyBarLable = "Spent";


                let total: number = element.ElectionAmount;
                greenBarSize = element.AvailableBalance / total;
                greenBarValue = parseFloat(element.AvailableBalance).toFixed(2);

                greyBarSize = element.YTDClaimsAllowed / total;
                greyBarValue = parseFloat(element.YTDClaimsAllowed).toFixed(2);

                tempObject.showAnnualElection = true;
                tempObject.AnnualElection = element.ElectionAmount;

                tempObject.firstLable = "Available";
                tempObject.firstLableAmount = greenBarValue;
                tempObject.firstBarColorCls = 'barGreenCls';

                tempObject.secondLable = "Spent";
                tempObject.secondLableAmount = greyBarValue;
                tempObject.secondBarColorCls = 'barGreyCls';



                if (element.Type && (element.Type == "FSA" || element.Type == "HRA" || element.Type == "HSA")) {
                  tempObject.AccountDisplayHeader = ConstantsService.FINANCIALS_ACCOUNT_NAMES[element.Type];
                }

                let Description: string = element.Description; //2.3
                if (Description && Description.trim() != "") {

                  let words: Array<any> = Description.split(" ");
                  if (words.length == 5) {
                    tempObject.AccountDisplaySubHeader = words[2] + " - " + words[4];
                  }
                }
                else {
                  tempObject.AccountDisplaySubHeader = "";
                }

                barChartData.push({ 'label': greenBarLable, 'data': [greenBarSize], 'value': greenBarValue });
                barChartData.push({ 'label': purpleBarLable, 'data': [purpleBarSize], 'value': purpleBarValue });
                barChartData.push({ 'label': greyBarLable, 'data': [greyBarSize], 'value': greyBarValue });

                tempObject.dashboardBarChartData = barChartData;

                tempArray.push(tempObject);

              });
            } else {
            }
          } else {
            console.log("ReimbursementAccountInfos  not found.");
          }
        } else {
        }


        if (account.AccountType) {

          let tempObject: any = account;
          let barChartData = [];

          let accountType = account.AccountType.trim().toUpperCase();

          let greenBarSize: number = 0;
          let greenBarValue = "";
          let greenBarLable = "Available";

          let purpleBarSize: number = 0;
          let purpleBarValue = "";
          let purpleBarLable = "Investment";

          let greyBarSize: number = 0;
          let greyBarValue = "";
          let greyBarLable = "Spent";

          //AlegeusHSA
          if (accountType == "HSA" || accountType == "ABH") {
            // RK: 12dec17. As per Amy, HSABalance should be used instead of TotalHSABalance
            let hsaBal = account.HSABalance;
            let total: number = hsaBal + account.PortfolioBalance;
            greenBarSize = hsaBal / total;
            greenBarValue = parseFloat(hsaBal).toFixed(2);
            purpleBarSize = account.PortfolioBalance / total;
            purpleBarValue = parseFloat(account.PortfolioBalance).toFixed(2);


            if (account.ExternalBankAccounts) {
              if (account.ExternalBankAccounts instanceof Array && account.ExternalBankAccounts.length > 0) {
                tempObject.AccountDisplaySubHeader = this.maskAccountNumber(account.ExternalBankAccounts[0].BankAccountNumber);
              } else {
                tempObject.AccountDisplaySubHeader = this.maskAccountNumber(account.ExternalBankAccounts.BankAccountNumber);
              }
            } else
              tempObject.AccountDisplaySubHeader = "";

            tempObject.firstLable = "Available";
            tempObject.firstLableAmount = greenBarValue;
            tempObject.firstBarColorCls = 'barGreenCls';

            tempObject.secondLable = "Investment";
            tempObject.secondLableAmount = purpleBarValue;
            tempObject.secondBarColorCls = 'barPurpleCls';

          }
          else {

            let total: number = account.AnnualElection;
            greenBarSize = account.Balance / total;
            greenBarValue = parseFloat(account.Balance).toFixed(2);

            greyBarSize = account.Payments / total;
            greyBarValue = parseFloat(account.Payments).toFixed(2);

            let PlanStartDate: string = account.PlanStartDate;
            let PlanEndDate: string = account.PlanEndDate;

            if (this.formatDate(PlanStartDate) != "")
              tempObject.AccountDisplaySubHeader = this.formatDate(PlanStartDate);
            if (this.formatDate(PlanEndDate) != "")
              tempObject.AccountDisplaySubHeader = tempObject.AccountDisplaySubHeader + ' - ' + this.formatDate(PlanEndDate)


            tempObject.showAnnualElection = true;

            tempObject.firstLable = "Available";
            tempObject.firstLableAmount = greenBarValue;
            tempObject.firstBarColorCls = 'barGreenCls';

            tempObject.secondLable = "Spent";
            tempObject.secondLableAmount = greyBarValue;
            tempObject.secondBarColorCls = 'barGreyCls';
          }

          barChartData.push({ 'label': greenBarLable, 'data': [greenBarSize], 'value': greenBarValue });
          barChartData.push({ 'label': purpleBarLable, 'data': [purpleBarSize], 'value': purpleBarValue });
          barChartData.push({ 'label': greyBarLable, 'data': [greyBarSize], 'value': greyBarValue });

          tempObject.dashboardBarChartData = barChartData;
          tempArray.push(tempObject);

        }
      });
    }

    // Apply sorting and decoration for chart data
    tempArray.sort(this.compare);

    this.financeBlalanceData = tempArray;
    if (this.financeBlalanceData.length > 1)
      this.isPagerNeeded = true;

    this.userContext.setFinancialsData(this.financeBlalanceData);
  }

  compare(a: any, b: any) {
    var comparison = a.AccountDisplayHeader.toLowerCase().localeCompare(b.AccountDisplayHeader.toLowerCase());
    /* If strings are equal in case insensitive comparison */
    if (comparison === 0) {
      /* Return case sensitive comparison instead */
      return a.AccountDisplayHeader.localeCompare(b.AccountDisplayHeader);
    }
    /* Otherwise return result */
    return comparison;
  }



  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: psubtitle,
      buttons: ['OK']
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  goToMyFinancials() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(FinancialLandingPage);
    // this.myFinancialSso();
  }

  formatDate(str) {
    //formats yyyymmdd to mm/dd/yyyy
    let formatedStr = "";
    if (str && str.trim().length == 8) {
      let year = str.substr(0, 4);
      let month = str.substr(4, 2);
      let day = str.substr(6, 2);
      formatedStr = month + '/' + day + '/' + year;
    }

    return formatedStr;
  }

  maskAccountNumber(str) {

    let maskedStr = "";

    // mask all but the last 4 digits
    try {
      if (str && str.length > 0) {
        if (str.indexOf('*') > 0) {   //already masked
          maskedStr = "Account No. " + str;
        }
        else {
          let length = str.length;
          let maskedLength = length - 4;
          maskedStr = str.substr(length - 4, 4);
          for (let i = 0; i < maskedLength; i++) {
            maskedStr = "*" + maskedStr;
          }

          maskedStr = "Account No. " + maskedStr;
        }
      }
    }
    catch (e) { }
    return maskedStr;

  }
  myFinancialSso(){
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
