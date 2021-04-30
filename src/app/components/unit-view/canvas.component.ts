import {
  Component, ComponentFactoryResolver, ElementRef, Input, OnDestroy, ViewChild, ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ButtonElement, LabelElement, TextFieldElement, UnitPage, UnitUIElement
} from '../../model/unit';
import { ButtonComponent } from './unit-view-components/button.component';
import { UnitService } from '../../unit.service';
import { LabelComponent } from './unit-view-components/label.component';
import { TextFieldComponent } from './unit-view-components/text-field.component';
import { ElementComponent } from './element.component';

@Component({
  selector: 'app-unit-view-canvas',
  template: `
    <app-canvas-toolbar></app-canvas-toolbar>
    <div class="canvasFrame" fxLayoutAlign="center center">
      <div #canvas
           class="elementCanvas"
           [style.width.px]="page.width"
           [style.height.px]="page.height"
           [style.background-color]="page.backgroundColor">
        <template #elementContainer></template>
      </div>
    </div>
    `,
  styles: [
    '.canvasFrame {background-color: lightgrey; padding: 15px}',
    '.elementCanvas {overflow: auto}'
  ]
})
export class UnitCanvasComponent implements OnDestroy {
  @Input() page!: UnitPage;

  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('elementContainer', { read: ViewContainerRef }) elementContainer: any;

  newElementSubscription: Subscription;
  pageSelectedSubscription: Subscription;
  propertyChangeSubscription: Subscription;

  selectedElements: ElementComponent[];

  constructor(public unitService: UnitService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.newElementSubscription = this.unitService.newElement.subscribe(elementType => {
      this.addElement(elementType);
    });
    this.pageSelectedSubscription = this.unitService.pageSelected.subscribe((page: UnitPage) => {
      this.clearElements();
      this.page = page;
      this.renderPage();
    });
    this.propertyChangeSubscription = this.unitService.propertyChanged.subscribe(() => {
      this.selectedElements.forEach(element => {
        element.updateStyle();
      });
    });
    this.selectedElements = [];
  }

  private renderPage() {
    for (const element of this.page.elements) {
      this.addElement(element);
    }
  }

  addElement(element: UnitUIElement): void {
    let componentFactory;
    if (element instanceof LabelElement) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(LabelComponent);
    } else if (element instanceof ButtonElement) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(ButtonComponent);
    } else if (element instanceof TextFieldElement) {
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextFieldComponent);
    } else {
      console.error('unknown element: ', element);
      return;
    }
    const componentRef = this.elementContainer.createComponent(componentFactory);
    componentRef.instance.elementModel = element;
    componentRef.instance.canvasSize = [this.page.width, this.page.height];
    componentRef.instance.elementSelected.subscribe((event: { componentElement: ElementComponent, multiSelect: boolean }) => {
      // console.log('ev', event);
      if (!event.multiSelect) {
        this.clearSelection();
      }
      this.selectedElements.push(event.componentElement);
      event.componentElement.selected = true;
      this.unitService.elementSelected.next(event.componentElement.elementModel);
    });
  }

  private clearElements() {
    this.elementContainer.clear();
  }

  private clearSelection() {
    for (const element of this.selectedElements) {
      element.selected = false;
    }
  }

  ngOnDestroy(): void {
    this.newElementSubscription.unsubscribe();
    this.pageSelectedSubscription.unsubscribe();
  }
}
