import {
  Component, OnInit, OnDestroy, Input,
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnitUIElement } from '../../../../common/unit';
import * as ComponentUtils from '../../../../common/component-utils';
import { FormElementComponent } from '../../../../common/form-element-component.directive';
import { ValidationMessageComponent } from './validation-message.component';
import { ValueChangeElement } from '../../../../common/form';
import { FormService } from '../../../../common/form.service';

@Component({
  selector: 'app-element-overlay',
  template: `
      <div [style.position]="'absolute'"
           [style.left.px]="elementModel.xPosition"
           [style.top.px]="elementModel.yPosition">
          <ng-template #elementComponentContainer></ng-template>
          <ng-template #validationMessageComponentContainer></ng-template>
      </div>
  `
})
export class ElementOverlayComponent implements OnInit, OnDestroy {
  @Input() elementModel!: UnitUIElement;
  @Input() parentForm!: FormGroup;

  @ViewChild('elementComponentContainer',
    { read: ViewContainerRef, static: true }) private elementComponentContainer!: ViewContainerRef;

  @ViewChild('validationMessageComponentContainer',
    { read: ViewContainerRef, static: true }) private validationMessageComponentContainer!: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  constructor(private formService: FormService,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    const elementComponentFactory =
      ComponentUtils.getComponentFactory(this.elementModel.type, this.componentFactoryResolver);
    const elementComponent = this.elementComponentContainer.createComponent(elementComponentFactory).instance;
    elementComponent.elementModel = this.elementModel;

    if (elementComponent instanceof FormElementComponent) {
      elementComponent.parentForm = this.parentForm;
      elementComponent.formValueChanged
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((changeElement: ValueChangeElement) => {
          this.formService.changeElementValue(changeElement);
        });

      const validationMessageComponentFactory: ComponentFactory<ValidationMessageComponent> =
        this.componentFactoryResolver.resolveComponentFactory(ValidationMessageComponent);
      const validationMessageComponentRef: ComponentRef<ValidationMessageComponent> =
        this.validationMessageComponentContainer.createComponent(validationMessageComponentFactory);

      validationMessageComponentRef.instance.parentForm = this.parentForm;
      validationMessageComponentRef.instance.elementModel = this.elementModel;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
