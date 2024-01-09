//import { WebSocket } from "ws";
import { EventEmitter } from 'events'
import { Collection } from '@discordjs/collection';
import { WebSocketPaths, substype } from './util/Data'
import type { Options } from '../Session';
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
    public ws?:any;
    public opts?: Options;
    public subscriptions?: Collection<string, Subscription>;
    public userToken?: ClientOptions['userToken'];
    public id?: ClientOptions['clientId'];

    constructor(opts: Options, Subscriptions: Subscription[]) {
        super({captureRejections:true});
        if (!Subscriptions.length) throw new Error("No subscriptions were defined");
        this.opts = opts;
        this.ws = new WebSocket(WebSocketPaths.EventSub);
        
        this.userToken = this.opts?.idendity.ClientToken;
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
        console.log(message.metadata.message_type);
        switch (message.metadata?.message_type) {
            case MessageTypes.SessionWelcome:
                this.opts!.idendity.sessionId = message.payload?.session?.id!;
                this.subscriptions?.each((element: Subscription) => element.subscribe({idendity:{
                    'sessionId': message.payload?.session?.id!,
                    'ClientID': this.id,
                    ClientToken: this.userToken
                }}));
                this.emit('ready', this);
                break;
                

            case MessageTypes.Notification:
                console.log(message);
                const broadcasterId = message.payload.subscription.condition.broadcaster_user_id;
                const eventName = message.payload.subscription.type;
                const susbscription = this.subscriptions?.get(formatKey(eventName, broadcasterId));

                if (susbscription) this.emit('event', message.payload.event, eventName, broadcasterId);
                console.log(eventName, message.payload.event)
                break;

            case MessageTypes.SessionKeepAlive:
                console.log(message);
                this.ws.send("PONG :api.twitch.tv")
                break;
            case MessageTypes.Reconect:
                console.log(message);
                break
            case MessageTypes.Revocation:
                console.log(message)
                break

            default:
                break;
        }
    }

    onClose(code: number, reason: string) {
        this.log(code, reason);
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
        event: 'ChannelFollow'
    })
]

let client = new EventSubClient({
    'idendity': {
        'ClientID': 'nff72q9w67bld0g336mibjs8gn4juu',
        'ClientToken': 'fgqz3hi9lu6uf3y3vob6ddrrsk5e2p'
    },
    debug: true}, subscriptions)


client.on('ready', ()=> {
    client.log(`Ready! Listening to ${client.subscriptions?.size} subscriptions...`)
})

client.on('event', (event, eventName, broadcasterId) => {
    console.error(broadcasterId);
    switch (eventName) {
        case substype('StreamOnline').param?.event:
            //a.log(`${event.broadcaster_user_name} is now online!`);
            break;

        case substype('StreamOffline').param?.event:
            //a.log(`${event.broadcaster_user_name} is now offline!`);
            break;

        default:
            break;
    }
});


