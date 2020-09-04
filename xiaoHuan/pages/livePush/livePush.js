import {
    goodsTop,
    getSelfLive,
    getLiveGoodsList,
    stopLive,
    getLive,
    getLiveViewers,
    stopRecord,
    startRecord,
    updateLive,
    liveTalk, getLastTalk, getLiveQrcode
} from "../../api/live";

import {createShare} from '../../api/share'
import {errMsg, previewImage, saveImage, showNotify} from "../../utils/btn";
import {clearTimer, heartBeat, socketOnload} from "../../utils/socketBtn";
import {color16} from "../../utils/btn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import Poster from "../../miniprogram_npm/wxa-plugin-canvas/poster/poster";
import {userGet} from "../../api/user";
import {AppConfig} from "../../config/config";

// 加载插件
var plugin = requirePlugin("liveRoomPlugin")
// 获取live-room组件实例

Page({
    data: {
        //显示美颜滑块
        showBar: false,
        //滑块最大值
        currentValue: 10,
        //显示购物车列表
        showProduct: false,
        //显示按钮
        showBtn: true,
        //购物车商品列表
        goodsList: [],
        //主播id
        id: '',
        //直播流id
        flowId: '',
        //用户id
        userId: '',
        //主播相关信息
        streamerInfo: '',
        //直播id
        live_number: '',
        //观众数据
        viewer: {},
        //视频录制状态
        recordState: '录制商品讲解',
        countdown:0,
        recordFlag: true,
        commentList: [],
        showTime: '',
        startTime: 100,
        isScroll: true,
        streamImage: '',
        streamTitle: '',
        showShare   : true,
        posterConfig: {},
        canvasImg   : '',
        bottom: '',
        inputVal: '',
        mlTime:null,
        pluginsInfo:{
            liveAppID: AppConfig.liveAppID,
            pushUrl:'',
            version:2,
            muted:false,
            mode:'SD',
            waitingImage:'',
            enableCamera:true,
            orientation:'vertical',
            beauty:9,
            whiteness:9,
            backgroundMute:false,
            debug:false,
            autoFocus:true,
            aspect:'9:16',
            minBitrate:200,
            maxBitrate:1000,
            zoom:false,
            devicePosition:'front',
            audioQuality:'high',
            mirror:true,
            autopush:true,
            sdkAppId:'',
            userID:'not set',
            userSig:'not set',
            roomID:'not set',
            nickName:'not set',
            avatar:'not set'
        },
        keyBoardHeight:60,
        barTop:0
    },
    onLoad(options) {
        // this.setData({goodsList: wx.getStorageSync('checkBaby')})
        if (!socketOnload(this, options)) return

        if(wx.getStorageSync('pluginsInfo')){
            this.setData({pluginsInfo:wx.getStorageSync('pluginsInfo')})
        }

        
        setInterval(this.computedTime, 1000)
        let top = wx.getMenuButtonBoundingClientRect().top
        this.setData({barTop: Helper.toRpx(top)},()=>{
            console.log(this.data.barTop)
        })
    },
    onShow() {
        this.data.commentList = []

        this.getViewerData()
        this.getComment()
        this.initLiveData()
        this.computedTime()
        if (this.data.flowId) {
            //获取商品列表F
            // getLiveGoodsList({id: this.data.flowId}).then(goodsRes => {
            //     console.log(goodsRes)
            //     Helper.reSizeGoodsImage(goodsRes)
            //     this.setData({goodsList: goodsRes.info})
            // })
            this.getLiveGoodsList()
        }
    },
    onHide() {
        clearTimer()
    },
    onPushEvent(e){
        console.log(e)
    },
    onPushError(e){
        console.log(e)
    },
    navBack() {
        Navigate.back()
    },
    //关闭所有显示按钮
    onClose() {
        this.setData({showBar: false})
        this.setData({showProduct: false})
        this.setData({showBtn: true})
    },
    //显示美颜按钮
    showBar() {
        this.setData({showBtn: false})
        this.setData({showBar: true})
    },
    //显示商品列表
    showProduct() {
        this.setData({showBtn: false})
        this.setData({showProduct: true})
    },
    //前往选择商品
    toSelect() {
        Navigate.liveSelectProduct('live').to()
    },
    //初始化直播间数据
    initLiveData() {
        getSelfLive().then(res => {
            console.log(res)
            let id = res.info.id
            let flowId = res.info.live_stream_data.id
            let userId = res.info.live_user_id
            let streamTitle = res.info.live_stream_data.ls_title
            let streamImage = res.info.live_stream_data.ls_image
            let start_time = res.info.live_stream_data.ls_start_time
            let countdown = res.info.live_stream_data.ls_countdown
            this.data.start_time = start_time
            this.setData({id, flowId, userId, streamImage, streamTitle, countdown})

            this.share = Share.instance().setType('live_stream').setTarget(res.info.live_stream_data.id).setPage('live').setParams({id: res.info.id}).setTitle(res.info.live_stream_data.ls_title).setImage(res.info.live_stream_data.ls_image).get()
            //获取商品列表F
            getLiveGoodsList({id: res.info.live_stream_data.id}).then(goodsRes => {
                if (!res.status) {
                    return Helper.showError(res.msg)
                }
                console.log(goodsRes)
                Helper.reSizeGoodsImage(goodsRes)
                this.setData({goodsList: goodsRes.info})
            })
            //获取主播信息
            getLive({id}).then(infoRes => {
                if (!res.status) {
                    return Helper.showError(res.msg)
                }

                this.data.pluginsInfo.pushUrl = infoRes.info.live_stream_data.ls_stream_we
                this.data.pluginsInfo.mode = infoRes.info.live_stream_data.ls_sharpness
                this.data.pluginsInfo.avatar = infoRes.info.live_user_data.user_head
                this.data.pluginsInfo.nickName = infoRes.info.live_user_data.user_nickname
                this.data.pluginsInfo.roomID = infoRes.info.id
                this.data.pluginsInfo.mode = infoRes.info.live_stream_data.ls_sharpness

                this.setData({pluginsInfo:this.data.pluginsInfo},()=>{
                    // console.log(this.data.pluginsInfo)
                    this.liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance();
                    this.liveRoomPushComponent.start()
                })
                this.setDo()
                console.log(infoRes)
                this.setData({streamerInfo: infoRes.info.live_user_data, live_number: infoRes.info.live_number})
            })
            //获取观众列表
            getLiveViewers({id: res.info.live_stream_data.id, page_no: 1, page_size: 4}).then(viewRes => {
                console.log(viewRes)
                this.setData({viewer: viewRes.info})
            })
            heartBeat('live_heartbeat_get', {id: flowId}, () => {
                console.log('stream_live_heartBeat')
            })
            getLastTalk({id: flowId}).then(res => {
                if (!res.status) {
                    return Helper.showError(res.msg)
                }
                this.data.commentList = res.info.concat(this.data.commentList)
                this.setData({commentList: this.data.commentList}, () => {
                    this.setData({bottom: 'scroll-bottom'})
                })
            })
        }).catch(() => {
            Helper.showError('直播数据获取失败')
        })


    },
    onBlur(){
        this.setData({keyBoardHeight:60})
    },
    //获取观众数据
    getViewerData() {
        getApp().socketApi.setDo('stream_users', (res) => {
            console.log(res)
            this.setData({viewer: res.info.info})
        })
    },
    //发表评论
    liveTalk(e) {
        liveTalk({id: this.data.flowId, message: e.detail.value}).then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            this.setData({inputVal: ''})
        })
    },
    setDo(){
        getApp().socketApi.setDo('stream_bulletin',(res)=>{
            console.log(res)
            res.info.type = 'remind'
            this.data.commentList.push(res.info)
            this.setData({commentList: this.data.commentList}, () => {
                console.log(this.data.commentList)
                if (this.data.isScroll) {
                    this.setData({bottom: 'scroll-bottom'})
                }
            })
        })
    },
    //计算时间
    computedTime() {
        // this.data.startTime++
        // console.log(this.data.start_time)
        let result
        if(this.data.countdown <= 0){
            result = '00:00:00'
        }else{
            this.data.countdown++
            this.data.startTime = this.data.countdown

            let secondTime = parseInt(this.data.startTime)//将传入的秒的值转化为Number
            let min        = 0// 初始化分
            let h          = 0// 初始化小时
            if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                min        = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
                secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
                if (min > 60) {//如果分钟大于60，将分钟转换成小时
                    h   = parseInt(min / 60)//获取小时，获取分钟除以60，得到整数小时
                    min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
                }
            }
            result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
        }
        this.setData({showTime: result})
    },
    //用户滚动评论区
    talkScroll(e) {
        this.data.isScroll = e.detail.scrollTop - e.target.offsetTop >= e.detail.scrollHeight - 20
    },
    keyboardHeightChange(e){
        console.log(e)
        let result = wx.getSystemInfoSync()
        console.log(result)
        let dpr = 750 / result.windowWidth
        this.setData({keyBoardHeight:(e.detail.height*dpr+60)})
    },
    //获取评论
    getComment() {
        let that = this
        getApp().socketApi.setDo('stream_talk', (res) => {
            console.log(res)
            this.data.commentList.push(res.info)
            if (this.data.commentList.length > 100) {
                this.data.commentList.shift()
            }
            this.setData({commentList: this.data.commentList}, () => {
                // console.log(111)
                if (that.data.isScroll || res.info.lt_user_data.id == this.data.userId) {
                    this.setData({bottom: 'scroll-bottom'})
                }
            })
        })
    },
    //置顶商品
    goodsTop(e) {
        console.log(this.data.recordFlag)
        if (this.data.recordFlag) {
            let {index, code} = e.currentTarget.dataset;
            goodsTop({goods_code: code}).then((res) => {
                if (res.status) {
                    Helper.reSizeGoodsImage(res)
                    // let goodsData = this.data.goodsList.splice(index, 1)
                    // goodsData = goodsData.concat(this.data.goodsList)
                    // console.log(res)
                    // this.setData({
                    //     goodsList: goodsData,
                    //     recordState: '录制商品讲解',
                    // })
                    this.getLiveGoodsList()
                }
            })
        } else {
            Helper.showError('有正在录制的视频')
        }
    },
    //录制视频
    Recording(e) {
        //商品code
        let {starttime, goodcode} = e.currentTarget.dataset;
        console.log(goodcode, starttime)
        if (starttime != null) {
            //调取停止录制
            this.stopRecord(goodcode)
        } else {
            if (this.data.recordFlag) {
                //调取开始录制
                this.startRecord(goodcode)
            } else {
                //调取停止录制
                this.stopRecord(goodcode)
            }
        }

    },
    // 开始录制视频
    startRecord(params) {
        startRecord({goods_code: params}).then(res => {
            console.log(res);
            if (res.status) {
                this.setData({
                    recordState: '正在录制',
                    recordFlag: false
                })
            } else {
                Helper.showError(res.msg)
            }
        }).catch(() => {
            Helper.showError('录制视频失败,请重试')
        })
    },
    //停止录制视频
    stopRecord(params) {
        stopRecord({goods_code: params}).then(res => {
            console.log(res);
            if (res.status) {
                this.setData({
                    recordFlag: true
                })
                //初始化商品列表
                this.getLiveGoodsList()
            }
        }).catch(() => {
            Helper.showError('停止录制视频失败,请重试')
        })
    },
    //结束直播
    stopLive() {
        stopLive().then(res => {
            console.log(res)
            this.liveRoomPushComponent.stop()
            wx.removeStorageSync('checkBaby')
            wx.removeStorageSync('createLiveInfo')
            wx.setStorageSync('stopLiveInfo', res.info)
            if (res.status) {
                return Navigate.liveBeEnd().redirect()
            }
        }).catch(() => {
            Helper.showError('结束直播失败,请重试')
        })
    },
    getLiveGoodsList(){
        getLiveGoodsList({id: this.data.flowId}).then(goodsRes => {
            Helper.reSizeGoodsImage(goodsRes)
            console.log(goodsRes)
            this.setData({goodsList: goodsRes.info})
        })
    },
    //商品录制结束提示
    endHint() {
        Helper.showSuccess('该视频已经录制完毕')
    },
    //美白
    onSkin(event) {
        // clearTimeout(this.data.mlTime);
        // this.data.mlTime=setTimeout(function(){
        //     let skinNum = Math.floor(event.detail.value / 10);
        //     updateLive({whiteness: skinNum}).then(res => {
        //         if (res.status) console.log('美白已加')
        //     }).catch(() => {
        //         console.log('美白失败')
        //     })
        // },200)
        let skinNum = Math.floor(event.detail.value / 10);
        console.log(skinNum)
        this.data.pluginsInfo.whiteness = skinNum
        this.setData({pluginsInfo:this.data.pluginsInfo})
    },
    //滤镜
    onFilter(event) {
        // clearTimeout(this.data.mlTime);
        // this.data.mlTime=setTimeout(function(){
        // let filterNum = Math.floor(event.detail.value / 10);
        // updateLive({beauty: filterNum}).then(res => {
        //     if (res.status) console.log('滤镜已加')
        // }).catch(() => {
        //     console.log('滤镜失败')
        // })
        // },200)
        let filterNum = Math.floor(event.detail.value / 10);
        console.log(filterNum)
        this.data.pluginsInfo.beauty = filterNum
        this.setData({pluginsInfo:this.data.pluginsInfo})
    },
    //跳转到个人中心
    toPersonal() {
        Navigate.liveStreamer(this.data.userId).to()
    },
    //跳转到商品详情
    toDetail(e) {
        let {code} = e.currentTarget.dataset;
        console.log(code)
        Navigate.productDetail(code, this.data.flowId).to()
    },
    //分享触发函数
    onShareAppMessage() {
        if(this.share) return this.share.to()
    },
    Notify(data) {
        showNotify(data)
    },
    shareLive(){
        Helper.showLoading('生成中', true, 0)
        getLiveQrcode({
            stream_id: this.data.flowId
        }).then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.data.shareQrcode = res.info.url;
            this.createPoster()
        })
    },
    createPoster() {
        let config = {
            width          : Helper.toRpx(642),
            height         : Helper.toRpx(998),
            backgroundColor: '#FFF',
            debug          : false,
            pixelRatio     : 1,
            blocks         : [],
            texts          : [
                {
                    x         : Helper.toRpx(70),
                    y         : Helper.toRpx(130),
                    baseLine  : 'middle',
                    fontWeight: 'bold',
                    text      : this.data.streamerInfo.user_nickname,
                    fontSize  : Helper.toRpx(30),
                    color     : '#666',
                },
                {
                    x         : Helper.toRpx(70),
                    y         : Helper.toRpx(720),
                    baseLine  : 'middle',
                    lineNum   : 2,
                    width     : Helper.toRpx(490),
                    lineHeight: Helper.toRpx(38),
                    text      : this.data.streamTitle,
                    fontSize  : Helper.toRpx(27),
                    color     : '#666',
                },
                {
                    x       : Helper.toRpx(160),
                    y       : Helper.toRpx(825),
                    baseLine: 'middle',
                    text    : '好友 ' + this.data.streamerInfo.user_nickname + ' 向您推荐',
                    fontSize: Helper.toRpx(18),
                    color   : '#6A6A6A',
                },
                {
                    x       : Helper.toRpx(160),
                    y       : Helper.toRpx(850),
                    baseLine: 'middle',
                    text    : '打开' + this.data.CommonConfig.store_title + '小程序',
                    fontSize: Helper.toRpx(18),
                    color   : '#6A6A6A',
                },
                {
                    x       : Helper.toRpx(160),
                    y       : Helper.toRpx(875),
                    baseLine: 'middle',
                    text    : '享受直播优惠',
                    fontSize: Helper.toRpx(18),
                    color   : '#6A6A6A',
                },
                {
                    x        : Helper.toRpx(520),
                    y        : Helper.toRpx(910),
                    baseLine : 'middle',
                    textAlign: 'center',
                    lineNum  : 2,
                    width    : Helper.toRpx(80),
                    text     : '长按识别二维码去观看',
                    fontSize : Helper.toRpx(14),
                    color    : '#666',
                },
            ],
            images         : [
                {
                    width : Helper.toRpx(120),
                    height: Helper.toRpx(38),
                    x     : Helper.toRpx(65),
                    y     : Helper.toRpx(53),
                    url   : '/static/img/live-tag.png',
                },
                {
                    width       : Helper.toRpx(510),
                    height      : Helper.toRpx(510),
                    x           : Helper.toRpx(66),
                    y           : Helper.toRpx(170),
                    borderRadius: Helper.toRpx(50),
                    url         : this.data.streamImage,
                },
                {
                    width       : Helper.toRpx(80),
                    height      : Helper.toRpx(80),
                    x           : Helper.toRpx(68),
                    y           : Helper.toRpx(810),
                    borderRadius: Helper.toRpx(80),
                    /*borderWidth: 1,
                    borderColor: '#000',*/
                    url         : this.data.streamerInfo.user_head,
                },
                {
                    width : Helper.toRpx(104),
                    height: Helper.toRpx(104),
                    x     : Helper.toRpx(466),
                    y     : Helper.toRpx(790),
                    url   : this.data.shareQrcode,
                },
            ]
        }

        this.setData({posterConfig: config}, () => {
            Poster.create(true);
        });
    },
    onPosterSuccess(e) {
        Helper.hideLoading()
        const {detail} = e;
        this.setData({
            canvasImg: detail,
            showShare: false
        })
        /*wx.previewImage({
            current: detail,
            urls   : [detail]
        })*/
    },
    onPosterFail(err) {
        Helper.hideLoading()
        console.error(err);
    },
    //保存图片方法
    saveImage() {
        let url = this.data.canvasImg
        saveImage(url)
    },
    //图片预览方法
    previewImagea() {
        let url = this.data.canvasImg
        previewImage([url])
    },
    toggleShare() {
        this.setData({
            showShare: true
        })
    }
})