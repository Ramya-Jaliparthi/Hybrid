import { MakePaymentDetailsResponseModelInterface } from './interfaces/make-payment.interface';

export class MakePaymentDetailsRequestModel {
    public useridin: string;
}

export class MakePaymentDetailsResponseModel implements MakePaymentDetailsResponseModelInterface {
    public membersList: memberInfo[];
    public serviceTypeCodes: serviceCodes[];
    public reimbursementMethodList: reimburseMethod[];
    public disclosure: string;
    public reimburseAgreement: string;
}

export class memberInfo {
    public firstName: string;
    public lastName: string;
}

export class serviceCodes {
    public code: string;

}

export class reimburseMethod {
    public method: string;

}
