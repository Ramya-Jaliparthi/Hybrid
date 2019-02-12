import { Component, ViewChild, HostListener, Renderer } from '@angular/core';
import { NavController, NavParams, PopoverController, Popover } from 'ionic-angular';
import { MyClaimDetailPage } from '../../pages/my-claims/my-claim-detail';
import { MyClaimsFilterPopoverPage } from '../../pages/my-claims/filter-popover';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { AlertController } from 'ionic-angular';

// import * as moment from 'moment';
import { MessageProvider } from '../../providers/message/message';
import { ConfigProvider } from '../../providers/config/config';
import { AlertModel } from '../../models/alert/alert.model';
import { ConstantsService } from "../../providers/constants/constants.service";
import { MyClaimsService } from './my-claims-service'

declare var scxmlHandler: any;
@Component({
  selector: 'page-my-claims',
  templateUrl: 'my-claims.html',
})
export class MyClaimsPage {

  isModalVisible: boolean = false;
  isSearchBarShown: boolean = false;
  memberName: string = "";
  memberType: string = "";
  dispMemberType: string = "";
  tempMemberName: string;
  tempMemberType: string;
  selectedVisitType: string = "All";
  selectedMember: any;
  claimsdata: Array<any>;
  memberList: Array<any> = [{ name: 'All' }];
  visitTypes: Array<any>;
  dependentList: Array<any>;
  claimsDataCache: Array<any>; /**Used only for Cache to avoid unwanted service request */
  depClaimsDataCache: Array<any>; /**Used only for Cache to avoid unwanted service request */
  showAutoComplete: boolean;
  sortDirection: number = -1; //1 for ascending and -1 for descending.
  popover: Popover;
  noOfRequests: number = 0;
  alert: AlertModel = null;
  mask: any = null;

  @ViewChild('searchInput') searchInput: any;
  cardData: any;

