import {
  AfterViewInit,
  Directive, EventEmitter, Input, Output, QueryList
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElementComponent } from './element-component.directive';
import { CompoundChildOverlayComponent } from '../components/compound-child-overlay.component';
import { LikertRadioButtonGroupComponent } from '../components/ui-elements/likert-radio-button-group.component';
import { InputElement } from 'common/classes/element';

@Directive()
export abstract class CompoundElementComponent extends ElementComponent implements AfterViewInit {
  @Output() childrenAdded = new EventEmitter<ElementComponent[]>();
  @Input() parentForm!: FormGroup;
  compoundChildren!: QueryList<CompoundChildOverlayComponent | LikertRadioButtonGroupComponent>;

  ngAfterViewInit(): void {
    this.childrenAdded.emit(this.getFormElementChildrenComponents());
  }

  abstract getFormElementModelChildren(): InputElement[];
  abstract getFormElementChildrenComponents(): ElementComponent[];
}
