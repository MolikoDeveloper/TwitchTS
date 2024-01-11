

export class EventSubLog{
    public debug = false;

    log(...data: any[]): void {
        if (this.debug) {
            console.log(`\u001b[32mTwitch EventSub: \u001b[0m${data}\u001b[0m`)
        }
    }
    
    error(...data: any[]): void {
        if (this.debug) {
            throw new Error(`ERROR IN EventSub: ${data}`);
        }
    }
}