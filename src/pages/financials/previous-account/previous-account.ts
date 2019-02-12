import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FinancialsService } from './../common/financials-service';
import { FinancialAccountDetailsPage } from '../financial-account-details/financial-account-details';
import { FinancialsConstants } from '../constants/financials.constants';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { FinancialsAccountSummaryDetailsRequestModel } from '../modals/financials_summary_response.model';
import { FinancialsAccountSummaryDetailsRequestModelInterface } from '../modals/interfaces/financials_summary.interface';
import { MakePaymentPage } from '../make-payment/make-payment';
import { SchedulePaymentPage } from '../schedule-payment/schedule-payment';
@Component({
  selector: 'page-previous-account',
  templateUrl: 'previous-account.html',
})
export class PreviousAccountPage {

  financialsConstants = FinancialsConstants;
  previousAccounts: any = [];
  accountSummaryData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public financeService: FinancialsService, private authService: AuthenticationService) {
    const financialRequest: FinancialsAccountSummaryDetailsRequestModelInterface = new FinancialsAccountSummaryDetailsRequestModel();
    financialRequest.planyear = 2;
    financialRequest.useridin = this.authService.useridin;
    let reqMask = this.authService.showLoadingMask('Accessing Previous Financials Accounts...');
    this.financeService.getFinancialsAccountsSummaryDetail(financialRequest, reqMask)
      .subscribe(resp => {
        this.accountSummaryData =  resp && resp['algmsg'] && resp['algmsg'] ? resp['algmsg']:  resp;;
        this.previousAccounts = this.financeService.getAccountDetails(this.accountSummaryData, 2);
      });
    console.log(this.previousAccounts);
  }

  navigateToAllTransactionsPage() {
    try {
      // this.navCtrl.setRoot(MyClaimsPage);
    } catch (exception) {

    }
  }

  navigateToDetailsPage(account?) {
    try {
      this.navCtrl.push(FinancialAccountDetailsPage, {
        data: account.accountType,
        planYear: account.planYear,
        planStartDate: account.planStartDate,
        planEndDate: account.planEndDate
      });
    } catch (exception) {

    }
  }

  navigateToAboutDetailsPage(accountDetail) {
    try {
      //this.navCtrl.push(FinancialAccountDetailsPage);
    } catch (exception) {

    }

  }

  navigateToMakePaymentPage() {
    try {
      this.navCtrl.push(MakePaymentPage);
    } catch (exception) {

    }

  }
  navigateToSchedulePaymentPage() {
    try {
      this.navCtrl.push(SchedulePaymentPage);
    } catch (exception) {

    }

  }

  getHeader(item) {
    return this.financeService.getfinancialHeaderText(item);
  }


}
