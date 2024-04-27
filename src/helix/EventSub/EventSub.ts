import type { Options, actionType } from "../../util/session";
import { EventSubBase } from "./eventSubBase";
import { request } from 'http'
import { Actions, type ChannelInformation, type Cheermotes, type ExtensionTransactions } from "./util/Actions";

export class EventSub extends EventSubBase {

    constructor(options: Options) {
        super(options);
    }

    /**
     * Sends a message to the broadcaster’s chat room.
     * @param channel Broadcaster UserName 
     * @param message message content.
     * @returns sended status
     */
    public async SendChatMessage(channel: string, message: string): Promise<{ message_id: string, is_sent: boolean }[] | undefined> {
        const _channel = (await this.GetUserByName(channel))[0].id;
        const sender = (await this.GetUserByName(this.options.identity.user?.username!))[0].id;

        return await this.post('SendWhisper', {
            Body: [
                { body: 'broadcaster_id', value: _channel },
                { body: 'sender_id', value: sender },
                { body: 'message', value: message }
            ]
        }).then(d => { return d.data });
    }

    /**
     * Send a whisper message to the specified user
     * @param to UserName who the whisper is sended
     * @param message message content.
     */
    public async SendWhisper(to: string, message: string): Promise<undefined> {
        const from = (await this.GetUserByName(this.options.identity.user?.username!))[0].id;
        const _to = (await this.GetUserByName(to))[0].id;

        return await this.post('SendWhisper', {
            Query: [
                { query: 'from_user_id', value: from },
                { query: 'to_user_id', value: _to },
            ],
            Body: [
                { body: 'message', value: message }
            ]
        }).then(d => { return d.data });
    }

    /**
     * gets the color used for the user's.
     * @param UserID User ID's 
     * @returns basic data of the query user.
     */
    public async GetUserChatColor_byID(...UserID: string[]): Promise<{ user_id: string, user_name: string, user_login: string, color: string }[] | undefined> {
        return await this.post('GetUserChatColor', {
            Query: [
                { query: 'user_id', value: UserID },
            ]
        }).then(d => { return d.data });
    }

    /**
     * gets the color used for the user's.
     * @param UserName list of usernames 
     * @returns basic data of the query user.
     */
    public async GetUserChatColor(...UserName: string[]): Promise<{ user_id: string, user_name: string, user_login: string, color: string }[] | undefined> {
        let _users = (await this.GetUserByName(UserName)).map(d => d.id)

        return await this.post('GetUserChatColor', {
            Query: [
                { query: 'user_id', value: _users },
            ]
        }).then(d => { return d.data });
    }

    /**
     * Starts a commercial on the specified channel
     * @param channel channel ID.
     * @param length duration of the commercial.
     * @returns basic data of the commercial.
     */
    public async StartCommercial(channel: string, length: number = 30): Promise<{ length: number, message: string, retry_after: number }[] | undefined> {
        let _channel = (await this.GetUserByName(channel))[0].id;

        return await this.post('StartCommercial', {
            Query: [
                { query: 'broadcaster_id', value: _channel },
                { query: 'length', value: length }
            ]
        })
            .then(d => { return d.data });

    }

    /**
     * returns AD Schedule information, including snooze, when the last ad was run, when the next ad is scheduled and if the channel is currently in pre-roll free time.
     * 
     * Note that a new ad cannot be run until 8 minutes after running a previous ad.
     * @param channel Channel UserName
     * @returns 
     */
    public async GetAdSchedule(channel: string): Promise<{ next_ad_at: string, last_ad_at: string, duration: string, preroll_free_time: string, snooze_count: string, snooze_refresh_at: string }[] | undefined> {
        let _channel = (await this.GetUserByName(channel))[0].id;

        return await this.post('GetAdSchedule', { Query: [{ query: 'broadcaster_id', value: _channel }] })
            .then(d => { return d.data });
    }

    /**
     * If available, pushes back the timestamp of the upcoming automatic mid-roll ad by 5 minutes. This endpoint duplicates the snooze functionality in the creator dashboard’s Ads Manager.
     * @param channel 
     * [Snooze Next Ad](https://dev.twitch.tv/docs/api/reference/#snooze-next-ad)
     */
    public async SnoozeNextAd(channel: string): Promise<{ snooze_count: string, snooze_refresh_at: string, next_ad_at: string }[]> {
        let _channel = (await this.GetUserByName(channel))[0].id;

        return await this.post('SnoozeNextAd', { Query: [{ query: 'broadcaster_id', value: _channel }] })
            .then(d => { return d.data });
    }

