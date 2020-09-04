import {getUserUpgrade, inviteQrcode} from "../../api/user";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Poster from "../../miniprogram_npm/wxa-plugin-canvas/poster/poster";
import {previewImage, saveImage} from "../../utils/btn";

Page({
    data:{
        isVip:true,
        upgrade:{},
        size:0,
        progress:{},
        showShare    : true,
        posterConfig : {},
        canvasImg    : '',
        shareQrcode  : '',
    },
    onLoad(options){
        if (!socketOnload(this, options)) return

        let {type} = options
        console.log(options)
        if(type == 'vip'){
            this.data.isVip = true
        }else{
            this.data.isVip = false
        }
        this.setData({isVip:this.data.isVip})
        if(this.data.isVip){
            wx.setNavigationBarTitle({
                title:'超级会员'
            })
        }else{
            wx.setNavigationBarTitle({
                title:''
            })
        }
        this.getUserUpgrade()
        this.getPixelRatio()
    },
    getUserUpgrade(){
        Helper.showLoading()
        getUserUpgrade().then(res=>{
            if(!res.status){
                Helper.hideLoading()
                return Helper.showError(res.msg)
            }
            console.log(res)
            this.setData({upgrade:res.info})
            this.data.progress.fans = res.info.now_fans_num / res.info.up_fans_num * 100
            this.data.progress.order = res.info.now_order_num / res.info.up_order_num * 100
            console.log(this.data.progress)
            this.setData({progress:this.data.progress}, () => {
                Helper.hideLoading()
            })
        })
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
    }
})
