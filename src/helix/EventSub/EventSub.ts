import type { Options, actionType } from "../../util/session";
import { EventSubBase } from "./eventSubBase";
import { request } from 'http'
import { Actions, type ChannelInformation, type Cheermotes, type ExtensionTransactions } from "./util/Actions";

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
            (await this.GetUserByName(channel))[0].id,//channel_id
            (await this.GetUserByName(this.options.identity.user?.username!))[0].id,//sender_id
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

    public async GetColorUserChat_byID(...UserID: string[]){
        if(!UserID){
            this.log.log(`${this.log.Color.BrightColor.Red}UserID${this.log.Color.Reset} cannot be empty in GetUserChatColorByID().`);
            return;
        } 

        return await this.post('GetUserChatColor',[],[],'user_id',UserID);
    }

    public async GetColorUserChat(...UserName: string[]){
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

    public async GetExtensionAnalytics(): Promise<{extension_id:string, type:string, started_at:string, ended_at:string, first: string, after:string}>{
        return await this.post('GetExtensionAnalytics', [], []);
    }

    public async GetGameAnalytics(game_id:string){
        return await this.post('GetGameAnalytics', ['5'], []);
    }

    public async GetBitsLeaderboard(): Promise<{user_id:string, user_login: string, user_name: string, rank: number, score: number}>{
        return await this.post('GetBitsLeaderboard', [], []);
    }

    public async GetCheermotes_byID(channel: string){
        if(channel){
            return await this.post('GetCheermotes',[channel],[],);
        }
        else
            return await(this.post('GetCheermotes',[],[]));
    }

    public async GetCheermotes(channel?: string): Promise<Cheermotes[]>{
        if(channel){
            const id = (await this.GetUserByName(channel))[0].id;
            return await this.post('GetCheermotes',[id],[],);
        }
        else
            return await(this.post('GetCheermotes',[],[]));
    }

    public async GetExtensionTransactions(extension_id:string, first?: number, page?: number): Promise<ExtensionTransactions[]>{
        const SafeFirst:string = first? first.toString() : '';
        const SafePage:string = page? page.toString() : '';

        return await(this.post('GetExtensionTransactions',[extension_id,SafeFirst, SafePage],[]));
    }

    public async GetChannelInformation_byID(... channels:string[]): Promise<{ broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, broadcaster_language: string, game_id: string,game_name: string, title: string,delay: number,tags: string[],content_classification_labels: string[],is_branded_content: boolean}>{
        return await this.post('GetChannelInformation',[],[], 'broadcaster_id', channels);
    }

    public async GetChannelInformation(... channels:string[]): Promise<{ broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, broadcaster_language: string, game_id: string,game_name: string, title: string,delay: number,tags: string[],content_classification_labels: string[],is_branded_content: boolean}>{
        const promise = Promise.all(channels.map(channel => this.GetUserByName(channel)));
        let ids = (await promise).map(d => d[0].id);
        
        return await this.post('GetChannelInformation',[],[], 'broadcaster_id', ids);
    }

    public async ModifyChannelInformation(channel:string, info: ChannelInformation){
        const id = (await this.GetUserByName(channel))[0].id;

        return await this.post('ModifyChannelInformation', [id], [info.game_id, info.broadcasterLanguage, info.title, info.delay, info.tags, /*info.contentClassificationLabels,*/ info.isBrandedContent]);
    }

    public async ModifyChannelInformation_byID(channel:string, info: ChannelInformation){
        return await this.post('ModifyChannelInformation', [channel], [info.game_id, info.broadcasterLanguage, info.title, info.delay, info.tags, /*info.contentClassificationLabels,*/ info.isBrandedContent]);
    }
    
    public async GetChannelEditors_byID(channel: string):Promise<{user_id: string, user_name: string, created_at: string}[]>{
        return (await this.post('GetChannelEditors', [channel], []))
    }

    public async GetChannelEditors(channel: string): Promise<{user_id: string, user_name: string, created_at: string}[]>{
        const id = (await this.GetUserByName(channel))[0].id;
        return (await this.post('GetChannelEditors', [id], []))
    }

    public async GetFollowedChannels(user: string, count?: number): Promise<{broadcaster_id:string, broadcaster_login:string, broadcaster_name:string, followed_at:string}[]>{
        const _user = (await this.GetUserByName((user? user: this.options.identity.user?.username!)))[0].id;
        return await this.post('GetFollowedChannels', [_user, count], [])
    }

    public async GetChannelFollowers(channel: string,user?:string, count?: number): Promise<{broadcaster_id:string, broadcaster_login:string, broadcaster_name:string, followed_at:string}[]>{
        let _user:string = '';
        if(user)
            _user = (await this.GetUserByName((user)))[0].id;
        const _channel = (await this.GetUserByName(channel))[0].id;

        return await this.post('GetChannelFollowers', [_channel, _user, count], [])
    }
    
    public async GetChannelFollowers_byID(channel: string,user?:string, count?: number): Promise<{broadcaster_id:string, broadcaster_login:string, broadcaster_name:string, followed_at:string}[]>{
        return await this.post('GetChannelFollowers', [channel, user, count], [])
    }

    public async CreateCustomRewards(channel: string, title:string, cost: number, promp?: string, isenabled?: boolean, backgroundColor?: boolean, IsUserInputRequired?:boolean, MaxPerStream?: number, MaxPerUserStream?:number, GlobalCoolDownSeconds?: number, ShouldRedemptionsSkipRequestQueue?: boolean ): Promise<{}[]>{
        const _channel = (await this.GetUserByName(channel))[0].id;
            
        let _MaxPerStreamEnabled:        boolean = false;
        let _MaxPerUserStreamEnabled:    boolean = false;
        let _GlobalCooldownEnabled:    boolean = false;

        if(MaxPerStream || MaxPerStream! > 0) _MaxPerStreamEnabled = true;
        if(MaxPerUserStream || MaxPerUserStream! > 0) _MaxPerUserStreamEnabled = true;
        if(GlobalCoolDownSeconds || GlobalCoolDownSeconds! > 0) _GlobalCooldownEnabled = true;
        
        return await this.post('CreateCustomRewards', [_channel], [title, cost, promp, isenabled, backgroundColor, IsUserInputRequired, _MaxPerStreamEnabled, MaxPerStream, _MaxPerUserStreamEnabled, MaxPerUserStream, _GlobalCooldownEnabled, GlobalCoolDownSeconds, ShouldRedemptionsSkipRequestQueue])
    }

    private async post(action: actionType, query: any[], body: any[], queryLoopType?: string,queryLoop?: string[]): Promise<any> {
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
                let querystring = '';

                const postQuery = JSON.stringify(query.reduce((obj, val, i)=> {
                    if(val)
                        obj[actionConfig.param.query[i]] = val
                    return obj
                }, {}));

                const parsedQuery:  { [key: string]: string } = JSON.parse(postQuery);

                let first = true;
                for(const key in parsedQuery){
                    if(parsedQuery.hasOwnProperty(key))
                        if(first){
                            querystring += `?${key}=${parsedQuery[key]}`;
                            first = false;
                        }
                        else
                            querystring += `&${key}=${parsedQuery[key]}`;
                }

                fullPath += querystring
            }
            
            if(queryLoopType != null && queryLoop != undefined){
                fullPath += `?${queryLoopType}=${queryLoop.join(`&${queryLoopType}=`)}`;
            }

            const postData = JSON.stringify(body.reduce((obj, val, i) => {
                if(val)
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
                    console.log()
                    switch (res.statusCode) {
                        case 200:
                            this.log.log(`${yellow}${action}${reset} success.`);
                            resolve(JSON.parse(data).data);
                            break;
                        case 204:
                            this.log.log(`${yellow}${action}${reset} success.`);
                            break;
                        default:
                            this.log.log(`Request to ${yellow}${action}${reset} failed with ${res.statusCode}: ${res.statusMessage}`);
                            reject(res.statusCode);
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