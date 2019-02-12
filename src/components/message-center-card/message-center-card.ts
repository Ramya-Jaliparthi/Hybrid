import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { App } from 'ionic-angular';
import { CardConfig } from '../dashboard-card/card-config';
import { CardDirective } from '../dashboard-card/card-directive';
import { ComponentRegistryProvider } from '../../providers/component-registry/component-registry';
declare var scxmlHandler;
@Component({
  selector: 'message-center-card',
  templateUrl: 'message-center-card.html'
})
export class MessageCenterCardComponent implements OnInit {

  @Input() card: CardConfig;
  @ViewChild(CardDirective) cardHost: CardDirective;
  containerRef: any;
  constructor(public appCtrl: App, private componentFactoryResolver: ComponentFactoryResolver, private componentRegistry: ComponentRegistryProvider) {
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
    if (entryPage != "")
      this.appCtrl.getRootNavs()[0].push(this.componentRegistry.getComponent(entryPage), { "cardData": this.containerRef._component.cardData });
    else
      console.log('entryPage not defined for this card');
  }


}
