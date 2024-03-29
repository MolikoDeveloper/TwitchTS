export const Actions = [
    {
        action: "SendChatMessage",
        param: {
            method: "POST",
            Subscription: "/helix/chat/messages",
            scope: [
                "user:write:chat",
                "user:bot",
                "channel:bot"
            ],
            query: [],
            queryLoop: null,
            body: [
                "broadcaster_id",
                "sender_id",
                "message"
            ]
        }
    },
    {
        action: "SendWhisper",
        param: {
            method: "POST",
            Subscription: "/helix/whispers",
            scope: ["user:manage:whispers"],
            query: [
                "from_user_id",
                "to_user_id",
            ],
            queryLoop: null,
            body: [
                "message"
            ]
        }
    },
    {
        action: "GetUserChatColor",
        param: {
            method: "GET",
            Subscription: "/helix/chat/color",
            scope: [],
            query: [],
            body: []
        }
    },
    {
        action: "StartCommercial",
        param: {
            method: "POST",
            Subscription: "/channels/commercial",
            scope: ["channel:edit:commercial"],
            query: [],
            body: [
                "broadcaster_id",
                "length"
            ]
        }
    },
    {
        action: "GetAdSchedule",
        param: {
            method: "GET",
            Subscription: "/channels/ads",
            scope: ["channel:read:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "SnoozeNextAd",
        param: {
            method: "POST",
            Subscription: "/channels/ads/schedule/snooze",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "SnoozeNextAd",
        param: {
            method: "POST",
            Subscription: "/analytics/extensions",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "GetExtensionAnalytics",//REVISAR
        param: {
            method: "GET",
            Subscription: "/helix/analytics/extensions",
            scope: ["analytics:read:extensions"],
            query: [],
            body: []
        }
    },
    {
        action: "GetGameAnalytics",
        param: {
            method: "GET",
            Subscription: "/helix/analytics/games",
            scope: ["analytics:read:games"],
            query: ['first'],
            body: []
        }
    },
    {
        action: "GetBitsLeaderboard",
        param: {
            method: "GET",
            Subscription: "/helix/bits/leaderboard",
            scope: ["bits:read"],
            query: [],
            body: []
        }
    },
    {
        action: "GetCheermotes",
        param: {
            method: "GET",
            Subscription: "/helix/bits/cheermotes",
            scope: [],
            query: ["broadcaster_id"],
            body: []
        }
    },
    {
        action: "GetExtensionTransactions",
        param: {
            method: "GET",
            Subscription: "/helix/extensions/transactions",
            scope: [],
            query: ["extension_id", "first", "after"],
            body: []
        }
    },
    {
        action: "GetChannelInformation",
        param: {
            method: "GET",
            Subscription: "/helix/channels",
            scope: [],
            query: [],
            body: []
        }
    },
    {
        action: "ModifyChannelInformation",
        param: {
            method: "PATCH",
            Subscription: "/helix/channels",
            scope: ["channel:manage:broadcast"],
            query: ["broadcaster_id"],
            body: ["game_id","broadcaster_language","title", "delay", "tags", /*"content_classification_labels",*/ "is_branded_content"]
        }
    },
    {
        action: "GetChannelEditors",
        param: {
            method: "GET",
            Subscription: "/helix/channels/editors",
            scope: ["channel:read:editors"],
            query: ["broadcaster_id"],
            body: []
        }
    },
    {
        action: "GetFollowedChannels",
        param: {
            method: "GET",
            Subscription: "/helix/channels/followed",
            scope: ["user:read:follows"],
            query: ['user_id','first'],
            body: []
        }
    },
    {
        action: "GetChannelFollowers",
        param: {
            method: "GET",
            Subscription: "/helix/channels/followers",
            scope: ["moderator:read:followers"],
            query: ['broadcaster_id','user_id','first'],
            body: []
        }
    },
    {
        action: "CreateCustomRewards",
        param: {
            method: "POST",
            Subscription: "/helix/channel_points/custom_rewards",
            scope: ["channel:manage:redemptions"],
            query: ['broadcaster_id'],
            body: [
                "title",
                "cost",
                "prompt",
                "is_enabled",
                "background_color",
                "is_user_input_required",
                "is_max_per_stream_enabled",
                "max_per_stream",
                "is_max_per_user_per_stream_enabled",
                "max_per_user_per_stream",
                "is_global_cooldown_enabled",
                "global_cooldown_seconds",
                "should_redemptions_skip_request_queue"
            ]
        }
    },
] as const

export interface Cheermotes {
    prefix: string
    tiers: Tier[]
    type: string
    order: number
    last_updated: string
    is_charitable: boolean
}

export interface Tier {
    min_bits: number
    id: string
    color: string
    images: Images
    can_cheer: boolean
    show_in_bits_card: boolean
}

export interface Images {
    dark: Dark
    light: Light
}

export interface Dark {
    animated: Animated
    static: Static
}

export interface Animated {
    "1": string
    "1.5": string
    "2": string
    "3": string
    "4": string
}

export interface Static {
    "1": string
    "1.5": string
    "2": string
    "3": string
    "4": string
}

export interface Light {
    animated: Animated2
    static: Static2
}

export interface Animated2 {
    "1": string
    "1.5": string
    "2": string
    "3": string
    "4": string
}

export interface Static2 {
    "1": string
    "1.5": string
    "2": string
    "3": string
    "4": string
}

export interface ExtensionTransactions {
    id: string
    timestamp: string
    broadcaster_id: string
    broadcaster_login: string
    broadcaster_name: string
    user_id: string
    user_login: string
    user_name: string
    product_type: string
    product_data: ProductData
}

export interface ProductData {
    domain: string
    sku: string
    cost: Cost
    inDevelopment: boolean
    displayName: string
    expiration: string
    broadcast: boolean
}

export interface Cost {
    amount: number
    type: string
}

export interface ChannelInformation{
    game_id?:string,
    broadcasterLanguage?:string,
    title?:string,
    delay?:number,
    tags?:string[],
    //contentClassificationLabels?: contentClassificationLabels[]|'',
    isBrandedContent?:boolean|''
}

interface contentClassificationLabels
{
    ID: "DrugsIntoxication"|"SexualThemes"|"ViolentGraphic"|"Gambling"|"ProfanityVulgarity",
    isEnabled:boolean;
}