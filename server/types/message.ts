
export type IncomingType=| 'READ_FILE'
  | 'ACQUIRE_LOCK'
  | 'HEARTBEAT'
  | 'RELEASE_LOCK'
  | 'SAVE_CONTENT';

export interface ReadfilePayload{
    type:'READ_FILE',
    content:string,
    filename:string,
    clientid:string
}
export interface AcquirelockPayload{
    type:'ACQUIRE_LOCK',
    filename:string,
    clientid:string
}
export interface HearbeatPayload{
    type:'HEARTBEAT',
    filename:string,
    clientid:string
}
export interface ReleasePayload{
    type:'RELEASE_LOCK',
    filename:string,
    clientid:string
}
export interface SaveContentPayload{
    type:'SAVE_CONTENT',
    filename:string,
    clientid:string,
    content:string
}

export type IncomingMessage=ReadfilePayload|
SaveContentPayload|
ReleasePayload|
HearbeatPayload|
AcquirelockPayload;

export type OutgoingType=| 'INIT_STATE'
  | 'FILE_CONTENT'
  | 'LOCK_GRANTED'
  | 'LOCK_DENIED'
  | 'LOCK_RELEASED'
  | 'LOCK_STATUS_CHANGED'
  | 'FILE_UPDATED'
  | 'HEARTBEAT_ACK'
  | 'ERROR';

export interface Init{
    type:'INIT_STATE',
    files:string[],
    clientid:string
}
export interface FileContent{
    type:'FILE_CONTENT',
    content:string,
    filename:string,
    holder:string|null
}
export interface LockGranted{
    type:'LOCK_GRANTED',
    content:string,
    filename:string,
    clientid:string
}
export interface LockDenied{
    type:'LOCK_DENIED',
    filename:string,
    holder:string|null

}
export interface LockRelease{
    type:'LOCK_RELEASED',
    filename:string,
    clientid:string,
    reason:string|null
}
export interface LockStatusChange{
    type:'LOCK_STATUS_CHANGED',
    filename:string,
    holder:string
}
export interface FileUpdated{
    type:'FILE_UPDATED',
    filename:string,
    content:string,
    clientid:string
}
export interface ErrorMsg{
    type:'ERROR',
    msg:string
}
export interface HeartbeatAck{
    type:'HEARTBEAT_ACK',
    filename:string,
    clientid:string
}
export type OutgoingMessage =
  | Init
  | FileContent
  | LockGranted
  | LockDenied
  | LockRelease
  | LockStatusChange
  | FileUpdated
  | HeartbeatAck
  | ErrorMsg;