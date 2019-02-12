import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConstantsService } from '../../providers/constants/constants.service';
import { UserContextProvider, LoginState } from '../../providers/user-context/user-context';
import { FadPage } from '../../pages/fad/fad-landing/fad';

declare var scxmlHandler: any;
@Component({
	selector: 'find-a-doctor-card',
	templateUrl: 'find-a-doctor-card.html'
})

export class FindADoctorCardComponent {

	text: string;

	constructor(private userContext: UserContextProvider, private navCtrl: NavController) {
		this.text = 'FindADoctorCardComponent component';
	}
	openfindDoctor() {
		let etarget = '';
		let linkSourceValue = '';
		if (this.userContext.getLoginState() == LoginState.Registered) {
			etarget = 'HomeRegistered.FindaDoctor';
			linkSourceValue = 'Home Registered';
		}
		else if (this.userContext.getLoginState() == LoginState.LoggedIn) {
			etarget = 'HomeAuthenticated.FindaDoctor';
			linkSourceValue = 'Home Authenticated';
		} else if (this.userContext.getLoginState() == LoginState.Anonymous) {
			etarget = 'HomeAnonymous.FindaDoctor';
			linkSourceValue = 'Home Anonymous';
		}
		let edataobj = { "context": "action", "data": { "App.linkSource": linkSourceValue } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

		scxmlHandler.playSoundWithHapticFeedback();
		this.navCtrl.push(FadPage);
		// scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");

	}
}
