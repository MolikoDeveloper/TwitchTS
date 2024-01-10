import {IrcClient} from './index'

const chat = new IrcClient({
    channel: 'albertosaurus_ac',
    'idendity': {
        'username': 'albertoidesaurus',
        //'UserToken': 'oauth:9f5pxvj94kdgk3v1zlc9b75w3mpf71'
        'Token': 'oauth:ig8k8aloochtik55rotnl1d3kulxg3'
    },
    debug:false
});

chat.on('message', (channel, tags, message, self) => {
    if (self()) return;
    console.log(tags)
    chat._sendMessage({ channel: 'albertosaurus_ac', message: "hola mundo!" });
})
