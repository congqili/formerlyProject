import {getUserLiveHome, getRecordVideo} from '../../api/live'
import {userStreamer, getFansNum, getFollow, toFollow, unFollow} from '../../api/user'
import {errMsg, isEmpty, showNotify} from "../../utils/btn";
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
        //关注状态
        followState: false,
        //观看量
        viewerNum: '',
        //直播标题
        liveTitle: '',
        //直播状态
        liveState: '',
        //精彩回播内容
        videoPlayBack: [],
        //直播流id
        liveStream: '',
        flowId: '',
        page_no:1,
        loadingFlag: [false, false, false, false]
    },
    path: 'pages/liveStreamer/liveStreamer',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (this.data.headerImg == '') Helper.showLoading('加载中···', true, 3000)
        if (this.isInit) return
        this.isInit = true

        let {userid} = options
        console.log(userid)
        this.setData({
            userID: userid
        })
        this.initPersonalData(this.checkLoading)

        this.share = Share.instance().setPage('liveStreamer').setParams({userid: this.data.userID}).get()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    initPersonalData(callback) {
        Helper.showLoading()
        this.userStreamer(callback)
        this.getFansNum(callback)
        this.getFollow(callback)
        this.getUserLiveHome(callback)
        this.getRecordVideo(callback)
    },
    //去直播间
    toLiveRoom() {
        switch (this.data.liveState) {
            case "online":
                Navigate.live(this.data.liveId).redirect()
                break;
            case "ready":
                Helper.showError('主播未开播')
                break;
            default:
                Helper.showError('主播已下播')
                break;
        }
    },
    //获取主播信息
    userStreamer(callback) {
        userStreamer({id: this.data.userID}).then(res => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            let headerImg = res.info.user_head;
            let userName = res.info.user_nickname;
            this.data.loadingFlag[0] = true;
            this.setData({
                headerImg,
                userName,
                liveId: res.info.user_live.id
            }, callback)
        }).catch(err => {
            console.log(err)
        })
    },
    //获取粉丝数量
    getFansNum(callback) {
        getFansNum({id: this.data.userID}).then(res => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            let fansNum = res.info.live.total;
            this.data.loadingFlag[1] = true
            this.setData({
                fansNum
            }, callback)
        }).catch(err => {
        })
    },
    //是否关注
    getFollow(callback) {
        getFollow({user_id: this.data.userID}).then(res => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            this.data.loadingFlag[2] = true
            this.setData({
                followState: res.info.follow
            }, callback)
        },).catch(err => {
        })
    },
    //获取主播的直播间
    getUserLiveHome(callback) {
        getUserLiveHome({id: this.data.userID}).then(res => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            let viewerNum = res.info.live_viewer_num;
            let liveState = res.info.live_state;
            let liveTitle = res.info.live_stream_data.ls_title;
            this.data.loadingFlag[3] = true
            this.data.flowId = res.info.live_stream_data.id
            this.setData({
                viewerNum,
                liveState,
                liveTitle
            }, callback)
        }).catch(err => {
        })
    },
    //获取主播所有录播视频
    getRecordVideo(callback) {
        this.getVideoList(true)
    },
    toShortVideo(e) {
        let {vid, code} = e.currentTarget.dataset
        console.log(vid)
        Navigate.productVideo(vid, 'personal').to()
    },
    checkLoading() {
        if (this.data.loadingFlag.indexOf(false) == -1) {
            Helper.hideLoading()
            this.data.loadingFlag = [false, false, false, false]
        }
    },
    //关注
    toFollow() {
        let params = {
            user_id: this.data.userID,
            from_type: 'live_stream',
            from_id: this.data.liveStream
        }
        toFollow(params).then(res => {
            console.log(res)
            if (!res.status) return Helper.showError(res.msg)
            this.setData({
                followState: true
            })
            this.getFollow()
        })
    },//取消关注
    unFollow() {
        let params = {
            user_id: this.data.userID
        }
        unFollow(params).then(res => {
            console.log(res)
            if (!res.status) return
            this.setData({
                followState: false
            })
        })
    },
    //改变关注状态
    changeFwState() {
        let Fstate = this.data.followState;
        if (Fstate) {
            this.unFollow()
        } else {
            this.toFollow()
        }
        this.getFollow()
    },
    Notify(data) {
        showNotify(data)
    },
    onShareAppMessage(){
        if(this.share) return this.share.to()
    },
    getVideoList(init = true){
        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        getRecordVideo({
            page_no:init?1:++this.data.page_no,
            id:this.data.userID
        }).then(res=>{
            Helper.hideLoading()
            this.loadingList = false
            console.log(res);
            if(!res.status) return Helper.showError(res.msg)
            if(!res.info.list.length){
                return /*Helper.showError(init?'没有数据':'没有更多数据')*/
            }
            let videoList = []
            for(let i = 0;i < res.info.list.length;i++){
                if(!isEmpty(res.info.list[i].lg_goods_data)){
                    videoList.push(res.info.list[i])
                }
                // console.log(isEmpty(res.info.list[i].lg_goods_data));
            }
            videoList = init ? videoList : this.data.videoPlayBack.concat(videoList)
            this.setData({videoPlayBack: videoList})
        })
    },
    onReachBottom(){
        this.getVideoList(false)
    }
})