import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../../providers/validation/ValidationService';
import { MakePaymentPage } from '../make-payment/make-payment';
import { FinancialLandingPage } from '../financial-landing/financial-landing';


@Component({
    selector: 'page-make-payment-landing',
    templateUrl: 'make-payment-landing.html',
})
export class MakePaymentLandingPage {

    private makePayForm: FormGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private formBuilder: FormBuilder) {
        // build form
        this.makePayForm = this.formBuilder.group({
            whomToPay: ['Myself', Validators.compose([Validators.required])],
            whenTosubmit: ['Now', Validators.compose([Validators.required])]
        });
    }

    clearAllFields() {
        try {
            this.navCtrl.push(FinancialLandingPage);
        } catch (exception) {

        }
    }

    navigateToNextPage() {
        try {
            this.navCtrl.push(MakePaymentPage, {
                whomToPay: this.makePayForm.value.whomToPay,
                whenTosubmit: this.makePayForm.value.whenTosubmit
            });

        } catch (exception) {

        }
    }

}