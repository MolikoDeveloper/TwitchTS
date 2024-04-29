this project was created with [bun](https://bun.sh).
> [!WARNING]  
> W.I.P Please Do not use in Production.

# TwitchTS (bun)

## install:
bun:
```bash
bun install MolikoDeveloper/TwitchTS
```

## Connect to Chat IRC

you can connect to the chat as anonymous, or with your username and [twitch Oauth Token](https://dev.twitch.tv/docs/cli/token-command/#get-an-access-token) 


```ts
import {IrcClient} from 'twitchts';

const chat = new IrcClient({
    channels: ['CHANNEL'],
    identity:{
        user:{
            username: "<YOUR_USERNAME>",
            token: "<YOUR TOKEN>",
            refreshToken: "<YOUR REFRESH TOKEN IF YOU GENERATE A CODE>.",
            code: "<oauth code>" 
        },
    }
    debug:true,
    profaneFilter: true;
});


chat.on('message', (channel, tags, message, self) => {
    if (self) return; //if self == channel.idendity return.
    
    if(message.toLocaleLowerCase().includes("hello")){
        chat.say(channel, `hi @${tags['display-name']}`);
    }
})
```


# EventSub (websocket)

```ts
import { EventSub } from 'twitchts';

let client: EventSub = new EventSub({
    identity: {
        user: {
            token: `<YOUR TOKEN HERE, WITHOUT 'Bearer ...'>`,
            refreshToken: `<REFRESHTOKEN>`,
            code: `<oauth code>`
        },
        app: {
            clientId: `<YOUR CLIENT ID>`,
            secret: `<YOUR APP SECRET>`,
            redirect_uri: `<URL>`,
            events: ['ChannelUpdate','ChannelBan','ChannelFollow', '<other...>'],
            actions: ['<WORK IN PROGRESS>'] //send whisper, messages with helix api, raid, poll, predictions, etc...
        }
    },
    channels: ["<CHANNEL USERNAME OR DISPLAY NAME>"],
    debug: true, //print debug information, token links for eventsub
    testWebsocket: false
});

client.on('ChannelUpdate', (event) => {
    console.log('New Title:',event.title);
});

client.on('ChannelBan', (event) => {
    console.log(event.user_name, event.reason);
});

client.on('ChannelFollow', (event) => {
    console.log(event.user_name, 'is a new follower!');
});
```

# IRC and EventSub at same time.

yes, the `Options` are compatible with both.

```ts
import { EventSub, IrcClient, type Options } from '..';

const option: Options = {
    identity: {
        user: {
            username: '<user_name>', //all without < >
            token: `<token>`,
            refreshToken: `<refresh_token>`,
            code: `<code>`
        },
        app: {
            clientId: `<client_id>`,
            secret: `<app_secret>`,
            redirect_uri: `<URL>`,
            events: ['ChannelFollow'],
            actions: []
        }
    },
    channels: ["albertosaurus_ac"],
    debug: true,
    testWebsocket: false
}

const subs = new EventSub(option);
const chat = new IrcClient(option);

//
subs.on('ChannelFollow', (event) => {
    chat.say(event.broadcaster_user_name, `Thanks for your follow @${event.user_name}!`)
    chat.say(event.broadcaster_user_name, `BUT NOW YOU ARE BANNED! WAJAJAJA`);
    subs.ban(event.broadcaster_user_name,event.broadcaster_user_name);
    subs.unban(event.broadcaster_user_name,event.broadcaster_user_name);
    chat.say(event.broadcaster_user_name, `im joking, just chill.`);

});

```

## TO-DO

- [x] IRC Connection
    - [x] Oauth
    - [x] Events
        - [x] on message
        - [x] on command
        - [x] on join
        - [x] on notice
        - [x] on ban
        - [x] on clear chat
        - [x] on reconnect
        - [x] on roomstate

    - [x] Command Recognition (!command parameters split by space)
    
- [x] WebSocket EventSub Connection
    - [x] Baurer Oauth
    - [x] Local Enviroment testing with Twitch CLI
    - [x] [Subscriptions](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/) ` use with EventSub.on('ChannelBan', (event) => {  }) `
        - [x] [Channel.Ban](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelban)
        - [x] [Channel.Unban](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelunban)
        - [x] [Channel.Cheer](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcheer)
        - [x] [Channel.Raid](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelraid)
        - [x] [Channel.Follow](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelfollow)
        - [x] [Channel.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelupdate)
        - [x] [Channel.Subscribe](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscribe)
        - [x] [Channel.Subscription.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscriptionend)
        - [x] [Channel.Subscription.Gift](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscriptiongift)
        - [x] [Channel.Subscription.Message](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscriptionmessage)
        - [x] [Channel.Moderator.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelmoderatoradd)
        - [x] [Channel.Moderator.Remove](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelmoderatorremove)
        - [x] [Channel.Points_Custom_Reward.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_rewardadd)
        - [x] [Channel.Points_Custom_Reward.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_rewardupdate)
        - [x] [Channel.Points_Custom_Reward.Remove](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_rewardremove)
        - [x] [Channel.Points_Custom_Reward.Redemption.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
        - [x] [Channel.Points_Custom_Reward.Redemption.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionupdate)
        - [x] [Channel.Poll.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollbegin)
        - [x] [Channel.Poll.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollprogress)
        - [x] [Channel.Poll.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollend)
        - [x] [Channel.Prediction.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionbegin)
        - [x] [Channel.Prediction.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionprogress)
        - [x] [Channel.Prediction.Lock](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionlock)
        - [x] [Channel.Prediction.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionend)
        - [x] [Drop.Entitlement.Grant](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#dropentitlementgrant)
        - [x] [Extension.Bits_Transaction.Create](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#extensionbits_transactioncreate)
        - [x] [Goal.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalbegin)
        - [x] [Goal.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalprogress)
        - [x] [Goal.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalend)
        - [x] [Hype.Train.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrainbegin)
        - [x] [Hype.Train.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrainprogress)
        - [x] [Hype.Train.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrainend)
        - [x] [Stream.Online](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamonline)
        - [x] [Stream.Offline](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamoffline)
        - [x] [User.Authorization.Grant](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userauthorizationgrant)
        - [x] [User.Authorization.Revoke](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userauthorizationrevoke)
        - [x] [User.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userupdate)
        - [x] [Channel.Guest.Star.Session.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest_star_sessionbegin)
        - [x] [Channel.Guest.Star.Session.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest_star_sessionend)
        - [x] [Channel.Guest.Star.Session.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest_star_sessionupdate)
        - [x] [Channel.Guest.Star.Settings.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest_star_settingsupdate)
    - [ ] Actions
        - [x] Ads
            - [x] [Start Commercial](https://dev.twitch.tv/docs/api/reference/#start-commercial)
            - [x] [Get Ad Schedule](https://dev.twitch.tv/docs/api/reference/#get-ad-schedule)
            - [x] [Snooze Next Ad](https://dev.twitch.tv/docs/api/reference/#snooze-next-ad)
        - [ ] Analytics `> CHECK/REVISAR/IMPORTANTE`
            - [ ] [Get Extension Analytics](https://dev.twitch.tv/docs/api/reference/#get-extension-analytics)
            - [ ] [Get Game Analytics](https://dev.twitch.tv/docs/api/reference/#get-game-analytics)
        - [x] Bits
            - [x] [Get Bits Leaderboard](https://dev.twitch.tv/docs/api/reference/#get-bits-leaderboard) 
            - [x] [Get Cheermotes](https://dev.twitch.tv/docs/api/reference/#get-cheermotes) 
            - [x] [Get Extension Transactions](https://dev.twitch.tv/docs/api/reference/#get-extension-transactions) 
        - [x] Channels
            - [x] [Get Channel Information](https://dev.twitch.tv/docs/api/reference/#get-channel-information) 
            - [x] [Modify Channel Information](https://dev.twitch.tv/docs/api/reference/#modify-channel-information) 
            - [x] [Get Channel Editors](https://dev.twitch.tv/docs/api/reference/#get-channel-editors) 
            - [x] [Get Followed Channels](https://dev.twitch.tv/docs/api/reference/#get-followed-channels) 
            - [x] [Get Channel Followers](https://dev.twitch.tv/docs/api/reference/#get-channel-followers) 
        - [ ] Channel Points `> Revision Pending`
            - [ ] [Create Custom Rewards](https://dev.twitch.tv/docs/api/reference/#create-custom-rewards) 
            - [ ] [Delete Custom Reward](https://dev.twitch.tv/docs/api/reference/#delete-custom-reward) 
            - [ ] [Get Custom Reward](https://dev.twitch.tv/docs/api/reference/#get-custom-reward) 
            - [ ] [Get Custom Reward Redemption](https://dev.twitch.tv/docs/api/reference/#get-custom-reward-redemption) 
            - [ ] [Update Custom Reward](https://dev.twitch.tv/docs/api/reference/#update-custom-reward) 
            - [ ] [Update Redemption Status](https://dev.twitch.tv/docs/api/reference/#update-redemption-status) 
        - [ ] Charity 
            - [ ] [Get Charity Campaign](https://dev.twitch.tv/docs/api/reference/#get-charity-campaign) 
            - [ ] [Get Charity Campaign Donations](https://dev.twitch.tv/docs/api/reference/#get-charity-campaign-donations) 
        - [ ] Chat
            - [ ] [Get Chatters](https://dev.twitch.tv/docs/api/reference/#get-chatters) 
            - [ ] [Get Channel Emotes](https://dev.twitch.tv/docs/api/reference/#get-channel-emotes) 
            - [ ] [Get Global Emotes](https://dev.twitch.tv/docs/api/reference/#get-global-emotes) 
            - [ ] [Get Emote Sets](https://dev.twitch.tv/docs/api/reference/#get-emote-sets) 
            - [x] [Get Channel Chat Badges](https://dev.twitch.tv/docs/api/reference/#get-channel-chat-badges) 
            - [x] [Get Global Chat Badges](https://dev.twitch.tv/docs/api/reference/#get-global-chat-badges) 
            - [ ] [Get Chat Settings](https://dev.twitch.tv/docs/api/reference/#get-chat-settings) 
            - [ ] [Get User Emotes](https://dev.twitch.tv/docs/api/reference/#get-user-emotes) 
            - [ ] [Update Chat Settings](https://dev.twitch.tv/docs/api/reference/#update-chat-settings) 
            - [ ] [Send Chat Announcement](https://dev.twitch.tv/docs/api/reference/#send-chat-announcement) 
            - [ ] [Send a Shoutout](https://dev.twitch.tv/docs/api/reference/#send-a-shoutout) 
            - [x] [Send Chat Message](https://dev.twitch.tv/docs/api/reference/#send-chat-message) 
            - [x] [GetColor User Chat](https://dev.twitch.tv/docs/api/reference/#get-user-chat-color) 
            - [ ] [Update User Chat Color](https://dev.twitch.tv/docs/api/reference/#update-user-chat-color) 
        - [ ] Clips
            - [ ] [Create Clip](https://dev.twitch.tv/docs/api/reference/#create-clip) 
            - [ ] [Get Clips](https://dev.twitch.tv/docs/api/reference/#get-clips) 
        - [ ] Conduits
            - [ ] [Get Conduits](https://dev.twitch.tv/docs/api/reference/#get-conduits) 
            - [ ] [Create Conduits](https://dev.twitch.tv/docs/api/reference/#create-conduits) 
            - [ ] [Update Conduits](https://dev.twitch.tv/docs/api/reference/#update-conduits) 
            - [ ] [Delete Conduit](https://dev.twitch.tv/docs/api/reference/#delete-conduit) 
            - [ ] [Get Conduit Shards](https://dev.twitch.tv/docs/api/reference/#get-conduit-shards) 
            - [ ] [Update Conduit Shards](https://dev.twitch.tv/docs/api/reference/#update-conduit-shards) 
        - [ ] Entitlements
            - [ ] [Get Content Classification Labels](https://dev.twitch.tv/docs/api/reference/#get-content-classification-labels) 
            - [ ] [Get Drops Entitlements](https://dev.twitch.tv/docs/api/reference/#get-drops-entitlements) 
        - [ ] Extensions
            - [ ] [Update Drops Entitlements](https://dev.twitch.tv/docs/api/reference/#update-drops-entitlements) 
            - [ ] [Get Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference/#get-extension-configuration-segment) 
            - [ ] [Set Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference/#set-extension-configuration-segment) 
            - [ ] [Set Extension Required Configuration](https://dev.twitch.tv/docs/api/reference/#set-extension-required-configuration) 
            - [ ] [Send Extension PubSub Message](https://dev.twitch.tv/docs/api/reference/#send-extension-pubsub-message) 
            - [ ] [Get Extension Live Channels](https://dev.twitch.tv/docs/api/reference/#get-extension-live-channels) 
            - [ ] [Get Extension Secrets](https://dev.twitch.tv/docs/api/reference/#get-extension-secrets) 
            - [ ] [Create Extension Secret](https://dev.twitch.tv/docs/api/reference/#create-extension-secret) 
            - [ ] [Send Extension Chat Message](https://dev.twitch.tv/docs/api/reference/#send-extension-chat-message) 
            - [ ] [Get Extensions](https://dev.twitch.tv/docs/api/reference/#get-extensions) 
            - [ ] [Get Released Extensions](https://dev.twitch.tv/docs/api/reference/#get-released-extensions) 
            - [ ] [Get Extension Bits Products](https://dev.twitch.tv/docs/api/reference/#get-extension-bits-products) 
            - [ ] [Update Extension Bits Product](https://dev.twitch.tv/docs/api/reference/#update-extension-bits-product) 
        - [ ] EventSub
            - [ ] [Create EventSub Subscription](https://dev.twitch.tv/docs/api/reference/#create-eventsub-subscription) 
            - [ ] [Delete EventSub Subscription](https://dev.twitch.tv/docs/api/reference/#delete-eventsub-subscription) 
            - [ ] [Get EventSub Subscriptions](https://dev.twitch.tv/docs/api/reference/#get-eventsub-subscriptions) 
        - [ ] Games
            - [ ] [Get Top Games](https://dev.twitch.tv/docs/api/reference/#get-top-games) 
            - [x] [Get Games](https://dev.twitch.tv/docs/api/reference/#get-games) 
        - [ ] Goals
            - [ ] [Get Creator Goals](https://dev.twitch.tv/docs/api/reference/#get-creator-goals) 
        - [ ] Guest Star (beta)
            - [ ] [Get Channel Guest Star Settings](https://dev.twitch.tv/docs/api/reference/#get-channel-guest-star-settings) 
            - [ ] [Update Channel Guest Star Settings](https://dev.twitch.tv/docs/api/reference/#update-channel-guest-star-settings) 
            - [ ] [Get Guest Star Session](https://dev.twitch.tv/docs/api/reference/#get-guest-star-session) 
            - [ ] [Create Guest Star Session](https://dev.twitch.tv/docs/api/reference/#create-guest-star-session) 
            - [ ] [End Guest Star Session](https://dev.twitch.tv/docs/api/reference/#end-guest-star-session) 
            - [ ] [Get Guest Star Invites](https://dev.twitch.tv/docs/api/reference/#get-guest-star-invites) 
            - [ ] [Send Guest Star Invite](https://dev.twitch.tv/docs/api/reference/#send-guest-star-invite) 
            - [ ] [Delete Guest Star Invite](https://dev.twitch.tv/docs/api/reference/#delete-guest-star-invite) 
            - [ ] [Assign Guest Star Slot](https://dev.twitch.tv/docs/api/reference/#assign-guest-star-slot) 
            - [ ] [Update Guest Star Slot](https://dev.twitch.tv/docs/api/reference/#update-guest-star-slot) 
            - [ ] [Delete Guest Star Slot](https://dev.twitch.tv/docs/api/reference/#delete-guest-star-slot) 
            - [ ] [Update Guest Star Slot Settings](https://dev.twitch.tv/docs/api/reference/#update-guest-star-slot-settings) 
        - [ ] Hype Train
            - [ ] [Get Hype Train Events](https://dev.twitch.tv/docs/api/reference/#get-hype-train-events) 
        - [ ] Moderation
            - [ ] [Check AutoMod Status](https://dev.twitch.tv/docs/api/reference/#check-automod-status) 
            - [ ] [Manage Held AutoMod Messages](https://dev.twitch.tv/docs/api/reference/#manage-held-automod-messages) 
            - [ ] [Get AutoMod Settings](https://dev.twitch.tv/docs/api/reference/#get-automod-settings) 
            - [ ] [Update AutoMod Settings](https://dev.twitch.tv/docs/api/reference/#update-automod-settings) 
            - [ ] [Get Banned Users](https://dev.twitch.tv/docs/api/reference/#get-banned-users) 
            - [ ] [Ban User](https://dev.twitch.tv/docs/api/reference/#ban-user) 
            - [ ] [Unban User](https://dev.twitch.tv/docs/api/reference/#unban-user) 
            - [ ] [Get Unban Requests](https://dev.twitch.tv/docs/api/reference/#get-unban-requests) 
            - [ ] [Resolve Unban Requests](https://dev.twitch.tv/docs/api/reference/#resolve-unban-requests) 
            - [ ] [Get Blocked Terms](https://dev.twitch.tv/docs/api/reference/#get-blocked-terms) 
            - [ ] [Add Blocked Term](https://dev.twitch.tv/docs/api/reference/#add-blocked-term) 
            - [ ] [Remove Blocked Term](https://dev.twitch.tv/docs/api/reference/#remove-blocked-term) 
            - [ ] [Delete Chat Messages](https://dev.twitch.tv/docs/api/reference/#delete-chat-messages) 
            - [ ] [Get Moderated Channels](https://dev.twitch.tv/docs/api/reference/#get-moderated-channels) 
            - [ ] [Get Moderators](https://dev.twitch.tv/docs/api/reference/#get-moderators) 
            - [ ] [Add Channel Moderator](https://dev.twitch.tv/docs/api/reference/#add-channel-moderator) 
            - [ ] [Remove Channel Moderator](https://dev.twitch.tv/docs/api/reference/#remove-channel-moderator) 
            - [ ] [Get VIPs](https://dev.twitch.tv/docs/api/reference/#get-vips) 
            - [ ] [Add Channel VIP](https://dev.twitch.tv/docs/api/reference/#add-channel-vip) 
            - [ ] [Remove Channel VIP](https://dev.twitch.tv/docs/api/reference/#remove-channel-vip) 
            - [ ] [Update Shield Mode Status](https://dev.twitch.tv/docs/api/reference/#update-shield-mode-status) 
            - [ ] [Get Shield Mode Status](https://dev.twitch.tv/docs/api/reference/#get-shield-mode-status) 
        - [ ] Polls
            - [ ] [Get Polls](https://dev.twitch.tv/docs/api/reference/#get-polls) 
            - [ ] [Create Poll](https://dev.twitch.tv/docs/api/reference/#create-poll) 
            - [ ] [End Poll](https://dev.twitch.tv/docs/api/reference/#end-poll) 
        - [ ] Predictions
            - [ ] [Get Predictions](https://dev.twitch.tv/docs/api/reference/#get-predictions) 
            - [ ] [Create Prediction](https://dev.twitch.tv/docs/api/reference/#create-prediction) 
            - [ ] [End Prediction](https://dev.twitch.tv/docs/api/reference/#end-prediction) 
        - [ ] Raids
            - [ ] [Start a raid](https://dev.twitch.tv/docs/api/reference/#start-a-raid) 
            - [ ] [Cancel a raid](https://dev.twitch.tv/docs/api/reference/#cancel-a-raid) 
        - [ ] Schedule
            - [ ] [Get Channel Stream Schedule](https://dev.twitch.tv/docs/api/reference/#get-channel-stream-schedule) 
            - [ ] [Get Channel iCalendar](https://dev.twitch.tv/docs/api/reference/#get-channel-icalendar) 
            - [ ] [Update Channel Stream Schedule](https://dev.twitch.tv/docs/api/reference/#update-channel-stream-schedule) 
            - [ ] [Create Channel Stream Schedule Segment](https://dev.twitch.tv/docs/api/reference/#create-channel-stream-schedule-segment) 
            - [ ] [Update Channel Stream Schedule Segment](https://dev.twitch.tv/docs/api/reference/#update-channel-stream-schedule-segment) 
            - [ ] [Delete Channel Stream Schedule Segment](https://dev.twitch.tv/docs/api/reference/#delete-channel-stream-schedule-segment) 
        - [ ] Search
            - [ ] [Search Categories](https://dev.twitch.tv/docs/api/reference/#search-categories) 
            - [ ] [Search Channels](https://dev.twitch.tv/docs/api/reference/#search-channels) 
        - [ ] Sreams
            - [ ] [Get Stream Key](https://dev.twitch.tv/docs/api/reference/#get-stream-key) 
            - [ ] [Get Streams](https://dev.twitch.tv/docs/api/reference/#get-streams) 
            - [ ] [Get Followed Streams](https://dev.twitch.tv/docs/api/reference/#get-followed-streams) 
            - [ ] [Create Stream Marker](https://dev.twitch.tv/docs/api/reference/#create-stream-marker) 
            - [ ] [Get Stream Markers](https://dev.twitch.tv/docs/api/reference/#get-stream-markers) 
        - [ ] Subscriptions
            - [ ] [Get Broadcaster Subscriptions](https://dev.twitch.tv/docs/api/reference/#get-broadcaster-subscriptions) 
            - [ ] [Check User Subscription](https://dev.twitch.tv/docs/api/reference/#check-user-subscription) 
        - [ ] Tags
            - [ ] [Get All Stream Tags](https://dev.twitch.tv/docs/api/reference/#get-all-stream-tags) 
            - [ ] [Get Stream Tags](https://dev.twitch.tv/docs/api/reference/#get-stream-tags) 
        - [ ] Teams
            - [ ] [Get Channel Teams](https://dev.twitch.tv/docs/api/reference/#get-channel-teams) 
            - [ ] [Get Teams](https://dev.twitch.tv/docs/api/reference/#get-teams) 
            - [ ] [Get Users](https://dev.twitch.tv/docs/api/reference/#get-users) 
        - [ ] User
            - [ ] [Update User](https://dev.twitch.tv/docs/api/reference/#update-user) 
            - [ ] [Get User Block List](https://dev.twitch.tv/docs/api/reference/#get-user-block-list) 
            - [ ] [Block User](https://dev.twitch.tv/docs/api/reference/#block-user) 
            - [ ] [Unblock User](https://dev.twitch.tv/docs/api/reference/#unblock-user) 
            - [ ] [Get User Extensions](https://dev.twitch.tv/docs/api/reference/#get-user-extensions) 
            - [ ] [Get User Active Extensions](https://dev.twitch.tv/docs/api/reference/#get-user-active-extensions) 
            - [ ] [Update User Extensions](https://dev.twitch.tv/docs/api/reference/#update-user-extensions) 
        - [ ] Videos 
            - [ ] [Get Videos](https://dev.twitch.tv/docs/api/reference/#get-videos) 
            - [ ] [Delete Videos](https://dev.twitch.tv/docs/api/reference/#delete-videos) 
        - [x] Whispers
            - [x] [Send Whisper](https://dev.twitch.tv/docs/api/reference/#send-whisper) 

            
    
- [ ] Webhook Connection
    - [ ] Baurer Oauth
    - [ ] Subscriptions
    - [ ] Actions


## Generate Token

# pending
```ts

function GetTokens(client_id, secret, code, redirect_uri){
    console.log(Token)
    console.log(RefreshToken)
}
```
#

# Twitch CLI (WebSocket EventSub)
### [install Twitch CLI](https://dev.twitch.tv/docs/cli/)

start server with:

```bash
twitch event websocket start-server
```

[send event from server:](https://dev.twitch.tv/docs/cli/websocket-event-command/)
```bash
twitch event trigger channel.ban --transport=websocket
```


# huge thanks these projects:

[@ppauel](https://github.com/ppauel) ([twitch-eventsub](https://github.com/ppauel/twitch-eventsub)) and 
[tmijs](https://github.com/tmijs) ([tmi.js](https://github.com/tmijs/tmi.js))
