import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MakePaymentService } from '../make-payment/make-payment-service';
import { PaymentSuccessPage } from '../payment-success/payment-success';

@Component({
  selector: 'page-payment-save',
  templateUrl: 'payment-save.html',
})
export class PaymentSavePage {

  public whomToPay: string;
  public isRecieptUploaded: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private makePayService: MakePaymentService, private formBuilder: FormBuilder) {
    // flags to identify the selected radio buttons in landing page.
    this.whomToPay = navParams.get('whomToPay');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentSavePage');
  }

  // after edit payment button
  navigateBackToMakePayment() {
    this.navCtrl.pop();
  }

  // after submit payment button
  navigateToPaymentSuccess() {
    this.navCtrl.push(PaymentSuccessPage, {
      'whomToPay': this.whomToPay
    });
  }


}
