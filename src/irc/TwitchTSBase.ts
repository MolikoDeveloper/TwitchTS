const WebSocket = require('ws');
import type { Tag, UserState } from './util/Data';
import { parseMessage } from './parser';
import type {EventName} from './util/irc'
const EventEmitter = require('events');
import type { Options } from '../Session';
import { IRCLog } from '../Log/IRCLog';


export class TwitchTSBase extends EventEmitter {
    private ircLog :IRCLog = new IRCLog();
    private opts: Options;
    constructor(opts: Options) {
        super();
        this.ircLog.debug = opts.debug!;
        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443/');
        this.opts = opts;
        this.ircLog.log('Connecting...')
        this.ircLog.botname = opts.idendity?.username!;

        this.events = {
            'message': {
                validate: (data: UserState) => {
                    return data.command?.command === 'PRIVMSG';
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags,
                    data.parameters?.trim()
                ],
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
                ]                
            },
            'join': {
                validate: (data: UserState) => {
                    return (data.command?.command === 'JOIN')
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data
                ]
            },
            'notice': {
                validate: (data: UserState) => {
                    return (data.command?.command === 'NOTICE')
                },
                parameters: (data: UserState) => [
                    data.command?.channel,
                    data.tags?.['msg-id'],
                    data.parameters
                ]
            }
        };

        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.ws.on('error', this.onError.bind(this));
    }

    on(event: 'message', listener: (channel: string, tags: Tag, message: string, self:boolean) => void): this;
    on(event: 'command', listener: (channel: string, tags: Tag, command: string, params: string[], self:boolean) => void): this;
    on(event: 'join', listener: (channel: string, userState: UserState, self:boolean) => void): this;
    on(event: 'notice', listener: (channel: string, msgID: string, message: string) => void): this;



    on(event: EventName, listener: Function, self?: boolean): this {
        if(event === 'message' || event === 'command' || event === 'join'){
            return super.on(event, listener, self!);
        }
        else{
            return super.on(event, listener);
        }
    }

    onOpen() {
        this.ircLog.log("Connected to Twitch Chat Service")
        
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership\r\n');        
        this.ws.send(`PASS oauth:${this.opts.idendity.Token}\r\n`);
        this.ws.send(`NICK ${this.opts.idendity.username}\r\n`);
        this.ws.send(`JOIN #${this.opts.channel}\r\n`);
        this.ircLog.log(`Joining to \u001b[31m#${this.opts.channel}\u001b[0m chat as \u001b[35m@${this.opts.idendity.username}\u001b[0m`);

    }

    onMessage(data: any) {
        let message = parseMessage(data.toString()) || {};
        this.ircLog.messageLog(message);

        if (message.command?.command === 'PING') {
            this.ws.send('PONG :tmi.twitch.tv');
        } else {
            for (let eventName in this.events) {
                let event = this.events[eventName];
                if (event.validate(message)) {
                    this.emit(eventName, ...event.parameters(message), (message.source?.nick === this.opts.idendity.username));
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