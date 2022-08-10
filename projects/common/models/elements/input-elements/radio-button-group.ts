import { Type } from '@angular/core';
import { ElementFactory } from 'common/util/element.factory';
import {
  BasicStyles, InputElement, TextLabel, PositionedUIElement, PositionProperties, OptionElement
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { RadioButtonGroupComponent } from 'common/components/input-elements/radio-button-group.component';

export class RadioButtonGroupElement extends InputElement implements PositionedUIElement, OptionElement {
  options: TextLabel[] = [];
  alignment: 'column' | 'row' = 'column';
  strikeOtherOptions: boolean = false;
  position: PositionProperties;
  styling: BasicStyles & {
    lineHeight: number;
  };

  constructor(element: Partial<RadioButtonGroupElement>, ...args: unknown[]) {
    super({ height: 100, ...element }, ...args);
    if (element.options) this.options = [...element.options];
    if (element.alignment) this.alignment = element.alignment;
    if (element.strikeOtherOptions) this.strikeOtherOptions = element.strikeOtherOptions;

    this.value = element.value !== undefined ? element.value : [];

    this.position = ElementFactory.initPositionProps({ marginBottom: 30, ...element.position });
    this.styling = {
      ...ElementFactory.initStylingProps({
        backgroundColor: 'transparent',
        lineHeight: 135,
        ...element.styling
      })
    };
  }

  getElementComponent(): Type<ElementComponent> {
    return RadioButtonGroupComponent;
  }

  getNewOption(optionText: string): TextLabel {
    return { text: optionText };
  }
}
