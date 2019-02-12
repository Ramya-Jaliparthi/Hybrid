import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MyDoctorService {

    constructor(
        private authService: AuthenticationService
    ) { }
    getDependentAndRecentVisitRequest(recentVistUrl: string, mask: any, request: any) {
        console.log('getRecentVisit Url: ' + recentVistUrl);
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", recentVistUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Recent Visits Data...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('getRecentVisit :: error =' + resobj.errormessage);
                    return resobj;
                }
            });
    }
}

