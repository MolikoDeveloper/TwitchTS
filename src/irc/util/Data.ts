
export interface UserState {
    tags?: Tag;
    source?: Source;
    command?: Command;
    parameters?: string;
    profanity?: boolean;
}
export interface Command {
    command?: string;
    isCapRequestEnabled?: boolean;
    channel?: string;
    roomstate?: RoomState;
    isBotCommand?: boolean;
    botCommand?: string;
    botCommandParams?: string[];
}

export interface Source {
    nick?: string;
    host?: string;
    isbot?: Boolean;
}

export interface Tag {
    'badge-info'?: any;
    badges?: Badges;
    'ban-duration':string;
    color?: string;
    'display-name'?: string;
    'emote-sets'?: string[];
    mod?: string;
    subscriber?: string;
    'user-type'?: string;
    emotes?: Emote;
    'first-msg'?: string;
    'msg-id': string;
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

export interface RoomState{
    "emote-only"?: string|undefined,
    "followers-only"?: string|undefined,
    r9k?: string|undefined,
    "room-id"?: string|undefined,
    slow?: string|undefined,
    "subs-only"?: string|undefined,
}