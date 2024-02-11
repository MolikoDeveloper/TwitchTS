# 7TV simple API

> usage

```ts
import { getEmojiByName } from './src/7tv/7tv'
/**
*@param {string} channel - Broadcaster_id of the channel.
*@param {string} name - name of the emote 
*/
getEmojiByName('114772787',name: "ALOO").then((result)=>{
    console.log(result)
});
```