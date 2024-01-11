export interface Options {
    idendity: Session
    channels?: string[],
    debug?:boolean,
    profaneFilter?: boolean
}

export interface Session {
    username?: string,
    Token: string
    ClientID?: string,
    sessionId?: string,
}