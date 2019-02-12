import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CardConfig } from '../../components/dashboard-card/card-config';
import { CardProvider } from '../../providers/card/card';
import { reorderArray } from 'ionic-angular';
import { LoginState } from '../../providers/user-context/user-context';
import { MessageProvider } from '../../providers/message/message';

declare var scxmlHandler: any;
declare var evaSecureStorage: any;
@Component({
  selector: 'page-card-personalize',
  templateUrl: 'card-personalize.html',
})
export class CardPersonalizePage {

  cards: Array<CardConfig>;
  constructor(
    public navCtrl: NavController,
    cardProvider: CardProvider,
    private messageProvider: MessageProvider) {
    this.cards = cardProvider.getCardConfig(LoginState.LoggedIn);
  }

  ionViewDidLoad() {
  }

  reorderItems(indexes) {
    console.log(this.cards);
    this.cards = reorderArray(this.cards, indexes);
  }

  savePersonalization() {
    scxmlHandler.playSoundWithHapticFeedback();
    evaSecureStorage.setItem("DashboardCards", JSON.stringify(this.cards));
    this.messageProvider.sendMessage('PersonalizeCards', this.cards);
    this.navCtrl.popToRoot();
  }

}
