import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent {
  @Input() preset!: 'french' | 'numbers' | 'numbersAndOperators' | 'comparisonOperators' | 'none';
  @Input() inputComponent!: HTMLTextAreaElement | HTMLInputElement;
  @Input() inputType!: 'text-field' | 'text-area';

  onMouseDown = (event: MouseEvent, stopPropagation: boolean): void => {
    event.preventDefault();
    if (stopPropagation) {
      event.stopPropagation();
    }
  };
}
