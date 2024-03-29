// Parses an IRC message and returns a JSON object with the message's 
// component parts (tags, source (nick and host), command, parameters). 
// Expects the caller to pass a single message. (Remember, the Twitch 
// IRC server may send one or more IRC messages in a single message.)

import { isBot } from "../util/GetUnknownBots";
import type { UserState, Tag, Command, Source, RoomState } from "./util/Data";

export async function parseMessage(message: string) : Promise<UserState> {

    let parsedMessage: UserState = {  // Contains the component parts.
        tags: undefined,
        source: undefined,
        command: undefined,
        parameters: undefined
    };

    // The start index. Increments as we parse the IRC message.

    let idx = 0; 

    // The raw components of the IRC message.

    let rawTagsComponent: string = '';
    let rawSourceComponent: string = ''; 
    let rawCommandComponent : string= '';
    let rawParametersComponent : string = '';

    // If the message includes tags, get the tags component of the IRC message.

    if (message[idx] === '@') {  // The message includes tags.
        let endIdx = message.indexOf(' ');
        rawTagsComponent = message.slice(1, endIdx);
        idx = endIdx + 1; // Should now point to source colon (:).
    }

    // Get the source component (nick and host) of the IRC message.
    // The idx should point to the source part; otherwise, it's a PING command.

    if (message[idx] === ':') {
        idx += 1;
        let endIdx = message.indexOf(' ', idx);
        rawSourceComponent = message.slice(idx, endIdx);
        idx = endIdx + 1;  // Should point to the command part of the message.
    }

    // Get the command component of the IRC message.

    let endIdx = message.indexOf(':', idx);  // Looking for the parameters part of the message.
    if (-1 == endIdx) {                      // But not all messages include the parameters part.
        endIdx = message.length;                 
    }

    rawCommandComponent = message.slice(idx, endIdx).trim();

    // Get the parameters component of the IRC message.

    if (endIdx != message.length) {  // Check if the IRC message contains a parameters component.
        idx = endIdx + 1;            // Should point to the parameters part of the message.
        rawParametersComponent = message.slice(idx);
    }

    // Parse the command component of the IRC message.

    parsedMessage.command = await parseCommand(rawCommandComponent);

    // Only parse the rest of the components if it's a command
    // we care about; we ignore some messages.

    if (!parsedMessage.command) {  // Is null if it's a message we don't care about.
        return parsedMessage; 
    }
    else {
        if (rawTagsComponent!=null) {  // The IRC message contains tags.
            parsedMessage.tags = await parseTags(rawTagsComponent);
        }

        parsedMessage.source = await parseSource(rawSourceComponent);
        parsedMessage.command.isBotCommand = false;

        parsedMessage.parameters = rawParametersComponent.trim();
        if (rawParametersComponent && rawParametersComponent[0] === '!') {  
            // The user entered a bot command in the chat window.            
            parsedMessage.command = await parseParameters(rawParametersComponent, parsedMessage.command);
        }
    }

    return parsedMessage;
}

// Parses the tags component of the IRC message.async 
async function parseTags(tags: string):Promise<Tag> {
    // badge-info=;badges=broadcaster/1;color=#0000FF;...

    const tagsToIgnore = {  // List of tags to ignore.
        'client-nonce': null,
        'flags': null
    };

    let dictParsedTags:any = {};  // Holds the parsed list of tags.
                              // The key is the tag's name (e.g., color).
    let parsedTags: string[] = tags.split(';'); 

    parsedTags.forEach(tag => {
        let parsedTag = tag.split('=');  // Tags are key/value pairs.
        let tagValue: any = (parsedTag[1] === '') ? null : parsedTag[1];

        switch (parsedTag[0]) {  // Switch on tag name
            case 'badges':
            case 'badge-info':
                // badges=staff/1,broadcaster/1,turbo/1;

                if (tagValue) {
                    let dict: any = {};  // Holds the list of badge objects.
                                    // The key is the badge's name (e.g., subscriber).
                    let badges = tagValue.split(','); 
                    badges.forEach((pair: any)=> {
                        let badgeParts = pair.split('/');
                        dict[badgeParts[0]] = badgeParts[1];
                    })
                    dictParsedTags[parsedTag[0]] = dict;
                }
                else {
                    dictParsedTags[parsedTag[0]] = null;
                }
                break;
            case 'emotes':
                // emotes=25:0-4,12-16/1902:6-10

                if (tagValue) {
                    let dictEmotes: any = {};  // Holds a list of emote objects.
                                          // The key is the emote's ID.
                    let emotes = tagValue.split('/');
                    emotes.forEach((emote: any) => {
                        let emoteParts = emote.split(':');

                        let textPositions: any= [];  // The list of position objects that identify
                                                 // the location of the emote in the chat message.
                        let positions = emoteParts[1].split(',');
                        positions.forEach((position:any) => {
                            let positionParts = position.split('-');
                            textPositions.push({
                                startPosition: positionParts[0],
                                endPosition: positionParts[1]    
                            })
                        });

                        dictEmotes[emoteParts[0]] = textPositions;
                    })

                    dictParsedTags[parsedTag[0]] = dictEmotes;
                }
                else {
                    dictParsedTags[parsedTag[0]] = null;
                }

                break;
            case 'emote-sets':
                // emote-sets=0,33,50,237

                let emoteSetIds = tagValue.split(',');  // Array of emote set IDs.
                dictParsedTags[parsedTag[0]] = emoteSetIds;
                break;
            default:
                // If the tag is in the list of tags to ignore, ignore
                // it; otherwise, add it.

                if (tagsToIgnore.hasOwnProperty(parsedTag[0])) { 
                    ;
                }
                else {
                    dictParsedTags[parsedTag[0]] = tagValue;
                }
        } 
    });

    return dictParsedTags;
}

