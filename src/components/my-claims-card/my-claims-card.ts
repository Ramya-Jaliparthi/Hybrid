import { Component } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';
import { NavController } from 'ionic-angular';
import { MyClaimDetailPage } from '../../pages/my-claims/my-claim-detail';
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { MyClaimsPage } from '../../pages/my-claims/my-claims';
declare var scxmlHandler;
@Component({
  selector: 'my-claims-card',
  templateUrl: 'my-claims-card.html',

})
export class MyClaimsCardComponent {

  text: string;
  memberInfo: any;
  cardData: any;

  constructor(private authService: AuthenticationService, public config: ConfigProvider, private nav: NavController, public alertCtrl: AlertController) {

    let memberInfoResponse = authService.getMemberInfoRowSet();
    if (!memberInfoResponse['errormessage']) {

      this.memberInfo = authService.getMemberInfo();// memberInfoResponse['ROWSET'].ROWS;
      this.cardData = this.memberInfo;
    }

  }

  openPage() {
    scxmlHandler.playSoundWithHapticFeedback();
    if (this.cardData.clmStatus == 'Pending') {
      let errmsg = "Details are not available for a Pending claim";
      setTimeout(() => {
        this.showAlert('', errmsg);
      }, 300);
    } else
      this.nav.push(MyClaimDetailPage, { "cardData": this.cardData });
  }

  openMyClaims() {
    scxmlHandler.playSoundWithHapticFeedback();
    this.nav.push(MyClaimsPage);
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

}
