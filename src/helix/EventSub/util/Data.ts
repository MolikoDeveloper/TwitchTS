import eventsjson from './SubEvents.json'


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

export type APIMessage = {
    metadata: {
        message_id: string,
        message_type: string,
        message_timestamp: string
    },
    payload: {
        session?: {
            id: string
            status: string,
            connected_at: string,
            keepalive_timeout_seconds: number,
            reconnect_url: string | null
        },
        subscription?: {
            type: string,
            created_at?: string
        },
        event?: {
            broadcaster_user_name: string
        }
    }
}

export type APINotification = {
    metadata: {
        message_id: string,
        message_type: string,
        message_timestamp: string
    },
    payload: {
        session?: {
            id: string
            status: string,
            connected_at: string,
            keepalive_timeout_seconds: number,
            reconnect_url: string | null
        },
        subscription?: {
            type: string,
            created_at?: string
        },
        event?: {
            broadcaster_user_name: string
        }
    }
}

export enum WebSocketPaths {
    EventSub = "wss://eventsub.wss.twitch.tv/ws"
    //EventSub = "ws://127.0.0.1:8080/ws"
};

export enum RequestHosts {
    BaseAPI = "api.twitch.tv"
};
export const enum RequestPaths {
    Subscription = "/helix/eventsub/subscriptions/",
    Clips = "helix/clips/"
}

export type EventType =
    | 'ChannelBan'
    | 'ChannelUnban'
    | 'ChannelCheer'
    | 'ChannelRaid'
    | 'ChannelFollow'
    | 'ChannelUpdate'
    | 'ChannelSubscribe'
    | 'ChannelSubscriptionEnd'
    | 'ChannelSubscriptionGift'
    | 'ChannelSubscriptionMessage'
    | 'ChannelModeratorAdd'
    | 'ChannelModeratorRemove'
    | 'ChannelPointsCustomRewardAdd'
    | 'ChannelPointsCustomRewardUpdate'
    | 'ChannelPointsCustomRewardRemove'
    | 'ChannelPointsCustomRewardRedemptionAdd'
    | 'ChannelPointsCustomRewardRedemptionUpdate'
    | 'ChannelPollBegin'
    | 'ChannelPollProgress'
    | 'ChannelPollEnd'
    | 'ChannelPredictionBegin'
    | 'ChannelPredictionProgress'
    | 'ChannelPredictionLock'
    | 'ChannelPredictionEnd'
    | 'DropEntitlementGrant'
    | 'ExtensionBitsTransactionCreate'
    | 'GoalBegin'
    | 'GoalProgress'
    | 'GoalEnd'
    | 'HypeTrainBegin'
    | 'HypeTrainProgress'
    | 'HypeTrainEnd'
    | 'StreamOnline'
    | 'StreamOffline'
    | 'UserAuthorizationGrant'
    | 'UserAuthorizationRevoke'
    | 'UserUpdate'
    | 'ChannelGuestStarSessionBegin'
    | 'ChannelGuestStarSessionEnd'
    | 'ChannelGuestStarSessionUpdate'
    | 'ChannelGuestStarSettingsUpdate';

export interface SubcriptionType {
    event?: string
    param?: {
        event?: string;
        method?: string;
        version?: string | number;
        Suscription?: string;
    }
}

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
}
substype('ChannelBan');