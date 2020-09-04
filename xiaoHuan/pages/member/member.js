import {
    getFansNum,
    userGet,
    getCommissions,
    getAdvert,
    signHistory,
    isSingn,
    userSign,
    getOrderNum,
    inviteQrcode
} from '../../api/user'
import Poster from "../../miniprogram_npm/wxa-plugin-canvas/poster/poster";
import {getMemberMore} from '../../api/api'
import {copyText, errMsg, showNotify} from '../../utils/btn'
import checkType from "../../utils/checkType";
import {createShare} from "../../api/share";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import {previewImage, saveImage} from "../../utils/btn";

Page({
    data: {
        //是否展示侧边栏
        show: false,
        //粉丝数据
        fansInfo: {},
        //用户数据
        userInfo: {},
        //收益数据
        commissionsInfo: {},
        //订单数据
        orderInfo:{},
        //广告数据
        advertList: [],
        //是否为主播
        isStreamer: false,
        //是否展示菜单
        easter: false,
        //彩蛋计数器
        num: 0,
        //判断数据加载是否完成的数组
        loadingFlag: [false, false, false,false],
        moreList:[],
        showShare    : true,
        posterConfig : {},
        canvasImg    : '',
        shareQrcode  : '',
        barTop       : '',
        statusBar    : ''

    },
    startLive(e){
        let url = e.currentTarget.dataset.url
        let userInfo = this.data.userInfo
        if(userInfo.user_level > 1 || userInfo.user_streamer){
            Navigate.liveDetail().to()
        }else{
            Navigate.memberVip().to()
        }
    },
    copyTeach(e){
        let text = e.currentTarget.dataset.text
        let str = '您的专属导师微信号：'+text+'\n关于省钱赚钱的问题，请复制微信号\n去添加微信好友咨询吧\n添加时请备注：' + this.data.CommonConfig.store_title
        Dialog.confirm({
            title:'提示',
            message:  str,
            confirmButtonText:'复制微信',
            closeOnClickOverlay:true
        }).then(() => {
            // on close
            copyText(text)
        }).catch(()=>{

        })
    },
    initData() {
        let showLoading = !this.userInfo;

        this.userInfo = wx.getStorageSync('userInfo');
        this.setDataStorage({isStreamer: this.userInfo.user_streamer !== 0})

        userGet().then(res => {
            if (!res.status) return Navigate.login().redirect();
            this.userInfo = res.info
            this.setData({CommonUserLevel: this.userInfo.user_level || 0})
            wx.setStorage({
                key : 'userInfo',
                data: this.userInfo
            })
            this.setDataStorage({userInfo: this.userInfo})
            this.setDataStorage({isStreamer: this.userInfo.user_streamer !== 0})
        })

        this.getUserInfo(this.checkLoading, showLoading)
        this.share = Share.instance().get()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        wx.hideTabBar()
        let top = wx.getMenuButtonBoundingClientRect().top
        let statusBar = wx.getSystemInfoSync().statusBarHeight
        console.log(statusBar)
        this.setData({barTop:Helper.toRpx(top),statusBar:Helper.toRpx(statusBar)})

    },
    onShow(){
        this.initData()
    },
    //展示侧边栏
    showPopup() {
        this.setData({show: true})
    },
    //关闭侧边栏
    closePopup() {
        this.setData({show: false})
    },
    //获取会员页信息 callback数据加载完成后的回调
    getUserInfo(callback, showLoading = true) {
        if(showLoading) Helper.showLoading()
        //获取粉丝数量
        getFansNum().then((res) => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            this.data.loadingFlag[0] = true
            this.setDataStorage({fansInfo: res.info})
            callback()
        }).catch((err) => {

        })
        //获取预估收益
        getCommissions().then((res) => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            this.data.loadingFlag[1] = true
            this.setDataStorage({commissionsInfo: res.info})
            callback()
        })
        //获取广告图片列表
        getAdvert().then((res) => {
            if(!res.status){
                return Helper.showError(res.msg)
            }
            // console.log(res);
            this.data.loadingFlag[2] = true
            this.setDataStorage({advertList: res.info})
            callback()
        })
        getMemberMore().then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            // console.log(res)
            callback()
            this.setDataStorage({moreList:res.info})
        })
        getOrderNum().then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            this.data.loadingFlag[3] = true
            this.setDataStorage({orderInfo:res.info})
            console.log(res)
            callback()
        })
    },
    clickCount:0,
    showWechatPay(){
        /*this.clickCount++
        if(this.clickCount == 10){
        	wx.request({
        		method:'GET',
        		url:'https://test.iyizhanke.com/api/pay',
        		data:{openid:wx.getStorageSync('userInfo').user_wechat_openid},
        		success: (res) => {
        			console.log(res);
        			wx.requestPayment({
        				timeStamp:res.data.info.timeStamp,
        				nonceStr:res.data.info.nonceStr,
        				package:res.data.info.package,
        				signType:res.data.info.signType,
        				paySign:res.data.info.paySign,
        				success: (payRes) => {
        					console.log(payRes);
        				},
        				fail(err) {
        					console.log(err);
        				}
        			})
        		}
        	})
        	this.clickCount = 0
        }*/
    },
    getPixelRatio(){
        let pixelRatio
        let that = this
        wx.getSystemInfo({
            success: function (res) {
                pixelRatio = res.screenWidth / 750
                // console.log(res)
                that.data.pixelRatio = pixelRatio
                // console.log(pixelRatio)
                that.getCircleInfo()
            },
            fail: function () {
                pixelRatio = 0
            }
        })
    },
    getCircleInfo(){
        this.setData({size:132*this.data.pixelRatio})
    },
    toInvite() {
        Helper.showLoading('生成中', true, 0)
        inviteQrcode().then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.setData({shareQrcode: res.info.url})
            this.createPoster()
        })
    },
    //TODO:邀请码生成问题
    createPoster() {
        let config = {
            width          : Helper.toRpx(651),
            height         : Helper.toRpx(955),
            debug          : false,
            pixelRatio     : 1,
            blocks         : [],
            texts          : [
                {
                    x       : Helper.toRpx(150),
                    y       : Helper.toRpx(805),
                    baseLine: 'middle',
                    text    : '好友 ' + this.userInfo.user_nickname + ' 邀请您加入',
                    fontSize: Helper.toRpx(20),
                    width   : Helper.toRpx(250),
                    color   : '#853933',
                },
                {
                    x       : Helper.toRpx(150),
                    y       : Helper.toRpx(835),
                    baseLine: 'middle',
                    text    : this.data.CommonConfig.store_title,
                    fontSize: Helper.toRpx(20),
                    color   : '#853933',
                },
            ],
            images         : [
                {
                    width : Helper.toRpx(651),
                    height: Helper.toRpx(955),
                    x     : Helper.toRpx(0),
                    y     : Helper.toRpx(0),
                    url   : this.data.CommonConfig.store_poster,
                },
                {
                    width       : Helper.toRpx(80),
                    height      : Helper.toRpx(80),
                    x           : Helper.toRpx(50),
                    y           : Helper.toRpx(780),
                    borderRadius: Helper.toRpx(80),
                    url         : this.userInfo.user_head,
                },
                {
                    width : Helper.toRpx(150),
                    height: Helper.toRpx(150),
                    x     : Helper.toRpx(450),
                    y     : Helper.toRpx(750),
                    url   : this.data.shareQrcode,
                },
            ]
        }

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
    },
    toCommission(e){
        Navigate.memberGain(e.currentTarget.dataset.type).to()
    },
    toFans(e){
        Navigate.memberFans(e.currentTarget.dataset.type).to()
    },
    //普通页面跳转方法
    jump(e) {
        let url = e.currentTarget.dataset.url
        if(url.indexOf("pages") != -1){
            return wx.navigateTo({
                url: url
            })
        }
        Navigate.instance().to(url)
    },
    //根据数据类型进行页面跳转方法
    jumpPage(e) {
        let params = e.currentTarget.dataset
        console.log(params);
        checkType(params.type, params)
    },
    //判断数据是否加载完成
    checkLoading() {
        // console.log(this.data.loadingFlag)
        if (this.data.loadingFlag.indexOf(false) === -1) {
            // console.log(111)
            Helper.hideLoading()
            this.data.loadingFlag = [false,false,false,false]
        }
    },
    //复制邀请码
    copyCode(e) {
        let {text} = e.currentTarget.dataset
        copyText(text)
    },
    //通知栏方法
    Notify(data) {
        showNotify(data)
    },
    //我就是那个邱继凯  小彩蛋
    easter() {
        this.setData({easter: !(++this.data.num % 10)})
    },
    logout(){
        wx.clearStorageSync()
        Navigate.index().switchTab()
    },
    toMemberVip(){
        Navigate.memberVip('vip').to()
    },
    onShareAppMessage() {
        if(this.share) return this.share.to()
    },
})