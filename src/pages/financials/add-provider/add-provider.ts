import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationProvider } from '../../../providers/validation/ValidationService';
import { ConstantsService } from '../../../providers/constants/constants.service';
import { MakePaymentPage } from '../../financials/make-payment/make-payment';
@Component({
  selector: 'page-add-provider',
  templateUrl: 'add-provider.html',
})
export class AddProviderPage {

  private addProviderForm: FormGroup;
  private providerAdded: boolean = false;
  private stateList: Object[];
  private stateSelectedOptions = { title: 'State List', subTitle: '', mode: 'ios' };
  private onProviderName: boolean = false;
  private onAddLine1Blur: boolean = false;
  private onAddLine2Blur: boolean = false;
  private onCityBlur: boolean = false;
  private onZipCodeBlur: boolean = false;
  private onPhNbrBlur: boolean = false;
  public whomToPay: string;
  public whenTosubmit: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private validationProvider: ValidationProvider) {

    this.whomToPay = navParams.get('whomToPay');
    this.whenTosubmit = navParams.get('whenTosubmit');

    this.addProviderForm = this.formBuilder.group({
      providerName: ['', Validators.compose([ValidationProvider.requiredproviderName, ValidationProvider.alphaStringValidator])],
      providerAddress1: ['', Validators.compose([ValidationProvider.requiredProviderAddress,
      ValidationProvider.requiredProviderAddressMaxLength, ValidationProvider.mailingAddressValidator])],
      providerAddress2: ['', []],
      providerCity: ['', Validators.compose([ValidationProvider.requiredCity, ValidationProvider.alphaStringValidator])],
      providerState: ['', Validators.compose([ValidationProvider.requiredProviderState])],
      providerZipCode: ['', Validators.compose([ValidationProvider.requiredZipcode, ValidationProvider.zipCodeMinlength,
      ValidationProvider.zipCodeMaxlength])],
      providerPhoneNumber: ['', Validators.compose([ValidationProvider.phNbrMaxlength,
      ValidationProvider.mobileNumberValidatorForProfile])]
    });

    this.stateList = ConstantsService.SATES;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProviderPage');
  }

  submitAProvider() {
    console.log(this.addProviderForm.value);
    this.providerAdded = true;
  }

  clearAllFields() {
    try {
      this.navCtrl.push(MakePaymentPage, {
        whomToPay: this.whomToPay,
        whenTosubmit: this.whenTosubmit
      });
    } catch (exception) {

    }
  }

}
