import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { KeyInputRestrictionDirective } from '../../directives/key-input-restriction.directive';
import { KeyLayout } from '../../configs/key-layout';
import { InputAssistancePreset } from 'common/models/elements/element';

@Component({
  selector: 'aspect-keypad-math',
  templateUrl: './keypad-math.component.html',
  styleUrls: ['./keypad-math.component.css']
})
export class KeypadMathComponent extends KeyInputRestrictionDirective implements OnInit {
  @Input() preset!: InputAssistancePreset;
  @Input() position!: 'floating' | 'right';

  @Output() backSpaceClicked = new EventEmitter();
  @Output() keyClicked = new EventEmitter<string>();

  rows: string[][] = [];
  additionalRows: string[][] = [];

  ngOnInit(): void {
    this.rows = KeyLayout.get(this.preset).default;
    this.additionalRows = KeyLayout.get(this.preset).additional;
    this.allowedKeys = [...this.rows.flat(), ...this.additionalRows.flat()];
  }
}
