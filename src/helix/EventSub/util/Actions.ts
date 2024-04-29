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
            query: null,
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
            scope: null,
            query: ['user_id'],
            body: null
        }
    },
    {
        action: "StartCommercial",
        param: {
            method: "POST",
            Subscription: "/channels/commercial",
            scope: ["channel:edit:commercial"],
            query: null,
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
            body: null
        }
    },
    {
        action: "SnoozeNextAd",
        param: {
            method: "POST",
            Subscription: "/channels/ads/schedule/snooze",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: null
        }
    },
    {
        action: "SnoozeNextAd",
        param: {
            method: "POST",
            Subscription: "/analytics/extensions",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: null
        }
    },
    {
        action: "GetExtensionAnalytics",//REVISAR
        param: {
            method: "GET",
            Subscription: "/helix/analytics/extensions",
            scope: ["analytics:read:extensions"],
            query: null,
            body: null
        }
    },
    {
        action: "GetGameAnalytics",
        param: {
            method: "GET",
            Subscription: "/helix/analytics/games",
            scope: ["analytics:read:games"],
            query: ['game_id', 'type', 'started_at',
             'ended_at', 'first', 'after'],
            body: null
        }
    },
    {
        action: "GetBitsLeaderboard",
        param: {
            method: "GET",
            Subscription: "/helix/bits/leaderboard",
            scope: ["bits:read"],
            query: ["count","period", "started_at", "user_id"],
            body: null
        }
    },
    {
        action: "GetCheermotes",
        param: {
            method: "GET",
            Subscription: "/helix/bits/cheermotes",
            scope: null,
            query: ["broadcaster_id"],
            body: null
        }
    },
    {
        action: "GetExtensionTransactions",
        param: {
            method: "GET",
            Subscription: "/helix/extensions/transactions",
            scope: null,
            query: ["extension_id", "id", "first", "after"],
            body: null
        }
    },
    {
        action: "GetChannelInformation",
        param: {
            method: "GET",
            Subscription: "/helix/channels",
            scope: null,
            query: ['broadcaster_id'],
            body: null
        }
    },
    {
        action: "ModifyChannelInformation",
        param: {
            method: "PATCH",
            Subscription: "/helix/channels",
            scope: ["channel:manage:broadcast"],
            query: ["broadcaster_id"],
            body: ["game_id", "broadcaster_language", "title", "delay", "tags", "content_classification_labels", "is_branded_content"]
        }
    },
    {
        action: "GetChannelEditors",
        param: {
            method: "GET",
            Subscription: "/helix/channels/editors",
            scope: ["channel:read:editors"],
            query: ["broadcaster_id"],
            body: null
        }
    },
    {
        action: "GetFollowedChannels",
        param: {
            method: "GET",
            Subscription: "/helix/channels/followed",
            scope: ["user:read:follows"],
            query: ['user_id','broadcaster_id', 'first', 'after'],
            body: null
        }
    },
    {
        action: "GetChannelFollowers",
        param: {
            method: "GET",
            Subscription: "/helix/channels/followers",
            scope: ["moderator:read:followers"],
            query: ['broadcaster_id', 'user_id', 'first', 'after'],
            body: null
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
    {
        action: "GetChannelChatBadges",
        param: {
            method: "GET",
            Subscription: "/helix/chat/badges",
            scope: null,
            query: ['broadcaster_id'],
            body: null
        }
    },
    {
        action: "GetGlobalChatBadges",
        param: {
            method: "GET",
            Subscription: "/helix/chat/badges/global",
            scope: null,
            query: null,
            body: null
        }
    },
    {
        action: "GetChatters",
        param: {
            method: "GET",
            Subscription: "/helix/chat/chatters",
            scope: ['moderator:read:chatters'],
            query: ["broadcaster_id", "moderator_id", "first", "after"],
            body: null
        }
    },
    {
        action: "GetModerators",
        param: {
            method: "GET",
            Subscription: "/helix/moderation/moderators",
            scope: ['moderation:read'],
            query: ["broadcaster_id", "first", "after", "user_id"],
            body: null
        }
    },
    {
        action: "GetVips",
        param: {
            method: "GET",
            Subscription: "/helix/channels/vips",
            scope: ['channel:read:vips'],
            query: ["broadcaster_id", "user_id", "first", "after"],
            body: null
        }
    },
    {
        action: "GetGames",
        param: {
            method: "GET",
            Subscription: "/helix/games",
            scope: null,
            query: ["id", "name", "igdb_id"],
            body: null
        }
    },
    {
        action: "GetUsers",
        param: {
            method: "GET",
            Subscription: "/helix/users",
            scope: null,
            query: ["id", "login"],
            body: null
        }
    },
] as const

export interface Cheermotes {
    prefix: string
    tiers: Tier[];
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

export interface ChannelInformation {
    game_id?: string,
    broadcasterLanguage?: string,
    title?: string,
    delay?: number,
    tags?: string[],
    contentClassificationLabels?: contentClassificationLabels[],
    isBrandedContent?: boolean
}

interface contentClassificationLabels {
    id: "DrugsIntoxication" | "SexualThemes" | "ViolentGraphic" | "Gambling" | "ProfanityVulgarity",
    is_Enabled: boolean;
}