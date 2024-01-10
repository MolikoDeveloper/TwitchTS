export interface Options {
    idendity: Session
    channel?: string,
    debug?:boolean
}

export interface Session {
    username?: string,
    Token: string
    ClientID?: string,
    sessionId?: string,
}