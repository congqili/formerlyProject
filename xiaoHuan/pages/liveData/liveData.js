import {getStreamFlow} from "../../api/live";
import {userGet} from "../../api/user";
import {computedTime, errMsg, showNotify, timeFilter} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import Share from "../../utils/Share";

Page({
    data:{
        //直播流id
        flowId:'',
        //用户信息
        userInfo:{},
        //直播流信息
        streamInfo:{}
    },
    path: 'pages/liveData/liveData',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (this.isInit) return
        this.isInit = true

        this.data.flowId = options.id

        if (!this.userInfo || this.userInfo.user_streamer == 0) {
            Navigate.memberVip('push').setFailMsg('您还不是主播').launch()
        } else {
            this.setData({
                nickname: this.userInfo.user_nickname,
                head    : this.userInfo.user_head
            })
            this.getStreamFlow()
        }
    },
    onLoad(options){
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //获取直播流
    getStreamFlow(){
        getStreamFlow({stream_id:this.data.flowId}).then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            if(!res.status) {
                Helper.showError(res.msg)
                return setTimeout(Navigate.back, 1500)
            }

            res.info.timer = timeFilter(res.info.ls_start_time,res.info.ls_stop_time)
            res.info.longTime = computedTime(res.info.ls_time)
            if(res.info.ls_order_num==0 || res.info.ls_viewer_num==0){
                res.info.ratio = '0%'
            }else{
                res.info.ratio = parseInt(res.info.ls_order_num /res.info.ls_viewer_num * 100) + '%'

            }
            this.setData({streamInfo:res.info})
        })
    },
    Notify(data){
        showNotify(data)
    }
})