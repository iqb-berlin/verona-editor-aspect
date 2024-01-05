import { Injectable } from '@angular/core';
import { TextAreaComponent } from 'common/components/input-elements/text-area.component';
import { TextFieldComponent } from 'common/components/input-elements/text-field.component';
import { SpellCorrectComponent } from 'common/components/input-elements/spell-correct.component';
import {
  TextFieldSimpleComponent
} from 'common/components/compound-elements/cloze/cloze-child-elements/text-field-simple.component';
import { InputService } from './input-service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService extends InputService {
  addInputAssistanceToKeyboard: boolean = false;

  toggle(focusedTextInput: { inputElement: HTMLElement; focused: boolean },
         elementComponent: TextAreaComponent | TextFieldComponent | TextFieldSimpleComponent | SpellCorrectComponent,
         isMobileWithoutHardwareKeyboard: boolean): void {
    if (focusedTextInput.focused && isMobileWithoutHardwareKeyboard) {
      this.open(focusedTextInput.inputElement, elementComponent);
    } else {
      this.close();
    }
  }

  open(inputElement: HTMLElement,
       elementComponent: TextAreaComponent | TextFieldComponent | TextFieldSimpleComponent | SpellCorrectComponent):
    void {
    this.addInputAssistanceToKeyboard = elementComponent.elementModel.addInputAssistanceToKeyboard;
    this.preset = elementComponent.elementModel.inputAssistancePreset;
    this.setCurrentKeyInputElement(inputElement, elementComponent);
    this.isOpen = true;
  }

  scrollElement(): void {
    if (this.isOpen && this.isElementHiddenByKeyboard()) {
      const scrollPositionTarget = this.isViewHighEnoughToCenterElement() ? 'start' : 'center';
      this.elementComponent.domElement.scrollIntoView({ block: scrollPositionTarget });
    }
  }

  private isViewHighEnoughToCenterElement(): boolean {
    return window.innerHeight < this.getKeyboardHeight() * 2;
  }

  private isElementHiddenByKeyboard(): boolean {
    return window.innerHeight - this.elementComponent.domElement.getBoundingClientRect().top < this.getKeyboardHeight();
  }

  private getKeyboardHeight(): number {
    return this.addInputAssistanceToKeyboard ? 400 : 350;
  }
}