    /**
     * Gets an analytics report for one or more extensions. The response contains the URLs used to download the reports (CSV files). [Learn More](https://dev.twitch.tv/docs/insights)
     */
    public async GetExtensionAnalytics(): Promise<{ data: { extension_id: string, type: string, started_at: string, ended_at: string, first: string, after: string }[], pagination: { cursor: string } }> {
        return await this.post('GetExtensionAnalytics');
    }

    /**
     * Gets an analytics report for one or more games. The response contains the URLs used to download the reports (CSV files). [Learn more](https://dev.twitch.tv/docs/insights)
     * @param game_id the game client ID, if specified, the response contains a report for the specified game.
     */
    public async GetGameAnalytics(data: { gameId?: string, type?: string, startedAt?: string, endedAt?: string, count?: number, page?: string }): Promise<{ data: { game_id: string, URL: string, type: string, date_rangue: { started_at: string, ended_at: string } }[], pagination: { cursor: string } }> {
        return await this.post('GetGameAnalytics', {
            Query: [
                { query: 'game_id', value: data.gameId },
                { query: 'type', value: data.type },
                { query: 'started_at', value: data.startedAt },
                { query: 'ended_at', value: data.endedAt },
                { query: 'first', value: data.count },
                { query: 'after', value: data.page }
            ]
        });
    }

    /**
     * Gets the Bits leaderboard for the authenticated broadcaster.
     */
    public async GetBitsLeaderboard(count?: number, period?: string, startedAt?: string, user?: string): Promise<{ total: number, date_range: { started_at: string, ended_at: string }, data: { user_id: string, user_login: string, user_name: string, rank: number, score: number }[] }> {

        return await this.post('GetBitsLeaderboard', {
            Query: [
                { query: 'count', value: count },
                { query: 'period', value: period },
                { query: 'started_at', value: startedAt },
                { query: 'user_id', value: user },
            ]
        });
    }

    /**
     * Gets a list of Cheermotes that users can use to cheer Bits in any Bits-enabled channel’s chat room. Cheermotes are animated emotes that viewers can assign Bits to.
     * @param channel The ID of the broadcaster whose custom Cheermotes you want to get. Specify the broadcaster’s ID if you want to include the broadcaster’s Cheermotes in the response (not all broadcasters upload Cheermotes). If not specified, the response contains only global Cheermotes. If the broadcaster uploaded Cheermotes, the type field in the response is set to channel_custom.
     */
    public async GetCheermotes_byID(channel?: string): Promise<{}[]> {
        return await (this.post('GetCheermotes', { Query: [{ query: 'broadcaster_id', value: channel }] })).then(d => { return d.data });
    }

    /**
     * Gets a list of Cheermotes that users can use to cheer Bits in any Bits-enabled channel’s chat room. Cheermotes are animated emotes that viewers can assign Bits to.
     * @param channel The UserName of the broadcaster whose custom Cheermotes you want to get. Specify the broadcaster’s ID if you want to include the broadcaster’s Cheermotes in the response (not all broadcasters upload Cheermotes). If not specified, the response contains only global Cheermotes. If the broadcaster uploaded Cheermotes, the type field in the response is set to channel_custom.
     */
    public async GetCheermotes(channel?: string): Promise<Cheermotes[]> {
        const _channel = channel ? (await this.GetUserByName(channel))[0].id : undefined;
        return await (this.post('GetCheermotes', { Query: [{ query: 'broadcaster_id', value: _channel }] })).then(d => { return d.data });
    }

