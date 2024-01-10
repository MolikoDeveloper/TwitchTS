const WebSocket = require('ws');
import type { Tag, UserState } from './parserInterface';
import { parseMessage } from './parser';
import type {EventName} from './irc'
const EventEmitter = require('events');
import type { Options } from '../Session';


export class TwitchTSBase extends EventEmitter {
    constructor(opts: Options) {
        super();
        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
        this.opts = opts;

        this.events = {
            'message': {
                validate: (data: UserState) => {
                    return data.command?.command === 'PRIVMSG';
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags,
                    data.parameters?.trim(),
                    (): boolean => { return data.source?.nick === this.opts.idendity.username }
                ]
            },
            'command': {
                validate: (data: UserState) => {
                    return (data.command?.command === 'PRIVMSG' && data.command?.isBotCommand)
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags,
                    data.command?.botCommand,
                    data.command?.botCommandParams,
                    this.self
                ]
            },
            'join': {
                validate: (data: UserState) => {
                    return (data.command?.command === 'JOIN')
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data,
                    this.self
                ]
            },
        };

        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.ws.on('error', this.onError.bind(this));
    }

    on(event: 'command', listener: (channel: string, tags: Tag, command: string, params: string[], self: () => boolean) => void): this;
    on(event: 'message', listener: (channel: string, tags: Tag, message: string, self: () => boolean) => void): this;
    on(event: 'join', listener: (channel: string, userState: UserState, self: () => boolean) => void): this;

    on(event: EventName, listener: Function): this {
        this.log(event, listener);
        return super.on(event, listener);
    }

    onOpen() {
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership\r\n');
        this.ws.send(`PASS ${this.opts.idendity.Token}\r\n`);
        this.ws.send(`NICK ${this.opts.idendity.username}\r\n`);
        this.ws.send(`JOIN #${this.opts.channel}\r\n`);
    }

    onMessage(data: any) {
        let message = parseMessage(data.toString()) || {};
        this.log(message);

        if (message.command?.command === 'PING') {
            this.ws.send('PONG :tmi.twitch.tv');
        } else {
            for (let eventName in this.events) {
                let event = this.events[eventName];
                if (event.validate(message)) {
                    this.emit(eventName, ...event.parameters(message));
                }
                else {
                    return;
                }
            }
        }
    }

    say({ channel, message }: { channel: string, message: string }) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected()) return;


            if (message.length > 500) {
                const maxLength = 500;
                const msg = message;
                let lastSpace = msg.slice(0, maxLength).lastIndexOf(' ');
                // No spaces found, split at the very end to avoid a loop
                if (lastSpace === -1) {
                    lastSpace = maxLength;
                }
                message = msg.slice(0, lastSpace);

                setTimeout(() =>
                    this.say({ channel, message: msg.slice(lastSpace) })
                    , 350);
            }

            this.ws.send(`PRIVMSG #${channel} :${message}`);

        });
    }

    log(...args:any){
        if(this.opts.debug){
            console.log(args);
        }
    }

    isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    onClose() {
        this.log('disconnected');
    }

    onError(error: any) {
        this.log('Error: ', error);
    }
}