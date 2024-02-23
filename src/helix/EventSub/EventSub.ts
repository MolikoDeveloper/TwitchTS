import type { Options, actionType } from "../../util/session";
import { EventSubBase } from "./eventSubBase";
import { request } from 'http'
import { Actions } from "./util/Actions";

export class EventSub extends EventSubBase {

    constructor(options: Options) {
        super(options);
    }

    public async SendChatMessage(channel: string, message: string) {
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

        return await this.post('SendChatMessage', [], [
            (await this.GetUserByName(channel))[0].id,
            (await this.GetUserByName(this.options.identity.user?.username!))[0].id,
            message]);
    }

    public async SendWhisper(to: string, message: string) {
        if (!this.options.identity.user?.username) {
            this.log.log(`${this.log.Color.BrightColor.Red}Options.identity.user.username${this.log.Color.Reset} cannot be empty in whisper().`);
            return;
        }
        if (to.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, ${this.log.Color.color.Red}sender${this.log.Color.Reset}, message); => cannot be empty (user_id or username).`);
        if (message.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);

        return await this.post('SendWhisper', [
            (await this.GetUserByName(this.options.identity.user?.username!))[0].id,
            (await this.GetUserByName(to))[0].id,
        ], [
            message
        ]);
    }

    public async GetUserChatColorByID(...UserID: string[]){
        if(!UserID){
            this.log.log(`${this.log.Color.BrightColor.Red}UserID${this.log.Color.Reset} cannot be empty in GetUserChatColorByID().`);
            return;
        } 

        return await this.post('GetUserChatColor',[],[],'user_id',UserID);
    }

    public async GetUserChatColorByName(...UserName: string[]){
        if(!UserName){
            this.log.log(`${this.log.Color.BrightColor.Red}UserName${this.log.Color.Reset} cannot be empty in GetUserChatColorByName().`);
            return;
        } 
        
        const promise = Promise.all(UserName.map(d => this.GetUserByName(d)));
        let ids = (await promise).map(d => d[0].id);
        return await this.post('GetUserChatColor',[],[],'user_id',ids);
    }

    public async StartCommercial(channel:string, length:number = 30){
        if (!channel) {
            this.log.log(`${this.log.Color.BrightColor.Red}channel${this.log.Color.Reset} cannot be empty in StartCommercial().`);
            return;
        }
        if (length < 30 || length > 180) {
            this.log.log(`${this.log.Color.BrightColor.Red}length${this.log.Color.Reset} minimum 30 seconds and maximum 180 seconds to start a commercial`);
            return;
        }

        return await this.post('StartCommercial',[],[channel, length]);

    }

    public async GetAdSchedule(channel:string){
        if(!channel){
            this.log.log(`${this.log.Color.BrightColor.Red}channel${this.log.Color.Reset} cannot be empty in GetAdSchedule().`);
            return;
        } 
        let _channel = await this.GetUserByName(channel);

        return await this.post('GetAdSchedule', [_channel[0].id], []);
    }

    public async SnoozeNextAd(channel: string){
        if(!channel){
            this.log.log(`${this.log.Color.BrightColor.Red}channel${this.log.Color.Reset} cannot be empty in SnoozeNextAd().`);
            return;
        } 
        let _channel = await this.GetUserByName(channel);

        return await this.post('SnoozeNextAd', [_channel[0].id], []);
    }

    public async GetExtensionAnalytics(){
        return await this.post('GetExtensionAnalytics', [], []);
    }

    public async GetGameAnalytics(game?:string, started_at?: string,ended_at?:string, first?:string,after?:string){
        
    }

    private async post(action: actionType, query: string[], body: any[], queryLoopType?: string,queryLoop?: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const yellow = this.log.Color.BrightColor.Yellow;
            const reset = this.log.Color.Reset;
            const actionConfig = Actions.find(a => a.action === action);
            if (!actionConfig) {
                this.log.log(`Action ${action} not found.`);
                return;
            }

            let fullPath = actionConfig.param.Subscription;
            if (query.length > 0 && actionConfig.param.query.length === query.length) {
                if(actionConfig.param.query.length > 0)
                    fullPath += '?' + actionConfig.param.query.map((q, i) => q.replace(`[${i}]`, query[i])).join('&');
            }
            
            if(queryLoopType != null && queryLoop != undefined){
                fullPath += `?${queryLoopType}=${queryLoop.join(`&${queryLoopType}=`)}`;
            }

            const postData = JSON.stringify(body.reduce((obj, val, i) => {
                obj[actionConfig.param.body[i]] = val;
                return obj;
            }, {}));

            const _options = {
                hostname: 'api.twitch.tv',
                port: 443,
                path: fullPath,
                method: actionConfig.param.method,
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
                            resolve(JSON.parse(data).data);
                            break;
                        case 204:
                            this.log.log(`${yellow}${action}${reset} success.`);
                            break;
                        default:
                            this.log.log(`Request to ${yellow}${action}${reset} failed with ${res.statusCode}: ${JSON.parse(data).message}`);
                            resolve(JSON.parse(data));
                            break;
                    }
                });
            });

            req.on('error', (error) => {
                this.log.log(`Error with request: ${error.message}`);
            });

            req.write(postData);
            req.end();
        });
    }
}