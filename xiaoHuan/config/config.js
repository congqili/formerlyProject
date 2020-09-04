let env = __wxConfig.envVersion;
// env = 'release'

let AppConfig = {
    env      : env,
    aesKey   : 'BEPmXM9E6Ep49vKX',
    iv       : 'flV8QTsD7az8SvF5',
    apiUrl   : 'https://' + (env === 'release' ? 'm' : 'test') + '.iyizhanke.com/api/',
    wssUrl   : 'wss://xcx.iyizhanke.com:' + (env === 'release' ? 2345 : 8345),
    //wssUrl   : 'ws://127.0.0.1:2345',
    fontUrl  : 'https://cdn.iyizhanke.com/static/font/PingFang_SC_Regular.ttf',
    liveAppID: '1302305135',
}

module.exports = {AppConfig}