export const Actions = [
    {
        "action": "SendChatMessage",
        "param": {
            "method": "POST",
            "Suscription": "/helix/chat/messages",
            "scope": ["user:write:chat", "user:bot", "channel:bot"],
            "conditions": [
                "broascaster_id",
                "sender_id",
                "message"
            ]
        }
    },
    {
        "action": "SendChatMessage",
        "param": {
            "method": "POST",
            "Suscription": "/helix/chat/messages",
            "scope": ["user:write:chat", "user:bot", "channel:bot"],
            "conditions": [
                "broascaster_id",
                "sender_id",
                "message"
            ]
        }
    }
] as const