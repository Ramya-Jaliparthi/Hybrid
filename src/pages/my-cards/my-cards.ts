import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Slides, PopoverController, Popover } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { MyCardsDetailPage } from '../../pages/my-cards/my-cards-detail';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { CardsPopoverPage } from './dependents-popover';
import { CardsOptionsPopoverPage } from './options-popover';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';
import { ConstantsService } from "../../providers/constants/constants.service";
import { ContactUsPage } from "../contact-us/contact-us";
import { MyCardsService } from './my-cards.service';
import { AlertModel } from '../../models/alert/alert.model';

declare var scxmlHandler;
@Component({
	selector: 'page-my-cards',
	templateUrl: 'my-cards.html',
})
export class MyCardsPage implements OnInit{

	@ViewChild(Slides) slides: Slides;
	@ViewChild('canvas1') canvasEl: ElementRef;

	activeIndex = 0;
	showCardDetail: boolean = false;
	showCards: boolean = true;
	detail: string = "";
	subscriberName = "";
	memberType = "";
	errorLoadingData: boolean = false;
	popover: Popover;
	HasActivePlan: string;
	alerts: Array<any>;
	isDentalUser: string;
	cardFrontDummyResponse = {
		"ROWSET":
			{
				"ROWS":
					{
						"PCPPh": null,
						"nurseLine": "1-888-247-2583",
						"RowNum": 1,
						"CopayInfo": "Refer to your explanation of benefits or go to bluecrossma.com and select Review My Benefits for service level copayment information.",
						"isDependent": false,
						"hasHEQ": false,
						"hasALG": true,
						"BHCopay": 20,

						"PCPState": null,
						"rxBin": "RxBin: 003858 PCN: A4",
						"PCPZip": null,
						"MemName": "KRYSTAL J MICK1",
						"ERCopay": 150,
						"MemServPh": "1-800-358-2227",
						"PCPSpecified": false,
						"PCPStreet": null,
						"cardMemID": "XXP916019686",
						"ProdDesc": "PREFERRED BLUE PPO SAVER",
						"OvCopay": 20,
						"hasFAD": true,
						"PCPName": null,

						"rxSpecified": true,
						"dispSuitcase": false,

						"addressStr": ",",
						"PCPCity": "nul",
						"FADNetID": 311005024,
						"rxGRP": "RxGRP: MASA",
						"AlertCnt": 0,
						"PrevCopay": 0,
						"hasDependents": true,
						"MemSuff": "00"
					}
			}
	}

	cardBackDummyResponse =
		{
			"ROWSET": {
				"ROWS": [{
					"RowNum": 1,
					"CopyLoc": "Top",
					"Copy": "www.bluecrossma.com"
				},
				{
					"RowNum": 2,
					"CopyLoc": "Para1",
					"Copy": "Routine or Urgent Care: Contact your PCP. Emergencies: seek emergency care or call 911 or call the local emergency telephone number. Call your PCP within 48 hours."
				},
				{
					"RowNum": 3,
					"CopyLoc": "Para2",
					"Copy": "This card is for identification only. It is not proof of membership, nor does it guarantee coverage."
				},
				{
					"RowNum": 4,
					"CopyLoc": "Para3",
					"Copy": "To the Provider: submit claims to the Blue Cross and/or Blue Shield Plan servicing your area. Be sure to include the three-letter prefix followed by the nine-digit number."
				},
				{
					"RowNum": 5,
					"CopyLoc": "Para4",
					"Copy": "Member Service:1-800-238-6616|Provider Service:1-800-443-6657|Blue Care Line:1-888-247-2583|Behavioral Health & Substance Use Disorders:1-800-444-2426"
				},
				{
					"RowNum": 6,
					"CopyLoc": "Para5",
					"Copy": "Blue Cross and Blue Shield of Massachusetts, Inc., an Independent Licensee of the Blue Cross and Blue Shield Association. administers claims payment only and does not assume financial risk for claims."
				},
				{
					"RowNum": 7,
					"CopyLoc": "Bottom",
					"Copy": "Express Scripts, Inc. Pharmacy benefits administrator"
				}
				],
				"totRows": 7
			}
		};

