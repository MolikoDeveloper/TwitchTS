import { EventEmitter } from "events"
import { WebSocket } from "ws"
import { WebSocketPaths, type UserInfo, RequestHosts } from "./util/Data";
import type { EventType, Options } from "../../util/session"
import { MessageTypes, type EventMessage } from "./util/message";
import { request } from 'http'

import { SubEvents } from "./util/SubEvents";
import { EventSubLog } from "../../Log/EventSubLog";
import { Actions } from "./util/Actions";

export class EventSubBase extends EventEmitter {
    protected options: Options;
    private ws: WebSocket;
    protected log: EventSubLog;

    constructor(opts: Options) {
        super({ captureRejections: true });

        if (!opts) throw new Error("No Options defined.");


        this.options = opts;
        this.log = new EventSubLog();
        this.log.debug = this.options.debug!;

        if (this.options.testWebsocket)
            this.ws = new WebSocket(WebSocketPaths.EventSubLocalTest);
        else
            this.ws = new WebSocket(WebSocketPaths.EventSub);


        this.ws.onopen = this.OnOpen.bind(this);
        this.ws.onmessage = this.OnMessage.bind(this);
        this.ws.onclose = this.OnClose.bind(this);
        this.ws.onerror = this.OnError.bind(this);
    }

    private async OnOpen() {
        this.log.log(`${this.log.Color.color.Green}Connection Open`);
        if (this.options.debug) {
            this.log.log(`Token: ${this.log.Color.BrightColor.Blue}${this.GetURL(true, "token")}`);
            this.log.log(`Code: ${this.log.Color.BrightColor.Blue}${this.GetURL(true, "code")}`);
        }
    }

    private async OnMessage(msg: any) {
        if (!msg) return;
        let message: EventMessage = await JSON.parse(msg.data.toString());
        let SessionID: string = '';
        let Channels: UserInfo[];
        switch (message.metadata.message_type) {
            case MessageTypes.SessionWelcome:
                SessionID = message.payload?.session?.id!;
                Channels = (await this.GetUserByName(this.options.channels!));

                if (this.options.identity.app?.events) {
                    Channels.forEach(channel => {
                        this.options.identity.app?.events!.forEach(event => {
                            this.log.log(`subscribing to${this.log.Color.color.Magenta} #${channel.display_name}[${channel.id}] ${this.log.Color.color.Green}${event}`)
                            this.subscribe(event, SessionID, [channel.id])
                        });
                    });
                }
                break;
            case MessageTypes.SessionKeepAlive:

                break;
            case MessageTypes.Notification:
                let event = SubEvents.find(d => d.param.event == message.payload.subscription?.type);
                this.emit(event?.event!, message.payload.event);
                break
            case MessageTypes.Reconect:
                this.ws = new WebSocket(message.payload.session?.reconnect_url!);
                break
            case MessageTypes.Revocation:

                break
        }
    }

    private async OnClose() {
        this.log.log(`${this.log.Color.color.Red}Connection Closed`);
    }

    private async OnError(msg: any) {
        console.error("ERROR!", msg);
    }

