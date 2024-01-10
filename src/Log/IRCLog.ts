import { isCommaListExpression } from "typescript";
import type { UserState } from "../irc/util/Data";


export class IRCLog {
    public debug = false;
    public botname = ''

    log(...data: any[]): void {
        if (this.debug) {
            console.log(`\u001b[35mTwitch Chat: \u001b[0m${data}\u001b[0m`)
        }
    }

    LogOffDebug(...data: []): void {
        console.log(`\u001b[35mTwitchTS: \u001b[0m${data}\u001b[0m`)
    }
    //pendientes anuncio, clear, goal
    messageLog(message: UserState | any) {
        if (this.debug) {
            switch (message.command?.command) {
                case "CAP":
                    this.log("Request CAP Correct.");
                    break;
                case "001":
                    this.log(`connected to \u001b[31m#${message?.command?.channel}\u001b[0m chat as \u001b[35m@${this.botname}`);
                    break;
                case "421":
                    this.log(`\u001b[31mUnsupported IRC command: \u001b[33;1m${message?.command[2]}`);
                    break;
                case "RECONNECT":
                    this.log(`\u001b[31mThe Twitch IRC server is about to terminate the connection for maintenance.`);
                    break;
                case "JOIN":
                    if (message?.source?.nick?.toLocaleLowerCase() == this.botname.toLocaleLowerCase()) {
                        break;
                    }
                    else {
                        this.log(`\u001b[32m@${message?.source?.nick}\u001b[0m joined to \u001b[31m#${message?.command?.channel}\u001b[0m chat`)
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
                    this.log(`\u001b[31m${message.parameters}`);
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
                    console.log(message);
                    for (let key in message.command.roomstate) {
                        if (message.command.roomstate.hasOwnProperty(key)) {
                            const value = message?.command?.roomstate[key] || message.tags[key];
                            if(key != 'room-id'){
                                let boolValue = (key === "followers-only") ? Boolean(1+Number(value)) : Boolean(Number(value));
                                let color = boolValue ? '\u001b[32m' : '\u001b[31m'; // Verde si es verdadero, rojo si es falso
                                this.log(`\u001b[33m${key}\u001b[0m: ${color}${boolValue}\u001b[0m`);
                            }
                            else{
                                this.log(`\u001b[33m${key}\u001b[0m: \u001b[34m${value}\u001b[0m`);
                            }
                        }
                    }
                    break;
                case 'PRIVMSG':
                    this.log(`\u001b[31m${message?.command?.channel}\u001b[0m \u001b[32m@${message.source?.nick}\u001b[0m: ${message.parameters}`)
                    break;
                case 'CLEARCHAT':
                    if(!message.parameters) this.log(`${message.command.channel} Console Cleared.`)
                    else this.log(`user \u001b[32m@${message.parameters}\u001b[0m banned from \u001b[31m${message?.command?.channel}\u001b[0m channel.`)
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