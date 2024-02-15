export interface EventMessage {
    metadata: Metadata
    payload: Payload
}

export interface Metadata {
    message_id: string
    message_type: MessageTypes
    message_timestamp: string
    subscription_type?: string
    subscription_version?: string
}

export enum MessageTypes {
    SessionWelcome = "session_welcome",
    SessionKeepAlive = "session_keepalive",
    Notification = "notification",
    Reconect = "session_reconnect",
    Revocation = "revocation"
}

export interface Payload {
    session?: Session
    subscription?: Subscription
    event?: Event
}

export interface Session {
    id: string
    status: string
    connected_at: string
    keepalive_timeout_seconds: number
    reconnect_url: string | null
}

export interface Subscription {
    id: string
    status: string
    type: string
    version: string
    cost: number
    condition: Condition
    transport: Transport
    created_at: string
}

export interface Condition {
    broadcaster_user_id?: string
}

export interface Transport {
    method: string
    session_id: string
}

export interface Event {
    user_id: string
    user_login: string
    user_name: string
    broadcaster_user_id: string
    broadcaster_user_login: string
    broadcaster_user_name: string
    followed_at: string
}
