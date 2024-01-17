import {IrcClient, EventSub} from './index'
import { Subscription } from './src/helix/EventSub/Subscription'
import secret from './secrets.json'


//ChannelBan
//ChannelUnban
//ChannelCheer

const subscriptions = [
    new Subscription({
        broadcasterId: "67396993",
        event: 'ChannelBan'
    }),
    new Subscription({
        broadcasterId: "67396993",
        event: "ChannelUnban"
    })
]

const subs= [{
    type: 'ChannelBan',
    conditions:{
        'broadcaster_user_id': '67396993'
    }
}]

let client = new EventSub({
    'identity': secret,
    'debug': true,
    }
    , subscriptions)

client.on('ChannelBan', (event) => {
    console.log(`user @${event.user_name} has been banned for ${event.reason}`)
});

client.on('ChannelUnban', (event) => {
    console.log(event)
});