  /*
        User can visit to calims page in following scenarios.
        1. User taps on claims card in dashboard
        2. User taps on 'My Claims' in navigation tray or from menu
        3. User taps on 'View Claims' from 'My Doctors'/ 'My Medications'
  */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public authService: AuthenticationService,
    public alertCtrl: AlertController,
    private popoverctrl: PopoverController,
    private messageProvider: MessageProvider,
    private renderer: Renderer,
    private userContext: UserContextProvider,
    public myClaimsService: MyClaimsService) {

    /*
        ProviderInfo, MemberName, MemberType will be set when user 
        navigates to claims page as in scenario #3
    */
    let providerInfo = navParams.get('ProviderInfo');
    this.tempMemberName = navParams.get('MemberName');
    this.tempMemberType = navParams.get('MemberType');
    this.dispMemberType = navParams.get('MemberType');

    this.dependentList = userContext.getDependentsList();

    if (providerInfo != undefined) {

      //Load claims for selected provider.
      this.makeClaimsRequest(providerInfo);
    } else {
      //Load claims for logged in user as in scenario #1 and #2.
      this.makeClaimsRequest();
    }


    if (this.tempMemberName && this.tempMemberType) {
      if (this.tempMemberType.toLowerCase() == authService.getMemberRelation().toLowerCase()) {
        this.memberList.push({ name: this.tempMemberName, selected: true });
      } else {
        this.memberList.push({ name: authService.getMemberName(), selected: true });
      }
    } else {
      this.tempMemberName = authService.getMemberName();
      this.tempMemberType = authService.getMemberRelation();
      this.dispMemberType = authService.getMemberRelation();
      this.memberList.push({ name: this.tempMemberName, selected: true });
    }

    this.prepareMember(this.dependentList);
    this.updateDepMemberDetails();

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

  prepareMember(dependentLists) {

    if (dependentLists != null) {
      let temp: Array<any> = [];
      dependentLists.forEach((element => {
							let isFoundInTempArray = temp.find((tempElement) => { 
								return (tempElement.depunqperid  == element.depunqperid); 
							}); 
							if(!isFoundInTempArray) 
							   temp.push(element);
              }));
              dependentLists = temp;
              dependentLists.forEach(dep => {
                   this.memberList.push({ name: dep.depFirstName + " " + dep.depLastName });
              });
    }
    
  }
  makeAllClaimsRequest() {

    this.mask = this.authService.showLoadingMask('Accessing claims information...');
    this.mask.present();
    this.alert = null;

    let claimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("claimsEndPoint");
    let request = {
      useridin: this.authService.useridin
    };
    this.claimsdata = [];
    this.claimsDataCache = [];

    this.noOfRequests++;

    this.myClaimsService.getClaimsEndPointRequest(claimesUrl)
      .subscribe(response => {
        this.hideMask();
        if (response && response.ROWSET) {
          if (response["ROWSET"].ROWS instanceof Array) {
            this.claimsdata = this.claimsdata.concat(response["ROWSET"].ROWS);
            this.claimsDataCache = this.claimsDataCache.concat(response["ROWSET"].ROWS);
          } else {
            this.claimsdata.push(response["ROWSET"].ROWS);
            this.claimsDataCache.push(response["ROWSET"].ROWS);
          }
          this.updateDepMemberDetails();
        }
        this.resetVisitType();
      },
      error => {
        this.hideMask();
        if (error.displaymessage && (this.claimsdata && this.claimsdata.length == 0)) {
          this.createAlert("Error", error.displaymessage, "error");
        }
        this.authService.addAnalyticsAPIEvent(error.displaymessage, claimesUrl, error.result);
      }
      );

    if (this.dependentList != undefined) {
      let depclaimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentClaimsEndPoint");
      console.log('url :: ' + depclaimesUrl);

      for (let i = 0; i < this.dependentList.length; i++) {
        this.noOfRequests++;
        let dependent = this.dependentList[i];
        if (dependent.depId != undefined) {

          request['depid'] = String(dependent.depId);
        }

        this.myClaimsService.getDependentClaimsEndPointRequest(depclaimesUrl, request)
          .subscribe(response => {
            this.hideMask();
            if (response && response.ROWSET) {

              if (response["ROWSET"].ROWS instanceof Array) {

                this.claimsdata = this.claimsdata.concat(response["ROWSET"].ROWS);
                this.claimsDataCache = this.claimsDataCache.concat(response["ROWSET"].ROWS);
              } else {
                this.claimsdata.push(response["ROWSET"].ROWS);
                this.claimsDataCache.push(response["ROWSET"].ROWS);
              }
            }
            this.updateDepMemberDetails();
            this.resetVisitType();

            if (this.claimsdata && this.claimsdata.length > 0) {
              this.alert = null;
            }
          },
          error => {
            this.hideMask();
            if (!this.claimsdata || (this.claimsdata && this.claimsdata.length == 0)) {
              this.createAlert("Error", error.displaymessage, "error");
            }
            this.authService.addAnalyticsAPIEvent(error.displaymessage, depclaimesUrl, error.result);
            if (this.claimsdata && this.claimsdata.length > 0) {
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

  makeClaimsRequest(providerName?: string) {
    this.alert = null;
    setTimeout(() => {
      let providerClaimsEndPoint = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("claimsforproviderEndPoint");
      let claimsEndPoint = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("claimsEndPoint");

      let claimesUrl = providerName != undefined ? providerClaimsEndPoint : claimsEndPoint;
      const request = {
        useridin: this.authService.useridin
      };
      if (providerName != undefined) {
        request['param1'] = providerName;
      }

      this.myClaimsService.getDependentClaimsEndPointRequest(claimesUrl, request)
        .subscribe(response => {
          if (response.result && !(response.result === "0")) {
            let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_FEATURE_NOTAVAIL;
            if (response.displaymessage) {
              errmsg = response.displaymessage;
              this.createAlert("Error", errmsg, "error");
              this.authService.addAnalyticsAPIEvent(errmsg, claimesUrl, response.result);
              this.claimsdata = null;
              this.claimsDataCache = null;
            }
          } else if (response) {

            if (response["ROWSET"].ROWS instanceof Array) {

              this.claimsdata = response["ROWSET"].ROWS;
              this.claimsDataCache = response["ROWSET"].ROWS;
            } else {

              this.claimsdata = new Array(response["ROWSET"].ROWS);
              this.claimsDataCache = new Array(response["ROWSET"].ROWS);
            }
            this.updateDepMemberDetails();
          } else {
            this.claimsdata = null;
            this.claimsDataCache = null;
          }
          this.resetVisitType();

        },
        error => {
          let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_FEATURE_NOTAVAIL;
          if (error.displaymessage) {
            errmsg = error.displaymessage;
            this.createAlert("Error", errmsg, "error");
          }
          this.authService.addAnalyticsAPIEvent(errmsg, claimesUrl, error.result);
          this.claimsdata = null;
          this.claimsDataCache = null;
        }
        );
    }, 500);
  }

  makeDependentClaimsRequest(depId) {
    this.alert = null;
    setTimeout(() => {

      let claimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("dependentClaimsEndPoint");

      const request = {
        useridin: this.authService.useridin
      };
      if (depId != undefined) {
        request['depid'] = String(depId);
      }
      this.myClaimsService.getDependentClaimsEndPointRequest(claimesUrl, request)
        .subscribe(response => {
          if (response.result && !(response.result === "0")) {
            let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_FEATURE_NOTAVAIL;
            if (response.displaymessage) {
              this.claimsdata = null;
              this.depClaimsDataCache = null;
              errmsg = response.displaymessage;
              this.createAlert("Error", errmsg, "error");
              this.authService.addAnalyticsAPIEvent(errmsg, claimesUrl, response.result);
            }
          } else if (response) {

            if (response["ROWSET"].ROWS instanceof Array) {

              this.claimsdata = response["ROWSET"].ROWS;
              this.depClaimsDataCache = response["ROWSET"].ROWS;
            } else {
              this.claimsdata = new Array(response["ROWSET"].ROWS);
              this.depClaimsDataCache = new Array(response["ROWSET"].ROWS);
            }

          } else {
            this.claimsdata = null;
            this.depClaimsDataCache = null;
          }
          this.updateDepMemberDetails();
          this.resetVisitType();

        },
        error => {
          this.authService.addAnalyticsAPIEvent(error.displaymessage, claimesUrl, error.result);
          this.claimsdata = null;
          this.depClaimsDataCache = null;
          this.updateDepMemberDetails();
          this.resetVisitType();
        }
        );
    }, 500);
  }

  @HostListener('touchmove', ['$event'])
  onScroll(event) {
    if (this.isSearchBarShown) {
    }
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
    let etarget = 'MyClaims';
    let edataobj = { "context": "state", "data": { "App.userState": this.authService.getUserStateForAdobeAnalytics() } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_SCREEN + etarget, edataobj);
    this.handleDeepLink();
  }
  getModalVisibility() {
    return this.isModalVisible;
  }

  showSearchBar() {
    scxmlHandler.playSoundWithHapticFeedback();

    this.isSearchBarShown = true;
    window.setTimeout(() => {
      this.searchInput.setFocus();
    }, 10);

  }

  hideSearchBar() {
    this.isSearchBarShown = false;
  }
  onSearchCancel(event) {
    this.hideSearchBar();
    this.showAutoComplete = false;
    if (this.memberType.toLowerCase() != this.authService.getMemberRelation().toLowerCase()) {
      this.claimsdata = this.depClaimsDataCache;
    } else {
      this.claimsdata = this.claimsDataCache;
    }

  }

  onSearchInput(event) {

    let etarget = 'MyClaims.Search';
    let edataobj = { "context": "action", "data": { "App.searchType": "My Claims", "App.searchCriteria": this.searchInput.value } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    if (this.searchInput.value && this.searchInput.value.length > 1) {
      this.showAutoComplete = true;
    } else {
      this.showAutoComplete = false;
    }
    this.applySearchCriteria();
  }

  getUniqueClaims() {
    let claims: Array<any> = [];
    let provNames: Array<any> = [];
    if (this.claimsdata) {
      this.claimsdata.forEach(claim => {
        if (!provNames[claim.provName]) {
          provNames[claim.provName] = claim;
          claims.push(claim);
        }
      });
    }
    return claims;
  }

  applySearchCriteria() {
    if (this.memberType != "" && this.memberType.toLowerCase() != this.authService.getMemberRelation().toLowerCase()) {
      if (this.depClaimsDataCache != null) {
        this.claimsdata = this.depClaimsDataCache.filter((claim) => {
          let userInput: string = this.searchInput.value
          return (claim.provName.toLowerCase().indexOf(userInput.toLowerCase()) != -1)
        });
      } else {
        this.claimsdata = null;
      }
    } else {
      if (this.claimsDataCache != null) {
        this.claimsdata = this.claimsDataCache.filter((claim) => {
          let userInput: string = this.searchInput.value
          return (claim.provName.toLowerCase().indexOf(userInput.toLowerCase()) != -1)
        });
      } else {
        this.claimsdata = null;
      }
    }
  }

  selectItem(claim) {

    this.searchInput.value = claim.provName;
    this.showAutoComplete = false;
    this.applySearchCriteria();
  }
  toggleFilterOptionsOnContainer(iconElement: any) {
    let event = new MouseEvent('click', { bubbles: false });
    this.renderer.invokeElementMethod(
      iconElement, 'dispatchEvent', [event]);

  }

  toggleFilterOptions(myEvent) {
    event.cancelBubble = true;
    scxmlHandler.playSoundWithHapticFeedback();
    this.isModalVisible = true;
    if (this.isSearchBarShown) {
      this.onSearchCancel(null);
    }

    this.popover = this.popoverctrl.create(MyClaimsFilterPopoverPage,
      {
        memberList: this.memberList,
        visitType: this.visitTypes,
        sortByOption: (this.sortDirection == -1 ? "mostRecent" : "oldestFirst")
      });
    this.popover.present({
      ev: myEvent
    });
    this.popover.onDidDismiss((filterOption) => {
      window.setTimeout(() => {
        if (filterOption == null) {
          return;
        }
        if (filterOption.key == "member") {
          let names = filterOption.value;
          this.selectedMember = names;
          let depId = this.getDependentId(names);
          this.resetSelectedMember();
          if (names == "All") {

            this.makeAllClaimsRequest();
            this.tempMemberName = "All";
            this.tempMemberType = "";
            this.updateDepMemberDetails();
          }
          else if (depId == null) {
            this.makeClaimsRequest();
            this.tempMemberName = this.authService.getMemberName();
            this.tempMemberType = this.authService.getMemberRelation();
            this.tempMemberName = this.authService.getMemberName();
            this.tempMemberType = this.authService.getMemberRelation();
            this.updateDepMemberDetails();
          } else {
            this.makeDependentClaimsRequest(depId);
          }
        } else if (filterOption.key == "visitType") {
          this.selectedVisitType = filterOption.value;
          this.reselectVisitType();
        } else if (filterOption.key == "showByDateOrder") {
          if (filterOption.value == "mostRecent") {
            this.sortDirection = -1;
          } else {
            this.sortDirection = 1;
          }
        } else if (filterOption.key == "resetFilters") {
          this.selectedMember = this.authService.getMemberName();

          this.makeClaimsRequest();
          this.tempMemberName = this.authService.getMemberName();
          this.tempMemberType = this.authService.getMemberRelation();
          this.updateDepMemberDetails();
          this.resetSelectedMember();
          this.sortDirection = -1;
          this.selectedVisitType = "All";
          this.resetVisitType();

        }
      }, 10);

    });
  }

  getDependentId(dependentFullName) {
    if (dependentFullName && this.dependentList) {
      for (let i = 0; i < this.dependentList.length; i++) {
        let fullName = this.dependentList[i].depFirstName + " " + this.dependentList[i].depLastName;
        if (fullName.toLowerCase() == dependentFullName.toLowerCase()) {
          this.tempMemberName = fullName;
          this.tempMemberType = this.dependentList[i].depRelationsip;
          return this.dependentList[i].depId;
        }
      }
    }
    return null;
  }
  reselectVisitType() {
    for (let i = 0; i < this.visitTypes.length; i++) {
      this.visitTypes[i].selected = false;
      if (this.visitTypes[i].type == this.selectedVisitType) {
        this.visitTypes[i].selected = true;
      }
    }

  }
  resetSelectedMember() {
    for (let i = 0; i < this.memberList.length; i++) {
      this.memberList[i].selected = false;
      if (this.memberList[i].name == this.selectedMember) {
        this.memberList[i].selected = true;
      }
    }
  }
  showClaimsDetails(claimData: any, event) {

    scxmlHandler.playSoundWithHapticFeedback();

    let etarget = 'MyClaims.ViewClaim';
    let edataobj = { "context": "action", "data": { "App.linkSource": "My Claims" } };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);

    setTimeout(() => {
      let intClmNum_ = claimData.intClmNum;


      if (intClmNum_ != null && claimData.clmStatus != 'Pending') {
        if (claimData.isDependent) {
          let depId = this.getDependentId(claimData.memFName + ' ' + claimData.memLName);
          this.getdepclaimsforICN(intClmNum_, depId);
        } else {
          this.getclaimsforICN(intClmNum_);
        }
      } else {
        let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_DETAILS_NOTAVAIL;
        if (claimData.clmStatus == 'Pending') {
          errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_DETAILS_NOTAVAIL_PENDING;
        } else {
          console.log('claim number not available');
          errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_DETAILS_NOTAVAIL_CLAIMNUMBER;
        }
        this.showAlert('', errmsg);
        this.authService.addAnalyticsClientEvent(errmsg);
      }
    }, 500);

  }

  showFilterView() {

  }

  resetVisitType() {
    let foundSelected: boolean = false;
    let vTypeList = new Array();
    this.visitTypes = new Array();
    if (this.claimsdata != undefined) {
      for (let i = 0; i < this.claimsdata.length; i++) {

        if (vTypeList.indexOf(this.claimsdata[i].svcType) == -1) {
          vTypeList.push(this.claimsdata[i].svcType);
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
  updateDepMemberDetails() {
    this.memberName = this.tempMemberName;
    this.memberType = this.tempMemberType;
  }
  getUserDependentList() {
    let depList = this.userContext.getDependentsList();
    if (depList == null) {
      this.showAlert('', ConstantsService.ERROR_MESSAGES.MYCLAIMS_DEPENDENTINFO_NOTAVAIL);
      this.authService.addAnalyticsClientEvent(ConstantsService.ERROR_MESSAGES.MYCLAIMS_DEPENDENTINFO_NOTAVAIL);
    }
    return depList;
  }

  getclaimsforICN(icn) {
    this.alert = null;

    setTimeout(() => {

      const request = {
        useridin: this.authService.useridin,
        param1: String(icn)
      };

      let claimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("claimsforICNEndPoint");

      this.myClaimsService.getDependentClaimsEndPointRequest(claimesUrl, request)
        .subscribe(response => {
          if (response) {
            let claimDetail: any;
            if (response.ROWSET.ROWS instanceof Array) {
              claimDetail = response["ROWSET"].ROWS;
            } else {
              claimDetail = new Array(response.ROWSET.ROWS);
            }
            this.navCtrl.push(MyClaimDetailPage, { data: claimDetail });
          }
        },
        error => {
          let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_FEATURE_NOTAVAIL;
          if (error.displaymessage) {
            errmsg = error.displaymessage;
          }
          this.authService.addAnalyticsAPIEvent(error.displaymessage, claimesUrl, error.result);
          this.showAlert('ERROR', errmsg);
        }
        );
    }, 100);

  }

  getdepclaimsforICN(icn, pdepid) {
    this.alert = null;
    setTimeout(() => {

      const request = {
        useridin: this.authService.useridin,
        depid: pdepid,
        param1: String(icn)
      };

      let claimesUrl = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("depClaimsforICNEndPoint");

      this.myClaimsService.getDependentClaimsEndPointRequest(claimesUrl, request)
        .subscribe(response => {
          if (response) {
            let claimDetail: any;
            if (response.ROWSET.ROWS instanceof Array) {
              claimDetail = response["ROWSET"].ROWS;
            } else {
              claimDetail = new Array(response.ROWSET.ROWS);
            }
            this.navCtrl.push(MyClaimDetailPage, { data: claimDetail });
          }
        },
        error => {
          let errmsg = ConstantsService.ERROR_MESSAGES.MYCLAIMS_FEATURE_NOTAVAIL;
          if (error.displaymessage) {
            errmsg = error.displaymessage;
          }
          this.showAlert('ERROR', errmsg);
          this.authService.addAnalyticsAPIEvent(errmsg, claimesUrl, error.result);
        }
        );
    }, 100);

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

  handleDeepLink() {

    let deepLink = this.authService.getDeepLink();
    let claimsPageName = "myclaims?";
    let claimId: any;
    if (deepLink.indexOf(claimsPageName) >= 0) {
      setTimeout(() => {
        let myClaimsIdx = deepLink.indexOf(claimsPageName) + claimsPageName.length;
        let param = deepLink.substring(myClaimsIdx);
        if (param.indexOf("=") >= 0) {
          let keyValue = param.split("=");
          if (keyValue[0] && keyValue[0].toLowerCase() === 'claimid') {
            claimId = keyValue[1];
            this.authService.setDeepLink("");
            this.getclaimsforICN(claimId);

          }
        }

      }, 300);
    } else {
      this.authService.setDeepLink("");
    }


  }

}
