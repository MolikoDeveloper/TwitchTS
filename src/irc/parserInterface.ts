
export interface UserState {
    tags?: Tag;
    source?: Source;
    command?: Command;
    parameters?: string;
}
export interface Command {
    command?: string;
    isCapRequestEnabled?: boolean;
    channel?: string;
    isBotCommand?: boolean;
    botCommand?: string;
    botCommandParams?: string[];
}

export interface Source {
    nick?: string;
    host?: string;
}
export interface Tag {
    'badge-info'?: any;
    badges?: Badges;
    color?: string;
    'display-name'?: string;
    'emote-sets'?: string[];
    mod?: string;
    subscriber?: string;
    'user-type'?: string;
    emotes?: Emote;
    'first-msg'?: string;
    id?: string;
    'returning-chatter'?: string;
    'room-id'?: string;
    'tmi-sent-ts'?: string;
    turbo?: string;
    'user-id'?: string;
}
export interface Badges {
    moderator?: string;
    broadcaster?: string;
    turbo?: string;
}
interface Position {
    startPosition: string;
    endPosition: string;
  }
  
  interface Emote {
    [key: string]: Position[];
  }