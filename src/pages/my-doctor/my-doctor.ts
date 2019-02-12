import { Component, ViewChild, HostListener, Renderer, ElementRef } from '@angular/core';
import { NavController, NavParams, PopoverController, Platform } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController, Popover } from 'ionic-angular';
import { PopoverPage } from './dependents-popover';
import { OptionsPopoverPage } from './options-popover';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { VisitHistoryPage } from './visit-history';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
import { SortOrder } from '../../utils/sort';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';
import { AlertModel } from '../../models/alert/alert.model';
import { AlertService } from '../../providers/utils/alert-service';
import { ConstantsService } from "../../providers/constants/constants.service";
import { MyDoctorService } from './my-doctor-service';
// import { FindadoctorService } from '../find-doctor/find-doctor.services';

declare var scxmlHandler: any;
@Component({
	selector: 'page-my-doctor',
	templateUrl: 'my-doctor.html',
})
export class MyDoctorPage {

	visits: Array<any>;
	visitsRef: Array<any>;
	showSearch: boolean = false;
	showSubHeader: boolean = true;
	selectedUser: any;
	memberName: string;
	memberRelation: string;
	displayName: string;
	@ViewChild('searchInput') searchInput: any;
	showAutoComplete: boolean;
	cardData: any;
	filterCard: boolean;
	popover: Popover;
	sortDirection: number = SortOrder.DESCENDING;
	sortByOrder: any = SortOrder;
	dependentsList: any;
	visitTypes: Array<any>;
	selectedVisitType: string = "All";
	alert: AlertModel = null;
	noOfRequests: number = 0;
	mask: any = null;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private authService: AuthenticationService,
		public alertCtrl: AlertController,
		public config: ConfigProvider,
		public popoverCtrl: PopoverController,
		private messageProvider: MessageProvider,
		private userContext: UserContextProvider,
		private renderer: Renderer,
		private platform: Platform,
		private elRef: ElementRef,
		private alertService: AlertService,
		public myDoctorService: MyDoctorService,
		// private FindadoctorService: FindadoctorService
	) {

		this.cardData = navParams.get("cardData");
		this.filterCard = navParams.get("filterCard");
		this.getRecentVisits();
		this.memberName = authService.getMemberName();
		this.memberRelation = authService.getMemberRelation();
		this.displayName = this.memberName;
		this.dependentsList = this.userContext.getDependentsList();

		this.messageProvider.getMessage().subscribe(message => {
			if (message.event == "ANDROID_BACK") {
				this.onAndroidBack();
			}
		}, err => {
			this.authService.addAnalyticsClientEvent(err);
		});

	}


	@HostListener('touchmove', ['$event'])
	onScroll(event) {
		if (this.showSearch) {
			if (this.popover) {
				this.popover.dismiss();
			}
		}
	}

	onAndroidBack() {
		if (this.popover) {
			this.popover.dismiss();
		}
	}
	presentPopoverOnContainer(iconElement: any) {
		let event = new MouseEvent('click', { bubbles: false });
		this.renderer.invokeElementMethod(
			iconElement, 'dispatchEvent', [event]);
	}

	presentPopover(myEvent) {
		event.cancelBubble = true;
		scxmlHandler.playSoundWithHapticFeedback();
		this.popover = this.popoverCtrl.create(PopoverPage, { displayName: this.displayName, sortOption: this.sortDirection, visitType: this.visitTypes });
		this.popover.present({
			ev: myEvent
		}).then(() => {

			this.showSearch = false;
			this.showSubHeader = true;
		});
		this.popover.onDidDismiss((filterOption) => {
			window.setTimeout(() => {
				if (filterOption == undefined)
					return;

				if (filterOption.key == "selectMember") {
					let user = filterOption.value;
					if (user && user.depFirstName) {
						this.selectedUser = user;
						this.displayName = user.depFirstName + " " + user.depLastName;
						this.memberRelation = user.depRelationsip;
						this.cardData = null;
						this.getDependentsRecentVisits(user.depId, this.displayName);
					} else if (user == "All") {
						this.displayName = 'All';
						if (this.dependentsList == null) {
							this.selectedUser = null;
							this.memberRelation = this.authService.getMemberRelation();
							this.cardData = null;
							this.getRecentVisits();
						} else {
							this.getAllRecentVisits();
						}
					} else {
						this.selectedUser = null;
						this.displayName = this.memberName;
						this.memberRelation = this.authService.getMemberRelation();
						this.cardData = null;
						this.getRecentVisits();
					}
				}
				else if (filterOption.key == "showByDateOrder") {
					this.sortDirection = filterOption.value;
				}
				else if (filterOption.key == "resetFilters") {
					this.sortDirection = SortOrder.DESCENDING;
					this.selectedUser = null;
					this.displayName = this.memberName;
					this.memberRelation = this.authService.getMemberRelation();
					this.cardData = null;
					this.selectedVisitType = "All";
					this.getRecentVisits();

				}
				else if (filterOption.key == "visitType") {
					this.selectedVisitType = filterOption.value;
					this.reselectVisitType();
				}
			}, 10);
		})
	}

	showMoreOptions(myEvent, doctorDetail) {
		scxmlHandler.playSoundWithHapticFeedback();
		this.popover = this.popoverCtrl.create(OptionsPopoverPage);
		this.popover.present({
			ev: myEvent
		});
		this.popover.onDidDismiss((selection) => {
			let etarget = '';
			if (selection == 1) {
				if (doctorDetail.PrvPh && doctorDetail.PrvPh != "") {
					let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
					if (doctorDetail.PrvPh.match(phonenoregex)) {

						etarget = 'MyDoctors.AddtoContacts';
						scxmlHandler.addContact(doctorDetail.PrvName, doctorDetail.PrvPh);
					} else {
						this.showAlert('', ConstantsService.ERROR_MESSAGES.MYDOCTOR_INCORRECT_PHNNO);
						this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_INCORRECT_PHNNO);
					}

				} else {
					this.showAlert('', ConstantsService.ERROR_MESSAGES.MYDOCTOR_INCORRECT_PHNNO);
					this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_INCORRECT_PHNNO);
				}

			}
			else if (selection == 2) {
				let visitHistory: Array<any> = this.visitsRef.filter((visit) => {
					return doctorDetail.PrvName == visit.PrvName;
				});
				etarget = 'MyDoctors.ViewHistory';
				this.navCtrl.push(VisitHistoryPage, {
					visit: doctorDetail,
					displayName: this.displayName,
					memberRelation: this.memberRelation,
					visitHistory: visitHistory
				})
			} else if (selection == 3) {
				etarget = 'MyDoctors.ViewClaim';
				this.navCtrl.push(MyClaimsPage, {
					ProviderInfo: doctorDetail.PrvName,
					MemberName: this.displayName,
					MemberType: this.memberRelation
				});
			}
			let edataobj = { "context": "action", "data": { "App.linkSource": "My Doctors", "app.provider": doctorDetail.PrvName } };
			scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
		})
	}



	getRecentVisits() {
		this.alert = null;
		let mask = this.authService.showLoadingMask('Accessing Recent Visits...');
		setTimeout(() => {
			const request = {
				useridin: this.authService.useridin
			};


			let recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentVisit");

			this.myDoctorService.getDependentAndRecentVisitRequest(recentVistUrl, mask, request)
				.subscribe(response => {
					if (response) {
						if (response.ROWSET.ROWS instanceof Array) {
							this.visits = response.ROWSET.ROWS;
							this.visitsRef = response.ROWSET.ROWS;
						} else {
							this.visits = new Array(response.ROWSET.ROWS);
							this.visitsRef = new Array(response.ROWSET.ROWS);
						}
					}
					this.resetVisitType();
				},
					err => {
						console.log("Error while getting recent visits -" + JSON.stringify(err));
						this.visits = null;
						this.visitsRef = null;
						this.resetVisitType();

						if (err.result == -1) {

							this.alert = this.alertService.prepareAlertModal("",
								ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT, "error", true);

							this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT_WITHOUTLINK, recentVistUrl, err.result);
							let me = this;

							window.setTimeout(() => {
								let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
								me.renderer.listen(aElement[0], 'click', (event) => {
									scxmlHandler.playSoundWithHapticFeedback();
									//scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
									this.findDoctorSso();
								});
							}, 10);


						} else if (err.displaymessage) {
							let errmsg = err.displaymessage;
							this.createAlert("Error", errmsg, "error");
							this.authService.addAnalyticsAPIEvent(errmsg, recentVistUrl, err.result);
						}
					}
				);


		}, 500);

	}

	getDependentsRecentVisits(dependentId, dependentName) {
		this.alert = null;
		let mask = this.authService.showLoadingMask('Accessing Recent Visits for ' + dependentName);
		setTimeout(() => {
			const request = {
				useridin: this.authService.useridin,
				depid: dependentId
			};

			let recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentRecentVisit");
			this.visits = null;
			this.visitsRef = null;
			this.myDoctorService.getDependentAndRecentVisitRequest(recentVistUrl, mask, request)
				.subscribe(response => {
					if (response.result && !(response.result === "0")) {
						if (response.displaymessage) {
							let emsg = response.displaymessage;
							this.visits = null;
							this.visitsRef = null;
							this.createAlert("Error", emsg, "error");
							this.authService.addAnalyticsAPIEvent(emsg, recentVistUrl, response.result);
						}
					} else {
						if (response) {
							if (response.ROWSET.ROWS instanceof Array) {
								this.visits = response.ROWSET.ROWS;
								this.visitsRef = response.ROWSET.ROWS;
							} else {
								this.visits = new Array(response.ROWSET.ROWS);
								this.visitsRef = new Array(response.ROWSET.ROWS);
							}
							this.resetVisitType();
						}
					}
				},
					err => {
						console.log("Error while getting recent visits -" + JSON.stringify(err));
						this.visits = null;
						this.visitsRef = null;
						this.authService.addAnalyticsAPIEvent(err.displaymessage, recentVistUrl, err.result);
					}
				);


		}, 500);

	}

	getAllRecentVisits() {
		this.mask = this.authService.showLoadingMask('Accessing Recent Visits Data...');
		this.mask.present();
		this.alert = null;
		let request = {
			useridin: this.authService.useridin
		};

		this.visits = [];
		this.visitsRef = [];

		let recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentVisit");

		this.noOfRequests++;

		this.myDoctorService.getDependentAndRecentVisitRequest(recentVistUrl, this.mask, request)
			.subscribe(response => {
				if (response && response.ROWSET) {
					if (response.ROWSET.ROWS instanceof Array) {
						this.visits = this.visits.concat(response.ROWSET.ROWS);
						this.visitsRef = this.visitsRef.concat(response.ROWSET.ROWS);
					} else {
						this.visits.push(response.ROWSET.ROWS);
						this.visitsRef.push(response.ROWSET.ROWS);
					}
					this.resetVisitType();
				}
			},
				err => {
					this.hideMask();
					console.log("Error while getting recent visits -" + JSON.stringify(err));
					if (err.result == -1) {

						this.alert = this.alertService.prepareAlertModal("",
							ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT, "error", true);

						this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT_WITHOUTLINK, recentVistUrl, err.result);

						let me = this;

						window.setTimeout(() => {
							let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
							me.renderer.listen(aElement[0], 'click', (event) => {
								scxmlHandler.playSoundWithHapticFeedback();
								//scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
								this.findDoctorSso();
							});
						}, 10);


					} else if (err.displaymessage && (this.visits && this.visits.length == 0)) {
						this.createAlert("Error", err.displaymessage, "error");
						this.authService.addAnalyticsAPIEvent(err.displaymessage, recentVistUrl, err.result);
					}
				}
			);


		if (this.dependentsList != null && this.dependentsList.length) {

			recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentRecentVisit");

			for (let i = 0; i < this.dependentsList.length; i++) {

				request['depid'] = this.dependentsList[i].depId;
				console.log('getRecentVisit Url: ' + recentVistUrl);
				this.noOfRequests++;

				this.myDoctorService.getDependentAndRecentVisitRequest(recentVistUrl, this.mask, request)
					.subscribe(response => {
						this.hideMask();
						if (response && response.ROWSET) {
							if (response.ROWSET.ROWS instanceof Array) {
								this.visits = this.visits.concat(response.ROWSET.ROWS);
								this.visitsRef = this.visitsRef.concat(response.ROWSET.ROWS);
							} else {
								this.visits.push(response.ROWSET.ROWS);
								this.visitsRef.push(response.ROWSET.ROWS);
							}

							if (this.visits && this.visits.length > 0) {
								this.alert = null;
							}
							this.resetVisitType();
						}
					},
						err => {
							this.hideMask();
							console.log("Error while getting recent visits -" + JSON.stringify(err));
							if (err.result == -1) {

								this.alert = this.alertService.prepareAlertModal("",
									ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT, "error", true);

								this.authService.addAnalyticsAPIEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_DONOTHAVE_DOCTORVISIT_WITHOUTLINK, recentVistUrl, err.result)

								let me = this;

								window.setTimeout(() => {
									let aElement = me.elRef.nativeElement.getElementsByClassName('alertSpanLinkCls');
									me.renderer.listen(aElement[0], 'click', (event) => {
										scxmlHandler.playSoundWithHapticFeedback();
										//scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
										this.findDoctorSso();
									});
								}, 10);


							} else if (err.displaymessage) {
								if (!this.visits || (this.visits && this.visits.length == 0)) {
									this.createAlert("Error", err.displaymessage, "error");
									this.authService.addAnalyticsAPIEvent(err.displaymessage, recentVistUrl, err.result);
								}
							}

							if (this.visits && this.visits.length > 0) {
								this.alert = null;
							}
						}
					);
			}
		}
	}

	hideMask() {
		this.noOfRequests--;
		if (this.noOfRequests == 0) {
			this.authService.hideLoadingMask(this.mask);
		}
	}

	handleError(rspmsg) {
		//handle error
		console.log('handleError::' + rspmsg);
		var errmsg = ConstantsService.ERROR_MESSAGES.MYDOCTOR_SERVER_ERROR;
		if (rspmsg)
			errmsg = rspmsg;
		this.showAlert('ERROR', errmsg);

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

	ionViewDidEnter() {
		let etarget = 'MyDoctors';
		let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
	}

	showMap(location, prescriberName) {
		scxmlHandler.playSoundWithHapticFeedback();
		let etarget = 'MyDoctors.Map';
		let edataobj = { "context": "action", "data": { "App.linkSource": "My Doctors", "app.provider": prescriberName } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);


		if (this.platform.is("ios")) {
			let murl = "http://maps.apple.com/?q=" + encodeURI(location);
			scxmlHandler.openExternalWindow(murl);
		} else {
			let murl = "geo:0,0?q=" + encodeURI(location);
			scxmlHandler.openExternalWindow(murl);
		}
	}

	validatePhoneNum(phNumber) {
		let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (phNumber != null && phNumber.match(phonenoregex)) {
			return true;
		}
		else {
			return false;
		}
	}

	makeCall(phNumber, prescriberName) {
		scxmlHandler.playSoundWithHapticFeedback();

		let etarget = 'MyDoctors.Call';
		let edataobj = { "context": "action", "data": { "App.linkSource": "My Doctors", "app.provider": prescriberName } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

		let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (phNumber != null && phNumber.match(phonenoregex)) {
			if (this.platform.is("ios") && this.platform.is("ipad")) {
				this.showAlert('', ConstantsService.ERROR_MESSAGES.MYDOCTOR_FEATURE_NOTAVAIL);
				this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_FEATURE_NOTAVAIL);
				return;
			}
			let turl = "tel:" + phNumber;
			scxmlHandler.openExternalWindow(turl);
		}
		else {
			this.showAlert('', ConstantsService.ERROR_MESSAGES.MYDOCTOR_CANNOTCALL_INCRCT_PHNNO);
			this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYDOCTOR_CANNOTCALL_INCRCT_PHNNO);
		}
	}

	onSearchCancel(event) {
		this.showSearch = false;
		this.showSubHeader = true;
		this.showAutoComplete = false;
		this.visits = this.visitsRef;
	}

	onSearchInput(event) {
		let etarget = 'MyDoctors.Search';
		let edataobj = { "context": "action", "data": { "App.searchType": "My Doctors", "App.searchCriteria": this.searchInput.value } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
		this.cardData = null;
		if (this.searchInput.value && this.searchInput.value.length > 1) {
			this.showAutoComplete = true;
		} else {
			this.showAutoComplete = false;
		}
		this.applySearchCriteria();
	}

	selectItem(visit) {
		this.searchInput.value = visit.PrvName;
		this.showAutoComplete = false;
		this.applySearchCriteria();
	}

	applySearchCriteria() {
		if (this.visitsRef && this.visitsRef.length > 0) {
			this.visits = this.visitsRef.filter((visit) => {
				let userInput: string = this.searchInput.value
				return (visit.PrvName.toLowerCase().indexOf(userInput.toLowerCase()) != -1)
			});
		}
	}

	getUniqueDoctorVisits() {
		let visits: Array<any> = [];
		let prvNames: Array<any> = [];
		if (this.visits && this.visits.length > 0) {
			this.visits.forEach(v => {
				if (!prvNames[v.provName]) {
					prvNames[v.provName] = v;
					visits.push(v);
				}
			});
		}
		return visits;
	}

	showSearchBox() {
		scxmlHandler.playSoundWithHapticFeedback();
		this.showSearch = true;
		this.showSubHeader = false;
	}
	reselectVisitType() {
		if (this.visits != undefined && this.visits.length > 0) {
			for (let i = 0; i < this.visitTypes.length; i++) {
				this.visitTypes[i].selected = false;
				if (this.visitTypes[i].type == this.selectedVisitType) {
					this.visitTypes[i].selected = true;
				}
			}
		} else {
			this.visitTypes = new Array();
		}

	}

	resetVisitTypeBySpec() {
		let foundSelected: boolean = false;
		let vTypeList = new Array();
		this.visitTypes = new Array();
		if (this.visits != undefined) {
			for (let i = 0; i < this.visits.length; i++) {

				if (vTypeList.indexOf(this.visits[i].PrvType) == -1) {
					vTypeList.push(this.visits[i].PrvType);
				}
			}

		}
		for (let j = 0; j < vTypeList.length; j++) {
			let vType = { type: vTypeList[j] };
			if (vTypeList[j] == this.selectedVisitType) {
				vType['selected'] = true;
				foundSelected = true;
			}
			this.visitTypes.push(vType);
		}
		let vType = { type: 'All' };
		if (!foundSelected) {
			vType['selected'] = true;
		}
		this.visitTypes.splice(0, 0, vType);
	}

	resetVisitType() {
		let foundSelected: boolean = false;
		let vTypeList = new Array();
		this.visitTypes = new Array();
		if (this.visits != undefined) {
			for (let i = 0; i < this.visits.length; i++) {

				if (vTypeList.indexOf(this.visits[i].PrvType) == -1) {
					vTypeList.push(this.visits[i].PrvType);
				}
			}
			for (let j = 0; j < vTypeList.length; j++) {
				let vType = { type: vTypeList[j] };
				if (vTypeList[j] == this.selectedVisitType) {
					vType['selected'] = true;
					foundSelected = true;
				}
				this.visitTypes.push(vType);
			}
			let vType = { type: 'All' };
			if (!foundSelected) {
				vType['selected'] = true;
			}
			this.visitTypes.splice(0, 0, vType);

		} else {
			console.log('No visit types for this member');
		}
	}

	createAlert(title: string, msg: string, type: string) {
		let a: AlertModel = new AlertModel();
		a.id = "1";
		a.message = msg;
		a.alertFromServer = false;
		a.showAlert = true;
		a.type = type ? type : "error";
		a.hideCloseButton = true;
		this.alert = a;
	}

	removeLeadingJunkChar(val) {
		return this.authService.removeLeadingJunkChar(val);
	}

	findDoctorSso() {
		// setTimeout(() => {
		// let findadoctorUrl: string = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("vitalsSso");
		//   this.FindadoctorService.demoLoginReqest(findadoctorUrl).
		// 	subscribe(response => {
		// 	  if (response.result && !(response.result === 0)) {
		// 	  let data = this.authService.handleDecryptedResponse(response);
		// 	  let url= data.samlUrl;
		// 	  let samlKey = data.samlKey;
		// 	  let req = {NameValue : data.samlValue};
		// 	  scxmlHandler.postNewindow(url, "Find a Doctor", req);             
		// 	  } else {
		// 	  scxmlHandler.openNewindow('http://myblue.bluecrossma.com/app-fad', "Find a Doctor");
		// 	  }
		// 	}, error => {
		// 	  this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
		// 	});
		//   }, 500);
	}

}
