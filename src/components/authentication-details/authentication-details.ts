import { Component } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { NavController} from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { ConstantsService } from '../../providers/constants/constants.service';
import { VerifyPasscodePage } from '../../pages/verify-passcode/verify-passcode';
//import { Headers,RequestOptions} from '@angular/http';
import { UserContextProvider } from '../../providers/user-context/user-context';

declare var scxmlHandler: any;
@Component({
  selector: 'authentication-details',
  templateUrl: 'authentication-details.html'
})
export class AuthenticationDetailsComponent {
  showCardHeader: boolean = true;
  resObj:any;
  msgObj:any;
  constructor(private messageProvider: MessageProvider, private nav: NavController, private authService: AuthenticationService, private userContext: UserContextProvider,) {

  }
  closeAuthInfoCard(){
      scxmlHandler.playSoundWithHapticFeedback();
      this.messageProvider.sendMessage("Remove_Card", "AuthenticationDetailsCard");

      if (this.authService.currentUserScopename == ConstantsService.REGISTERED_NOT_VERIFIED) {

        //if (this.userContext.getIsVerifycodeRequested(this.authService.useridin) == "false") {

            this.authService.sendAccessCode().then((result) => {
                 this.resObj=result;
              if (this.resObj.result === "0") {
                  this.userContext.setIsVerifycodeRequested( this.authService.useridin, "true");
                  this.msgObj = this.authService.handleDecryptedResponse(this.resObj); 
                  let codeTypeData;
                  if(this.msgObj.commChannelType == "EMAIL"){
                    codeTypeData = {emailAddress:this.msgObj.commChannel};
                  }else{
                    codeTypeData = {phoneNumber:this.msgObj.commChannel};
                  }
                  this.gotoAccessCodeVerificationPage(codeTypeData);
               
                 return this.resObj;
             } else  {
                 console.log('sendaccesscode :: error ='+this.resObj.displaymessage);
                let emsg = this.resObj.displaymessage;
                 this.authService.handleAPIResponseError(this.resObj, emsg, this.authService.sendAccessCodeUrl); 
                 
             }          
     
              }, (err) => {
                console.log(err);
              });
    
       /*}else{
            console.log('verify access code already requested. Going to veify code entry page');
            this.gotoAccessCodeVerificationPage();
        }*/
      } 
      
    
  }
  
    
    gotoAccessCodeVerificationPage(codeTypeData) {
      this.nav.push(VerifyPasscodePage, { fromPage: 'accountRegistrationFlow', codeType: "codeForUsername",type: null, no_email: null ,commType:this.msgObj.commChannelType, commValue:this.msgObj.commChannel,codeTypeData:codeTypeData});
    }
}
