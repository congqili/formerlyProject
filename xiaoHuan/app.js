import {SocketApi} from './utils/webSoket'
import Helper from "./utils/Helper";
//app.js
import extend from './mp-extend/index.js'
import mpExtend from "./mp-extend/mp-extend";
import Navigate from "./utils/Navigate";
import {userGet} from "./api/user";
import {AppConfig} from './config/config'
import {getConfig} from './api/common'

App       = extend.App
Page      = extend.Page
Component = extend.Component

mpExtend({
    Page: {
        inited  : false,
        userInfo: {},
        onLoad(options) {
            if (this.inited) return;
            this.inited = true;

            this.userInfo     = wx.getStorageSync('userInfo') || {};
            this.setData({CommonUserLevel: this.userInfo.user_level || 0})
            this.setData({CommonConfig: wx.getStorageSync('CommonConfig') || {}})

            let top = wx.getMenuButtonBoundingClientRect().top
            let statusBar = wx.getSystemInfoSync().statusBarHeight
            this.setData({barTop:Helper.toRpx(top),statusBar:Helper.toRpx(statusBar)})

            wx.getStorageInfo({
                success: (res) => {
                    for (let i = 0; i < res.keys.length; i++) {
                        let key = res.keys[i]
                        if (key.indexOf(this.route) === 0) {
                            wx.getStorage({
                                key    : key,
                                success: (res) => {
                                    let name = key.replace(this.route + "-", "")
                                    if (res) this.setData({[name]: res.data})
                                }
                            })
                        }
                    }
                }
            })

            if (wx.getStorageSync('userToken') === '') {
                if (this.route.indexOf('login/login') === -1) {
                    if (this.route.indexOf('index/index') === -1) {
                        return Navigate.login().redirect()
                    }
                }
            } else {
                if (this.route.indexOf('member/member') === -1) {
                    userGet().then(res => {
                        if (res.status) {
                            this.userInfo = res.info;
                            this.setData({CommonUserLevel: this.userInfo.user_level || 0})
                        }
                        wx.setStorage({
                            key : 'userInfo',
                            data: res.info || {}
                        })
                    })
                }
            }

            getConfig().then((res) => {
                this.setData({CommonConfig: res.info})
                wx.setStorage({
                    key : "CommonConfig",
                    data: res.info
                })
            })

            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })
            updateManager.onUpdateReady(function() {
                wx.showModal({
                    title  : '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })
            updateManager.onUpdateFailed(function() {
                // 新版本下载失败
            })

            /*console.log('加载服务端字体');
            wx.loadFontFace({
                //global : true,
                family: 'font',
                source: 'url("' + AppConfig.fontUrl + '")'
            })*/
        },
        appendData(keyName, data, callback) {
            callback = typeof callback === "function" ? callback : () => {

            }
            if (typeof data !== "object" || typeof data.length !== "number") return
            if (typeof this.data[keyName] !== "object" || typeof this.data[keyName].length !== "number") return
            let length    = this.data[keyName].length
            let newLength = data.length
            if (newLength <= 0) return callback()
            let complete = 0
            for (let i = 0; i < newLength; i++) {
                this.setData({
                    [keyName + '[' + (length + i) + ']']: data[i]
                }, () => {
                    complete++
                    if (complete >= newLength) callback()
                })
            }
        },
        setDataStorage(obj, callback) {
            this.setData(obj, callback)
            Object.keys(obj).forEach((key) => {
                wx.setStorage({
                    key : this.route + "-" + key,
                    data: obj[key]
                })
            })
        }
    }
})

App({
    scene     : {},
    socketApi : null,
    globalData: {
        msg: {}
    },
    shareId   : 0,
    onLaunch(options) {
        switch (AppConfig.env) {
            case 'trial': //体验版环境
                break;
            case 'release': //线上环境
                break;
            default: //测试版环境
                wx.setStorageSync('userToken', 'EuWSkML9dQ8Q3s2Y-XHuan-1617')
                break;
        }
        // wx.setStorageSync('userToken', 'EuWSkML9dQ8Q3s2Y-XHuan-917')

        //定义全局的长连接对象
        this.socketApi = new SocketApi()
        // this.socketApi.setDo('integral', (res) => {
        //     for (let i = 0; i < getCurrentPages().length; i++) {
        //         getCurrentPages()[i].Notify(res)
        //     }
        // })
        setInterval(() => {
            if (getApp().socketApi.socketOpen) {
                this.socketApi.sendSocketMessage('heartbeat', {}, () => {
                    console.log(555)
                })
            }
        }, 1000)

        if (options && options.query) {
            this.parseQuery(options.query)
        }
    },
    parseQuery(query) {
        let params = {};
        if (!query) return params
        if (query.share_id) {
            wx.setStorageSync('share_id', query.share_id)
            this.shareId = query.share_id;
        }
        if (query.scene) {
            query.scene    = decodeURIComponent(query.scene)
            let queryParts = query.scene.split('/');
            queryParts.map(function(item) {
                let a        = item.split('@')
                params[a[0]] = a[1]
            })
            if (params.si) {
                wx.setStorageSync('share_id', params.si)
                this.shareId = params.si;
            }
        }
        return params;
    }
})