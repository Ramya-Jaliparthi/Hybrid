import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';


@Injectable()
export class AuthPersonalInfoService {
    constructor(private authService: AuthenticationService) { }
    authPersonalInfoRequest(request: any,
        registerType: string, updateMemAuthUrl: any) {

        if (registerType == "MOBILE") {
            request.mobile = this.authService.useridin;
        } else {
            request.email = this.authService.useridin;
        }


        let mask = this.authService.showLoadingMask('Updating Member Information');

        const generatedRequest = {
            ...request,
            useridin: this.authService.useridin
        };

        const isKey2Req = false;

        let encryptedRequest = JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2Req));


        console.log("updateMember auth info url:" + updateMemAuthUrl);

        return this.authService.makeHTTPRequest("post", updateMemAuthUrl, mask, encryptedRequest, this.authService.getHttpOptions(), 'Updating Member Information')
            .map(res1 => {
                let resobj = res1;//.json();
                console.log(res1);
                return resobj;
            })
    }
}