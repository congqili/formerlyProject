import {getDetail, getGoodsImages, getGoodsLive, getPopUrl, getVideos} from '../../api/goods'
import {genQrcode} from '../../api/user'
import {previewImage, createShared, showNotify, saveImage} from '../../utils/btn'
import {userStreamer, userGet} from '../../api/user'
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
import {AppConfig} from "../../config/config";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import {getStreamFlow} from "../../api/live";
import {copyText} from "../../utils/btn";

var plugin = requirePlugin("liveRoomPlugin")

Page({
    data: {
        //商品编码
        code: '',
        flowId: '',
        checkIndex:0,
        //商品详情图片列表
        goods_images: [],
        //商品主图
        goods_image: '',
        //商品主图
        goods_title: '',
        //商品数据
        goods_data: {},
        // 商品本地图片路径
        goodsLocal: '',
        //头像本地
        headerLocal: '',
        //二维码。。。
        QRcode: '',
        //生成的cavas图
        goods_text:'',
        canvasImg: '',
        showShare: true,
        showLiveComponent: false,
        posterConfig: {},
        popUrl: {},
        showStreamVideo: false,
        videoUrl: '',
        liveRoomComponent: null,
        lookTalking: false,
        hasLive:false,
        liveRoomId:'',
        currentSwiper:0,
        remindText:true,
        pluginsInfo: {
            liveAppID: AppConfig.liveAppID,
            playUrl: '',
            version: 2,
            muted: false,
            mode: 'live',
            orientation: 'vertical',
            objectFit: 'fillCrop',
            minCache: 1,
            maxCache: 3,
            debug: false,
            soundMode: 'speaker',
            autoplay: false,
            autopause: true,
            sdkAppId: '',
            userID: 'not set',
            userSig: 'not set',
            roomID: 'not set',
            nickName: 'not set',
            avatar: 'not set'
        },
        goods_receipt_images:[]
    },
    path: 'pages/productDetail/productDetail',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    showAllText(){
        // console.log(this.data.remindText)
        this.setData({remindText:!this.data.remindText})
    },
    copyText(){
        let text = this.data.goods_text.replace(/<br\s*\/?>/g,'\n').replace(/&nbsp;/g,' ')
        copyText(text)
    },
    initData(options){
        if (this.data.goods_image == '') Helper.showLoading('加载中···', true, 3000)
        if(this.isInit) return
        this.isInit = true

        //创建播放组件上下文
        this.player = wx.createLivePlayerContext("player", this)

        //获取路由传递的商品编码
        let {code, flowId, type} = options;
        console.log(options)
        this.data.code   = code;
        this.data.flowId = flowId;
        this.data.type   = type;

        if (flowId) {
            if (type == 'inline') {
                this.setData({showLiveComponent: true})
            }
            this.getLive()
        }
        this.getDetailInfo(code, 0)
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
        console.log(this.data.CommonConfig.store_ensure)
    },

    onShow() {
        
    },
    toComment() {
        Navigate.productVideos(this.data.code).to()
    },
    getLive() {
        getStreamFlow({stream_id: this.data.flowId}).then(res => {
            if (this.data.type != 'inline') return
            if (res.info.ls_video != '') {
                this.setData({videoUrl: res.info.ls_video, showStreamVideo: true}, () => {
                    let VideoContext = wx.createVideoContext('index-video')
                    VideoContext.seek(res.info.ls_countdown)
                })
            } else {
                getApp().socketApi.setDo('stream_stop', () => {
                    this.setData({showLiveComponent: false});
                    Helper.showError('亲，您看的主播已下线')
                })
                this.data.pluginsInfo.playUrl = res.info.ls_rtmp_url_we
                this.setData({pluginsInfo: this.data.pluginsInfo}, () => {
                    this.data.liveRoomComponent = plugin.instance.getLiveRoomInstance();
                    console.log('playInfo', this.data.liveRoomComponent)
                    // this.data.liveRoomComponent.start();
                    this.player.play()
                })
            }
        })
    },
    onPlayEvent(e) {
        console.log(e)
        if (e.detail.code == -2301) {
            this.getLive()
        }
    },
    // 商品详情信息
    getDetailInfo(code, video) {
        let that = this
        Helper.showLoading()
        getDetail({code, video}).then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            let {goods_title,goods_text, goods_data, goods_image,goods_images,goods_receipt_images} = res.info
            console.log(res)
            goods_text = goods_text.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
           
            this.getPopUrl('1', (popRes) => {
                console.log(popRes)
                goods_text = goods_text + '<br/>抢购链接：'+popRes.info.wapExtendUrl
                that.setData({goods_title,goods_text, goods_data, goods_image,main_images:goods_images,goods_receipt_images})
            })
            that.setData({goods_title,goods_text, goods_data, goods_image,main_images:goods_images,goods_receipt_images})
            this.getGoodsImages()
            this.getAllLive()
            this.lookTalking(code)

            this.share = Share.instance().setType('goods').setTarget(this.data.code).setPage('productDetail').setParams({code: this.data.code}).setImage(goods_image).get();
            //this.mustShare()
        })
            .catch((err) => {
                console.log(err)
                Helper.showError('商品获取失败')
            })
    },
    imageLoad() {
        Helper.hideLoading()
    },
    //TODO:到底了，加载中，没有更多数据，粉丝，订单
    getGoodsImages(){
        this.data.goods_images = []
        getGoodsImages({code:this.data.code}).then(res=>{
            console.log(res)
            this.appendData('goods_images', res.info)
        })
    },
    previewImage(e) {
        let arr = JSON.parse(JSON.stringify(this.data.goods_images))
        if(e.currentTarget.dataset.type == 'main'){
            arr = JSON.parse(JSON.stringify(this.data.main_images))
        }
        previewImage(arr, e.currentTarget.dataset.index)
    },
    // 获取商品或店铺的推广链接
    getPopUrl(buy, callback) {
        console.log(this.data.flowId)
        getPopUrl({
            live_stream_id: this.data.flowId || '',
            goods_code: this.data.code,
            buy: buy,
            share_id: getApp().shareId
        }).then(res => {
            if(!res.status) return  Helper.showError(res.msg)
            console.log(res)
            callback(res)
        })
    },
    swiperChange(e){
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    Notify(data) {
        showNotify(data)
    },
    backToLive() {
        if(this.data.showLiveComponent)  return Navigate.back()
        // console.log(this.data.liveRoomId)
        Navigate.live(this.data.liveRoomId).to()
    },
    onShareAppMessage() {
        if (this.share) return this.share.to()
    },
    //保存图片方法
    saveImage(e) {
        let img = e.currentTarget.dataset.img
        if(img == 'receipt'){
            return console.log(111)
            return saveImage(this.data.goods_receipt_images)
        }
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
    getAllLive(){
      getGoodsLive({code:this.data.code}).then(res=>{
          console.log(res)
          if(!res.info.length) return
          this.data.liveRoomId = res.info[0].id
          console.log(this.data.liveRoomId)
          this.setData({hasLive:res.info.length?true:false})

      })
    },
    jump(e) {
        let url = e.currentTarget.dataset.url
        if (url.indexOf("pages") != -1) {
            return wx.navigateTo({
                url: url
            })
        }
        Navigate.instance().to(url)
    },
    //立即分享
    mustShare() {
        let that = this;
        Helper.showLoading('生成中')
        that.getPopUrl('0', (res) => {
            this.data.popUrl = res.info;
            let url = res.info.wapExtendUrl;
            genQrcode({content: url}).then((ress) => {
                console.log(ress)
                //Helper.hideLoading()
                that.setData({QRcode: ress.info.url}, () => {
                    that.createPoster();
                    that.onShareAppMessage();
                })
            })
        })
    },
    lookTalking(code, sort = 'default') {
        getVideos({code, sort}).then(res => {
            console.log(res)
            if (!res.status) return
            if (res.info.length > 0) {
                this.setData({
                    lookTalking: true
                })
            }
        }).catch(err=>{return})
    },
    select(e){
        let {index} = e.currentTarget.dataset;
        this.setData({checkIndex:index})
    },
    createPoster() {
        let config = {
            width: Helper.toRpx(642),
            height: Helper.toRpx(998),
            backgroundColor: '#FFF',
            debug: false,
            pixelRatio: 1,
            blocks: [
                {
                    x: Helper.toRpx(22),
                    y: Helper.toRpx(702),
                    paddingLeft: Helper.toRpx(10),
                    paddingRight: Helper.toRpx(10),
                    height: Helper.toRpx(25),
                    borderRadius: Helper.toRpx(10),
                    backgroundColor: '#4FBD97',
                    text: {
                        baseLine: 'middle',
                        text: '苏宁',
                        fontSize: Helper.toRpx(17),
                        color: '#FFF',
                    },
                }
            ],
            texts: [
                {
                    x: Helper.toRpx(95),
                    y: Helper.toRpx(714),
                    baseLine: 'middle',
                    lineNum: 2,
                    width: Helper.toRpx(514),
                    lineHeight: Helper.toRpx(30),
                    text: this.data.goods_title,
                    fontSize: Helper.toRpx(24),
                    color: '#666',
                },
                {
                    x: Helper.toRpx(22),
                    y: Helper.toRpx(822),
                    baseLine: 'middle',
                    text: '￥' + this.data.goods_data.commission.price,
                    fontSize: Helper.toRpx(42),
                    color: '#FB6B3D',
                },
                {
                    x: Helper.toRpx(96),
                    y: Helper.toRpx(892),
                    baseLine: 'middle',
                    text: '好友 ' + this.userInfo.user_nickname + ' 向您推荐',
                    fontSize: Helper.toRpx(18),
                    color: '#6A6A6A',
                },
                {
                    x: Helper.toRpx(96),
                    y: Helper.toRpx(918),
                    baseLine: 'middle',
                    text: '可享受苏宁易购内购优惠',
                    fontSize: Helper.toRpx(18),
                    color: '#6A6A6A',
                },
                {
                    x: Helper.toRpx(506),
                    y: Helper.toRpx(932),
                    baseLine: 'middle',
                    textAlign: 'center',
                    lineNum: 2,
                    width: Helper.toRpx(80),
                    text: '长按识别二维码去购买',
                    fontSize: Helper.toRpx(14),
                    color: '#666',
                },
            ],
            images: [
                {
                    width: Helper.toRpx(642),
                    height: Helper.toRpx(666),
                    x: Helper.toRpx(0),
                    y: Helper.toRpx(0),
                    url: this.data.goods_image,
                },
                {
                    width: Helper.toRpx(50),
                    height: Helper.toRpx(50),
                    x: Helper.toRpx(32),
                    y: Helper.toRpx(880),
                    borderRadius: Helper.toRpx(50),
                    url: this.userInfo.user_head,
                },
                {
                    width: Helper.toRpx(132),
                    height: Helper.toRpx(132),
                    x: Helper.toRpx(440),
                    y: Helper.toRpx(790),
                    url: this.data.QRcode,
                },
            ]
        }

        if (this.data.goods_data.commission.couponPrice) {
            let couponValue = parseFloat(this.data.goods_data.couponInfo.couponValue)
            config.images.push({
                width: Helper.toRpx(63),
                height: Helper.toRpx(33),
                x: Helper.toRpx(180),
                y: Helper.toRpx(806),
                url: "/static/img/youhuiquan-.png",
            })
            config.texts.push({
                x: Helper.toRpx(194),
                y: Helper.toRpx(824),
                baseLine: 'middle',
                text: '￥' + couponValue,
                fontSize: Helper.toRpx(21 - String(couponValue).length * 2),
                color: '#FB6B3D',
            })
        }

        console.log(config);
        this.setData({posterConfig: config}, () => {
            Poster.create();
        });
    }
    ,
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
    }
    ,
    onPosterFail(err) {
        Helper.hideLoading()
        console.error(err);
    }
    ,
//立即购买
    mustBuy() {
        this.getPopUrl('1', (res) => {
            console.log(res.info);
            this.data.popUrl = res.info;
            let url = res.info.spPageUrl;
            let appid = res.info.appId;
            wx.navigateToMiniProgram({
                appId: appid,
                path: url,
                success(res) {
                    console.log(res);
                }
            });
        })
    }
})