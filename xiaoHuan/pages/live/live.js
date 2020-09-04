import {
    getLive,
    liveLeave,
    liveLike,
    cancelLike,
    likeLike,
    getLiveGoodsList,
    liveEnter, likeNumApi,
    liveTalk,
    getLastTalk,
    getLiveQrcode, getVideo
} from '../../api/live'
import {getFollow, toFollow, unFollow, userGet} from '../../api/user'
import {createShare} from '../../api/share'
import {showNotify, color16, saveImage, previewImage, errMsg, computedTime, filterPrice} from "../../utils/btn";
import {clearTimer, heartBeat, socketOnload} from '../../utils/socketBtn'
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import {AppConfig} from "../../config/config"
import {getDetail} from "../../api/goods";


var plugin = requirePlugin("liveRoomPlugin")

Page({
    data: {
        liveInfo         : {},
        streamInfo       : {},
        streamerInfo     : {},
        showGoods        : false,
        goodsList        : [],
        liveId           : '',
        followStatus     : false,
        viewers          : {},
        isLike           : false,
        commentList      : [],
        bottom           : '',
        isScroll         : true,
        inputVal         : '',
        showShare        : true,
        posterConfig     : {},
        canvasImg        : '',
        shareQrcode      : '',
        goods_video_id   : 0,
        showStreamVideo  : false,
        userId           : '',
        keyBoardHeight   : 107,
        // focusStatus      : false,
        pluginsInfo      : {
            liveAppID  : AppConfig.liveAppID,
            playUrl    : '',
            version    : 2,
            muted      : false,
            mode       : 'live',
            orientation: 'vertical',
            objectFit  : 'fillCrop',
            minCache   : 1,
            maxCache   : 3,
            debug      : false,
            soundMode  : 'speaker',
            autoplay   : true,
            autopause  : true,
            sdkAppId   : '',
            userID     : 'not set',
            userSig    : 'not set',
            roomID     : 'not set',
            nickName   : 'not set',
            avatar     : 'not set'
        },
        liveRoomComponent: null,
        playing          : true,
        showStatus       : false,
        statusText       : '',
        barTop           : ''
    },
    path: 'pages/live/live',
    onPreload(options) {
        // console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (this.isInit) return
        this.isInit = true

        this.data.userId = this.userInfo.id || 0
        
        this.player = wx.createLivePlayerContext("player", this)
        
        wx.showShareMenu({
            withShareTicket: true
        })

        if (options.goods_video_id) this.data.goods_video_id = options.goods_video_id;

        Helper.showLoading()

        // console.log(options)
        this.data.liveId = options.id || 0
        let top = wx.getMenuButtonBoundingClientRect().top
        this.setData({barTop: Helper.toRpx(top)}, () => {
            // console.log(this.data.barTop)
        })
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //获取直播间的相关信息
    getLiveData(callback) {
        let that = this
        getLive({id: this.data.liveId}).then(res => {
            Helper.hideLoading();
            if (!res.status) return Navigate.index().setFailMsg(res.msg).setTimeout(2000).switchTab();
            // console.log(res);
            
            this.setData({liveInfo: res.info})
            this.setData({streamInfo: res.info.live_stream_data})
            this.setData({streamerInfo: res.info.live_user_data})
            this.data.pluginsInfo.playUrl = res.info.live_stream_data.ls_rtmp_url_we;
            console.log(this.data.pluginsInfo);
            this.setData({pluginsInfo: this.data.pluginsInfo},()=>{
                // console.log(this.data.pluginsInfo);
                if(callback)callback()
            })
        })
    },
    initLiveComponent(){
        let that = this
        this.data.liveRoomComponent = plugin.instance.getLiveRoomInstance();
        this.share = Share.instance().setType('live_stream').setTarget(this.data.streamInfo.id).setPage('live').setParams({id: this.data.liveId}).setTitle(this.data.streamInfo.ls_title).setImage(this.data.streamInfo.ls_image).get()

        if(this.data.liveInfo.live_state == 'online'){

        }

        switch (this.data.liveInfo.live_state) {
            case 'offline':
                if (this.data.goods_video_id) {
                    return Navigate.productVideo(this.data.goods_video_id).to()
                } else {
                    return Navigate.index().setFailMsg('主播已下播').switchTab()
                }
                break;
            case 'online':
                // console.log(this.data.streamInfo)
                if (this.data.streamInfo.ls_video != '') {
                    this.setData({showStreamVideo: true},()=>{
                        let VideoContext = wx.createVideoContext('index-video')
                        VideoContext.seek(this.data.streamInfo.ls_countdown)
                    })
                } else {
                    //开始拉流
                    this.player.play()
                    // this.data.liveRoomComponent.start();
                }
                break;
            default:
                let countDown = () => {
                    if (this.data.liveInfo.live_state == 'online') {
                        this.setData({showStatus: true})
                        return;
                    }
                    if (this.data.streamInfo.ls_countdown >= 0) {
                        this.setData({
                            showStatus: true,
                            statusText: '请稍等一会儿，主播马上到~'
                        })
                    } else {
                        this.data.streamInfo.ls_countdown++;
                        this.setData({
                            showStatus: true,
                            statusText: '距离开播' + computedTime(0 - this.data.streamInfo.ls_countdown)
                        })
                        setTimeout(countDown, 1000)
                    }
                };
                countDown()
                break;
        }
        this.setDo()
        this.likeNumApi()
        this.getFollowStatus()
        this.getLikeStatus()

        if(!this.isEnter){
            liveEnter({id: this.data.streamInfo.id}).then((res) => {
                this.isEnter = true
                console.log(res,'+++++++++')
            })
            getLastTalk({id: this.data.streamInfo.id}).then(res => {
                if (!res.status) {
                    return Helper.showError(res.msg)
                }
                this.setData()
                this.data.commentList = res.info.concat(this.data.commentList)
                this.setData({commentList: this.data.commentList}, () => {
                    this.setData({bottom: 'scroll-bottom'})
                })
            })
        }
        
        heartBeat('live_heartbeat_get', {id: this.data.streamInfo.id}, () => {
            console.log('user_live_heartBeat')
        })

        getLiveGoodsList({id: this.data.streamInfo.id}).then(goodsRes => {
            Helper.reSizeGoodsImage(goodsRes)
            if (!goodsRes.status) {
                return Helper.showError(goodsRes.msg)
            }
            this.setData({goodsList: goodsRes.info})

            //this.toShare({currentTarget: {dataset: {target: goodsRes.info[0].lg_goods_code}}});
        })
    },
    setDo() {
        getApp().socketApi.setDo('stream_start', () => {
            Helper.hideToast()
            this.data.liveInfo.live_state = 'online'
            console.log(this.data.pluginsInfo);
            setTimeout(() => {
                this.setData({
                    showStatus : false
                }, () => {
                    this.player.play()
                    // this.data.liveRoomComponent.start();
                })
            }, 1000)
        })
        getApp().socketApi.setDo('stream_stop', () => {
            Helper.hideToast()
            this.data.liveInfo.live_state = 'offline'
            this.data.liveRoomComponent.stop()
            this.setData({
                showStatus: true,
                statusText: '主播已下播'
            })
        })
        getApp().socketApi.setDo('stream_bulletin',(res)=>{
            console.log(res)
            res.info.type = 'remind'
            this.appendData('commentList', [res.info], () => {
                console.log(this.data.commentList)
                if (this.data.isScroll) {
                    this.setData({bottom: 'scroll-bottom'})
                }
            })
        })
        getApp().socketApi.setDo('stream_users', (res) => {
            // console.log(res)
            console.log(1111);
            this.setData({viewers: res.info.info})
        })
        getApp().socketApi.setDo('stream_talk', (res) => {
            console.log(res)
            //用户没有滚动操作，更新列表并置底
            this.appendData('commentList', [res.info], () => {
                console.log(this.data.commentList)
                if (this.data.isScroll || this.data.userId == res.info.lt_user_id) {
                    this.setData({bottom: 'scroll-bottom'})
                }
            })
        })
    },
    // keyboardUp(e){
    //     console.log(e)
    //     let height = e.detail.height
    //     this.setData({keyBoardHeight:height+10})
    // },

    //获取关注状态
    getFollowStatus() {
        getFollow({user_id: this.data.streamerInfo.id}).then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            this.setData({followStatus: res.info.follow})
        })
    },
    //关注主播
    toFollow() {
        if (this.data.followStatus) {
            unFollow({user_id: this.data.streamerInfo.id}).then(res => {
                console.log(res)
                this.setData({followStatus: false})
            })
        } else {
            toFollow({
                user_id  : this.data.streamerInfo.id,
                from_type: 'live_stream',
                from_id  : this.data.streamInfo.id
            }).then(res => {
                console.log(res)
                if (!res.status) {
                    return Helper.showError(res.msg)
                }
                this.setData({followStatus: true})
            })
        }
    },
    //跳转到个人中心
    goPersonal() {
        Navigate.liveStreamer(this.data.streamerInfo.id).to()
    },
    toComment(e) {
        let {vid} = e.currentTarget.dataset
        Navigate.productVideo(vid).to()
    },
    //是否喜欢直播
    getLikeStatus() {
        let that   = this
        let params = {
            id: this.data.streamInfo.id
        }
        likeLike(params).then(res => {
            that.setData({isLike: res.info.like})
        })
    },
    //喜欢
    setLiveLike() {
        let that = this;
        liveLike({id: this.data.streamInfo.id}).then(res => {
            that.setData({
                isLike: res.info.like
            })
        })
    },
    //取消喜欢
    cancelLike() {
        let that = this;
        cancelLike({id: this.data.streamInfo.id}).then(res => {
            console.log(res)
            that.setData({
                isLike: res.info.like
            })
        })
    },
    //喜欢切换
    checkLike() {
        //动画
        this.animate('#container', [
            { scale: [1, 1]},
            { scale: [1.2, 1.2]},
            { scale: [1, 1]},
        ], 300, function () {
            this.clearAnimation('#container', { scale: true })
        }.bind(this))
        let isLike = this.data.isLike;
        console.log(isLike)
        if (isLike) {
            this.cancelLike()
        } else {
            this.setLiveLike()
        }
    },
    talkScroll(e) {
        this.data.isScroll = e.detail.scrollTop - e.target.offsetTop >= e.detail.scrollHeight - 20
    },
    likeNumApi() {
        return;
        getApp().socketApi.setDo('stream_like_num', (res) => {
            console.log(res)
        })
    },
    keyboardHeightChange(e){
        console.log(e)
        this.setData({keyBoardHeight:(Helper.toRpx(e.detail.height)+60)})
    },
    onBlur(){
        this.setData({keyBoardHeight:107})
    },
    liveTalk(e) {
        liveTalk({
            id     : this.data.streamInfo.id,
            message: e.detail.value
        }).then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            this.setData({inputVal: '',keyBoardHeight:107}, () => {
                // console.log(111)
            })
        })
    },
    navBack() {
        liveLeave({id: this.data.streamInfo.id}).then((res) => {
            console.log(res)
            Navigate.back()
        })
    },
    back() {
        liveLeave({id: this.data.streamInfo.id}).then((res) => {
            console.log(res)
        })
    },
    showPopup() {
        getLiveGoodsList({id: this.data.streamInfo.id}).then(goodsRes => {
            console.log(goodsRes);
            if (!goodsRes.status) {
                return Helper.showError(goodsRes.msg)
            }
            Helper.reSizeGoodsImage(goodsRes)
            this.setData({goodsList: goodsRes.info})
        })
        this.setData({showGoods: true})
    },
    closePopup() {
        this.setData({showGoods: false})
    },
    toDetail(e) {
        let {code} = e.currentTarget.dataset
        Navigate.productDetail(code, this.data.streamInfo.id,'inline').to()
    },
    onHide() {
        clearTimer()
        this.isEnter = false
        this.back()
    },
    onUnload() {
        clearTimer()
        this.isEnter = false
        this.back()
    },
    onShow(){
        this.getLiveData(this.initLiveComponent)
    },
    Notify(data) {
        showNotify(data)
    },
    onShareAppMessage() {
        if (this.share) return this.share.to()
    },
    toShare(e) {
        Helper.showLoading('生成中', true, 0)

        let {type, target} = e.currentTarget.dataset
        this.data.target   = target

        let live_goods = null;
        for (let key in this.data.goodsList) {
            if (this.data.goodsList[key].lg_goods_code == this.data.target) {
                live_goods = this.data.goodsList[key];
                break;
            }
        }
        if (!live_goods) return

        getLiveQrcode({
            stream_id : this.data.streamInfo.id,
            goods_code: this.data.target
        }).then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.setData({shareQrcode: res.info.url})

            let config = {
                width          : Helper.toRpx(642),
                height         : Helper.toRpx(998),
                backgroundColor: '#FFF',
                debug          : false,
                pixelRatio     : 1,
                blocks         : [],
                texts          : [
                    {
                        x         : Helper.toRpx(170),
                        y         : Helper.toRpx(80),
                        baseLine  : 'middle',
                        fontWeight: 'bold',
                        text      : this.data.streamerInfo.user_nickname,
                        fontSize  : Helper.toRpx(26),
                        color     : '#666',
                    },
                    {
                        x       : Helper.toRpx(170),
                        y       : Helper.toRpx(115),
                        baseLine: 'middle',
                        width   : Helper.toRpx(420),
                        text    : this.data.streamInfo.ls_title,
                        fontSize: Helper.toRpx(26),
                        color   : '#666',
                    },
                    {
                        x       : Helper.toRpx(185),
                        y       : Helper.toRpx(179),
                        baseLine: 'middle',
                        text    : (this.data.viewers.total_num || 0) + '人观看',
                        fontSize: Helper.toRpx(20),
                        color   : '#FFF',
                        zIndex  : 10,
                    },
                    {
                        x         : Helper.toRpx(70),
                        y         : Helper.toRpx(700),
                        baseLine  : 'middle',
                        lineNum   : 2,
                        width     : Helper.toRpx(490),
                        lineHeight: Helper.toRpx(38),
                        text      : live_goods.lg_goods_data.goods_title,
                        fontSize  : Helper.toRpx(27),
                        color     : '#666',
                    },
                    {
                        x       : Helper.toRpx(65),
                        y       : Helper.toRpx(822),
                        baseLine: 'middle',
                        text    : '￥' + live_goods.lg_goods_data.goods_data.commission.price,
                        fontSize: Helper.toRpx(42),
                        color   : '#FB6B3D',
                    },
                    {
                        x       : Helper.toRpx(135),
                        y       : Helper.toRpx(892),
                        baseLine: 'middle',
                        text    : '好友 ' + this.userInfo.user_nickname + ' 向您推荐',
                        fontSize: Helper.toRpx(18),
                        color   : '#6A6A6A',
                    },
                    {
                        x       : Helper.toRpx(135),
                        y       : Helper.toRpx(915),
                        baseLine: 'middle',
                        text    : '进入直播间可享受直播优惠',
                        fontSize: Helper.toRpx(18),
                        color   : '#6A6A6A',
                    },
                    {
                        x        : Helper.toRpx(520),
                        y        : Helper.toRpx(900),
                        baseLine : 'middle',
                        textAlign: 'center',
                        lineNum  : 2,
                        width    : Helper.toRpx(80),
                        text     : '长按识别二维码去购买',
                        fontSize : Helper.toRpx(14),
                        color    : '#666',
                    },
                ],
                images         : [
                    {
                        width       : Helper.toRpx(81),
                        height      : Helper.toRpx(81),
                        x           : Helper.toRpx(70),
                        y           : Helper.toRpx(53),
                        borderRadius: Helper.toRpx(81),
                        url         : this.data.streamerInfo.user_head,
                    },
                    {
                        width       : Helper.toRpx(510),
                        height      : Helper.toRpx(510),
                        x           : Helper.toRpx(66),
                        y           : Helper.toRpx(160),
                        borderRadius: Helper.toRpx(50),
                        url         : live_goods.lg_goods_data.goods_image,
                    },
                    {
                        width : Helper.toRpx(259),
                        height: Helper.toRpx(38),
                        x     : Helper.toRpx(66),
                        y     : Helper.toRpx(160),
                        url   : '/static/img/living-tag.png',
                    },
                    {
                        width       : Helper.toRpx(50),
                        height      : Helper.toRpx(50),
                        x           : Helper.toRpx(68),
                        y           : Helper.toRpx(880),
                        borderRadius: Helper.toRpx(50),
                        url         : this.userInfo.user_head,
                    },
                    {
                        width : Helper.toRpx(104),
                        height: Helper.toRpx(104),
                        x     : Helper.toRpx(466),
                        y     : Helper.toRpx(780),
                        url   : this.data.shareQrcode,
                    },
                ]
            }

            if (live_goods.lg_goods_data.goods_data.commission.couponPrice) {
                let couponValue = parseFloat(live_goods.lg_goods_data.goods_data.couponInfo.couponValue)
                config.images.push({
                    width : Helper.toRpx(63),
                    height: Helper.toRpx(33),
                    x     : Helper.toRpx(210),
                    y     : Helper.toRpx(806),
                    url   : "/static/img/youhuiquan-.png",
                })
                config.texts.push({
                    x       : Helper.toRpx(224),
                    y       : Helper.toRpx(824),
                    baseLine: 'middle',
                    text    : '￥' + couponValue,
                    fontSize: Helper.toRpx(21 - String(couponValue).length * 2),
                    color   : '#FB6B3D',
                })
            }

            this.setData({posterConfig: config}, () => {
                Poster.create(true);
            });
        })
    },
    shareLive() {
        Helper.showLoading('生成中', true, 0)
        getLiveQrcode({
            stream_id: this.data.streamInfo.id
        }).then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.data.shareQrcode = res.info.url;

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
                        text      : this.data.liveInfo.live_user_data.user_nickname,
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
                        text      : this.data.streamInfo.ls_title,
                        fontSize  : Helper.toRpx(27),
                        color     : '#666',
                    },
                    {
                        x       : Helper.toRpx(160),
                        y       : Helper.toRpx(825),
                        baseLine: 'middle',
                        text    : '好友 ' + this.userInfo.user_nickname + ' 向您推荐',
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
                        url         : this.data.streamInfo.ls_image,
                    },
                    {
                        width       : Helper.toRpx(80),
                        height      : Helper.toRpx(80),
                        x           : Helper.toRpx(68),
                        y           : Helper.toRpx(810),
                        borderRadius: Helper.toRpx(80),
                        /*borderWidth: 1,
                        borderColor: '#000',*/
                        url         : this.userInfo.user_head,
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
        })
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
    },
    //用户观看视频事件。。。。。。。。。。。。。。。。。。
    //用户点击视频暂停播放。/恢复播放。
    // onPlayClick() {
    //     this.setData({
    //         playing: !this.data.playing,
    //     })
    //     console.log(this.data.playing)
    //     if (this.data.playing) {
    //         this.data.liveRoomComponent.resume();//恢复播放
    //     } else {
    //         this.data.liveRoomComponent.pause();//暂停播放
    //         this.data.liveRoomComponent.mute();//静音
    //     }
    // },
    //监听播放事件
    onPlayEvent(e) {
        // console.log(e)
        if(e.detail.code == -2301){
            this.initLiveComponent()
        }
    },
})