import type { Options } from "../../util/session";
import { EventSubBase } from "./eventSubBase";

export class EventSub extends EventSubBase {

    constructor(options: Options) {
        super(options);
    }

    public async send(channel: string, sender: string, message: string): Promise<object> {
        if (!this.options.identity.app?.actions!.includes('SendChatMessage'))
            this.log.log(`action ${this.log.Color.color.Yellow}SendChatMessage ${this.log.Color.Reset}Required to send messages.`)
        if (channel.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(${this.log.Color.color.Red}channel${this.log.Color.Reset}, sender, message); => cannot be empty (broadcaster_id or username).`);
        if (sender.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, ${this.log.Color.color.Red}sender${this.log.Color.Reset}, message); => cannot be empty (user_id or username).`);
        if (message.replace('\s+', '') === '') this.log.log(`${this.log.Color.color.Green}send${this.log.Color.Reset}(channel, sender,${this.log.Color.color.Red} message${this.log.Color.Reset}); => cannot be empty.`);
        return {}
    }

    public async whisper(from: string, to: string, message: string) {
        
    }
}