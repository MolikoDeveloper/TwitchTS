import {IrcClient} from './index'

const chat = new IrcClient({
    channel: 'albertosaurus_ac',
    'idendity': {
        'username': 'albertoidesaurus',
        'Token': 'ig8k8aloochtik55rotnl1d3kulxg3'
    },
    debug:true
});

chat.on('message', (channel, tags, message, self) => {
   // if (self) return;
    console.log(message)
    //chat._sendMessage({ channel: 'albertosaurus_ac', message: "hola mundo!" });
})

chat.on('ban', (channel, username)=>{
    console.log(channel,username);
})