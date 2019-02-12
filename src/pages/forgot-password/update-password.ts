import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginComponent } from '../login/login.component';
import { AlertModel } from '../../models/alert/alert.model';
import { ForgotPasswordService } from './forgot-password.service';

declare var scxmlHandler: any;

@Component({
  selector: 'update-forgotpassword',
  templateUrl: 'update-password.html',

})
export class UpdateForgorPasswordComponent {
  buttonCaption: string = "Show";
  type: string;
  typePlaceholder: string;
  showPasswordErrors = false;
  profilePasswordErrors = false;
  createPasswordForm: FormGroup;
  updatePasswordForm: FormGroup;
  passwordcustomMessages = {
    'required': 'Password is required'
  };
  retrievedReqObject: any; //request object rerieved from user-migration page
  selectedResponseObject: any; // selected response object retrie
  retrievedObject: any;
  alerts: Array<AlertModel> = null;

  currentPasswordType: string = 'password';
  newPasswordType: string = 'password';
  currentPasswordText: string = 'Show';
  newPasswordText: string = 'Show';

  fromPage: string;
  updatePassword: boolean;
  profileUpdatePassword: boolean;
  onExistingPasswordBlur: boolean = false;
  reenterPasswordType: string = 'password';
  reenterPasswordText:string = 'Show';
  onreenterPasswordBlur: boolean = false;


  constructor(public navCtrl: NavController,
    private validationProvider: ValidationProvider,
    public fb: FormBuilder,
    private authService: AuthenticationService,
    public userContext: UserContextProvider,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private forgotPasswordService: ForgotPasswordService ) {
    this.type = 'password';
    this.typePlaceholder = 'Show';
    this.retrievedObject = this.navParams.get('memaccountReq'); // complete object from user migration page

    //this.retrievedReqObject = this.retrievedObject.generatedRequest; //  get request object for memaccountmerge  API
    //this.selectedResponseObject = this.retrievedObject.generetedResponseSelected.selectedMemobj;  // select mem object

    console.log(this.selectedResponseObject);
    this.fromPage = navParams.get("fromPage");

    this.createPasswordForm = this.fb.group({
      passwordin: ['', [Validators.required, Validators.minLength(8), this.validationProvider.invalidPasswordValidator]],
      reenterPassword: ['',]
    });
    this.createPasswordForm.controls['reenterPassword'].setValidators([ValidationProvider.requiredPassword,this.validationProvider.samePasswordcheckValidator(this.createPasswordForm.controls['passwordin'])]);

  }

  togglePwdDisplay(input: any): any {
    scxmlHandler.playSoundWithHapticFeedback();
    input.type = input.type === 'password' ? 'text' : 'password';
    this.buttonCaption = input.type === 'password' ? 'Show' : 'Hide';
  }

showErrorOnBlur() {
  this.showPasswordErrors = true;
}
profileShowErrorOnBlur() {
  this.profilePasswordErrors = true;
}
/*errorBanner(message) {
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
}*/


prepareAlertModal(title: string, msg: string, type: string) {
  if (msg) {
    let a: AlertModel = new AlertModel();
    a.id = "1";
    a.message = msg;
    a.alertFromServer = false;
    a.showAlert = true;
    a.title = title;
    a.type = type ? type : "error";
    a.hideCloseButton = false;
    return a;
  }
  return null;
}
/*
showNewPassword() {
  this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
  this.newPasswordText = this.newPasswordText === 'Show' ? 'Hide' : 'Show';
}
showCurrentPassword() {
  this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password';
  this.currentPasswordText = this.currentPasswordText === 'Show' ? 'Hide' : 'Show';
}
updateMemberPassword(){
  if (!this.updatePasswordForm.valid) {
    Object.keys(this.updatePasswordForm.controls).forEach(field => {
      const control = this.updatePasswordForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    this.onExistingPasswordBlur = true;
    this.profilePasswordErrors = true;
    if (this.updatePasswordForm.value.userpwd == "" || this.updatePasswordForm.value.userpwd == undefined ||
      this.updatePasswordForm.value.password == "" || this.updatePasswordForm.value.password == undefined) {
      this.showAlert('ERROR', ConstantsService.EMPTY_REQUIRED_FIELD_MESSAGE);
    }
    return;
  }
  this.showAlert('Sucess', "Password Updateds");
}
showAlert(ptitle, psubtitle) {
  let alert = this.alertCtrl.create({
    title: ptitle,
    subTitle: psubtitle,
    buttons: ['OK']
  });
  alert.present();
  this.authService.setAlert(alert);
}*/
onSubmitPassword(){
  if (!this.createPasswordForm.valid) {

    Object.keys(this.createPasswordForm.controls).forEach(field => {
      const control = this.createPasswordForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    this.showPasswordErrors = true;
    return;
  }


  let pwd = this.createPasswordForm.get('passwordin').value;
  let mask = this.authService.showLoadingMask('Updating password...');

  setTimeout(() => {
    const request = {
      useridin: this.forgotPasswordService.userId,
      passwordin: pwd,
      webNonMigratedUser:this.forgotPasswordService.webNonMigratedUser 
    };
    let newPwdUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("resetpassword");
    console.log('send access code url:' + newPwdUrl);

    const isKey2Req = false;

    this.authService.makeHTTPRequest("post", newPwdUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), 'Creating new password...')

      .map(res => {
          return res;        
      })
      .subscribe(res => {
        if (res.result === "0") {
          // delete current user's touch data as user has changed
          scxmlHandler.touchId.deleteTouchBiodataKey();
          this.showLoginPage();
          //return res;
        } else {
          console.log('sendaccesscode :: error =' + res.errormessage);
          let emsg = res.displaymessage;
          this.alerts = [this.prepareAlertModal("", emsg, "info")];
          this.authService.addAnalyticsAPIEvent(emsg, newPwdUrl, res.result);

        }
      }, err => {
        console.log('Error updating new password ' + err);
        if (err.displaymessage) {
          this.alerts = [this.prepareAlertModal("", err.displaymessage, "error")];
          this.authService.addAnalyticsAPIEvent(err.displaymessage, newPwdUrl, err.result ? err.result : '');
        }
      }
      );
  }, 100);
}



showLoginPage() {
  this.navCtrl.push(LoginComponent, { "userId": this.forgotPasswordService.userId });
}
showReenterPassword(){
  this.reenterPasswordType = this.reenterPasswordType === 'password' ? 'text' : 'password';
  this.reenterPasswordText = this.reenterPasswordText === 'Show' ? 'Hide' : 'Show';
}

}
