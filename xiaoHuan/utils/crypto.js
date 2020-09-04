const CryptoJS = require('crypto-js')

function encrypt(data, key, iv) {
    data = typeof data != "object" ? {}: data;
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv  = CryptoJS.enc.Utf8.parse(iv);
    data.auth = CryptoJS.AES.encrypt(data.time.toString(), key, {
        iv     : iv,
        mode   : CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString();
    data = JSON.stringify(data);
    var str    = CryptoJS.enc.Utf8.parse(data);
    var base64 = CryptoJS.enc.Base64.stringify(str);
    return base64;
}

//解密方法
function decrypt(str, key, iv) {
    var words    = CryptoJS.enc.Base64.parse(str);
    var parseStr = words.toString(CryptoJS.enc.Utf8);
    if(!parseStr) return false;
    var data = JSON.parse(parseStr);
    if (typeof data !== "object" && typeof data.status !== "boolean") return false;
    return data;
}

export {encrypt, decrypt}