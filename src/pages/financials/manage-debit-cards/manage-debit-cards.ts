import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManageCardsService } from './manage-cards-service';
import { ManageCardDetailsPage } from '../manage-card-details/manage-card-details';
import { DebitCardListRequestModelInterface } from '../modals/interfaces/manage-debit-cards.interface';
import { DebitCardListRequestModel } from '../modals/manage-debit-cards-response.model';
import { AuthenticationService } from '../../../providers/login/authentication.service';

@Component({
  selector: 'page-manage-debit-cards',
  templateUrl: 'manage-debit-cards.html',
})
export class ManageDebitCardsPage implements OnInit {

  cardLists: any;
  showMsg = '';
  notifyTextMsg = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public cardService: ManageCardsService,
    private authService: AuthenticationService) {
    this.showMsg = navParams.get('showMsg'); 'stolen'

    const debitCardListRequest: DebitCardListRequestModelInterface = new DebitCardListRequestModel;
    debitCardListRequest.useridin = this.authService.useridin;
    let reqMask = this.authService.showLoadingMask('Accessing Manage Debit Cards...');

    this.cardService.getManageDebitCardsList(debitCardListRequest, reqMask).subscribe(resp => {
      this.cardLists = resp.cardListInfo;
    });

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.notifyTextMsg = this.showMsg ? this.showMsg == 'stolen' ?
      'Your card stolen has been reported' : 'You card has been activated' : '';
  }

  navigateToCardDetailsPage(cardInfo) {
    this.navCtrl.push(ManageCardDetailsPage, { cardNum: cardInfo.cardProxyNumber });
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
