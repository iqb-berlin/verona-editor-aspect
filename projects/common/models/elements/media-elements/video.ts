import { Type } from '@angular/core';
import {
  PlayerElement, PlayerElementBlueprint, PositionedUIElement, UIElementType
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { VideoComponent } from 'common/components/media-elements/video.component';
import {
  PositionProperties, PropertyGroupGenerators, PropertyGroupValidators
} from 'common/models/elements/property-group-interfaces';
import { environment } from 'common/environment';
import { InstantiationEror } from 'common/util/errors';

export class VideoElement extends PlayerElement implements PositionedUIElement, VideoProperties {
  type: UIElementType = 'video';
  src: string | null = null;
  scale: boolean = false;
  position: PositionProperties;

  constructor(element?: VideoProperties) {
    super(element);
    if (element && isValid(element)) {
      this.src = element.src;
      this.scale = element.scale;
      this.position = { ...element.position };
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationEror('Error at Video instantiation', element);
      }
      if (element?.src !== undefined) this.src = element.src;
      if (element?.scale !== undefined) this.scale = element.scale;
      this.dimensions = PropertyGroupGenerators.generateDimensionProps({
        width: 280,
        height: 230,
        ...element?.dimensions
      });
      this.position = PropertyGroupGenerators.generatePositionProps(element?.position);
    }
  }

  getElementComponent(): Type<ElementComponent> {
    return VideoComponent;
  }

  getDuplicate(): VideoElement {
    return new VideoElement(this);
  }
}

export interface VideoProperties extends PlayerElementBlueprint {
  src: string | null;
  scale: boolean;
  position: PositionProperties;
}

function isValid(blueprint?: VideoProperties): boolean {
  if (!blueprint) return false;
  return blueprint.src !== undefined &&
    blueprint.scale !== undefined &&
    PropertyGroupValidators.isValidPosition(blueprint.position);
}
