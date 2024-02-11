import type { EventType, SubcriptionType } from "./util/Data";
import {RequestPaths, RequestHosts, substype} from './util/Data'
import type { Options } from "../../util/session";
import {request} from 'http'
import { EventSubLog } from "../../Log/EventSubLog";


interface ConstructorOptions {
    event: EventType
}

export class Subscription{
    public data?: any;
    private subs_type?: SubcriptionType;

    constructor(broadcaster: string,options: ConstructorOptions[]){
        if(!options) return;

        options.forEach(option => {
            this.subs_type = substype(option.event)

            this.data = {
                type: this.subs_type?.param?.event,
                version: this.subs_type?.param?.version,
                condition:{
                    broadcaster_user_id: broadcaster!,
                    //user_id: options?.broadcasterId!
                    //"broadcaster_user_id": "1011151691",
                    "moderator_user_id": "1011151691"
                },
                transport:{
                    method: 'websocket',
                    session_id: ''
                }
            };
        })
    }    

    public subscribe(options: Options){
        if(!this.data?.condition.broadcaster_user_id) throw new Error("define a broadcaster");
        if (!this.data?.type.length) throw new Error("No event was defined");

        this.data.transport.session_id = options.identity.user?.sessionID!;
        
        const _postData = JSON.stringify(this.data);
        const _options = {
            host: RequestHosts.BaseAPI,
            path: this.subs_type?.param?.Suscription,
            port: 443,
            method: this.subs_type?.param?.method,
            headers:{
                'Content-Type': 'application/json',
                'Client-Id': `${options.identity.app?.clientId}`,
                'Authorization': `Bearer ${options.identity.user?.token}`
            }
        };
        
        
        console.time(`Connected to ${RequestHosts.BaseAPI}, ${options.channels}`)
        const req = request(_options, (res)=>{
            let body = '';
            res.setEncoding('utf-8');
            res.on('data', (chunk)=> {
                body += chunk
            });
            res.on('end',()=>{
                if(res.statusCode === 200 || res.statusCode === 202){
                    console.log(res.statusCode,[`connected to ${RequestHosts.BaseAPI}`]);
                }
                else{
                    console.log(`ERROR `,res.statusCode, body)
                }              
            })
        });

        req.on('error', e => console.error('Error REQ ',e));
        req.write(_postData);
        req.end();
        console.timeEnd(`Connected to ${RequestHosts.BaseAPI}, ${options.channels}`);

    }
}