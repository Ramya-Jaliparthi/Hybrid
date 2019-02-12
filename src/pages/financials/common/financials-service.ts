import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import {
    FinancialsAccountSummaryDetailsRequestModelInterface,
    FinancialsAccountSummaryDetailsResponseModelInterface
} from '../modals/interfaces/financials_summary.interface';

@Injectable()
export class FinancialsService {
    accountSummary: any;
    acccountSummaryUrl: string;
    params = new HttpParams();

    constructor(private authService: AuthenticationService) {

    }

    getFinancialsAccountsSummaryDetail(request: FinancialsAccountSummaryDetailsRequestModelInterface, reqMask): Observable<FinancialsAccountSummaryDetailsResponseModelInterface> {
         this.acccountSummaryUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("alegeusAccountsSummary");
        // this.acccountSummaryUrl = "assets/data/financials/alegeussummary.json";

        for (let key in request) {
            this.params = this.params.append(key.toString(), request[key]);
        }
        console.log('Url in FinancialsService: ' + this.acccountSummaryUrl);
        console.log('Params in FinancialsService: ' + this.params);
        const isKey2req = false;

        return this.authService.makeHTTPRequest("post", this.acccountSummaryUrl, reqMask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Financials Accounts...')
            .map(response => {
                console.log('response string in FinancialsService: ' + JSON.stringify(response));
                if (response.result === 0 || '0') {
                    return this.authService.handleDecryptedResponse(response);
                } else {
                    console.log('getFinancialsAccountsSummaryDetail :: error =' + response.errormessage);
                    return response;
                }
            });
    }

    getfinancialHeaderText(fincialInfo): string {
        const headers = {
            'HSA': 'Health Savings Account',
            'ABH': 'Health Savings Account',
            'AB2': 'Health Savings Account',
            'ROL': 'Flexible Spending Rollover Account',
            'FSA': 'Flexible Spending Account',
            'HRA': 'Health Reimbursement Arrangement',
            'HRD': 'Health Reimbursement Arrangement',
            'DTR': 'Deductible Tracking Account',
            'DCA': 'Dependent Care Account Commuter',
            'DFS': 'Dependent Care Flexible Spending Account',
            'FSL': 'Limited Purpose Flexible Spending Account',
            'PFS': 'Parking Account',
            'TFS': 'Transportation Account',
            'HIA': 'Health Incentive Account'
        };
        return headers[fincialInfo];
    }

    getAccountDetails(response, year) {
        const accountdetails = [];
        let account;
        account = this.filteredResults(response, 'HSA', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'ABH', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'AB2', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'HRA', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'HRD', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'FSA', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }
        account = this.filteredResults(response, 'ROL', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'RO1', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'FSL', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }
        account = this.filteredResults(response, 'DCA', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'DFS', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'PFS', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'TFS', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'HIA', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'DTR', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        account = this.filteredResults(response, 'OTHER', year);
        if (account.length >= 1) {
            account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
        }

        return accountdetails;
    }

    filteredResults(res, type, year) {
        const accountTypes = [
            'HSA',
            'ABH',
            'AB2',
            'HRA',
            'HRD',
            'ROL',
            'RO1',
            'DCA',
            'FSA',
            'DFS',
            'PFS',
            'TFS',
            'DTR',
            'HIA',
            'FSL'
        ];
        const result = res.filter((item) => {
            if (type === 'OTHER') {
                return item.planYear === year && accountTypes.indexOf(item.accountType) < 0;
            } else {
                return item.planYear === year && type === item.accountType && 'DTR' !== item.accountType;
            }
        });
        return result;
    }

}