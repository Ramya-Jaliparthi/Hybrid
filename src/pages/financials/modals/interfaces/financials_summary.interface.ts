import { FinancialAccountDetail} from '../financials_summary_response.model';

export interface FinancialsAccountSummaryDetailsRequestModelInterface {
    useridin: string;
    planyear: number;    
}

export interface FinancialsAccountSummaryDetailsResponseModelInterface {
    financialsAccountDetails: FinancialAccountDetail[];
}