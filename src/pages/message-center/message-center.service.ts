import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MessageCenterService {

  constructor(private authService: AuthenticationService) { }

  messageCenterRequest(updatememalertsUrl: string, request: any) {
    let pMsg: string = "";
    const isKey2Req = false;
    console.log('updatememalerts url :: ' + updatememalertsUrl);
    let mask = this.authService.showLoadingMask(pMsg);

    return this.authService.makeHTTPRequest("post", updatememalertsUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), '')
      .map((res) => {
        return res;
      });
  }

}