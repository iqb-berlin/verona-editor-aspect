import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionContainerComponent } from './section-container.component';
import { SectionComponent } from 'player/src/app/components/section/section.component';

describe('SectionContainerComponent', () => {
  let component: SectionContainerComponent;
  let fixture: ComponentFixture<SectionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SectionContainerComponent,
        SectionComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContainerComponent);
    component = fixture.componentInstance;
    component.pageSections = [];
    component.section = {
      elements: [],
      height: 400,
      backgroundColor: '#ffffff',
      dynamicPositioning: true,
      autoColumnSize: true,
      autoRowSize: true,
      gridColumnSizes: '1fr 1fr',
      gridRowSizes: '1fr',
      activeAfterID: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
