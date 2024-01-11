import {IrcClient} from './index'
import auth from './secrets.json'

const chat = new IrcClient(auth);

chat.on('message', (channel, tags, message, self) => {
    if (self) return;
    
    if(message.includes("hello")){
        //chat.say(channel, `/me hi @${tags['display-name']}`);
    }
})

chat.on('join', (channel, user, self)=>{
//    console.log(user);
})