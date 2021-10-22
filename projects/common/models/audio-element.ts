import { UIElement } from './uI-element';

export class AudioElement extends UIElement {
  src: string = '';
  constructor(serializedElement: UIElement, coordinates?: { x: number; y: number }) {
    super(serializedElement, coordinates);
    Object.assign(this, serializedElement);
    this.width = serializedElement.width || 280;
  }
}
