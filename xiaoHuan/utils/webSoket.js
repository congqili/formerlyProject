import {AppConfig} from '../config/config'
import {decrypt, encrypt} from './crypto'


function SocketApi() {
    let that = this
    that.socketOpen = false
    that.listener = {}
    that.id = 1
    that.dos = []
    //发送消息
    this.sendSocketMessage = function (do1, data, callback) {
        if(!that.socketOpen) return;
        that.id++
        let messageId = that.id // 唯一不重复
        // console.log(do1)

        if (!data || typeof data != 'object') {
            data = []
        }

        // console.log(data)
        let msg = {
            message_id: messageId,
            do: do1,
            time: new Date().getTime(),
            token: wx.getStorageSync('userToken'),
            data: data
        }
        // console.log(msg)
        // console.log(JSON.stringify(msg))
        let message = encrypt(msg, AppConfig.aesKey, AppConfig.iv)
        // console.log(message)
        that.listener[messageId] = callback

        if (that.socketOpen) {
            // that.startTime = new Date().getTime()
            that.ws.send({
                data: message
            })
        }
    }

    //关闭回调

    this.setDo = function (type,callback) {
        this.dos[type] = callback
    }

    //关闭连接的方法
    this.close = function () {
        if (that.socketOpen) {
            that.ws.close()
        }
    }
    let newOpen = function(timeout=100){
        that.socketOpen = false
        function initSocket() {
            that.ws = wx.connectSocket({
                url: AppConfig.wssUrl
            })
            // 连接关闭
            that.ws.onClose(newOpen)
            //打开连接
            that.ws.onOpen(() => {
                that.socketOpen = true
            })
            that.ws.onMessage((res) => {
                let data
                //错误处理
                if (!res.data) return;
                if (!(data = decrypt(res.data, AppConfig.aesKey, AppConfig.iv))) return;
                // console.log(data)
                // that.endTime = new Date().getTime()
                // console.log(that.endTime - that.startTime)
                // console.log(data)
                if(that.dos[data.do] && typeof that.dos[data.do] == 'function'){
                    that.dos[data.do](data)
                }
                else if (typeof that.listener[data.message_id] == 'function') {
                    that.listener[data.message_id](data)
                }
            })
            that.errNum = 0
            that.ws.onError(() => {
                that.errNum++
                if(that.errNum > 5){
                    that.ws.close()
                }
            })
        }
        if(timeout==0){
            initSocket()
        }else{
            setTimeout(initSocket,timeout)
        }
    }

    newOpen(0)
};

export {SocketApi}
