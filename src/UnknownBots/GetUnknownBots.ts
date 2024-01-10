export interface TwitchBot {
    name: string;
    id: number;
    timestamp: Date;
}

export interface TwitchBotsResponse {
    bots: TwitchBot[];
}

async function GetTwitchBotList(): Promise<TwitchBotsResponse> {
    const response = await fetch('https://api.twitchinsights.net/v1/bots/all?bots');
    const data = await response.json();

    // Transformar los datos al formato de la interfaz
    const bots = data.bots.map((bot: [string, number, number]) => {
        return { name: bot[0], id: bot[1], timestamp: new Date(bot[2]*1000) };
    });
    return { bots };
}

export async function autoban(name: string): Promise<Boolean>{
    const data = await GetTwitchBotList();
    return data.bots.some(d=> d.name === name)
}


/*use example
autoban("username here").then(element => {
    console.log(element)
})

console.log(await autoban("username here"))*/