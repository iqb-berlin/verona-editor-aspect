import { Type } from '@angular/core';
import {
  PositionedUIElement, TextInputElement, TextInputElementProperties, UIElementType
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { TextFieldComponent } from 'common/components/input-elements/text-field.component';
import { AnswerScheme } from 'common/models/elements/answer-scheme-interfaces';
import {
  BasicStyles, PositionProperties, PropertyGroupGenerators, PropertyGroupValidators
} from 'common/models/elements/property-group-interfaces';
import { environment } from 'common/environment';
import { InstantiationEror } from 'common/util/errors';

export class TextFieldElement extends TextInputElement implements PositionedUIElement, TextFieldProperties {
  type: UIElementType = 'text-field';
  appearance: 'fill' | 'outline' = 'outline';
  minLength: number | null = null;
  minLengthWarnMessage: string = 'Eingabe zu kurz';
  maxLength: number | null = null;
  maxLengthWarnMessage: string = 'Eingabe zu lang';
  isLimitedToMaxLength: boolean = false;
  pattern: string | null = null;
  patternWarnMessage: string = 'Eingabe entspricht nicht der Vorgabe';
  hasKeyboardIcon: boolean = false;
  clearable: boolean = false;
  position: PositionProperties;
  styling: BasicStyles & {
    lineHeight: number;
  };

  constructor(element?: TextFieldProperties) {
    super(element);
    if (element && isValid(element)) {
      this.appearance = element.appearance;
      this.minLength = element.minLength;
      this.minLengthWarnMessage = element.minLengthWarnMessage;
      this.maxLength = element.maxLength;
      this.maxLengthWarnMessage = element.maxLengthWarnMessage;
      this.isLimitedToMaxLength = element.isLimitedToMaxLength;
      this.pattern = element.pattern;
      this.patternWarnMessage = element.patternWarnMessage;
      this.clearable = element.clearable;
      this.hasKeyboardIcon = element.hasKeyboardIcon;
      this.position = { ...element.position };
      this.styling = { ...element.styling };
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationEror('Error at TextField instantiation', element);
      }
      if (element?.appearance) this.appearance = element.appearance;
      if (element?.minLength) this.minLength = element.minLength;
      if (element?.minLengthWarnMessage) this.minLengthWarnMessage = element.minLengthWarnMessage;
      if (element?.maxLength) this.maxLength = element.maxLength;
      if (element?.maxLengthWarnMessage) this.maxLengthWarnMessage = element.maxLengthWarnMessage;
      if (element?.isLimitedToMaxLength) this.isLimitedToMaxLength = element.isLimitedToMaxLength;
      if (element?.pattern) this.pattern = element.pattern;
      if (element?.patternWarnMessage) this.patternWarnMessage = element.patternWarnMessage;
      if (element?.clearable) this.clearable = element.clearable;
      if (element?.hasKeyboardIcon) this.hasKeyboardIcon = element.hasKeyboardIcon;
      this.dimensions = PropertyGroupGenerators.generateDimensionProps({
        width: 180,
        height: 120,
        ...element?.dimensions
      });
      this.position = PropertyGroupGenerators.generatePositionProps(element?.position);
      this.styling = {
        ...PropertyGroupGenerators.generateBasicStyleProps(element?.styling),
        lineHeight: element?.styling?.lineHeight || 135
      };
    }
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
    return TextFieldComponent;
  }

  getDuplicate(): TextFieldElement {
    return new TextFieldElement(this);
  }
}

export interface TextFieldProperties extends TextInputElementProperties {
  appearance: 'fill' | 'outline';
  minLength: number | null;
  minLengthWarnMessage: string;
  maxLength: number | null;
  maxLengthWarnMessage: string;
  isLimitedToMaxLength: boolean;
  pattern: string | null;
  patternWarnMessage: string;
  hasKeyboardIcon: boolean;
  clearable: boolean;
  position: PositionProperties;
  styling: BasicStyles & {
    lineHeight: number;
  };
}

function isValid(blueprint?: TextFieldProperties): boolean {
  if (!blueprint) return false;
  return blueprint.appearance !== undefined &&
    blueprint.minLength !== undefined &&
    blueprint.minLengthWarnMessage !== undefined &&
    blueprint.maxLength !== undefined &&
    blueprint.maxLengthWarnMessage !== undefined &&
    blueprint.isLimitedToMaxLength !== undefined &&
    blueprint.pattern !== undefined &&
    blueprint.patternWarnMessage !== undefined &&
    blueprint.hasKeyboardIcon !== undefined &&
    blueprint.clearable !== undefined &&
    PropertyGroupValidators.isValidPosition(blueprint.position) &&
    PropertyGroupValidators.isValidBasicStyles(blueprint.styling) &&
    blueprint.styling.lineHeight !== undefined;
}
