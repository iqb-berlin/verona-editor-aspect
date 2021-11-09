import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import {
  CdkDrag, CdkDropList, moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';
import { DropListElement } from '../../models/compound-elements/drop-list';
import { FormElementComponent } from '../../form-element-component.directive';

@Component({
  selector: 'app-drop-list',
  template: `
    <!-- TODO width/height 90 to not produce overflow. find better solution. -->
    <div
        [style.width.%]="100"
        [style.height.%]="100">
      <div class="list"
           [style.width.%]="90"
           [style.height.%]="90"
           [style.color]="elementModel.fontColor"
           [style.font-family]="elementModel.font"
           [style.font-size.px]="elementModel.fontSize"
           [style.font-weight]="elementModel.bold ? 'bold' : ''"
           [style.font-style]="elementModel.italic ? 'italic' : ''"
           [style.text-decoration]="elementModel.underline ? 'underline' : ''"
           [style.backgroundColor]="elementModel.backgroundColor"
           [style.display]="elementModel.orientation === 'horizontal' ? 'flex' : ''"
           [style.flex-direction]="elementModel.orientation === 'horizontal' ? 'row' : ''"
           cdkDropList
           [id]="elementModel.id"
           [cdkDropListData]="this"
           [cdkDropListConnectedTo]="elementModel.connectedTo"
           [cdkDropListOrientation]="elementModel.orientation"
           [cdkDropListEnterPredicate]="onlyOneItemPredicate"
           (cdkDropListDropped)="drop($event)">
        <div class="item" *ngFor="let option of elementModel.options; let i = index" cdkDrag
             [ngClass]="{'vertical-item': elementModel.orientation === 'vertical' &&
                                     i+1 < elementModel.options.length,
                         'horizontal-item': elementModel.orientation === 'horizontal' &&
                                     i+1 < elementModel.options.length}">
          <div *cdkDragPreview>{{option}}</div>
          {{option}}
        </div>
      </div>
    <mat-error *ngIf="elementFormControl.errors && elementFormControl.touched"
               class="error-message">
      {{elementFormControl.errors | errorTransform: elementModel}}
    </mat-error>
    </div>
  `,
  styles: [
    '.list {border: 1px solid; border-radius: 3px;}',
    '.item {padding: 10px;}',
    '.error-message { font-size: 75%; margin-top: 10px }',
    '.vertical-item {border-bottom: 1px solid}',
    '.horizontal-item {border-right: 1px solid}'
  ]
})
export class DropListComponent extends FormElementComponent {
  elementModel!: DropListElement;

  drop(event: CdkDragDrop<DropListComponent>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.elementModel.options, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data.elementModel.options,
        event.container.data.elementModel.options,
        event.previousIndex,
        event.currentIndex
      );
      event.previousContainer.data.elementFormControl.setValue(event.previousContainer.data.elementModel.options);
    }
    this.elementFormControl.setValue(event.container.data.elementModel.options);
  }

  onlyOneItemPredicate = (drag: CdkDrag, drop: CdkDropList): boolean => (
    !drop.data.elementModel.onlyOneItem || drop.data.elementModel.options.length < 1
  );
}
