import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MemberInformationService {

    constructor(
        private authService: AuthenticationService
    ) { }
    memberInformationRequest(updateMemAuthUrl: string, request: any) {
        console.log("updateMember auth info url:" + updateMemAuthUrl);
        let mask = this.authService.showLoadingMask('Updating Member Information...');
        const generatedRequest = {
            ...request,
            useridin: this.authService.useridin
        };
        const isKey2Req = false;

        return this.authService.makeHTTPRequest("post", updateMemAuthUrl, mask, JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2Req)), this.authService.getHttpOptions(), 'Updating Member Information...')

            .map(res1 => {
                let resobj = res1;//.json();
                return resobj;
            });

    }


}

