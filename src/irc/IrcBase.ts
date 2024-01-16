import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import type { RoomState, Source, Tag, UserState } from './util/Data';
import { parseMessage } from './parser';
import type { EventName } from './util/irc'
import {clean} from 'profanity-cleaner';
import type { Options } from '../session';
import { IRCLog } from '../Log/IRCLog';




export class IrcBase extends EventEmitter {
    private ircLog: IRCLog = new IRCLog();
    private opts: Options;
    private events: any;
    private ws: WebSocket;

    constructor(opts: Options) {
        super();
        this.ircLog.debug = opts.debug!;

        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443/');
        this.ircLog.log('Connecting...')
        this.opts = opts;
        this.ircLog.botname = opts.identity?.user?.username!;

        this.events = [
            {
                type: 'message',
                validate: (data: UserState) => {
                    return data.command?.command === 'PRIVMSG';
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data,
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
                    data,
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

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    //@types
    on(event: 'message', listener: (channel: string, user: UserState, message: string, self: boolean) => void| Promise<any>): this;
    on(event: 'command', listener: (channel: string, user: UserState, command: string, params: string[], self: boolean) => void| Promise<any>): this;
    on(event: 'join', listener: (channel: string, user: Source, self: boolean) => void| Promise<any>): this;
    on(event: 'notice', listener: (channel: string, type: string, message: string) => void| Promise<any>): this;
    on(event: 'ban', listener: (channel: string, username: string) => void| Promise<any>): this;
    on(event: 'clear', listener:(channel:string)=>void| Promise<any>): this;
    on(event: 'reconnect', listener:(server:string) => void| Promise<any>): this;//pending.
    on(event: 'roomstate', listener:(channel:string, roomstate: RoomState)=>void| Promise<any>): this;//pending.

    on(event: EventName, listener: (...args: any[]) => void| Promise<any>, self?: boolean): this {
        return super.on(event, listener);
    }

    async onOpen() {
        this.ircLog.log("Connected to Twitch Chat Service")

        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership\r\n');
        this.ws.send(`PASS oauth:${this.opts.identity.user?.token}\r\n`);
        this.ws.send(`NICK ${this.opts.identity.user?.username}\r\n`);
        this.opts.channels?.forEach(channel => {
            this.ircLog.log(`Joining to \u001b[31m#${channel}\u001b[0m chat as \u001b[35m@${this.opts.identity.user?.username}\u001b[0m`);
            setTimeout(()=>{
                this.ws.send(`JOIN #${channel}\r\n`);
            }, 2000)
        });
    }

    async onMessage(data: any) {
        let message = await parseMessage(data.data.toString());
        message.profanity = this.opts.profaneFilter;        
        
        this.ircLog.messageLog(message);

        if (message.command?.command === 'PING') {
            this.ws.send('PONG :tmi.twitch.tv');
        }
        else {
            this.events.forEach((event:any) => {
                if (event.validate(message)) {
                    this.emit(event.type, ...event.parameters(message), (message.source?.nick === this.opts.identity.user?.username));
                }
            });
        }
    }

    async say( channel: string, message:string) {
        //twitch new line ——————————————————————————
        if(!channel){
            this.ircLog.log(`Channel Cannot Be Empty`);
            return;
        }
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

    async isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    async onClose() {
        //console.logg('disconnected');
    }

    async onError(error: any) {
        //console.logg('Error: ', error);
    }
}