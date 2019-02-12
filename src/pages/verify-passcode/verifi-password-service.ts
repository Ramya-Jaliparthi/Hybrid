import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from "../../providers/constants/constants.service";

@Injectable()
export class VerifyPasscodeService {

    constructor(
        private authService: AuthenticationService
    ) { }


    getverifyAccessCodeRequest(verifyAccessCodeUrl: string, generatedRequest: any) {
        console.log('verifyAccessCodeUrl:' + verifyAccessCodeUrl);
        let mask = this.authService.showLoadingMask('Verifying access code...');

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", verifyAccessCodeUrl, mask, JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2req)), this.authService.getHttpOptions(), 'Verifying access code...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                } else {
                    console.log('verifyAccessCode :: error =' + resobj.errormessage);
                    let emsg = resobj.displaymessage;
                    if (resobj.result === "-4") {
                        emsg = ConstantsService.MISMATCH_ACCESSCODE;
                    }
                    this.authService.handleAPIResponseError(resobj, emsg, verifyAccessCodeUrl);
                    return res1;
                }
            });
    }

    getverifyAccessCodeForAccountRegistrationRequest(verifyAccessCodeUrlForAccountRegistration: string, generatedRequest: any) {
        console.log('verifyAccessCodeForAccountRegistrationFlow:' + verifyAccessCodeUrlForAccountRegistration);
        let mask = this.authService.showLoadingMask('Verifying access code...');

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", verifyAccessCodeUrlForAccountRegistration, mask, JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2req)), this.authService.getHttpOptions(), 'Verifying access code...')
            .map(res1 => {
                let resobj = res1;//.json();
                if (resobj.result === "0") {
                    return resobj;
                } else {
                    console.log('verifyAccessCodeForAccountRegistrationFlow :: error =' + resobj.errormessage);
                    //let emsg = resobj.displaymessage;
                    return resobj;
                // //  this.authService.handleAPIResponseError(resobj, emsg, verifyAccessCodeUrlForAccountRegistration);
                //     if(resobj.result == "-90321" || resobj.result == "-90300" || resobj.result == "-90322"){
                //     return resobj;  
                //     }else{
                       
                //         this.authService.handleAPIResponseError(resobj, emsg, verifyAccessCodeUrlForAccountRegistration);
                          
                //     }
                  
                  
                }
            });
    }
    
    sendUpdateNotification(isEmailEdit: boolean, commChannel: string, commChannelType: string){
        let mobilewebURL = this.authService.configProvider.getProperty("mobilewebURL");
        const notificationRequest = {
        'useridin': this.authService.useridin,
        'commChannel':commChannel ,
        'commChannelType': commChannelType,
        'templateKeyword': isEmailEdit ? 'UPDATENOTIFICATION_EMAIL' : 'UPDATENOTIFICATION_MOBILE',
        'notificationParms': [
            {
            'keyName': 'firstName',
            'keyValue': this.authService.memFirstName ? this.authService.memFirstName : ''
            },
            {
            'keyName': 'myProfileURL',
            'keyValue': mobilewebURL
            },
            {
            'keyName': 'updatedFields',
            'keyValue': isEmailEdit ? ['Email'] : ['Phone Number']
            }
      ]
    };
    console.log('notificationRequest=', notificationRequest);
        let mask = this.authService.showLoadingMask('Verifying access code...');
        const isKey2req = false;
        let url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("sendupdatenotification");
        return this.authService.makeHTTPRequest("post", url, mask, JSON.stringify(this.authService.encryptPayload(notificationRequest, isKey2req)), this.authService.getHttpOptions(), '')
    }

}

