import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
@Injectable()
export class UserMigrationService {
    migrationtype: string;
    singleApp: string = "SINGLE-APP";
    selectedMigratedUser : string;
    constructor(private authService: AuthenticationService) { }
    getUserAccountsRequest(memLookupUrl: any){
        console.log('getUserAccountsRequest Url: ' + memLookupUrl);
        const generatedRequest = {
            useridin: this.authService.useridin
        };
        const isKey2Req = false;
        let mask = this.authService.showLoadingMask('Accessing account Information...');
        return this.authService.makeHTTPRequest("post", memLookupUrl, mask, JSON.stringify(this.authService.encryptPayload(generatedRequest, isKey2Req)), this.authService.getHttpOptions(), 'Accessing account Information...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result == "0") {
                    return this.authService.handleDecryptedResponse(resobj);
                 } else {
                     //let emsg = resobj.displaymessage;
                     return resobj;
                    //this.authService.addAnalyticsAPIEvent(emsg, memLookupUrl, resobj.result);
                 }
            });
    }

    makeMigrationRequest(responseObj: any) {

        let requestObj = responseObj;

        if(this.authService.migrationType == this.singleApp){
        requestObj.password = "";
        }

        let mask = this.authService.showLoadingMask('Submitting Information...');
        const isKey2Req = false;
        let memMigrationUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memacctmerge");

        return this.authService.makeHTTPRequest("post", memMigrationUrl, mask, JSON.stringify(this.authService.encryptPayload(requestObj, isKey2Req)), this.authService.getHttpOptions(), 'Submitting Information...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.authService.handleDecryptedResponse(resobj);
               // } else if (resobj.errormessage) {
                    //let errMessage = resobj.displaymessage ? resobj.displaymessage : resobj.errormessage;
                    //console.log(errMessage);
                }else{
                    return resobj;
                }

            });
    }

    makeCommChannelSendCodeReq(request) {
        let mask = this.authService.showLoadingMask('Sending access code...');
        const isKey2req = false;
        let sendcommchlaccessUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("sendcommchlmigration");
        // let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token });
        return this.authService.makeHTTPRequest("post", sendcommchlaccessUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Sending access code...')
    }

    makeAccessCodeReq(request) {
        let mask = this.authService.showLoadingMask('Sending access code...');
        let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendaccesscode';
        console.log('send access code url:' + sendAccessCodeUrl);
        const isKey2Req = false;
        return this.authService.makeHTTPRequest("post", sendAccessCodeUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), 'Sending access code...')
    }

    postDestinationUrl() {
        let mask = null;
        let request = {}
        if(this.authService.useridin != this.selectedMigratedUser ){
             request = {
                useridin: this.authService.useridin,
                selecteduserid:this.selectedMigratedUser,   
                linkinfo: '/myprofile'
            }
        }else{
             request = {
                useridin: this.authService.useridin,  
                linkinfo: '/myprofile'
            }
        }
        
        const isKey2req = false;
        let postdestinationURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("postdestinationinfo");
        // let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token });
        return this.authService.makeHTTPRequest("post", postdestinationURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), '')
    }

}
