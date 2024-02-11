const EventEmitter = require('events');
import { Collection } from '@discordjs/collection';
import { WebSocketPaths, type EventType } from './util/Data'
import type { Options } from '../../util/session';
import { Subscription } from './Subscription';
import eventsubjson from './util/SubEvents.json'
const WebSocket = require('ws');


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
    public subscriptions: Collection<string, Subscription> = new Collection();
    public userToken?: ClientOptions['userToken'];
    public id?: ClientOptions['clientId'];

    constructor(opts: Options, Subscription: Subscription) {
        super({ captureRejections: true });
        if (!Subscription) throw new Error("No subscriptions were defined");
        this.opts = opts;
        this.ws = new WebSocket(WebSocketPaths.EventSub);

        this.userToken = this.opts?.identity.user?.token;
        this.id = this.opts?.identity.user?.sessionID;
        
        
        const eventName = Subscription.data.type;
        const broadcasterId = Subscription.data?.condition.broadcaster_user_id;
        this.subscriptions.set(formatKey(eventName!, broadcasterId!), Subscription);
        

        this.ws?.on('open', this.onOpen.bind(this));
        this.ws?.on('message', this.onMessage.bind(this));
        this.ws?.on('close', this.onClose.bind(this));
        this.ws?.on('error', this.onError.bind(this));
    }

    //@type
    on(event: EventType, listener: (result: any) => void): this;

    on(event: EventType, listener: Function): this {
        return super.on(event, listener);
    }

    onOpen() {
        this.log("connection open");
    }


    /**
     * Handles incoming messages.
     *
     * @param {any} rawMessage - The raw message.
     */
    onMessage(rawMessage: any) {
        let message: any = JSON.parse(rawMessage.toString());
        switch (message.metadata?.message_type) {
            case MessageTypes.SessionWelcome:
                console.time("Welcome WS")
                this.opts!.identity.user!.sessionID = message.payload?.session?.id!;
                console.log(this.opts!.identity.user?.sessionID)
                if (this.subscriptions) {
                    for (const [key, element] of this.subscriptions) {
                        element.subscribe({
                            identity:
                            {
                                'user': {
                                    'token': this.userToken!,
                                    'sessionID': message.payload?.session?.id!
                                },
                                "app": {
                                    'clientId': this.opts?.identity.app?.clientId!,
                                    'secret': this.opts?.identity.app?.secret!
                                }
                            },
                        });
                    }
                    //this.emit('ready', this);
                    //print `Ready! Listening to ${client.subscriptions?.size} subscriptions...`
                }
                console.timeEnd("Welcome WS")
                break;
            case MessageTypes.Notification:
                this.log('Notification WS')
                const broadcasterId = message.payload.subscription.condition.broadcaster_user_id;
                const eventName = message.payload.subscription.type;
                const susbscription = this.subscriptions?.get(formatKey(eventName, broadcasterId));
                const _EventSubType = eventsubjson.find(d => d.param.event == eventName)?.event!;

                if (susbscription) {
                    this.emit(_EventSubType, message.payload.event)
                };
                break;
            case MessageTypes.SessionKeepAlive:
                //this.log(message);
                break;
            case MessageTypes.Reconect:
                this.ws = new WebSocket(message.payload.reconnect_url);

                break
            case MessageTypes.Revocation:
                //this.log(message);
                break
            default:
                break;
        }
    }

    /**
 * Handles the `onClose` event.
 *
 * @param {number} code - The code associated with the event.
 * @param {string} reason - The reason for the event.
 */
    onClose(code: number, reason: string) {
        //this.log('OnClose:', code, reason);
    }

        /**
     * Handles the error that occurred during execution of the function.
     *
     * @param {any} error - The error that occurred.
     */
    onError(error: any) {
        //this.log('Error: ', error);
    }

}

export function formatKey(eventName: string, broadcasterId: string) {
    return `${eventName}*${broadcasterId}`;
}

export function parseKey(key: string) {
    return key.split('*');
}
