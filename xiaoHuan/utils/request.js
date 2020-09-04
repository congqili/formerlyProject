//原生request的封装
import {decrypt, encrypt} from './crypto'
import {AppConfig} from '../config/config'
import Helper from "./Helper";

class Request {
    get(url, data, formType = true) {
        if (getApp().socketApi.socketOpen) {
            return this.socketRequest(url, data, "_get")
        } else {
            return this.request('GET', AppConfig.apiUrl + url, data, formType)
        }
    }

    put(url, data, formType = true) {
        if (getApp().socketApi.socketOpen) {
            return this.socketRequest(url, data, "_put")
        } else {
            return this.request('PUT', AppConfig.apiUrl + url, data, formType)
        }
    }

    delete(url, data, formType = true) {
        if (getApp().socketApi.socketOpen) {
            return this.socketRequest(url, data, "_delete")
        } else {
            return this.request('DELETE', AppConfig.apiUrl + url, data, formType)
        }
    }

    post(url, data, formType = true) {
        // console.log(url);
        if (getApp().socketApi.socketOpen) {
            return this.socketRequest(url, data, "_post")
        } else {
            return this.request('POST', AppConfig.apiUrl + url, data, formType)
        }
    }

    request(method, url, data, formType = true) {
        return new Promise((resolve, reject) => {
            var contentType = formType ? 'application/x-www-form-urlencoded' : 'application/json'
            //console.log(contentType)
            var params = {
                time: (new Date()).valueOf(),
                data: data || {}
            }

            wx.request({
                url: url,
                method: method,
                data: {encrypted: encrypt(params, AppConfig.aesKey, AppConfig.iv)},
                enableHttp2: true,
                enableQuic : true,
                header: {
                    "Authorization": "Bearer " + wx.getStorageSync('userToken'),
                    "content-type": contentType
                },
                success(res) {
                    resolve(decrypt(res.data, AppConfig.aesKey, AppConfig.iv))
                },
                fail(err) {
                    Helper.hideLoading()
                    reject(err)
                }
            })
        })
    }

    socketRequest(url, data, type) {
        // console.log(url)
        return new Promise((resolve, reject) => {
            getApp().socketApi.sendSocketMessage(url.replace("/", "_") + type, data, (res) => {
                resolve(res)
            })
        })
    }
}

module.exports = new Request()
/*
get
post
put
delete

*/