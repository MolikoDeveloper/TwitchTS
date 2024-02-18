import type { Options } from "../../util/session";
import { EventSubBase } from "./eventSubBase";
import { request } from 'http'
import { Actions } from "./util/Actions";

export class EventSub extends EventSubBase {

    constructor(options: Options) {
        super(options);
    }

    public async send(channel: string, message: string) {
        if (!this.options.identity.app?.actions!.includes('SendChatMessage')) {
            this.log.log(`action ${this.log.Color.color.Yellow}SendChatMessage ${this.log.Color.Reset}Required to send messages.`);
            return;
        }
        if (!this.options.identity.user?.username) {
            this.log.log(`${this.log.Color.BrightColor.Red}Options.identity.user.username${this.log.Color.Reset} cannot be empty in Send().`);
            return;
        }
        if (channel.replace('\s+', '') === '') {
            this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(${this.log.Color.color.Red}channel${this.log.Color.Reset}, sender, message); => cannot be empty (broadcaster_id or username).`);
            return;
        }
        if (message.replace('\s+', '') === '') {
            this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);
            return;
        }

        await this.post('SendChatMessage', [], [
            (await this.GetUserByName(channel))[0].id,
            (await this.GetUserByName(this.options.identity.user?.username!))[0].id,
            message]);
    }

    public async whisper(to: string, message: string) {
        if (!this.options.identity.app?.actions!.includes('SendWhisper'))
            this.log.log(`action ${this.log.Color.color.Yellow}SendWhisper ${this.log.Color.Reset}Required to send messages.`)
        if (!this.options.identity.user?.username) {
            this.log.log(`${this.log.Color.BrightColor.Red}Options.identity.user.username${this.log.Color.Reset} cannot be empty in whisper().`);
            return;
        }
        if (to.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, ${this.log.Color.color.Red}sender${this.log.Color.Reset}, message); => cannot be empty (user_id or username).`);
        if (message.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);

        this.post('SendWhisper', [
            (await this.GetUserByName(this.options.identity.user?.username!))[0].id,
            (await this.GetUserByName(to))[0].id,
        ], [
            message
        ]);
    }

    private async post(action: string, query: string[], body: any[]) {

        const yellow = this.log.Color.BrightColor.Yellow;
        const reset = this.log.Color.Reset;
        const actionConfig = Actions.find(a => a.action === action);
        if (!actionConfig) {
            this.log.log(`Action ${action} not found.`);
            return;
        }

        let fullPath = actionConfig.param.Suscription;
        if (query.length > 0 && actionConfig.param.query.length === query.length) {
            fullPath += '?' + actionConfig.param.query.map((q, i) => q.replace(`[${i}]`, query[i])).join('&');
        }

        const postData = JSON.stringify(body.reduce((obj, val, i) => {
            obj[actionConfig.param.body[i]] = val;
            return obj;
        }, {}));

        const _options = {
            hostname: 'api.twitch.tv',
            port: 443,
            path: fullPath,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.options.identity.user?.token}`,
                'Client-Id': this.options.identity.app?.clientId,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = request(_options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                switch (res.statusCode) {
                    case 200:
                        this.log.log(`${yellow}${action}${reset} success.`);
                        break;
                    case 204:
                        this.log.log(`${yellow}${action}${reset} success.`);
                        break;
                    default:
                        this.log.log(`Request to ${yellow}${action}${reset} failed with ${res.statusCode}: ${JSON.parse(data).message}`);
                }
            });
        });

        req.on('error', (error) => {
            this.log.log(`Error with request: ${error.message}`);
        });

        req.write(postData);
        req.end();
    }
}