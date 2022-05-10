import { ElementFactory } from 'common/util/element.factory';
import { BasicStyles, InputElement, PositionedUIElement, PositionProperties } from 'common/classes/element';

export class DropdownElement extends InputElement implements PositionedUIElement {
  options: string[] = [];
  allowUnset: boolean = false;
  position: PositionProperties;
  styling: BasicStyles;

  constructor(element: DropdownElement) {
    super(element);
    Object.assign(this, element);
    this.position = ElementFactory.initPositionProps(element.position);
    this.styling = {
      ...ElementFactory.initStylingProps(element.styling)
    };
  }
}
