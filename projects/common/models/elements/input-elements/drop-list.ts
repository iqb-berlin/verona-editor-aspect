import { Type } from '@angular/core';
import {
  InputElement,
  DragNDropValueObject,
  BasicStyles, PositionProperties,
  AnswerScheme, AnswerSchemeValue, UIElement, UIElementValue
} from 'common/models/elements/element';
import { ElementComponent } from 'common/directives/element-component.directive';
import { DropListComponent } from 'common/components/input-elements/drop-list.component';

export class DropListElement extends InputElement {
  value: DragNDropValueObject[];
  onlyOneItem: boolean = false;
  connectedTo: string[] = [];
  copyOnDrop: boolean = false;
  allowReplacement: boolean = false;
  orientation: 'vertical' | 'horizontal' | 'flex' = 'vertical'; // TODO besser floating
  highlightReceivingDropList: boolean = false;
  highlightReceivingDropListColor: string = '#006064';
  position: PositionProperties | undefined;
  styling: BasicStyles & {
    itemBackgroundColor: string;
  };

  constructor(element: Partial<DropListElement>) {
    super({ height: 100, ...element });
    this.value = element.value !== undefined ?
      element.value.map(val => ({ ...val })) :
      [];
    if (element.onlyOneItem) this.onlyOneItem = element.onlyOneItem;
    if (element.connectedTo) this.connectedTo = [...element.connectedTo];
    if (element.copyOnDrop !== undefined) this.copyOnDrop = element.copyOnDrop;
    if (element.allowReplacement !== undefined) this.allowReplacement = element.allowReplacement;
    if (element.orientation) this.orientation = element.orientation;
    if (element.highlightReceivingDropList) this.highlightReceivingDropList = element.highlightReceivingDropList;
    if (element.highlightReceivingDropListColor) {
      this.highlightReceivingDropListColor = element.highlightReceivingDropListColor;
    }
    this.position = element.position ?
      UIElement.initPositionProps({ useMinHeight: true, ...element.position as Partial<PositionProperties> }) :
      undefined;
    this.styling = UIElement.initStylingProps({
      backgroundColor: '#ededed',
      itemBackgroundColor: '#c9e0e0',
      ...element.styling
    });
  }

  /* Set originListID and originListIndex if applicable. */
  setProperty(property: string, value: UIElementValue): void {
    super.setProperty(property, value);
    if (property === 'value' || property === 'id') {
      this.value.forEach((dndValue: DragNDropValueObject, index) => { // foreach to keep the array ref intact
        this.value[index] = {
          ...dndValue,
          originListID: this.id,
          originListIndex: this.value.indexOf(dndValue)
        };
      });
    }
  }

  hasAnswerScheme(): boolean {
    return Boolean(this.getAnswerScheme);
  }

  getAnswerScheme(options: Array<DropListElement>): AnswerScheme {
    return {
      id: this.id,
      type: 'string',
      format: '',
      multiple: true,
      nullable: false,
      values: this.getAnswerSchemeValues(options),
      valuesComplete: true
    };
  }

  private getAnswerSchemeValues(dropLists: Array<DropListElement>): AnswerSchemeValue[] {
    const valueDropLists = dropLists.filter(dropList => dropList.connectedTo.includes(this.id));
    if (valueDropLists.length || this.isSortingList()) {
      return [this, ...valueDropLists]
        .map(dropList => dropList.value as DragNDropValueObject[])
        .flat()
        .map(option => ({ value: option.id, label: InputElement.stripHTML(option.text) }));
    }
    return [];
  }

  private isSortingList(): boolean {
    return (!this.connectedTo.length && (this.value as DragNDropValueObject[]).length > 1);
  }

  getElementComponent(): Type<ElementComponent> {
    return DropListComponent;
  }
}
