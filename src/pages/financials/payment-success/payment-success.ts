import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MakePaymentService } from '../make-payment/make-payment-service';
import { AlertModel } from '../../../models/alert/alert.model';
import { UserContextProvider } from '../../../providers/user-context/user-context';

@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {

  public whomToPay: string;
  public whenTosubmit: string;
  public payType: string; //check or direct deposit
  public transcationData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private makePayService: MakePaymentService, private formBuilder: FormBuilder,
    private userContext: UserContextProvider) {
    // flags to identify the selected radio buttons in landing page.
    this.whomToPay = navParams.get('whomToPay');
    this.whenTosubmit = navParams.get('whenTosubmit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentSuccessPage');
    let a: AlertModel = this.prepareAlertModal();
    this.userContext.setAlerts([a]);

    this.transcationData = this.makePayService.getPaymentData();
  }

  navigateToTransactionSummary() {
    console.log('Transaction Summary not yet developed');
  }

  prepareAlertModal() {
    let a: AlertModel = new AlertModel();
    a.id = "";
    a.message = "Success!";
    a.alertFromServer = true;
    a.showAlert = true;
    a.title = "Success!";
    a.type = "info";
    a.RowNum = "";
    return a;
  }


}
