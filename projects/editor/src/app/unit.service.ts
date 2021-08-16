import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Unit, UnitPageSection, UnitUIElement
} from '../../../common/unit';
import { FileService } from '../../../common/file.service';
import * as UnitFactory from './UnitFactory';
import { MessageService } from '../../../common/message.service';
import { IdService } from './id.service';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  EXPORTED_MODULE_VERSION = 'iqb-aspect-module@0.0.1';

  private _unit: BehaviorSubject<Unit>;

  elementPropertyUpdated: Subject<void> = new Subject<void>();
  selectedPageIndex: number = 0;

  constructor(private messageService: MessageService,
              private idService: IdService,
              private dialogService: DialogService) {
    const initialUnit = UnitFactory.createUnit(this.EXPORTED_MODULE_VERSION);
    const initialPage = UnitFactory.createUnitPage(0);
    const initialSection = UnitFactory.createUnitPageSection();
    initialPage.sections.push(initialSection);
    initialUnit.pages.push(initialPage);

    this._unit = new BehaviorSubject(initialUnit);
  }

  get unit(): Observable<Unit> {
    return this._unit.asObservable();
  }

  addPage(): void {
    const newPage = UnitFactory.createUnitPage(this._unit.value.pages.length);
    newPage.sections.push(UnitFactory.createUnitPageSection());
    this._unit.value.pages.push(newPage);
    this._unit.next(this._unit.value);
  }

  deletePage(index: number): void {
    this._unit.value.pages.splice(index, 1);
    this._unit.next(this._unit.value);
  }

  /** Checks if a page already has this setting. Return false if so.
   * When newState is false it is always okay. */
  setPageAlwaysVisible(newState: boolean): boolean {
    if (!newState || !this._unit.value.pages.find(page => page.alwaysVisible)) {
      this._unit.value.pages[this.selectedPageIndex].alwaysVisible = newState;
      return true;
    }
    this.messageService.showError('Kann nur für eine Seite gesetzt werden');
    return false;
  }

  addSection(): void {
    this._unit.value.pages[this.selectedPageIndex].sections.push(UnitFactory.createUnitPageSection());
    this._unit.next(this._unit.value);
  }

  deleteSection(section: UnitPageSection): void {
    if (this._unit.value.pages[this.selectedPageIndex].sections.length < 2) {
      this.messageService.showWarning('cant delete last section');
    } else {
      this._unit.value.pages[this.selectedPageIndex].sections.splice(
        this._unit.value.pages[this.selectedPageIndex].sections.indexOf(section),
        1
      );
      this._unit.next(this._unit.value);
    }
  }

  moveSection(sectionIndex: number, direction: 'up' | 'down'): void {
    const movedElement = this._unit.value.pages[this.selectedPageIndex].sections[sectionIndex];
    this._unit.value.pages[this.selectedPageIndex].sections.splice(sectionIndex, 1);
    if (direction === 'up') {
      this._unit.value.pages[this.selectedPageIndex].sections.splice(sectionIndex - 1, 0, movedElement);
    } else {
      this._unit.value.pages[this.selectedPageIndex].sections.splice(sectionIndex + 1, 0, movedElement);
    }
  }

  async addElementToSection(elementType: string, section: UnitPageSection): Promise<void> {
    let newElement: UnitUIElement;
    switch (elementType) {
      case 'text':
        newElement = UnitFactory.createTextElement();
        break;
      case 'button':
        newElement = UnitFactory.createButtonElement();
        break;
      case 'text-field':
        newElement = UnitFactory.createTextfieldElement();
        break;
      case 'text-area':
        newElement = UnitFactory.createTextareaElement();
        break;
      case 'checkbox':
        newElement = UnitFactory.createCheckboxElement();
        break;
      case 'dropdown':
        newElement = UnitFactory.createDropdownElement();
        break;
      case 'radio':
        newElement = UnitFactory.createRadioButtonGroupElement();
        break;
      case 'image':
        newElement = UnitFactory.createImageElement(await FileService.loadImage());
        break;
      case 'audio':
        newElement = UnitFactory.createAudioElement(await FileService.loadAudio());
        break;
      case 'video':
        newElement = UnitFactory.createVideoElement(await FileService.loadVideo());
        break;
      case 'correction':
        newElement = UnitFactory.createCorrectionElement();
        break;
      default:
        throw new Error(`ElementType ${elementType} not found!`);
    }
    newElement.id = this.idService.getNewID(elementType);
    newElement.dynamicPositioning = section.dynamicPositioning;
    section.elements.push(newElement);
  }

  deleteElementsFromSection(elements: UnitUIElement[], section: UnitPageSection): void {
    section.elements = section.elements.filter(element => !elements.includes(element));
  }

  duplicateElementsInSection(elements: UnitUIElement[], section: UnitPageSection): void {
    elements.forEach((element: UnitUIElement) => {
      const newElement: UnitUIElement = { ...element };
      newElement.id = this.idService.getNewID(newElement.type);
      newElement.xPosition += 10;
      newElement.yPosition += 10;
      section.elements.push(newElement);
    });
  }

  updateElementProperty(elements: UnitUIElement[], property: string, value: string | number | boolean | undefined): boolean {
    elements.forEach((element: UnitUIElement) => {
      if (['string', 'number', 'boolean', 'undefined'].indexOf(typeof element[property]) > -1) {
        if (property === 'id') {
          if (!this.idService.isIdAvailable((value as string))) { // prohibit existing IDs
            this.messageService.showError('ID ist bereits vergeben');
            return false;
          }
          this.idService.removeId(element[property]);
          this.idService.addId(<string>value);
        }
        element[property] = value;
      } else if (Array.isArray(element[property])) {
        (element[property] as string[]).push(value as string);
      } else {
        console.error('ElementProperty not found!', element[property]);
      }
      this.elementPropertyUpdated.next(); // notify properties panel/element about change
      return true;
    });
    return true;
  }

  alignElements(elements: UnitUIElement[], alignmentDirection: 'left' | 'right' | 'top' | 'bottom'): void {
    let newValue: number;
    switch (alignmentDirection) {
      case 'left':
        newValue = Math.min(...elements.map(element => element.xPosition));
        elements.forEach((element: UnitUIElement) => {
          element.xPosition = newValue;
        });
        break;
      case 'right':
        newValue = Math.max(...elements.map(element => element.xPosition + element.width));
        elements.forEach((element: UnitUIElement) => {
          element.xPosition = newValue - element.width;
        });
        break;
      case 'top':
        newValue = Math.min(...elements.map(element => element.yPosition));
        elements.forEach((element: UnitUIElement) => {
          element.yPosition = newValue;
        });
        break;
      case 'bottom':
        newValue = Math.max(...elements.map(element => element.yPosition + element.height));
        elements.forEach((element: UnitUIElement) => {
          element.yPosition = newValue - element.height;
        });
        break;
      // no default
    }
    this.elementPropertyUpdated.next();
  }

  updateSectionProperty(section: UnitPageSection, property: string, value: string | number | boolean): void {
    if (property === 'dynamicPositioning') {
      this.setSectionDynamicPositioning(section, value as boolean);
    } else {
      section[property] = value;
    }
    this.elementPropertyUpdated.next();
  }

  setSectionDynamicPositioning(section: UnitPageSection, value: boolean): void {
    section.dynamicPositioning = value;
    section.elements.forEach((element: UnitUIElement) => {
      element.dynamicPositioning = value;
    });
  }

  getUnitAsJSON(): string {
    return JSON.stringify({
      ...this._unit.value
    });
  }

  saveUnit(): void {
    FileService.saveUnitToFile(this.getUnitAsJSON());
  }

  async loadUnit(): Promise<void> {
    const newUnit = JSON.parse(await FileService.loadFile(['.json']));
    this._unit.next(newUnit);
    this.idService.readExistingIDs(this._unit.value);
  }

  showDefaultEditDialog(element: UnitUIElement): void {
    switch (element.type) {
      case 'button':
      case 'checkbox':
      case 'dropdown':
      case 'radio':
        this.dialogService.showTextEditDialog((element as any).label, false).subscribe((result: string) => {
          if (result) {
            this.updateElementProperty([element], 'label', result);
          }
        });
        break;
      case 'text':
        this.dialogService.showTextEditDialog((element as any).text, true).subscribe((result: string) => {
          if (result) {
            this.updateElementProperty([element], 'text', result);
          }
        });
        break;
      case 'text-field':
        this.dialogService.showTextEditDialog((element as any).value).subscribe((result: string) => {
          if (result) {
            this.updateElementProperty([element], 'value', result);
          }
        });
        break;
      case 'text-area':
        this.dialogService.showTextEditDialog((element as any).value, true).subscribe((result: string) => {
          if (result) {
            this.updateElementProperty([element], 'value', result);
          }
        });
      // no default
    }
  }
}
