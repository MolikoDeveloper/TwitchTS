export enum WebSocketPaths {
    EventSub = "wss://eventsub.wss.twitch.tv/ws",
    EventSubLocalTest = "ws://127.0.0.1:8080/ws"
};

export enum RequestHosts {
    BaseAPI = "api.twitch.tv",
    BaseAPILocalTest = "127.0.0.1"
};

export interface UserInfo {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    created_at: string
}