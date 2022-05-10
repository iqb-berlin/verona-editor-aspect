import { Injectable } from '@angular/core';
import packageJSON from '../../../package.json';
import { ClozeUtils } from 'common/util/cloze';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import ToggleButtonExtension from 'common/ui-elements/cloze/tiptap-editor-extensions/toggle-button';
import DropListExtension from 'common/ui-elements/cloze/tiptap-editor-extensions/drop-list';
import TextFieldExtension from 'common/ui-elements/cloze/tiptap-editor-extensions/text-field';
import { IDService } from './id.service';
import { Page, Section, Unit } from 'common/classes/unit';
import {
  BasicStyles, ExtendedStyles,
  InputElement, PlayerProperties,
  PositionedUIElement, PositionProperties,
  UIElement
} from 'common/classes/element';
import {
  DragNDropValueObject,
  UIElementValue
} from 'common/interfaces/elements';
import { LikertElement } from 'common/ui-elements/likert/likert';
import { RadioButtonGroupElement } from 'common/ui-elements/radio/radio-button-group';
import { ToggleButtonElement } from 'common/ui-elements/cloze/toggle-button';
import { LikertRowElement } from 'common/ui-elements/likert/likert-row';
import { TextElement } from 'common/ui-elements/text/text';
import {
  ClozeDocument,
  ClozeDocumentParagraph,
  ClozeDocumentParagraphPart,
  ClozeElement
} from 'common/ui-elements/cloze/cloze';
import { DropListElement } from 'common/ui-elements/drop-list/drop-list';

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {

  constructor(private iDService: IDService) { }

  private static expectedUnitVersion: [number, number, number] =
    packageJSON.config.unit_definition_version.split('.') as unknown as [number, number, number];

  private static unitDefinitionVersion: [number, number, number] | undefined;

  static isUnitDefinitionOutdated(unitDefinition: Unit): boolean {
    SanitizationService.unitDefinitionVersion =
      SanitizationService.readUnitDefinitionVersion(unitDefinition as unknown as Record<string, string>);
    return SanitizationService.isVersionOlderThanCurrent(SanitizationService.unitDefinitionVersion);
  }

  sanitizeUnitDefinition(unitDefinition: Unit): Unit {
    return {
      ...unitDefinition,
      pages: unitDefinition.pages.map((page: Page) => this.sanitizePage(page))
    };
  }

  private static readUnitDefinitionVersion(unitDefinition: Record<string, string>): [number, number, number] {
    return (
      unitDefinition.version ||
      (unitDefinition.unitDefinitionType && unitDefinition.unitDefinitionType.split('@')[1]) ||
      (unitDefinition.veronaModuleVersion && unitDefinition.veronaModuleVersion.split('@')[1]))
      .split('.') as unknown as [number, number, number];
  }

  private static isVersionOlderThanCurrent(version: [number, number, number]): boolean {
    if (!version) return true;
    if (version[0] < SanitizationService.expectedUnitVersion[0]) {
      return true;
    }
    if (version[1] < SanitizationService.expectedUnitVersion[1]) {
      return true;
    }
    return version[2] < SanitizationService.expectedUnitVersion[2];
  }

  private sanitizePage(page: Page): Page {
    return {
      ...page,
      sections: page.sections.map((section: Section) => this.sanitizeSection(section))
    };
  }

  private sanitizeSection(section: Section): Section {
    return {
      ...section,
      elements: section.elements.map((element: UIElement) => (
        this.sanitizeElement(element, section.dynamicPositioning))) as PositionedUIElement[]
    } as Section;
  }

  private sanitizeElement(element: Record<string, UIElementValue>,
                          sectionDynamicPositioning?: boolean): UIElement {
    let newElement: Partial<UIElement> = {
      ...element,
      position: SanitizationService.getPositionProps(element, sectionDynamicPositioning),
      styling: SanitizationService.getStyleProps(element) as unknown as BasicStyles & ExtendedStyles,
      player: SanitizationService.getPlayerProps(element)
    };
    if (newElement.type === 'text') {
      newElement = SanitizationService.handleTextElement(newElement);
    }
    if (['text-field', 'text-area']
      .includes(newElement.type as string)) {
      newElement = SanitizationService.sanitizeTextFieldElement(newElement);
    }
    if (newElement.type === 'cloze') {
      newElement = this.handleClozeElement(newElement as Record<string, UIElementValue>);
    }
    if (newElement.type === 'toggle-button') {
      newElement = SanitizationService.handleToggleButtonElement(newElement as ToggleButtonElement);
    }
    if (newElement.type === 'drop-list') {
      newElement = this.handleDropListElement(newElement as Record<string, UIElementValue>);
    }
    if (['dropdown', 'radio', 'likert-row', 'radio-group-images', 'toggle-button']
      .includes(newElement.type as string)) {
      newElement = SanitizationService.handlePlusOne(newElement as InputElement);
    }
    if (['radio'].includes(newElement.type as string)) {
      newElement = SanitizationService.handleRadioButtonGroupElement(newElement as RadioButtonGroupElement);
    }
    if (['likert'].includes(newElement.type as string)) {
      newElement = this.handleLikertElement(newElement as LikertElement);
    }
    if (['likert-row', 'likert_row'].includes(newElement.type as string)) {
      newElement = SanitizationService.handleLikertRowElement(newElement as LikertRowElement);
    }

    return newElement as unknown as UIElement;
  }

  private static getPositionProps(element: Record<string, any>,
                                  sectionDynamicPositioning?: boolean): PositionProperties {
    if (element.position && element.position.gridColumnEnd) {
      return {
        ...element.position,
        dynamicPositioning: sectionDynamicPositioning,
        gridColumn: element.position.gridColumn !== undefined ?
          element.position.gridColumn : element.position.gridColumnStart,
        gridColumnRange: element.position.gridColumnEnd - element.position.gridColumnStart,
        gridRow: element.position.gridRow !== undefined ?
          element.position.gridRow : element.position.gridRowStart,
        gridRowRange: element.position.gridRowEnd - element.position.gridRowStart
      };
    }
    if (element.position) {
      return {
        ...element.position,
        dynamicPositioning: sectionDynamicPositioning
      };
    }
    if (element.positionProps) {
      return {
        ...element.positionProps,
        dynamicPositioning: sectionDynamicPositioning,
        gridColumn: element.positionProps.gridColumn !== undefined ?
          element.positionProps.gridColumn : element.positionProps.gridColumnStart,
        gridColumnRange: element.positionProps.gridColumnEnd - element.positionProps.gridColumnStart,
        gridRow: element.positionProps.gridRow !== undefined ?
          element.positionProps.gridRow : element.positionProps.gridRowStart,
        gridRowRange: element.positionProps.gridRowEnd - element.positionProps.gridRowStart
      };
    }
    return {
      ...element,
      dynamicPositioning: sectionDynamicPositioning,
      gridColumn: element.gridColumn !== undefined ?
        element.gridColumn : element.gridColumnStart,
      gridColumnRange: element.gridColumnEnd - element.gridColumnStart,
      gridRow: element.gridRow !== undefined ?
        element.gridRow : element.gridRowStart,
      gridRowRange: element.gridRowEnd - element.gridRowStart
    } as PositionProperties;
  }

  /* Style properties are expected to be in 'stylings'. If not they may be in fontProps and/or
  *  surfaceProps. Even older versions had them in the root of the object, which is uses as last resort.
  *  The styles object then has all other properties of the element, but that is not a problem
  *  since the factory methods only use the values they care for and all others are discarded. */
  private static getStyleProps(element: Record<string, UIElementValue>): Record<string, UIElementValue> {
    if (element.styling !== undefined) {
      return element.styling as Record<string, UIElementValue>;
    }
    if (element.fontProps !== undefined) {
      return {
        ...(element.fontProps as Record<string, any>),
        // additional props that were neither fontProp nor surfaceProp before
        backgroundColor: (element.surfaceProps as Record<string, any>)?.backgroundColor,
        borderRadius: element.borderRadius as number | undefined,
        itemBackgroundColor: element.itemBackgroundColor as string | undefined,
        borderWidth: element.borderWidth as number | undefined,
        borderColor: element.borderColor as string | undefined,
        borderStyle: element.borderStyle as
          'solid' | 'dotted' | 'dashed' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | undefined,
        lineColoring: element.lineColoring as boolean | undefined,
        lineColoringColor: element.lineColoringColor as string | undefined
      };
    }
    return element;
  }

  private static getPlayerProps(element: Record<string, UIElementValue>): PlayerProperties {
    if (element.playerProps !== undefined) {
      return element.playerProps as PlayerProperties;
    } else if (element.player !== undefined) {
      return element.player as PlayerProperties;
    }
    return element as unknown as PlayerProperties;
  }

  private static handleTextElement(element: Record<string, UIElementValue>): TextElement {
    const newElement = { ...element };
    if (newElement.highlightable || newElement.interaction === 'highlightable') {
      newElement.highlightableYellow = true;
      newElement.highlightableTurquoise = true;
      newElement.highlightableOrange = true;
    }
    if (newElement.interaction === 'underlinable') {
      newElement.highlightableYellow = true;
    }
    return newElement as TextElement;
  }

  private static sanitizeTextFieldElement(element: Record<string, UIElementValue>): InputElement {
    const newElement = { ...element };
    if (newElement.restrictedToInputAssistanceChars === undefined && newElement.inputAssistancePreset === 'french') {
      newElement.restrictedToInputAssistanceChars = false;
    }
    return newElement as InputElement;
  }

  /*
  Replace raw text with backslash-markers with HTML tags.
  The TipTap editor module can create JSOM from the HTML. It needs plugins though to be able
  to create ui-elements.
  Afterwards element models are added to the JSON.
   */
  private handleClozeElement(element: Record<string, UIElementValue>): ClozeElement {
    if (!element.document && (!element.parts || !element.text)) throw Error('Can\'t read Cloze Element');

    // Version 2.0.0 needs to be sanatized as well because child elements were not sanatized before
    if (SanitizationService.unitDefinitionVersion && SanitizationService.unitDefinitionVersion[0] >= 3) {
      return element as ClozeElement;
    }

    let childElements: UIElement[];
    let doc: ClozeDocument;

    if (element.document) {
      childElements = ClozeUtils.getClozeChildElements((element as ClozeElement));
      doc = element.document as ClozeDocument;
    } else {
      childElements = (element.parts as any[])
        .map((el: any) => el
          .filter((el2: { type: string; }) => ['text-field', 'text-field-simple', 'drop-list', 'drop-list', 'toggle-button']
            .includes(el2.type)).value)
        .flat();
      doc = SanitizationService.createClozeDocument(element);
    }

    // repair child element types
    childElements.forEach(childElement => {
      childElement.type = childElement.type === 'text-field' ? 'text-field-simple' : childElement.type;
      childElement.type = childElement.type === 'drop-list' ? 'drop-list-simple' : childElement.type;
    });

    return new ClozeElement({
      ...element,
      document: {
        ...doc,
        content: doc.content
          .map((paragraph: ClozeDocumentParagraph) => ({
            ...paragraph,
            content: paragraph.content ? paragraph.content
              .map((paraPart: ClozeDocumentParagraphPart) => (
                ['TextField', 'DropList', 'ToggleButton'].includes(paraPart.type) ?
                  {
                    ...paraPart,
                    attrs: {
                      ...paraPart.attrs,
                      model: this.sanitizeElement(childElements.shift()!)
                    }
                  } :
                  {
                    ...paraPart
                  }
              )) : undefined
          }))
      } as ClozeDocument
    });
  }

  private static createClozeDocument(element: Record<string, UIElementValue>): ClozeDocument {
    const replacedText = (element.text as string).replace(/\\i|\\z|\\r/g, (match: string) => {
      switch (match) {
        case '\\i':
          return '<aspect-nodeview-text-field></aspect-nodeview-text-field>';
        case '\\z':
          return '<aspect-nodeview-drop-list></aspect-nodeview-drop-list>';
        case '\\r':
          return '<aspect-nodeview-toggle-button></aspect-nodeview-toggle-button>';
        default:
          throw Error('error in match');
      }
    });

    const editor = new Editor({
      extensions: [StarterKit, ToggleButtonExtension, DropListExtension, TextFieldExtension],
      content: replacedText
    });
    return editor.getJSON() as ClozeDocument;
  }

  /* before: simple string[]; after: DragNDropValueObject with ID and value.
  * Needs to be done to selectable options and the possibly set preset (value). */
  private handleDropListElement(element: Record<string, UIElementValue>): DropListElement {
    const newElement = element;
    if (newElement.options) {
      console.warn('New dropList value IDs have been generated');
      newElement.value = [];
      (newElement.options as string[]).forEach(option => {
        (newElement.value as DragNDropValueObject[]).push({
          id: this.iDService.getNewID('value'),
          stringValue: option
        });
      });
    }
    if (newElement.value && !((newElement.value as DragNDropValueObject[])[0] instanceof Object)) {
      const newValues: DragNDropValueObject[] = [];
      (newElement.value as string[]).forEach(value => {
        newValues.push({
          id: this.iDService.getNewID('value'),
          stringValue: value
        });
      });
      newElement.value = newValues;
    }
    return newElement as DropListElement;
  }

  private handleLikertElement(element: LikertElement): LikertElement {
    return new LikertElement({
      ...element,
      rows: element.rows.map((row: LikertRowElement) => this.sanitizeElement(row) as LikertRowElement)
    });
  }

  private static handleLikertRowElement(element: LikertRowElement): LikertRowElement {
    const newElement = element;
    if (newElement.rowLabel) {
      return newElement;
    }
    return new LikertRowElement({
      ...newElement,
      rowLabel: {
        text: newElement.text,
        imgSrc: null,
        position: 'above'
      }
    });
  }

  // version 1.1.0 is the only version where there was a plus one for values, which was rolled back afterwards.
  private static handlePlusOne(element: InputElement): InputElement {
    return ((SanitizationService.unitDefinitionVersion === [1, 1, 0]) && (element.value && element.value > 0)) ?
      {
        ...element,
        value: (element.value as number) - 1
      } as InputElement :
      element;
  }

  private static handleRadioButtonGroupElement(element: RadioButtonGroupElement): RadioButtonGroupElement {
    if (element.richTextOptions) {
      return element;
    }
    return new RadioButtonGroupElement({
      ...element,
      richTextOptions: element.options as string[]
    });
  }

  private static handleToggleButtonElement(element: ToggleButtonElement): ToggleButtonElement {
    if (element.richTextOptions) {
      return element;
    }
    return new ToggleButtonElement({
      ...element,
      richTextOptions: element.options as string[]
    });
  }
}
