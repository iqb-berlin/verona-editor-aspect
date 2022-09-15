import { Type } from '@angular/core';
import { ElementFactory } from 'common/util/element.factory';
import {
  BasicStyles, InputElement, TextLabel, PositionedUIElement, PositionProperties, OptionElement,
  AnswerScheme, AnswerSchemeValue
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { DropdownComponent } from 'common/components/input-elements/dropdown.component';

export class DropdownElement extends InputElement implements PositionedUIElement, OptionElement {
  options: TextLabel[] = [];
  allowUnset: boolean = false;
  position: PositionProperties;
  styling: BasicStyles;

  constructor(element: Partial<DropdownElement>) {
    super({ width: 240, height: 83, ...element });
    if (element.options) this.options = [...element.options];
    if (element.allowUnset) this.allowUnset = element.allowUnset;
    this.position = ElementFactory.initPositionProps(element.position);
    this.styling = {
      ...ElementFactory.initStylingProps(element.styling)
    };
  }

  hasAnswerScheme(): boolean {
    return Boolean(this.getAnswerScheme);
  }

  getAnswerScheme(): AnswerScheme {
    return {
      id: this.id,
      type: 'integer',
      format: '',
      multiple: false,
      nullable: this.allowUnset,
      values: this.getAnswerSchemeValues(),
      valuesComplete: true
    };
  }

  private getAnswerSchemeValues(): AnswerSchemeValue[] {
    return this.options
      .map((option, index) => ({ value: (index + 1).toString(), label: option.text }));
  }

  getElementComponent(): Type<ElementComponent> {
    return DropdownComponent;
  }

  getNewOptionLabel(optionText: string): TextLabel {
    return ElementFactory.createOptionLabel(optionText) as TextLabel;
  }
}
