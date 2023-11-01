import {
  CompoundElement,
  PositionedUIElement,
  UIElement,
  UIElementValue,
  PlayerElement,
  InputElement, Measurement
} from 'common/models/elements/element';
import { TextElement } from 'common/models/elements/text/text';
import { ImageElement } from 'common/models/elements/media-elements/image';
import { AnswerScheme } from 'common/models/elements/answer-scheme-interfaces';
import { VisibilityRule } from 'common/models/visibility-rule';
import { ElementFactory } from 'common/util/element.factory';
import { environment } from 'common/environment';
import { InstantiationEror } from 'common/util/errors';

export class Section {
  [index: string]: unknown;
  elements: PositionedUIElement[] = [];
  height: number = 400;
  backgroundColor: string = '#ffffff';
  dynamicPositioning: boolean = true;
  autoColumnSize: boolean = true;
  autoRowSize: boolean = true;
  gridColumnSizes: { value: number; unit: string }[] = [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
  gridRowSizes: { value: number; unit: string }[] = [{ value: 1, unit: 'fr' }];
  visibilityDelay: number = 0;
  animatedVisibility: boolean = false;
  enableReHide: boolean = false;
  logicalConnectiveOfRules: 'disjunction' | 'conjunction' = 'disjunction';
  visibilityRules: VisibilityRule[] = [];

  constructor(section?: SectionProperties) {
    if (section && isValid(section)) {
      this.height = section.height;
      this.backgroundColor = section.backgroundColor;
      this.dynamicPositioning = section.dynamicPositioning;
      this.autoColumnSize = section.autoColumnSize;
      this.autoRowSize = section.autoRowSize;
      this.gridColumnSizes = { ...section.gridColumnSizes };
      this.gridRowSizes = { ...section.gridRowSizes };
      this.visibilityDelay = section.visibilityDelay;
      this.animatedVisibility = section.animatedVisibility;
      this.enableReHide = section.enableReHide;
      this.logicalConnectiveOfRules = section.logicalConnectiveOfRules;
      this.visibilityRules = section.visibilityRules.map(rule => ({ ...rule }));
      this.elements = section.elements
        .map(element => ElementFactory.createElement(element)) as PositionedUIElement[];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationEror('Error at Section instantiation');
      }
      if (section?.height !== undefined) this.height = section.height;
      if (section?.backgroundColor !== undefined) this.backgroundColor = section.backgroundColor;
      if (section?.dynamicPositioning !== undefined) this.dynamicPositioning = section.dynamicPositioning;
      if (section?.autoColumnSize !== undefined) this.autoColumnSize = section.autoColumnSize;
      if (section?.autoRowSize !== undefined) this.autoRowSize = section.autoRowSize;
      if (section?.gridColumnSizes !== undefined) this.gridColumnSizes = { ...section.gridColumnSizes };
      if (section?.gridRowSizes !== undefined) this.gridRowSizes = { ...section.gridRowSizes };
      if (section?.visibilityDelay !== undefined) this.visibilityDelay = section.visibilityDelay;
      if (section?.animatedVisibility !== undefined) this.animatedVisibility = section.animatedVisibility;
      if (section?.enableReHide !== undefined) this.enableReHide = section.enableReHide;
      if (section?.logicalConnectiveOfRules !== undefined) this.logicalConnectiveOfRules = section.logicalConnectiveOfRules;
      if (section?.visibilityRules !== undefined) this.visibilityRules = section.visibilityRules.map(rule => ({ ...rule }));
      this.elements = section?.elements !== undefined ?
        section.elements.map(element => ElementFactory.createElement(element)) as PositionedUIElement[] :
        [];
    }
  }

  setProperty(property: string, value: UIElementValue): void {
    this[property] = value;
  }

  addElement(element: PositionedUIElement): void {
    this.elements.push(element);
  }

  /* Includes children of children, i.e. compound children. */
  getAllElements(elementType?: string): UIElement[] {
    let allElements: UIElement[] =
      this.elements.map(element => [element, ...(element as CompoundElement).getChildElements() || []])
        .flat();
    if (elementType) {
      allElements = allElements.filter(element => element.type === elementType);
    }
    return allElements;
  }

  getAnswerScheme(dropLists: UIElement[]): AnswerScheme[] {
    return this.getAllElements()
      .filter(element => element.hasAnswerScheme())
      .map(element => ((element.type === 'drop-list') ?
        (element as InputElement).getAnswerScheme(dropLists) :
        (element as InputElement | PlayerElement | TextElement | ImageElement).getAnswerScheme()));
  }
}

export interface SectionProperties {
  elements: PositionedUIElement[];
  height: number;
  backgroundColor: string;
  dynamicPositioning: boolean;
  autoColumnSize: boolean;
  autoRowSize: boolean;
  gridColumnSizes: { value: number; unit: string }[];
  gridRowSizes: Measurement[];
  visibilityDelay: number;
  animatedVisibility: boolean;
  enableReHide: boolean;
  logicalConnectiveOfRules: 'disjunction' | 'conjunction';
  visibilityRules: VisibilityRule[];
}

function isValid(blueprint?: SectionProperties): boolean {
  if (!blueprint) return false;
  return blueprint.elements !== undefined &&
    blueprint.height !== undefined &&
    blueprint.backgroundColor !== undefined &&
    blueprint.dynamicPositioning !== undefined &&
    blueprint.autoColumnSize !== undefined &&
    blueprint.autoRowSize !== undefined &&
    blueprint.gridColumnSizes !== undefined &&
    blueprint.gridRowSizes !== undefined &&
    blueprint.visibilityDelay !== undefined &&
    blueprint.animatedVisibility !== undefined &&
    blueprint.enableReHide !== undefined &&
    blueprint.logicalConnectiveOfRules !== undefined &&
    blueprint.visibilityRules !== undefined;
}