    /**
     * [Get Extension Transactions](https://dev.twitch.tv/docs/api/reference/#get-extension-transactions)
     * 
     * Gets an extension’s list of transactions. A transaction records the exchange of a currency (for example, Bits) for a digital product.
     * @param extension_id The ID of the extension whose list of transactions you want to get.
     * @param id A transaction ID used to filter the list of transactions. Specify this parameter for each transaction you want to get. For example, ['1234', '5678']. You may specify a maximum of 100 IDs.
     * @param count  The maximum number of items to return per page in the response. The minimum page size is 1 item per page and the maximum is 100 items per page. The default is 20.
     * @param page The cursor used to get the next page of results. The Pagination object in the response contains the cursor’s value. [Read More](https://dev.twitch.tv/docs/api/guide#pagination)
     */
    public async GetExtensionTransactions(extension_id: string, id?: string | string[], count?: number, page?: number): Promise<{ data: ExtensionTransactions[], pagination: { cursor: string } }> {
        return await (this.post('GetExtensionTransactions', {
            Query: [
                { query: 'extension_id', value: extension_id },
                { query: 'id', value: id },
                { query: 'first', value: count },
                { query: 'after', value: page }
            ]
        }));
    }

    /**
     * [Get Channel Information](https://dev.twitch.tv/docs/api/reference/#get-channel-information)
     * 
     * Gets information about one or more channels.
     * @param channels Broadcaster ID's
     */
    public async GetChannelInformation_byID(...channels: string[]): Promise<{ broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, broadcaster_language: string, game_id: string, game_name: string, title: string, delay: number, tags: string[], content_classification_labels: string[], is_branded_content: boolean }> {
        return await this.post('GetChannelInformation', {
            Query: [
                { query: 'broadcaster_id', value: channels }
            ]
        }).then(d => { return d.data })
    }

    /**
     * [Get Channel Information](https://dev.twitch.tv/docs/api/reference/#get-channel-information)
     * 
     * Gets information about one or more channels.
     * @param channels Broadcaster UserName
     */
    public async GetChannelInformation(...channels: string[]): Promise<{ broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, broadcaster_language: string, game_id: string, game_name: string, title: string, delay: number, tags: string[], content_classification_labels: string[], is_branded_content: boolean }> {
        const _channels = (await this.GetUserByName(channels)).map(d => d.id);

        console.log(_channels)

        return await this.post('GetChannelInformation', {
            Query: [
                { query: 'broadcaster_id', value: _channels }
            ]
        }).then(d => { return d.data })
    }

    /**
     * [Modify Channel Information](https://dev.twitch.tv/docs/api/reference/#modify-channel-information)
     * 
     * Updates a channel’s properties.
     * @param channel The UserName of the broadcaster whose channel you want to update. This Username must match the user Username in the user access token.
     * @param info All fields are optional, but you must specify at least one field.
     */
    public async ModifyChannelInformation(channel: string, info: ChannelInformation): Promise<undefined> {
        const _channel = (await this.GetUserByName(channel))[0].id;

        return await this.post('ModifyChannelInformation', {
            Query: [{ query: 'broadcaster_id', value: _channel }],
            Body: [
                { body: 'game_id', value: info.game_id },
                { body: 'broadcaster_language', value: info.broadcasterLanguage },
                { body: 'title', value: info.title },
                { body: 'delay', value: info.delay },
                { body: 'tags', value: info.tags },
                { body: 'is_branded_content', value: info.isBrandedContent },
                { body: 'content_classification_labels', value: info.contentClassificationLabels }
            ]
        });
    }


    /**
     * [Modify Channel Information](https://dev.twitch.tv/docs/api/reference/#modify-channel-information)
     * 
     * Updates a channel’s properties.
     * @param channel The UserName of the broadcaster whose channel you want to update. This Username must match the user Username in the user access token.
     * @param info All fields are optional, but you must specify at least one field.
     */
    public async ModifyChannelInformation_byID(channel: string, info: ChannelInformation): Promise<undefined> {
        return await this.post('ModifyChannelInformation', {
            Query: [{ query: 'broadcaster_id', value: channel }],
            Body: [
                { body: 'game_id', value: info.game_id },
                { body: 'broadcaster_language', value: info.broadcasterLanguage },
                { body: 'title', value: info.title },
                { body: 'delay', value: info.delay },
                { body: 'tags', value: info.tags },
                { body: 'content_classification_labels', value: info.contentClassificationLabels }
            ]
        });
    }

