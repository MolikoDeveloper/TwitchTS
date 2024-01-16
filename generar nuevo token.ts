const http = require('http')
import secret from './secrets.json'


function RefreshToken() {
    return new Promise((resolve, reject)=>{
        const _postData = `client_id=${encodeURIComponent(secret.identity.app.ClientID)}&client_secret=${encodeURIComponent(secret.identity.app.Secret)}&refresh_token=${encodeURIComponent(secret.identity.user.refreshToken)}&grant_type=refresh_token`;;

        const _options = {
            host: 'id.twitch.tv',
            port: 443,
            path: '/oauth2/token',
            method: 'POST',
            Headers: {
                'Content-Type': 'applicationx-www-form-urlencoded'
            }
        };
    
        let resu = ''
        const req = http.request(_options, (res:any) => {
            let result = '';
            res.setEncoding('utf8'),
                res.on('data', (chunk:any) => {
                    result += chunk;
                    resu += chunk;
                });
            res.on('error', (error:any) => {
                //console.log(error);
            })
            res.on('end', () => {
                const parsed = JSON.parse(result);
                resolve(parsed)
            })
        })
    
        req.on('error', (er:any) => console.log(er))
        req.write(_postData);
        req.end();
    })
}



RefreshToken().then((data:any)=>{
    console.log(data)
});