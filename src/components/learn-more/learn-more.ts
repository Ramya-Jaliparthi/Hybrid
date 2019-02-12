import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'learn-more',
  templateUrl: 'learn-more.html'
})
export class LearnMoreComponent {

  private pageName: String;
  private titleName: any;
  private fromPage: String;

  constructor(public navCtrl: NavController, public navParam: NavParams) {
    console.log('Learn more Component');
    this.pageName = navParam.get("pageName");
    this.fromPage = navParam.get("fromPage");
    if (this.pageName == "MarketingCommLearnMore") {
      // this.titleName = "Marketing Co...";
      this.titleName = "Learn More";
    }
    if (this.fromPage == "preferenceSettings") {
      this.titleName = "Settings";
    }
  }
  
  goBack(){
    this.navCtrl.pop();
  }
}
