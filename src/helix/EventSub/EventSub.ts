import type { Options } from "../../util/session";
import { EventSubBase } from "./eventSubBase";
import { request } from 'http'
import { Actions } from "./util/Actions";

export class EventSub extends EventSubBase {

    constructor(options: Options) {
        super(options);
    }

    public async send(channel: string, message: string){
        if (!this.options.identity.app?.actions!.includes('SendChatMessage')){
            this.log.log(`action ${this.log.Color.color.Yellow}SendChatMessage ${this.log.Color.Reset}Required to send messages.`); 
            return;
        }
        if (!this.options.identity.user?.username){
            this.log.log(`${this.log.Color.BrightColor.Red}Options.identity.user.username${this.log.Color.Reset} cannot be empty in Send().`);
            return;
        } 
        if (channel.replace('\s+', '') === ''){
            this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(${this.log.Color.color.Red}channel${this.log.Color.Reset}, sender, message); => cannot be empty (broadcaster_id or username).`);
            return;
        } 
        if (message.replace('\s+', '') === ''){
            this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);
            return;
        } 

        const _action = Actions.find(d => d.action == 'SendChatMessage');

        const postData = JSON.stringify({
            broadcaster_id: (await this.GetUserByName(channel))[0].id,
            sender_id: (await this.GetUserByName(this.options.identity.user?.username!))[0].id,
            message: message
        });

        const _options = {
            hostname: 'api.twitch.tv',
            port: 443,
            path: `${_action?.param.Suscription}`,
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
                if(res.statusCode === 200){
                    this.log.log(`${this.log.Color.color.Yellow}Send Chat Message${this.log.Color.color.Magenta} #${channel}${this.log.Color.Reset}: ${message}`);
                }
                else{
                    this.log.log(`${this.log.Color.color.Yellow}Send Chat Message${this.log.Color.BrightColor.Red} ${res.statusCode}${this.log.Color.Reset}: ${res.statusMessage}`);
                }
            });
        });

        req.on('error', (error) => {
            console.error(error);
        });

        req.write(postData);
        req.end();
    }

    public async whisper(from: string, to: string, message: string) {
        if (!this.options.identity.app?.actions!.includes('SendWhisper'))
            this.log.log(`action ${this.log.Color.color.Yellow}SendWhisper ${this.log.Color.Reset}Required to send messages.`)
        if (from.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(${this.log.Color.color.Red}from${this.log.Color.Reset}, to, message); => cannot be empty (broadcaster_id or username).`);
        if (to.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, ${this.log.Color.color.Red}sender${this.log.Color.Reset}, message); => cannot be empty (user_id or username).`);
        if (message.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);

        const _action = Actions.find(d => d.action == 'SendWhisper');

        const postData = JSON.stringify({
            message: message
        });

        const _options = {
            hostname: 'api.twitch.tv',
            port: 443,
            path: `${_action?.param.Suscription}?${_action?.param.query[0]}=${(await this.GetUserByName(from))[0].id}&${_action?.param.query[1]}=${(await this.GetUserByName(to))[0].id}`,
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
                if(res.statusCode === 200)
                    this.log.log(`whisper to${this.log.Color.color.Magenta} #${to}${this.log.Color.Reset}: ${message}`);
                else
                    this.log.log(`${this.log.Color.color.Yellow}Whisper ${this.log.Color.BrightColor.Red}${res.statusCode}${this.log.Color.Reset}: ${res.statusMessage}`);
            });
        });

        req.on('error', (error) => {
            console.error(error);
        });

        req.write(postData);
        req.end();
    }
}