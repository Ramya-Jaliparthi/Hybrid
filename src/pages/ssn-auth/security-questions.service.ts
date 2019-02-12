import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class SecurityQuestionsService {

  constructor(private authService: AuthenticationService) { }

  securityQuestionsRequest(securityQUrl: string, mask: any, request: any, options: any, securityQText: string) {
    const isKey2Req = false;

    return this.authService.makeHTTPRequest("post", securityQUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), options, securityQText)
      .map((res) => {
        if (res.result === "0") {
          return this.authService.handleDecryptedResponse(res);
        } else {
          console.log('getRecentRx :: error =' + res.errormessage);
          return res;
        }
      });
  }

}