import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { ContactUsPage } from '../../pages/contact-us/contact-us';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from '../../providers/constants/constants.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { LoginState } from '../../providers/user-context/user-context';

declare var scxmlHandler: any;
@Component({
  selector: 'contact-us-card',
  templateUrl: 'contact-us-card.html',
  //host: {'class': 'card-content-cls'}
})
export class ContactUsCardComponent {

  text: string;

  constructor(public navCtrl: NavController, 
      public config: ConfigProvider,
              public navParams: NavParams,private userContext: UserContextProvider) {
    this.text = 'ContactUsCardComponent component';
  }
  goToContactUs(){
    scxmlHandler.playSoundWithHapticFeedback();

    // added for swrve tags
    let etarget ='';
    let linkSourceValue='';
	if(this.userContext.getLoginState() == LoginState.Anonymous){
	   etarget ='HomeAnonymous.ContactUs'
	   linkSourceValue='Home Anonymous';
	}
	else if(this.userContext.getLoginState() == LoginState.Registered){   
	   etarget ='HomeRegistered.ContactUs'
	   linkSourceValue='Home Registered';
	}
	else if(this.userContext.getLoginState() == LoginState.LoggedIn){
		etarget ='HomeAuthenticated.ContactUs'
		linkSourceValue='Home Authenticated';
	 }
  	let edataobj = {"context":"action","data":{"App.linkSource":linkSourceValue}};
  	scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK+ etarget, edataobj);
    this.navCtrl.push(ContactUsPage);
  }
}
