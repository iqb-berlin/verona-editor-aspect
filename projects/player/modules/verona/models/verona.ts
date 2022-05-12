import { InputElementValue } from 'common/models/elements/element';

export type NavigationTarget = 'first' | 'last' | 'previous' | 'next' | 'end';
export type RunningState = 'running' | 'stopped';
export type Progress = 'none' | 'some' | 'complete';
export type PagingMode = 'separate' | 'concat-scroll' | 'concat-scroll-snap';
export type StateReportPolicy = 'none' | 'eager' | 'on-demand';
export type ElementCodeStatus = 'NOT_REACHED' | 'DISPLAYED' | 'VALUE_CHANGED';
export enum ElementCodeStatusValue { NOT_REACHED = 0, DISPLAYED = 1, VALUE_CHANGED = 2}

export interface StatusChangeElement {
  id: string;
  status: ElementCodeStatus;
}

export interface PlayerConfig {
  unitNumber?: number;
  unitTitle?: number;
  unitId?: number;
  stateReportPolicy?: StateReportPolicy;
  pagingMode?: PagingMode;
  logPolicy?: 'lean' | 'rich' | 'debug' | 'disabled';
  startPage?: string;
  enabledNavigationTargets?: NavigationTarget[]
}

export interface ElementCode {
  id: string;
  status: ElementCodeStatus;
  value: InputElementValue;
}

export interface UnitState {
  dataParts?: Record<string, string>;
  presentationProgress?: Progress;
  responseProgress?: Progress;
  unitStateDataType?: string;
}

export interface PlayerState {
  state: RunningState;
  validPages?: Record<string, string>;
  currentPage?: string;
}

export interface LogData {
  timeStamp: number,
  key: string,
  content?: string
}

export interface VopStartCommand {
  type: 'vopStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  unitState?: UnitState;
  playerConfig?: PlayerConfig;
}

export interface VopNavigationDeniedNotification {
  type: 'vopNavigationDeniedNotification';
  sessionId: string;
  reason?: Array<'presentationIncomplete' | 'responsesIncomplete'>
}

export interface VopPageNavigationCommand {
  type: 'vopPageNavigationCommand';
  sessionId: string;
  target: string;
}

export interface VopGetStateRequest {
  type: 'vopGetStateRequest';
  sessionId: string;
  stop: boolean;
}

export interface VopStopCommand {
  type: 'vopStopCommand';
  sessionId: string;
}

export interface VopContinueCommand {
  type: 'vopContinueCommand';
  sessionId: string;
}

export interface VopReadyNotification extends VopMetaData {
  type: 'vopReadyNotification';
}

export interface VopMetaData {
  apiVersion: string;
  notSupportedApiFeatures?: string;
  supportedUnitDefinitionTypes?: string;
  supportedUnitStateDataTypes?: string;
}

export interface VopStateChangedNotification {
  type: 'vopStateChangedNotification';
  sessionId: string;
  timeStamp: number;
  unitState?: UnitState;
  playerState?: PlayerState;
  log?: LogData[];
}

export interface VopUnitNavigationRequestedNotification {
  type: 'vopUnitNavigationRequestedNotification';
  sessionId: string;
  target: 'first' | 'last' | 'previous' | 'next' | 'end';
}

export interface VopWindowFocusChangedNotification {
  type: 'vopWindowFocusChangedNotification';
  timeStamp: number;
  hasFocus: boolean;
}

export type VopMessage =
  VopStartCommand |
  VopNavigationDeniedNotification |
  VopPageNavigationCommand |
  VopGetStateRequest |
  VopStopCommand |
  VopContinueCommand |
  VopReadyNotification |
  VopStateChangedNotification |
  VopWindowFocusChangedNotification |
  VopUnitNavigationRequestedNotification;
