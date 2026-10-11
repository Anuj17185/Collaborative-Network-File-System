export type OutgoingType =
  | 'READ_FILE'
  | 'ACQUIRE_LOCK'
  | 'HEARTBEAT'
  | 'RELEASE_LOCK'
  | 'SAVE_CONTENT'
  | 'CREATE_FILE';

export interface ReadfilePayload {
  type: 'READ_FILE';
  filename: string;
}

export interface AcquirelockPayload {
  type: 'ACQUIRE_LOCK';
  filename: string;
}

export interface HearbeatPayload {
  type: 'HEARTBEAT';
  filename: string;
}

export interface ReleasePayload {
  type: 'RELEASE_LOCK';
  filename: string;
}

export interface SaveContentPayload {
  type: 'SAVE_CONTENT';
  filename: string;
  content: string;
}

export interface Createfilepayload {
  type: 'CREATE_FILE';
  filename: string;
  content?: string;
}

export type OutgoingMessage =
  | ReadfilePayload
  | SaveContentPayload
  | ReleasePayload
  | HearbeatPayload
  | AcquirelockPayload
  | Createfilepayload;

export type IncomingType =
  | 'INIT_STATE'
  | 'FILE_CONTENT'
  | 'FILE_CREATED'
  | 'LOCK_GRANTED'
  | 'LOCK_DENIED'
  | 'LOCK_RELEASED'
  | 'LOCK_STATUS_CHANGED'
  | 'FILE_UPDATED'
  | 'HEARTBEAT_ACK'
  | 'ERROR';

export interface Init {
  type: 'INIT_STATE';
  files: string[];
  clientid: string;
}

export interface FileContent {
  type: 'FILE_CONTENT';
  content: string;
  filename: string;
  holder: string | null;
}

export interface FileCreated {
  type: 'FILE_CREATED';
  filename: string;
  files: string[];
}

export interface LockGranted {
  type: 'LOCK_GRANTED';
  content: string;
  filename: string;
  clientid: string;
}

export interface LockDenied {
  type: 'LOCK_DENIED';
  filename: string;
  content: string;
  holder: string | null;
}

export interface LockRelease {
  type: 'LOCK_RELEASED';
  filename: string;
  clientid: string;
  reason: 'explicit' | 'timeout' | 'disconnect';
}

export interface LockStatusChange {
  type: 'LOCK_STATUS_CHANGED';
  filename: string;
  holder: string | null;
}

export interface FileUpdated {
  type: 'FILE_UPDATED';
  filename: string;
  content: string;
  clientid: string;
}

export interface ErrorMsg {
  type: 'ERROR';
  msg: string;
}

export interface HeartbeatAck {
  type: 'HEARTBEAT_ACK';
  filename: string;
  clientid: string;
}

export type IncomingMessage =
  | Init
  | FileContent
  | FileCreated
  | LockGranted
  | LockDenied
  | LockRelease
  | LockStatusChange
  | FileUpdated
  | HeartbeatAck
  | ErrorMsg;