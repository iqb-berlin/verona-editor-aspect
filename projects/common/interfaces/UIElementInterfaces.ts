export interface FontElement {
  fontColor: string;
  font: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface SurfaceUIElement {
  backgroundColor: string;
}

export interface PlayerElement {
  autostart: boolean; // default: false
  autostartDelay: number; // default: 0 (milliseconds)
  loop: boolean; // false
  startControl: boolean; // true
  pauseControl: boolean; // false
  stopControl: boolean; // false
  progressBar: boolean; // true
  interactiveProgressbar: boolean; // false
  volumeControl: boolean; // true
  hintLabel: string; // ''
  hintLabelDelay: number; // default: 0 (milliseconds)
  uninterruptible: boolean; // false kein Blättern; starten eines anderen Videos; ....
  hideOtherPages: boolean; // false (Solange nicht vollständig gespielt, sind alle anderen Seiten verborgen)
  activeAfterID: string; // '' (andere Audio - id; Audio ist deaktiviert, solange anderes nicht vollständig abgespielt)
  minRuns: number; // 1
  maxRuns: number | null; // null
  showRestTime: boolean; // true
}
