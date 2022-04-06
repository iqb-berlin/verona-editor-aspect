import {
  Component, EventEmitter,
  Input, Output
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { UnitService } from '../../../../../services/unit.service';
import { FileService } from '../../../../../services/file.service';
import {
  TextImageLabel,
  DragNDropValueObject,
  InputElementValue,
  LikertElement, LikertRowElement,
  UIElement
} from '../../../../../../../../common/interfaces/elements';
import { SelectionService } from '../../../../../services/selection.service';
import { DialogService } from '../../../../../services/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'aspect-element-model-properties-component',
  templateUrl: './element-model-properties.component.html',
  styleUrls: ['./element-model-properties.component.css']
})
export class ElementModelPropertiesComponent {
  @Input() combinedProperties: UIElement = {} as UIElement;
  @Input() selectedElements: UIElement[] = [];
  @Output() updateModel = new EventEmitter<{
    property: string;
    value: InputElementValue | TextImageLabel[] | DragNDropValueObject[],
    isInputValid?: boolean | null
  }>();

  constructor(public unitService: UnitService,
              public selectionService: SelectionService,
              public dialogService: DialogService,
              public sanitizer: DomSanitizer) { }

  addListValue(property: string, value: string): void {
    this.updateModel.emit({
      property: property,
      value: [...(this.combinedProperties[property] as string[]), value]
    });
  }

  moveListValue(property: string, event: CdkDragDrop<string[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.updateModel.emit({ property: property, value: event.container.data });
  }

  removeListValue(property: string, option: any): void {
    const valueList = this.combinedProperties[property] as string[] | LikertRowElement[] | TextImageLabel[];
    valueList.splice(valueList.indexOf(option), 1);
    this.updateModel.emit({ property: property, value: valueList });
  }

  async editTextOption(property: string, optionIndex: number): Promise<void> {
    const oldOptions = this.selectionService.getSelectedElements()[0][property] as string[];
    await this.dialogService.showTextEditDialog(oldOptions[optionIndex])
      .subscribe((result: string) => {
        if (result) {
          oldOptions[optionIndex] = result;
          this.updateModel.emit({ property, value: oldOptions });
        }
      });
  }

  addDropListOption(value: string): void {
    this.updateModel.emit({
      property: 'value',
      value: [
        ...this.combinedProperties.value as DragNDropValueObject[],
        { stringValue: value, id: this.unitService.getNewValueID() }
      ]
    });
  }

  async editDropListOption(optionIndex: number): Promise<void> {
    await this.unitService.editDropListOption(optionIndex);
  }

  async editColumnOption(optionIndex: number): Promise<void> {
    const firstElement = (this.selectedElements as LikertElement[])[0];
    await this.dialogService
      .showLikertColumnEditDialog(firstElement.columns[optionIndex],
        (this.combinedProperties as LikertElement).styling.fontSize)
      .subscribe((result: TextImageLabel) => {
        if (result) {
          firstElement.columns[optionIndex] = result;
          this.updateModel.emit({ property: 'columns', value: firstElement.columns });
        }
      });
  }

  addColumn(value: string): void {
    const column: TextImageLabel = {
      text: value,
      imgSrc: null,
      position: 'above'
    };
    (this.combinedProperties.columns as TextImageLabel[]).push(column);
    this.updateModel.emit({ property: 'columns', value: this.combinedProperties.columns as TextImageLabel[] });
  }

  addLikertRow(rowLabelText: string): void {
    const newRow = this.unitService.createLikertRowElement(
      rowLabelText,
      (this.combinedProperties.columns as TextImageLabel[]).length
    );
    (this.combinedProperties.rows as LikertRowElement[]).push(newRow);
    this.updateModel.emit({ property: 'rows', value: this.combinedProperties.rows as LikertRowElement[] });
  }

  async editLikertRow(rowIndex: number): Promise<void> {
    const row = (this.combinedProperties.rows as LikertRowElement[])[rowIndex] as LikertRowElement;
    const columns = this.combinedProperties.columns as TextImageLabel[];

    await this.dialogService.showLikertRowEditDialog(row, columns)
      .subscribe((result: LikertRowElement) => {
        if (result) {
          if (result.id !== row.id) {
            this.unitService.updateElementProperty(
              [row],
              'id',
              result.id
            );
          }
          if (result.text !== row.text) {
            this.unitService.updateElementProperty(
              [row],
              'text',
              result.text
            );
          }
          if (result.value !== row.value) {
            this.unitService.updateElementProperty(
              [row],
              'value',
              result.value
            );
          }
        }
      });
  }
}
