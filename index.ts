declare module 'twitchts';
import { EventSub } from './src/helix/EventSub/EventSub';
import { IrcBase } from './src/irc/IrcBase';
import { type Options } from './src/util/session';

export {
    IrcBase as IrcClient,
    EventSub
};
export type { Options };