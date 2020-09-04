import Helper from "./Helper";

let timer = 0

function heartBeat(do1, data, callback, timeout = 1000) {
    timer = setInterval(() => {
        // console.log(111)
        getApp().socketApi.sendSocketMessage(do1, data, callback)
    }, timeout)
}

function clearTimer() {
    clearInterval(timer)
}

function socketOnload(obj, options) {
    return true;
    if (!obj.loadI) {
        obj.loadI = 0
        Helper.showLoading()
        obj.userInfo = wx.getStorageSync('userInfo');
    }
    if (!getApp().socketApi.socketOpen) {
        if (obj.loadI > 50) {
            /*setTimeout(() => {
                obj.onLoad(options)
            }, 10)*/
            Helper.hideLoading()
            return true;
        } else {
            obj.loadI++
            setTimeout(() => {
                obj.onLoad(options)
            }, 10)
            return false;
        }
    } else {
        Helper.hideLoading()
        obj.loadI = 0
        return true;
    }
}

export {heartBeat, clearTimer, socketOnload}