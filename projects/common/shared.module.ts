import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TextComponent } from './components/text/text.component';
import { ButtonComponent } from './components/button/button.component';
import { TextFieldComponent } from './components/input-elements/text-field.component';
import { TextFieldSimpleComponent } from './components/compound-elements/cloze/cloze-child-elements/text-field-simple.component';
import { TextAreaComponent } from './components/input-elements/text-area.component';
import { CheckboxComponent } from './components/input-elements/checkbox.component';
import { DropdownComponent } from './components/input-elements/dropdown.component';
import { RadioButtonGroupComponent } from './components/input-elements/radio-button-group.component';
import { ImageComponent } from './components/media-elements/image.component';
import { VideoComponent } from './components/media-elements/video.component';
import { AudioComponent } from './components/media-elements/audio.component';
import { SafeResourceUrlPipe } from './pipes/safe-resource-url.pipe';
import { InputBackgroundColorDirective } from './directives/input-background-color.directive';
import { ErrorTransformPipe } from './pipes/error-transform.pipe';
import { SafeResourceHTMLPipe } from './pipes/safe-resource-html.pipe';
import { MediaPlayerControlBarComponent }
  from './components/media-elements/media-player-control-bar/media-player-control-bar.component';
import { MediaPlayerTimeFormatPipe } from './components/media-elements/media-player-control-bar/media-player-time-format.pipe';
import { LikertComponent } from './components/compound-elements/likert/likert.component';
import { LikertRadioButtonGroupComponent } from './components/compound-elements/likert/likert-radio-button-group.component';
import { ImageMagnifierComponent } from './components/media-elements/image-magnifier.component';
import { RadioGroupImagesComponent } from './components/input-elements/radio-group-images.component';
import { DropListComponent } from './components/input-elements/drop-list.component';
import { ClozeComponent } from './components/compound-elements/cloze/cloze.component';
import { SliderComponent } from './components/input-elements/slider.component';
import { SpellCorrectComponent } from './components/input-elements/spell-correct.component';
import { DropListSimpleComponent } from './components/compound-elements/cloze/cloze-child-elements/drop-list-simple.component';
import { FrameComponent } from './components/frame/frame.component';
import { ToggleButtonComponent } from './components/compound-elements/cloze/cloze-child-elements/toggle-button.component';
import { TextMarkingBarComponent } from './components/text/text-marking-bar/text-marking-bar.component';
import { StyleMarksPipe } from './pipes/styleMarks.pipe';
import { TextMarkingButtonComponent } from './components/text/text-marking-bar/text-marking-button.component';
import { CompoundChildOverlayComponent } from './components/compound-elements/cloze/compound-child-overlay.component';
import { MarkListPipe } from './pipes/mark-list.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    DragDropModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    MatSliderModule,
    MatButtonToggleModule
  ],
  declarations: [
    ButtonComponent,
    TextComponent,
    TextFieldComponent,
    TextFieldSimpleComponent,
    TextAreaComponent,
    ImageComponent,
    AudioComponent,
    VideoComponent,
    RadioButtonGroupComponent,
    CheckboxComponent,
    DropdownComponent,
    SafeResourceUrlPipe,
    InputBackgroundColorDirective,
    ErrorTransformPipe,
    SafeResourceHTMLPipe,
    MediaPlayerControlBarComponent,
    MediaPlayerTimeFormatPipe,
    LikertComponent,
    LikertRadioButtonGroupComponent,
    ImageMagnifierComponent,
    RadioGroupImagesComponent,
    DropListComponent,
    ClozeComponent,
    DropListSimpleComponent,
    SliderComponent,
    SpellCorrectComponent,
    FrameComponent,
    ToggleButtonComponent,
    TextMarkingBarComponent,
    StyleMarksPipe,
    TextMarkingButtonComponent,
    CompoundChildOverlayComponent,
    MarkListPipe
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    TranslateModule,
    SafeResourceHTMLPipe,
    TextMarkingBarComponent,
    ToggleButtonComponent,
    TextFieldComponent,
    TextFieldSimpleComponent,
    DropListSimpleComponent,
    TextAreaComponent,
    AudioComponent,
    VideoComponent,
    TextComponent,
    CheckboxComponent,
    SpellCorrectComponent,
    SliderComponent,
    DropdownComponent,
    RadioButtonGroupComponent,
    RadioGroupImagesComponent,
    DropListComponent,
    ClozeComponent,
    LikertComponent,
    ButtonComponent,
    FrameComponent,
    ImageComponent
  ]
})
export class SharedModule {
  constructor(iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'rubber-black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/rubber-black.svg')
    );
  }
}
