import { AuthenticationService } from './../../providers/login/authentication.service';
import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { App } from 'ionic-angular';
import { CardConfig } from './card-config';
import { CardDirective } from './card-directive';
import { ComponentRegistryProvider } from '../../providers/component-registry/component-registry';
import { MyFinancialService } from '../../pages/my-financial/my-financial-service';
declare var scxmlHandler;
@Component({
  selector: 'dashboard-card',
  templateUrl: 'dashboard-card.html'
})
export class DashboardCardComponent implements OnInit {

  @Input() card: CardConfig;
  @ViewChild(CardDirective) cardHost: CardDirective;
  containerRef: any;
  constructor(public appCtrl: App, private componentFactoryResolver: ComponentFactoryResolver, private componentRegistry: ComponentRegistryProvider, public authService: AuthenticationService, private MyFinancialService: MyFinancialService) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentRegistry.getComponent(this.card.component));

    let viewContainerRef = this.cardHost.viewContainerRef;
    viewContainerRef.clear();

    this.containerRef = viewContainerRef.createComponent(componentFactory);
  }

  openCardApp(entryPage) {
    scxmlHandler.playSoundWithHapticFeedback();
    console.log("data param : ", this.containerRef._component.cardData);
    if (entryPage != "" && entryPage != 'MyFinancialPage'){
      this.appCtrl.getRootNavs()[0].push(this.componentRegistry.getComponent(entryPage), { "cardData": this.containerRef._component.cardData });
    } else if(entryPage == "MyFinancialPage"){
      this.myFinancialSso();
    }
    else
      console.log('entryPage not defined for this card');
      //this.appCtrl.getRootNavs()[0].push(this.componentRegistry.getComponent(entryPage), { "cardData": this.containerRef._component.cardData });
  }

  myFinancialSso(){
    setTimeout(() => {
      console.log(this.authService.loginResponse);
      let url = "";
      if(this.authService.loginResponse.isHEQ == "true"){
        url= this.authService.configProvider.getProperty("heqSso");
      }else{
        url= this.authService.configProvider.getProperty("alegeusSso");
      }
      let myFinancialUrl: string = this.authService.configProvider.getProperty("loginUrl") + url;
      this.MyFinancialService.alegeusReq(myFinancialUrl).
        subscribe(response => {
          if (response.result && !(response.result === 0)) {
            let data = this.authService.handleDecryptedResponse(response);
            let url= data.samlUrl;
            let req = {NameValue : data.samlValue}
            scxmlHandler.postNewindow(url, "My Financials", req);             
          }  
        }, error => {
          this.authService.showAlert('', 'This feature is not available at the moment. Please try again later.');
        }  
        );
    }, 500); 
    }

}
