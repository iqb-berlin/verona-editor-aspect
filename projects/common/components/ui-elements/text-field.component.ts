import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { FormElementComponent } from '../../directives/form-element-component.directive';
import { TextFieldElement } from '../../interfaces/elements';

@Component({
  selector: 'aspect-text-field',
  template: `
    <mat-form-field
        *ngIf="elementModel.label !== ''"
        [style.width.%]="100"
        [style.height.%]="100"
        [style.color]="elementModel.styles.fontColor"
        [style.font-family]="elementModel.styles.font"
        [style.font-size.px]="elementModel.styles.fontSize"
        [style.font-weight]="elementModel.styles.bold ? 'bold' : ''"
        [style.font-style]="elementModel.styles.italic ? 'italic' : ''"
        [style.text-decoration]="elementModel.styles.underline ? 'underline' : ''"
        aspectInputBackgroundColor [backgroundColor]="elementModel.styles.backgroundColor"
        [appearance]="$any(elementModel.appearance)">
      <mat-label>{{elementModel.label}}</mat-label>
      <input matInput type="text" #input autocomplete="off"
             [formControl]="elementFormControl"
             [value]="elementModel.value"
             [pattern]="elementModel.pattern"
             [readonly]="elementModel.readOnly"
             (focus)="elementModel.inputAssistancePreset !== 'none' ? onFocusChanged.emit(input) : null"
             (blur)="elementModel.inputAssistancePreset !== 'none' ? onFocusChanged.emit(null): null">
      <button *ngIf="elementModel.clearable"
              type="button"
              matSuffix mat-icon-button aria-label="Clear"
              (click)="this.elementFormControl.setValue('')">
        <mat-icon>close</mat-icon>
      </button>
      <mat-error *ngIf="elementFormControl.errors">
        {{elementFormControl.errors | errorTransform: elementModel}}
      </mat-error>
    </mat-form-field>
    <mat-form-field
        *ngIf="elementModel.label === ''" class="small-input"
        [style.width.%]="100"
        [style.height.%]="100"
        [style.color]="elementModel.styles.fontColor"
        [style.font-family]="elementModel.styles.font"
        [style.font-size.px]="elementModel.styles.fontSize"
        [style.font-weight]="elementModel.styles.bold ? 'bold' : ''"
        [style.font-style]="elementModel.styles.italic ? 'italic' : ''"
        [style.text-decoration]="elementModel.styles.underline ? 'underline' : ''"
        aspectInputBackgroundColor [backgroundColor]="elementModel.styles.backgroundColor"
        [appearance]="$any(elementModel.appearance)">
      <input matInput type="text" #input autocomplete="off"
             [formControl]="elementFormControl"
             [value]="elementModel.value"
             [readonly]="elementModel.readOnly"
             [pattern]="elementModel.pattern"
             (focus)="elementModel.inputAssistancePreset !== 'none' ? onFocusChanged.emit(input) : null"
             (blur)="elementModel.inputAssistancePreset !== 'none' ? onFocusChanged.emit(null): null">
      <button *ngIf="elementModel.clearable"
              type="button"
              matSuffix mat-icon-button aria-label="Clear"
              (click)="this.elementFormControl.setValue('')">
        <mat-icon>close</mat-icon>
      </button>
      <mat-error *ngIf="elementFormControl.errors">
        {{elementFormControl.errors | errorTransform: elementModel}}
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    ':host ::ng-deep .small-input div.mat-form-field-infix {border-top: none; padding: 0.55em 0 0.25em 0;}'
  ]
})
export class TextFieldComponent extends FormElementComponent {
  @Input() elementModel!: TextFieldElement;
  @Output() onFocusChanged = new EventEmitter<HTMLElement | null>();
}
