import {IrcClient} from './index'

const chat = new IrcClient({
    channel: 'albertosaurus_ac',
    'idendity': {
        'username': 'albertoidesaurus',
        'UserToken': 'oauth:9f5pxvj94kdgk3v1zlc9b75w3mpf71'
    }
});

chat.on('message', (channel, tags, message, self) => {
    if (self()) return;
    chat._sendMessage({ channel: 'albertosaurus_ac', message: "hola mundo!" });
})
