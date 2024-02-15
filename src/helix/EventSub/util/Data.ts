import eventsjson from './SubEvents.json'

export const eventList:subEvent[] = eventsjson;

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
    scope?: string|null
    conditions?: string[]
  }


export type SubscriptionData = {
    type: string,
    version?: string,
    condition: {
        broadcaster_user_id: string,
        moderator_user_id: string
    },
    transport: {
        method: string,
        callback?: string,
        session_id?: string,
    }
}

export type EventSub = {
    user_id?: string,
    user_login?: string,
    user_name?: string,
    broadcaster_user_id?: string,
    broadcaster_user_login?: string,
    broadcaster_user_name?: string
}

export enum WebSocketPaths {
    EventSub = "wss://eventsub.wss.twitch.tv/ws",
    EventSubLocalTest = "ws://127.0.0.1:8080/ws"
};

export enum RequestHosts {
    BaseAPI = "api.twitch.tv",
    BaseAPILocalTest = "127.0.0.1"
};

export const enum RequestPaths {
    Subscription = "/helix/eventsub/subscriptions",
    Clips = "helix/clips/"
}

export interface SubcriptionType {
    event?: string
    param?: {
        event?: string;
        method?: string;
        version?: string | number;
        Suscription?: string;
    }
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

/*
export function substype(event: EventType) : SubcriptionType{
    let data = eventsjson.find(element => element.event === event);
    
    let temp: SubcriptionType = {
        'event': data?.event,
        'param': {
            'event': data?.param.event,
            'method': data?.param.method,
            'version': data?.param.version,
            'Suscription': data?.param.Suscription,
        }
    }

    return temp;
}*/
