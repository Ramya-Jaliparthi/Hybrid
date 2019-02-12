import { Component } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { NavController } from 'ionic-angular';
import { MedicationPrescriptionHistoryPage } from '../../pages/my-medications/medication-prescription-history';

declare var scxmlHandler;
@Component({
  selector: 'my-medications-card',
  templateUrl: 'my-medications-card.html'
})
export class MyMedicationCardComponent {

  memberInfo: any;
  cardData: any;
  medications: Array<any>;
  medSubsCache: Array<any>;

  constructor(private authService: AuthenticationService, private nav: NavController) {

    let memberInfoResponse = authService.getMemberInfoRowSet();

    if (!memberInfoResponse['errormessage']) {

      this.memberInfo = authService.getMemberInfo();;
    }

  }

  openPage() {
    scxmlHandler.playSoundWithHapticFeedback();
    let mask = this.authService.showLoadingMask();

    setTimeout(() => {
      const request = {
        useridin: this.authService.useridin
      };

      const isKey2req = false;

      let getRecentRxURL = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty("recentRxEndPoint");

      console.log('getRecentRx Url: ' + getRecentRxURL);

      this.authService.makeHTTPRequest("post", getRecentRxURL, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2req)), this.authService.getHttpOptions(), 'Accessing Dependent List...')
        .map(res1 => {
          let resobj = res1;
          console.log('getRecentRx :: response =', resobj);
          if (resobj.result === "0") {
            return this.authService.handleDecryptedResponse(resobj);
          } else {
            console.log('getRecentRx :: error =' + resobj.errormessage);
            let emsg = resobj.displaymessage;
            this.medications = null;
            this.medSubsCache = null;
            this.authService.handleAPIResponseError(resobj, emsg, getRecentRxURL);
          }
        })
        .subscribe(response => {
          console.log('Response getRecentRx:', response);
          if (response) {
            if (response.ROWSET.ROWS instanceof Array) {
              this.medications = response.ROWSET.ROWS;
              this.medSubsCache = response.ROWSET.ROWS;
            } else {
              this.medications = new Array(response.ROWSET.ROWS);
              this.medSubsCache = new Array(response.ROWSET.ROWS);
            }
            let recentRxHistory: Array<any> = this.medSubsCache.filter((med) => {
              console.log(this.memberInfo.rxDrug + '::' + med.GenericName);
              return this.memberInfo.rxDrug.toUpperCase() == med.GenericName.toUpperCase();
            });
            if (recentRxHistory.length > 0) {
              this.nav.push(MedicationPrescriptionHistoryPage, {
                medication: recentRxHistory[0],
                displayName: this.authService.getMemberName(),
                memberRelation: this.authService.getMemberRelation(),
                recentRxHistory: recentRxHistory
              })
            } else {
              console.log('No matching Rx records to show visit history');
            }
          }
        },
          err => {
            console.log("Error while getting recent Rx -" + JSON.stringify(err));
            this.medications = null;
            this.medSubsCache = null;
            this.authService.addAnalyticsAPIEvent(err.displaymessage, getRecentRxURL, err.result);
          }
        );
    }, 500);
  }

}
