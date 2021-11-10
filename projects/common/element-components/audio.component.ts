import { Component } from '@angular/core';
import { AudioElement } from '../models/audio-element';
import { MediaPlayerElementComponent } from '../media-player-element-component.directive';

@Component({
  selector: 'app-audio',
  template: `
    <div [style.width.%]="100"
         [style.height.%]="100">
      <audio #player
             [style.width.%]="100"
             [src]="elementModel.src | safeResourceUrl">
      </audio>
      <app-control-bar [player]="player"
                       [elementModel]="elementModel"
                       (playbackTimeChanged)="playbackTimeChanged.emit($event)">
      </app-control-bar>
    </div>
  `
})
export class AudioComponent extends MediaPlayerElementComponent {
  elementModel!: AudioElement;
}
