import {
  Directive, Output, EventEmitter, Input, OnInit
} from '@angular/core';
import { UnitUIElement } from './unit';

@Directive()
export abstract class CanvasElementComponent implements OnInit {
  @Input() elementModel: UnitUIElement = {} as UnitUIElement;
  @Input() draggable: boolean = false;
  @Output() elementSelected = new EventEmitter<{ componentElement: CanvasElementComponent, multiSelect: boolean }>();

  _selected = false;
  style: Record<string, string> = {};

  ngOnInit(): void {
    this.updateStyle();
  }

  set selected(newValue: boolean) {
    this._selected = newValue;
    this.updateStyle();
  }

  click(event: MouseEvent): void {
    if (event.shiftKey) {
      this.elementSelected.emit({ componentElement: this, multiSelect: true });
    } else {
      this.elementSelected.emit({ componentElement: this, multiSelect: false });
    }
  }

  updateStyle(): void {
    this.style = {
      border: this._selected ? '5px solid' : '',
      width: `${this.elementModel.width}px`,
      height: `${this.elementModel.height}px`,
      'background-color': this.elementModel.backgroundColor,
      color: this.elementModel.fontColor,
      'font-family': this.elementModel.font,
      'font-size': `${this.elementModel.fontSize}px`,
      'font-weight': this.elementModel.bold ? 'bold' : '',
      'font-style': this.elementModel.italic ? 'italic' : '',
      'text-decoration': this.elementModel.underline ? 'underline' : '',
      left: `${this.elementModel.xPosition.toString()}px`,
      top: `${this.elementModel.yPosition.toString()}px`
    };
  }
}
