import {
  Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { UnitPageSection, UnitUIElement } from '../../../common/unit';
import * as ComponentUtils from '../../../common/component-utils';

@Component({
  selector: 'app-section',
  template: `
    <div fxLayout="column">
        <ng-template #elementContainer></ng-template>
    </div>
    `,
  styles: [
    'div {position: absolute}'
  ]
})
export class SectionComponent implements OnInit {
  @Input() section!: UnitPageSection;
  @ViewChild('elementContainer', { read: ViewContainerRef, static: true }) private elementContainer!: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.renderSection();
  }

  private renderSection() {
    this.section.elements.forEach((element: UnitUIElement) => {
      this.createSectionElement(element);
    });
  }

  private createSectionElement(element: UnitUIElement): void {
    const componentFactory = ComponentUtils.getComponentFactory(element.type, this.componentFactoryResolver);
    const componentRef = this.elementContainer.createComponent(componentFactory);
    componentRef.instance.elementModel = element;
    componentRef.instance.updateStyle({
      position: 'absolute',
      top: `${element.yPosition}px`,
      left: `${element.xPosition}px`
    });
  }
}