    /**
    * [Get Channel Editors](https://dev.twitch.tv/docs/api/reference/#get-channel-editors)
    * 
    * Gets the broadcaster’s list editors.
    * Requires a user access token that includes the channel:read:editors scope.
    * @param channel the username of the broadcaster that owns the channel. this must match with the username in the access token.
    * @returns 
    */
    public async GetChannelEditors_byID(channel: string): Promise<{ user_id: string, user_name: string, created_at: string }[]> {
        return (await this.post('GetChannelEditors', {
            Query: [
                { query: 'broadcaster_id', value: channel }
            ]
        })).then((d: { data: any }) => { return d.data })
    }

    /**
     * [Get Channel Editors](https://dev.twitch.tv/docs/api/reference/#get-channel-editors)
     * 
     * Gets the broadcaster’s list editors.
     * Requires a user access token that includes the channel:read:editors scope.
     * @param channel the username of the broadcaster that owns the channel. this must match with the username in the access token.
     * @returns 
     */
    public async GetChannelEditors(channel: string): Promise<{ user_id: string, user_name: string, created_at: string }[]> {
        const _channel = (await this.GetUserByName(channel))[0].id;
        return (await this.post('GetChannelEditors', {
            Query: [
                { query: 'broadcaster_id', value: _channel }
            ]
        })).then((d: { data: any }) => { return d.data })
    }

    /**
     * [Get Followed Channels](https://dev.twitch.tv/docs/api/reference/#get-followed-channels)
     * 
     * Gets a list of broadcasters that the specified user follows. You can also use this endpoint to see whether a user follows a specific broadcaster.
     * @param user Username. Returns the list of broadcasters that this user follows. This Username must match the user Username in the user OAuth token.
     * @param count The maximum number of items to return per page in the response. The minimum page size is 1 item per page and the maximum is 100. The default is 20.
     * @returns 
     */
    public async GetFollowedChannels(channel?: string, count?: number, page?: string): Promise<{ data: { broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, followed_at: string }[], total: number, pagination: { cursor: string } }> {
        const _user = (await this.GetUserByName((this.options.identity.user?.username!)))[0].id;
        const _channel = channel ? (await this.GetUserByName(channel))[0].id : undefined;

        return await this.post('GetFollowedChannels', {
            Query: [
                { query: 'user_id', value: _user },
                { query: 'broadcaster_id', value: _channel },
                { query: 'first', value: count },
                { query: 'after', value: page },
            ]
        })
    }

    /**
     * [Get Channel Followers](https://dev.twitch.tv/docs/api/reference/#get-channel-followers)
     * 
     * Gets a list of broadcasters that the specified user follows. You can also use this endpoint to see whether a user follows a specific broadcaster.
     * @param channel The broadcaster username. Returns the list of users that follow this broadcaster.
     * @param user Use this parameter to see whether the user follows this broadcaster. If specified, the response contains this user if they follow the broadcaster. If not specified, the response contains all users that follow the broadcaster. requires `moderator:read:followes`
     * @param count The maximum number of items to return per page in the response. The minimum page size is 1 item per page and the maximum is 100. The default is 20.
     * @param page The cursor used to get the next page of results. The Pagination object in the response contains the cursor’s value. [Read more](https://dev.twitch.tv/docs/api/guide#pagination).
     */
    public async GetChannelFollowers(channel: string, user?: string, count?: number, page?: string): Promise<{ total: number, pagination: { cursor: string }, data: { broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, followed_at: string }[] }> {
        const _channel = (await this.GetUserByName(channel))[0].id;
        let _user = user ? (await this.GetUserByName((user)))[0].id : undefined;

        return await this.post('GetChannelFollowers', {
            Query: [
                { query: 'broadcaster_id', value: _channel },
                { query: 'user_id', value: _user },
                { query: 'first', value: count },
                { query: 'after', value: page }
            ]
        });
    }

    /**
     * [Get Channel Followers](https://dev.twitch.tv/docs/api/reference/#get-channel-followers)
     * 
    * Gets a list of broadcasters that the specified user follows. You can also use this endpoint to see whether a user follows a specific broadcaster.
    * @param channel The broadcaster ID. Returns the list of users that follow this broadcaster.
    * @param user Use this parameter to see whether the user follows this broadcaster. If specified, the response contains this user if they follow the broadcaster. If not specified, the response contains all users that follow the broadcaster. requires `moderator:read:followes`
    * @param count The maximum number of items to return per page in the response. The minimum page size is 1 item per page and the maximum is 100. The default is 20.
    * @param page The cursor used to get the next page of results. The Pagination object in the response contains the cursor’s value. [Read more](https://dev.twitch.tv/docs/api/guide#pagination).
    */
    public async GetChannelFollowers_byID(channel: string, user?: string, count?: number, page?: string): Promise<{ total: number, pagination: { cursor: string }, data: { broadcaster_id: string, broadcaster_login: string, broadcaster_name: string, followed_at: string }[] }> {
        return await this.post('GetChannelFollowers', {
            Query: [
                { query: 'broadcaster_id', value: channel },
                { query: 'user_id', value: user },
                { query: 'first', value: count },
                { query: 'after', value: page }
            ]
        });
    }

