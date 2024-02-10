export async function getEmojiByName(channel: string,name: string){
    if(!name)
        return

    const response = await fetch(`https://7tv.io/v3/users/twitch/${channel}`);
    const result = (await response.json()).emote_set.emotes.find((emote:any) => emote.name == name);

    if(!result){
        return;
    }
    const Emote = 
    {
        name: result?.name,
        owner: result?.data.owner.display_name,
        avif:{
            '1x': `${result?.data.host.url}/${result?.data.host.files[0].name}`,
            '2x': `${result?.data.host.url}/${result?.data.host.files[2].name}`,
            '3x': `${result?.data.host.url}/${result?.data.host.files[4].name}`,
            '4x': `${result?.data.host.url}/${result?.data.host.files[6].name}`,
        },
        webp:{
            '1x': `${result?.data.host.url}/${result?.data.host.files[1].name}`,
            '2x': `${result?.data.host.url}/${result?.data.host.files[3].name}`,
            '3x': `${result?.data.host.url}/${result?.data.host.files[5].name}`,
            '4x': `${result?.data.host.url}/${result?.data.host.files[7].name}`,
        },
    }

    return Emote
}