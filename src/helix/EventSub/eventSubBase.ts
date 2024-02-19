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
                if (!event?.only_webhooks)
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

        if (currentEvent.only_webhooks) {
            return;
        }

        if (!currentEvent.only_webhooks) {
            data = {
                type: currentEvent.param?.event,
                version: currentEvent.param?.version,
                condition: conditionobj,
                transport: {
                    method: 'websocket',
                    session_id: session_id
                }
            };
        }



        const _postData = JSON.stringify(data);
        let _options = {}

        if (this.options.testWebsocket) {
            _options = {
                host: RequestHosts.BaseAPILocalTest,
                path: currentEvent.param.Subscription.replace('/helix', ''),
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
                path: currentEvent.param.Subscription,
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

    on(event: 'ChannelCheer', listener: (event: {
        bits: number,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        is_anonymous: boolean,
        message: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelRaid', listener: (event: {
        from_broadcaster_user_id: string,
        from_broadcaster_user_login: string,
        from_broadcaster_user_name: string,
        to_broadcaster_user_id: string,
        to_broadcaster_user_login: string,
        to_broadcaster_user_name: string,
        viewers: number,
    }) => void | Promise<any>): this;

    on(event: 'ChannelFollow', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        followed_at: string,
        user_id: string,
        user_login: string,
        user_name: string
    }) => void | Promise<any>): this;

    on(event: 'ChannelSubscribe', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        is_gift: boolean,
        tier: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelSubscriptionEnd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        is_gift: boolean,
        tier: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelSubscriptionGift', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cumulative_total: number,
        is_anonymous: boolean,
        tier: string,
        total: number,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelSubscriptionMessage', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cumulative_months: number,
        duration_months: number,
        message: {
            emotes: [
                {
                    begin: number,
                    end: number,
                    id: string
                }
            ],
            text: string,
        },
        streak_months: number,
        tier: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelModeratorAdd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelModeratorRemove', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPointsCustomRewardAdd', listener: (event: {
        background_color: string,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cooldown_expires_at: string,
        cost: number,
        default_image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        global_cooldown: {
            is_enabled: boolean,
            seconds: number,
        },
        id: string,
        image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        is_enabled: boolean,
        is_in_stock: boolean,
        is_paused: boolean,
        is_user_input_required: boolean,
        max_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        max_per_user_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        prompt: string,
        redemptions_redeemed_current_stream: number,
        should_redemptions_skip_request_queue: boolean,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPointsCustomRewardUpdate', listener: (event: {
        background_color: string,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cooldown_expires_at: string,
        cost: number,
        default_image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        global_cooldown: {
            is_enabled: boolean,
            seconds: number,
        },
        id: string,
        image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        is_enabled: boolean,
        is_in_stock: boolean,
        is_paused: boolean,
        is_user_input_required: boolean,
        max_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        max_per_user_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        prompt: string,
        redemptions_redeemed_current_stream: number,
        should_redemptions_skip_request_queue: boolean,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPointsCustomRewardRemove', listener: (event: {
        background_color: string,
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cooldown_expires_at: string,
        cost: number,
        default_image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        global_cooldown: {
            is_enabled: boolean,
            seconds: number,
        },
        id: string,
        image: {
            url_1x: string,
            url_2x: string,
            url_4x: string,
        },
        is_enabled: boolean,
        is_in_stock: boolean,
        is_paused: boolean,
        is_user_input_required: boolean,
        max_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        max_per_user_per_stream: {
            is_enabled: boolean,
            value: number,
        },
        prompt: string,
        redemptions_redeemed_current_stream: number,
        should_redemptions_skip_request_queue: boolean,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPointsCustomRewardRedemptionAdd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        redeemed_at: string,
        reward: {
            cost: number,
            id: string,
            prompt: string,
            title: string,
        },
        status: string,
        user_id: string,
        user_input: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPointsCustomRewardRedemptionUpdate', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        redeemed_at: string,
        reward: {
            cost: number,
            id: string,
            prompt: string,
            title: string,
        },
        status: string,
        user_id: string,
        user_input: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPollBegin', listener: (event: {
        bits_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        channel_points_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        choices: [
            {
                id: string,
                title: string,
            }
        ],
        ends_at: string,
        id: string,
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPollEnd', listener: (event: {
        bits_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        channel_points_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        choices: [
            {
                bits_votes: number,
                channel_points_votes: number,
                id: string,
                title: string,
                votes: number,
            }
        ],
        ends_at: string,
        id: string,
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPollProgress', listener: (event: {
        bits_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        channel_points_voting: {
            amount_per_vote: number,
            is_enabled: boolean,
        },
        choices: [
            {
                bits_votes: number,
                channel_points_votes: number,
                id: string,
                title: string,
                votes: number,
            }
        ],
        ends_at: string,
        id: string,
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPredictionBegin', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        locks_at: string,
        outcomes: [
            {
                color: string,
                id: string,
                title: string,
            }
        ],
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPredictionEnd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        ended_at: string,
        id: string,
        outcomes: [
            {
                channel_points: 31437,
                color: string,
                id: string,
                title: string,
                top_predictors: [
                    {
                        channel_points_used: 7473,
                        channel_points_won: 14946,
                        user_id: string,
                        user_login: string,
                        user_name: string,
                    }
                ],
                users: 5,
            }
        ],
        started_at: string,
        status: string,
        title: string,
        winning_outcome_id: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPredictionProgress', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        locks_at: string,
        outcomes: [
            {
                channel_points: 31437,
                color: string,
                id: string,
                title: string,
                top_predictors: [
                    {
                        channel_points_used: 7473,
                        channel_points_won: 14946,
                        user_id: string,
                        user_login: string,
                        user_name: string,
                    }
                ],
                users: 5,
            }
        ],
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelPredictionLock', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        locked_at: string,
        outcomes: [
            {
                channel_points: 31437,
                color: string,
                id: string,
                title: string,
                top_predictors: [
                    {
                        channel_points_used: 7473,
                        channel_points_won: 14946,
                        user_id: string,
                        user_login: string,
                        user_name: string,
                    }
                ],
                users: 5,
            }
        ],
        started_at: string,
        title: string,
    }) => void | Promise<any>): this;

    on(event: 'DropEntitlementGrant', listener: (event: [
        {
            "id": string,
            "data": {
                "organization_id": string,
                "category_id": string,
                "category_name": string,
                "campaign_id": string,
                "user_id": string,
                "user_name": string,
                "user_login": string,
                "entitlement_id": string,
                "benefit_id": string,
                "created_at": string
            }
        }
    ]) => void | Promise<any>): this;

    on(event: 'ExtensionBitsTransactionCreate', listener: (event: {
        "id": string,
        "extension_client_id": string,
        "broadcaster_user_id": string,
        "broadcaster_user_login": string,
        "broadcaster_user_name": string,
        "user_name": string,
        "user_login": string,
        "user_id": string,
        "product": {
            "name": string,
            "sku": string,
            "bits": number,
            "in_development": boolean
        }
    }) => void | Promise<any>): this;

    on(event: 'ChannelGoalBegin', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        current_amount: number,
        description: string,
        id: string,
        started_at: string,
        target_amount: number,
        type: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelGoalEnd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        current_amount: number,
        description: string,
        ended_at: string,
        id: string,
        is_achieved: false,
        started_at: string,
        target_amount: number,
        type: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelGoalProgress', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        current_amount: number,
        description: string,
        id: string,
        started_at: string,
        target_amount: number,
        type: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelHypeTrainBegin', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        expires_at: string,
        goal: number,
        id: string,
        last_contribution: {
            total: number,
            type: string,
            user_id: string,
            user_login: string,
            user_name: string,
        },
        level: number,
        progress: number,
        started_at: string,
        top_contributions: [
            {
                total: number,
                type: string,
                user_id: string,
                user_login: string,
                user_name: string,
            }
        ],
        total: number,
    }) => void | Promise<any>): this;

    on(event: 'ChannelHypeTrainEnd', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        cooldown_ends_at: string,
        ended_at: string,
        id: string,
        last_contribution: {
            total: number,
            type: string,
            user_id: string,
            user_login: string,
            user_name: string,
        },
        level: 4,
        started_at: string,
        top_contributions: [
            {
                total: number,
                type: string,
                user_id: string,
                user_login: string,
                user_name: string,
            }
        ],
        total: number,
    }) => void | Promise<any>): this;

    on(event: 'ChannelHypeTrainProgress', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        expires_at: string,
        goal: number,
        id: string,
        last_contribution: {
            total: number,
            type: string,
            user_id: string,
            user_login: string,
            user_name: string,
        },
        level: number,
        progress: number,
        started_at: string,
        top_contributions: [
            {
                total: number,
                type: string,
                user_id: string,
                user_login: string,
                user_name: string,
            }
        ],
        total: number,
    }) => void | Promise<any>): this;

    on(event: 'StreamOnline', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
        id: string,
        started_at: string,
        type: string,
    }) => void | Promise<any>): this;

    on(event: 'StreamOffline', listener: (event: {
        broadcaster_user_id: string,
        broadcaster_user_login: string,
        broadcaster_user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'UserAuthorizationGrant', listener: (event: {
        "client_id": string,
        "user_id": string,
        "user_login": string,
        "user_name": string,
    }) => void | Promise<any>): this;

    on(event: 'UserAuthorizationRevoke', listener: (event: {
        "client_id": string,
        "user_id": string,
        "user_login": string,
        "user_name": string,
    }) => void | Promise<any>): this;

    on(event: 'UserUpdate', listener: (event: {
        description: "",
        email: string,
        email_verified: boolean,
        user_id: string,
        user_login: string,
        user_name: string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelGuestStarSessionBegin', listener: (event: {
        "broadcaster_user_id": string,
        "broadcaster_user_name": string,
        "broadcaster_user_login": string,
        "moderator_user_id": string,
        "moderator_user_name": string,
        "moderator_user_login": string,
        "session_id": string,
        "started_at": string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelGuestStarSessionEnd', listener: (event: {
        "broadcaster_user_id": string,
        "broadcaster_user_name": string,
        "broadcaster_user_login": string,
        "moderator_user_id": string,
        "moderator_user_name": string,
        "moderator_user_login": string,
        "session_id": string,
        "started_at": string,
        "ended_at": string,
    }) => void | Promise<any>): this;

    on(event: 'ChannelGuestStarSessionUpdate', listener: (event: {
        "broadcaster_user_id": string,
        "broadcaster_user_name": string,
        "broadcaster_user_login": string,
        "session_id": string,
        "moderator_user_id": string,
        "moderator_user_name": string,
        "moderator_user_login": string,
        "guest_user_id": string,
        "guest_user_name": string,
        "guest_user_login": string,
        "slot_id": string,
        "state": string,
        "host_video_enabled": boolean,
        "host_audio_enabled": boolean,
        "host_volume": number
    }) => void | Promise<any>): this;

    on(event: 'ChannelGuestStarSettingsUpdate', listener: (event: {
        "broadcaster_user_id": string,
        "broadcaster_user_name": string,
        "broadcaster_user_login": string,
        "is_moderator_send_live_enabled": boolean,
        "slot_count": number,
        "is_browser_source_audio_enabled": boolean,
        "group_layout": string,
    }) => void | Promise<any>): this;

    on(event: EventType, listener: (...args: any[]) => void | Promise<any>): this | undefined {
        if (!this.options.identity.app?.events?.includes(event)) {
            return;
        }

        return super.on(event, listener);
    }
}
/*
    on(event: '', listener: (event: {

    }) => void | Promise<any>): this;

    
*/