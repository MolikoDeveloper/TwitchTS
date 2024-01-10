//import { WebSocket } from "ws";
import { EventEmitter } from 'events'
import { Collection } from '@discordjs/collection';
import { WebSocketPaths, substype } from './util/Data'
import type { Options } from '../../Session';
import { Subscription } from './Subscription';
import eventsjson from './util/SubEvents.json'

const WebSocket = require('ws');
//const EventEmitter = require('events');

export declare interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
}

interface ClientOptions {
    userToken: string;
    clientId: string;
}

export interface ClientEvents {
    ready: [client: Client];
    event: [event: any, eventName: string, broadcasterId: string]; // ToDo: Event interface
}

export enum MessageTypes {
    SessionWelcome = "session_welcome",
    SessionKeepAlive = "session_keepalive",
    Notification = "notification",
    Reconect = "session_reconnect",
    Revocation = "revocation"
}

export class EventSubClient extends EventEmitter {
    public ws?: any;
    public opts?: Options;
    public subscriptions?: Collection<string, Subscription>;
    public userToken?: ClientOptions['userToken'];
    public id?: ClientOptions['clientId'];

    constructor(opts: Options, Subscriptions: Subscription[]) {
        super({ captureRejections: true });
        if (!Subscriptions.length) throw new Error("No subscriptions were defined");
        this.opts = opts;
        this.ws = new WebSocket(WebSocketPaths.EventSub);

        this.userToken = this.opts?.idendity.Token;
        this.id = this.opts?.idendity.ClientID;
        this.subscriptions = new Collection();

        for (const subscription of subscriptions) {
            const eventName = subscription.data?.type;
            const broadcasterId = subscription.data?.condition.broadcaster_user_id;
            this.subscriptions.set(formatKey(eventName!, broadcasterId!), subscription);
        }

        this.ws?.on('open', this.onOpen.bind(this));
        this.ws?.on('message', this.onMessage.bind(this));
        this.ws?.on('close', this.onClose.bind(this));
        this.ws?.on('error', this.onError.bind(this));
    }

    onOpen() {
        this.log("connection open");
    }

    onMessage(rawMessage: any) {
        let message: any = JSON.parse(rawMessage.toString());
        switch (message.metadata?.message_type) {
            case MessageTypes.SessionWelcome:
                console.time("Welcome WS")
                this.opts!.idendity.sessionId = message.payload?.session?.id!;
                if (this.subscriptions) {
                    for (const [key, element] of this.subscriptions) {
                        element.subscribe({
                            idendity: {
                                'sessionId': message.payload?.session?.id!,
                                'ClientID': this.id,
                                'Token': this.userToken!
                            },
                        });
                    }
                    this.emit('ready', this);
                }
                console.timeEnd("Welcome WS")
                break;

            case MessageTypes.Notification:
                this.log('Notification WS')
                const broadcasterId = message.payload.subscription.condition.broadcaster_user_id;
                const eventName = message.payload.subscription.type;
                const susbscription = this.subscriptions?.get(formatKey(eventName, broadcasterId));
                
                if (!susbscription){
                     this.emit('event', message.payload.event, eventName, broadcasterId)
                };
                break;

            case MessageTypes.SessionKeepAlive:
                this.log(message);
                break;
            case MessageTypes.Reconect:
                this.log(message);
                break
            case MessageTypes.Revocation:
                this.log(message);
                break

            default:
                break;
        }
    }

    onClose(code: number, reason: string) {
        this.log('OnClose:',code, reason);
    }
    onError(error: any) {
        this.log('Error: ', error);
    }
    log(...args: any) {
        if (this.opts?.debug) {
            console.log(args);
        }
    }
}

export function formatKey(eventName: string, broadcasterId: string) {
    return `${eventName}*${broadcasterId}`;
}

export function parseKey(key: string) {
    return key.split('*');
}

//---------------------------------

const subscriptions = [
    new Subscription({
        broadcasterId: "67396993",
        event: 'ChannelBan'
    }),
    new Subscription({
        'broadcasterId': "67396993",
        event: 'ChannelSubscribe'
    }),
    new Subscription({
        'broadcasterId': "67396993",
        event: 'ChannelFollow'
    })
]

let client = new EventSubClient({
    'idendity': {
        'ClientID': 'nff72q9w67bld0g336mibjs8gn4juu',
        //'Token': 'oorlzugzd0aj1j3ofuaahv0a46fv8a' //twitch app token
        'Token': 'ig8k8aloochtik55rotnl1d3kulxg3' //albertosaurus_ac token
        //'Token': 'amkdawdchzc4dfdgjytoyfq9xiz1gh' //albertoidesaurus
    },
    debug: true
}, subscriptions)


client.on('ready', () => {
    client.log(`Ready! Listening to ${client.subscriptions?.size} subscriptions...`)
})

client.on('event', (event, eventName, broadcasterId) => {
    switch (eventName) {
        case substype('ChannelBan').param?.event:
            client.log(`${broadcasterId}`);
            break;

        case substype('ChannelSubscribe').param?.event:
            client.log(event)
            break;
        
        case substype('ChannelFollow').param?.event:
            client.log(event)
            break

        default:
            break;
    }
});


