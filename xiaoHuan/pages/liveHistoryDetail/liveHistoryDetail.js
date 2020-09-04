import {getUserLiveHome, getRecordVideo, getStreamFlow} from '../../api/live'
import {userStreamer, getFansNum, getFollow, toFollow, unFollow, userGet} from '../../api/user'
import { showNotify, timeFilter} from "../../utils/btn";
import {createShare} from "../../api/share";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        //用户id
        userID: '',
        //直播流id
        flowId: '',
        //直播时长
        timer:'',
        //直播标题
        title:'',
        //视频列表
        videoList:[],
        //用户信息
        userInfo:{}
    },
    path: 'pages/liveHistoryDetail/liveHistoryDetail',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (this.isInit) return
        this.isInit = true

        let flowId       = options.id
        this.data.flowId = flowId
        this.initHistoryData()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //初始化直播历史信息
    initHistoryData(callback) {
        if (!this.userInfo || this.userInfo.user_streamer == 0) {
            Navigate.memberVip('push').setFailMsg('您还不是主播').launch()
        } else {
            this.setData({userInfo: this.userInfo})
            this.getStreamFlow(callback)
            this.share = Share.instance().setPage('liveStreamer').setParams({userid: this.data.userInfo.id}).get()
        }
    },
    //获取直播流
    getStreamFlow(){
        getStreamFlow({stream_id:this.data.flowId}).then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res.info.ls_goods_list)
            for(let i = 0;i < res.info.ls_goods_list.length;i++){
                if(res.info.ls_goods_list[i].lg_video != ''){
                    this.data.videoList.push(res.info.ls_goods_list[i])
                }
            }
            this.data.timer = timeFilter(res.info.ls_start_time,res.info.ls_stop_time)
            this.setData({timer:this.data.timer,title:res.info.ls_title,videoList:this.data.videoList})
        })
    },
    Notify(data) {
        showNotify(data)
    },
    toLiveData(){
        Navigate.liveData(this.data.flowId).to()
    },
    onShareAppMessage(){
        if(this.share) this.share.to()
    },
    toShortVideo(e){
        let vid=e.currentTarget.dataset.vid;
        Navigate.productVideo(vid,'liveHistoryDetail').to()
    }
})