import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams,ModalController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AddProviderPage} from '../add-provider/add-provider';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { MakePaymentService } from '../make-payment/make-payment-service';
import { MakePaymentDetailsRequestModelInterface } from '../modals/interfaces/make-payment.interface';
import { MakePaymentDetailsRequestModel } from '../modals/make-payment-response.model';
import { ValidationProvider } from '../../../providers/validation/ValidationService';


@Component({
    selector: 'page-schedule-payment',
    templateUrl: 'schedule-payment.html',
})
export class SchedulePaymentPage {

    schedulePayForm: FormGroup;
    private paySubmitted: boolean = false;
    paymentForm: boolean;
    paymentConfirmation: boolean;

    private providerSelected: string;
    private providers: Object[];
    private reimbursmentMethods: Object[];
    private members: Object[];
    private services: Object[];
    private startDateMask: any;
    private endDateMask: any;
    memberSelectedOptions = { title: 'Member List', subTitle: '', mode: 'ios' };
    providerSelectedOptions = { title: 'Provider List', subTitle: '', mode: 'ios' };
    serviceTypeSelectedOptions = { title: 'Service Types', subTitle: '', mode: 'ios' };
    reimbursementSelectedOptions = { title: 'Reimbursement Types', subTitle: '', mode: 'ios' };
    // private onServiceEndDateBlur:boolean;

    // amountMessages = {
    //   'required': 'You must enter a valid amount.',
    //   'invalidAmount': 'You must enter a valid amount.',
    // };

    // serviceTypeMessages = {
    //   'required': 'Please make a selection',
    // };

    // memberMessages = {
    //   'required': 'Please select a member',
    // };

    // reimbursmentMessages = {
    //   'required': 'Please select a Reimbursment method'
    // };

    // serviceStartDateMessages = {
    //   'required': 'Start Date is required.',
    //   'invalidDate': 'Please enter date in the format of MM/DD/YYYY.',
    // };

    // serviceEndDateMessages = {
    //   'required': 'End Date is required.',
    //   'invalidDate': 'Please enter date in the format of MM/DD/YYYY.',
    //   'invalidEndDate': 'End Date may not be before the Start Date.',
    // };


    constructor(public navCtrl: NavController, public navParams: NavParams,private makePayService: MakePaymentService,
        public validationService: ValidationProvider, private formBuilder: FormBuilder, 
        private authService: AuthenticationService, public modalCtrl: ModalController) {
        console.log('inside MakePaymentPage');
        this.schedulePayForm = this.formBuilder.group({
            selectProvider: ['', Validators.compose([this.validationService.requiredMemberMessage])],
            serviceTypeProvider: ['', Validators.compose([this.validationService.requiredServiceMessage])],
            reimbursmentAmount: ['', Validators.compose([ValidationProvider.paymentAmountValidator])],
            reimbursmentMethord: ['', [Validators.required]],
            provider: ['', [Validators.required]],
            billedAmount: ['', Validators.compose([ValidationProvider.paymentAmountValidator])],
            allowedInsuranceAmount: ['', Validators.compose([ValidationProvider.paymentAmountValidator])],
            insurancePaidAmount: ['', Validators.compose([ValidationProvider.paymentAmountValidator])],
            nonReimbursableAmount: ['', Validators.compose([ValidationProvider.paymentAmountValidator])],
            serviceStartDate: ['', Validators.compose([ValidationProvider.startDateValidator])],
            serviceEndDate: ['', Validators.compose([ValidationProvider.endDateValidator])],
            myResponsiblity: ['', []],
            reimbursedMyAccount: ['', []],
            whatYouOwe: ['', []]
            // providerAccountNumber: ['', []],
            // reimbursment: ['', []],
            // paymentAmount: ['', [Validators.required]],
            // member: ['', [Validators.required]],
            // serviceType: ['', [Validators.required]],

            // userComments: ['', []],
            // paymentReciept: ['', [Validators.required]],
        });

        const makePaymentRequest: MakePaymentDetailsRequestModelInterface = new MakePaymentDetailsRequestModel();
        makePaymentRequest.useridin = this.authService.useridin;
        let reqMask = this.authService.showLoadingMask('Accessing Make Payment Details...');
        this.makePayService.getMakePaymentFormDetails(makePaymentRequest, reqMask).subscribe(resp => {
    
          this.providers = [{ providerName: 'Provider 1' }, { providerName: 'Provider 2' }];
          this.reimbursmentMethods = resp.reimbursementMethodList;
          this.services = resp.serviceTypeCodes;
          this.members = resp.membersList.map(member => {
            console.log(this.providers);
            console.log(this.reimbursmentMethods);
            console.log(this.members);
            console.log(this.services);
            return { memberName: member.firstName + " " + member.lastName }
          });
        //   this.disclosure = resp.disclosure;
        //   this.reimbursmentAgreement = resp.reimburseAgreement;
        });
        // this.providers = [{providerName: 'Provider1'}, {providerName: 'Provider2'}, {providerName: 'Provider3'}];
        // this.reimbursmentMethods = [{methodName: 'Provider1'}, {methodName: 'Provider2'}, {methodName: 'Provider3'}];
        // this.members = [{memberName: 'member1'}, {memberName: 'member2'}, {memberName: 'member3'}];
        // this.services = [{serviceName: 'service1'}, {serviceName: 'service2'}, {serviceName: 'member3'}];

        this.paymentForm = false;
        this.paymentConfirmation = true;
        this.startDateMask = ValidationProvider.dobMask;
        this.endDateMask = ValidationProvider.dobMask;
        // this.onServiceEndDateBlur=false;


    }

    logForm() {
        console.log(this.schedulePayForm.value)
    }

    submitPayment() {
        this.schedulePayForm.get('serviceTypeProvider').setValidators(Validators.required);
        this.paySubmitted = true;
    }


    navigateToAddProviderForm() {
        this.navCtrl.push(AddProviderPage);
    }
}

