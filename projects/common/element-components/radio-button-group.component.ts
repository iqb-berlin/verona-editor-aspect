import { Component } from '@angular/core';
import { FormElementComponent } from '../form-element-component.directive';
import { RadioButtonGroupElement } from '../models/radio-button-group-element';

@Component({
  selector: 'app-radio-button-group',
  template: `
    <div class="mat-form-field"
         [style.width.%]="100"
         [style.height.%]="100"
         [style.background-color]="elementModel.backgroundColor"
         [style.color]="elementModel.fontColor"
         [style.font-family]="elementModel.font"
         [style.font-size.px]="elementModel.fontSize"
         [style.font-weight]="elementModel.bold ? 'bold' : ''"
         [style.font-style]="elementModel.italic ? 'italic' : ''"
         [style.text-decoration]="elementModel.underline ? 'underline' : ''">
      <label id="radio-group-label" class="white-space-break"
             [innerHTML]="elementModel.label">
      </label>
<!--      TODO why margin-bottom?-->
      <mat-radio-group aria-labelledby="radio-group-label"
                       [fxLayout]="elementModel.alignment"
                       [formControl]="elementFormControl">
        <mat-radio-button *ngFor="let option of elementModel.options; let i = index"
                          [ngClass]="{ 'strike' : elementModel.strikeOtherOptions &&
                                                  elementFormControl.value !== null &&
                                                  elementFormControl.value !== i }"
                          [value]="i"
                          [style.pointer-events]="elementModel.readOnly ? 'none' : 'unset'"
                          [style.line-height.%]="elementModel.lineHeight">
          {{option}}
        </mat-radio-button>
        <mat-error *ngIf="elementFormControl.errors && elementFormControl.touched"
                   class="error-message">
          {{elementFormControl.errors | errorTransform: elementModel}}
        </mat-error>
      </mat-radio-group>
    </div>
  `,
  styles: [
    '::ng-deep app-radio-button-group .mat-radio-label {white-space: normal}',
    '::ng-deep app-radio-button-group .mat-radio-label .mat-radio-label-content {padding-left: 10px}',
    '::ng-deep app-radio-button-group mat-radio-button {margin-bottom: 6px}',
    '::ng-deep app-radio-button-group mat-radio-button {margin-right: 15px}',
    '.white-space-break {white-space: normal}',
    '.error-message { font-size: 75% }',
    '::ng-deep app-radio-button-group .strike .mat-radio-label {text-decoration: line-through}',
    '::ng-deep app-radio-button-group mat-radio-button .mat-radio-label {align-items: unset}',
    '::ng-deep app-radio-button-group mat-radio-button .mat-radio-label .mat-radio-container {margin-top: 1px}'
  ]
})
export class RadioButtonGroupComponent extends FormElementComponent {
  elementModel!: RadioButtonGroupElement;
}
