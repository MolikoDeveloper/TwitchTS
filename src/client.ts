import WebSocket from 'ws'

//wss://eventsub.wss.twitch.tv/ws?


class client{
    private wsConnection:WebSocket |undefined|any;
    
    constructor(){
        this.connectws()
    }

    private connectws(){
        this.wsConnection= new WebSocket.WebSocket('wss://pubsub-edge.twitch.tv');
        
        this.wsConnection?.on('open',() => {
            console.log("conectado");
            
            const message = {
                type: 'LISTEN',
                nonce: this.generateNonce(),
                data: {
                    topics: ['channel-points-channel-v1.' + 67396993],
                    auth_token: 'oauth:viusld2kid3jgzvi0tpemljwgtx41e'
                }
            };

            this.wsConnection?.send(JSON.stringify(message));
        })

        this.wsConnection?.on('message',(res:any) => {
            console.log("mensaje");
            console.log(res.toString());
        })
    }
    private generateNonce(length = 15) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
new client();

