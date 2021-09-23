import {
  Component, ElementRef, Input, ViewChild
} from '@angular/core';
import { UnitPageSection } from '../../../../../../../common/unit';
import { SelectionService } from '../../../../selection.service';
import { UnitService } from '../../../../unit.service';

@Component({
  selector: 'app-section-static',
  template: `
    <div #sectionElement class="section-wrapper"
         [style.border]="selected ? '1px solid': '1px dotted'"
         [style.height.px]="section.height"
         [style.background-color]="section.backgroundColor"
         (click)="selectionService.selectSection(this)"
         (dragover)="$event.preventDefault()" (drop)="newElementDropped($event)">
      <app-static-canvas-overlay
        *ngFor="let element of section.elements"
        [element]="$any(element)">
      </app-static-canvas-overlay>
    </div>
  `,
  styles: [
    '.section-wrapper {width: 100%}'
  ]
})
export class SectionStaticComponent {
  @Input() section!: UnitPageSection;
  @ViewChild('sectionElement') sectionElement!: ElementRef;
  selected = true;

  constructor(public selectionService: SelectionService, public unitService: UnitService) { }

  newElementDropped(event: DragEvent): void {
    event.preventDefault();
    const sectionRect = this.sectionElement.nativeElement.getBoundingClientRect();
    this.unitService.addElementToSection(
      event.dataTransfer?.getData('elementType') as string,
      this.section,
      { x: event.clientX - Math.round(sectionRect.left), y: event.clientY - Math.round(sectionRect.top) }
    );
  }
}
