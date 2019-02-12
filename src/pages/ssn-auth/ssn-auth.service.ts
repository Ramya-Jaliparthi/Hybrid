import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class SsnAuthService {
  isMediCareUser: boolean = false;
  constructor(private authService: AuthenticationService) { }

  ssnAuthRequest(ssnAuthUrl: string, mask: any, request: any, options: any, ssnAuthText: string) {
    const isKey2Req = false;

    return this.authService.makeHTTPRequest("post", ssnAuthUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), options, ssnAuthText)
      .map((res) => {
        let resobj = res;
        if (resobj.result === "0") {
          resobj.message = resobj.lnmessage;
          this.authService.updateLNAttempt(resobj,true);
          return this.authService.handleDecryptedResponse(resobj);
        } else {
          console.log('getRecentRx :: error =' + resobj.errormessage);
          return resobj;
        }
      });
  }

}