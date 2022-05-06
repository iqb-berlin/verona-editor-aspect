import { TestBed } from '@angular/core/testing';
import { TextMarkingService } from './text-marking.service';

describe('TextMarkingService', () => {
  let service: TextMarkingService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextMarkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get an array with selections ', () => {
    const text =
      'Lorem <aspect-marked style="background-color: rgb(249, 248, 113);">ipsum</aspect-marked> dolor sit amet';
    const expectedArray = ['6-11-#f9f871'];
    expect(TextMarkingService.getMarkingData(text)).toEqual(expectedArray);
  });

  it('should get an array with selections ', () => {
    const text = 'Lorem ipsum dolor sit amet';
    const expectedText =
      'Lorem <aspect-marked style="background-color: rgb(249, 248, 113);">ipsum</aspect-marked> dolor sit amet';
    const markings = ['6-11-#f9f871'];
    expect(TextMarkingService.restoreMarkings(markings, text)).toEqual(expectedText);
  });


});
