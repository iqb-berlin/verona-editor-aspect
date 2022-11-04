import { Type } from '@angular/core';
import {
  BasicStyles,
  InputAssistancePreset,
  InputElement,
  PositionedUIElement,
  PositionProperties, AnswerScheme, UIElement
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { SpellCorrectComponent } from 'common/components/input-elements/spell-correct.component';

export class SpellCorrectElement extends InputElement implements PositionedUIElement {
  inputAssistancePreset: InputAssistancePreset = null;
  inputAssistanceCustomKeys: string = '';
  inputAssistancePosition: 'floating' | 'right' = 'floating';
  restrictedToInputAssistanceChars: boolean = true;
  hasArrowKeys: boolean = false;
  showSoftwareKeyboard: boolean = false;
  softwareKeyboardShowFrench: boolean = false;
  position: PositionProperties;
  styling: BasicStyles;

  constructor(element: Partial<SpellCorrectElement>) {
    super({ width: 230, height: 80, ...element });
    if (element.inputAssistancePreset) this.inputAssistancePreset = element.inputAssistancePreset;
    if (element.inputAssistanceCustomKeys !== undefined) {
      this.inputAssistanceCustomKeys = element.inputAssistanceCustomKeys;
    }
    if (element.inputAssistancePosition) this.inputAssistancePosition = element.inputAssistancePosition;
    if (element.restrictedToInputAssistanceChars !== undefined) {
      this.restrictedToInputAssistanceChars = element.restrictedToInputAssistanceChars;
    }
    if (element.hasArrowKeys) this.hasArrowKeys = element.hasArrowKeys;
    if (element.showSoftwareKeyboard) this.showSoftwareKeyboard = element.showSoftwareKeyboard;
    if (element.softwareKeyboardShowFrench) this.softwareKeyboardShowFrench = element.softwareKeyboardShowFrench;
    this.position = UIElement.initPositionProps(element.position);
    this.styling = {
      ...UIElement.initStylingProps({ backgroundColor: 'transparent', ...element.styling })
    };
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
      nullable: true,
      values: [],
      valuesComplete: false
    };
  }

  getElementComponent(): Type<ElementComponent> {
    return SpellCorrectComponent;
  }
}
