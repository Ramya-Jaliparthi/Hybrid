import { FinancialsAccountSummaryDetailsResponseModelInterface } from './interfaces/financials_summary.interface';

export class FinancialsAccountSummaryDetailsRequestModel {
    useridin: string;
    planyear: number;
}

export class FinancialsAccountSummaryDetailsResponseModel implements FinancialsAccountSummaryDetailsResponseModelInterface {
    public financialsAccountDetails: FinancialAccountDetail[];
}

export class FinancialAccountDetail {
    public accountDisplayHeader: string;
    public planYear: -1;
    public planStartDate: string;
    public planEndDate: string;
    public balance: 0;
    public availBalance: 0;
    public availableRollover: 0;
    public payments: 0;
    public annualElection: 0;
    public contributionsYTD: 0;
    public remainingContributions: 0;
}
