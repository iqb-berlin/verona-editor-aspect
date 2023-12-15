import { Directive, Input } from '@angular/core';
import { ElementComponent } from 'common/directives/element-component.directive';
import { UIElement } from 'common/models/elements/element';
import { ResponseValueType } from 'player/modules/verona/models/verona';
import { UnitStateService } from '../services/unit-state.service';

@Directive()
export abstract class ElementGroupDirective {
  @Input() elementModel!: UIElement;
  @Input() pageIndex!: number;
  abstract unitStateService: UnitStateService;

  registerAtUnitStateService(
    id: string, value: ResponseValueType, elementComponent: ElementComponent, pageIndex: number
  ): void {
    const elementModel = elementComponent.elementModel;
    const relevantPageIndex = elementModel.isRelevantForPresentationComplete ? pageIndex : null;
    this.unitStateService.registerElementCode(
      id, value, elementComponent.domElement, relevantPageIndex
    );
  }
}
