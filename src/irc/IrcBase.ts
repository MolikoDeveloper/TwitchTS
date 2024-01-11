const WebSocket = require('ws');
import type { RoomState, Source, Tag, UserState } from './util/Data';
import { parseMessage } from './parser';
import type { EventName } from './util/irc'
const EventEmitter = require('events');
import {clean} from 'profanity-cleaner';
import type { Options } from '../Session';
import { IRCLog } from '../Log/IRCLog';
import { server } from 'typescript';


export class IrcBase extends EventEmitter {
    private ircLog: IRCLog = new IRCLog();
    private opts: Options;
    private events: any;

    constructor(opts: Options) {
        super();
        this.ircLog.debug = opts.debug!;

        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443/');
        this.ircLog.log('Connecting...')
        this.opts = opts;
        this.ircLog.botname = opts.idendity?.username!;

        this.events = [
            {
                type: 'message',
                validate: (data: UserState) => {
                    return data.command?.command === 'PRIVMSG';
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags,
                    (this.opts.profaneFilter == false) ? data.parameters?.trim() : clean(data.parameters?.trim())
                ],
            },
            {
                type: 'command',
                validate: (data: UserState) => {
                    return data.command?.isBotCommand
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags,
                    data.command?.botCommand,
                    data.command?.botCommandParams,
                ]
            },
            {
                type: 'join',
                validate: (data: UserState) => {
                    return data.command?.command === 'JOIN'
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.source
                ]
            },
            {
                type: 'notice',
                validate: (data: UserState) => {
                    return data.command?.command === 'NOTICE'
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags?.['msg-id'],
                    data.parameters
                ]
            },
            {
                type: 'ban',
                validate: (data: UserState) => {
                    return data.command?.command === 'CLEARCHAT' && data.parameters!;
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.parameters
                ]
            },
            {
                type: 'clear',
                validate: (data: UserState) => {
                    return data.command?.command === 'CLEARCHAT';
                },
                parameters: (data: UserState) => [
                    data.command?.channel
                ]
            },
        ];

        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.ws.on('error', this.onError.bind(this));
    }

    //@types
    on(event: 'message', listener: (channel: string, tags: Tag, message: string, self: boolean) => void): this;
    on(event: 'command', listener: (channel: string, tags: Tag, command: string, params: string[], self: boolean) => void): this;
    on(event: 'join', listener: (channel: string, user: Source, self: boolean) => void): this;
    on(event: 'notice', listener: (channel: string, type: string, message: string) => void): this;
    on(event: 'ban', listener: (channel: string, username: string) => void): this;
    on(event: 'clear', listener:(channel:string)=>void): this;
    on(event: 'reconnect', listener:(server:string) => void): this;//pending.
    on(event: 'roomstate', listener:(channel:string, roomstate: RoomState)=>void): this;//pending.


    on(event: EventName, listener: Function, self?: boolean): this {
        return super.on(event, listener, self!);
    }

    onOpen() {
        this.ircLog.log("Connected to Twitch Chat Service")

        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership\r\n');
        this.ws.send(`PASS oauth:${this.opts.idendity.Token}\r\n`);
        this.ws.send(`NICK ${this.opts.idendity.username}\r\n`);
        this.opts.channels?.forEach(channel => {
            setTimeout(()=>{
                this.ws.send(`JOIN #${channel}\r\n`);
                this.ircLog.log(`Joining to \u001b[31m#${channel}\u001b[0m chat as \u001b[35m@${this.opts.idendity.username}\u001b[0m`);
            }, 2000)
        });
    }

    onMessage(data: any) {
        let message = parseMessage(data.toString()) || {};
        message.profanity = this.opts.profaneFilter;
        
        setTimeout(()=>{
            this.ircLog.messageLog(message);

        }, 100)

        if (message.command?.command === 'PING') {
            this.ws.send('PONG :tmi.twitch.tv');
        }
        else {
            this.events.forEach((event:any) => {
                if (event.validate(message)) {
                    this.emit(event.type, ...event.parameters(message), (message.source?.nick === this.opts.idendity.username));
                }
            });
        }
    }

    say( channel: string, message:string) {
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

                setTimeout(() => this.say( channel, msg.slice(lastSpace) ), 350);
            }

            this.ws.send(`PRIVMSG ${channel} :${message}`);

        });
    }

    isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    onClose() {
        //console.logg('disconnected');
    }

    onError(error: any) {
        //console.logg('Error: ', error);
    }
}