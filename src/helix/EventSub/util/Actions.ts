export const Actions = [
    {
        action: "SendChatMessage",
        param: {
            method: "POST",
            Suscription: "/helix/chat/messages",
            scope: [
                "user:write:chat",
                "user:bot",
                "channel:bot"
            ],
            query: [],
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
            Suscription: "/helix/whispers",
            scope: ["user:manage:whispers"],
            query: [
                "from_user_id=[0]",
                "to_user_id=[1]",
            ],
            body: [
                "message"
            ]
        }
    }
] as const