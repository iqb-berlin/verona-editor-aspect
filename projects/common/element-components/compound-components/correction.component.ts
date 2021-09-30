import { Component } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { CompoundElementCorrection } from '../../unit';
import { FormElementComponent } from '../../form-element-component.directive';

@Component({
  selector: 'app-correction',
  template: `
      <div>
          <p>
              {{$any(elementModel).text}}
          </p>
          <div *ngFor="let sentence of elementModel.sentences"
               fxLayout="column">
              <div fxLayout="row">
                  <div *ngFor="let word of sentence.split(' ');"
                       fxLayout="column">
                      <mat-form-field>
                          <input matInput type="text"
                                 [formControl]="elementFormControl">
                      </mat-form-field>
                      <div>
                          {{word}}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: [
    'mat-form-field {margin: 5px}'
  ]
})
export class CorrectionComponent extends FormElementComponent {
  elementModel!: CompoundElementCorrection;

  get validators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (this.elementModel.required) {
      validators.push(Validators.required);
    }
    return validators;
  }
}
