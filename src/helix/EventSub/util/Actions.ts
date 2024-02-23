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
            queryLoop:null,
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
                "from_user_id=[0]",
                "to_user_id=[1]",
            ],
            queryLoop:null,
            body: [
                "message"
            ]
        }
    },
    {
        action: "GetUserChatColor",
        param:{
            method: "GET",
            Subscription: "/helix/chat/color",
            scope: [],
            query: [],
            body: []
        }
    },
    {
        action: "StartCommercial",
        param:{
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
        param:{
            method: "GET",
            Subscription: "/channels/ads",
            scope: ["channel:read:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "SnoozeNextAd",
        param:{
            method: "POST",
            Subscription: "/channels/ads/schedule/snooze",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "SnoozeNextAd",
        param:{
            method: "POST",
            Subscription: "/analytics/extensions",
            scope: ["channel:manage:ads"],
            query: ['broadcaster_id'],
            body: []
        }
    },
    {
        action: "GetExtensionAnalytics",
        param:{
            method: "GET",
            Subscription: "/analytics/extensions",
            scope: ["analytics:read:extensions"],
            query: [],
            body: []
        }
    },
    {
        action: "GetGameAnalytics",
        param:{
            method: "GET",
            Subscription: "/analytics/games",
            scope: ["analytics:read:games"],
            query: ['game_id','started_at','ended_at','first','after'],
            body: []
        }
    },
] as const