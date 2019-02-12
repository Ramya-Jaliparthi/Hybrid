import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../models/login/token.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'
import { EncryptedRequest } from '../../models/login/encryptedRequest.model';
import { ConfigProvider } from '../../providers/config/config';
import 'rxjs/Rx';
import { LoadingMaskProvider } from '../../providers/loading-mask/loading-mask';
import { MessageProvider } from '../../providers/message/message';
import { ConstantsService } from '../../providers/constants/constants.service';
import { IdleTimerService } from '../../providers/utils/idle-timer-service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { RegType } from '../../models/login/regType.enum';

import * as moment from 'moment';
import { MemberInformationModel } from '../../models/member-information/member-information.model';

declare var scxmlHandler: any;

@Injectable()
export class AuthenticationService {

    token: Token;
    useridin: string;
    acAllowOrigin: string = 'http://localhost';
    access_token: string;
    encloginreq: EncryptedRequest;
    memberInfoRowSet: any;
    memberInfo: MemberInformationModel;
    memAuthData: any;
    tokenRes: any;
    wellnessInfo: any;
    fitnessInfo: any;
    migrationType: string;
    memFirstName: string;
    healthyLivingInfo: any;
    currentUserScopename: string;
    loginResponse: any;
    isVerifycodeRequested: string = "false";
    sessionConfirmationAlert: any = null;
    alert: Alert;
    errorCodes: Array<number> = [-1, -2, -3, -4];
    deepLink: string = "";
    messageAlertsInMemoryVals: any = new Array();
    messageAlertsCount: number = 0;
    isMessageAlertsAPIInvoked: boolean = false;
    redirecttoMemPage: boolean = false;
    authlnattemptcount: any;
    authLNAllowed: any;
    authLNQuestionTried: boolean = false;
    sendAccessCodeUrl: any;
    updateMemberProileURL: any;
    preferenceParams: any;
    pageName: any;
    isPreferenceVerified: boolean = false;
    getUserDetails: boolean = false;
    previousTxtMsgMarketingFlag: boolean = false;
    previousEmailMarketingFlag: boolean = false;
    IS_ARTICLES_LOADED: boolean = false;
    IS_ARTICLES_CALLED_FIRST: boolean = false;
    memberInfoError: boolean = false;
    AUTH_ACCESS_END: string = "access";
    AUTH_COMMON_END: string = "common";
    destinationURL: any;

    constructor(private http: HttpClient,
        public configProvider: ConfigProvider,
        public alertCtrl: AlertController,
        public loadingMask: LoadingMaskProvider,
        public messageProvider: MessageProvider,
        public userContext: UserContextProvider,
        public idleTimerService: IdleTimerService
    ) {

        // this call is made to resolve DNS for performance improvement
        window['AuthenticationServiceRef'] = {
            component: this
        };

    }

    initAuthService() {
        window.setTimeout(() => {
            this.makeLoginPreflightRequest().subscribe(response => {
            },
                error => {
                    console.log("makeLoginPreflightRequest error : ", error)
                });
        },
            50);
    }

