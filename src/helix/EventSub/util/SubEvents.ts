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
    scope?: string
    conditions?: string[]
}

export const SubEvents: subEvent[] = [
    {
        "event": "ChannelBan",
        "param": {
            "event": "channel.ban",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:moderate",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelUnban",
        "param": {
            "event": "channel.unban",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:moderate",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelCheer",
        "param": {
            "event": "channel.cheer",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "bits:read",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelRaidTo",
        "param": {
            "event": "channel.raid",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": [
                "to_broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelRaidFrom",
        "param": {
            "event": "channel.raid",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": [
                "from_broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelFollow",
        "param": {
            "event": "channel.follow",
            "method": "POST",
            "version": 2,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "moderator:read:followers",
            "conditions": [
                "broadcaster_user_id",
                "moderator_user_id"
            ]
        }
    },
    {
        "event": "ChannelUpdate",
        "param": {
            "event": "channel.update",
            "method": "POST",
            "version": 2,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelSubscribe",
        "param": {
            "event": "channel.subscribe",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:subscriptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelSubscriptionEnd",
        "param": {
            "event": "channel.subscription.end",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:subscriptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelSubscriptionGift",
        "param": {
            "event": "channel.subscription.gift",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:subscriptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelSubscriptionMessage",
        "param": {
            "event": "channel.subscription.message",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:subscriptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelModeratorAdd",
        "param": {
            "event": "channel.moderator.add",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "moderation:read",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelModeratorRemove",
        "param": {
            "event": "channel.moderator.remove",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "moderation:read",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardAdd_Read",
        "param": {
            "event": "channel.channel_points_custom_reward.add",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:redemptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardAdd_Manage",
        "param": {
            "event": "channel.channel_points_custom_reward.add",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:manage:redemptions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardUpdate",
        "param": {
            "event": "channel.channel_points_custom_reward.update",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:redemptions",
            "conditions": [
                "broadcaster_user_id",
                "reward_id?"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardRemove",
        "param": {
            "event": "channel.channel_points_custom_reward.remove",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:redemptions",
            "conditions": [
                "broadcaster_user_id",
                "reward_id?"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardRedemptionAdd",
        "param": {
            "event": "channel.channel_points_custom_reward_redemption.add",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:redemptions",
            "conditions": [
                "broadcaster_user_id",
                "reward_id?"
            ]
        }
    },
    {
        "event": "ChannelPointsCustomRewardRedemptionUpdate",
        "param": {
            "event": "channel.channel_points_custom_reward_redemption.update",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:redemptions",
            "conditions": [
                "broadcaster_user_id",
                "reward_id?"
            ]
        }
    },
    {
        "event": "ChannelPollBegin",
        "param": {
            "event": "channel.poll.begin",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:polls",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPollProgress",
        "param": {
            "event": "channel.poll.progress",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:polls",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPollEnd",
        "param": {
            "event": "channel.poll.end",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:polls",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPredictionBegin",
        "param": {
            "event": "channel.prediction.begin",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:predictions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPredictionProgress",
        "param": {
            "event": "channel.prediction.progress",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:predictions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPredictionLock",
        "param": {
            "event": "channel.prediction.lock",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:predictions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "ChannelPredictionEnd",
        "param": {
            "event": "channel.prediction.end",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:predictions",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "DropEntitlementGrant",
        "only_webhooks": true,
        "param": {
            "event": "drop.entitlement.grant",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": []

        }
    },
    {
        "event": "ExtensionBitsTransactionCreate",
        "only_webhooks": true,
        "param": {
            "event": "extension.bits_transaction.create",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": []
        }
    },
    {
        "event": "GoalBegin",
        "param": {
            "event": "channel.goal.begin",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:goals",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "GoalProgress",
        "param": {
            "event": "channel.goal.progress",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:goals",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "GoalEnd",
        "param": {
            "event": "channel.goal.end",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:goals",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "HypeTrainBegin",
        "param": {
            "event": "channel.hype_train.begin",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:hype_train",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "HypeTrainProgress",
        "param": {
            "event": "channel.hype_train.progress",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:hype_train",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "HypeTrainEnd",
        "param": {
            "event": "channel.hype_train.end",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "channel:read:hype_train",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "StreamOnline",
        "param": {
            "event": "stream.online",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "StreamOffline",
        "param": {
            "event": "stream.offline",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": [
                "broadcaster_user_id"
            ]
        }
    },
    {
        "event": "UserAuthorizationGrant",
        "note": "ONLY WEBHOOKS",
        "param": {
            "event": "user.authorization.grant",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": []
        }
    },
    {
        "event": "UserAuthorizationRevoke",
        "note": "ONLY WEBHOOKS",
        "param": {
            "event": "user.authorization.revoke",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "",
            "conditions": []
        }
    },
    {
        "event": "UserUpdate",
        "param": {
            "event": "user.update",
            "method": "POST",
            "version": 1,
            "Suscription": "/helix/eventsub/subscriptions",
            "scope": "user:read:email?",
            "conditions": [
                "user_id"
            ]
        }
    }
] as const;