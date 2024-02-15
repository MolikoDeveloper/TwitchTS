this project was created with [bun](https://bun.sh).
> [!WARNING]  
> W.I.P Please Do not use in Production.

# TwitchTS (bun)

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
        - [x] [Channel.Subscription.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscription.end)
        - [x] [Channel.Subscription.Gift](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscription.gift)
        - [x] [Channel.Subscription.Message](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscription.message)
        - [x] [Channel.Moderator.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelmoderator.add)
        - [x] [Channel.Moderator.Remove](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelmoderator.remove)
        - [x] [Channel.Points.Custom.Reward.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoints.custom.reward.add)
        - [x] [Channel.Points.Custom.Reward.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoints.custom.reward.update)
        - [x] [Channel.Points.Custom.Reward.Remove](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoints.custom.reward.remove)
        - [x] [Channel.Points.Custom.Reward.Redemption.Add](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoints.custom.reward.redemption.add)
        - [x] [Channel.Points.Custom.Reward.Redemption.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoints.custom.reward.redemption.update)
        - [x] [Channel.Poll.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoll.begin)
        - [x] [Channel.Poll.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoll.progress)
        - [x] [Channel.Poll.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpoll.end)
        - [x] [Channel.Prediction.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelprediction.begin)
        - [x] [Channel.Prediction.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelprediction.progress)
        - [x] [Channel.Prediction.Lock](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelprediction.lock)
        - [x] [Channel.Prediction.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelprediction.end)
        - [x] [Drop.Entitlement.Grant](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#dropentitlement.grant)
        - [x] [Extension.Bits.Transaction.Create](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#extensionbits.transaction.create)
        - [x] [Goal.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalbegin)
        - [x] [Goal.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalprogress)
        - [x] [Goal.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#goalend)
        - [x] [Hype.Train.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrain.begin)
        - [x] [Hype.Train.Progress](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrain.progress)
        - [x] [Hype.Train.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#hypetrain.end)
        - [x] [Stream.Online](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamonline)
        - [x] [Stream.Offline](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamoffline)
        - [x] [User.Authorization.Grant](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userauthorization.grant)
        - [x] [User.Authorization.Revoke](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userauthorization.revoke)
        - [x] [User.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#userupdate)
        - [x] [Channel.Guest.Star.Session.Begin](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest.star.session.begin)
        - [x] [Channel.Guest.Star.Session.End](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest.star.session.end)
        - [x] [Channel.Guest.Star.Session.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest.star.session.update)
        - [x] [Channel.Guest.Star.Settings.Update](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelguest.star.settings.update)
    - [ ] Actions
        - [ ] Predictions
        - [ ] Say
        - [ ] whisper
        - [ ] ...
    
- [ ] Webhook Connection
    - [ ] Baurer Oauth
    - [ ] Subscriptions
    - [ ] Actions


## To install dependencies:
```bash
bun install
```

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
