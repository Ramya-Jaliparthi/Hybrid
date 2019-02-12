
// import { Injector } from '@angular/core';
// import { ConstantsService } from '../../providers/constants/constants.service';
// import { AuthenticationService } from '../../providers/login/authentication.service';

// export class LoginAuthUtil {

//     useridin :string = null;
//     access_token:string =null;
//     authService: any;
//     LoginAuthUtil(private injector:Injector){

//         let resolvedProviders = ReflectiveInjector.resolve([AuthenticationService]);
//         let childInjector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);

//         authService = childInjector.get(AuthenticationService);
//     }

//     handleResponse(message: any){
//         console.log("received message from authenticationStateProvider" );
//         console.log(message);
//         //console.log(ConstantsService.REGISTERED_NOT_VERIFIED);
//         if(message.event.trim() === ConstantsService.REGISTER_SUCCESS){  //This will be called on success of register member api. Data will be RegisterRequestMode.
            
//             this.performLogin(message.data.useridin, message.data.passwordin);
//         }
//         if(message.event.trim() === ConstantsService.ACTIVE_AUTHENTICATED_USER){  //Show logged in dashboard
//             this.gotoLoggedInDashboard();
//         }
//         if(message.event.trim() === ConstantsService.REGISTERED_NOT_VERIFIED || message.event.trim() === ConstantsService.REGISTERED_AND_VERIFIED ){     //Show anonymous dashboard
            
//             this.access_token = message.data.access_token;
//             if (this.access_token ) {
//                 console.log('Access token from the Login API '+ this.access_token);
//                 this.authService.memAuth({useridin:this.useridin}, this.access_token).subscribe(memAuthResponse => {
//                     //console.log('Response for Member Authentication '+memAuthResponse.json());
//                     if(memAuthResponse.errormessage) {                    //No member data found. Goto anonymous dashboard
//                         this.gotoRegistredDashboard();
//                         return;
//                     }

//                     if(memAuthResponse['ROWSET'].ROWS.memNum === null && memAuthResponse['ROWSET'].ROWS.lastName === 'null') {

//                     this.gotoRegistredDashboard();

//                     } else if(memAuthResponse['ROWSET'].ROWS.memNum === null && memAuthResponse['ROWSET'].ROWS.lastName !== 'null') {

//                     this.gotoMemberInfoPage();

//                     } else if((memAuthResponse['ROWSET'].ROWS.memNum !== 'null' && memAuthResponse['ROWSET'].ROWS.lastName !== 'null')) {
                    
//                     this.gotoUpdateSSNPage();

//                     } else {
//                     //This should never happen
                    
//                     }
    
//                 },  err => {
//                 // console.log(err);
//                 // console.log('Error response from Mem authentication api '+err);
//                 });
//             }

//         }
//         if(message.event.trim() === ConstantsService.AUTHENTICATED_NOT_VERIFIED){  //Show logged in dashboard
//             this.authService.sendaccesscode().subscribe(res => {
//                 this.gotoAccessCodeVerificationPage()
//             });  
//         }
            
        
//     }

//     performLogin(userId: string, password:string){
    
//         let loginrequest : LoginRequest = new LoginRequest();
//         this.useridin = userId;
//         loginrequest.useridin = userId; 
//         loginrequest.passwordin = password;

//         this.authService.makeLoginRequest(loginrequest)
//         .subscribe(response => {
//             console.log('Response for Login', response);
//             this.authenticationStateProvider.sendMessage(response.scopename, response);
//             },err=> {
//                     console.log(err);
//                     console.log('Error response from memmber login api '+err);
//                 }
//         );
//     }

//     gotoRegistrationPage(){
//         this.appCtrl.getRootNav().push(RegistrationComponent);
//     }

//     gotoRegistredDashboard(){
//         // this.userContext.setLoginState(LoginState.Registered);
//         // this.navCtrl.popToRoot({animate: false, direction: "forward"});
//         console.log("go to registerd dashboard")
//         this.messageProvider.sendMessage(ConstantsService.REGISTER_SUCCESS, null);
//     }
//     gotoLoggedInDashboard(){
//         //  this.userContext.setLoginState(LoginState.LoggedIn);
//         //  this.navCtrl.popToRoot({animate: false, direction: "forward"});
//         this.messageProvider.sendMessage(ConstantsService.LOGIN_SUCCESS, null);
//     }
//     gotoMemberInfoPage(){
//         this.navCtrl.push(MemberInformationPage);
//     }

//     gotoUpdateSSNPage(){
//         this.navCtrl.push(SsnAuthPage);
//     }

//     gotoAccessCodeVerificationPage(){
//         //Show screen to collect access code and call VerifyAccessCode() method
//         //If result is 0, show logged in dashboard. Else show error message.
//     }
// }