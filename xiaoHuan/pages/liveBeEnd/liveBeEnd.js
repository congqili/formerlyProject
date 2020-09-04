import {getLive, getSelfLive} from '../../api/live'
import {errMsg, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Navigate from '../../utils/Navigate'

Page({
    data: {
        //主播信息
        streamerInfo: {},
        //直播间数据
        streamData: {},
        //停止后的直播间信息
        stopLiveInfo:{}
    },
    onLoad() {
        if (!socketOnload(this)) return

        this.setData({stopLiveInfo:wx.getStorageSync('stopLiveInfo')})
        this.getSelfInfo()
    },
    navBack() {
        Navigate.back()
    },
    getSelfInfo() {
        getSelfLive().then(res => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            let id = res.info.id
            getLive({id}).then(infoRes => {
                if(!infoRes.status){
                    return Helper.showError(infoRes.msg)
                }
                this.setData({
                    streamerInfo: infoRes.info.live_user_data,
                    streamData: infoRes.info.live_stream_data
                })
            })
        })
    },
    Notify(data){
        showNotify(data)
    }
})