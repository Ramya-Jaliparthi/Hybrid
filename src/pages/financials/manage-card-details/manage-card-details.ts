import { Component, OnInit } from '@angular/core';
import { ManageCardsService } from '../manage-debit-cards/manage-cards-service';
import { NavController, NavParams } from 'ionic-angular';
import { ManageDebitCardsPage } from '../manage-debit-cards/manage-debit-cards';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DebitCardDetailsRequestModelInterface, DebitCardPinRequestModelInterface } from '../modals/interfaces/manage-debit-cards.interface';
import { DebitCardDetailsRequestModel } from '../modals/manage-debit-cards-response.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';

@Component({
  selector: 'page-card-details',
  templateUrl: 'manage-card-details.html',
})
export class ManageCardDetailsPage implements OnInit {

  public cardDetails: any;
  public fourDigitPIN: string;
  public selectedCardProxyNumber: string = '';
  public pinToggle: boolean = false;
  public showLostReport: boolean;
  public isActive: boolean;
  public stolenForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cardService: ManageCardsService, private formBuilder: FormBuilder, private authService: AuthenticationService) {

    this.selectedCardProxyNumber = this.navParams.get('cardNum');
    // build form
    this.stolenForm = this.formBuilder.group({
      sendCard: [false, Validators.compose([Validators.required])]
    });

    const debitCardDetailsRequest: DebitCardDetailsRequestModelInterface = new DebitCardDetailsRequestModel();
    debitCardDetailsRequest.useridin = this.authService.useridin;
    debitCardDetailsRequest.cardProxyNumber = this.selectedCardProxyNumber;
    let reqMask = this.authService.showLoadingMask('Accessing your Debit Card\'s Details...');
    console.log(`selectedCardProxyNumber - ${this.selectedCardProxyNumber}`);

    this.cardService.getManageDebitCardDetails(debitCardDetailsRequest, reqMask).subscribe(resp => {
      let card = resp.cardDetailsInfo;
      this.cardDetails = card.filter((item) => item.cardProxyNumber === this.selectedCardProxyNumber);
      console.table(this.cardDetails);
    });

  }

  ngOnInit() {
    this.showLostReport = this.isActive = false;
    // this.cardDetails = this.cardDetails.filter((item) => item.accNbr === this.selectedCardNum);
  }

  // calling PIN API for 4 digit card pin code
  togglePin() {

    const debitCardPinRequest: DebitCardPinRequestModelInterface = new DebitCardDetailsRequestModel();
    debitCardPinRequest.useridin = this.authService.useridin;
    //debitCardPinRequest.cardProxyNumber = this.selectedCardNum;
    let reqMask = this.authService.showLoadingMask('Accessing your Debit Card\'s PIN...');

    this.cardService.getManageDebitCardPin(debitCardPinRequest, reqMask).subscribe(resp => {
      this.fourDigitPIN = resp.cardPin;
    });

    this.pinToggle = !this.pinToggle;
  }

  lostReport() {
    this.showLostReport = true;
  }

  activateCard() {
    this.isActive = true;
  }

  reqToActivate() {
    // To Do implement service call.
    this.navigateToLandingPage('activate');
  }

  navigateToLandingPage(flag) {
    this.navCtrl.push(ManageDebitCardsPage, {
      'showMsg': flag
    });
  }

  reportToStolen() {
    // To Do implement service call.
    this.navigateToLandingPage('stolen');
  }

  getCardStatus(codes: number) {
    let cardStatus: string;

    switch (codes) {
      case 1: {
        cardStatus = 'New';
        break;
      }
      case 2: {
        cardStatus = 'Active';
        break;
      }
      case 3: {
        cardStatus = 'Temporarily Inactive';
        break;
      }
      case 4: {
        cardStatus = 'Permanently Inactive';
        break;
      }
      default: cardStatus = 'Lost/Stolen';
    }
    return cardStatus;
  }

}
