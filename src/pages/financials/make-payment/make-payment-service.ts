import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { MakePaymentDetailsRequestModelInterface, MakePaymentDetailsResponseModelInterface } from '../modals/interfaces/make-payment.interface';
import { CompileMetadataResolver } from '@angular/compiler';

@Injectable()
export class MakePaymentService {
  accountSummary: any;
  url: string;
  params = new HttpParams();
  paymentDetails: any;

  constructor(private authService: AuthenticationService) {
    console.log('Hello MakePaymentService');

  }

  getMakePaymentFormDetails(request: MakePaymentDetailsRequestModelInterface, reqMask): Observable<MakePaymentDetailsResponseModelInterface> {
    this.url = "assets/data/financials/make_payment_form.json";
    //this.url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getAlegeusPaymentForm");

    for (let key in request) {
      this.params = this.params.append(key.toString(), request[key]);
    }
    console.log('Url in MakePaymentService: ' + this.url);
    console.log('Params in MakePaymentService: ' + this.params);
    const isKey2req = false;

    return this.authService.makeHTTPRequest("get", this.url, reqMask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Make Payment Form...')
      .map(response => {
        console.log('responseObj in MakePaymentService: ' + response);
        if (response.result === "0") {
          return this.authService.handleDecryptedResponse(response);
        } else {
          console.log('getMakePaymentFormDetails :: error =' + response.errormessage);
          return response;
        }
      });
  }

  setPaymentData(data) {
    this.paymentDetails = data;
    console.table(this.paymentDetails);
  }

  getPaymentData() {
    return this.paymentDetails = {
      
    };
  }

}
