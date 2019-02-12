import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from "../../providers/constants/constants.service";

@Injectable()
export class ChangePasswordService {

    constructor(
        private authService: AuthenticationService
    ) { }
    
    updatePasswordRequest(changePasswordURL: string, request: any) {
        console.log('updatePassword Url: ' + changePasswordURL);
        let mask = this.authService.showLoadingMask();

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", changePasswordURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result == "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('updatePassword :: error =' + resobj.errormessage);
                    let emsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_PASSWORD_SERVER_ERROR + resobj.displaymessage;
                    this.authService.handleAPIResponseError(resobj, emsg, changePasswordURL);
                }
            });
    }
    
}
