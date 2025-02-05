import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioElement } from 'common/models/elements/media-elements/audio';
import { MediaPlayerElementComponent } from '../../directives/media-player-element-component.directive';

@Component({
  selector: 'aspect-audio',
  template: `
    <div #wrapper>
      <aspect-media-player-control-bar
        [player]="player"
        [project]="project"
        [id]="elementModel.id"
        [savedPlaybackTime]="savedPlaybackTime"
        [playerProperties]="elementModel.player"
        [active]="active"
        [dependencyDissolved]="dependencyDissolved"
        [backgroundColor]="elementModel.styling.backgroundColor"
        (mediaValidStatusChanged)="mediaValidStatusChanged.emit($event)"
        (elementValueChanged)="elementValueChanged.emit($event)">
        <audio #player
               [style.width.%]="100"
               [src]="currentSrc | safeResourceUrl"
               (loadedmetadata)="isLoaded.next(true)"
               (playing)="mediaPlayStatusChanged.emit(elementModel.id)"
               (pause)="mediaPlayStatusChanged.emit(null)">
        </audio>
      </aspect-media-player-control-bar>
    </div>
  `,
  styles: [`
    :host { width: 100%; height: 100%; }
  `]
})
export class AudioComponent extends MediaPlayerElementComponent implements AfterViewInit, OnDestroy {
  @Input() elementModel!: AudioElement;
  currentSrc: string = '';
  private intersectionSub!: Subscription;
  @ViewChild('player', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.elementModel.intersectionDetector.observe(this.wrapper.nativeElement, this.elementModel.id);
    this.intersectionSub = this.elementModel.intersectionDetector.intersecting.subscribe((id: string | null) => {
      if (id === this.elementModel.id && !this.currentSrc) {
        console.log('Audio component is visible, setting src.');
        this.currentSrc = this.elementModel.src || '';
        setTimeout(() => {
          this.audioPlayer.nativeElement.load();
        }, 0);
      } else if (id !== this.elementModel.id && this.currentSrc) {
        console.log('Audio component is out of view, removing src.');
        this.currentSrc = '';
        this.audioPlayer.nativeElement.src = '';
        this.audioPlayer.nativeElement.load();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intersectionSub) {
      this.intersectionSub.unsubscribe();
    }
    this.elementModel.intersectionDetector.unobserve(this.elementModel.id);
  }
}
