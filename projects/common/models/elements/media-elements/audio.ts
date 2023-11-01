import { Type } from '@angular/core';
import {
  PlayerElement, PlayerElementBlueprint, PositionedUIElement, UIElementType
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { AudioComponent } from 'common/components/media-elements/audio.component';
import {
  PositionProperties, PropertyGroupGenerators, PropertyGroupValidators
} from 'common/models/elements/property-group-interfaces';
import { environment } from 'common/environment';
import { InstantiationEror } from 'common/util/errors';

export class AudioElement extends PlayerElement implements PositionedUIElement, AudioProperties {
  type: UIElementType = 'audio';
  src: string | null = null;
  position: PositionProperties;

  constructor(element?: AudioProperties) {
    super(element);
    if (element && isValid(element)) {
      this.src = element.src;
      this.position = { ...element.position };
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationEror('Error at Audio instantiation', element);
      }
      if (element?.src !== undefined) this.src = element.src;
      this.dimensions = PropertyGroupGenerators.generateDimensionProps({
        width: 250,
        height: 90,
        ...element?.dimensions
      });
      this.position = PropertyGroupGenerators.generatePositionProps(element?.position);
    }
  }

  getDuplicate(): AudioElement {
    return new AudioElement(this);
  }

  getElementComponent(): Type<ElementComponent> {
    return AudioComponent;
  }
}

export interface AudioProperties extends PlayerElementBlueprint {
  src: string | null;
  position: PositionProperties;
}

function isValid(blueprint?: AudioProperties): boolean {
  if (!blueprint) return false;
  return blueprint.src !== undefined &&
    PropertyGroupValidators.isValidPosition(blueprint.position);
}
