import type { EventType, SubcriptionType } from "./util/Data";
import {RequestPaths, RequestHosts, substype} from './util/Data'
import type { Options } from "../Session";
import {request} from 'http'
import fs from 'fs'
import { parseMessage } from '../irc/parser';


interface ConstructorOptions {
    broadcasterId: string;
    event: EventType
}

export class Subscription{
    public data?: any;
    private subs_type?: SubcriptionType;

    constructor(options: ConstructorOptions){
        this.subs_type = substype(options.event)

        this.data = {
            type: this.subs_type?.param?.event,
            version: this.subs_type?.param?.version,
            condition:{
                broadcaster_user_id: options.broadcasterId,
                moderator_user_id: options.broadcasterId
            },
            transport:{
                method: 'websocket',
                session_id: ''
            }
        };
    }    

    public subscribe(options: Options){
        if(!this.data?.condition.broadcaster_user_id) throw new Error("define a broadcaster");
        if (!this.data?.type.length) throw new Error("No event was defined");
        this.data.transport.session_id = options.idendity.sessionId;
        
        const _postData = JSON.stringify(this.data);
        const _options = {
            host: RequestHosts.BaseAPI,
            path: this.subs_type?.param?.Suscription,
            port: 443,
            method: this.subs_type?.param?.method,
            headers:{
                'Content-Type': 'application/json',
                'Client-Id': `${options.idendity.ClientID}`,
                'Authorization': `Bearer ${options.idendity.ClientToken}`
            }
        };
        
        
        console.time('Connect Request')
        const req = request(_options, (res)=>{
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk)=> {
                body += chunk
            });
            res.on('end',()=>{
                if(res.statusCode === 200 || res.statusCode === 202){
                    console.log([`connected to ${RequestHosts.BaseAPI}`]);
                }
                else{
                    console.log('ERROR ',res.statusCode, body)
                }              
            })
        });

        req.on('error', e => console.error('Error REQ ',e))
        req.write(_postData);
        req.end();
        console.timeEnd('Connect Request');

    }
}