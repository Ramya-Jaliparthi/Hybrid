import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MySettingsService {

    constructor(
        private authService: AuthenticationService
    ) { }
    getMemberProfileAndMemberAuthInfoRequest(memberProfileURL: string) {
        console.log('getMemberProfile  and getMemberAuthInfo and getCommChannelstatus  Url: ' + memberProfileURL);
        let mask = this.authService.showLoadingMask();
        const request = {
            useridin: this.authService.useridin
        };
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", memberProfileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result == "0") {
                    //resobj.result ==="0"
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('getMemberProfile :: error =' + resobj.errormessage);
                    return resobj;
                }
            });
    }
    /*
    getupdatePasswordRequest(changePasswordURL: string, request: any) {
        console.log('updatePassword Url: ' + changePasswordURL);
        let mask = this.authService.showLoadingMask();

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", changePasswordURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('updatePassword :: error =' + resobj.errormessage);
                    let emsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PASSWORD_SERVER_ERROR + resobj.displaymessage;
                    this.authService.handleAPIResponseError(resobj, emsg, changePasswordURL);
                }
            });
    }
    */
    getupdateMemberProfileRequest(updateMemberProileURL: string, request: any) {
        console.log('updateMemberProfile Url: ' + updateMemberProileURL);
        let mask = this.authService.showLoadingMask();

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result == "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('updateMemberProfile :: error =' + resobj.errormessage);
                    let emsg = resobj.displaymessage;
                    this.authService.handleAPIResponseError(resobj, emsg, updateMemberProileURL);
                    return resobj;
                }
            });
    }

    updateMemberProfileData(updateMemberProileURL: string,request: any) {
        console.log('updateMemberProfile Url: ' + updateMemberProileURL);
        let mask = this.authService.showLoadingMask();
        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result == "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('updateMemberProfile :: error =' + resobj.errormessage);
                    let emsg = resobj.displaymessage;
                    this.authService.handleAPIResponseError(resobj, emsg, updateMemberProileURL);
                    return resobj;
                }
            });
    }
}
