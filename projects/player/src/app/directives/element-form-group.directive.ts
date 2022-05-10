import { Directive, OnDestroy } from '@angular/core';
import {
  FormControl, FormGroup, ValidatorFn, Validators
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { UnitStateService } from '../services/unit-state.service';
import { ElementModelElementCodeMappingService } from '../services/element-model-element-code-mapping.service';
import { ElementGroupDirective } from './element-group.directive';
import { VopNavigationDeniedNotification } from 'verona/models/verona';
import { MessageService } from 'common/services/message.service';
import { VeronaSubscriptionService } from 'verona/services/verona-subscription.service';
import { ValidationService } from '../services/validation.service';
import { LogService } from 'logging/services/log.service';
import { InputElement, InputElementValue, SliderElement } from 'common/classes/element';

@Directive()
export abstract class ElementFormGroupDirective extends ElementGroupDirective implements OnDestroy {
  form: FormGroup = new FormGroup({});
  abstract unitStateService: UnitStateService;
  abstract elementModelElementCodeMappingService: ElementModelElementCodeMappingService;
  abstract translateService: TranslateService;
  abstract messageService: MessageService;
  abstract veronaSubscriptionService: VeronaSubscriptionService;
  abstract validatorService: ValidationService;

  ngUnsubscribe = new Subject<void>();

  createForm(elementModels: InputElement[]): void {
    elementModels.forEach(elementModel => {
      const initialValue = this.elementModelElementCodeMappingService
        .mapToElementModelValue(this.unitStateService.getElementCodeById(elementModel.id)?.value, elementModel);
      const formControl = new FormControl(initialValue, this.getValidators(elementModel));
      this.form.addControl(elementModel.id, formControl);
      formControl.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((inputValue: InputElementValue) => {
          this.unitStateService.changeElementCodeValue({
            id: elementModel.id,
            value: this.elementModelElementCodeMappingService.mapToElementCodeValue(inputValue, elementModel.type)
          });
        });
      if (this.needsValidation(elementModel)) {
        this.validatorService.registerFormControl(formControl);
      }
    });
    this.veronaSubscriptionService.vopNavigationDeniedNotification
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: VopNavigationDeniedNotification): void => this.onNavigationDenied(message));
  }

  private onNavigationDenied(message: VopNavigationDeniedNotification): void {
    LogService.info('player: onNavigationDenied', message);
    const reasons = message.reason?.map((reason: string) => this.translateService.instant(reason));
    this.messageService.showWarning(reasons?.join(', ') || this.translateService.instant('noReason'));
    if (message.reason && message.reason.find(reason => reason === 'responsesIncomplete')) {
      this.form.markAllAsTouched();
    }
  }

  private needsValidation = (elementModel: InputElement): boolean => [
    elementModel.required, !!elementModel.minLength, !!elementModel.maxLength, !!elementModel.pattern
  ].some(validator => validator);

  private getValidators = (elementModel: InputElement) => {
    const validators: ValidatorFn[] = [];
    if (elementModel.required) {
      switch (elementModel.type) {
        case 'checkbox':
          validators.push(Validators.requiredTrue);
          break;
        case 'slider':
          validators.push(Validators.min((elementModel as SliderElement).minValue + 1));
          break;
        default:
          validators.push(Validators.required);
      }
    }
    if (elementModel.minLength) {
      validators.push(Validators.minLength(<number> elementModel.minLength));
    }
    if (elementModel.maxLength) {
      validators.push(Validators.maxLength(<number> elementModel.maxLength));
    }
    if (elementModel.pattern) {
      validators.push(Validators.pattern(<string> elementModel.pattern));
    }
    return validators;
  };

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
