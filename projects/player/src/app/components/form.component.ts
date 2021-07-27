import { Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormService } from '../../../../common/form.service';
import { VeronaSubscriptionService } from '../services/verona-subscription.service';
import { VeronaPostService } from '../services/verona-post.service';
import { FormGroupPage, ValueChangeElement } from '../../../../common/form';
import {
  PlayerConfig, UnitState, VopNavigationDeniedNotification
} from '../models/verona';
import { UnitPage } from '../../../../common/unit';

@Component({
  selector: 'app-form',
  template: `
      <form [formGroup]="form">
          <app-player-state [parenForm]="form" [pages]="pages" [validPages]="validPages"></app-player-state>
      </form>
      <button class="form-item" mat-flat-button color="primary" (click)="submit()">Print
          form.value
      </button>
  `
})
export class FormComponent implements OnDestroy {
  @Input() pages: UnitPage[] = [];
  @Input() playerConfig!: PlayerConfig;
  form!: FormGroup;
  private ngUnsubscribe = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private veronaSubscriptionService: VeronaSubscriptionService,
              private veronaPostService: VeronaPostService) {
    this.form = this.formBuilder.group({
      pages: this.formBuilder.array([])
    });
    this.initSubscriptions();
  }

  get validPages():Record<string, string>[] {
    return this.pages.map((page:UnitPage): Record<string, string> => (
      { [page.id]: page.label }));
  }

  private initSubscriptions(): void {
    this.formService.elementValueChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: ValueChangeElement): void => this.onElementValueChanges(value));
    this.formService.groupAdded
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((group: FormGroupPage): void => this.addGroup(group));
    this.veronaSubscriptionService.vopNavigationDeniedNotification
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: VopNavigationDeniedNotification): void => this.onNavigationDenied(message));
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((formValues: { pages: Record<string, string>[] }): void => this.onFormChanges(formValues));
  }

  private onNavigationDenied(message: VopNavigationDeniedNotification): void {
    // eslint-disable-next-line no-console
    console.log('player: onNavigationDenied', message);
    this.form.markAllAsTouched();
  }

  private addGroup(group: FormGroupPage): void {
    const pages: FormArray = this.form.get('pages') as FormArray;
    pages.push(new FormGroup({ [group.id]: group.formGroup }));
  }

  private onElementValueChanges = (value: ValueChangeElement): void => {
    // eslint-disable-next-line no-console
    console.log(`player: onElementValueChanges - ${value.id}: ${value.values[0]} -> ${value.values[1]}`);
  };

  private onFormChanges(formValues: { pages: Record<string, string>[] }): void {
    // eslint-disable-next-line no-console
    console.log('player: onFormChanges', formValues);
    const unitState: UnitState = {
      dataParts: formValues.pages
        .reduce((obj, page): Record<string, string> => {
          obj[Object.keys(page)[0]] = JSON.stringify(page[Object.keys(page)[0]]);
          return obj;
        }, {})
    };
    this.veronaPostService.sendVopStateChangedNotification({ unitState });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /// ////////////////////// only for dev
  submit(): void {
    // eslint-disable-next-line no-console
    console.log('player: form.value', this.form.value);
  }
}
