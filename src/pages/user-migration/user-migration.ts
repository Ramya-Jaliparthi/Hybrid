import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, PopoverController, Popover } from 'ionic-angular';
import { FormBuilder ,Validators, FormControl} from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { HintQuestionsPopoverPage } from '../../components/hint-questions-popover/hint-questions-popover';
import { UpdatePassword } from '../../pages/user-migration/update-password';
import { UserMigrationService } from './user-migration-service';
import { LoginComponent } from '../login/login.component';
import { MemberLookupResponse } from './user-migration.model';
import { VerifyPasscodePage } from '../verify-passcode/verify-passcode';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';

@Component({
    selector: 'page-user-migration ',
    templateUrl: 'user-migration.html',
    host: { 'class': 'user-migration-page-css' }

})
export class UserMigrationComponent {

    securityQuestions: any = ConstantsService.SECURITY_QUESTIONS_OPTIONS;
    selectedHint: any;
    alerts: Array<AlertModel> = null;
    selectedQues: any;
    displayName: any;
    hintQuestionForSubmit: string = "";
    buttonCaption: string = "Show";
    popover: Popover;
    userAccounts: any;
    NavParams: any;
    migrationtype: string;
    memFirstName: string;
    userIdLoggedIn: string;
    userIdLoggedInold: string;
    userIdLoggedInNew: string;
    webAccount: any;
    selectedUserId: any;
    generatedRequestWithResponse: any;
    multipleApp: string = "MULTIPLE-APP";
    singleApp: string = "SINGLE-APP";
    singleWeb: string = "SINGLE-WEB";
    singleAppWeb: string = "SINGLE-WEB-SINGLE-APP";
    multiAppSingleWeb: string = "SINGLE-WEB-MULTIPLE-APP";
    hintQuestionSelected: string = "";
    hintQuestionsSelectOptions = {
        title: 'Hint Question',
        subTitle: ''
    };
    setFormDisabled: boolean=false;
    onEmailBlur: boolean = false;
    onHintBlur: boolean  = false;
    setContinueButtonDisabled:boolean = true;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private formObjUserMig: FormBuilder,
        public alertCtrl: AlertController,
        public ngzone: NgZone,
        private authService: AuthenticationService,
        public popoverCtrl: PopoverController,
        public userContext: UserContextProvider,
        public userMigrationService: UserMigrationService,
        private alertService: AlertService) {
        this.displayName = "Select a question";

    }

    public userMigrationForm = this.formObjUserMig.group({
        hintAnswer: ["", Validators.compose([ValidationProvider.hintAnswerValidatorUserMigration])],
        emailAddress: ["",Validators.compose([ValidationProvider.emailRequiredValidatorForUserMigration])],
        hintQuestionSelected: ['']
    });

    enableEmailValdation() {
        this.userMigrationForm.addControl("emailAddress", new FormControl('', [ValidationProvider.emailRequiredValidator]));
       // this.resetForm();
      }

      disableEmailValdation() {
        this.userMigrationForm.removeControl("emailAddress");
      //   this.resetForm();
      }

    isformDisabled(fromOBJ) {
        if(fromOBJ.dirty && fromOBJ.valid && (fromOBJ.value.hintAnswer != '') && (this.hintQuestionForSubmit != '')){
                    
            this.ngzone.run(() => {
                this.setContinueButtonDisabled = false;
            });
        }else{

            this.ngzone.run(() => {
                this.setContinueButtonDisabled = true;
            });
           
        }
       
    }



    ionViewWillEnter() {
    
      }


    ngOnInit() {
        this.migrationtype = this.authService.migrationType;
        //this.memFirstName = this.authService.memFirstName;
        if(this.authService.memFirstName){
            this.memFirstName = this.authService.memFirstName.toLowerCase();
        } 
        //this.migrationtype =  "SINGLE-APP"; // HARDCODED NEED TO REMOVE
        // this.userIdLoggedIn = this.authService.useridin;

        if (this.migrationtype == this.singleWeb) {
            this.enableEmailValdation();
        }else{
            this.disableEmailValdation();
        }

        this.getUserAccounts();
    }

    // Integrate the memLookup

    getUserAccounts() {
                setTimeout(() => {
            let memberLookup = new MemberLookupResponse();
            let memLookupUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memLookup");
            this.userMigrationService.getUserAccountsRequest(memLookupUrl)
                .subscribe(response => {
               
                    if (response && !(response.displaymessage)) {
                        memberLookup = response;
                        this.userAccounts = response.appAccounts;
                        this.webAccount = response.webAccount;
                        console.log(this.userAccounts);
                        console.log(this.webAccount);
                        if (this.migrationtype == this.singleWeb) {
                            this.userMigrationForm.patchValue({
                                emailAddress: this.webAccount.email
                            });
                        } else if (this.migrationtype == this.singleApp) {
                            this.userIdLoggedIn = String(this.userAccounts[0].email);
                        } else if (this.migrationtype == this.singleAppWeb) {
                            this.userIdLoggedInold = this.webAccount.userID;
                            this.userIdLoggedInNew = this.userAccounts[0].userID;
                        } else if (this.migrationtype == this.multiAppSingleWeb) {
                            this.userIdLoggedInold = this.webAccount.userID;
                            // this.userIdLoggedInNew =  this.userAccounts[0].userID;
                        }

                        // to selection of by default user account
                        if(this.userAccounts && this.userAccounts.length > 0){
                            this.selectedUserId = this.userAccounts[0]; 
                        }
                
                      //  this.setFormDisabled = this.isformDisabled(this.userMigrationForm);
                    }else{

                        // if (response.result == "-90300") {
                        //     let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMLOOKUP"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMLOOKUP"][response.result];
                        //     this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                        //     this.authService.addAnalyticsAPIEvent(errorMessage, memLookupUrl, response.result);
                        // }
                        if(response.displaymessage){
                            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                            this.authService.addAnalyticsAPIEvent(response.displaymessage, memLookupUrl, response.result);
                          }
                         
                    }
                },
                    err => {
                     
                    if(err.displaymessage){
                       this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                       this.authService.addAnalyticsAPIEvent(err.displaymessage, memLookupUrl, err.result);
                     }
                    });
        }, 100);
    }

    // drop down for slection hint question
    presentPopover(myEvent) {
        this.popover = this.popoverCtrl.create(HintQuestionsPopoverPage);
        this.popover.present({
            ev: myEvent
        });

        this.popover.onDidDismiss((filterOption) => {

            window.setTimeout(() => {
                if (filterOption) {
                    this.selectedQues = filterOption;
                    this.displayName = filterOption.value.label;
                    this.hintQuestionForSubmit = filterOption.value.label;
                }
            }, 10)

        })
    }
    // hint answer show/hide button
    togglePwdDisplay(input: any): any {
        input.type = input.type === 'password' ? 'text' : 'password';
        this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
        //input.setFocus();
    }

    submitMigrationInfo() {

        let remainingAppUserIds = [];
        let webUserIdRetrieved = "";
        let selectedUserObjectRetrieved;
        let emailRetrieved = "";
        let selecteduserIDType = "";

        if (this.migrationtype == this.multiAppSingleWeb) {
            remainingAppUserIds = this.getRemainingUserIds();
            webUserIdRetrieved = this.webAccount.userID;
            selectedUserObjectRetrieved = this.selectedUserId;
            emailRetrieved = this.selectedUserId.email;
            selecteduserIDType = "APP";
        } else if (this.migrationtype == this.singleWeb) {
            webUserIdRetrieved = this.webAccount.userID; // verify whether we have to pass emaild id of web acoount if it got updated
            selectedUserObjectRetrieved = this.webAccount; // if the select user for single web account should i use login userid (memlook up api webaacount userid)
            emailRetrieved = this.userMigrationForm.value.emailAddress;
            selecteduserIDType = "WEB";
        } else if (this.migrationtype == this.singleApp) {
            webUserIdRetrieved = "";
            selectedUserObjectRetrieved = this.userAccounts[0];
            emailRetrieved = this.userAccounts[0].email;
            selecteduserIDType = "APP";
        } else if (this.migrationtype == this.multipleApp) {
            webUserIdRetrieved = "";
            remainingAppUserIds = this.getRemainingUserIds();
            selectedUserObjectRetrieved = this.selectedUserId;
            emailRetrieved = this.selectedUserId.email;
            selecteduserIDType = "APP";
        } else if (this.migrationtype == this.singleAppWeb) {
            webUserIdRetrieved = this.webAccount.userID;
            selectedUserObjectRetrieved = this.userAccounts[0];
            emailRetrieved = this.userAccounts[0].email;
            selecteduserIDType = "APP";
        }

        setTimeout(() => {
            // below object is contains request object we need to pass and contain generated response
            this.generatedRequestWithResponse = {
                generatedRequest: {      // migration will happen user migration screen
                    useridin: this.authService.useridin,
                    selectedUserId: selectedUserObjectRetrieved.userID,
                    selectedUserIdType: selecteduserIDType,
                    selectedUserScope: selectedUserObjectRetrieved.scope,
                    webUserID: webUserIdRetrieved,
                    appUserIDs: remainingAppUserIds,
                    emailAddress: emailRetrieved,
                    hintQuestion: this.hintQuestionForSubmit,
                    hintAnswer: this.userMigrationForm.value.hintAnswer
                },
                generetedResponseSelected: {
                    selectedMemobj: selectedUserObjectRetrieved // update screen(migration will happen during password)
                }
            };
            this.userMigrationService.selectedMigratedUser = selectedUserObjectRetrieved.userID;
            console.log(this.generatedRequestWithResponse);
            // alert(JSON.stringify(generatedRequest));
            if (this.migrationtype == this.singleApp) {

                this.singleMigrationSubmit(this.generatedRequestWithResponse.generatedRequest);
            } else {
                this.gotoUpdatePassword(this.generatedRequestWithResponse);
            }

        }, 100);

    }
    // After selected user id remaining user id'd are store in a array
    getRemainingUserIds() {
        let remainingAppUserIds = [];
        for (let i = 0; i < this.userAccounts.length; i++) {
            if (!(this.selectedUserId.userID == this.userAccounts[i].userID)) {
                remainingAppUserIds.push(this.userAccounts[i].userID);
            }
        }
        return remainingAppUserIds;
    }

    setEmailBlur() {
        
        setTimeout(() => { this.onEmailBlur = true }, 500);
      }

    setHintBlur(){
        setTimeout(() => { this.onHintBlur = true }, 500);
    }  

    //navigating to password screen
    gotoUpdatePassword(memaccountReq) {
        this.navCtrl.push(UpdatePassword, { "memaccountReq": memaccountReq });
    }

    // single APP user memacctmerge API integratiion

    singleMigrationSubmit(responseObj) {
        let memMigrationUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memacctmerge");
        this.userMigrationService.makeMigrationRequest(responseObj).subscribe(response => {
            if (response && !(response.displaymessage)) {
                //this.navCtrl.push(LoginComponent);
                this.postDestinationUrl();
                this.sendAccesscodeAccordingScope();
            }else{
                // if (response.result == "-90300" || response.result == "-90310") {
                //     let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMACCTMERGE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMACCTMERGE"][response.result];
                //     this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                //     this.authService.addAnalyticsAPIEvent(errorMessage, memMigrationUrl, response.result);
                // }
                if(response.displaymessage){
                    this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                    this.authService.addAnalyticsAPIEvent(response.displaymessage, memMigrationUrl, response.result);
                     }
            }
        },
            err => {
                 console.log("memacctmerge :" + err);
                 if(err.displaymessage){
                    this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                    this.authService.addAnalyticsAPIEvent(err.displaymessage, memMigrationUrl, err.result);
                     }
            });
    }

    //sending verification code based in seleted user scope and isverifiedEmail
    sendAccesscodeAccordingScope() {
        if (this.generatedRequestWithResponse.generatedRequest.selectedUserScope === 'AUTHENTICATED-AND-VERIFIED') {
            if (this.generatedRequestWithResponse.generetedResponseSelected.selectedMemobj.isVerifiedEmail === 'true') {

                this.navCtrl.push(LoginComponent);
                //this.sendAccessCodeOnScope();  // need to remove

            } else {
                this.sendAccessCodeOnScope();
            }
        } else {
            this.sendAccessCodeOnScope();
        }
    }

    // sending the verification after checking sendAccesscodeAccordingScope condition based on current scope of login user
    sendAccessCodeOnScope() {

        if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
            this.sendCommunicationChannel(this.generatedRequestWithResponse.generatedRequest.emailAddress,
                this.generatedRequestWithResponse.generatedRequest.selectedUserId);
        } else {
            this.sendAccessCode(this.generatedRequestWithResponse.generatedRequest.emailAddress,
                this.generatedRequestWithResponse.generatedRequest.selectedUserId)
        }
        //   this.sendCommunicationChannel();
    }

    sendCommunicationChannel(emailAddress, selectedUserId) {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const request = {
                    useridin: this.authService.useridin,
                    email: emailAddress,
                    mobile: '',
                    userIDToVerify: selectedUserId
                };

                this.userMigrationService.makeCommChannelSendCodeReq(request).subscribe(response => {
                    //if(response && !(response.displaymessage)) {
                if(response && response.result === "0") {    
                    this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");

                    let objForVerifyPasscode = {
                        fromPage: "updatePassword",
                        email: request.email,
                        userIDToVerify: request.userIDToVerify
                    }

                    this.gotoAccessCodeVerificationPage(objForVerifyPasscode);  // landing to verification code page
                }else{
                    // if (response.result == "-90300" || response.result == "-90325") {
                    //     let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDCOMMCHLACCCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDCOMMCHLACCCODE"][response.result];
                    //     this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                    //     this.authService.addAnalyticsAPIEvent(errorMessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', response.result);
                    // }
                    if(response.displaymessage){
                        this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                        this.authService.addAnalyticsAPIEvent(response.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', response.result);
                         }
                }
                },
                    err => {
                    reject(err);
                    console.log(err);
                    if(err.displaymessage){
                    this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                    this.authService.addAnalyticsAPIEvent(err.displaymessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', err.result);
                     }
                    }
                );
            }, 500);
        });

    }

    // Integrating the send access code API

    sendAccessCode(emailAddress, selectedUserId) {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const request = {
                    useridin: this.authService.useridin,
                    commChannel: emailAddress,
                    commChannelType: 'EMAIL',
                    userIDToVerify: selectedUserId
                };
                let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendaccesscode';
                this.userMigrationService.makeAccessCodeReq(request).subscribe(res => {

                    if(res && !(res.displaymessage)) {
                        this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");
                        let msgObj = this.authService.handleDecryptedResponse(res);
                        let objForVerifyPasscode = {
                            fromPage: "updatePassword",
                            email: request.commChannel,
                            userIDToVerify: request.userIDToVerify,
                            commValue:msgObj.commChannel
                        }
                        
                        this.gotoAccessCodeVerificationPage(objForVerifyPasscode);  // landing the user to verification code page
                    }else{
                       
                        // if (res.result == "-90300"||res.result == "-90320") {
                        //     let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDACCESSCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDACCESSCODE"][res.result];
                        //     this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                        //     this.authService.addAnalyticsAPIEvent(errorMessage, sendAccessCodeUrl, res.result);
                        // }
                        if(res.displaymessage){
                            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, res.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                           this.authService.addAnalyticsAPIEvent(res.displaymessage, sendAccessCodeUrl, res.result);
                         }
                    }
                  
                }, (err) => {
                    reject(err);
                    console.log(err);
                    // this.errorBanner(err.displaymessage);
                     if(err.displaymessage){
                        this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                       this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result);
                     }
                });
            },
                100);
        });
    }

    gotoAccessCodeVerificationPage(objForVerifyPasscode) {
        //this.navCtrl.push(VerifyPasscodePage, { "updatePasswordVerifyReq": objForVerifyPasscode });
        this.navCtrl.setRoot(VerifyPasscodePage, { "updatePasswordVerifyReq": objForVerifyPasscode });
    }

    // post destination Integration
    postDestinationUrl() {
        return new Promise((resolve, reject) => {

            setTimeout(() => {

                this.userMigrationService.postDestinationUrl().subscribe(response => {
                    console.log(response);
                },
                    err => {
                        reject(err);
                        console.log(err);
                        let errmsg = ConstantsService.ERROR_MESSAGES.USER_MIGRATION_DESTINATION_URL;
                        if (err.displaymessage) {
                            errmsg = err.displaymessage;
                        }
                        //  this.errorBanner(errmsg);
                    }
                );
            }, 500);
        })
    }

    prepareAlertModal(title: string, msg: string, type: string, shouldHideCloseButton?: boolean) {
        if (msg) {
            let a: AlertModel = new AlertModel();
            a.id = "1";
            a.message = msg;
            a.alertFromServer = false;
            a.showAlert = true;
            a.title = title;
            a.type = type ? type : "error";
            a.hideCloseButton = shouldHideCloseButton != undefined ? shouldHideCloseButton : false;
            return a;
        }
        return null;
    }
    /* errorBanner(message) {
        let alertObj = {
            messageID: "",
            AlertLongTxt: message,
            AlertShortTxt: "",
            RowNum: ""
        }
        let a: AlertModel = this.prepareAlertModal(alertObj);
        if (a != null) {
            this.userContext.setAlerts([a]);
        }
        this.alerts = this.userContext.getAlerts();
    }

    prepareAlertModal(alert: any) {
        if (alert) {
            let a: AlertModel = new AlertModel();
            a.id = alert.messageID;
            a.message = alert.AlertLongTxt;
            a.alertFromServer = true;
            a.showAlert = true;
            a.title = alert.AlertShortTxt;
            a.type = "error";
            a.RowNum = alert.RowNum;
            a.hideCloseButton = true;
            return a;
        }
        return null;
    }*/
}