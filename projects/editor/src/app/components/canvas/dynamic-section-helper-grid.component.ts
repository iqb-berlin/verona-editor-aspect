import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { UIElementType } from 'common/interfaces/elements';
import { UIElement } from 'common/classes/element';
import { Section } from 'common/classes/unit';

@Component({
  selector: '[app-dynamic-section-helper-grid]',
  template: `
    <ng-container *ngFor="let column of columnCountArray; let x = index">
      <ng-container *ngFor="let row of rowCountArray; let y = index">
        <div class="grid-placeholder"
             [style.grid-column-start]="x + 1"
             [style.grid-column-end]="x + 1"
             [style.grid-row-start]="y + 1"
             [style.grid-row-end]="y + 1"
             cdkDropList [cdkDropListData]="{ sectionIndex: sectionIndex, gridCoordinates: [x + 1, y + 1] }"
             (cdkDropListDropped)="drop($any($event))"
             id="list-{{sectionIndex}}-{{x+1}}-{{y+1}}"
             (dragover)="$event.preventDefault()"
             (drop)="newElementDropped( $event, x + 1, y + 1)">
          {{x + 1}} / {{y + 1}}
        </div>
      </ng-container>
    </ng-container>

    <ng-content></ng-content>
  `,
  styles: [
    '.grid-placeholder {border: 5px solid aliceblue; color: lightblue; text-align: center;}'
  ]
})
export class DynamicSectionHelperGridComponent implements OnInit, OnChanges {
  @Input() autoColumnSize!: boolean;
  @Input() autoRowSize!: boolean;
  @Input() gridColumnSizes!: string;
  @Input() gridRowSizes!: string;
  @Input() section!: Section;
  @Input() sectionIndex!: number;
  @Output() transferElement = new EventEmitter<{ previousSectionIndex: number, newSectionIndex: number }>();

  columnCountArray: unknown[] = [];
  rowCountArray: unknown[] = [];

  constructor(public unitService: UnitService, public ele: ElementRef) {}

  ngOnInit(): void {
    this.calculateColumnCount();
    this.calculateRowCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.autoColumnSize ||
      changes.gridColumnSizes ||
      changes.gridRowSizes) {
      this.calculateColumnCount();
      this.calculateRowCount();
    }
  }

  refresh(): void {
    this.calculateColumnCount();
    this.calculateRowCount();
  }

  private calculateColumnCount(): void {
    let numberOfColumns;
    if (this.autoColumnSize) {
      numberOfColumns = this.section.elements
        .reduce((accumulator, currentValue) => (
          currentValue.position.gridColumn ?
            Math.max(accumulator, currentValue.position.gridColumn + currentValue.position.gridColumnRange) :
            accumulator
        ),
        0) - 1;
    } else {
      numberOfColumns = this.gridColumnSizes.split(' ').length;
    }
    this.columnCountArray = Array(Math.max(numberOfColumns, 1));
  }

  private calculateRowCount(): void {
    let numberOfRows;
    if (this.autoRowSize) {
      numberOfRows = this.section.elements
        .reduce((accumulator, currentValue) => (
          currentValue.position.gridRow ?
            Math.max(accumulator, currentValue.position.gridRow + currentValue.position.gridRowRange) :
            accumulator
        ),
        0) - 1;
    } else {
      numberOfRows = this.gridRowSizes.split(' ').length;
    }
    this.rowCountArray = Array(Math.max(numberOfRows, 1));
  }

  drop(event: CdkDragDrop<{ sectionIndex: number; gridCoordinates?: number[]; }>): void {
    const dragItemData: { dragType: string; element: UIElement; } = event.item.data;

    // Move element to other section - handled by parent (page-canvas).
    if (event.previousContainer.data.sectionIndex !== event.container.data.sectionIndex) {
      this.transferElement.emit({
        previousSectionIndex: event.previousContainer.data.sectionIndex,
        newSectionIndex: event.container.data.sectionIndex
      });
    }
    if (dragItemData.dragType === 'move') {
      this.unitService.updateElementsProperty(
        [event.item.data.element],
        'gridColumn',
        event.container.data.gridCoordinates![0]
      );
      this.unitService.updateElementsProperty(
        [dragItemData.element],
        'gridRow',
        event.container.data.gridCoordinates![1]
      );
    } else if (event.item.data.dragType === 'resize') {
      this.unitService.updateElementsProperty(
        [dragItemData.element],
        'gridColumnEnd',
        event.container.data.gridCoordinates![0] + 1
      );
      this.unitService.updateElementsProperty(
        [dragItemData.element],
        'gridRowEnd',
        event.container.data.gridCoordinates![1] + 1
      );
    } else {
      throw new Error('Unknown drop event');
    }
  }

  newElementDropped(event: DragEvent, gridX: number, gridY: number): void {
    event.preventDefault();
    this.unitService.addElementToSection(
      event.dataTransfer?.getData('elementType') as UIElementType,
      this.section,
      { x: gridX, y: gridY }
    );
  }
}
