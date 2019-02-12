import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AddProviderPage } from '../add-provider/add-provider';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { MakePaymentService } from './make-payment-service';
import { MakePaymentDetailsRequestModelInterface } from '../modals/interfaces/make-payment.interface';
import { MakePaymentDetailsRequestModel } from '../modals/make-payment-response.model';
import { ValidationProvider } from '../../../providers/validation/ValidationService';
import { AlegeusTermsPage } from '../alegeus-terms/alegeus-terms';
import { ConstantsService } from '../../../providers/constants/constants.service';
import { ManageBankAccPage } from '../manage-bank-accounts/manage-bank-account';
import { PaymentSuccessPage } from '../payment-success/payment-success';
import { TranscationDetailsPage } from '../transcation-details/transcation-details';
import { PaymentSavePage } from '../payment-save/payment-save';
import { MakePaymentLandingPage } from '../make-payment-landing/make-payment-landing';

declare var scxmlHandler: any;
@Component({
  selector: 'page-make-payment',
  templateUrl: 'make-payment.html',
})
export class MakePaymentPage {

  private makePayForm: FormGroup;
  private paySubmitted: boolean = false;
  private paymentForm: boolean;
  private paymentConfirmation: boolean;
  private providerSelected: string;

  private reimbursmentAgreement: string;
  private providers: Object[];
  private reimbursmentMethods: Object[];
  private members: Object[];
  private services: Object[];
  private disclosure: string;
  private agreeText: string = 'By clikcing "Submit", I agree that these expenses have been incurred by me, my spouse or my eligible dependents and I agree to the';
  private startDateMask: any;
  memberSelectedOptions = { subTitle: '', title: 'Member List' };
  providerSelectedOptions = { subTitle: '', title: 'Provider List' };
  serviceTypeSelectedOptions = { subTitle: '', title: 'Service List' };
  reimbursementSelectedOptions = { subTitle: '', title: 'Reimbursment List' };
  whenTosubmit: string;
  whomToPay: string;
  isUserAddedAccount: boolean; // user clicked on add a bank account
  showMoreThan1Day: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private makePayService: MakePaymentService,
    private formBuilder: FormBuilder, private authService: AuthenticationService, public modalCtrl: ModalController,
    private actionsheetCtrl: ActionSheetController) {
    // flags to identify the selected radio buttons in landing page.
    this.whomToPay = navParams.get('whomToPay');
    this.whenTosubmit = navParams.get('whenTosubmit');

    this.makePayForm = this.formBuilder.group({
      member: ['', Validators.compose([Validators.required])],
      selectProvider: ['', Validators.compose([])], //required for pay a provider only
      reimbursment: ['', Validators.compose([Validators.required])], // for pay myself only
      accountNumber: ['', Validators.compose([])], // for pay a provider only
      paymentAmount: ['', Validators.compose([Validators.required])],
      serviceType: ['', Validators.compose([Validators.required])],
      serviceStartDate: ['', Validators.compose([Validators.required, ValidationProvider.startDateValidator])],
      serviceEndDate: ['', Validators.compose([Validators.required, ValidationProvider.endDateValidator])], // in case morethan1day true
      userComments: ['', Validators.compose([Validators.maxLength(255)])],
      recieptImage: ['', Validators.compose([Validators.required])],
    });

    const makePaymentRequest: MakePaymentDetailsRequestModelInterface = new MakePaymentDetailsRequestModel();
    makePaymentRequest.useridin = this.authService.useridin;
    let reqMask = this.authService.showLoadingMask('Accessing Make Payment Details...');

    this.makePayService.getMakePaymentFormDetails(makePaymentRequest, reqMask).subscribe(resp => {
      this.providers = [{ providerName: 'Provider 1' }, { providerName: 'Provider 2' }];
      this.reimbursmentMethods = resp.reimbursementMethodList;
      this.services = resp.serviceTypeCodes;
      this.members = resp.membersList.map(member => {
        return { memberFullName: member.firstName + " " + member.lastName }
      });
      this.disclosure = resp.disclosure;
      this.reimbursmentAgreement = resp.reimburseAgreement;

      console.log(this.providers);
      console.log(this.reimbursmentMethods);
      console.log(this.members);
      console.log(this.services);
    });

    this.startDateMask = ValidationProvider.dobMask;
    this.paymentForm = false;
    this.paymentConfirmation = true;
    // this.subscribeToOnChangeEvents();
  }

  subscribeToOnChangeEvents() {
    this.makePayForm.get('whomToPay').valueChanges.subscribe((whomToPayValue) => {
      // console.log(this.makePayForm.get('whomToPay'));
      const reimbursmentMethodControl = this.makePayForm.get('reimbursment');
      const selectProviderControl = this.makePayForm.get('selectProvider');

      if (whomToPayValue === 'payProvider') {
        reimbursmentMethodControl.setValue('Check', { emitEvent: false });
        reimbursmentMethodControl.disable({ emitEvent: false });

        selectProviderControl.enable({ emitEvent: false });
        selectProviderControl.setValidators([Validators.required]);
      } else {
        reimbursmentMethodControl.setValue('', { emitEvent: true });
        reimbursmentMethodControl.enable({ emitEvent: false });

        selectProviderControl.reset();
        selectProviderControl.disable({ emitEvent: false });
        selectProviderControl.clearValidators();
      }
      selectProviderControl.setValue('', { emitEvent: true });
    });

    // this.payForm.get('serviceEndDate').valueChanges.subscribe(() => {
    //   this.dateComparison();
    // });
    // this.payForm.get('serviceStartDate').valueChanges.subscribe(() => {
    //   this.dateComparison();
    // });
  }

  submitPayment() {
    console.log(this.makePayForm.value);
    //this.makePayService.setPaymentData(this.makePayForm.value);
    // if(this.makePayForm.valid) {
      if(this.whenTosubmit === 'Later') {
        this.navCtrl.push(PaymentSavePage, {
          'whomToPay': this.whomToPay, 'whenTosubmit': this.whenTosubmit
        });
      } else {
        this.navCtrl.push(PaymentSuccessPage, {
          'whomToPay': this.whomToPay, 'whenTosubmit': this.whenTosubmit
        });
      }
    
    // }
    this.paySubmitted = true;
  }

  navigateToAddProviderForm() {
    this.navCtrl.push(AddProviderPage, {
      'whomToPay': this.whomToPay,
      'whenTosubmit': this.whenTosubmit
  });
  }

  navigateToAddBankAccount() {
    this.navCtrl.push(ManageBankAccPage);
    this.isUserAddedAccount = true;
  }

  showServiceEndDate() {
    this.showMoreThan1Day = true;
  }

  // clearAllFields() {
  //   //const defaultMember = this.members && this.members[0] ? this.members[0].memberName : '';
  //   this.makePayForm.reset();
  // }

  navigateToAlegeusTermsPage() {
    let etarget = 'MyPlan.InformationIconModal';
    let edataobj = { "context": "action" };
    scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
    scxmlHandler.playSoundWithHapticFeedback();
    this.navCtrl.push(AlegeusTermsPage, { agreementText: this.disclosure });
  }

  takeOrUploadReciept() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Add Reciept Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          icon: 'camera',
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: 'images',
          handler: () => {
            this.captureImage(true);
          }
        },
      ]
    });
    actionSheet.present();
  }

  captureImage(useAlbum: boolean) {
    console.log('Functionality captureImage not developed ');
  }

  clearAllFields() {
    try {
        this.navCtrl.push(MakePaymentLandingPage);
    } catch (exception) {

    }
}

}
