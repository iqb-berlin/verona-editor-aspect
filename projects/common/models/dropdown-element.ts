import { InputElement, UIElement } from './uI-element';
import { FontElement, SurfaceUIElement } from '../interfaces/UIElementInterfaces';
import { initFontElement, initSurfaceElement } from '../util/unit-interface-initializer';

export class DropdownElement extends InputElement implements FontElement, SurfaceUIElement {
  options: string[] = [];
  allowUnset: boolean = false;

  fontColor: string = 'black';
  font: string = 'Roboto';
  fontSize: number = 18;
  bold: boolean = false;
  italic: boolean = false;
  underline: boolean = false;

  backgroundColor: string = 'transparent';

  constructor(serializedElement: UIElement, coordinates?: { x: number; y: number }) {
    super(serializedElement, coordinates);
    Object.assign(this, serializedElement);
    Object.assign(this, initFontElement(serializedElement));
    Object.assign(this, initSurfaceElement(serializedElement));

    this.height = serializedElement.height || 83;
  }
}
