import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';


@Injectable()
export class MyFinancialService {

    constructor(
        private authService: AuthenticationService
    ) { }

    alegeusReq(url: string){
        let mask = this.authService.showLoadingMask('Accessing Plan information...');
        const request = {
            useridin: this.authService.useridin
        };
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", url, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Plan information..')    
        .map(res1 => {
                let resobj = res1;
                if (resobj.result === 0) {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    return resobj;
                }
            });
    }
}