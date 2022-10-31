import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'aspect-page-scroll-button',
  templateUrl: './page-scroll-button.component.html',
  styleUrls: ['./page-scroll-button.component.scss']
})
export class PageScrollButtonComponent implements AfterViewInit, OnDestroy {
  @HostListener('scroll', ['$event.target'])
  onScroll(element: HTMLElement) {
    this.checkScrollPosition(element);
  }

  @Input() isSnapMode!: boolean;

  @Output() scrollToNextPage: EventEmitter<void> = new EventEmitter<void>();

  isVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  scrollIntervalId!: number;

  private ngUnsubscribe = new Subject<void>();

  constructor(private elementRef: ElementRef) {
    this.isVisible
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.clearScrollIng();
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollPosition(this.elementRef.nativeElement));
  }

  private checkScrollPosition(element: HTMLElement): void {
    this.isVisible.next(element.scrollHeight - element.offsetHeight > element.scrollTop + 10);
  }

  toggleScrolling(scrolling: boolean) {
    if (scrolling) {
      this.scrollIntervalId = setInterval(() => {
        this.scrollDown();
      });
    } else {
      this.clearScrollIng();
    }
  }

  scrollDown(): void {
    const nextScrollTop = this.elementRef.nativeElement.scrollTop + 2;
    if (this.isSnapMode && this.getBottomsOfPages()
      .filter((page: number) => Math
        .abs(page - (nextScrollTop + this.elementRef.nativeElement.offsetHeight)) <= 2).length === 1) {
      this.clearScrollIng();
      this.scrollToNextPage.emit();
    } else {
      this.elementRef.nativeElement.scrollTop = nextScrollTop;
    }
  }

  private getBottomsOfPages(): number[] {
    return [...this.elementRef.nativeElement.querySelectorAll('aspect-page')]
      .map(page => page.parentElement?.offsetHeight)
      .reduce((acc, v, i) => {
        i === 0 ? acc.push(v) : acc.push(v + acc[i - 1]);
        return acc;
      }, []);
  }

  private clearScrollIng(): void {
    if (this.scrollIntervalId) {
      clearInterval(this.scrollIntervalId);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
