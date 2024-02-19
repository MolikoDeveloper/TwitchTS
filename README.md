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

let ClientEventSub: EventSub = new EventSub({
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
            events: ['ChannelUpdate', '<other...>'],
            actions: ['<WORK IN PROGRESS>'] //send whisper, messages with helix api, raid, poll, predictions, etc...
        }
    },
    channels: ["<CHANNEL USERNAME OR DISPLAY NAME>"],
    debug: true, //print debug information, token links for eventsub
    testWebsocket: false
});

ClientEventSub.on('ChannelUpdate', (event) => {
    console.log(event);
});

client.on('ChannelBan', (event) => {
    console.log(event);
});

client.on('ChannelFollow', (event) => {
    console.log(event);
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
    - [x] [Subscriptions](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/)
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
        - [ ] Predictions
        - [ ] Say
        - [ ] whisper
        - [ ] ...
    
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
