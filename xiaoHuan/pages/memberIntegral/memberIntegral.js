import {getTaskConfig, getTodayIntergral, inviteQrcode, userGet, userSign} from '../../api/user'
import {errMsg, previewImage, saveImage, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';
import {getLiveQrcode} from "../../api/live";
import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        integral     : '',
        taskList     : [],
        userImg      : '',
        userName     : '',
        level        : '',
        multiple     : 0,
        loadingFlag  : [false, false],
        showShare    : true,
        posterConfig : {},
        canvasImg    : '',
        shareQrcode  : '',
    },
    onLoad() {
        if (!socketOnload(this)) return
        this.data.isEnter = true

        this.initPageData(this.checkLoading);
        this.data.userImg = this.userInfo.user_head
        this.setData({
            userImg : this.userInfo.user_head,
            userName: this.userInfo.user_nickname
        })
    },
    onShow() {
        // getApp().socketApi.setDo('integral', (res) => {
        //     console.log(res)
        //     this.showNotify(res)
        // })
        if(this.data.isEnter) this.initPageData(this.checkLoading, this.data.taskList.length <= 0);
    },
    checkLoading() {
        if (this.data.loadingFlag.indexOf(false) == -1) {
            Helper.hideLoading()
            this.data.loadingFlag = [false, false]
        }
    },
    Notify(data) {
        showNotify(data)
    },
    toSign(){
        userSign().then(res=>{
            if(!res.status) return Helper.showError(res.msg)
            console.log(res)
            Notify({type:'success',message:res.msg})
            this.getNowIntergral()
        })
    },
    initPageData(callback, showLoading = true) {
        if (showLoading) {
            Helper.showLoading()
        }
        getTaskConfig().then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            console.log(res)
            this.data.loadingFlag[0] = true
            res.info.tasks.sign.sign = true
            callback()
            this.setData({
                taskList: res.info.tasks,
                multiple: res.info.user_multiple
            })
        })
        let fun = () => {
            this.data.loadingFlag[1] = true
            callback()
        }
        this.getNowIntergral(fun)
    },
    getNowIntergral(callback){
        getTodayIntergral().then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            console.log(res)
            if(callback)callback()
            this.setData({integral: res.info.integral})
        })
    },
    //获取二维码
    toInvite() {
        Helper.showLoading('生成中', true, 0)
        inviteQrcode().then((res) => {
            if (!res.status) return Helper.showError(res.msg)
            this.setData({shareQrcode: res.info.url})
            this.createPoster()
        })
    },
    jump() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
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
                    text    : '好友 ' + this.data.userName + ' 邀请您加入',
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
                    url         : this.data.userImg,
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
    }
})