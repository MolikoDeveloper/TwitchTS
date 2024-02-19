/*export interface subEvent {
    event: string
    param: Param
    only_webhooks?: boolean
    note?: string
}

export interface Param {
    event: string
    method: string
    version: number
    Subscription: string
    scope?: string
    conditions?: string[]
}
*/
export const SubEvents =
    [
        {
            "event": "ChannelBan",
            "only_webhooks": false,
            "param": {
                "event": "channel.ban",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:moderate",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelUnban",
            "only_webhooks": false,
            "param": {
                "event": "channel.unban",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:moderate",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelCheer",
            "only_webhooks": false,
            "param": {
                "event": "channel.cheer",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "bits:read",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelRaid",
            "only_webhooks": false,
            "param": {
                "event": "channel.raid",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": [
                    "to_broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelFollow",
            "only_webhooks": false,
            "param": {
                "event": "channel.follow",
                "method": "POST",
                "version": 2,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "moderator:read:followers",
                "conditions": [
                    "broadcaster_user_id",
                    "moderator_user_id"
                ]
            }
        },
        {
            "event": "ChannelUpdate",
            "only_webhooks": false,
            "param": {
                "event": "channel.update",
                "method": "POST",
                "version": 2,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelSubscribe",
            "only_webhooks": false,
            "param": {
                "event": "channel.subscribe",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:subscriptions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelSubscriptionEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.subscription.end",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:subscriptions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelSubscriptionGift",
            "only_webhooks": false,
            "param": {
                "event": "channel.subscription.gift",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:subscriptions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelSubscriptionMessage",
            "only_webhooks": false,
            "param": {
                "event": "channel.subscription.message",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:subscriptions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelModeratorAdd",
            "only_webhooks": false,
            "param": {
                "event": "channel.moderator.add",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "moderation:read",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelModeratorRemove",
            "only_webhooks": false,
            "param": {
                "event": "channel.moderator.remove",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "moderation:read",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPointsCustomRewardAdd",
            "only_webhooks": false,
            "param": {
                "event": "channel.channel_points_custom_reward.add",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:redemptions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPointsCustomRewardUpdate",
            "only_webhooks": false,
            "param": {
                "event": "channel.channel_points_custom_reward.update",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:redemptions",
                "conditions": [
                    "broadcaster_user_id",
                    //"reward_id?"
                ]
            }
        },
        {
            "event": "ChannelPointsCustomRewardRemove",
            "only_webhooks": false,
            "param": {
                "event": "channel.channel_points_custom_reward.remove",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:redemptions",
                "conditions": [
                    "broadcaster_user_id",
                   // "reward_id?"
                ]
            }
        },
        {
            "event": "ChannelPointsCustomRewardRedemptionAdd",
            "only_webhooks": false,
            "param": {
                "event": "channel.channel_points_custom_reward_redemption.add",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:redemptions",
                "conditions": [
                    "broadcaster_user_id",
                   // "reward_id?"
                ]
            }
        },
        {
            "event": "ChannelPointsCustomRewardRedemptionUpdate",
            "only_webhooks": false,
            "param": {
                "event": "channel.channel_points_custom_reward_redemption.update",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:redemptions",
                "conditions": [
                    "broadcaster_user_id",
                  //  "reward_id?"
                ]
            }
        },
        {
            "event": "ChannelPollBegin",
            "only_webhooks": false,
            "param": {
                "event": "channel.poll.begin",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:polls",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPollProgress",
            "only_webhooks": false,
            "param": {
                "event": "channel.poll.progress",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:polls",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPollEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.poll.end",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:polls",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPredictionBegin",
            "only_webhooks": false,
            "param": {
                "event": "channel.prediction.begin",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:predictions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPredictionProgress",
            "only_webhooks": false,
            "param": {
                "event": "channel.prediction.progress",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:predictions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPredictionLock",
            "only_webhooks": false,
            "param": {
                "event": "channel.prediction.lock",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:predictions",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelPredictionEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.prediction.end",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
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
                "Subscription": "/helix/eventsub/subscriptions",
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
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": []
            }
        },
        {
            "event": "ChannelGoalBegin",
            "only_webhooks": false,
            "param": {
                "event": "channel.goal.begin",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:goals",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelGoalProgress",
            "only_webhooks": false,
            "param": {
                "event": "channel.goal.progress",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:goals",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelGoalEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.goal.end",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:goals",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelHypeTrainBegin",
            "only_webhooks": false,
            "param": {
                "event": "channel.hype_train.begin",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:hype_train",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelHypeTrainProgress",
            "only_webhooks": false,
            "param": {
                "event": "channel.hype_train.progress",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:hype_train",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "ChannelHypeTrainEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.hype_train.end",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:hype_train",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "StreamOnline",
            "only_webhooks": false,
            "param": {
                "event": "stream.online",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "StreamOffline",
            "only_webhooks": false,
            "param": {
                "event": "stream.offline",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": [
                    "broadcaster_user_id"
                ]
            }
        },
        {
            "event": "UserAuthorizationGrant",
            "only_webhooks": true,
            "param": {
                "event": "user.authorization.grant",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": []
            }
        },
        {
            "event": "UserAuthorizationRevoke",
            "only_webhooks": true,
            "note": "ONLY WEBHOOKS",
            "param": {
                "event": "user.authorization.revoke",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "",
                "conditions": []
            }
        },
        {
            "event": "UserUpdate",
            "only_webhooks": false,
            "param": {
                "event": "user.update",
                "method": "POST",
                "version": 1,
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "user:read:email?",
                "conditions": [
                    "user_id"
                ]
            }
        },
        {
            "event": "ChannelGuestStarSessionBegin",
            "only_webhooks": false,
            "param": {
                "event": "channel.guest_star_session.begin",
                "method": "POST",
                "version": "beta",
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:guest_star+moderator:read:guest_star",
                "conditions": [
                    "broadcaster_user_id",
                    "moderator_user_id"
                ]
            }
        },
        {
            "event": "ChannelGuestStarSessionEnd",
            "only_webhooks": false,
            "param": {
                "event": "channel.guest_star_session.End",
                "method": "POST",
                "version": "beta",
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:guest_star+moderator:read:guest_star",
                "conditions": [
                    "broadcaster_user_id",
                    "moderator_user_id"
                ]
            }
        },
        {
            "event": "ChannelGuestStarSessionUpdate",
            "only_webhooks": false,
            "param": {
                "event": "channel.guest_star_session.Update",
                "method": "POST",
                "version": "beta",
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:guest_star+moderator:read:guest_star",
                "conditions": [
                    "broadcaster_user_id",
                    "moderator_user_id"
                ]
            }
        },
        {
            "event": "ChannelGuestStarSettingsUpdate",
            "only_webhooks": false,
            "param": {
                "event": "channel.guest_star_settings.update",
                "method": "POST",
                "version": "beta",
                "Subscription": "/helix/eventsub/subscriptions",
                "scope": "channel:read:guest_star+moderator:read:guest_star",
                "conditions": [
                    "broadcaster_user_id",
                    "moderator_user_id"
                ]
            }
        }
    ] as const;