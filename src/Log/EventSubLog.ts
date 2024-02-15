import color from './Colors.json'

export class EventSubLog{
    public debug = false;
    public Color = color;


    log(...data:any[]): void {
        if (this.debug) {
            data.forEach(d => {
                switch(typeof d){
                    case "object":
                        console.log(Bun.inspect(d,{'colors': true}));
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