    makeHTTPRequest(httpMethod: string, url: string, loadingMask: any, data?: any, options?: any, loadingmsg?: any) {
        console.log("Making http request", httpMethod, url, data, options);
        let httpRef: any;
        if (httpMethod.toLowerCase() == "get") {
            httpRef = this.http.get(url, options);
        } else if (httpMethod.toLowerCase() == "post") {
            if (options == null) {
                httpRef = this.http.post(url, data, this.getHttpOptions())
            }
            else {
                httpRef = this.http.post(url, data, options)
            }
        }
        return httpRef
            .catch((error) => {
                // as part of angular 4 to angular 5 migration, error object is restructured to match existing code.
                let status = error.status;
                error = error.error;
                error.status = status;
                //Add upload logs in all errors from API calls.
                //Each log should include - user email, api call, error object. 
                console.log("==================HTTP RESPONSE ERROR=====================");
                console.log("API Call: " + url);
                console.log("Error object: ", error);
                console.log("============================================================");
                try {
                    scxmlHandler.writeToCuemeLog("==================HTTP RESPONSE ERROR=====================");
                    scxmlHandler.writeToCuemeLog("User: " + this.useridin);
                    scxmlHandler.writeToCuemeLog("API Call: " + url);
                    scxmlHandler.writeToCuemeLog("Error object: " + JSON.stringify(error));
                    scxmlHandler.writeToCuemeLog("============================================================");
                } catch (e) { }

                //When to upload logs:
                //1. On API error in sign-in, register
                //2. On user session timeout
                let logsUploaded = false;
                try {
                    if (url.indexOf(this.configProvider.getProperty("authEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("memAuthEndPoint")) != -1) {
                        scxmlHandler.uploadLogs();
                        logsUploaded = true;
                    }
                }
                catch (e) { }
                //If error contains message "Invalid Access token. Access token expired", then raise event SESSION_EXPIRED (uncomment code below).
                //this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
                if (error.status === 404) {
                    return Observable.throw({ displaymessage: "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'> 1-888-772-1722 </a> for immediate assistance." });
                }
                let errobj = error;
                if (error.status && error.status == 401) {
                    if (errobj.fault) {

                        let errfault = errobj.fault;
                        if (errfault.faultstring && errfault.faultstring === 'Access Token expired') {
                            scxmlHandler.writeToCuemeLog("Access Token expired response from server.. Logging out user..");
                            scxmlHandler.uploadLogs();
                            this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
                            return Observable.throw(error);
                        }
                    }
                    else if (errobj.displaymessage) {
                        // this.showAlert('', errobj.displaymessage);
                        this.addAnalyticsAPIEvent(errobj.displaymessage, url, errobj.result);
                        return Observable.throw(error);
                    }
                    else
                        return Observable.throw(error);
                } else {
                    if (error.status != undefined && error.status == 0) {
                        errobj.displaymessage = 'Check your internet connection and try again.';
                    }
                    // TODO: retry same request. for now, just show the error
                    //List of error codes for which handling will hanppen in component.
                    let errorCodes: Array<string> = ["-1", "-2", "-3", "-4"];
                    console.log('error code status :: ' + errorCodes.indexOf(errobj.result));
                    if (url.indexOf(this.configProvider.getProperty("getDependnetsListEndPoint")) != -1) {
                        this.userContext.setDependentsList(null);
                    } else if (errorCodes.indexOf(errobj.result) != -1 ||
                        url.indexOf(this.configProvider.getProperty("getAlertsEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("getFinanceBalance")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("verifyUserEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("verifyresetacEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("recentRxEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("recentVisit")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("claimsEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("claimsforICNEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("depClaimsforICNEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("dependentClaimsEndPoint")) != -1 ||
                        url.indexOf(this.configProvider.getProperty("providerClaimsEndPoint")) != -1 ||
                        ((url.indexOf(this.configProvider.getProperty("news_articles")) != -1) && this.IS_ARTICLES_CALLED_FIRST)
                    ) {
                        return Observable.throw(errobj);
                    }
                    else if (errobj.displaymessage) {
                        if (errobj.displaymessage != "The access code you entered does not match our records. Please try again.") {
                            this.showAlert('', errobj.displaymessage);
                        }

                        this.addAnalyticsAPIEvent(errobj.displaymessage, url, errobj.result);
                        return Observable.throw(errobj);
                    } else if (errobj.fault) {
                        let errfault = errobj.fault;
                        if (errfault.faultstring) {
                            if (errfault.faultstring === 'Unexpected EOF at target') {
                                this.showAlert('', 'Please retry');
                                this.addAnalyticsAPIEvent('Please retry', url, '401 Unauthorized');
                            } else
                                this.showAlert('', errfault.faultstring);
                            this.addAnalyticsAPIEvent(errfault.faultstring, url, '401 Unauthorized');
                            return Observable.throw(errobj);
                        }
                    } else {
                        console.log("Unhandled Error in http request: ", error);
                        this.showAlert('', 'This feature is not available at the moment. Please try again later.');
                        this.addAnalyticsAPIEvent('This feature is not available at the moment. Please try again later.', url, '');
                        return Observable.throw(errobj);
                    }
                }
            })

            .finally(() => {
                if (loadingMask) {
                    this.hideLoadingMask(loadingMask);
                }
            });
    }

    //Call when session times out or when logging out.
    clearSession() {
        this.token = null;
        this.useridin = null;
        this.access_token = null;
        this.encloginreq = null;
        this.memberInfo = null;
        this.tokenRes = null;
        this.isVerifycodeRequested = "false";
    }

    getToken(): Token {
        return this.token;
    }

    makeTokenRequest(showLoadingMask: boolean): Observable<any> {
        console.log(this.configProvider.getProperty("serviceUrl"));
        if (!window.navigator.onLine) {
            this.showAlert(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_CAPS, ConstantsService.ERROR_MESSAGES.INTERNET_CONNECTION_ERROR);
            return;
        }
        let mask: any = null;
        if (showLoadingMask) {
            mask = this.showLoadingMask();
        }
        let getTokensUrl = this.configProvider.getProperty("serviceUrl") + this.configProvider.getProperty("tokenEndPoint");
        console.log('getTokensUrl=' + getTokensUrl);
        return this.makeHTTPRequest("get", getTokensUrl, mask)
            .timeout(10000)
            .map(response => {
                let resobj = response;
                this.token = resobj;
                let encryptionService = new EncryptedRequest();
                encryptionService.generateKeys(this.token);
                return resobj;
            });
    }

    makeLoginPreflightRequest() {
        let httpRef: any;
        let options = { headers: null, params: null }
        httpRef = this.http.get(this.configProvider.getProperty("loginUrl"), options)
        return httpRef
            .catch((error) => {
                console.log("Error in makeLoginPreflightRequest request: ", error);
            })
            .map(response => {
                return response;
            });
    }
    makeRefreshTokenRequest() {

        setTimeout(() => {
            let refreshTokenUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("refreshTokenEndPoint");
            console.log('login request url:' + refreshTokenUrl);
            let mask = this.showLoadingMask();
            let request: any = { "grant_type": "refresh_token", "refresh_token": this.loginResponse.refresh_token };
            let body = new URLSearchParams();
            body.set('grant_type', 'refresh_token');
            body.set('refresh_token', this.loginResponse.refresh_token);
            console.log('refresh  request body sting:' + body.toString());
            request = body.toString();
            return this.makeHTTPRequest("post", refreshTokenUrl, mask, request, this.getHttpOptionsforRefereshTokens(), 'Refreshing access token...')
                .map((res) => {
                    return res;
                })
                .subscribe((response) => {
                    this.setLoginResponse(response,true);
                },
                    (error) => {
                        console.log("error while refreshing token");
                        this.addAnalyticsAPIEvent(error.displaymessage, refreshTokenUrl, error.result);
                    }
                );
        }, 500);

    }
    
    // method is not used any where
    /*
    makeGetHeaderOptions(): HttpHeaders {
        let headers = new HttpHeaders().append('Accept', 'application/json; charset=utf-8').append('Content-Type', 'application/json; charset=utf-8');
        return headers;
    }*/

    encryptPayload(request: object, isKey2Req?: boolean) {
        // For message decryption check
        console.log("message before encryption" + JSON.stringify(request));
        // Step 2 Perform Encryption
        const encryptedRequest = new EncryptedRequest();
        // Step 3,4,5
        if (this.token) {
            encryptedRequest.generateEncryptedMessage(request, this.token, isKey2Req);
            return encryptedRequest;
        } else {
            console.log('encryptedRequest :: Cannot send your request - Token not found.');
            if (this.isStateLoggedIn())
                this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
            return;
        }
    }

    decryptPayload(response) {
        const decryptedResponse = new EncryptedRequest();
        if (this.token) {
            if (response.message) {
                decryptedResponse.generateDecryptedMessage(response.message, this.token)
            } else if (response.ssomsg) {
                decryptedResponse.generateDecryptedMessage(response.ssomsg, this.token);
            } else if (response.algmsg) {
                decryptedResponse.generateDecryptedMessage(response.algmsg, this.token);
            }
            // response.message ? decryptedResponse.generateDecryptedMessage(response.message, this.token) :
            //     decryptedResponse.generateDecryptedMessage(response.ssomsg, this.token);
        } else {
            console.log('decryptPayload :: Cannot send your request - Token not found.');
            if (this.isStateLoggedIn())
                this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
            return;
        }
        // For message decryption check
        console.log("message after decryption - " + JSON.stringify(decryptedResponse.message));
        return decryptedResponse.message;
    }

    handleDecryptedResponse(response) {
        if (response.message) {
            return this.decryptPayload(response);
        } else if (response.ssomsg || response.algmsg) {
            return this.decryptPayload(response);
        } else {
            return response;
        }
    }

    showLoadingMask(loadingmsg?: any) {
        return this.loadingMask.showLoadingMask(loadingmsg);
    }

    hideLoadingMask(mask) {
        this.loadingMask.hideLoadingMask(mask);
    }

    resendLoginRequest() {
        // CAVEAT :: if relogin is attempted 45 mins after previos login, the token would have expired and re-login may fail
        let loginUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("newAuthEndPoint") + 'memberlogin';
        console.log('login request url:' + loginUrl);
        let mask = this.showLoadingMask();
        let displaymsg;
        return this.makeHTTPRequest("post", loginUrl, mask, JSON.stringify(this.encloginreq), this.getHttpOptionsWithoutBearerToken(), 'Signing In...')
            .map((res) => {
                let resobj = res;
                if (resobj.access_token) {
                    this.setLoginResponse(resobj,false);
                    return res;
                } else if (resobj.result && resobj.result != "0") {
                    console.log('resendLoginRequest :: error =' + resobj.errormessage);
                    if(resobj.displaymessage != ""){
                        displaymsg = resobj.displaymessage;
                    }else{
                        displaymsg = "Error occured during Authentication."
                    }
                    this.showAlert('', displaymsg);
                    this.addAnalyticsAPIEvent(displaymsg, this.configProvider.getProperty("newAuthEndPoint") + 'memberlogin', res.result);
                }
            });
    }

    setLoginResponse(loginResponse , isFromRefreshTokenAPI:boolean) {
        if(isFromRefreshTokenAPI){
            this.loginResponse.refresh_count=loginResponse.refresh_count;
            this.loginResponse.access_token=loginResponse.access_token;
            this.access_token = loginResponse.access_token;
            this.loginResponse.refresh_token=loginResponse.refresh_token;
            this.loginResponse.issued=loginResponse.issued;
            this.loginResponse.access_token_expires=loginResponse.access_token_expires;
            this.loginResponse.refresh_token_expires=loginResponse.refresh_token_expires;
        }else{
            this.access_token = loginResponse.access_token;
            this.currentUserScopename = loginResponse.scopename;
            this.loginResponse = loginResponse;
            this.migrationType = loginResponse.migrationtype;
            this.memFirstName = loginResponse.firstName;
            this.destinationURL = loginResponse.destinationURL;    
        }
        
        if (parseInt(loginResponse.refresh_count) < 2) {
            let issueDate = moment(loginResponse.issued, "YYYY-MMM-DDTHH:mm:ss.SSSZZ", true);
            let expiryDate = moment(loginResponse.access_token_expires, "YYYY-MMM-DDTHH:mm:ss.SSSZZ", true);
            if (issueDate.isValid() && expiryDate.isValid()) {
                let tokenLifeTime = expiryDate.diff(issueDate);
                if (tokenLifeTime > 60000) {
                    tokenLifeTime = tokenLifeTime - 60000;
                    let refreshHandler = window.setTimeout(() => {

                        this.idleTimerService.restartIdleTimer();
                        this.showConfirmRefreshToken();
                    }, tokenLifeTime);
                    this.userContext.setRefreshTimerHandle(refreshHandler);
                }
            }
        }
        this.idleTimerService.startIdleTimer();
    }

    showConfirmRefreshToken() {
        this.sessionConfirmationAlert = this.alertCtrl.create({
            title: '',
            message: 'Your session is about to expire. Do you want to continue?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
                        this.sessionConfirmationAlert = null;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.idleTimerService.clearIdleTimer();
                        this.makeRefreshTokenRequest();
                        this.sessionConfirmationAlert = null;
                    }
                }
            ]
        });

        window.setTimeout(() => {
            if (this.sessionConfirmationAlert != null) {
                this.sessionConfirmationAlert.dismiss();
                this.sessionConfirmationAlert = null;
                this.messageProvider.sendMessage(ConstantsService.LOGOUT_SUCCESS, null);
            }
        }, 60000);
        this.sessionConfirmationAlert.present();
        this.setAlert(this.sessionConfirmationAlert);
    }

    getTermsAndConditions() {
        console.log(this.configProvider.getProperty("termsAndConditions"));
        let mask = this.showLoadingMask();
        let termsAndConditionUrl = this.configProvider.getProperty("termsAndConditions");
        return this.makeHTTPRequest("get", termsAndConditionUrl, mask, null)
            .map((res) => {
                let resJson = res;
                this.userContext.setTermsAndConditions(resJson);
                return resJson;
            });
    }

    getPrivayPolicy() {
        console.log(this.configProvider.getProperty("privacyPolicy"));
        let mask = this.showLoadingMask();
        let termsAndConditionUrl = this.configProvider.getProperty("privacyPolicy");
        return this.makeHTTPRequest("get", termsAndConditionUrl, mask, null)
            .map((res) => {
                let resJson = res;
                this.userContext.setPrivacyPolicy(resJson);
                return resJson;
            });
    }

    getContactUsInfo() {
        console.log(this.configProvider.getProperty("contactUs"));
        let contactUs = this.configProvider.getProperty("contactUs");
        return this.makeHTTPRequest("get", contactUs, false, null)
            .map((res) => {
                let resJson = res;
                this.userContext.setContactUs(resJson);
                return resJson;
            });
    }
    getNewsArticle() {
        let articleUrl = this.configProvider.getProperty("news_articles");
        console.log("Making news artile request.", articleUrl);
        return this.makeHTTPRequest("get", articleUrl, null, null)
            .map((res) => {
                let resJson = res;
                this.userContext.setHealthyLivingInfo(new Array(resJson[0]));
                this.userContext.setFitnessInfo(new Array(resJson[1]));
                this.userContext.setWellnessInfo(new Array(resJson[2]));
                return resJson;
            });
    }

    getUserProfileArticle() {
        let articleUrl = this.configProvider.getProperty("userprofiledrupal");
        console.log("Making my user profile drupal request.", articleUrl);
        return this.makeHTTPRequest("get", articleUrl, null, null)
            .map((res) => {
                let resJson = res;
                this.userContext.setUserProfileDrupalData(new Array(resJson[0]));
                return resJson;
            });
    }

    loadMessageCenterMessage1() {
        let articleUrl = this.configProvider.getProperty("messageCenterMessage1");
        console.log("Making Message Center request.", articleUrl);
        let msgCenterInfo = this.userContext.getMessageCenterInfo();
        return this.makeHTTPRequest("get", articleUrl, null, null)
            .map((res) => {
                let resJson = res;
                msgCenterInfo["article1"] = new Array(resJson[0]);
                msgCenterInfo["article1"][0].Body = this.formatHyperLink(msgCenterInfo["article1"][0].Body);
                this.userContext.setMessageCenterInfo(msgCenterInfo);
                return resJson;
            });
    }
    loadMessageCenterMessage2() {
        let articleUrl = this.configProvider.getProperty("messageCenterMessage2");
        console.log("Making Message Center request.", articleUrl);
        let msgCenterInfo = this.userContext.getMessageCenterInfo();
        return this.makeHTTPRequest("get", articleUrl, null, null)
            .map((res) => {
                let resJson = res;
                msgCenterInfo["article2"] = new Array(resJson[0]);
                msgCenterInfo["article2"][0].Body = this.formatHyperLink(msgCenterInfo["article2"][0].Body);
                this.userContext.setMessageCenterInfo(msgCenterInfo);
                return resJson;
            });
    }

    loadMessageCenterMessage3() {
        let articleUrl = this.configProvider.getProperty("messageCenterMessage3");
        console.log("Making Message Center request.", articleUrl);
        let msgCenterInfo = this.userContext.getMessageCenterInfo();
        return this.makeHTTPRequest("get", articleUrl, null, null)
            .map((res) => {
                let resJson = res;
                msgCenterInfo["article3"] = new Array(resJson[0]);
                msgCenterInfo["article3"][0].Body = this.formatHyperLink(msgCenterInfo["article3"][0].Body);
                this.userContext.setMessageCenterInfo(msgCenterInfo);
                return resJson;
            });
    }

    getPlanInfo() {
        let infoUrl = this.configProvider.getProperty("myPlanInfoEndPoint");
        return this.makeHTTPRequest("get", infoUrl, null, null, 'Accessing plan info...')
            .map((res) => {
                let res1 = res;
                this.userContext.setPlanInfo(res1);
                return res1;
            });
    }
    makeGetDependentsListRequest() {
        if (this.getMemberInfo) {
            //let memObj = this.memberInfo.ROWSET.ROWS;
            if (this.memberInfo.hasDependents == false) {
                this.userContext.setDependentsList([]);
                return;
            }
        }
        setTimeout(() => {
            const request = {
                useridin: this.useridin
            };
            const isKey2req = false;
            let getDependentsUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("getDependnetsListEndPoint");
            let headers = new HttpHeaders({
                'content-type': 'application/json',
                'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token,
				'uitxnid': this.getTxnIdforApiRequest()
            });
            let options = { headers: headers };
            console.log('makeGetDependentsListRequest: ' + getDependentsUrl);
            let encmsg = JSON.stringify(this.encryptPayload(request, isKey2req));
            this.makeHTTPRequest("post", getDependentsUrl, null, encmsg, options, 'Accessing Dependent List...')
                .map(res1 => {
                    let resobj = res1;
                    if (resobj.result === "0") {
                        return this.handleDecryptedResponse(resobj);
                    } else {
                        console.log('makeGetDependentsListRequest :: error =' + resobj.errormessage);
                    }
                })
                .subscribe(response => {
                    if (response.displaymessage) {
                        this.handleAPIResponseError(response, response.displaymessage, getDependentsUrl);
                    } else {
                        let dependentsList = response.ROWSET.ROWS;
                        if (dependentsList && Array.isArray(dependentsList))
                            this.userContext.setDependentsList(dependentsList);
                        else {
                            //If subscriber has one dependent, thent server will return sngle object
                            this.userContext.setDependentsList([dependentsList]);
                        }
                    }
                },
                    err => {
                        console.log("Error while getting dependents list -" + JSON.stringify(err));
                        this.addAnalyticsAPIEvent(err.displaymessage, this.configProvider.getProperty("getDependnetsListEndPoint"), err.result);
                    }
                );
        },
            500);
    }

    getAlerts(): Observable<any> {
        if (this.isMessageAlertsAPIInvoked == true) {
            if (this.messageAlertsInMemoryVals == null) {
                this.messageAlertsInMemoryVals = new Array();
            }
            return Observable.of(this.messageAlertsInMemoryVals);
        }
        else if (this.isMessageAlertsAPIInvoked == false) {
            this.isMessageAlertsAPIInvoked = true;
            const request = {
                useridin: this.useridin
            };
            const isKey2req = false;
            let alertsEndPointURL = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("getAlertsEndPoint");
            let headers = new HttpHeaders({
                'content-type': 'application/json',
                'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token,
				'uitxnid': this.getTxnIdforApiRequest()
            });
            let options = { headers: headers };
            console.log('getAlerts: ' + alertsEndPointURL);
            let encmsg = JSON.stringify(this.encryptPayload(request, isKey2req));
            let mask = this.showLoadingMask('Accessing Alerts Information');
            mask.present();
            return this.makeHTTPRequest("post", alertsEndPointURL, mask, encmsg, options, 'Accessing Alerts Information...')
                .map(res1 => {
                    let resobj = res1;
                    if (resobj.result === "0") {
                        let decryptedRsp = this.handleDecryptedResponse(resobj);
                        let rowsFromRowset = decryptedRsp.ROWSET.ROWS;
                        if (!(Array.isArray(rowsFromRowset))) {
                            this.messageAlertsInMemoryVals = [rowsFromRowset];
                        }
                        else {
                            this.messageAlertsInMemoryVals = rowsFromRowset;
                        }
                        if (this.messageAlertsInMemoryVals != null) {
                            for (var i = 0; i < this.messageAlertsInMemoryVals.length; i++) {
                                if (this.messageAlertsInMemoryVals[i].messageRead == false)
                                    this.messageAlertsCount++;
                            }
                            this.handleBadgeCount(this.messageAlertsCount);
                        }
                        return this.messageAlertsInMemoryVals;
                    }
                    else if (resobj.result === "-2") {
                        scxmlHandler.clearBadgeCount();
                        this.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS);
                    }
                    else {
                        console.log('getAlerts :: error =' + resobj.errormessage);
                        scxmlHandler.clearBadgeCount();
                        this.addAnalyticsAPIEvent(resobj.errormessage, alertsEndPointURL, resobj.result);
                    }
                });
        }
    }

    makeFinamcialsRequest(): Observable<any> {
        let getFananceBalanceEndPoint = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("getFinanceBalance");
        const request = {
            useridin: this.useridin
        };
        const isKey2req = false;
        let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token, 'uitxnid': this.getTxnIdforApiRequest() });
        let options = { headers: headers };
        return this.makeHTTPRequest("post", getFananceBalanceEndPoint, null, JSON.stringify(this.encryptPayload(request, isKey2req)), options, 'Accessing claims information...')
            .map(res1 => {
                let resobj = res1;
                return resobj;
            });
    }

    handleInvalidAccessTokenError(response, emsg, url?, callBackHandler?, scopeParam?) {
        console.log('handleAPIResponseError ::' + emsg);
        if (response.errormessage == "Invalid Access token. Access token expired") {
            this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
        }
    }

    handleAPIResponseError(response, emsg, url?, callBackHandler?, scopeParam?) {
        console.log('handleAPIResponseError ::' + emsg);
        if (response.errormessage == "Invalid Access token. Access token expired") {
            this.messageProvider.sendMessage(ConstantsService.SESSION_EXPIRED, null);
        } else {
            this.showAlert('ERROR', emsg, callBackHandler, scopeParam);
            this.addAnalyticsAPIEvent(emsg, url, response.result);
        }
    }

    getTokenhandleError(err) {
        console.log('getTokenhandleError ::' + err);
        this.showAlert('ERROR', 'Token Service not available');
        this.addAnalyticsClientEvent('Token Service not available');
    }

    showAlert(ptitle, psubtitle, callBackHandler?, scopeParam?) {
        let alert = this.alertCtrl.create({
            title: '',
            subTitle: psubtitle,
            buttons: [{
                text: 'OK',
                handler: () => {
                    alert.dismiss().then(() => {
                        if (callBackHandler) {
                            callBackHandler.call(scopeParam);
                        }
                    });
                    return false;
                }
            }]
        });
        alert.present();
        this.setAlert(alert);
    }

    getMemberInfo() {
        return this.memberInfo;
    }

    getMemberInfoRowSet() {
        return this.memberInfoRowSet;
    }

    getMemberName() {
        let mname = "";
        if (this.memberInfo) {
            //let memObj = this.memberInfo.ROWSET.ROWS;
            mname = this.memberInfo.memFistName + " " + this.memberInfo.memLastName;
        }
        else if (this.memAuthData && this.memAuthData['ROWSET'].ROWS.lastName != 'null') {
            mname = this.memAuthData['ROWSET'].ROWS.firstName + " " + this.memAuthData['ROWSET'].ROWS.lastName;
        }
        return mname;
    }

    getMemberRelation() {
        if (this.memberInfo) {
            //let memObj = this.memberInfo.ROWSET.ROWS;
            return this.memberInfo.relationship;
        }
        else return "";
    }

    //API is deprecated. Use this.updateCommChannelStatus(param1, param2)
    updateMemberPreference(request: any, mask: any): Observable<any> {
        const isKey2req = false;
        let updateMemberPreferenceURL = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("updatemempreferenceEndPoint");
        let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token, 'uitxnid': this.getTxnIdforApiRequest()});
        let options = { headers: headers };
        console.log('updateMemberPreference : ' + updateMemberPreferenceURL);
        let encmsg = JSON.stringify(this.encryptPayload(request, isKey2req));
        return this.makeHTTPRequest("post", updateMemberPreferenceURL, mask, encmsg, options, 'Accessing Dependent List...')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.handleDecryptedResponse(resobj);
                } else {
                    console.log('updateMemberPreference :: error =' + resobj.errormessage);
                }
            });
    }

    removeLeadingJunkChar(val) {
        if (val && val.length > 0 && val.charCodeAt(0) == 127) {
            val = val.substring(1, val.length);
        }
        return val;
    }

    setAlert(alert: Alert) {
        this.alert = alert;
    }

    closeAlert() {
        if (this.alert) {
            this.alert.dismiss().then(() => {
                this.alert = null;
            });
        }
    }

    isStateLoggedIn() {
        return (this.userContext.getLoginState() == LoginState.LoggedIn);
    }

    getUserStateForAdobeAnalytics() {
        let scopeIndex = ConstantsService.USER_STATES.indexOf(this.currentUserScopename);
        if (scopeIndex == -1) {
            return "anonymous";
        }
        else {
            return ConstantsService.ADOBE_TAGS_FOR_USER_STATES[scopeIndex];
        }
    }

    addAnalyticsAPIEvent(errorMessage?, url?, errorId?) {
        let edataobj = {
            "context": "action", "data": {
                "App.errorMessage": errorMessage,
                "App.errorAPI": url, "App.errorID": errorId
            }
        };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APPERROR_API, edataobj);
    }

    addAnalyticsClientEvent(errorMessage?) {
        let edataobj = { "context": "action", "data": { "App.errorMessage": errorMessage } };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APPERROR_CLIENT, edataobj);
    }

    formatHyperLink(content) {
        let delimiters = [' .', '<', ' ', '\t'];
        let linkIdentifier = ConstantsService.DRUPAL_LINK;
        let startIdx = content.indexOf(linkIdentifier);
        if (startIdx >= 0 && content.substring(startIdx - 33).indexOf("scxmlHandler.openExternalWindow('") != 0) {
            let arr = content.split("https://");
            arr.filter(function (str, index) {
                if (index != 0) {
                    let leastIndexposition = null;
                    let delimiterToUse = null;
                    delimiters.forEach(delimiter => {
                        let indexPosition = str.indexOf(delimiter);
                        if (indexPosition != null && indexPosition >= 0) {
                            if (leastIndexposition == null || indexPosition < leastIndexposition) {
                                leastIndexposition = indexPosition;
                                delimiterToUse = delimiter;
                            }
                        }
                    });
                    var _url1 = str.substring(0, leastIndexposition);
                    var _url2 = null;
                    if (delimiterToUse == " .") {
                        _url1 = "<div onclick=\"scxmlHandler.openExternalWindow('https://" + _url1 + "')\"><a>https://" + _url1 + "</a></div>";
                        _url2 = str.substring(leastIndexposition + 2, str.length - 1);
                    }
                    else {
                        _url1 = "<div onclick=\"scxmlHandler.openExternalWindow('https://" + _url1 + "')\"><a>https://" + _url1 + "</a></div>";
                        _url2 = str.substring(leastIndexposition, str.length - 1);
                    }
                    arr[index] = _url1 + _url2;
                }
            });
            content = arr.join(" ");
        }
        return content;
    }

    setDeepLink(url) {
        this.deepLink = url.toLowerCase();
    }

    getDeepLink() {
        return this.deepLink;
    }

    updateCommChannelStatus(request: any, mask: any): Observable<any> {
        const isKey2req = false;
        let updateMandatedPreferencesURL = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("updatecommstatusEndPoint");
        let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token, 'uitxnid': this.getTxnIdforApiRequest() });
        let options = { headers: headers };
        let encmsg = JSON.stringify(this.encryptPayload(request, isKey2req));
        return this.makeHTTPRequest("post", updateMandatedPreferencesURL, mask, encmsg, options, '')
            .map(res1 => {
                let resobj = res1;
                if (resobj.result === "0") {
                    return this.handleDecryptedResponse(resobj);
                } else {
                    console.log('updateMemberPreference :: error =' + resobj.errormessage);
                }
            });
    }

    updateLNAttempt(resobj: any, questionTried?: boolean) {
        if (resobj.hasOwnProperty('authlnattemptcount')) {
            this.authlnattemptcount = resobj.authlnattemptcount;
        } else if (resobj.hasOwnProperty('authLNAttemptCnt')) {
            this.authlnattemptcount = resobj.authLNAttemptCnt;
        } else {
            this.authlnattemptcount = 0;
        }
        if (resobj.hasOwnProperty('authLNAllowed')) {
            this.authLNAllowed = resobj.authLNAllowed;
        } else if (resobj.hasOwnProperty('authlnallowed')) {
            this.authLNAllowed = resobj.authlnallowed;
        } else {
            this.authLNAllowed = true;
        }
        if (questionTried) {
            this.authLNQuestionTried = true;
        } else {
            this.authLNQuestionTried = false;
        }
    }
    sendAccessCode() {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                const request = {
                    useridin: this.useridin
                };
                this.sendAccessCodeUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("sendaccesscode");
                console.log('send access code url:' + this.sendAccessCodeUrl);
                const isKey2Req = false;
                this.makeHTTPRequest("post", this.sendAccessCodeUrl, mask, JSON.stringify(this.encryptPayload(request, isKey2Req)), this.getHttpOptions(), 'Sending access code...')
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                        console.log(err);
                        this.addAnalyticsAPIEvent(err.displaymessage, this.sendAccessCodeUrl, err.result);
                    });
            },
                100);
        });
    }

    // send access code with user id param if it is not phone or email
    sendAccessCodeForUsername(profileResponse) {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                let request = this.getRequestedDataAccordingUsername(profileResponse);
                this.sendAccessCodeUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("sendaccesscode");
                console.log('send access code url:' + this.sendAccessCodeUrl);
                const isKey2Req = false;
                this.makeHTTPRequest("post", this.sendAccessCodeUrl, mask, JSON.stringify(this.encryptPayload(request, isKey2Req)), this.getHttpOptions(), 'Sending access code...')
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                        console.log(err);
                        this.addAnalyticsAPIEvent(err.displaymessage, this.sendAccessCodeUrl, err.result);
                    });
            },
                100);
        });
    }

    getRequestedDataAccordingUsername(profileResponse) {
        if (profileResponse.phoneNumber) {
            return {
                commChannel: profileResponse.phoneNumber,
                commChannelType: 'MOBILE',
                useridin: this.useridin,
                userIDToVerify: this.useridin
            };
        } else {
            return {
                commChannel: profileResponse.emailAddress,
                commChannelType: 'EMAIL',
                useridin: this.useridin,
                userIDToVerify: this.useridin
            };
        }
    }


    reSendAccessCodeForgotUsername(requestData: any) {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                const request = {
                    useridin: requestData.useridin,
                    commType: requestData.commType,
                    commValue: requestData.commValue
                };
                this.sendAccessCodeUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("resendaccesscode");
                console.log('send access code url:' + this.sendAccessCodeUrl);
                const isKey2Req = false;
                this.makeHTTPRequest("post", this.sendAccessCodeUrl, mask, JSON.stringify(this.encryptPayload(request, isKey2Req)), this.getHttpOptions(), 'Sending access code...')
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                        console.log(err);
                        this.addAnalyticsAPIEvent(err.displaymessage, this.sendAccessCodeUrl, err.result);
                    });
            },
                100);
        });
    }

    reSendAccessCode(userID: string) {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                const request = {
                    useridin: userID
                };
                this.sendAccessCodeUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("sendaccesscode");
                console.log('send access code url:' + this.sendAccessCodeUrl);
                const isKey2Req = false;
                this.makeHTTPRequest("post", this.sendAccessCodeUrl, mask, JSON.stringify(this.encryptPayload(request, isKey2Req)), this.getHttpOptions(), 'Sending access code...')
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                        console.log(err);
                        this.addAnalyticsAPIEvent(err.displaymessage, this.sendAccessCodeUrl, err.result);
                    });
            },
                100);
        });
    }

    reSendAccessCodeUsername(userID: string, profileResponse) {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                const request = this.getRequestedDataAccordingUsername(profileResponse);

                this.sendAccessCodeUrl = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("sendaccesscode");
                console.log('send access code url:' + this.sendAccessCodeUrl);
                const isKey2Req = false;
                this.makeHTTPRequest("post", this.sendAccessCodeUrl, mask, JSON.stringify(this.encryptPayload(request, isKey2Req)), this.getHttpOptions(), 'Sending access code...')
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                        console.log(err);
                        this.addAnalyticsAPIEvent(err.displaymessage, this.sendAccessCodeUrl, err.result);
                    });
            },
                100);
        });
    }


    updateMemberProfile(value: any, fromWhere: string) {
        return new Promise((resolve, reject) => {
            let mask = this.showLoadingMask('Sending access code...');
            setTimeout(() => {
                const request = {
                    useridin: this.useridin
                };
                if (fromWhere == "updateMemberMobileNumber") {
                    request["mobile"] = value
                }
                if (fromWhere == "updateMemberEmailAddress") {
                    request["email"] = value
                }
                const isKey2req = false;
                this.updateMemberProileURL = this.configProvider.getProperty("loginUrl") + this.configProvider.getProperty("sendcommchlacccodeEndPoint");
                let headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token, 'uitxnid': this.getTxnIdforApiRequest() });
                let options = { headers: headers };
                this.makeHTTPRequest("post", this.updateMemberProileURL, mask, JSON.stringify(this.encryptPayload(request, isKey2req)), options, 'Accessing Dependent List...')
                    .subscribe(response => {
                        resolve(response);
                    },
                        err => {
                            reject(err);
                            console.log(err);
                            let errmsg = "Error while updateMemberProfile - Server encountered error processing your request"
                            if (err.displaymessage) {
                                errmsg = err.displaymessage;
                            }
                            this.addAnalyticsAPIEvent(err.displaymessage, this.updateMemberProileURL, err.result);
                        }
                    );
            }, 500);
        });
    }

    handleBadgeCount(badgeCount: number) {
        if (badgeCount > 0) {
            scxmlHandler.setBadgeCount(badgeCount);
        } else {
            scxmlHandler.clearBadgeCount();
        }
    }

    private uuid() {
        let uuid = '', i, random;
        for (i = 0; i < 32; i++) {
            // tslint:disable-next-line:no-bitwise
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            // tslint:disable-next-line:no-bitwise
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    getAuthEndPoint(param) {
        return this.configProvider.getProperty("newAuthEndPoint") + param;
    }

    getTxnIdforApiRequest(){
        return ConstantsService.TXN_ID_APP_IDENTIFIER+this.uuid();
    }

    getHttpOptionsWithoutBearerToken(): any {
        return { headers: new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json','uitxnid': this.getTxnIdforApiRequest() }) };
    }

    getHttpOptions(): any {
        return { headers: new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token, 'uitxnid': this.getTxnIdforApiRequest() }) };
    }

    getHttpOptionsforRefereshTokens(): any {
        return { headers: new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.access_token}) };
    }   
            
    get userRegType() {
        if (this.useridin && this.useridin.indexOf('@') === -1) {
            return RegType.MOBILE;
        } else {
            return RegType.EMAIL;
        }
    }

}
