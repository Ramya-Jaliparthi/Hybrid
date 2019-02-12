import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';


@Injectable()
export class ForgotPasswordService {
  userId:any;
  webNonMigratedUser:any;
  constructor(private authService: AuthenticationService) { }

  forgotPasswordRequest(forgotPswdUrl: string, mask: string, request: any, options: any, displayText: string) {
    const isKey2Req = false;
    return this.authService.makeHTTPRequest("post", forgotPswdUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), options, displayText)
      .map((res) => {
        let resobj = res;//.json();
        return resobj;
      });
  }


}
