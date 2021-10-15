import {
  Component, ElementRef, EventEmitter, Output, ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementComponent } from '../element-component.directive';
import { TextElement } from '../classes/text-element';

@Component({
  selector: 'app-text',
  template: `
    <div [style.width.%]="100"
         [style.height]="'auto'">
      <div *ngIf="elementModel.highlightable"
           class="marking-bar">
        <button class="marking-button" mat-mini-fab [style.background-color]="'yellow'"
                (click)="applySelection.emit({color:'yellow', element: container, clear: false})">
          <mat-icon>border_color</mat-icon>
        </button>
        <button class="marking-button" mat-mini-fab [style.background-color]="'turquoise'"
                (click)="applySelection.emit({color: 'turquoise', element: container, clear: false})">
          <mat-icon>border_color</mat-icon>
        </button>
        <button class="marking-button" mat-mini-fab [style.background-color]="'orange'"
                (click)="applySelection.emit({color: 'orange', element: container, clear: false})">
          <mat-icon>border_color</mat-icon>
        </button>
        <button class="marking-button" [style.background-color]="'lightgrey'" mat-mini-fab
                (click)="applySelection.emit({color: 'none', element: container, clear: true})">
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      <div [style.background-color]="elementModel.backgroundColor"
           [style.color]="elementModel.fontColor"
           [style.font-family]="elementModel.font"
           [style.font-weight]="elementModel.bold ? 'bold' : ''"
           [style.font-style]="elementModel.italic ? 'italic' : ''"
           [style.text-decoration]="elementModel.underline ? 'underline' : ''"
           [innerHTML]="elementModel.text | safeResourceHTML"
           #container>
      </div>
    </div>
  `,
  styles: [
    '.marking-bar{position: sticky; top: 0}',
    '.marking-button{color: #333}'
  ]
})
export class TextComponent extends ElementComponent {
  elementModel!: TextElement;
  @Output() applySelection = new EventEmitter<{ color: string, element: HTMLElement, clear: boolean }>();
  @ViewChild('container') containerDiv!: ElementRef;

  constructor(public sanitizer: DomSanitizer) {
    super();
  }
}