    public async CreateCustomRewards(channel: string, title: string, cost: number, promp?: string, isenabled?: boolean, backgroundColor?: boolean, IsUserInputRequired?: boolean, MaxPerStream?: number, MaxPerUserStream?: number, GlobalCoolDownSeconds?: number, ShouldRedemptionsSkipRequestQueue?: boolean): Promise<{}[]> {
        const _channel = (await this.GetUserByName(channel))[0].id;

        let _MaxPerStreamEnabled: boolean = false;
        let _MaxPerUserStreamEnabled: boolean = false;
        let _GlobalCooldownEnabled: boolean = false;

        if (MaxPerStream || MaxPerStream! > 0) _MaxPerStreamEnabled = true;
        if (MaxPerUserStream || MaxPerUserStream! > 0) _MaxPerUserStreamEnabled = true;
        if (GlobalCoolDownSeconds || GlobalCoolDownSeconds! > 0) _GlobalCooldownEnabled = true;

        return await this.post('CreateCustomRewards', {
            Query: [
                { query: 'broadcaster_id', value: _channel }
            ],
            Body: [
                { body: 'title', value: title },
                { body: 'cost', value: cost },
                { body: 'prompt', value: promp },
                { body: 'is_enabled', value: isenabled },
                { body: 'background_color', value: backgroundColor },
                { body: 'is_user_input_required', value: IsUserInputRequired },
                { body: 'is_max_per_stream_enabled', value: _MaxPerStreamEnabled },
                { body: 'max_per_stream', value: MaxPerStream },
                { body: 'is_max_per_user_per_stream_enabled', value: _MaxPerUserStreamEnabled },
                { body: 'max_per_user_per_stream', value: MaxPerUserStream },
                { body: 'is_global_cooldown_enabled', value: _GlobalCooldownEnabled },
                { body: 'global_cooldown_seconds', value: GlobalCoolDownSeconds },
                { body: 'should_redemptions_skip_request_queue', value: ShouldRedemptionsSkipRequestQueue },
            ]
        }).then(d => {
            return d.data;
        })
    }

    /**
     * [Get Channel Chat Badges](https://dev.twitch.tv/docs/api/reference/#get-channel-chat-badges)
     * 
     * Gets the broadcaster’s list of custom chat badges. The list is empty if the broadcaster hasn’t created custom chat badges. For information about custom badges, see [subscriber badges](https://help.twitch.tv/s/article/subscriber-badge-guide) and [Bits badges](https://help.twitch.tv/s/article/custom-bit-badges-guide).
     * @param channel The Username of the broadcaster whose chat badges you want to get.
     */
    public async GetChannelChatBadges(channel: string): Promise<[{ set_id: string, versions: [{ id: string, image_url_1x: string, image_url_2x: string, image_url_4x: string, title: string, description: string, click_action: string, click_url: string }] }]> {
        const _channel = (await this.GetUserByName(channel))[0].id;
        return await this.post('GetChannelChatBadges', {
            Query: [
                { query: 'broadcaster_id', value: _channel }
            ]
        }).then(d => {
            return d.data;
        });
    }

    /**
     * [Get Global Chat Badges](https://dev.twitch.tv/docs/api/reference/#get-global-chat-badges)
     * 
     * Gets Twitch’s list of chat badges, which users may use in any channel’s chat room. For information about chat badges, see [Twitch Chat Badges Guide](https://help.twitch.tv/s/article/twitch-chat-badges-guide).
     */
    public async GetGlobalChatBadges(): Promise<[{ set_id: string, versions: [{ id: string, image_url_1x: string, image_url_2x: string, image_url_4x: string, title: string, description: string, click_action: string, click_url: string }] }]> {
        return await this.post('GetGlobalChatBadges').then(d => {
            return d.data;
        });
    }

