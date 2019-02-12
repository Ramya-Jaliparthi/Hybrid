import {
    DebitCardListRequestModelInterface, DebitCardListResponseModelInterface,
    DebitCardDetailsRequestModelInterface, DebitCardDetailsResponseModelInterface,
    DebitCardPinRequestModelInterface, DebitCardPinResponseModelInterface
} from './interfaces/manage-debit-cards.interface';

// getalegeuscardlist
export class DebitCardListRequestModel implements DebitCardListRequestModelInterface {
    public useridin: string;
}

export class DebitCardListResponseModel implements DebitCardListResponseModelInterface {
    public cardListInfo: cardListInfo[];
}

export class cardListInfo {
    public cardStatusCode: number;
    public cardProxyNumber: string;
    public cardLast4Digits: string;
    public firstName: string;
    public lastName: string;
    public namePrefix: string;
    public middleInitial: string;
    public cardIssueCde: number
}

// getalegeuscarddetails
export class DebitCardDetailsRequestModel implements DebitCardDetailsRequestModelInterface {
    public useridin: string;
    public cardProxyNumber: string;
}

export class DebitCardDetailsResponseModel implements DebitCardDetailsResponseModelInterface {
    public cardDetailsInfo: cardDetailsInfo[];
}

export class cardDetailsInfo {
    public cardStatusCode: number;
    public cardProxyNumber: string;
    public cardLast4Digits: string;
    public mailedDate: string;
    public activationDate: string;
    public expirationDate: string;
    public dependentId: string;
}

// getalegeuscardpin

export class DebitCardPinRequestModel implements DebitCardPinRequestModelInterface {
    public useridin: string;
    public cardProxyNumber: string;
}

export class DebitCardPinResponseModel implements DebitCardPinResponseModelInterface {
    public cardPin: string;
}