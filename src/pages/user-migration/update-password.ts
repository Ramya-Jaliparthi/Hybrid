import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { LoginComponent } from '../login/login.component';
import { UserMigrationService } from './user-migration-service';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';


declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Component({
  selector: 'update-password',
  templateUrl: 'update-password.html',
  host: { 'class': 'update-password-page-css' }
})
export class UpdatePassword {
  buttonCaption: string = "Show";
  type: string;
  typePlaceholder: string;
  showPasswordErrors = false;
  createPasswordForm: FormGroup;
  passwordcustomMessages = {
    'required': 'Password is required'
  };
  retrievedReqObject: any; //request object rerieved from user-migration page
  selectedResponseObject: any; // selected response object retrie
  retrievedObject: any;
  alerts: Array<AlertModel> = null;
  setContinueButtonDisabled: boolean = true;
  selectedUserID:string;
  reenterPasswordType: string = 'password';
  reenterPasswordText:string = 'Show';
  onreenterPasswordBlur: boolean = false;
  constructor(public navCtrl: NavController,
    private validationProvider: ValidationProvider,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public userContext: UserContextProvider,
    private userMigrationService: UserMigrationService,
    public navParams: NavParams,
    public ngzone: NgZone,
    private alertService: AlertService) {
    this.type = 'password';
    this.typePlaceholder = 'Show';
    this.retrievedObject = this.navParams.get('memaccountReq'); // complete object from user migration page

    this.retrievedReqObject = this.retrievedObject.generatedRequest; //  get request object for memaccountmerge  API
    this.selectedResponseObject = this.retrievedObject.generetedResponseSelected.selectedMemobj;  // select mem object
    this.selectedUserID = this.retrievedReqObject.selectedUserId;
    console.log(this.selectedResponseObject);

    this.createPasswordForm = this.fb.group({
      passwordin: ['', [Validators.required, Validators.minLength(8), this.validationProvider.invalidPasswordValidator]],
      reenterPassword: ['',]
    });

    this.createPasswordForm.controls['reenterPassword'].setValidators([ValidationProvider.requiredPassword,this.validationProvider.samePasswordcheckValidator(this.createPasswordForm.controls['passwordin'])]);

  }

  // check form validation and enable disable continue button
  isformDisabled(fromOBJ) {
    if(fromOBJ.dirty && fromOBJ.valid){    

        this.ngzone.run(() => {
            this.setContinueButtonDisabled = false;
        });
    }else{

        this.ngzone.run(() => {
            this.setContinueButtonDisabled = true;
        });
    }
  }

  // Integrating memacctmerge API

  onSubmitPassword() {
    let memMigrationUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("memacctmerge");
    this.retrievedReqObject.password = this.createPasswordForm.value.passwordin;
    let selectedUserId = this.retrievedReqObject.selectedUserId;
    this.userMigrationService.makeMigrationRequest(this.retrievedReqObject).subscribe(response => {

      if (response && !(response.displaymessage))  {
        evaSecureStorage.setItem("isTouchIDEnabled", "");
        evaSecureStorage.setItem("isRememberEnabled", "");
        evaSecureStorage.setItem("userid", selectedUserId);
        scxmlHandler.touchId.deleteTouchBiodataKey();
        this.postDestinationUrl();  // calling post destination url after memaccount merge success
        this.sendAccesscodeAccordingScope(); // calling verification code page

      }else{
        // if (response.result == "-90300" || response.result == "-90310") {
        //   let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMACCTMERGE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_MEMACCTMERGE"][response.result];
        //   this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
        //   this.authService.addAnalyticsAPIEvent(errorMessage, memMigrationUrl, response.result);
        // }
        if(response.displaymessage){
          this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, response.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          this.authService.addAnalyticsAPIEvent(response.displaymessage, memMigrationUrl, response.result);
           }

      }

    },
      err => {
          if(err.displaymessage){
                    this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
                    this.authService.addAnalyticsAPIEvent(err.displaymessage, memMigrationUrl, err.result);
                     }

      });
  }
  //sending verification code based in seleted user scope and isverifiedEmail
  sendAccesscodeAccordingScope() {
    if (this.retrievedReqObject.selectedUserScope === 'AUTHENTICATED-AND-VERIFIED') {
      if (this.selectedResponseObject.isVerifiedEmail === 'true') {

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
      this.sendCommunicationChannel(this.retrievedReqObject.emailAddress,
        this.retrievedReqObject.selectedUserId);
    } else {
      this.sendAccessCode(this.retrievedReqObject.emailAddress,
        this.retrievedReqObject.selectedUserId)
    }
    //   this.sendCommunicationChannel();
  }

  // Integration the API for sendcommchlaccess code

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
          if(response && !(response.displaymessage)) {
          this.userContext.setIsVerifycodeRequested(this.authService.useridin, "true");

          let objForVerifyPasscode = {
            fromPage: "updatePassword",
            email: request.email,
            userIDToVerify: request.userIDToVerify,
            commValue: request.email
          }

          this.gotoAccessCodeVerificationPage(objForVerifyPasscode);  // landing to verification code page
        }else{
          // if (response.result == "-90300" || response.result == "-90325") {
          //   let errorMessage = ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDCOMMCHLACCCODE"] && ConstantsService.ERROR_MESSAGES["USERMIGRATION_SENDCOMMCHLACCCODE"][response.result];
          //   this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, errorMessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
          //   this.authService.addAnalyticsAPIEvent(errorMessage, this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendcommchlacccode', response.result);
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
      let sendAccessCodeUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("migrationAccessCodeEndPoint") + 'sendaccesscode';
      setTimeout(() => {
        const request = {
          useridin: this.authService.useridin,
          commChannel: emailAddress,
          commChannelType: 'EMAIL',
          userIDToVerify: selectedUserId
        };
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
        //   if (res.result == "-90300"||res.result == "-90320") {
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
          if(err.displaymessage){
            this.alerts = [this.alertService.prepareAlertModal(ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER, err.displaymessage, ConstantsService.ERROR_MESSAGES.LOGINPAGE_ERRORHEADER_SMALL)];
           this.authService.addAnalyticsAPIEvent(err.displaymessage, sendAccessCodeUrl, err.result);
         }
        });
      },
        100);
    });
  }

  //function to land on verification page

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
            this.errorBanner(errmsg);
          }
        );
      }, 500);
    });

  }

  togglePwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

  showErrorOnBlur() {
    this.showPasswordErrors = true;
  }
  errorBanner(message) {
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
  }
  showReenterPassword(){
    this.reenterPasswordType = this.reenterPasswordType === 'password' ? 'text' : 'password';
    this.reenterPasswordText = this.reenterPasswordText === 'Show' ? 'Hide' : 'Show';
  }
}
