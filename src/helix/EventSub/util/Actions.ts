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
            body:[
                "broascaster_id",
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
                "from_user_id",
                "to_user_id",
            ],
            body:[
                "message"
            ]
        }
    }
] as const