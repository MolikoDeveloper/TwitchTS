import {color} from './Colors'

export class EventSubLog{
    public debug = false;
    public Color = color;


    log(...data:any[]): void {
        if (this.debug) {
            data.forEach(d => {
                switch(typeof d){
                    case "object":
                        if(process.versions.Bun)
                            console.log(Bun.inspect(d,{'colors': true}));
                        else{
                            const util = require('util')
                            console.log(util.inspect(d,{'colors': true}));
                        }

                        break;
                    default:
                        console.log(`${color.color.Cyan}Twitch Helix: ${color.Reset}${d}${color.Reset}`)
                }
            })
        }
    }
    
    error(...data: any[]): void {
        if (this.debug) {
            throw new Error(`ERROR IN EventSub: ${data}`);
        }
    }
}