import { memberInfo, serviceCodes, reimburseMethod } from '../make-payment-response.model';

export interface MakePaymentDetailsRequestModelInterface {
    useridin: string;
}

export interface MakePaymentDetailsResponseModelInterface {
    membersList: memberInfo[];
    serviceTypeCodes: serviceCodes[];
    reimbursementMethodList: reimburseMethod[];
    disclosure: string;
    reimburseAgreement: string;
}