import {getDetail, getPopUrl, getVideos} from '../../api/goods'
import {previewImage, filterPrice, showNotify, saveImage} from '../../utils/btn'
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import {genQrcode} from "../../api/user";
import Poster from "../../miniprogram_npm/wxa-plugin-canvas/poster/poster";
Page({
    data: {
        goodsInfo: {},
        code: '',
        videoList: [],
        goods_title: '',
        showShare: true,
        canvasImg: '',
        posterConfig: {},
        flowId:'',
        //商品数据
        goods_data: {},
        goods_image:'',
        QRcode:''
    },
    onLoad(options) {

        if (!socketOnload(this, options)) return
        this.data.code = options.code
        this.getGoodsInfo(options.code, 0)
        this.getVideos(options.code)
        Helper.showLoading()
    },
    //获取商品信息
    getGoodsInfo(code, video) {
        getDetail({code, video}).then((res) => {
            Helper.hideLoading()
            // console.log(res.info)
            let { goods_title, goods_data, goods_image} = res.info
            this.setData({
                goodsInfo: res.info,
                goodsPrice: filterPrice(res.info.goods_data.commission.price),
                goods_data,
                goods_title,
                goods_image,
            })

            this.share = Share.instance().setType('goods').setTarget(this.data.code).setPage('productVideos').setParams({code: this.data.code}).setImage(this.data.goodsInfo.goods_image).get()
            // console.log(filterPrice(res.info.goods_data.commission.price))
        })
            .catch((err) => {
                Helper.hideLoading()
                console.log(err)
            })
    },
    //前往详情页
    goDetail() {
        console.log(this.data.code)
        Navigate.productDetail(this.data.code).to()
    },
    // 商品详情信息
    //TODO:memberVip海报层级 海报保存
    toShortVideo(e) {
        let {id} = e.currentTarget.dataset
        Navigate.productVideo(id).to()
    },
    //获取所有商品讲解视频
    getVideos(code, sort = 'default') {
        getVideos({code, sort}).then((res) => {
            Helper.hideLoading()
            this.setData({videoList: res.info})})
            .catch((err) => {
                Helper.hideLoading()
                console.log(err)
            })
    },
    previewImage(e) {
        let {src} = e.currentTarget.dataset
        if (typeof src == 'string') {
            previewImage([src])
        } else {
            previewImage(src)
        }
    },
    onShareAppMessage() {
        if(this.share) return this.share.to()
    },
    Notify(data) {
        showNotify(data)
    },
    //立即购买。。。。。。。。。。。。。。。。。
    mustBuy(){
        this.getPopUrl('1',(res)=>{
            console.log(res.info);
            this.data.popUrl = res.info;
            let url = res.info.spPageUrl;
            let appid = res.info.appId;
            wx.navigateToMiniProgram({
                appId: appid,
                path : url,
                success(res) {
                    console.log(res);
                }
            });
        })
    },
    //立即分享。。。。。。。。。。。。。。。
    mustShare(){
        Helper.showLoading('生成中', true, 0)
        let that = this;
        that.getPopUrl('0', (res) => {
            this.data.popUrl = res.info;
            let url = res.info.wapExtendUrl;
            genQrcode({content: url}).then((ress) => {
                console.log(ress)
                Helper.hideLoading()
                that.setData({QRcode: ress.info.url}, () => {
                    that.createPoster();
                    that.onShareAppMessage();
                })
            })
        })
    },
    toggleShare(){
        this.setData({
            showShare: true
        })
    },
    //图片预览方法
    previewImagea() {
        let url = this.data.canvasImg
        previewImage([url])
    },
    //保存图片方法
    saveImage() {
        let url = this.data.canvasImg
        saveImage(url)
    },
    // 获取商品或店铺的推广链接
    getPopUrl(buy,callback) {
        console.log(this.data.flowId)
        getPopUrl({
            live_stream_id: this.data.flowId||'',
            goods_code: this.data.code,
            buy: buy,
            share_id: getApp().shareId
        }).then(res => {
            console.log(res)
            callback(res)
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
    //生成二维码
    createPoster() {
        let config = {
            width          : Helper.toRpx(642),
            height         : Helper.toRpx(998),
            backgroundColor: '#FFF',
            debug          : false,
            
            pixelRatio     : 1,
            blocks         : [
                {
                    x              : Helper.toRpx(22),
                    y              : Helper.toRpx(702),
                    paddingLeft    : Helper.toRpx(10),
                    paddingRight   : Helper.toRpx(10),
                    height         : Helper.toRpx(25),
                    borderRadius   : Helper.toRpx(10),
                    backgroundColor: '#4FBD97',
                    text           : {
                        baseLine: 'middle',
                        text    : '苏宁',
                        fontSize: Helper.toRpx(17),
                        color   : '#FFF',
                    },
                }
            ],
            texts: [
                {
                    x         : Helper.toRpx(95),
                    y         : Helper.toRpx(714),
                    baseLine  : 'middle',
                    lineNum   : 2,
                    width     : Helper.toRpx(514),
                    lineHeight: Helper.toRpx(30),
                    text      : this.data.goods_title,
                    fontSize  : Helper.toRpx(24),
                    color     : '#666',
                },
                {
                    x       : Helper.toRpx(22),
                    y       : Helper.toRpx(822),
                    baseLine: 'middle',
                    text    : '￥' + this.data.goods_data.commission.price,
                    fontSize: Helper.toRpx(42),
                    color   : '#FB6B3D',
                },
                {
                    x       : Helper.toRpx(96),
                    y       : Helper.toRpx(892),
                    baseLine: 'middle',
                    text    : '好友 ' + this.userInfo.user_nickname + ' 向您推荐',
                    fontSize: Helper.toRpx(18),
                    color   : '#6A6A6A',
                },
                {
                    x       : Helper.toRpx(96),
                    y       : Helper.toRpx(918),
                    baseLine: 'middle',
                    text    : '可享受苏宁易购内购优惠',
                    fontSize: Helper.toRpx(18),
                    color   : '#6A6A6A',
                },
                {
                    x        : Helper.toRpx(506),
                    y        : Helper.toRpx(932),
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
                    width : Helper.toRpx(642),
                    height: Helper.toRpx(666),
                    x     : Helper.toRpx(0),
                    y     : Helper.toRpx(0),
                    url   : this.data.goods_image,
                },
                {
                    width       : Helper.toRpx(50),
                    height      : Helper.toRpx(50),
                    x           : Helper.toRpx(32),
                    y           : Helper.toRpx(880),
                    borderRadius: Helper.toRpx(50),
                    url         : this.userInfo.user_head,
                },
                {
                    width       : Helper.toRpx(132),
                    height      : Helper.toRpx(132),
                    x           : Helper.toRpx(440),
                    y           : Helper.toRpx(790),
                    url         : this.data.QRcode,
                },
            ]
        }

        if(this.data.goods_data.commission.couponPrice){
            let couponValue = parseFloat(this.data.goods_data.couponInfo.couponValue)
            config.images.push({
                width       : Helper.toRpx(63),
                height      : Helper.toRpx(33),
                x           : Helper.toRpx(180),
                y           : Helper.toRpx(806),
                url         : "/static/img/youhuiquan-.png",
            })
            config.texts.push({
                x       : Helper.toRpx(194),
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
})