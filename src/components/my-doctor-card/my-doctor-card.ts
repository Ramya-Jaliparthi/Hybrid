import { Component } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { NavController, Platform } from 'ionic-angular';
import { VisitHistoryPage } from '../../pages/my-doctor/visit-history';
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
declare var scxmlHandler;
@Component({
	selector: 'my-doctor-card',
	templateUrl: 'my-doctor-card.html'
})
export class MyDoctorCardComponent {
	memberInfo: any;
	address: any = '';
	cardData: any;
	visits: Array<any>;
	visitsRef: Array<any>;

	constructor(private authService: AuthenticationService, public config: ConfigProvider, private nav: NavController, public alertCtrl: AlertController, private platform: Platform) {

		let memberInfoResponse = authService.getMemberInfoRowSet();
		if (!memberInfoResponse['errormessage']) {

			this.memberInfo = authService.getMemberInfo();// memberInfoResponse['ROWSET'].ROWS;
			if (this.memberInfo)
				this.address = this.memberInfo.visitStreet ? this.memberInfo.visitStreet : '' + " " + this.memberInfo.visitCity ? this.memberInfo.visitCity : '' + " " + this.memberInfo.visitState ? this.memberInfo.visitState : '' + " " + this.memberInfo.visitZip ? this.memberInfo.visitZip : '';
		}

	}

	showMap(location) {
		scxmlHandler.playSoundWithHapticFeedback();
		console.log("map location : " + location);
		let etarget = 'MyDoctors.Map';
		let edataobj = { "context": "action", "data": { "App.linkSource": "My Doctors" } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
		if (this.platform.is("ios")) {
			let murl = "http://maps.apple.com/?q=" + encodeURI(location);
			scxmlHandler.openExternalWindow(murl);
		} else {
			let murl = "geo:0,0?q=" + encodeURI(location);
			scxmlHandler.openExternalWindow(murl);
		}
	}

	makeCall(phNumber) {
		scxmlHandler.playSoundWithHapticFeedback();
		console.log("phone number : " + phNumber);
		let etarget = 'MyDoctors.Call';
		let edataobj = { "context": "action", "data": { "App.linkSource": "My Doctors" } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

		let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (phNumber.match(phonenoregex)) {
			if (this.platform.is("ios") && this.platform.is("ipad")) {
				this.showAlert('', "This feature is not available on your device.");
				return;
			}
			let turl = "tel:" + phNumber;
			scxmlHandler.openExternalWindow(turl);
		}
		else {
			this.showAlert('', "Cannot call incorrect phone number");

		}
	}

	openPage() {
		scxmlHandler.playSoundWithHapticFeedback();
		let mask = this.authService.showLoadingMask('Accessing Recent Visits...');
		setTimeout(() => {
			const request = {
				useridin: this.authService.useridin
			};

			const isKey2req = false;
			let recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentVisit");

			console.log('getRecentVisit Url: ' + recentVistUrl);

			this.authService.makeHTTPRequest("post", recentVistUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Recent Visits Data...')
				.map(res1 => {
					let resobj = res1;
					console.log('getRecentVisit :: response =', resobj);
					if (resobj.result === "0") {
						return this.authService.handleDecryptedResponse(resobj);
					} else {
						console.log('getRecentVisit :: error =' + resobj.errormessage);
						let emsg = resobj.displaymessage;
						this.visits = null;
						this.visitsRef = null;
						this.authService.handleAPIResponseError(resobj, emsg, recentVistUrl);
					}

				})
				.subscribe(response => {
					console.log('Response getRecentVisit:', response);
					if (response) {
						if (response.ROWSET.ROWS instanceof Array) {
							this.visits = response.ROWSET.ROWS;
							this.visitsRef = response.ROWSET.ROWS;
						} else {
							this.visits = new Array(response.ROWSET.ROWS);
							this.visitsRef = new Array(response.ROWSET.ROWS);
						}

						let visitHistory: Array<any> = this.visitsRef.filter((visit) => {
							return this.memberInfo.visitPrvName == visit.PrvName;
						});
						if (visitHistory.length > 0) {
							this.nav.push(VisitHistoryPage, {
								visit: visitHistory[0],
								displayName: this.authService.getMemberName(),
								memberRelation: "Subscriber",
								visitHistory: visitHistory
							})
						} else {
							console.log('No matching Visit records to show visit history');
						}
					}
				},
					err => {
						console.log("Error while getting recent visits -" + JSON.stringify(err));
						this.visits = null;
						this.visitsRef = null;
					}
				);
		}, 500);

	}


	showAlert(ptitle, psubtitle) {
		let alert = this.alertCtrl.create({
			title: ptitle,
			subTitle: psubtitle,
			buttons: ['OK']
		});
		alert.present();
		this.authService.setAlert(alert);
	}
}
