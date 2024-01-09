export interface Options {
    idendity: Session
    channel?: string,
    debug?:boolean
}

export interface Session {
    username?: string,
    sessionId?: string,
    ClientID?: string,
    UserToken?: string,
    ClientToken?: string
}