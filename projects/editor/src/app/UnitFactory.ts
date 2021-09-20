import {
  AudioElement, ButtonElement,
  CheckboxElement, CompoundElementCorrection, DropdownElement,
  ImageElement, TextElement, RadioButtonGroupElement,
  TextFieldElement, Unit, UnitPage, UnitPageSection, UnitUIElement,
  VideoElement, TextAreaElement
} from '../../../common/unit';

const EXPORTED_MODULE_VERSION = 'iqb-aspect-module@0.1.0';

export function createUnit(): Unit {
  return {
    veronaModuleVersion: EXPORTED_MODULE_VERSION,
    pages: []
  };
}

export function createUnitPage(pageIndex: number): UnitPage {
  return {
    id: `page${pageIndex}`,
    sections: [],
    hasMaxWidth: false,
    maxWidth: 1100,
    margin: 8,
    backgroundColor: 'white',
    alwaysVisible: false,
    alwaysVisiblePagePosition: 'left',
    alwaysVisibleAspectRatio: 50
  };
}

export function createUnitPageSection(): UnitPageSection {
  return {
    elements: [],
    height: 400,
    backgroundColor: '#FFFAF0',
    dynamicPositioning: false,
    gridColumnSizes: '1fr 1fr',
    gridRowSizes: '1fr'
  };
}

function createUnitUIElement(type: string): UnitUIElement {
  return {
    type,
    id: 'id_placeholder',
    zIndex: 0,
    width: 180,
    height: 60,
    dynamicPositioning: false,
    xPosition: 0,
    yPosition: 0,
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 2,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  };
}

export function createTextUIElement(): Record<string, unknown> {
  return {
    fontColor: 'black',
    font: 'Arial',
    fontSize: 18,
    bold: false,
    italic: false,
    underline: false
  };
}

export function createInputUIElement(
  label: string, value: string | number | boolean | undefined
): Record<string, unknown> {
  return {
    label: label,
    value: value,
    required: false,
    requiredWarnMessage: 'Eingabe erforderlich'
  };
}

export function createSurfaceUIElement(): Record<string, unknown> {
  return {
    backgroundColor: 'lightgrey'
  };
}

export function createTextElement(): TextElement {
  return <TextElement>{
    text: 'Lorem ipsum dolor sit amet',
    highlightable: false,
    ...createUnitUIElement('text'),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    backgroundColor: 'transparent',
    height: 74
  };
}

export function createButtonElement(): ButtonElement {
  return <ButtonElement>{
    label: 'Knopf Beschriftung',
    ...createUnitUIElement('button'),
    ...createTextUIElement(),
    ...createSurfaceUIElement()
  };
}

export function createTextfieldElement(): TextFieldElement {
  return <TextFieldElement>{
    minLength: undefined,
    minLengthWarnMessage: 'Eingabe zu kurz',
    maxLength: undefined,
    maxLengthWarnMessage: 'Eingabe zu lang',
    pattern: '',
    patternWarnMessage: 'Eingabe entspricht nicht der Vorgabe',
    ...createUnitUIElement('text-field'),
    ...createInputUIElement('Beispiel Beschriftung', ''),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    height: 74
  };
}

export function createTextareaElement(): TextAreaElement {
  return <TextAreaElement>{
    resizeEnabled: false,
    ...createUnitUIElement('text-area'),
    ...createInputUIElement('Beispiel Beschriftung', ''),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    height: 100
  };
}

export function createCheckboxElement(): CheckboxElement {
  return <CheckboxElement>{
    ...createUnitUIElement('checkbox'),
    ...createInputUIElement('Beschriftung', false),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    backgroundColor: 'transparent'
  };
}

export function createDropdownElement(): DropdownElement {
  return <DropdownElement><unknown>{
    options: [],
    allowUnset: false,
    ...createUnitUIElement('dropdown'),
    ...createInputUIElement('Beschriftung', undefined),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    height: 83
  };
}

export function createRadioButtonGroupElement(): RadioButtonGroupElement {
  return <RadioButtonGroupElement><unknown>{
    options: [],
    alignment: 'row',
    ...createUnitUIElement('radio'),
    ...createInputUIElement('Beschriftung Optionsfeld', undefined),
    ...createTextUIElement(),
    ...createSurfaceUIElement(),
    height: 75,
    backgroundColor: 'transparent'
  };
}

export function createImageElement(imageSrc: string): ImageElement {
  return {
    src: imageSrc,
    ...createUnitUIElement('image')
  };
}

export function createAudioElement(audioSrc: string): AudioElement {
  return {
    src: audioSrc,
    ...createUnitUIElement('audio')
  };
}

export function createVideoElement(videoSrc: string): VideoElement {
  return {
    src: videoSrc,
    ...createUnitUIElement('video')
  };
}

export function createCorrectionElement(): CompoundElementCorrection {
  return {
    text: 'dummy',
    sentences: [],
    ...createUnitUIElement('correction')
  };
}
