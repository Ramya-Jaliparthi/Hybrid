import { Component, ViewChild, OnInit, AfterViewInit, OnChanges, Renderer, Input, SimpleChanges } from '@angular/core';
import { CardContent } from 'ionic-angular';

/**
 * Generated class for the AccordionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent implements OnInit, AfterViewInit, OnChanges {

  accordionExpanded = false;
  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('expanded') expanded: boolean;
  icon: string = 'arrow-down';

  constructor(public renderer: Renderer) {
  }

  ngOnInit() {
    if (this.expanded) {
      this.accordionExpanded = true;
      this.icon = 'arrow-up';
    } else {
      this.accordionExpanded = false;
      this.icon = 'arrow-down';
    }
    this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms");
  }

  ngAfterViewInit() {
    this.toggle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.expanded && !changes.expanded.firstChange) {
      if (changes.expanded.currentValue === false) {
        this.accordionExpanded = false;
        this.toggle();      }
    }
  }

  toggleAccordion() {
    this.accordionExpanded = !this.accordionExpanded;
    this.toggle();
  }

  toggle() {
    if (this.accordionExpanded) {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "none");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "5px 15px");
      this.icon = 'arrow-up';
    } else {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "0px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "0px 15px");
      this.icon = 'arrow-down';
    }
  }

}
