import color from './Colors.json'

export class EventSubLog{
    public debug = false;

    log(...data: any[]): void {
        if (this.debug) {
            console.log(`${color.color.Green}Twitch EventSub: ${color.Reset}${data}${color.Reset}`)
        }
    }
    
    error(...data: any[]): void {
        if (this.debug) {
            throw new Error(`ERROR IN EventSub: ${data}`);
        }
    }
}