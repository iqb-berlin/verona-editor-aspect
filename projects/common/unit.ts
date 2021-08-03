export interface Unit {
  pages: UnitPage[];
}

export interface UnitPage {
  id: string;
  sections: UnitPageSection[];
  width: number;
  margin: number;
  backgroundColor: string;
  alwaysVisible: boolean;
}

export interface UnitPageSection {
  elements: UnitUIElement[];
  width: number;
  height: number;
  backgroundColor: string;
  dynamicPositioning: boolean;
  gridColumnSizes: string;
}

export interface UnitUIElement {
  [index: string]: string | number | boolean | string[] | undefined;
  type: string; // TODO maybe use enum or manual enumeration, because possible values are known
  id: string;
  zIndex: number
  width: number;
  height: number;
  dynamicPositioning: boolean;
  xPosition: number;
  yPosition: number;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
}

export interface TextUIElement extends UnitUIElement {
  fontColor: string;
  font: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface InputUIElement extends UnitUIElement {
  label: string;
  value: string | number | boolean | undefined;
  required: boolean;
  requiredWarnMessage: string;
}

export interface SurfaceUIElement extends UnitUIElement {
  backgroundColor: string;
}

export interface CompoundElementCorrection extends UnitUIElement {
  text: string;
  sentences : string[];
}

export interface TextElement extends TextUIElement, SurfaceUIElement {
  text: string;
}

export interface ButtonElement extends TextUIElement, SurfaceUIElement {
  label: string;
}

export interface TextFieldElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  value: string;
  min: number | undefined;
  minWarnMessage: string;
  max: number | undefined;
  maxWarnMessage: string;
}

export interface NumberFieldElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  value: number;
  min: number | undefined;
  minWarnMessage: string;
  max: number | undefined;
  maxWarnMessage: string;
}

export interface TextAreaElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  value: string;
  resizeEnabled: boolean;
}

export interface CheckboxElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  value: boolean | undefined;
}

export interface DropdownElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  label: string;
  options: string[];
  value: number | undefined;
}

export interface RadioButtonGroupElement extends InputUIElement, TextUIElement, SurfaceUIElement {
  label: string;
  options: string[];
  alignment: 'row' | 'column';
  value: number | undefined;
}

export interface ImageElement extends UnitUIElement {
  src: string;
}

export interface AudioElement extends UnitUIElement {
  src: string;
}

export interface VideoElement extends UnitUIElement {
  src: string;
}
