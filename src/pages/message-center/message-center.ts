import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { MessageCenterDetailPage } from "./message-center-detail";
import { ConstantsService } from '../../providers/constants/constants.service';
import { CardConfig } from "../../components/dashboard-card/card-config";
import { LoginState, UserContextProvider } from "../../providers/user-context/user-context";
import { CardProvider } from "../../providers/card/card";
import { NgZone } from '@angular/core';
import { AlertModel } from '../../models/alert/alert.model';
import { MyNewsMsgCtrPage1 } from '../../pages/my-news/my-news-msgCtrPage1';
import { MyNewsMsgCtrPage2 } from '../../pages/my-news/my-news-msgCtrPage2';
import { MyNewsMsgCtrPage3 } from '../../pages/my-news/my-news-msgCtrPage3';
import { MessageCenterService } from './message-center.service';

declare var scxmlHandler: any;
@Component({
    selector: 'page-message-center',
    templateUrl: 'message-center.html',
})
export class MessageCenterPage {
    messageAlerts: any;
    noMessageAlerts: any;
    toastinstance: any;
    messageCenterDetailDeletedItem: any;
    emptyMessageAlertsPanel: boolean = false;
    showDeleteMenu: boolean = false;
    showCheckBox: boolean = false;
    messageCenter: string = "Notifications";
    deletedAlertID: any;
    msgTitle: any;
    deletedAlertsMsg: any;
    cards: Array<CardConfig>;
    errorAlerts: Array<any>;
    public actions = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private authService: AuthenticationService,
        private cardProvider: CardProvider,
        public toastCtrl: ToastController,
        private userContext: UserContextProvider,
        public platform: Platform,
        private ngZone: NgZone,
        private messageCenterService: MessageCenterService) {
        let _navParm = navParams.get('deletedmemAlert');
        if (navParams != null && _navParm) {
            this.createToastEle(navParams.get('data'), this.authService.messageAlertsInMemoryVals, '1 deleted');
            this.displayEmptyAlertsMsg(this.authService.messageAlertsInMemoryVals);
        }
        window['MsgCtrPageRef'] = {
            component: this
        };

        if (platform.is('android')) {
            this.showDeleteMenu = true;
        } else {
            this.showDeleteMenu = false;
        }
        scxmlHandler.getMessages();
    }

    ionViewDidEnter() {
        let etarget = 'MessageCenter';
        if (this.authService && this.authService.currentUserScopename && this.authService.currentUserScopename.indexOf('AUTHENTICATED') != -1) {
            if (this.authService.messageAlertsInMemoryVals && this.authService.messageAlertsInMemoryVals.length > 0) {
                this.messageAlerts = this.authService.messageAlertsInMemoryVals;
                this.messageAlerts = this.formatHyperlinks(this.messageAlerts);
                let allTitles = this.getAllTitles();
                let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.MessageTitle": allTitles, "MessageType": "Notification/Alert" } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
                this.handleDeepLink();
            } else {
                this.noMessageAlerts = ConstantsService.ERROR_MESSAGES.MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS;
                this.emptyMessageAlertsPanel = true;
                let deepLink: String = this.authService.getDeepLink();
                if (deepLink != "" && (deepLink.indexOf("drupalid") >= 0 || deepLink.indexOf("messageid") >= 0)) {
                    this.handleDeepLink();
                }
                else {
                    this.authService.setDeepLink("");
                }
            }
        } else {
            this.noMessageAlerts = ConstantsService.ERROR_MESSAGES.MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS;
            this.emptyMessageAlertsPanel = true;
        }

    }

    toggleBtn() {
        this.showCheckBox = !this.showCheckBox;
        this.messageAlerts.forEach(msgalert => {
            if (msgalert.checked) {
                msgalert.checked = false;
            }
        });
    }

    showMessages(event: any) {
        this.errorAlerts = [];
        if (event.value == "Notifications") {
            this.ngZone.run(() => {
                let allTitles = this.getAllTitles();
                let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.MessageTitle": allTitles, "MessageType": "Notification/Alert" } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + "MessageCenter", edataobj);

                if (this.authService.messageAlertsInMemoryVals && this.authService.messageAlertsInMemoryVals.length > 0) {

                    this.authService.messageAlertsInMemoryVals.forEach(msgalert => {
                        if (msgalert.checked) {
                            msgalert.checked = false;
                        }
                    });
                }
            });
        } else if (event.value == "Cards") {
            this.ngZone.run(() => {
                if (this.toastinstance) {
                    this.toastinstance.dismiss();
                }
                this.showCheckBox = false;
                this.cards = this.cardProvider.getMessageCenterCards();
                let messageTitles = "";

                let msgCtrDrupal = this.userContext.getMessageCenterInfo();

                if (msgCtrDrupal["article1"]) {
                    messageTitles += msgCtrDrupal["article1"][0].Title + "|";
                    messageTitles += msgCtrDrupal["article2"][0].Title + "|";
                    messageTitles += msgCtrDrupal["article3"][0].Title;
                }


                this.actions.forEach(element => {
                    messageTitles += "|" + element.title;
                });
                let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.MessageTitle": messageTitles, "MessageType": "Messages" } };
                scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + "MessageCenter", edataobj);

            });
        }
    }

    trimLongTxt(msg): string {
        return msg.slice(0, 38) + "...";
    }

    trimShortTxt(msg): string {
        return msg.slice(0, 34) + "...";
    }

    showMessageCenterDetails(messagecenterData: any) {
        this.errorAlerts = [];
        let actionType = "alertdetails";
        if (messagecenterData.messageRead) {
            this.navCtrl.push(MessageCenterDetailPage, { data: messagecenterData });
        } else {
            this.updatememAlert(messagecenterData, actionType);
        }

    }

    isStateAnonymous() {
        return (this.userContext.getLoginState() == LoginState.Anonymous);
    }



    formatHyperlinks(messages) {
        messages.forEach(element => {
            this.constructHyperlink(element);
        });
        return messages;
    }

    constructHyperlink(element) {
        let linkIdentifier = ConstantsService.MSG_CTR_LINK;
        element.trimmedShortText = this.trimShortTxt(element.AlertShortTxt).replace(linkIdentifier, '');
        element.trimmedLongText = this.trimLongTxt(element.AlertLongTxt).replace(linkIdentifier, '');
        if(element["headerLongText"] == undefined){
            element["headerLongText"] =this.trimLongTxt(element.AlertLongTxt).replace(linkIdentifier, '');        
        }
        let longText = element.AlertLongTxt;
        let startIdx = longText.indexOf(linkIdentifier);
        if (startIdx >= 0 && longText.substring(startIdx - 33).indexOf("scxmlHandler.openExternalWindow('") != 0) {
            let arr = longText.split("CTA: Opens ");
            arr.filter(function (str, index) {
                if (str.indexOf("https://") != -1) {
                    let _url = str.split(" ");
                    _url[0] = "<div onclick=\"scxmlHandler.openExternalWindow('" + _url[0] + "')\"><a>" + _url[0] + "</a> </div>";
                    arr[index] = _url.join(" ");
                }
            });
            element.AlertLongTxt = arr.join(" ");
        }
        element.AlertShortTxt = element.AlertShortTxt.replace(linkIdentifier, '');
        return element;
    }

    getAllTitles() {
        let allTitles = "";
        if (this.messageAlerts) {
            this.messageAlerts.forEach(element => {
                allTitles += element.AlertShortTxt + "|";
            });
            allTitles = allTitles.slice(0, -1);
        }
        return allTitles;
    }

    showMessageDetailPage(messageId) {
        this.errorAlerts = [];
        let messagecenterData = this.messageAlerts.filter((alert) => {
            return alert.messageID.toString() === messageId;
        });
        if (messagecenterData.length > 0) {
            this.showMessageCenterDetails(messagecenterData[0]);
        }
    }

    deletememAlert(messagecenterData: any) {
        this.errorAlerts = [];
        let actionType = "deletealert";
        this.updatememAlert(messagecenterData, actionType);
    }
    updatememAlert(messagecenterData: any, actionType: string) {
        if (this.authService.token == undefined || this.authService.token == null) {
            this.authService.makeTokenRequest(true).subscribe(token => {
                this.authService.token = token;
                this.updateAlertHttpRequest(messagecenterData, actionType);
            },
                err => {
                }
            );
        } else {
            if (actionType == "alertdetails") {
                this.updateAlertHttpRequest(messagecenterData, actionType);
            } else {
                this.messageAlerts.forEach(msgalert => {
                    if (msgalert.isDeleted) {
                        if (this.toastinstance) {
                            this.toastinstance.dismiss();
                        }
                    }
                });
                this.softdelteMsgAlert(messagecenterData);
            }

        }
    }

    softdelteMsgAlert(messagecenterData: any) {

        this.messageAlerts.forEach(msgalert => {
            if (msgalert.messageID == messagecenterData.messageID) {
                msgalert.isDeleted = true;
            }
        });
        this.setValuetolocalStorage(this.messageAlerts);
        this.displayEmptyAlertsMsg(this.messageAlerts);
        this.createToastEle(messagecenterData, this.messageAlerts, '1 deleted');

    }
    ionViewWillLeave() {
        this.errorAlerts = [];
        if (this.toastinstance) {
            this.toastinstance.dismiss();
        }
    }

    createToastEle = (messagecenterData: any, updatememalerts: any, deleteMsg: string) => {

        this.toastinstance = this.toastCtrl.create({
            message: deleteMsg,
            showCloseButton: true,
            duration: 10000,
            closeButtonText: 'UNDO'
        });
        this.toastinstance.onDidDismiss((data, role) => {
            if (role == "close") {
                updatememalerts.forEach(msgalert => {
                    if (Array.isArray(messagecenterData) && messagecenterData.length == 1) {
                        messagecenterData = messagecenterData[0];
                    }
                    if (messagecenterData.length > 1) {
                        messagecenterData.forEach(msgalertdata => {
                            if (msgalertdata.messageID == msgalert.messageID) {
                                msgalert.isDeleted = false;
                                msgalert.checked = false;
                            }
                        });

                    } else {
                        if (msgalert.messageID == messagecenterData.messageID) {
                            msgalert.isDeleted = false;
                        }
                    }
                });
                this.messageAlerts = updatememalerts;
                this.setValuetolocalStorage(this.messageAlerts);
                this.displayEmptyAlertsMsg(this.messageAlerts);
            } else {
                this.updateAlertHttpRequest(messagecenterData, "deletealert");
            }
        });
        this.toastinstance.present();
        this.showCheckBox = false;
    }

    setValuetolocalStorage(messageAlerts: any) {
        let totalcount = 0;
        if (messageAlerts != null) {
            for (var i = 0; i < messageAlerts.length; i++) {
                if (messageAlerts[i].messageRead == false && messageAlerts[i].isDeleted == false) {
                    totalcount++;
                }
            }
        }
        this.authService.messageAlertsCount = totalcount;
        this.authService.handleBadgeCount(this.authService.messageAlertsCount);
        this.authService.messageAlertsInMemoryVals = messageAlerts;
    }

    displayEmptyAlertsMsg(messageAlerts: any) {
        let count = 0;
        if (messageAlerts.length > 0) {
            messageAlerts.forEach(msgalert => {
                if (msgalert.isDeleted) {
                    count = count + 1;
                }
            });
        }

        if (count == messageAlerts.length) {
            this.emptyMessageAlertsPanel = true;
            this.noMessageAlerts = ConstantsService.ERROR_MESSAGES.MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS;
        } else {
            this.emptyMessageAlertsPanel = false;
            this.noMessageAlerts = "";
        }
    }


    updateAlertHttpRequest(messagecenterData: any, actionType) {
        let updatememalertsUrl = "";
        let request = {};
        updatememalertsUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("updatememalertsEndPoint");
        let etarget = "MessageCenter.DeleteMessage";

        if (actionType == "deletealert") {
            this.deletedAlertID = [];
            if (Array.isArray(messagecenterData)) {
                messagecenterData.forEach(msgalert => {
                    if (msgalert.isDeleted) {
                        this.deletedAlertID.push(msgalert.messageID);
                        this.msgTitle.push(msgalert.AlertShortTxt);
                    }
                });
                this.deletedAlertID = (this.deletedAlertID).join("|");
            } else {
                this.deletedAlertID = messagecenterData.messageID;
                this.msgTitle = messagecenterData.AlertShortTxt;
            }

            request = {
                "mesg": {
                    "useridin": this.authService.useridin, "deletealertids": this.deletedAlertID
                }
            };
        } else {
            request = {
                "mesg": {
                    "useridin": this.authService.useridin, "readalertids": messagecenterData.messageID
                }
            };
            etarget = "MessageCenter.UpdateMessage"
        }
        this.messageCenterService.messageCenterRequest(updatememalertsUrl, request)
            .subscribe(response => {

                if (response && response.result === "0") {
                    let edataobj = { "context": "action", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics(), "App.MessageTitle": this.msgTitle, "MessageType": "Notification/Alert" } };
                    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
                    if (actionType == "alertdetails") {
                        this.navCtrl.push(MessageCenterDetailPage, { data: messagecenterData });
                    } else {
                        // 

                    }
                }
                else if (response.result === "-1") {
                    let emsg = ConstantsService.ERROR_MESSAGES.MESSAGECENTER_TECHNICAL_DIFFICULTIES;
                    this.errorBanner(emsg);
                    let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget + '.Error', edataobj);
                }
                else if (response.result === "-2") {
                    let emsg = ConstantsService.ERROR_MESSAGES.MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS;
                    this.errorBanner(emsg);
                    let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget + '.Error', edataobj);
                }
                else {
                    let emsg = response.displaymessage;
                    this.errorBanner(emsg);
                    let edataobj = { "context": "state", "data": { "App.errorMessage": emsg, "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
                    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget + '.Error', edataobj);
                }

            }, err => {
                console.log('Error response from updatememalerts ' + err);
                if (err.displaymessage) {
                    this.errorBanner(err.displaymessage);
                }
                this.messageAlerts.forEach(msgalert => {
                    if (msgalert.messageID == messagecenterData.messageID) {
                        if (actionType == "deletealert") {
                            msgalert.isDeleted = false;
                        } else {
                            msgalert.messageRead = false;
                        }
                    }
                });
                this.setValuetolocalStorage(this.messageAlerts);
                this.authService.addAnalyticsAPIEvent(err.displaymessage, updatememalertsUrl, err.result);
            }
            );
    }
    getActivePage(): string {
        return this.navCtrl.getActive().name;
    }



    deleteallAlert(messageAlerts: any) {
        this.errorAlerts = [];
        var deletecount = 0;
        messageAlerts.forEach(msgalert => {
            if (msgalert.checked) {
                msgalert.isDeleted = true;
                deletecount = deletecount + 1;
            }
        });

        if (deletecount == 0) {
            return;
        }
        this.setValuetolocalStorage(messageAlerts);
        this.displayEmptyAlertsMsg(messageAlerts);
        this.deletedAlertsMsg = deletecount + " deleted";
        this.createToastEle(this.messageAlerts, messageAlerts, this.deletedAlertsMsg);
    }

    handleDeepLink() {

        let deepLink = this.authService.getDeepLink();
        let msgCtrPageName = "messagecenter?";
        let messageId: any;
        if (deepLink.indexOf(msgCtrPageName) >= 0) {
            setTimeout(() => {
                let msgCtrIdx = deepLink.indexOf(msgCtrPageName) + msgCtrPageName.length;
                let param = deepLink.substring(msgCtrIdx);
                if (param.indexOf("=") >= 0) {
                    let keyValue = param.split("=");
                    if (keyValue[0] && keyValue[1]) {
                        messageId = keyValue[1];
                        this.authService.setDeepLink("");
                        switch (keyValue[0].toLowerCase()) {
                            case 'alertid':
                                this.showMessageDetailPage(messageId);
                                break;
                            case 'drupalid':
                                if (this.cards == null || this.cards.length == 0) {
                                    this.cards = this.cardProvider.getMessageCenterCards();
                                }
                                scxmlHandler.playSoundWithHapticFeedback();
                                if (messageId == 3) {
                                    this.navCtrl.push(MyNewsMsgCtrPage3);
                                } else if (messageId == 2) {
                                    this.navCtrl.push(MyNewsMsgCtrPage2);
                                } else if (messageId == 1) {
                                    this.navCtrl.push(MyNewsMsgCtrPage1);
                                }
                                break;
                            case 'messageid':
                                let msgId = this.getMessageByDescription(messageId);
                                if (msgId) {
                                    this.messageCenter = 'Cards';
                                    this.showInAppMessageById(msgId);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }

            }, 300);
        } else {
            this.authService.setDeepLink("");
        }
    }


    getMessageByDescription(desc) {
        let msgId = null;
        desc = desc.split("_").join(" ");
        for (var index = 0; index < this.actions.length; index++) {
            var element = this.actions[index];
            let title = element.title ? element.title.toLowerCase() : "";
            desc = desc.toLowerCase();
            if (title.trim() === desc.trim()) {
                msgId = element.id;
            }
        }
        return msgId;
    }
    setInAppMessages(messages) {
        messages.forEach(element => {
            let message = { "id": element.id, "title": element.subject, "action": "Click here to view", "messageRead": false };
            this.actions.push(message);
        });
    }


    showInAppMessage(message) {
        scxmlHandler.showMessage(message.id);
    }
    showInAppMessageById(messageId) {
        scxmlHandler.showMessage(messageId);
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
        this.errorAlerts = this.userContext.getAlerts();
    }

    isAlertShowing() {
        let alts: Array<any> = this.userContext.getAlerts();
        return alts.length == 0;
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
}