    private async subscribe(event: EventType, session_id: string, condition: string[]) {
        if (SubEvents.map(d => d.event).indexOf(event) === -1) return;
        let currentEvent = SubEvents.find(d => d.event == event)!;
        let data;
        let conditionobj: { [key: string]: string | null } = {}

        if (currentEvent.param.conditions) {
            currentEvent.param.conditions.forEach(cond => {
                condition.forEach(element => {
                    conditionobj[cond] = element;
                });
            })
        }

        if (!conditionobj) return;

        data = {
            type: currentEvent.param?.event,
            version: currentEvent.param?.version,
            condition: conditionobj,
            transport: {
                method: 'websocket',
                session_id: session_id
            }
        };

        const _postData = JSON.stringify(data);
        let _options = {}

        if (this.options.testWebsocket) {
            _options = {
                host: RequestHosts.BaseAPILocalTest,
                path: currentEvent.param.SuscriptionTest,
                port: 8080,
                method: currentEvent.param.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Id': `${this.options.identity.app?.clientId}`,
                    'Authorization': `Bearer ${this.options.identity.user?.token}`
                }
            }
        }
        else {
            _options = {
                host: RequestHosts.BaseAPI,
                path: currentEvent.param.Suscription,
                port: 443,
                method: currentEvent.param.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Id': `${this.options.identity.app?.clientId}`,
                    'Authorization': `Bearer ${this.options.identity.user?.token}`
                }
            }
        }

        const req = request(_options, (res) => {
            let body = '';
            res.setEncoding("utf-8");
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 202) {
                    this.log.log(`Subscribed to ${this.log.Color.color.Green}${event}.`)
                    return JSON.parse(body);
                }
                else {
                    this.log.log(`${event} Error ${this.log.Color.BrightColor.Yellow}${res.statusCode}${this.log.Color.Reset}: ${this.log.Color.BrightColor.Red}${JSON.parse(body).message}`);
                }
            })
        })
        req.on('error', e => console.error('ERROR REQ,', e))
        req.write(_postData);
        req.end();
    }

    protected async GetUserByName(username: string | string[]): Promise<UserInfo[]> {

        const usernames = typeof username === 'string' ? [username] : username;

        const _options = {
            host: 'api.twitch.tv',
            path: `/helix/users?${usernames.map(data => `login=${data}`).join('&')}`,
            port: 443,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': this.options.identity.app?.clientId,
                'Authorization': `Bearer ${this.options.identity.user?.token}`
            }
        };

        return new Promise((resolve, reject) => {
            const req = request(_options, (res) => {
                let body = '';
                res.setEncoding('utf-8');
                res.on('data', (chunk) => {
                    body += chunk;
                })
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(body).data)
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    else {
                        reject(console.error(`${res.statusCode}: ${res.statusMessage}`))
                        process.exit();
                    }
                })
            });
            req.on('error', e => console.error('Error REQ ', e));
            req.end();
        })
    }

    private GetURL(forceVerify: boolean = true, responseType: "token" | "code" = "token"): string | undefined {
        if (!this.options) return;
        let permission: string[] = [];
        let url: string = '';

        this.options.identity.app?.events?.forEach((event) => {
            let scope = SubEvents.find(data => data.event == event)?.param?.scope;

            if (scope != null) {
                if (permission.indexOf(scope) === -1) {
                    permission.push(scope)
                }
            }
        })

        this.options.identity.app?.actions?.forEach((action) => {
            let scope = Actions.find(data => data.action == action)?.param?.scope;

            if (scope != null) {
                scope.forEach(element => {
                    if (permission.indexOf(element) === -1) {
                        permission.push(element)
                    }
                })
            }
        })


        url += `https://id.twitch.tv/oauth2/authorize?response_type=${responseType}&client_id=${this.options.identity.app?.clientId}&redirect_uri=${this.options.identity.app?.redirect_uri}&scope=chat%3Aread%20chat%3Aedit%20${encodeURIComponent(permission.join(" ").trim())}&force_verify=${forceVerify}`

        return url;
    }

    on(event: 'ChannelBan', listener: (event: {
        user_id: string,
        user_login: string,
        user_name: string,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        moderator_user_id: string,
        moderator_user_login: string,
        moderator_user_name: string,
        reason: string,
        banned_at: string,
        ends_at: string | null,
        is_permanent: boolean,
    }) => void | Promise<any>): this;

    on(event: 'ChannelUnban', listener: (event: {
        user_id: string,
        user_login: string,
        user_name: string,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        moderator_user_id: string,
        moderator_user_login: string,
        moderator_user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelUpdate', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        title: string,
        language: string,
        category_id: string,
        category_name: string,
        content_classification_labels: ("Gambling" | "ProfanityVulgarity" | "DrugsIntoxication" | "SexualThemes" | "ViolentGraphic")[]
    }) => void | Promise<any>): this;

    on(event: 'ChannelCheer', listener: (data:any) => void|Promise<any>): this;

    on(event: EventType, listener: (...args: any[]) => void | Promise<any>): this {
        return super.on(event, listener);
    }
}