    /**
     * [Get Chatters](https://dev.twitch.tv/docs/api/reference/#get-chatters).
     * 
     * Gets the list of users that are connected to the broadcaster’s chat session.
     * NOTE: There is a delay between when users join and leave a chat and when the list is updated accordingly.
     * To determine whether a user is a moderator or VIP, use the [Get Moderators](https://dev.twitch.tv/docs/api/reference#get-moderators) and [Get VIPs](https://dev.twitch.tv/docs/api/reference#get-vips) endpoints. You can check the roles of up to 100 users.
     * 
     * Requires a user access token that includes the `moderator:read:chatters` scope.
     * 
     * @param channel The Username of the broadcaster whose list of chatters you want to get.
     * @param count The maximum number of items to return per page in the response, the minimum by default is 20. the maximum is 100.  
     * @param page the cursor used to get the next page of result. this value is responsed in { pagination: { cursor : "" } }
     */
    public async GetChatters(channel: string, count?: number, page?: string): Promise<{ data: { user_id: string, user_login: string, user_name: string }[], pagination: { cursor: string }, total: number }> {
        const _channel = (await this.GetUserByName(channel))[0].id;
        const _moderator = (await this.GetUserByName(this.options.identity.user?.username!))[0].id;

        return await this.post('GetChatters', {
            Query: [
                { query: 'broadcaster_id', value: _channel },
                { query: 'moderator_id', value: _moderator },
                { query: 'first', value: count },
                { query: 'after', value: page }
            ]
        })
    }

    /**
     * [Get Moderators](https://dev.twitch.tv/docs/api/reference/#get-moderators)
     * 
     * Gets all users allowed to moderate the broadcaster’s chat room.
     * ### Authorization
     * requires a user access token that includes **moderation:read** scope or **channel:manage:moderators** if your app edits the moderators.
     * 
     * @param channel The Username of the broadcaster whose list of chatters you want to get.
     * @param user Filters the list for specific Moderators. To specify more than one user, include the **user** parameter for each user to get as an array.
     * @param count The maximum number of items to return per page in the response, the minimum by default is 20. the maximum is 100.  
     * @param page the cursor used to get the next page of result. this value is responsed in { pagination: { cursor : "" } }
     */
    public async GetModerators(channel: string, user?: string | string[], count?: number, page?: string): Promise<{ data: { user_id: string, user_login: string, user_name: string }[], pagination: { cursor: string } }> {
        const _channel = (await this.GetUserByName(channel))[0].id;

        if (Array.isArray(user)) {
            const _users = user ? (await this.GetUserByName(user)).map(d => d.id) : undefined;

            return await this.post('GetModerators', {
                Query: [
                    { query: 'broadcaster_id', value: _channel },
                    { query: 'user_id', value: _users },
                    { query: 'first', value: count },
                    { query: 'after', value: page }
                ]
            });
        }
        else {
            const _user = user ? (await this.GetUserByName(user))[0].id : undefined;
            return await this.post('GetModerators', {
                Query: [
                    { query: 'broadcaster_id', value: _channel },
                    { query: 'user_id', value: _user },
                    { query: 'first', value: count },
                    { query: 'after', value: page }
                ]
            });
        }
    }

    /**
    * [Get Moderators](https://dev.twitch.tv/docs/api/reference/#get-moderators) 
    * 
    * Gets a list of the broadcaster’s VIPs.
    * ### Authorization
    * Requires a user access token that includes the channel:read:vips scope. If your app also adds and removes VIP status, you can use the channel:manage:vips scope instead.
    * 
    * @param channel The Username of the broadcaster whose list of chatters you want to get.
    * @param user Filters the list for specific Vips. To specify more than one user, include the **user** parameter for each user to get as an array.
    * @param count The maximum number of items to return per page in the response, the minimum by default is 20. the maximum is 100.  
    * @param page the cursor used to get the next page of result. this value is responsed in { pagination: { cursor : "" } }
    */
    public async GetVips(channel: string, user?: string | string[], count?: number, page?: string): Promise<{ data: { user_id: string, user_login: string, user_name: string }[], pagination: { cursor: string } }> {
        const _channel = (await this.GetUserByName(channel))[0].id;

        if (Array.isArray(user)) {
            const _users = user ? (await this.GetUserByName(user)).map(d => d.id) : undefined;
            return await this.post('GetVips', {
                Query: [
                    { query: 'broadcaster_id', value: _channel },
                    { query: 'user_id', value: _users },
                    { query: 'first', value: count },
                    { query: 'after', value: page }
                ]
            });
        }
        else {
            const _user = user ? (await this.GetUserByName(user))[0].id : undefined;
            return await this.post('GetVips', {
                Query: [
                    { query: 'broadcaster_id', value: _channel },
                    { query: 'user_id', value: _user },
                    { query: 'first', value: count },
                    { query: 'after', value: page }
                ]
            });
        }
    }

