import { FindadoctorService } from './find-doctor.services';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { FadSearchListPage } from '../fad/fad-search-list/fad-search-list';
declare var scxmlHandler: any;
@Component({
  selector: 'find-doctor',
  templateUrl: 'find-doctor.html'
})
export class FindDoctorPage {

  showForgotform: boolean = true;
  showresentMsg: boolean = false;
  constructor(public navCtrl: NavController, private userContext: UserContextProvider,
    private authService: AuthenticationService,
    private FindadoctorService: FindadoctorService
  ) {
   
  }
  openfirstPage() {

 this.navCtrl.push(FadSearchListPage);
  }
  ionViewDidLoad() {
  
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.userContext.getLoginState() == LoginState.Registered) {
      let etarget = 'HomeRegistered.FindaDoctor';
      let edataobj = { "context": "action", "data": { "App.linkSource": "Menu" } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      this.navCtrl.popToRoot();
    }
    else if (this.userContext.getLoginState() == LoginState.LoggedIn) {
      let etarget = 'HomeAuthenticated.FindaDoctor';
      let edataobj = { "context": "action", "data": { "App.linkSource": "Menu" } };
      if (this.authService.currentUserScopename == ConstantsService.ACTIVE_AUTHENTICATED_USER) {
        this.findaDoctorSSO();
      } else {
        scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      }
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    } else if (this.userContext.getLoginState() == LoginState.Anonymous) {
      let etarget = 'HomeAnonymous.FindaDoctor';
      let edataobj = { "context": "action", "data": { "App.linkSource": "HomeAnonymous" } };
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
      this.navCtrl.popToRoot();
    }
    // scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
    // this.navCtrl.popToRoot();
  };
  callUrl(resp) {
    console.log(resp);
    const myElement: HTMLElement = document.getElementById('sso');
    myElement.innerHTML = "<FORM METHOD='POST' ACTION='" + resp.samlUrl + "'><INPUT TYPE='HIDDEN' NAME='NameValue' VALUE='" + resp.samlValue + "'></FORM>";
    const currForm: HTMLFormElement = <HTMLFormElement>myElement.children[0];
    currForm.submit();
  }

  // findaDoctorSSO() {
  //   setTimeout(() => {
  //     let findadoctorUrl: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("vitalsSso");
  //     this.FindadoctorService.demoLoginReqest(findadoctorUrl).
  //       subscribe(response => {

  //       }, error => {          
  //         if (error.status === 301) {
  //           let data = this.authService.handleDecryptedResponse(error);
  //           this.callUrl(data);
  //         } else {
  //           scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
  //         }
  //       });
  //         // if (error.status === 301) {
  //         //   let data = this.authService.handleDecryptedResponse(error);
  //         //   let url = data.samlUrl;
  //         //   console.log(url);
  //         //   scxmlHandler.openNewindow(data, "Find a Doctor");
  //         // } else {
  //         //   scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
  //         // }
  //       // });
  //   }, 500);
  // }
  findaDoctorSSO() {
    setTimeout(() => {
      let findadoctorUrl: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("vitalsSso");
      this.FindadoctorService.demoLoginReqest(findadoctorUrl).
        subscribe(response => {
            if (response.result && !(response.result === 0)) {
              let data = this.authService.handleDecryptedResponse(response);
            let url = data.samlUrl;
            let req = { NameValue: data.samlValue };
            scxmlHandler.postNewindow(url, "Find a Doctor", req);
          } else {
            scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
          }
          }, error => {
            this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
        });
    }, 500);
  }
}
