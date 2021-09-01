import { Component } from '@angular/core';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { CanvasElementOverlay } from './canvas-element-overlay';

@Component({
  selector: 'app-static-canvas-overlay',
  template: `
    <!--    Needs extra div because styling can interfere with drag and drop-->
    <div class="draggable-element" [class.draggable-element-selected]="selected"
         cdkDrag [cdkDragData]="{dragType: 'move', element: element}"
         cdkDragBoundary=".canvasFrame"
         (click)="selectElement($event.shiftKey)" (cdkDragStarted)="selectElement()"
         (dblclick)="openEditDialog()"
         [style.position]="'absolute'"
         [style.border]="selected ? '2px solid' : ''"
         [style.width.px]="element.width"
         [style.height.px]="element.height"
         [style.left.px]="element.xPosition"
         [style.top.px]="element.yPosition"
         [style.z-index]="element.zIndex">
        <!-- Element only for resizing   -->
        <!-- Extra droplist is needed to keep parent component droplist from handling the drop event. -->
        <!-- Also for cursor styling. -->
      <div *ngIf="selected" cdkDropList class="resize-droplist"
           [style.width.%]="100"
           [style.height.%]="100">
        <div class="resizeHandle"
             cdkDrag (cdkDragStarted)="resizeDragStart()" (cdkDragMoved)="resizeElement($event)"
             cdkDragBoundary=".section-wrapper"
             [style.right.px]="-1"
             [style.bottom.px]="-7"
             [style.z-index]="5">
          <mat-icon>aspect_ratio</mat-icon>
          <div *cdkDragPlaceholder></div>
        </div>
      </div>
      <ng-template #elementContainer></ng-template>
    </div>
  `,
  styles: [
    '.draggable-element {position: absolute}',
    '.resizeHandle {position: absolute}',
    '.resize-droplist {position: absolute}',
    '.draggable-element-selected .resizeHandle {cursor: nwse-resize}',
    '.resize-droplist.cdk-drop-list-dragging {cursor: nwse-resize}'
  ]
})
export class StaticCanvasOverlayComponent extends CanvasElementOverlay {
  private oldX: number = 0;
  private oldY: number = 0;

  resizeDragStart(): void {
    this.oldX = this.element.width;
    this.oldY = this.element.height;
  }

  resizeElement(event: CdkDragMove): void {
    this.unitService.updateElementProperty(
      this.selectionService.getSelectedElements(),
      'width',
      Math.max(this.oldX + event.distance.x, 0)
    );
    this.unitService.updateElementProperty(
      this.selectionService.getSelectedElements(),
      'height',
      Math.max(this.oldY + event.distance.y, 0)
    );
  }
}
