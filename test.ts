import {IrcClient, EventSub} from './index'
import auth from './secrets.json'


const chat = new IrcClient({
    channels: ['albertosaurus_ac'],
    identity: auth,
    debug: true,
    profaneFilter: true
});

chat.on('message', async (channel, user, message, self) => {

});

chat.on('join', (channel, user, self)=>{
    console.log(user.isbot, user.nick)
});