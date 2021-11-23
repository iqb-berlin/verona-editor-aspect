import { UIElement } from '../models/uI-element';

export interface FontElement {
  fontColor: string;
  font: string;
  fontSize: number;
  lineHeight: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface SurfaceUIElement {
  backgroundColor: string;
}

export interface PlayerElement {
  autostart: boolean;
  autostartDelay: number;
  loop: boolean;
  startControl: boolean;
  pauseControl: boolean;
  progressBar: boolean;
  interactiveProgressbar: boolean;
  volumeControl: boolean;
  defaultVolume: number;
  minVolume: number;
  muteControl: boolean;
  hintLabel: string;
  hintLabelDelay: number;
  uninterruptible: boolean;
  hideOtherPages: boolean;
  activeAfterID: string;
  minRuns: number;
  maxRuns: number | null;
  showRestRuns: boolean;
  showRestTime: boolean;
  playbackTime: number;
}

export interface LikertColumn {
  text: string;
  imgSrc: string | null;
  position: 'above' | 'below';
}

export interface LikertRow {
  text: string;
  columnCount: number;
}

export interface ClozePart {
  type: string;
  value: string | UIElement;
  style?: string;
}
