import { Component,Input } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { AlertModel } from '../../models/alert/alert.model';

declare var scxmlHandler: any;
@Component({
  selector: 'alert-message-card',
  templateUrl: 'alert-message-card.html'
})
export class AlertMessage {

 @Input() showAlert: boolean;
 @Input() title: string;
 @Input() message: string;
 @Input() type: string ="info";     //Type can be info(green), promo(blue), error(orange). 
 @Input() alert: any;
 @Input() hideCloseButton: boolean = false;
  //showAlert:boolean = false;
  alerts : Array<any>; 
  constructor(public messageProvider : MessageProvider,) {
   
  }  

  closeMessageCard(alert: AlertModel){
    scxmlHandler.playSoundWithHapticFeedback();
    //this.type="info";
    alert.showAlert=false;    
    console.log("closeMessageCard :: end" + alert);
    console.log(alert);    
  }
 
}