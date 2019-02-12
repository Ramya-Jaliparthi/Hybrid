import { Component, ViewChild, HostListener, Renderer } from '@angular/core';
import { NavController, NavParams, PopoverController, Platform, Popover } from 'ionic-angular';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { AlertController } from 'ionic-angular';
import { MedicationOptionsPopoverPage } from './medication-options-popover';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { MedicationPrescriptionHistoryPage } from './medication-prescription-history';
import { MyClaimsPage } from '../my-claims/my-claims';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';
import { AlertModel } from '../../models/alert/alert.model';
import { MedicationPopoverPage } from './dependents-popover';
import { SortOrder } from '../../utils/sort';
import { ConstantsService } from "../../providers/constants/constants.service";
import { MyMedicationsService } from './my-medications.service';

declare var scxmlHandler: any;
/**
 * Generated class for the MyMedicationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-medications',
  templateUrl: 'my-medications.html',
})
export class MyMedicationsPage {

  medications: Array<any>;
  showSearch: boolean = false;
  showSubHeader: boolean = true;
  selectedUser: any;
  memberName: string;
  memberRelation: string;
  displayName: string;
  medSubsCache: Array<any>; /** Used for Cache to avoid extra http service request */
  medDepCache: Array<any>; /** Used for Cache to avoid extra http service request */
  @ViewChild('searchInput') searchInput: any;
  showAutoComplete: boolean;
  autoCompleteNames: Array<any> = [];
  autoCompleteNamesCache: Array<any> = [];
  cardData: any;
  popover: Popover;
  alert: AlertModel = null;
  sortDirection: number = SortOrder.DESCENDING;
  genericNames: Array<any>;
  dependentsList: any;
  selectedGenericName: string = "All";
  noOfRequests: number = 0;
  mask: any = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthenticationService,
    public config: ConfigProvider,
    private messageProvider: MessageProvider,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public userContext: UserContextProvider,
    private renderer: Renderer,
    private platform: Platform,
    private myMedicationsService: MyMedicationsService
  ) {

    this.cardData = navParams.get("cardData");
    this.getRecentRx();
    this.memberName = authService.getMemberName();
    this.dependentsList = userContext.getDependentsList();
    this.memberRelation = authService.getMemberRelation();
    this.displayName = this.memberName;
    this.messageProvider.getMessage().subscribe(message => {
      if (message.event == "ANDROID_BACK") {
        this.onAndroidBack();
      }
    }, err => {
      this.authService.addAnalyticsClientEvent(err);
    });
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
    this.popover = this.popoverCtrl.create(MedicationPopoverPage, {
      displayName: this.displayName, sortOption: this.sortDirection,
      genericNames: this.genericNames
    });
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
            this.getDependentsRecentRx(user.depId, this.displayName);
          } else if (user == "All") {
            this.displayName = 'All';
            if (this.dependentsList == null) {
              this.selectedUser = null;
              this.memberRelation = this.authService.getMemberRelation();
              this.cardData = null;
              this.getRecentRx();
            } else {
              this.getAllRecentRx();
            }
          } else {
            this.selectedUser = null;
            this.displayName = this.memberName;
            this.memberRelation = this.authService.getMemberRelation();
            this.cardData = null;
            this.getRecentRx();
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
          this.selectedGenericName = "All";
          this.getRecentRx();

        }
        else if (filterOption.key == "GenericNameKey") {
          this.selectedGenericName = filterOption.value;
          this.reselectGenericName();
        }
      }, 10);
    })
  }

  reselectGenericName() {
    for (let i = 0; i < this.genericNames.length; i++) {
      this.genericNames[i].selected = false;
      if (this.genericNames[i].GenericName == this.selectedGenericName) {
        this.genericNames[i].selected = true;
      }
    }

  }

  resetGenericNames() {
    let foundSelected: boolean = false;
    let genericNameList = new Array();
    this.genericNames = new Array();
    if (this.medications != undefined) {
      for (let i = 0; i < this.medications.length; i++) {

        if (genericNameList.indexOf(this.medications[i].GenericName) == -1) {
          genericNameList.push(this.medications[i].GenericName);
        }
      }

    }
    for (let j = 0; j < genericNameList.length; j++) {
      let genericName = { GenericName: genericNameList[j] };
      if (genericNameList[j] == this.selectedGenericName) {
        genericName['selected'] = true;
        foundSelected = true;
      }
      this.genericNames.push(genericName);
    }
    let genericName = { GenericName: 'All' };
    if (!foundSelected) {
      genericName['selected'] = true;
    }
    this.genericNames.splice(0, 0, genericName);
  }

  getAllRecentRx() {
    this.mask = this.authService.showLoadingMask('Accessing Recent Visits Data...');
    this.mask.present();

    this.alert = null;

    let request = {
      useridin: this.authService.useridin
    };

    this.medications = [];
    this.medSubsCache = [];
    this.medDepCache = [];

    let recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentRxEndPoint");

    console.log('getAllRecentRx Url: ' + recentVistUrl);

    this.noOfRequests++;
    this.myMedicationsService.myMedicationsRequest(recentVistUrl, null, request, this.authService.getHttpOptions(), 'Accessing Recent Visits Data...')

      .subscribe(response => {
        this.hideMask();
        if (response && response.ROWSET) {
          if (response.ROWSET.ROWS instanceof Array) {
            this.medications = this.medications.concat(response.ROWSET.ROWS);
            this.medSubsCache = this.medSubsCache.concat(response.ROWSET.ROWS);
          } else {
            this.medications.push(response.ROWSET.ROWS);
            this.medSubsCache.push(response.ROWSET.ROWS);
          }
          this.populateAutoComplete();
          this.resetGenericNames();
        }
      },
      err => {
        this.hideMask();
        console.log("1234 Error while getting recent Rx -" + JSON.stringify(err));
        if (err.displaymessage && (this.medications && this.medications.length == 0)) {
          this.createAlert("Error", err.displaymessage, "error");
        }
        this.authService.addAnalyticsAPIEvent(err.displaymessage, recentVistUrl, err.result ? err.result : '');
      }
      );

    if (this.dependentsList != null) {
      let visits = [];
      recentVistUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentRecentRxEndPoint");

      for (let i = 0; i < this.dependentsList.length; i++) {

        request['depid'] = this.dependentsList[i].depId;

        console.log('getAllDependentRecentRx Url: ' + recentVistUrl);
        this.noOfRequests++;
        this.myMedicationsService.myMedicationsRequest(recentVistUrl, null, request, this.authService.getHttpOptions(), 'Accessing Recent Visits Data...')
          .subscribe(response => {
            this.hideMask();
            if (response && response.ROWSET) {

              if (response.ROWSET.ROWS instanceof Array) {
                let vs: Array<any> = response["ROWSET"].ROWS;
                visits = visits.concat(vs);
              } else {
                console.log('Response 1 getDependentsRecentRx:', response);
                visits.push(response.ROWSET.ROWS);
              }
            }
            if (visits && visits.length > 0) {
              this.medications = this.medications.concat(visits);
              this.medSubsCache = this.medSubsCache.concat(visits);
            }
            this.populateAutoComplete();
            this.resetGenericNames();

            if (this.medications && this.medications.length > 0) {
              this.alert = null;
            }
          },
          err => {
            this.hideMask();
            console.log("Error while getting dependent recent Rx -" + JSON.stringify(err));
            if (err.displaymessage) {
              if (!this.medications || (this.medications && this.medications.length == 0)) {
                this.createAlert("Error", err.displaymessage, "error");
              }
            }
            this.authService.addAnalyticsAPIEvent(err.displaymessage, recentVistUrl, err.result ? err.result : '');
            if (this.medications && this.medications.length > 0) {
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

  isNameExist(name: string) {
    this.autoCompleteNames.forEach(med => {
      if (med.name.toLowerCase().indexOf(name.toLowerCase()) != -1 || name.toLowerCase().indexOf(med.name.toLowerCase()) != -1) {
        return true;
      }
    });
    return false;
  }

  populateAutoComplete() {
    if (this.memberRelation.toLowerCase() != this.authService.getMemberRelation().toLowerCase()) {
      this.autoCompleteNames = [];
      if (this.medDepCache != null) {
        let tempArray: Array<any> = [];
        this.medDepCache.forEach(med => {
          if (med.PrescName && !this.isNameExist(med.PrescName)) {
            if (!tempArray[med.PrescName]) {
              tempArray[med.PrescName] = med;
              this.autoCompleteNames.push({ name: med.PrescName });
            }

            if (med.DispName && !tempArray[med.DispName]) {
              tempArray[med.DispName] = med;
              this.autoCompleteNames.push({ name: med.DispName });
            }

            if (med.GenericName && !tempArray[med.GenericName]) {
              tempArray[med.GenericName] = med;
              this.autoCompleteNames.push({ name: med.GenericName });
            }
          }

        });
      }
    } else {
      if (this.medSubsCache != null) {
        this.autoCompleteNames = [];
        let tempArray: Array<any> = [];
        this.medSubsCache.forEach(med => {
          if (med.PrescName && !this.isNameExist(med.PrescName)) {
            if (!tempArray[med.PrescName]) {
              tempArray[med.PrescName] = med;
              this.autoCompleteNames.push({ name: med.PrescName });
            }

            if (med.DispName && !tempArray[med.DispName]) {
              tempArray[med.DispName] = med;
              this.autoCompleteNames.push({ name: med.DispName });
            }

            if (med.GenericName && !tempArray[med.GenericName]) {
              tempArray[med.GenericName] = med;
              this.autoCompleteNames.push({ name: med.GenericName });
            }
          }
        });
      }
    }
    this.autoCompleteNamesCache = this.autoCompleteNames;
  }

  showMoreOptions(myEvent, medication) {
    scxmlHandler.playSoundWithHapticFeedback();
    this.popover = this.popoverCtrl.create(MedicationOptionsPopoverPage);
    this.popover.present({
      ev: myEvent
    });

    this.popover.onDidDismiss((selection) => {
      if (selection == 1) {
        if (medication.PrescPh && medication.PrescPh != "") {
          let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if (medication.PrescPh.match(phonenoregex)) {
            scxmlHandler.addContact(medication.PrescName, medication.PrescPh);
          } else {
            this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_INCORRECT_PHNNO);
            window.setTimeout(() => {
              this.showAlert('', ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_INCORRECT_PHNNO);
            }, 300);
          }
          let etarget = 'MyMedications.AddToContacts';
          let edataobj = { "context": "action", "data": { "App.linkSource": "My Medications", "app.presciber": medication.PrescName } };
          scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        } else {
          window.setTimeout(() => {
            this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_INCORRECT_PHNNO);
            this.showAlert('', ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_INCORRECT_PHNNO);
          }, 300);
        }
      } else if (selection == 2) {
        let recentRxHistory: Array<any> = this.medications.filter((med) => {
          return medication.GenericName == med.GenericName;
        });
        this.navCtrl.push(MedicationPrescriptionHistoryPage, {
          medication: medication,
          displayName: this.displayName,
          memberRelation: this.memberRelation,
          recentRxHistory: recentRxHistory
        })
      } else if (selection == 3) {
        this.navCtrl.push(MyClaimsPage, {
          ProviderInfo: medication.DispName,
          MemberName: this.displayName,
          MemberType: this.memberRelation
        })
      }
    })
  }

  @HostListener('touchmove', ['$event'])
  onScroll(event) {
    if (this.showSearch) {
      if (this.popover) {
        this.popover.dismiss();
      }
    }
  }

  getRecentRx() {

    let mask = this.authService.showLoadingMask();
    this.alert = null;

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin
      };

      //dependentRecentRxEndPoint
      let getRecentRxURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentRxEndPoint");

      console.log('getRecentRx Url: ' + getRecentRxURL);
      this.myMedicationsService.myMedicationsRequest(getRecentRxURL, mask, request, this.authService.getHttpOptions(), 'Accessing Dependent List...')

        .subscribe(response => {
          if (response) {
            if (response.ROWSET.ROWS instanceof Array) {
              this.medications = response.ROWSET.ROWS;
              this.medSubsCache = response.ROWSET.ROWS;
            } else {
              this.medications = new Array(response.ROWSET.ROWS);
              this.medSubsCache = new Array(response.ROWSET.ROWS);
            }

            this.populateAutoComplete();
            this.resetGenericNames();
          } else {
            let emsg = response.displaymessage;
            this.medications = null;
            this.medSubsCache = null;
            this.authService.handleAPIResponseError(response, emsg, getRecentRxURL);
          }
        },
        err => {
          console.log("Error while getting recent Rx -" + JSON.stringify(err));
          let errmsg = ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_RX_SERVER_ERROR
          if (err.displaymessage) {
            errmsg = err.displaymessage;
            this.createAlert("Error", errmsg, "error");
          }
          this.authService.addAnalyticsAPIEvent(errmsg, getRecentRxURL, err.result);
          this.medications = null;
          this.medSubsCache = null;
        }
        );
    }, 500);
  }

  getDependentsRecentRx(dependentId, dependentName) {
    this.alert = null;
    let mask = this.authService.showLoadingMask('Accessing Recent Rx for ' + dependentName);
    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin,
        depid: dependentId
      };

      let dependentRecentRxUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentRecentRxEndPoint");

      console.log('getDependentsRecentRx Url: ' + dependentRecentRxUrl);
      this.myMedicationsService.myMedicationsRequest(dependentRecentRxUrl, mask, request, this.authService.getHttpOptions(), 'Accessing Recent Visits Data...')

        .subscribe(response => {
          if (response.result && !(response.result === "0")) {
            if (response.displaymessage) {
              let emsg = response.displaymessage;
              this.medications = null;
              this.medDepCache = null;
              this.createAlert("Error", emsg, "error");
              this.authService.addAnalyticsAPIEvent(emsg, dependentRecentRxUrl, response.result);
            }
          } else {
            if (response) {
              if (response.ROWSET.ROWS instanceof Array) {
                this.medications = response.ROWSET.ROWS;
                this.medDepCache = response.ROWSET.ROWS;
              } else {
                this.medications = new Array(response.ROWSET.ROWS);
                this.medDepCache = new Array(response.ROWSET.ROWS);
              }
            }
            this.populateAutoComplete();
            this.resetGenericNames();
          }
        },
        err => {
          console.log("Error while getting dependent recent Rx -" + JSON.stringify(err));

          this.authService.addAnalyticsAPIEvent(err.displaymessage, dependentRecentRxUrl, err.result);
          this.medications = null;
          this.medDepCache = null;
        }
        );
    }, 500);
  }

  handleError(rspmsg) {
    //handle error
    console.log('handleError::' + rspmsg);
    var errmsg = ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_SERVER_ERROR;
    if (rspmsg)
      errmsg = rspmsg;
    this.showAlert('ERROR', errmsg);
  }

  showAlert(ptitle, psubtitle) {
    let alert = this.alertCtrl.create({
      title: ptitle,
      subTitle: psubtitle,
      buttons: [{
        text: 'Ok',
        handler: () => {
          alert.dismiss();
          return false;
        }
      }]
    });
    alert.present();
    this.authService.setAlert(alert);
  }

  ionViewDidEnter() {
    let etarget = 'MyMedications';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
  }
  showMap(location, prescName, pharmacy) {
    scxmlHandler.playSoundWithHapticFeedback();
    let etarget = 'MyMedications.Map';
    let edataobj = { "context": "action", "data": { "App.linkSource": "My Medications", "app.pharmacy": pharmacy } };
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
    //console.log("phone number : " + phNumber);
    let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phNumber != null && phNumber.match(phonenoregex)) {
      return true;
    }
    else {
      return false;
    }
  }

  makeCall(phNumber, prescName, pharmacy, callType) {
    scxmlHandler.playSoundWithHapticFeedback();
    let phonenoregex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phNumber != null && phNumber.match(phonenoregex)) {
      if (this.platform.is("ios") && this.platform.is("ipad")) {
        this.showAlert('', ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_FEATURE_NOTAVAIL);
        this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_FEATURE_NOTAVAIL);
        return;
      }
      let etarget = 'MyMedications.Call';
      let edataobj = {};
      if (callType == "pharmacycall") {
        edataobj = { "context": "action", "data": { "App.linkSource": "My Medications", "app.pharmacy": pharmacy } };
      } else {
        edataobj = { "context": "action", "data": { "App.linkSource": "My Medications", "app.presciber": prescName } };
      }
      scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
      let turl = "tel:" + phNumber;
      scxmlHandler.openExternalWindow(turl);
    }
    else {
      this.showAlert('', ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_CANNOTCALL_INCRCT_PHNNO);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYMEDICATIONS_CANNOTCALL_INCRCT_PHNNO);

    }
  }

  onSearchCancel(event) {
    this.showSearch = false;
    this.showSubHeader = true;
    this.showAutoComplete = false;
    this.medications = this.memberRelation.toLowerCase() != this.authService.getMemberRelation().toLowerCase() ? this.medDepCache : this.medSubsCache;
  }

  onSearchInput(event) {
    let etarget = 'MyMedications.Search';
    let edataobj = { "context": "action", "data": { "App.searchType": "My Medications", "App.searchCriteria": this.searchInput.value } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

    this.cardData = null;
    if (this.searchInput.value && this.searchInput.value.length > 1) {
      this.showAutoComplete = true;
    } else {
      this.showAutoComplete = false;
    }

    this.autoCompleteNames = this.autoCompleteNamesCache.filter((autoCmpItem) => {
      let searchText: string = this.searchInput.value;
      return (autoCmpItem.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
    });

    this.applySearchCriteria();

  }

  applySearchCriteria() {
    if (this.memberRelation != "" && this.memberRelation.toLowerCase() != this.authService.getMemberRelation().toLowerCase()) {
      if (this.medDepCache != null) {
        this.medications = this.medDepCache.filter((med) => {
          let userInput: string = this.searchInput.value.toLowerCase();
          return ((med.PrescName && med.PrescName.toLowerCase().indexOf(userInput) != -1)
            || (med.DispName && med.DispName.toLowerCase().indexOf(userInput) != -1)
            || (med.GenericName && med.GenericName.toLowerCase().indexOf(userInput) != -1))
        });
      } else {
        this.medications = null;
      }
    } else {
      if (this.medSubsCache != null) {
        this.medications = this.medSubsCache.filter((med) => {
          let userInput: string = this.searchInput.value.toLowerCase();
          return ((med.PrescName && med.PrescName.toLowerCase().indexOf(userInput) != -1)
            || (med.DispName && med.DispName.toLowerCase().indexOf(userInput) != -1)
            || (med.GenericName && med.GenericName.toLowerCase().indexOf(userInput) != -1))
        });
      } else {
        this.medications = null;
      }
    }
  }

  selectItem(med) {
    this.searchInput.value = med.name;
    this.showAutoComplete = false;
    this.applySearchCriteria();
  }

  showSearchBox() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.showSearch = true;
    this.showSubHeader = false;
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
}