    public async GetGames_ByName(name: string): Promise<{ id: string, name: string, box_art_url: string, igdb_id: string }[]> {
        return await this.post('GetGames', {
            Query: [
                { query: 'name', value: name }
            ]
        }).then(d => d.data.length > 0 ? d.data : undefined);
    }

    private async post(action: actionType, data?: { Query?: { query: string, value: any[] | any }[], Body?: { body: string, value: any[] | any }[] }): Promise<any> {
        return new Promise((resolve, reject) => {
            const actionConfig = Actions.find(a => a.action == action)!;
            let url = actionConfig?.param.Subscription!;
            let postData = {};

            if (!actionConfig) {
                reject(`action ${this.log.Color.BrightColor.Green}${action}${this.log.Color.BrightColor.White} not found`);
                return;
            }
            if (actionConfig.param.scope)
                if (!this.options.identity.app?.actions?.find(d => d === action)) {
                    reject(`action ${this.log.Color.BrightColor.Green}${action}${this.log.Color.BrightColor.White} is not listed in Options.identity.app.actions`);
                    return;
                }

            if (data) {
                if (data.Query) {
                    url += '?';

                    data.Query.forEach(d => {
                        if (!actionConfig?.param.query!.find(q => q === d.query))
                            reject(`Parameter ${this.log.Color.BrightColor.Red}${d.query}${this.log.Color.BrightColor.White} does not exist.`);

                        if (d.value)
                            if (Array.isArray(d.value)) {
                                d.value.forEach(data => {
                                    url += `&${d.query}=${data}`;
                                })
                            }
                            else {
                                url += `&${d.query}=${d.value}`;
                            }
                    });

                    // @ts-ignore
                    url = url.replace('?&', '?');
                }

                if (data.Body) {
                    postData = data.Body.reduce((acc: any, item) => {
                        if (!actionConfig.param.body!.find(i => i === item.body)) {
                            reject(`${item.body} does not exist.`);
                            return;
                        }

                        acc[item.body] = item.value;
                        return acc;
                    }, {});
                }
            }

            const _options = {
                hostname: 'api.twitch.tv',
                port: 443,
                path: url,
                method: actionConfig.param.method,
                headers: {
                    'Authorization': `Bearer ${this.options.identity.user?.token}`,
                    'Client-Id': this.options.identity.app?.clientId,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(postData))
                }
            };

            const req = request(_options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                })
                res.on('end', () => {
                    switch (res.statusCode) {
                        case 200:
                            this.log.log(`${this.log.Color.color.Yellow}${action}${this.log.Color.Reset} success.`);
                            resolve(JSON.parse(data));
                            break;
                        case 204:
                            this.log.log(`${this.log.Color.color.Yellow}${action}${this.log.Color.Reset} success.`);
                            break;

                        case 401:
                            const err = JSON.parse(data);
                            this.log.log(`${this.log.Color.color.Yellow}${err.status}${this.log.Color.Reset}(${this.log.Color.color.Red}${err.error}${this.log.Color.Reset}) ${err.message}`);
                            break;
                        default:
                            this.log.log(`Request to ${this.log.Color.color.Yellow}${action}${this.log.Color.Reset} failed with ${res.statusCode}: ${res.statusMessage}`);
                            reject(res.statusCode);
                            break;
                    }
                })
            });

            req.on('error', (error) => {
                this.log.log(`Error with request: ${error.message}`);
            });

            req.write(JSON.stringify(postData));
            req.end();
        })
    }
}