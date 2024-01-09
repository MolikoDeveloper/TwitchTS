`this project was created with [bun](https://bun.sh).`

# TwitchTS

## IRC



## EventSub (websocket)


# TO-DO

- [x] IRC Connection
    - [x] Oauth
    - [x] Events
    - [x] Command Recognition (!command parameters split by space)

- [x] WebSocket Connection
    - [] Baurer Oauth
    - [] Get Events
    - [] Post Events
    - [X] Local Enviroment testing with Twitch CLI
    
- [] Webhook Connection
    - [] Baurer Oauth
    - [] Get Events
    - [] Post Events


# To install dependencies:
with bun
```bash
bun install
```

or with npm
```bash
npm install
```
# IRC (production)
to connect with IRC:



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


# huge thanks to these people for their projects:

[@ppauel](https://github.com/ppauel) ([twitch-eventsub](https://github.com/ppauel/twitch-eventsub)) (used as base for suscriptions and websocket connection to eventsub.)

[tmijs](https://github.com/tmijs) ([tmi.js](https://github.com/tmijs/tmi.js)) (used for local events examples.)