	cardFrontData: any = [];
	cardBackData: any = [];

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public myElement: ElementRef,
		private authService: AuthenticationService,
		private config: ConfigProvider,
		public alertCtrl: AlertController,
		public userContext: UserContextProvider,
		private messageProvider: MessageProvider,
		public popoverCtrl: PopoverController,
		private myCardsService: MyCardsService) {
		this.messageProvider.getMessage().subscribe(message => {
			if (message.event == "ANDROID_BACK") {
				this.onAndroidBack();
			}
		}, err => {
			this.authService.addAnalyticsClientEvent(err);
		});

	}
	ngOnInit(): void {
		this.HasActivePlan = this.authService.loginResponse.HasActivePlan;
		console.log(this.authService.loginResponse);
		this.isDentalUser = this.authService.loginResponse.planTypes.medical;
        if(this.HasActivePlan == 'false' || this.isDentalUser == 'false'){ 
			this.errorBanner(ConstantsService.ERROR_MESSAGES.MYCARDS_FEATURE_INACTIVE);
		}
	  }

	ionViewDidEnter() {
		this.makeDataRequest();
		let etarget = 'MyCards';
		let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
		scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
	}

	onAndroidBack() {
		if (this.popover) {
			this.popover.dismiss();
		}
	}

	makeDataRequest() {

		let mask = this.authService.showLoadingMask('Accessing cards information...');
		mask.present();

		if (this.userContext.getCardsFrontData() && (this.userContext.getCardsBackData()) && this.errorLoadingData == false) {

			this.cardFrontData = this.userContext.getCardsFrontData();
			this.cardBackData = this.userContext.getCardsBackData();
			let dependentsInfo = this.userContext.getDependentsList();
			if (dependentsInfo && dependentsInfo.length > 0) {
				this.cardFrontData = this.cardFrontData.concat(dependentsInfo);
			}
			setTimeout(() => { this.drawAllCards(); this.authService.hideLoadingMask(mask); }, 500);

		}
		else {
			setTimeout(() => {
				const request = {
					useridin: this.authService.useridin
				};

				let getCardFrontUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getCardFrontEndPoint");

				let getCardBackUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("getCardBackEndPoint");

				console.log('makeGetCardFrontRequest: ' + getCardFrontUrl);
				let subscriberCardRequestArray: Array<any> = [
					this.myCardsService.myCardsRequest(getCardFrontUrl, request),
					this.myCardsService.myCardsRequest(getCardBackUrl, request)
				];

				Observable.forkJoin(
					subscriberCardRequestArray
				)
					.subscribe(response => {

						let errmsg = ConstantsService.ERROR_MESSAGES.MYCARDS_FEATURE_NOTAVAIL;

						let cardFrontDataRes: any = response[0];
						let cardBackDataRes: any = response[1];

						if (!cardFrontDataRes || !cardBackDataRes) {

							this.authService.hideLoadingMask(mask);
							this.handleError(errmsg);
							this.errorLoadingData = true;
							return;
						}

						if (cardFrontDataRes.displaymessage) {
							this.authService.hideLoadingMask(mask);
							this.handleError(cardFrontDataRes.displaymessage);
							this.errorLoadingData = true;
							return;
						} else {

							if(cardFrontDataRes.ROWSET.ROWS.length > 1){ 
                                for(let item of cardFrontDataRes.ROWSET.ROWS){
                                    this.cardFrontData.push(item);
                                }
                            }else{
                                this.cardFrontData.push(cardFrontDataRes["ROWSET"].ROWS);
                            }

						}

						if (cardBackDataRes.displaymessage) {
							this.authService.hideLoadingMask(mask);
							this.handleError(cardBackDataRes.displaymessage);
							this.errorLoadingData = true;
							return;
						} else {

							this.cardBackData.push(cardBackDataRes);
						}
						this.userContext.setCardsFrontData(this.cardFrontData);
						this.userContext.setCardsBackData(this.cardBackData);

						let dependentsInfo = this.userContext.getDependentsList();
						if (dependentsInfo && dependentsInfo.length > 0) {
							this.cardFrontData = this.cardFrontData.concat(dependentsInfo);
						}

						setTimeout(() => { this.drawAllCards(); this.authService.hideLoadingMask(mask); }, 500);
					},
					err => {
						this.authService.hideLoadingMask(mask);
						this.authService.addAnalyticsAPIEvent(err.displaymessage, getCardFrontUrl, err.result);
					}
					);

			}, 500);

		}

	}

	ionViewDidLoad1() {

		if (this.userContext.getCardsFrontData() && (this.userContext.getCardsBackData())) {
			this.cardFrontData = this.userContext.getCardsFrontData();
			this.cardBackData = this.userContext.getCardsBackData();
			let dependentsInfo = this.userContext.getDependentsList();
			if (dependentsInfo && dependentsInfo.length > 0) {
				this.cardFrontData = this.cardFrontData.concat(dependentsInfo);
			}

			setTimeout(() => { this.drawAllCards() }, 500);
		}
		else {
			let cardFrontDataRes: any = this.cardFrontDummyResponse;
			let cardBackDataRes: any = this.cardBackDummyResponse;

			if (cardFrontDataRes.displaymessage) {
				this.handleError(cardFrontDataRes.displaymessage);
			} else {

				console.log('cad front data', cardFrontDataRes);
				this.cardFrontData.push(cardFrontDataRes["ROWSET"].ROWS);
			}

			if (cardBackDataRes.displaymessage) {
				this.handleError(cardBackDataRes.displaymessage);
			} else {

				console.log('cad back data', cardBackDataRes);
				this.cardBackData.push(cardBackDataRes);
			}

			let dependentsInfo = this.userContext.getDependentsList();

			if (dependentsInfo && dependentsInfo.length > 0) {

				this.cardFrontData = this.cardFrontData.concat(dependentsInfo);

			}

			this.userContext.setCardsFrontData(this.cardFrontData);
			this.userContext.setCardsBackData(this.cardBackData);
			setTimeout(() => { this.drawAllCards(); }, 100);
		}
	}

	goToSlide(user: any,fromPage:string) {

		if (user && user.depFirstName) {
			let index = 0;
			let foundDepedentCardData = -1;
			this.cardFrontData.forEach(element => {
				/* Removing the special charaters */
				var pattern = /[^\x20-\x7E]+/g;
				let eleMemSuff: string = element['MemSuff'].replace(pattern, '');
				let usrMemSuff: string = user['MemSuff'].replace(pattern, '');

				if(fromPage =="fromMyplan"){
					if (usrMemSuff == eleMemSuff && 
					element['ProdDesc'].toUpperCase() == user['ProdDesc'].toUpperCase() &&
					element['MemName'].toUpperCase() == user['depFirstName'].toUpperCase()) {
						foundDepedentCardData = index;
					}
				}

				if(fromPage =="frompopover"){
					if (usrMemSuff == eleMemSuff) {
						foundDepedentCardData = index;
					}
				}			
				
				index++;
			});

			if (foundDepedentCardData != -1) {
				this.slides.slideTo(foundDepedentCardData);
			}
			else {
				let errmsg = ConstantsService.ERROR_MESSAGES.MYCARDS_FEATURE_NOTAVAIL;
				this.showAlert("ERROR", errmsg);
				this.authService.addAnalyticsClientEvent(errmsg);
			}
		} else if (user) {
			this.slides.slideTo(0);
		}
	}

	drawAllCards() {

		let canvasElemesnts = this.myElement.nativeElement.getElementsByClassName('cardCanvasCls');
		for (let index = 0; index < canvasElemesnts.length; index++) {
			let canvas = canvasElemesnts[index];
			let memberCardFrontData: any = this.cardFrontData[index];
			let memberCardBackData: any = this.cardBackData[0];

			this.drawCard(canvas, memberCardFrontData, memberCardBackData);
		}

		//ionViewDidLoad is commeted - added by Naresh for access from My Plan
		let memSuff: string = this.navParams.get('MemSuff');
		let depFirstName: string = this.navParams.get('depFirstName');
		let ProdDesc: string = this.navParams.get('ProdDesc');

		if (memSuff && depFirstName) {
			let user: any = { "MemSuff": memSuff, "depFirstName": depFirstName, 'ProdDesc' : ProdDesc };
			this.goToSlide(user,"fromMyplan");
		}
	}

	drawCard(canvas, memberCardFrontData, memberCardBackData) {

		var index = 0;
		let context: any;

		var me = this;
		var entries = [];
		if (memberCardBackData && memberCardBackData.ROWSET)
			entries = memberCardBackData.ROWSET['ROWS']
		let para4 = '';

		if (entries && entries.length > 0) {
			for (var k = 0; k < entries.length; k++) {
				var entry = entries[k];
				if (entry['CopyLoc'] == 'Top') {
				}

				else if (entry['CopyLoc'] == 'Para4')
					para4 = entry['Copy'];
			}

		}

		if (canvas.getContext) {

			if (index == 0) {
				this.subscriberName = this.authService.getMemberName();
				this.memberType = this.authService.getMemberRelation();
			}
			context = canvas.getContext('2d');

			let dpr = window.devicePixelRatio || 1;
			let bsr = context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

			let ratio = dpr / bsr;

			canvas.width = 400 * ratio;
			canvas.height = 440 * ratio;
			canvas.style.width = 400 + "px";
			canvas.style.height = 440 + "px";
			canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
			context = canvas.getContext('2d');
			let imageFrontObj = new Image();
			imageFrontObj.onload = function () {

				context.drawImage(imageFrontObj, 20, 0, 360, 440);
				context.font = '9px arial';
				context.fillStyle = '#000';

				me.wrapText(context, memberCardFrontData.ProdDesc, 185, 40, 150, 10);

				context.font = 'bold 11px arial';
				context.fillStyle = '#FFF';

				context.fillText(memberCardFrontData.MemName, 46, 80);
				context.fillText(memberCardFrontData.cardMemID, 46, 92);
				context.fillText(me.removeLeadingJunkChar(memberCardFrontData.MemSuff), 145, 117);

				context.font = '11px arial';
				context.font = '9px arial';

				//RxBin: 003858 PCN: A4
				//RxGRP: MASA
				let rxBin = memberCardFrontData.rxBin;
				if (rxBin != null && rxBin != "")
					rxBin = rxBin.substring(rxBin.indexOf('RxBin:') + 7, rxBin.indexOf('PCN:'));
				else
					rxBin = '';

				let pcn = memberCardFrontData.rxBin;
				if (pcn != null && pcn != "")
					pcn = pcn.substring(pcn.indexOf('PCN:') + 5, pcn.length);
				else
					pcn = '';

				let rxGRP = memberCardFrontData.rxGRP;
				if (rxGRP != null && rxGRP != "")
					rxGRP = rxGRP.substring(rxGRP.indexOf('RxGRP:') + 7, rxGRP.length);
				else
					rxGRP = '';

				context.fillText(rxBin, 293, 106);
				context.fillText(pcn, 352, 105);

				context.fillText(rxGRP, 300, 116);

				context.font = '11px arial';

				//"Member Service:1-800-238-6616|Provider Service:1-800-443-6657|Blue Care Line:1-888-247-2583|Behavioral Health & Substance Use Disorders:1-800-444-2426"
				context.font = 'bold 11px arial';
				context.fillStyle = '#000';
				var contacts = para4.split('|');

				for (var n = 0; n < contacts.length; n++) {
					let line = contacts[n];
					let contactNumber = line.substring(line.indexOf(':') + 1, line.length);
					if (line.indexOf('Member Service') != -1) {
					}
					else if (line.indexOf('Provider Service') != -1) {
						context.fillText(contactNumber, 272, 347);
					}
					else if (line.indexOf('Pre-Authorization') != -1) {
					}
					/*else if(line.indexOf('Behavioral Health') != -1){
						// bhServiceNumber = contactNumber;
					//	context.fillText(contactNumber, 275, 340);
					}*/
					//else if(line.indexOf('Locate Provider') != -1){
                   /* else if(line.indexOf('Locate Provider') != -1){
						// locateServiceNumber = contactNumber;
						//alert('called');
						context.fillText(contactNumber, 275, 352);
					}*/
					else if(line.indexOf('Blue Care Line') != -1){
						// blueCareServiceNumber = contactNumber;
						context.fillText(contactNumber, 289, 361);
					}

				}

			};
			if (memberCardFrontData.dispSuitcase == true && memberCardFrontData.rxSpecified == true)
				imageFrontObj.src = this.config.assets_url + '/images/common/combo1_card_pporx.png';
			else if (memberCardFrontData.dispSuitcase == true && memberCardFrontData.rxSpecified == false)
				imageFrontObj.src = this.config.assets_url + '/images/common/combo_card_ppo.png';
			else if (memberCardFrontData.dispSuitcase == false && memberCardFrontData.rxSpecified == true)
				imageFrontObj.src = this.config.assets_url + '/images/common/combo_card_rx.png';
			else
				imageFrontObj.src = this.config.assets_url + '/images/common/combo1_card.png';

		};

	}

	wrapText(context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
		var words = text.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	}

	slideChanged() {
		if (this.slides.getActiveIndex() < this.cardFrontData.length) {
			this.activeIndex = this.slides.getActiveIndex();
			let cardData = this.cardFrontData[this.activeIndex];

			if (this.activeIndex == 0) {
				this.memberType = this.authService.getMemberRelation();
				this.subscriberName = this.authService.getMemberName();

			}
			else {
				this.memberType = cardData.depRelationsip ? cardData.depRelationsip : this.authService.getMemberRelation();
				this.subscriberName = cardData.MemName;
			}
		}
	}

	handleError(rspmsg) {
		//handle error
		console.log('handleError::' + rspmsg);
		var errmsg = ConstantsService.ERROR_MESSAGES.MYCARDS_SERVER_ERROR;
		if (rspmsg)
			errmsg = rspmsg;
		this.showAlert('ERROR', errmsg);

	}

	showEmailConfirmation(emailInfo) {
		let confirmation = this.alertCtrl.create({
			title: "Would you like to email your digital ID card?",
			message: "By agreeing to the use of this email feature, you acknowledge and accept the possible risks associated with this communication, such as another person accessing your phone/tablet or messages being intercepted or misdirected in transmission.",
			buttons: [
				{
					text: 'No',
					handler: () => {

					}
				},
				{
					text: 'Yes',
					handler: () => {

						scxmlHandler.cards.email(emailInfo);

					}
				}
			]
		});

		window.setTimeout(() => { confirmation.present() }, 500);

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
	handleCardTap(index) {

		let params: any = {};

		params.cardFront = this.cardFrontData[this.activeIndex];
		params.cardBack = this.cardBackData[0];

		params.memberType = this.memberType;

		this.navCtrl.push(MyCardsDetailPage, params);

	}

	presentDependentsPopover(myEvent) {

		this.popover = this.popoverCtrl.create(CardsPopoverPage, { displayName: this.subscriberName });
		this.popover.present({
			ev: myEvent
		});
		this.popover.onDidDismiss((user) => {
			this.goToSlide(user,"frompopover");
		})
	}

	presentMoreOptions(myEvent, canvasElm: Array<any>) {
		let canvasElemesnts = this.myElement.nativeElement.getElementsByClassName('cardCanvasCls');
		let canvas = canvasElemesnts[this.activeIndex];
		this.popover = this.popoverCtrl.create(CardsOptionsPopoverPage);
		this.popover.present({
			ev: myEvent
		});
		this.popover.onDidDismiss((selection) => {
			let fileName = "ID_CARDS.jpg";
			let contentType = "image/jpeg";
			let saveAs = "ID_CARDS.pdf";
			let base64Data = canvas.toDataURL();
			if (selection == 1) {   //Download

				let target = {
					fileName: fileName,
					contentType: contentType,
					destination: "DOWNLOADS",//DOWNLOADS, PICTURES, DOCUMENTS or cuemedata:// 
					saveAs: saveAs,
					isBase64Data: true,
					showLocalNotification: true,
					showToastNotification: true
				}
				scxmlHandler.cards.save(target, base64Data);
			} else if (selection == 2) {

				let emailInfo = {
					to: [
					],
					cc: [
					],
					bcc: [
					],
					subject: "Your request from Blue Cross Blue Shield of Massachusetts",
					body: "Thank you for your request. Attached is a digital version of your member ID card. For added convenience, below are important phone numbers you can call with questions about your plan.\n\n" +

						"Member Service:1-800-262-BLUE (2583) \n" +

						"Behavioral Health and Substance Use Disorders:1-800-444-2426 \n" +

						"Mail Service Pharmacy:1-800-892-5119 \n" +

						"Blue Care Nurse Line:1-888-247-BLUE (2583) \n" +

						"Thank you for being a member of Blue Cross Blue Shield of Massachusetts.",

					attachments: [
						{
							fileName: fileName,
							contentType: contentType,
							emailAs: saveAs,
							data: base64Data
						}
					]
				}

				this.showEmailConfirmation(emailInfo);

			} else if (selection == 3) {  //Print
				let ghostcanvas: any = document.createElement('canvas');

				// 11/10 aspect ratio
				let resizedHeight = 495;	// 396;
				let resizedWidth = 450;		//360;

				ghostcanvas.width = canvas.width;
				ghostcanvas.height = canvas.height;
				let ghostContext: any = ghostcanvas.getContext('2d');
				ghostContext.drawImage(canvas, 0, 0, ghostcanvas.width, ghostcanvas.height);
				this.resample_single(ghostcanvas, resizedWidth, resizedHeight, false);

				let base64DataForPrint = ghostcanvas.toDataURL();
				let printInfo = {
					fileName: fileName,
					contentType: contentType,
					data: base64DataForPrint,
				}
				scxmlHandler.cards.print(printInfo);
			}
		})
	}

	canvasClicked(myEvent) {
		scxmlHandler.playSoundWithHapticFeedback();
		var element = myEvent.target, offsetY = 0, my;

		// Compute the total offset
		if (element.offsetParent != undefined) {
			do {
				if (!element)
					break;
				offsetY += element.offsetTop;
			}
			while ((element = element.offsetParent));
		}
		my = myEvent.center.y - offsetY;
		let divider = 210;
		let cardDetailIndex = 1;
		if (my > divider)
			cardDetailIndex = 2;

		let params: any = { 'index': cardDetailIndex };

		params.cardFront = this.cardFrontData[this.activeIndex];

		params.cardBack = this.cardBackData[0];

		params.memberType = this.memberType;

		this.navCtrl.push(MyCardsDetailPage, params);
		if (cardDetailIndex == 2)
			this.navCtrl.push(ContactUsPage);
	}

	removeLeadingJunkChar(val) {
		return this.authService.removeLeadingJunkChar(val);
	}

	resample_single(canvas, width, height, resize_canvas) {
		var width_source = canvas.width;
		var height_source = canvas.height;
		width = Math.round(width);
		height = Math.round(height);

		var ratio_w = width_source / width;
		var ratio_h = height_source / height;
		var ratio_w_half = Math.ceil(ratio_w / 2);
		var ratio_h_half = Math.ceil(ratio_h / 2);

		var ctx = canvas.getContext("2d");
		var img = ctx.getImageData(0, 0, width_source, height_source);
		var img2 = ctx.createImageData(width, height);
		var data = img.data;
		var data2 = img2.data;

		for (var j = 0; j < height; j++) {
			for (var i = 0; i < width; i++) {
				var x2 = (i + j * width) * 4;
				var weight = 0;
				var weights = 0;
				var weights_alpha = 0;
				var gx_r = 0;
				var gx_g = 0;
				var gx_b = 0;
				var gx_a = 0;
				var center_y = (j + 0.5) * ratio_h;
				var yy_start = Math.floor(j * ratio_h);
				var yy_stop = Math.ceil((j + 1) * ratio_h);
				for (var yy = yy_start; yy < yy_stop; yy++) {
					var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
					var center_x = (i + 0.5) * ratio_w;
					var w0 = dy * dy; //pre-calc part of w
					var xx_start = Math.floor(i * ratio_w);
					var xx_stop = Math.ceil((i + 1) * ratio_w);
					for (var xx = xx_start; xx < xx_stop; xx++) {
						var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
						var w = Math.sqrt(w0 + dx * dx);
						if (w >= 1) {
							//pixel too far
							continue;
						}
						//hermite filter
						weight = 2 * w * w * w - 3 * w * w + 1;
						var pos_x = 4 * (xx + yy * width_source);
						//alpha
						gx_a += weight * data[pos_x + 3];
						weights_alpha += weight;
						//colors
						if (data[pos_x + 3] < 255)
							weight = weight * data[pos_x + 3] / 250;
						gx_r += weight * data[pos_x];
						gx_g += weight * data[pos_x + 1];
						gx_b += weight * data[pos_x + 2];
						weights += weight;
					}
				}
				data2[x2] = gx_r / weights;
				data2[x2 + 1] = gx_g / weights;
				data2[x2 + 2] = gx_b / weights;
				data2[x2 + 3] = gx_a / weights_alpha;
			}
		}
		//clear and resize canvas
		if (resize_canvas === true) {
			canvas.width = width;
			canvas.height = height;
		} else {
			ctx.clearRect(0, 0, width_source, height_source);
		}

		//draw
		ctx.putImageData(img2, 0, 0);
	}

}
