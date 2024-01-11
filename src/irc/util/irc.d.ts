export type EventName =
    | 'message'         //ok
    | 'command'         //ok
    | 'join'            //ok
    | 'notice'          //ok
    | 'ban'             //ok CLEARCHAT and parameters != null
    | 'clear'           //ok
    | 'host'            // pending.
    | 'reconnect'       //
    | 'roomstate'
