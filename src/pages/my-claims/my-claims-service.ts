import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MyClaimsService {


    constructor(
        private authService: AuthenticationService
    ) { }
    getClaimsEndPointRequest(claimesUrl: string) {
        console.log('getAllRecentRx Url: ' + claimesUrl);
        let mask = this.authService.showLoadingMask('Accessing claims information...');
        const request = {
            useridin: this.authService.useridin
        };
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", claimesUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    return resobj;
                }
            });
    }

    getDependentClaimsEndPointRequest(claimesUrl: string, request: any) {
        console.log('dependentClaimsEndPoint Url: ' + claimesUrl);
        let mask = this.authService.showLoadingMask('Accessing claims information...');
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", claimesUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing claims information...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    return resobj;
                }
            });
    }

    getClaimsforICNEndPointRequest(claimesUrl: string, mask: any, request: any) {
        console.log('claims information Url: ' + claimesUrl);
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", claimesUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing claims information...')

            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('getclaimsforICN :: error =' + resobj.errormessage);
                    let emsg = resobj.displaymessage;

                    this.authService.handleAPIResponseError(resobj, emsg, claimesUrl);
                }
            });
    }
}

