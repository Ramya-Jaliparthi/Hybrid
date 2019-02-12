import { Injectable } from '@angular/core';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';

declare var scxmlHandler;

@Injectable()
export class LoginService {

    constructor(
        private authService: AuthenticationService,
        public alertCtrl: AlertController
    ) { }

    loginRequest(request: any) {
        let loginUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin';
        console.log('login request url:' + loginUrl);
        let mask = this.authService.showLoadingMask('Signing In...');
        const isKey2Req = false;

        this.authService.encloginreq = this.authService.encryptPayload(request, isKey2Req);

        return this.authService.makeHTTPRequest("post", loginUrl, mask, JSON.stringify(this.authService.encloginreq), this.authService.getHttpOptionsWithoutBearerToken(), 'Signing In')
            .map((res) => {
                let resobj = res;
                if (resobj.access_token) {
                    scxmlHandler.setTestfairyUserId(this.authService.useridin);
                    this.authService.setLoginResponse(resobj,false);
                    this.authService.currentUserScopename = resobj.scopename;
                    //this.updateSwrveUserId();
                    return res;
                } else if (resobj.result && resobj.result != "0") {
                    console.log('resendLoginRequest :: error =' + resobj.errormessage);
                    this.authService.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, resobj.displaymessage);
                    this.authService.addAnalyticsAPIEvent(resobj.displaymessage, this.authService.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', resobj.result);

                }

            })


    }

    updateSwrveUserId() {

        let swrveUserId = '';
        if (scxmlHandler.getUserIdFromSwrve() != '') {
            swrveUserId = scxmlHandler.getUserIdFromSwrve();
            let params: Array<any> = [];
            const swrveKey = 'swrveid';
            params.push({ "memkeyname": swrveKey, "memkeyvalue": swrveUserId });
            this.updateMemberProfile(params, null, "loginpage", swrveUserId);
        }
        return true;
    }

    showAlert(ptitle, psubtitle, callBackHandler?, scopeParam?, cssClassName?) {
        let alert = this.alertCtrl.create({
            title: ptitle,
            subTitle: psubtitle,
            cssClass: cssClassName ? cssClassName : "",
            buttons: [{
                text: 'Ok',
                handler: () => {
                    alert.dismiss().then(() => {
                        if (callBackHandler) {
                            window.setTimeout(() => {
                                callBackHandler.call(scopeParam);
                            }, 300);

                        }
                    });
                    return false;
                }
            }]
        });
        alert.present();
        this.authService.setAlert(alert);
    }

    updateMemberProfile(jsonArrayProfile: Array<any>, password: string, fromWhere: string, value: any) {
        let mask = this.authService.showLoadingMask();

        setTimeout(() => {
            const request = {
                useridin: this.authService.useridin
            };

            if (jsonArrayProfile != null) {
                request["memobject"] = jsonArrayProfile;
            }

            if (password != undefined && password.length > 0) {
                request["passwordin"] = String(password);
            }

            const isKey2req = false;

            let updateMemberProileURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("updatememprofileEndPoint");

            console.log('updateMemberProfile Url: ' + updateMemberProileURL);

            this.authService.makeHTTPRequest("post", updateMemberProileURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
                .map(res1 => {
                    let resobj = res1;
                    if (resobj.result === "0") {
                        //alert('success swere update');
                        return this.authService.handleDecryptedResponse(resobj);
                    } else {
                        console.log('updateMemberProfile :: error =' + resobj.errormessage);
                        let emsg = resobj.displaymessage;
                        this.authService.handleAPIResponseError(resobj, emsg, updateMemberProileURL);
                    }
                })
                .subscribe(response => {
                    console.log('Response updateMemberProfile:', response);

                },
                err => {
                    console.log("Error while updateMemberProfile Info -" + JSON.stringify(err));
                    let errmsg = ConstantsService.ERROR_MESSAGES.LOGINPAGE_MEMPROFILE_UPDATE_ERROR;
                    if (err.displaymessage) {
                        errmsg = err.displaymessage;
                    }
                    errmsg += ". SwrveId not updated.";
                    this.authService.addAnalyticsAPIEvent(errmsg, updateMemberProileURL, err.result);
                }
                );
        }, 500);
    }

}   