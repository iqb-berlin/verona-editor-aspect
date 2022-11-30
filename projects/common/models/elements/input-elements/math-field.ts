import {
  AnswerScheme, InputElement, PositionProperties, UIElement
} from 'common/models/elements/element';
import { Type } from '@angular/core';
import { ElementComponent } from 'common/directives/element-component.directive';
import { MathFieldComponent } from 'common/components/input-elements/math-field.component';

export class MathFieldElement extends InputElement {
  enableModeSwitch: boolean = false;
  position: PositionProperties | undefined;

  constructor(element: Partial<MathFieldElement>) {
    super(element);
    if (element.enableModeSwitch !== undefined) this.enableModeSwitch = element.enableModeSwitch;
    this.position = element.position ? UIElement.initPositionProps(element.position) : undefined;
  }

  hasAnswerScheme(): boolean {
    return Boolean(this.getAnswerScheme);
  }

  getAnswerScheme(): AnswerScheme {
    return {
      id: this.id,
      type: 'string',
      format: '',
      multiple: false,
      nullable: !this.value && this.value !== '',
      values: [],
      valuesComplete: false
    };
  }

  getElementComponent(): Type<ElementComponent> {
    return MathFieldComponent;
  }
}
