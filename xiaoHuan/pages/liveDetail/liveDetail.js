import {getUserLiveHome, getRecordVideo, getAllLiveFlow} from '../../api/live'
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
        //直播间id
        liveId: '',
        //用户头像
        headerImg: '',
        //用户名
        userName: '',
        //粉丝量
        fansNum: '',
        //精彩回播内容
        historyList: [],
        //直播流id
        liveStream: '',
        //直播流id
        flowId: '',
        //当前页
        page_no: 1,

        loadingFlag: [false, false, false],

    },
    path: 'pages/liveDetail/liveDetail',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (!this.data.historyList.length) Helper.showLoading('加载中···', true, 3000)
        if (this.isInit) return
        this.isInit = true

        this.initLiveDetail(this.checkLoading)
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //初始化直播详情
    initLiveDetail(callback) {
        console.log(this.userInfo);
        if (this.userInfo.user_streamer != 1) {
            return Navigate.memberVip('vip').to()
        }
        this.data.userID = this.userInfo.id
        console.log(this.data.userID)
        this.userStreamer(callback)
        this.getFansNum(callback)
        this.getUserLiveHome(callback)
        this.getAllLiveFlow(callback)

        this.share = Share.instance().setPage('liveStreamer').setParams({userid: this.data.userID}).get()
    },
    //去直播间
    createLive() {
        Navigate.liveCreate().to()
    },
    //获取主播信息
    userStreamer(callback) {
        userStreamer({id: this.data.userID}).then(res => {

            if (!res.status) {
                return Helper.showError(res.msg)
            }

            console.log(res)
            let headerImg = res.info.user_head;
            let userName = res.info.user_nickname;
            this.data.loadingFlag[0] = true;
            callback()
            this.setDataStorage({
                headerImg,
                userName,
                liveId: res.info.user_live.id
            })
        }).catch(err => {
            console.log(err)
        })
    },
    getAllLiveFlow() {
        this.getLiveFlowData()
    },
     //获取粉丝数量
    getFansNum(callback) {
        getFansNum().then(res => {

            if (!res.status) {
                return Helper.showError(res.msg)
            }
            console.log(res)
            let fansNum = res.info.live.total;
            this.data.loadingFlag[1] = true
            callback()
            this.setDataStorage({
                fansNum
            })
        }).catch(err => {
        })
    },
    //获取直播流数据
    getLiveFlowData(init = true) {
        if (this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        getAllLiveFlow({
            user_id: this.data.userID,
            page_no: init ? 1 : ++this.data.page_no
        }).then(res => {
            Helper.hideLoading()
            this.loadingList = false
            if (!res.status) return Helper.showError(res.msg)
            if (!res.info.list.length) return /*Helper.showError(init ? '没有数据' : '没有更多数据')*/
            console.log(res)
            for (let i = 0; i < res.info.list.length; i++) {
                res.info.list[i].timer = timeFilter(res.info.list[i].ls_start_time, res.info.list[i].ls_stop_time)
            }
            let result = init ? res.info.list : this.data.historyList.concat(res.info.list)
            // console.log(result)
            this.setDataStorage({historyList: result})
        })
    },
    onReachBottom() {
        this.getLiveFlowData(false)
    },
    //获取主播的直播间
    getUserLiveHome(callback) {
        getUserLiveHome({id: this.data.userID}).then(res => {

            if (!res.status) {
                return Helper.showError(res.msg)
            }

            if(res.info.live_state == 'online'){
                return Navigate.livePush().setFailMsg('你还有未结束的直播，为您返回！').redirect()
            }else if(res.info.live_state == 'ready'){
                return Navigate.liveBeStart().setFailMsg('你还有未结束的直播，为您返回！').redirect()
            }

            console.log(res)
            let viewerNum = res.info.live_viewer_num;
            let liveState = res.info.live_state;
            let liveTitle = res.info.live_stream_data.ls_title;
            this.data.loadingFlag[2] = true
            this.data.flowId = res.info.live_stream_data.id
            callback()
            this.setData({
                viewerNum,
                liveState,
                liveTitle
            })
        }).catch(err => {
        })
    },
    //获取主播所有录播视频
    checkLoading() {
        console.log(this.data.loadingFlag)
        if (this.data.loadingFlag.indexOf(false) == -1) {
            Helper.hideLoading()
            this.data.loadingFlag = [false, false, false]
        }
    },
    Notify(data) {
        showNotify(data)
    },
    toHistoryDetail(e) {
        Navigate.liveHistoryDetail(e.currentTarget.dataset.id).to()
    },
    onShareAppMessage() {
        if (this.share) return this.share.to()
    }
})