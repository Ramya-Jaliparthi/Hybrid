import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConstantsService } from '../../providers/constants/constants.service';
import { AlertModel } from '../../models/alert/alert.model';
import { ChangePasswordService } from './change-password-service';
import { MySettingsPage } from './my-settings';

declare var scxmlHandler: any;

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html',

})
export class ChangePassword {
  buttonCaption: string = "Show";
  type: string;
  typePlaceholder: string;
  showPasswordErrors = false;
  profilePasswordErrors = false;
  updatePasswordForm: FormGroup;
  passwordcustomMessages = {
    'required': 'Password is required'
  };
  retrievedReqObject: any; 
  selectedResponseObject: any;
  retrievedObject: any;
  alerts: Array<AlertModel> = null;

  currentPasswordType: string = 'password';
  newPasswordType: string = 'password';
  reenterPasswordType: string = 'password';
  //renterPasswordText: string = 'Show';
  currentPasswordText: string = 'Show';
  reenterPasswordText:string = 'Show';
  newPasswordText: string = 'Show';

  fromPage: string;
  profileUpdatePassword: boolean;
  onExistingPasswordBlur: boolean = false;
  onreenterPasswordBlur: boolean = false;

  constructor(public navCtrl: NavController,
    private validationProvider: ValidationProvider,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public userContext: UserContextProvider,
    private changePasswordService: ChangePasswordService,
    public navParams: NavParams,
    public alertCtrl: AlertController, ) {
    this.type = 'password';
    this.typePlaceholder = 'Show';

    console.log(this.selectedResponseObject);
    this.fromPage = navParams.get("fromPage");

    this.updatePasswordForm = this.fb.group({
      currentPassword: ["", Validators.compose([ValidationProvider.requiredPassword])],
      newPassword: ["", ],
      //reenterPassword:["", Validators.compose([ValidationProvider.requiredPassword])]
      reenterPassword: ["",]
    });

    this.updatePasswordForm.controls['newPassword'].setValidators([ValidationProvider.requiredPassword, Validators.minLength(8),
    this.validationProvider.invalidPasswordValidatorWrapper(),
    this.validationProvider.samePasswordValidator(this.updatePasswordForm.controls['currentPassword'])]);
   this.updatePasswordForm.controls['reenterPassword'].setValidators([ValidationProvider.requiredPassword,this.validationProvider.samePasswordcheckValidator(this.updatePasswordForm.controls['newPassword'])]);

    if (this.fromPage === "profileSettings") {
      this.profileUpdatePassword = true;
    } 

  }

  showErrorOnBlur() {
    this.showPasswordErrors = true;
  }
  profileShowErrorOnBlur() {
    this.profilePasswordErrors = true;
  }
  showBanner(message,type) {
    let alertObj = {
      messageID: "",
      AlertLongTxt: message,
      AlertShortTxt: "",
      RowNum: ""
    }
    let a: AlertModel = this.prepareAlertModal(alertObj,type);
    if (a != null) {
      this.userContext.setAlerts([a]);
    }
    this.alerts = this.userContext.getAlerts();
  }

  prepareAlertModal(alert: any, messageType: any) {
    if (alert) {
      let a: AlertModel = new AlertModel();
      a.id = alert.messageID;
      a.message = alert.AlertLongTxt;
      a.alertFromServer = true;
      a.showAlert = true;
      a.title = alert.AlertShortTxt;
      a.type = messageType;
      a.RowNum = alert.RowNum;
      a.hideCloseButton = true;
      return a;
    }
    return null;
  }
  showNewPassword() {
    this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
    this.newPasswordText = this.newPasswordText === 'Show' ? 'Hide' : 'Show';
  }
  showCurrentPassword() {
    this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password';
    this.currentPasswordText = this.currentPasswordText === 'Show' ? 'Hide' : 'Show';
  }
  showReenterPassword(){
    this.reenterPasswordType = this.reenterPasswordType === 'password' ? 'text' : 'password';
    this.reenterPasswordText = this.reenterPasswordText === 'Show' ? 'Hide' : 'Show';
  }
  togglePwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }
  updateMemberPassword() {
    if (!this.updatePasswordForm.valid) {
      Object.keys(this.updatePasswordForm.controls).forEach(field => {
        const control = this.updatePasswordForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.onExistingPasswordBlur = true;
      this.profilePasswordErrors = true;
      if (this.updatePasswordForm.value.currentPassword == "" || this.updatePasswordForm.value.currentPassword == undefined ||
        this.updatePasswordForm.value.newPassword == "" || this.updatePasswordForm.value.newPassword == undefined) {
        this.showBanner( ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE,"error");
      }
      return;
    }
    this.updatePassword(this.updatePasswordForm.value.currentPassword, this.updatePasswordForm.value.newPassword ,"","" );
  }

  updatePassword(currentPassword: string, newPassword: string,  fromWhere: string, value: any) {

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin,
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      let changePasswordURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("changePasswordEndPoint");

      this.changePasswordService.updatePasswordRequest(changePasswordURL, request)
        .subscribe(response => {
          if (response.result == "0") {
            this.showPasswordErrors = false;
            this.updatePasswordForm.reset();
            this.onExistingPasswordBlur = false;
            this.profilePasswordErrors = false;
            scxmlHandler.touchId.deleteTouchBiodataKey();
            this.authService.addAnalyticsClientEvent("Password updated.");
            this.navCtrl.push(MySettingsPage,{'bannerMessages':'Password updated successfully.','bannerType':'info'});
          } else {
            this.updatePasswordForm.reset();
            if(response.displaymessage){
              this.showBanner(response.displaymessage,"error");
            }
            else{
              this.showBanner("Default Password update failed message","error");
            }
            this.onExistingPasswordBlur = false;
            this.profilePasswordErrors = false;
          }
        },
          err => {
            console.log("Error while updatePassword Info -" + JSON.stringify(err));
            this.updatePasswordForm.reset();
            let errmsg = ConstantsService.ERROR_MESSAGES.MYSETTINGS_MEMBERPREFERENCE_SERVER_ERROR;
            if (err.displaymessage) {
              errmsg = err.displaymessage;
            }
            this.onExistingPasswordBlur = false;
            this.profilePasswordErrors = false;
            this.showBanner(errmsg,"error");
            this.authService.addAnalyticsAPIEvent(err.displaymessage, changePasswordURL, err.result);
          }
        );
    }, 500);
  }

}
