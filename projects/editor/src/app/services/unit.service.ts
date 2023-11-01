import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from 'common/services/file.service';
import { MessageService } from 'common/services/message.service';
import { ArrayUtils } from 'common/util/array';
import { Unit, UnitProperties } from 'common/models/unit';
import {
  PlayerProperties,
  PositionProperties,
  PropertyGroupGenerators
} from 'common/models/elements/property-group-interfaces';
import { DragNDropValueObject, TextLabel } from 'common/models/elements/label-interfaces';
import { Hotspot } from 'common/models/elements/input-elements/hotspot-image';
import {
  CompoundElement, InputElement, InputElementValue, PlayerElement, PositionedUIElement,
  UIElement, UIElementProperties, UIElementType, UIElementValue
} from 'common/models/elements/element';
import { ClozeDocument, ClozeElement } from 'common/models/elements/compound-elements/cloze/cloze';
import { LikertRowElement } from 'common/models/elements/compound-elements/likert/likert-row';
import { TextElement } from 'common/models/elements/text/text';
import { DropListElement } from 'common/models/elements/input-elements/drop-list';
import { Page } from 'common/models/page';
import { Section } from 'common/models/section';
import { ElementFactory } from 'common/util/element.factory';
import { GeometryProperties } from 'common/models/elements/geometry/geometry';
import { AudioProperties } from 'common/models/elements/media-elements/audio';
import { VideoProperties } from 'common/models/elements/media-elements/video';
import { ImageProperties } from 'common/models/elements/media-elements/image';
import { StateVariable } from 'common/models/state-variable';
import { VisibilityRule } from 'common/models/visibility-rule';
import { VersionManager } from 'common/services/version-manager';
import { ReferenceManager } from 'editor/src/app/services/reference-manager';
import { DialogService } from './dialog.service';
import { VeronaAPIService } from './verona-api.service';
import { SelectionService } from './selection.service';
import { IDService } from './id.service';
import { UnitDefinitionSanitizer } from './sanitizer';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  unit: Unit;
  elementPropertyUpdated: Subject<void> = new Subject<void>();
  geometryElementPropertyUpdated: Subject<string> = new Subject<string>();
  referenceManager: ReferenceManager;
  private ngUnsubscribe = new Subject<void>();

  constructor(private selectionService: SelectionService,
              private veronaApiService: VeronaAPIService,
              private messageService: MessageService,
              private dialogService: DialogService,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService,
              private idService: IDService) {
    this.unit = new Unit();
    this.referenceManager = new ReferenceManager(this.unit);
  }

  loadUnitDefinition(unitDefinition: string): void {
    if (unitDefinition) {
      try {
        let unitDef = JSON.parse(unitDefinition);
        if (!VersionManager.hasCompatibleVersion(unitDef)) {
          if (VersionManager.isNewer(unitDef)) {
            throw Error('Unit-Version ist neuer als dieser Editor. Bitte mit der neuesten Version öffnen.');
          }
          if (!VersionManager.needsSanitization(unitDef)) {
            throw Error('Unit-Version ist veraltet. Sie kann mit Version 1.38/1.39 aktualisiert werden.');
          }
          this.dialogService.showSanitizationDialog().subscribe(() => {
            unitDef = UnitDefinitionSanitizer.sanitizeUnit(unitDef);
            this.loadUnit(unitDef);
            this.unitUpdated();
          });
        } else {
          this.loadUnit(unitDef);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        if (e instanceof Error) this.dialogService.showUnitDefErrorDialog(e.message);
      }
    } else {
      this.idService.reset();
      this.unit = new Unit();
      this.referenceManager = new ReferenceManager(this.unit);
    }
  }

  private loadUnit(parsedUnitDefinition?: string): void {
    this.idService.reset();
    this.unit = new Unit(parsedUnitDefinition as unknown as UnitProperties);
    this.idService.registerUnitIds(this.unit);
    this.referenceManager = new ReferenceManager(this.unit);

    const invalidRefs = this.referenceManager.getAllInvalidRefs();
    if (invalidRefs.length > 0) {
      this.referenceManager.removeInvalidRefs(invalidRefs);
      this.messageService.showFixedReferencePanel(invalidRefs);
      this.unitUpdated();
    }
  }

  unitUpdated(): void {
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  addPage(): void {
    this.unit.pages.push(new Page());
    this.selectionService.selectedPageIndex = this.unit.pages.length - 1;
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  deletePage(pageIndex: number): void {
    this.unit.pages.splice(pageIndex, 1);
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  moveSelectedPage(direction: 'left' | 'right') {
    if (this.unit.canPageBeMoved(this.selectionService.selectedPageIndex, direction)) {
      this.unit.movePage(this.selectionService.selectedPageIndex, direction);
      this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
    } else {
      this.messageService.showWarning('Seite kann nicht verschoben werden.');
    }
  }

  addSection(page: Page, section?: Section): void {
    // register section IDs
    if (section) {
      section.elements.forEach(element => {
        if (['drop-list', 'drop-list-simple'].includes((element as UIElement).type as string)) {
          (element as DropListElement).value.forEach(value => this.idService.addID(value.id));
        }
        this.idService.addID(element.id);
      });
    }
    page.sections.push(
      section || new Section()
    );
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  deleteSection(pageIndex: number, sectionIndex: number): void {
    this.freeUpIds(this.unit.pages[pageIndex].sections[sectionIndex].getAllElements());
    this.unit.pages[pageIndex].sections.splice(sectionIndex, 1);
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  duplicateSection(section: Section, page: Page, sectionIndex: number): void {
    const newSection: Section = new Section({
      ...section,
      elements: section.elements.map(element => this.duplicateElement(element) as PositionedUIElement)
    });
    page.sections.splice(sectionIndex + 1, 0, newSection);
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  moveSection(section: Section, page: Page, direction: 'up' | 'down'): void {
    ArrayUtils.moveArrayItem(section, page.sections, direction);
    if (direction === 'up' && this.selectionService.selectedPageSectionIndex > 0) {
      this.selectionService.selectedPageSectionIndex -= 1;
    } else if (direction === 'down') {
      this.selectionService.selectedPageSectionIndex += 1;
    }
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  addElementToSectionByIndex(elementType: UIElementType,
                             pageIndex: number,
                             sectionIndex: number): void {
    this.addElementToSection(elementType, this.unit.pages[pageIndex].sections[sectionIndex]);
  }

  async addElementToSection(elementType: UIElementType, section: Section,
                            coordinates?: { x: number, y: number }): Promise<void> {
    const newElementProperties: Partial<UIElementProperties> = {};
    if (['geometry'].includes(elementType)) {
      (newElementProperties as GeometryProperties).appDefinition =
        await firstValueFrom(this.dialogService.showGeogebraAppDefinitionDialog());
      if (!(newElementProperties as GeometryProperties).appDefinition) return; // dialog canceled
    }
    if (['audio', 'video', 'image', 'hotspot-image'].includes(elementType)) {
      let mediaSrc = '';
      switch (elementType) {
        case 'hotspot-image':
        case 'image':
          mediaSrc = await FileService.loadImage();
          break;
        case 'audio':
          mediaSrc = await FileService.loadAudio();
          break;
        case 'video':
          mediaSrc = await FileService.loadVideo();
          break;
        // no default
      }
      (newElementProperties as AudioProperties | VideoProperties | ImageProperties).src = mediaSrc;
    }

    if (coordinates) {
      newElementProperties.position = {
        ...(section.dynamicPositioning && { gridColumn: coordinates.x }),
        ...(section.dynamicPositioning && { gridRow: coordinates.y }),
        ...(!section.dynamicPositioning && { yPosition: coordinates.y }),
        ...(!section.dynamicPositioning && { yPosition: coordinates.y })
      } as PositionProperties;
    }

    section.addElement(ElementFactory.createElement({
      type: elementType,
      position: PropertyGroupGenerators.generatePositionProps(newElementProperties.position),
      ...newElementProperties,
      id: this.idService.getAndRegisterNewID(elementType)
    }) as PositionedUIElement);
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  deleteElements(elements: UIElement[]): void {
    const refs =
      this.referenceManager.getElementsReferences(elements);
    // console.log('element refs', refs);
    if (refs.length > 0) {
      this.dialogService.showDeleteReferenceDialog(refs)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: boolean) => {
          if (result) {
            ReferenceManager.deleteReferences(refs);
            this.freeUpIds(elements);
            this.unit.pages[this.selectionService.selectedPageIndex].sections.forEach(section => {
              section.elements = section.elements.filter(element => !elements.includes(element));
            });
            this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
          } else {
            this.messageService.showReferencePanel(refs);
          }
        });
    } else {
      this.dialogService.showConfirmDialog('Element(e) löschen?')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: boolean) => {
          if (result) {
            this.freeUpIds(elements);
            this.unit.pages[this.selectionService.selectedPageIndex].sections.forEach(section => {
              section.elements = section.elements.filter(element => !elements.includes(element));
            });
            this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
          }
        });
    }
  }

  private freeUpIds(elements: UIElement[]): void {
    elements.forEach(element => {
      if (element.type === 'drop-list') {
        ((element as DropListElement).value as DragNDropValueObject[]).forEach((value: DragNDropValueObject) => {
          this.idService.removeId(value.id);
        });
      }
      if (element instanceof CompoundElement) {
        element.getChildElements().forEach((childElement: UIElement) => {
          this.idService.removeId(childElement.id);
        });
      }
      this.idService.removeId(element.id);
    });
  }

  /* Move element between sections */
  transferElement(elements: UIElement[], previousSection: Section, newSection: Section): void {
    previousSection.elements = previousSection.elements.filter(element => !elements.includes(element));
    elements.forEach(element => {
      newSection.elements.push(element as PositionedUIElement);
    });
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  duplicateSelectedElements(): void {
    const selectedSection =
      this.unit.pages[this.selectionService.selectedPageIndex].sections[this.selectionService.selectedPageSectionIndex];
    this.selectionService.getSelectedElements().forEach((element: UIElement) => {
      selectedSection.elements.push(this.duplicateElement(element, true) as PositionedUIElement);
    });
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  /* - Also changes position of the element to not cover copied element.
     - Also changes and registers all copied IDs. */
  private duplicateElement(element: UIElement, adjustPosition: boolean = false): UIElement {
    const newElement = element.getDuplicate();

    if (newElement.position && adjustPosition) {
      newElement.position.xPosition += 10;
      newElement.position.yPosition += 10;
      newElement.position.gridRow = null;
      newElement.position.gridColumn = null;
    }

    newElement.id = this.idService.getAndRegisterNewID(newElement.type);
    if (newElement instanceof CompoundElement) {
      newElement.getChildElements().forEach((child: UIElement) => {
        child.id = this.idService.getAndRegisterNewID(child.type);
      });
    }

    // Special care with DropLists as they are no CompoundElement yet still have children with IDs
    if (newElement.type === 'drop-list') {
      (newElement.value as DragNDropValueObject[]).forEach(valueObject => {
        valueObject.id = this.idService.getAndRegisterNewID('value');
      });
    }
    return newElement;
  }

  updateSectionProperty(section: Section, property: string, value: string | number | boolean | VisibilityRule[] | { value: number; unit: string }[]): void {
    section.setProperty(property, value);
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  updateElementsProperty(elements: UIElement[],
                         property: string,
                         value: InputElementValue | LikertRowElement[] | Hotspot[] | StateVariable |
                         TextLabel | TextLabel[] | ClozeDocument | null): void {
    console.log('updateElementProperty', elements, property, value);
    elements.forEach(element => {
      if (property === 'id') {
        if (this.idService.validateAndAddNewID(value as string, element.id)) {
          element.setProperty('id', value);
        }
      } else if (element.type === 'text' && property === 'text') {
        this.handleTextElementChange(element as TextElement, value as string);
      } else if (property === 'document') {
        this.handleClozeDocumentChange(element as ClozeElement, value as ClozeDocument);
      } else {
        element.setProperty(property, value);
        if (element.type === 'geometry') this.geometryElementPropertyUpdated.next(element.id);
      }
    });
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  handleTextElementChange(element: TextElement, value: string): void {
    const deletedAnchorIDs = UnitService.getRemovedTextAnchorIDs(element, value);
    const refs = this.referenceManager.getTextAnchorReferences(deletedAnchorIDs);
    if (refs.length > 0) {
      this.dialogService.showDeleteReferenceDialog(refs)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: boolean) => {
          if (result) {
            ReferenceManager.deleteReferences(refs);
            element.setProperty('text', value);
          } else {
            this.messageService.showReferencePanel(refs);
          }
        });
    } else {
      element.setProperty('text', value);
    }
  }

  static getRemovedTextAnchorIDs(element: TextElement, newValue: string): string[] {
    return TextElement.getAnchorIDs(element.text)
      .filter(el => !TextElement.getAnchorIDs(newValue).includes(el));
  }

  handleClozeDocumentChange(element: ClozeElement, newValue: ClozeDocument): void {
    const deletedElements = UnitService.getRemovedClozeElements(element, newValue);
    const refs = this.referenceManager.getElementsReferences(deletedElements);
    if (refs.length > 0) {
      this.dialogService.showDeleteReferenceDialog(refs)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: boolean) => {
          if (result) {
            ReferenceManager.deleteReferences(refs);
            this.applyClozeDocumentChange(element, newValue);
          } else {
            this.messageService.showReferencePanel(refs);
          }
        });
    } else {
      this.applyClozeDocumentChange(element, newValue);
    }
  }

  applyClozeDocumentChange(element: ClozeElement, value: ClozeDocument): void {
    element.setProperty('document', value);
    ClozeElement.getDocumentChildElements(value as ClozeDocument).forEach(clozeChild => {
      if (clozeChild.id === 'cloze-child-id-placeholder') {
        clozeChild.id = this.idService.getAndRegisterNewID(clozeChild.type);
        delete clozeChild.position;
      }
    });
  }

  static getRemovedClozeElements(cloze: ClozeElement, newClozeDoc: ClozeDocument): UIElement[] {
    const newElements = ClozeElement.getDocumentChildElements(newClozeDoc);
    return cloze.getChildElements()
      .filter(element => !newElements.includes(element));
  }

  updateSelectedElementsPositionProperty(property: string, value: UIElementValue): void {
    this.updateElementsPositionProperty(this.selectionService.getSelectedElements(), property, value);
  }

  updateElementsPositionProperty(elements: UIElement[], property: string, value: UIElementValue): void {
    elements.forEach(element => {
      element.setPositionProperty(property, value);
    });
    this.reorderElements();
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  updateElementsDimensionsProperty(elements: UIElement[], property: string, value: number | null): void {
    console.log('updateElementsDimensionsProperty', property, value);
    elements.forEach(element => {
      element.setDimensionsProperty(property, value);
    });
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  /* Reorder elements by their position properties, so the tab order is correct */
  reorderElements() {
    const sectionElementList = this.unit.pages[this.selectionService.selectedPageIndex]
      .sections[this.selectionService.selectedPageSectionIndex].elements;
    const isDynamicPositioning = this.unit.pages[this.selectionService.selectedPageIndex]
      .sections[this.selectionService.selectedPageSectionIndex].dynamicPositioning;
    const sortDynamicPositioning = (a: PositionedUIElement, b: PositionedUIElement) => {
      const rowSort =
        (a.position.gridRow !== null ? a.position.gridRow : Infinity) -
        (b.position.gridRow !== null ? b.position.gridRow : Infinity);
      if (rowSort === 0) {
        return a.position.gridColumn! - b.position.gridColumn!;
      }
      return rowSort;
    };
    const sortStaticPositioning = (a: PositionedUIElement, b: PositionedUIElement) => {
      const ySort = a.position.yPosition! - b.position.yPosition!;
      if (ySort === 0) {
        return a.position.xPosition! - b.position.xPosition!;
      }
      return ySort;
    };
    if (isDynamicPositioning) {
      sectionElementList.sort(sortDynamicPositioning);
    } else {
      sectionElementList.sort(sortStaticPositioning);
    }
  }

  updateSelectedElementsStyleProperty(property: string, value: UIElementValue): void {
    const elements = this.selectionService.getSelectedElements();
    elements.forEach(element => {
      element.setStyleProperty(property, value);
    });
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  updateElementsPlayerProperty(elements: UIElement[], property: string, value: UIElementValue): void {
    elements.forEach(element => {
      element.setPlayerProperty(property, value);
    });
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  alignElements(elements: PositionedUIElement[], alignmentDirection: 'left' | 'right' | 'top' | 'bottom'): void {
    switch (alignmentDirection) {
      case 'left':
        this.updateElementsProperty(
          elements,
          'xPosition',
          Math.min(...elements.map(element => element.position.xPosition))
        );
        break;
      case 'right':
        this.updateElementsProperty(
          elements,
          'xPosition',
          Math.max(...elements.map(element => element.position.xPosition))
        );
        break;
      case 'top':
        this.updateElementsProperty(
          elements,
          'yPosition',
          Math.min(...elements.map(element => element.position.yPosition))
        );
        break;
      case 'bottom':
        this.updateElementsProperty(
          elements,
          'yPosition',
          Math.max(...elements.map(element => element.position.yPosition))
        );
        break;
      // no default
    }
    this.elementPropertyUpdated.next();
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }

  saveUnit(): void {
    FileService.saveUnitToFile(JSON.stringify(this.unit));
  }

  async loadUnitFromFile(): Promise<void> {
    this.loadUnitDefinition(await FileService.loadFile(['.json', '.voud']));
  }

  showDefaultEditDialog(element: UIElement): void {
    switch (element.type) {
      case 'button':
      case 'dropdown':
      case 'checkbox':
      case 'radio':
        this.dialogService.showTextEditDialog(element.label as string).subscribe((result: string) => {
          if (result) {
            this.updateElementsProperty([element], 'label', result);
          }
        });
        break;
      case 'text':
        this.dialogService.showRichTextEditDialog(
          (element as TextElement).text,
          (element as TextElement).styling.fontSize
        ).subscribe((result: string) => {
          if (result) {
            // TODO add proper sanitization
            this.updateElementsProperty(
              [element],
              'text',
              (this.sanitizer.bypassSecurityTrustHtml(result) as any).changingThisBreaksApplicationSecurity as string
            );
          }
        });
        break;
      case 'cloze':
        this.dialogService.showClozeTextEditDialog(
          (element as ClozeElement).document!,
          (element as ClozeElement).styling.fontSize
        ).subscribe((result: string) => {
          if (result) {
            // TODO add proper sanitization
            this.updateElementsProperty(
              [element],
              'document',
              (this.sanitizer.bypassSecurityTrustHtml(result) as any).changingThisBreaksApplicationSecurity as string
            );
          }
        });
        break;
      case 'text-field':
        this.dialogService.showTextEditDialog((element as InputElement).value as string)
          .subscribe((result: string) => {
            if (result) {
              this.updateElementsProperty([element], 'value', result);
            }
          });
        break;
      case 'text-area':
        this.dialogService.showMultilineTextEditDialog((element as InputElement).value as string)
          .subscribe((result: string) => {
            if (result) {
              this.updateElementsProperty([element], 'value', result);
            }
          });
        break;
      case 'audio':
      case 'video':
        this.dialogService.showPlayerEditDialog(element.id, (element as PlayerElement).player)
          .subscribe((result: PlayerProperties) => {
            if (!result) return;
            Object.keys(result).forEach(
              key => this.updateElementsPlayerProperty([element], key, result[key] as UIElementValue)
            );
          });
        break;
      // no default
    }
  }

  getNewValueID(): string {
    return this.idService.getAndRegisterNewID('value');
  }

  /* Used by props panel to show available dropLists to connect */
  getAllDropListElementIDs(): string[] {
    const allDropLists = [
      ...this.unit.getAllElements('drop-list'),
      ...this.unit.getAllElements('drop-list-simple')];
    return allDropLists.map(dropList => dropList.id);
  }

  replaceSection(pageIndex: number, sectionIndex: number, newSection: Section): void {
    this.deleteSection(pageIndex, sectionIndex);
    this.addSection(this.unit.pages[pageIndex], newSection);
  }

  updateStateVariables(stateVariables: StateVariable[]): void {
    this.unit.stateVariables = stateVariables;
    this.veronaApiService.sendVoeDefinitionChangedNotification(this.unit);
  }
}
