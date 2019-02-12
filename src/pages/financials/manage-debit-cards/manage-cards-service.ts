import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { DebitCardListRequestModelInterface, DebitCardListResponseModelInterface, DebitCardDetailsRequestModelInterface, DebitCardDetailsResponseModelInterface, DebitCardPinRequestModelInterface, DebitCardPinResponseModelInterface } from '../modals/interfaces/manage-debit-cards.interface';

@Injectable()
export class ManageCardsService {

  cardsList: any;
  cardDetails: any;
  url: string;
  params = new HttpParams();

  constructor(private authService: AuthenticationService) {
    console.log('Hello ManageCardsService');

  }

  // getalegeuscardlist
  getManageDebitCardsList(request: DebitCardListRequestModelInterface, reqMask): Observable<DebitCardListResponseModelInterface> {
    this.url = "assets/data/financials/alegeuscardslist.json";
    //this.url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getalegeuscardlist");

    for (let key in request) {
      this.params = this.params.append(key.toString(), request[key]);
    }
    console.log('Url in ManageCardsService: ' + this.url);
    console.log('Params in ManageCardsService: ' + this.params);
    const isKey2req = false;

    return this.authService.makeHTTPRequest("get", this.url, reqMask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Debit Card List...')
      .map(response => {
        console.log('responseObj in ManageCardsService: ' + response);
        if (response.result === "0") {
          return this.authService.handleDecryptedResponse(response);
        } else {
          console.log('getManageDebitCardsList :: error =' + response.errormessage);
          return response;
        }
      });
  }

  // getalegeuscarddetails
  getManageDebitCardDetails(request: DebitCardDetailsRequestModelInterface, reqMask): Observable<DebitCardDetailsResponseModelInterface> {
    this.url = "assets/data/financials/alegeuscardslist.json";
    //this.url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getalegeuscarddetails");

    for (let key in request) {
      this.params = this.params.append(key.toString(), request[key]);
    }
    console.log('Url in ManageCardsService: ' + this.url);
    console.log('Params in ManageCardsService: ' + this.params);
    const isKey2req = false;

    return this.authService.makeHTTPRequest("get", this.url, reqMask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing your Cards Details...')
      .map(response => {
        console.log('responseObj in ManageCardsService: ' + response);
        if (response.result === "0") {
          return this.authService.handleDecryptedResponse(response);
        } else {
          console.log('getManageDebitCardDetails :: error =' + response.errormessage);
          return response;
        }
      });
  }

  // getalegeuscardpin
  getManageDebitCardPin(request: DebitCardPinRequestModelInterface, reqMask): Observable<DebitCardPinResponseModelInterface> {
    this.url = "assets/data/financials/alegeuscardslist.json";
    //this.url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getalegeuscardpin");

    for (let key in request) {
      this.params = this.params.append(key.toString(), request[key]);
    }
    console.log('Url in ManageCardsService: ' + this.url);
    console.log('Params in ManageCardsService: ' + this.params);
    const isKey2req = false;

    return this.authService.makeHTTPRequest("get", this.url, reqMask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Card Pin...')
      .map(response => {
        console.log('responseObj in ManageCardsService: ' + response);
        if (response.result === "0") {
          return this.authService.handleDecryptedResponse(response);
        } else {
          console.log('getManageDebitCardDetails :: error =' + response.errormessage);
          return response;
        }
      });
  }

  // getManageDebitCardSummary() {

  //   return this.cardSummary = [
  //     { "status": 'New', "firstName": 'John', "lastName": 'Sample', "accNbr": "9999" },
  //     { "status": 'Active', "firstName": 'John', "lastName": 'Sample', "accNbr": "4321" },
  //     { "status": 'Active', "firstName": 'John', "lastName": 'Sample', "accNbr": "6789" }
  //   ]
  // }

  // getManageCardDetails() {

  //   return this.cardDetails = [
  //     { "status": 'New', "firstName": 'John', "lastName": 'Sample', "accNbr": "9999", "IssueStatus": "Sent", "MailedDate": "03/15/2018", "ExpirationDate": "03/30/2018", "Pin": "5456" },
  //     { "status": 'Active', "firstName": 'John', "lastName": 'Sample', "accNbr": "4321", "IssueStatus": "", "MailedDate": "05/15/2018", "ExpirationDate": "02/30/2018", "Pin": "4565" },
  //     { "status": 'Active', "firstName": 'John', "lastName": 'Sample', "accNbr": "6789", "IssueStatus": "Sent", "MailedDate": "07/08/2018", "ExpirationDate": "11/01/2018", "Pin": "9826" }
  //   ]
  // }


}
