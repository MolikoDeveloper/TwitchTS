this project was created with [bun](https://bun.sh).

# W.I.P Please Do not use in Production.

# TwitchTS (bun)

## Connect to Chat IRC

you can connect to the chat as anonymous, or with your username and [twitch Oauth Token](https://dev.twitch.tv/docs/cli/token-command/#get-an-access-token) 


```ts
import {IrcClient} from 'twitchts';

const chat = new IrcClient({
    channels: ['CHANNEL'],
    'idendity': {
        'username': 'YOUR_USERNAME',
        'Token': 'YOUR_TOKEN_WITHOUT_OAUTH'
    },
    debug:true
});

chat.on('message', (channel, tags, message, self) => {
    if (self) return; //if self == channel.idendity return.
    
    if(message.toLocaleLowerCase().includes("hello")){
        chat.say(channel, `hi @${tags['display-name']}`);
    }
})
```


# EventSub (websocket)


## TO-DO

- [x] IRC Connection
    - [x] Oauth
    - [x] Events
    - [x] Command Recognition (!command parameters split by space)
    - [ ] Predictions

- [x] WebSocket Connection
    - [ ] Baurer Oauth
    - [ ] Get Events
    - [ ] Post Events
    - [X] Local Enviroment testing with Twitch CLI
    
- [ ] Webhook Connection
    - [ ] Baurer Oauth
    - [ ] Get Events
    - [ ] Post Events


## To install dependencies:
```bash
bun install
```

## Generate Token

# PENDIENTE
```ts
/*
    pendiente, crear servicio para obtener el token facilmente con ClientID y Secret.
    Generar Code
    Generar Token
    Definir Scopes
*/

    function ObtenerCode(ClientID, Secret, RedirectUri, scopes: TokenScopes[], ForceVerify:boolean){
        //response_type=code
        let _scopes = scopes.foreach(d => d.replace(":", "%30A"))

        console.log("enlace twitch");
    }

    //POST
    function ObtenerTokens(client_id, secret, code, redirect_uri){
        console.log(Token)
        console.log(RefreshToken)
    }
```
#

# Twitch CLI (WebSocket EventSub)
### [install Twitch CLI](https://dev.twitch.tv/docs/cli/)

start server with:

```bash
twitch event websocket start-server
```

[send event from server:](https://dev.twitch.tv/docs/cli/websocket-event-command/)
```bash
twitch event trigger channel.ban --transport=websocket
```


# huge thanks these projects:

[@ppauel](https://github.com/ppauel) ([twitch-eventsub](https://github.com/ppauel/twitch-eventsub)) and 
[tmijs](https://github.com/tmijs) ([tmi.js](https://github.com/tmijs/tmi.js))
