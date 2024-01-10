import {IrcClient} from './index'

const chat = new IrcClient({
    channels: ['albertosaurus_ac', 'agustabell212'],
    'idendity': {
        'username': 'albertoidesaurus',
        'Token': 'ig8k8aloochtik55rotnl1d3kulxg3'
    },
    debug:true
});

chat.on('message', (channel, tags, message, self) => {
    if (self) return;
    
    if(message.toLocaleLowerCase().includes("hello")){
        chat.say(channel, `hi @${tags['display-name']}`);
    }
})