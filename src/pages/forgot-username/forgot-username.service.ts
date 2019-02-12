import { AuthenticationService } from '../../providers/login/authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ForgotUserNameService {
    constructor(private authService: AuthenticationService) { }

    forgotUserNameRequest(request: any, verifyUserNameUrl: string, displayTxt:string) {
        let isKey2Req = false;
        //let pMsg: string = isFromSendAccCode ? "Sending..." : "Verifying...";
        let mask = this.authService.showLoadingMask(displayTxt);

        return this.authService.makeHTTPRequest("post", verifyUserNameUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(),displayTxt )
            .map((res) => {
                let resobj = res;//.json();       
                return resobj;
            });
    }


}