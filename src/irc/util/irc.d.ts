export type EventName =
    | 'message' //ok
    | 'command' //ok
    | 'join'    //ok
    | 'notice'  //ok
    | 'ban'     // CLEARCHAT and parameters != null
    | 'clear'
    | 'host'
    | 'deleteMessage'
    | 'ping'
    | 'cap'
    | 'reconnect'
    | 'roomstate'
