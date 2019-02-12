import { cardListInfo, cardDetailsInfo } from '../manage-debit-cards-response.model';

// getalegeuscardlist
export interface DebitCardListRequestModelInterface {
    useridin: string;
}

export interface DebitCardListResponseModelInterface {
    cardListInfo: cardListInfo[];
}

// getalegeuscarddetails
export interface DebitCardDetailsRequestModelInterface {
    useridin: string;
    cardProxyNumber: string;
}

export interface DebitCardDetailsResponseModelInterface {
    cardDetailsInfo: cardDetailsInfo[];
}

// getalegeuscardpin
export interface DebitCardPinRequestModelInterface {
    useridin: string;
    cardProxyNumber: string;
}

export interface DebitCardPinResponseModelInterface {
    cardPin: string;
}