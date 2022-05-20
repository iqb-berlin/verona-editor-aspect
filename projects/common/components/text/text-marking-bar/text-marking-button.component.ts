import {
  Component, EventEmitter, Input, Output
} from '@angular/core';

@Component({
  selector: 'aspect-text-marking-button',
  template: `
    <button type="button"
            class="marking-button"
            [style.border-color]="isMarkingSelected ? 'black' : color"
            mat-mini-fab
            [style.background-color]="color"
            (pointerdown)="selectMarking()">
      <mat-icon *ngIf="mode === 'mark'"
                class="marking-icon">border_color
      </mat-icon>
      <mat-icon *ngIf="mode === 'delete'"
                class="marking-icon"
                svgIcon="rubber-black">
      </mat-icon>
    </button>`,
  styles: [
    '.marking-button {color: #333; margin-left: 5px; margin-top: 2px; border: 2px solid;}',
    '.marking-icon {margin-top: -4px}'
  ]
})
export class TextMarkingButtonComponent {
  @Input() isMarkingSelected!: boolean;
  @Input() color!: string;
  @Input() mode!: 'mark' | 'delete';
  @Input() element!: HTMLElement;
  @Output() selectedMarkingChanged = new EventEmitter<{
    isSelected: boolean,
    mode: 'mark' | 'delete',
    color: string,
  }>();

  selectMarking(): void {
    this.isMarkingSelected = !this.isMarkingSelected;
    this.selectedMarkingChanged.emit({ isSelected: this.isMarkingSelected, mode: this.mode, color: this.color });
  }
}
