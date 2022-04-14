import {
  Component, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElementComponent } from '../directives/element-component.directive';
import {
  DropListSimpleElement,
  TextFieldElement,
  ToggleButtonElement,
  ValueChangeElement
} from '../interfaces/elements';

@Component({
  selector: 'aspect-compound-child-overlay',
  template: `
    <div [style.border]="isSelected ? 'purple solid 1px' : ''"
         [style.border-radius.px]="3"
         (click)="elementSelected.emit(this); $event.stopPropagation();">
      <aspect-toggle-button *ngIf="element.type === 'toggle-button'" #childComponent
                            [style.pointer-events]="editorMode ? 'none' : 'auto'"
                            [parentForm]="parentForm"
                            [style.display]="'inline-block'"
                            [style.vertical-align]="'top'"
                            [elementModel]="$any(element)">
      </aspect-toggle-button>
      <aspect-text-field *ngIf="element.type === 'text-field'" #childComponent
                         [isClozeChild]="true"
                         [style.pointer-events]="editorMode ? 'none' : 'auto'"
                         [parentForm]="parentForm"
                         [style.display]="'inline-block'"
                         [elementModel]="$any(element)">
      </aspect-text-field>
      <aspect-drop-list-simple *ngIf="element.type === 'drop-list-simple'" #childComponent
                               [style.pointer-events]="editorMode ? 'none' : 'auto'"
                               [parentForm]="parentForm"
                               [style.display]="'inline-block'"
                               [style.vertical-align]="'middle'"
                               [elementModel]="$any(element)">
      </aspect-drop-list-simple>
    </div>
  `
})
export class CompoundChildOverlayComponent {
  @Input() element!: ToggleButtonElement | TextFieldElement | DropListSimpleElement;
  @Input() parentForm!: FormGroup;
  @Input() editorMode: boolean = false;
  @Output() elementValueChanged = new EventEmitter<ValueChangeElement>();
  @Output() elementSelected = new EventEmitter<CompoundChildOverlayComponent>();
  @ViewChild('childComponent') childComponent!: ElementComponent;

  isSelected: boolean = false;

  setSelected(newValue: boolean): void {
    this.isSelected = newValue;
  }
}
