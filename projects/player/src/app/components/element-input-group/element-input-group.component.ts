import {
  AfterViewInit, Component, OnInit, ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UnitStateService } from '../../services/unit-state.service';
import { ElementModelElementCodeMappingService } from '../../services/element-model-element-code-mapping.service';
import { ElementFormGroupDirective } from '../../directives/element-form-group.directive';
import { MessageService } from 'common/services/message.service';
import { VeronaSubscriptionService } from 'verona/services/verona-subscription.service';
import { ElementComponent } from 'common/directives/element-component.directive';
import { ValidationService } from '../../services/validation.service';
import {
  CheckboxElement,
  DropdownElement,
  DropListElement,
  InputElement,
  RadioButtonGroupComplexElement,
  RadioButtonGroupElement,
  SliderElement
} from 'common/classes/element';

@Component({
  selector: 'aspect-element-input-group',
  templateUrl: './element-input-group.component.html',
  styleUrls: ['./element-input-group.component.scss']
})
export class ElementInputGroupComponent extends ElementFormGroupDirective implements OnInit, AfterViewInit {
  @ViewChild('elementComponent') elementComponent!: ElementComponent;
  CheckboxElement!: CheckboxElement;
  SliderElement!: SliderElement;
  DropListElement!: DropListElement;
  RadioButtonGroupElement!: RadioButtonGroupElement;
  RadioButtonGroupComplexElement!: RadioButtonGroupComplexElement;
  DropdownElement!: DropdownElement;

  constructor(
    public unitStateService: UnitStateService,
    public elementModelElementCodeMappingService: ElementModelElementCodeMappingService,
    public translateService: TranslateService,
    public messageService: MessageService,
    public veronaSubscriptionService: VeronaSubscriptionService,
    public validatorService: ValidationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm([this.elementModel as InputElement]);
  }

  ngAfterViewInit(): void {
    this.registerAtUnitStateService(
      this.elementModel.id,
      this.elementModelElementCodeMappingService
        .mapToElementCodeValue((this.elementModel as InputElement).value, this.elementModel.type),
      this.elementComponent,
      this.pageIndex
    );
  }
}
