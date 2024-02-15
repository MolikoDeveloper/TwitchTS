import eventsjson from './SubEvents.json'

export const eventList: subEvent[] = eventsjson;

export enum WebSocketPaths {
    EventSub = "wss://eventsub.wss.twitch.tv/ws",
    EventSubLocalTest = "ws://127.0.0.1:8080/ws"
};

export enum RequestHosts {
    BaseAPI = "api.twitch.tv",
    BaseAPILocalTest = "127.0.0.1"
};

export interface subEvent {
    event: string
    param: Param
    only_webhooks?: boolean
    note?: string
}

export interface Param {
    event: string
    method: string
    version: number
    Suscription: string
    scope?: string | null
    conditions?: string[]
}

export interface UserInfo {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    created_at: string
}