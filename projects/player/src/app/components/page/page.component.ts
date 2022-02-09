import {
  Component, Input, OnInit, Output, EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { UnitStateService } from '../../services/unit-state.service';
import { Page } from '../../../../../common/models/page';

@Component({
  selector: 'aspect-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})

export class PageComponent implements OnInit {
  @Input() page!: Page;
  @Input() isLastPage!: boolean;
  @Input() parentForm!: FormGroup;
  @Input() parentArrayIndex!: number;
  @Input() pagesContainer!: HTMLElement;
  @Output() selectedIndexChange = new EventEmitter<number>();

  pageForm!: FormGroup;

  constructor(private formService: FormService,
              private unitStateService: UnitStateService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.pageForm = this.formBuilder.group({
      id: this.page.id,
      sections: this.formBuilder.array([])
    });
    this.formService.registerFormGroup({
      formGroup: this.pageForm,
      parentForm: this.parentForm,
      parentArray: 'pages',
      parentArrayIndex: this.parentArrayIndex
    });
  }

  onIntersection(): void {
    this.selectedIndexChange.emit(this.parentArrayIndex);
  }
}
