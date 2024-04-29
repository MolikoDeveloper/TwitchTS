const http = require('http');

/**
 * 
 * @param clientid Your app’s client ID. See [Registering your app](https://dev.twitch.tv/docs/authentication/register-app).
 * @param secret Your app’s client secret. See [Registering your app](https://dev.twitch.tv/docs/authentication/register-app).
 * @param code The code that the **`/authorize`** response returned in the code query parameter.
 * @param redirect_uri Your app’s registered redirect URI.
 */
export async function GetRefresh_token(clientid: string|undefined, secret: string|undefined, code: string|undefined, redirect_uri: string|undefined): Promise<{ access_token: string, expires_in: number, refresh_token: string, scope: string[], token_type: string }> {
    return new Promise((resolve, reject) => {
        const _postData = `client_id=${encodeURIComponent(clientid!)}&client_secret=${encodeURIComponent(secret!)}&code=${encodeURIComponent(code!)}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;

        const _options = {
            host: 'id.twitch.tv',
            port: 443,
            path: '/oauth2/token',
            method: 'POST',
            Headers: {
                'Content-Type': 'applicationx-www-form-urlencoded'
            }
        };

        const req = http.request(_options, (res: any) => {
            let result = '';
            res.setEncoding('utf8');

            res.on('data', (chunk: any) => {
                result += chunk;
            });

            res.on('error', (error: any) => {
                reject(error);
            });

            res.on('end', () => {
                const parsed = JSON.parse(result);
                resolve(parsed)
            });
        });

        req.on('error', (er: any) => console.log(er))
        req.write(_postData);
        req.end();
    })
}

/**
 * 
 * @param clientid Your app’s client ID. See [Registering your app](https://dev.twitch.tv/docs/authentication/register-app).
 * @param secret Your app’s client secret. See [Registering your app](https://dev.twitch.tv/docs/authentication/register-app).
 * @param refresh_token The refresh token issued to the client. You must URL encode the refresh token before posting the request. If you don’t, and the token contains restricted characters, the request may fail with “Invalid refresh token”.
 */
export async function RefreshCurrentToken(clientid: string|undefined, secret: string|undefined, refreshToken: string|undefined): Promise<{ access_token: string, expires_in: number, refresh_token: string, scope: string[], token_type: string }> {
    return new Promise((resolve, reject) => {
        const _postData = `client_id=${encodeURIComponent(clientid!)}&client_secret=${encodeURIComponent(secret!)}&refresh_token=${encodeURIComponent(refreshToken!)}&grant_type=refresh_token`;

        const _options = {
            host: 'id.twitch.tv',
            port: 443,
            path: '/oauth2/token',
            method: 'POST',
            Headers: {
                'Content-Type': 'applicationx-www-form-urlencoded'
            }
        };

        const req = http.request(_options, (res: any) => {
            let result = '';
            res.setEncoding('utf8');

            res.on('data', (chunk: any) => {
                result += chunk;
            });

            res.on('error', (error: any) => {
                reject(error);
            });

            res.on('end', () => {
                const parsed = JSON.parse(result);
                resolve(parsed)
            });
        })

        req.on('error', (er: any) => console.log(er))
        req.write(_postData);
        req.end();
    })
}