// Parses the command component of the IRC message.
async function parseCommand(rawCommandComponent: string): Promise<Command|undefined> {
    let parsedCommand:Command|undefined = undefined;
    let commandParts = rawCommandComponent.split(' ');

    switch (commandParts[0]) {
        case 'JOIN':// one person join to the chat/channel
        case 'PART':
        case 'NOTICE':
        case 'CLEARCHAT':
        case 'HOSTTARGET':
        case 'CLEARMSG':
        case 'PRIVMSG':
            parsedCommand = {
                command: commandParts[0],
                channel: commandParts[1]
            }
            break;
        case 'PING':
            parsedCommand = {
                command: commandParts[0]
            }
            break;
        case 'CAP':
            parsedCommand = {
                command: commandParts[0],
                isCapRequestEnabled: (commandParts[2] === 'ACK') ? true : false,
                // The parameters part of the messages contains the 
                // enabled capabilities.
            }
            break;
        case 'GLOBALUSERSTATE':  // Included only if you request the /commands capability.
                                 // But it has no meaning without also including the /tags capability.
            parsedCommand = {
                command: commandParts[0]
            }
            break;               
        case 'USERSTATE':   // Included only if you request the /commands capability.
        case 'ROOMSTATE':   // But it has no meaning without also including the /tags capabilities.
            parsedCommand = {
                command: commandParts[0],
                channel: await parseChannelFromRoomState(commandParts[1]),
                roomstate: await parseRoomState(commandParts[1])
            }
            break;
        case 'RECONNECT':  
            //console.log('The Twitch IRC server is about to terminate the connection for maintenance.')
            parsedCommand = {
                command: commandParts[0]
            }
            break;
        case '421':
        case '001':  // Logged in (successfully authenticated). 
            parsedCommand = {
                command: commandParts[0],
                channel: commandParts[1]
            }
            break;
        case '002':  // Ignoring all other numeric messages.
        case '003':
        case '004':
        case '353':  // Tells you who else is in the chat room you're joining.
        case '366':
        case '372':
        case '375':
        case '376':
            //console.log(`connected to server`)
            return;
        default:
            //console.log(`\nUnexpected command: ${commandParts[0]}\n`);
            return;
    }

    return parsedCommand;
}

// Parses the source (nick and host) components of the IRC message.
async function parseSource(rawSourceComponent: string): Promise<Source|undefined>{
    if (!rawSourceComponent) {  // Not all messages contain a source
        return;
    }
    else {
        let sourceParts = rawSourceComponent.split('!');
        return {
            nick :(sourceParts.length == 2) ? sourceParts[0] : undefined,
            host :(sourceParts.length == 2) ? sourceParts[1] : sourceParts[0],
            isbot: (sourceParts.length == 2) ? (await isBot(sourceParts[0])) : undefined
        };
    }
}

// Parsing the IRC parameters component if it contains a command (e.g., !dice).
async function parseParameters(rawParametersComponent: string, command:Command): Promise<Command> {
    let idx = 0
    let commandParts = rawParametersComponent.slice(idx + 1); 
    let paramsIdx = commandParts.indexOf(' ');
    command.isBotCommand = true;
    if (-1 == paramsIdx) { // no parameters
        command.botCommand = commandParts.slice(0);
    }
    else {
        command.botCommand = commandParts.slice(0, paramsIdx); 
        command.botCommandParams = commandParts.slice(paramsIdx).trim().split(' ').filter(d=>d!=' ');
    }
    return command;
}

async function parseRoomState(rawParametersComponent:string):Promise<RoomState>{
    const [prefix, keyValuePairs] = rawParametersComponent.split('@');

    // Dividir los pares clave-valor en un array
    const pairs = keyValuePairs?.split(';');

    // Crear un objeto vacío
    const obj: { [key: string]: string } = {};

    // Procesar cada par clave-valor
    pairs?.forEach((pair:any) => {
        const [key, value] = pair.split('=');

        // Convertir el valor a número si es posible, de lo contrario dejarlo como cadena
        obj[key] = isNaN(value) ? value : value;
    });

    // Agregar el prefijo al objeto si es necesario
    if (prefix.trim().length > 0) {
        obj['prefix'] = prefix.trim();
    }

    return {
        'emote-only': obj['emote-only']!,
        'followers-only': obj['followers-only']!,
        'r9k': obj['r9k']!,
        'room-id': obj['room-id']!,
        'slow': obj['slow']!,
        'subs-only': obj['subs-only']!
    };
}

async function parseChannelFromRoomState(rawParametersComponent:string):Promise<string>{
    const [prefix, keyValuePairs] = rawParametersComponent.split('@');

    return prefix.trim();
}