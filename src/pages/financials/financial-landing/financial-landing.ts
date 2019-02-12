import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FinancialsService } from './../common/financials-service';
import { FinancialAccountDetailsPage } from '../financial-account-details/financial-account-details';
import { FinancialsConstants } from '../constants/financials.constants';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { FinancialsAccountSummaryDetailsRequestModel } from '../modals/financials_summary_response.model';
import { FinancialsAccountSummaryDetailsRequestModelInterface } from '../modals/interfaces/financials_summary.interface';
import { MakePaymentPage } from '../make-payment/make-payment';
import { ManageBankAccPage } from '../manage-bank-accounts/manage-bank-account';
import { SchedulePaymentPage } from '../schedule-payment/schedule-payment';
import { PreviousAccountPage } from '../previous-account/previous-account';
import { ManageDebitCardsPage } from '../manage-debit-cards/manage-debit-cards';
import { MakePaymentLandingPage } from '../make-payment-landing/make-payment-landing';


@Component({
  selector: 'page-financial-landing',
  templateUrl: 'financial-landing.html',
})
export class FinancialLandingPage {
  accountSummaryData: any = [];
  previousAccounts: any = [];
  presentAccounts: any = [];
  futureAccounts: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public financeService: FinancialsService, private authService: AuthenticationService) {
    const financialRequest: FinancialsAccountSummaryDetailsRequestModelInterface = new FinancialsAccountSummaryDetailsRequestModel();
    financialRequest.planyear = 0;
    financialRequest.useridin = this.authService.useridin;
    let reqMask = this.authService.showLoadingMask('Accessing Financials Account Summary...');
    this.financeService.getFinancialsAccountsSummaryDetail(financialRequest, reqMask)
      .subscribe(resp => {
        //this.accountSummaryData = resp['algmsg'];
        this.accountSummaryData =  resp && resp['algmsg'] && resp['algmsg'] ? resp['algmsg']:  resp;
        // added item.planYear === 1 to display current year data
        // this.presentAccounts = this.accountSummaryData.filter((res) => {
        //   return res.planYear === 1;
        // });
        this.presentAccounts = this.financeService.getAccountDetails(this.accountSummaryData, 1);
        // added item.planYear === 2 to display past year data 
        this.previousAccounts = this.financeService.getAccountDetails(this.accountSummaryData, 2);
        // added item.planYear === 3  to display current year future year data
        this.futureAccounts = this.financeService.getAccountDetails(this.accountSummaryData, 3);

        console.table(this.accountSummaryData);
        console.table(this.previousAccounts);
        console.table(this.presentAccounts);
        console.table(this.futureAccounts);
      });

  }

  navigateToAllTransactionsPage() {
    try {
      // this.navCtrl.setRoot(AllTransactionsPage);
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

  navigateToPreviousAccountsPage() {
    try {
      this.navCtrl.push(PreviousAccountPage);
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
      this.navCtrl.push(MakePaymentLandingPage);
    } catch (exception) {

    }

  }
  navigateToSchedulePaymentPage() {
    try {
      this.navCtrl.push(SchedulePaymentPage);
    } catch (exception) {

    }

  }
  navigateToManageBankAccountsPage() {
    try {
      this.navCtrl.push(ManageBankAccPage);
    } catch (exception) {

    }
  }
  navigateToManageDebitCardPage() {
    try {
      this.navCtrl.push(ManageDebitCardsPage);
    } catch (exception) {

    }
  }

  getHeader(item) {
    return this.financeService.getfinancialHeaderText(item);
  }


}
