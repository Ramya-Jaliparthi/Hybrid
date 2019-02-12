import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MakePaymentService } from '../make-payment/make-payment-service';

@Component({
  selector: 'page-transcation-details',
  templateUrl: 'transcation-details.html',
})
export class TranscationDetailsPage  {


    constructor(public navCtrl: NavController, public navParams: NavParams, 
        private makePayService: MakePaymentService,
        private formBuilder: FormBuilder ) {
    }


}