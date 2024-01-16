import { isCommaListExpression } from "typescript";
import type { UserState } from "../irc/util/Data";
import { clean } from 'profanity-cleaner';
import color from './Colors.json'

export class IRCLog {
    public debug = false;
    public botname = ''

    log(...data: any[]): void {
        if (this.debug) {
            console.log(`${color.color.Magenta}Twitch Chat: ${color.Reset}${data}${color.Reset}`)
        }
    }

    LogOffDebug(...data: []): void {
        console.log(`${color.color.Magenta}TwitchTS: ${color.Reset}${data}${color.Reset}`)
    }
    //pendientes anuncio, clear, goal
    messageLog(message: UserState | any) {
        if (this.debug) {
            switch (message.command?.command) {
                case "CAP":
                    this.log("Request CAP Correct.");
                    break;
                case "001":
                    this.log(`connected to ${color.color.Red}#${message?.command?.channel}${color.Reset} chat as ${color.color.Magenta}@${this.botname}.`);
                    break;
                case "421":
                    this.log(`${color.color.Red}Unsupported IRC command: ${color.BrightColor.Yellow}${message?.command[2]}`);
                    break;
                case "RECONNECT":
                    this.log(`${color.color.Red}The Twitch IRC server is about to terminate the connection for maintenance.`);
                    break;
                case "JOIN":
                    if (message?.source?.nick?.toLocaleLowerCase() == this.botname.toLocaleLowerCase()) {
                        break;
                    }
                    else {
                        this.log(`${color.color.Green}@${message?.source?.nick}${color.Reset} joined to ${color.color.Red}${message?.command?.channel}${color.Reset} chat. ${(message.tags['ban-duration']) ? 'recognized as a bot.':''}`)
                    }
                    break;
                case "396":
                    this.log(`Connected to Server.`)
                    break;
                case "353": // Tells you who else is in the chat room you're joining.
                    //this.log(message)
                    break;
                case "NOTICE": //tells you any change made in the chat or any error.
                    //console.log(message);
                    this.log(`${color.color.Red}${message.parameters}`);
                    break;
                case "PING":
                    this.log(`PING`);
                    break;
                case "USERSTATE":break;
                case '366': break;
                case '372': break;
                case '375': break;
                case '003': break;
                case '004': break;
                case '421': break; //unknown command
                case 'ROOMSTATE':
                    for (let key in message.command.roomstate) {
                        if (message.command.roomstate.hasOwnProperty(key)) {
                            const value = message?.command?.roomstate[key] || message.tags[key];
                            if(key != 'room-id'){
                                let boolValue = (key === "followers-only") ? Boolean(1+Number(value)) : Boolean(Number(value));
                                let Color = boolValue ? '${color.color.Green}' : '${color.color.Red}'; // Verde si es verdadero, rojo si es falso
                                this.log(`${color.color.Yellow}${key}${color.Reset}: ${Color}${boolValue}${color.Reset}`);
                            }
                            else{
                                this.log(`${color.color.Yellow}${key}${color.Reset}: ${color.color.Blue}${value}${color.Reset}`);
                            }
                        }
                    }
                    break;
                case 'PRIVMSG':
                    this.log(`${color.color.Red}${message?.command?.channel}${color.Reset} ${color.color.Green}@${message.source?.nick}${color.Reset}: ${ (message.profanity == false) ? message.parameters?.trim() : clean(message.parameters?.trim())}`)
                    break;
                case 'CLEARCHAT':
                    if(!message.parameters) this.log(`${message.command.channel} Console Cleared.`)
                    else this.log(`user ${color.color.Green}@${message.parameters}${color.Reset} banned from ${color.color.Red}${message?.command?.channel}${color.Reset} channel${(message.tags['ban-duration']) ? ' for '+message.tags['ban-duration']+' seconds':'.'}`)
                    break;
                default:
                    break;
            }
        }
    }

    error(...data: any[]): void {
        if (this.debug) {
            throw new Error(`ERROR IN IRC: ${data}`);
        }
    }
}