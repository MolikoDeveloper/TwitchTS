export interface Options{
    identity: Session
    channels?: string[]
    debug?:boolean = false,
    testWebsocket?: boolean = false
    profaneFilter?: boolean = false
}

export interface Session{
    user?: {
        username?: string,
        token: string,
        refreshToken?: string,
        code: string
    }
    app?:{
        clientId: string,
        secret?: string,
        redirect_uri?: string,
        events?: EventType[],
        actions?: actionType[] 
    }
}

export type actionType = 
| 'SendChatMessage'


export type scope =
| 'analytics:read:extensions'
| 'analytics:read:games'
| 'bits:read'
| 'channel:edit:commercial'
| 'channel:manage:broadcast'
| 'channel:manage:extensions'
| 'channel:manage:moderators'
| 'channel:manage:polls'
| 'channel:manage:predictions'
| 'channel:manage:raids'
| 'channel:manage:redemptions'
| 'channel:manage:schedule'
| 'channel:manage:videos'
| 'channel:manage:vips'
| 'channel:moderate'
| 'channel:read:charity'
| 'channel:read:editors'
| 'channel:read:goals'
| 'channel:read:hype_train'
| 'channel:read:polls'
| 'channel:read:predictions'
| 'channel:read:redemptions'
| 'channel:read:stream_key'
| 'channel:read:subscriptions'
| 'channel:read:vips'
| 'chat:edit'
| 'chat:read'
| 'clips:edit'
| 'moderation:read'
| 'moderator:manage:announcements'
| 'moderator:manage:automod'
| 'moderator:manage:automod_settings'
| 'moderator:manage:banned_users'
| 'moderator:manage:blocked_terms'
| 'moderator:manage:chat_messages'
| 'moderator:manage:chat_settings'
| 'moderator:manage:shield_mode'
| 'moderator:manage:shoutouts'
| 'moderator:read:automod_settings'
| 'moderator:read:blocked_terms'
| 'moderator:read:chat_settings'
| 'moderator:read:chatters'
| 'moderator:read:followers'
| 'moderator:read:shield_mode'
| 'moderator:read:shoutouts'
| 'user:edit'
| 'user:manage:blocked_users'
| 'user:manage:chat_color'
| 'user:manage:whispers'
| 'user:read:blocked_users'
| 'user:read:broadcast'
| 'user:read:email'
| 'user:read:follows'
| 'user:read:subscriptions'
| 'whispers:read'
| 'whispers:edit'

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