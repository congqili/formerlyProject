import {liveLike, cancelLike, likeLike, likeNumApi, getLive, getVideo, getUserLiveHome, getLiveVideoQrcode, getStreamFlow} from '../../api/live'
import {getDetail, getVideos} from '../../api/goods'
import {getFollow, inviteQrcode, toFollow, unFollow,userGet} from '../../api/user'
import {filterPrice, previewImage, saveImage, showNotify} from '../../utils/btn'
import {socketOnload} from "../../utils/socketBtn";
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        show: true,
        isLike: false,
        //直播间id
        streamerId: '',
        likeNum: '',
        liveInfo: {},
        goodsInfo: {},
        streamerInfo: {},
        streamInfo:{},
        //直播ID
        liveNumber: '',
        flowId: '',
        videoInfo: {},
        //关注按钮的显示状态
        goodsPrice:[],
        isFollow: false,
        liveId:'',
        showShare   : true,
        posterConfig: {},
        canvasImg   : '',
        shareQrcode : '',
        barTop:''
    },
    onClose() {
        this.setData({show: false})
    },
    back(){
        Navigate.back()
    },
    path: 'pages/productVideo/productVideo',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (this.isInit) return
        this.isInit = true

        let {videoid, type} = options
        this.data.type      = type

        //获取视频相关信息
        getVideo({id: videoid}).then(res => {
            if (!res.status) {
                Navigate.index().setFailMsg(res.msg).switchTab()
                return;
            }
            console.log(res);
            this.setData({videoInfo: res.info})

            this.data.flowId     = this.data.videoInfo.lg_stream_id;
            this.data.liveId     = this.data.videoInfo.lg_live_id;
            this.data.code       = this.data.videoInfo.lg_goods_code;
            this.data.liveInfo   = this.data.videoInfo.lg_live_data;
            this.data.streamInfo = this.data.videoInfo.lg_stream_data;
            this.data.streamerId = this.data.videoInfo.lg_user_data.id;

            this.setData({
                streamerInfo: this.data.videoInfo.lg_user_data,
                liveNumber  : this.data.videoInfo.lg_live_data.live_number
            })

            //获取商品信息
            getDetail({code: this.data.code}).then(res => {
                console.log(res);
                this.setData({
                    goodsInfo : res.info,
                    goodsPrice: filterPrice(res.info.goods_data.commission.price)
                })

                this.share = Share.instance().setType('goods_video').setTarget(this.data.videoInfo.id).setPage('productVideo').setParams({videoid: this.data.videoInfo.id}).setImage(this.data.goodsInfo.goods_image).get()
                // this.shareVideo()
            })

            this.likeNumApi()
            this.getFollowStatus(this.data.streamerId)
            likeLike({id: this.data.flowId}).then(res => {
                this.setData({isLike: res.info.like})
                // console.log(res)
            })
        })
        let top = wx.getMenuButtonBoundingClientRect().top
        this.setData({barTop: Helper.toRpx(top)}, () => {
            console.log(this.data.barTop)
        })
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //点赞量接口
    likeNumApi() {
        let that = this
        likeNumApi({id: this.data.flowId}).then(res => {
            console.log(res);
            let likeNum = res.info.num;
            likeNum = that.comLikeNum(likeNum)
            that.setData({
                likeNum: likeNum
            })
        }).catch(err => {
            console.log(err);
        })
    },
    toDetail(e) {
        let {code} = e.currentTarget.dataset;
        Navigate.productDetail(code, this.data.flowId).to()
    },
    //喜欢
    setLiveLike() {
        let that = this
        let params = {
            id: this.data.flowId
        }
        liveLike(params).then(res => {
            console.log(res)
            that.setData({
                isLike: res.info.like
            })
        })
    },
    //取消喜欢
    cancelLike() {
        let that = this
        let params = {
            id: this.data.flowId
        }
        cancelLike(params).then(res => {
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
        if (isLike) {
            this.cancelLike()

        } else {
            this.setLiveLike()
        }
        this.likeNumApi()
    },
    //处理赞数上万
    comLikeNum(num) {
        if (Number(num) > 9999) {
            let computedNum = parseInt(Number(num) / 1000) / 10 + 'w';
            return computedNum
        } else {
            return num
        }
    },
    getFollowStatus(id) {
        getFollow({user_id: id}).then(res => {
            console.log(res)
            this.setData({isFollow: res.info.follow})
        })
    },
    clickFollow(){
        if(this.data.isFollow){
            unFollow({user_id:this.data.streamerId}).then(res=>{
                console.log(res)
                this.setData({isFollow:false})
            })
        }else{
            toFollow({user_id: this.data.streamerId, from_type: 'live_stream', from_id: this.data.flowId})
                .then(res => {
                    console.log(res)
                    if(!res.status){
                        return Helper.showError(res.msg)
                    }
                    this.setData({isFollow:true})
                })
        }
    },
    toPersonal() {
        console.log(this.data)
        if(this.data.type == 'personal'){
            return Helper.showError('您已进入该主播的个人中心了')
        }
        Navigate.liveStreamer(this.data.streamerInfo.id).to()
    },
    Notify(data){
        showNotify(data)
      },
    //分享触发函数
    onShareAppMessage() {
        if(this.share) return this.share.to()
    },
    //分享视频
    shareVideo() {
        Helper.showLoading('生成中', true, 0)
        getLiveVideoQrcode({
            video_id : this.data.videoInfo.id,
        }).then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.data.shareQrcode = res.info.url
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
                    text    : this.data.streamInfo.ls_title,
                    fontSize: Helper.toRpx(26),
                    color   : '#666',
                },
                {
                    x       : Helper.toRpx(185),
                    y       : Helper.toRpx(179),
                    baseLine: 'middle',
                    text    : this.data.videoInfo.lg_view_num + '人观看',
                    fontSize: Helper.toRpx(20),
                    color   : '#fff',
                    zIndex  : 10,
                },
                {
                    x         : Helper.toRpx(70),
                    y         : Helper.toRpx(700),
                    baseLine  : 'middle',
                    lineNum   : 2,
                    width     : Helper.toRpx(490),
                    lineHeight: Helper.toRpx(38),
                    text      : this.data.goodsInfo.goods_title,
                    fontSize  : Helper.toRpx(27),
                    color     : '#666',
                },
                {
                    x       : Helper.toRpx(65),
                    y       : Helper.toRpx(822),
                    baseLine: 'middle',
                    text    : '￥' + this.data.goodsInfo.goods_data.commission.price,
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
                    text    : '观看短视频可享受优惠',
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
                    url         : this.data.goodsInfo.goods_image,
                },
                {
                    width : Helper.toRpx(259),
                    height: Helper.toRpx(38),
                    x     : Helper.toRpx(66),
                    y     : Helper.toRpx(160),
                    url   : '/static/img/goods-explain-tag.png',
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

        if (this.data.goodsInfo.goods_data.commission.couponPrice) {
            let couponValue = parseFloat(this.data.goodsInfo.goods_data.couponInfo.couponValue)
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

        /*let config = {
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
                    y         : Helper.toRpx(700),
                    baseLine  : 'middle',
                    lineNum   : 2,
                    width     : Helper.toRpx(490),
                    lineHeight: Helper.toRpx(38),
                    text      : this.data.goodsInfo.goods_title,
                    fontSize  : Helper.toRpx(27),
                    color     : '#666',
                },
                {
                    x       : Helper.toRpx(65),
                    y       : Helper.toRpx(822),
                    baseLine: 'middle',
                    text    : '￥' + this.data.goodsInfo.goods_data.commission.price,
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
                    text    : '进入可享受直播优惠',
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
                    width       : Helper.toRpx(120),
                    height      : Helper.toRpx(38),
                    x           : Helper.toRpx(65),
                    y           : Helper.toRpx(53),
                    url         : '/static/img/live-tag.png',
                },
                {
                    width       : Helper.toRpx(510),
                    height      : Helper.toRpx(510),
                    x           : Helper.toRpx(66),
                    y           : Helper.toRpx(160),
                    borderRadius: Helper.toRpx(50),
                    url         : this.data.goodsInfo.goods_image,
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
        }*/

        if (this.data.goodsInfo.goods_data.commission.couponPrice) {
            let couponValue = parseFloat(this.data.goodsInfo.goods_data.couponInfo.couponValue)
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
        console.log(config);

        this.setData({posterConfig: config}, () => {
            Poster.create();
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