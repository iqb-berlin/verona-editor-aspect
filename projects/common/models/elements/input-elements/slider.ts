import { Type } from '@angular/core';
import {
  InputElement, InputElementProperties, PositionedUIElement, UIElementType
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { SliderComponent } from 'common/components/input-elements/slider.component';
import { AnswerScheme, AnswerSchemeValue } from 'common/models/elements/answer-scheme-interfaces';
import {
  BasicStyles, PositionProperties, PropertyGroupGenerators, PropertyGroupValidators
} from 'common/models/elements/property-group-interfaces';
import { environment } from 'common/environment';
import { InstantiationEror } from 'common/util/errors';

export class SliderElement extends InputElement implements PositionedUIElement, SliderProperties {
  type: UIElementType = 'slider';
  minValue: number = 0;
  maxValue: number = 100;
  showValues: boolean = true;
  barStyle: boolean = false;
  thumbLabel: boolean = false;
  position: PositionProperties;
  styling: BasicStyles & {
    lineHeight: number;
  };

  constructor(element?: SliderProperties) {
    super(element);
    if (element && isValid(element)) {
      this.minValue = element.minValue;
      this.maxValue = element.maxValue;
      this.showValues = element.showValues;
      this.barStyle = element.barStyle;
      this.thumbLabel = element.thumbLabel;
      this.position = { ...element.position };
      this.styling = { ...element.styling };
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationEror('Error at Slider instantiation', element);
      }
      if (element?.minValue) this.minValue = element.minValue;
      if (element?.maxValue) this.maxValue = element.maxValue;
      if (element?.showValues) this.showValues = element.showValues;
      if (element?.barStyle) this.barStyle = element.barStyle;
      if (element?.thumbLabel) this.thumbLabel = element.thumbLabel;
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
      type: 'integer',
      format: '',
      multiple: false,
      nullable: !this.value && this.value !== 0,
      values: this.getAnswerSchemeValues(),
      valuesComplete: true
    };
  }

  private getAnswerSchemeValues(): AnswerSchemeValue[] {
    return Array.from({ length: (this.maxValue + 1 - this.minValue) }, (_, index) => (
      { value: (index + this.minValue).toString(), label: (index + this.minValue).toString() }
    )) as AnswerSchemeValue[];
  }

  getElementComponent(): Type<ElementComponent> {
    return SliderComponent;
  }

  getDuplicate(): SliderElement {
    return new SliderElement(this);
  }
}

export interface SliderProperties extends InputElementProperties {
  minValue: number;
  maxValue: number;
  showValues: boolean;
  barStyle: boolean;
  thumbLabel: boolean;
  position: PositionProperties;
  styling: BasicStyles & {
    lineHeight: number;
  };
}

function isValid(blueprint?: SliderProperties): boolean {
  if (!blueprint) return false;
  return blueprint.minValue !== undefined &&
    blueprint.maxValue !== undefined &&
    blueprint.showValues !== undefined &&
    blueprint.barStyle !== undefined &&
    blueprint.thumbLabel !== undefined &&
    PropertyGroupValidators.isValidPosition(blueprint.position) &&
    PropertyGroupValidators.isValidBasicStyles(blueprint.styling) &&
    blueprint.styling.lineHeight !== undefined;
}
