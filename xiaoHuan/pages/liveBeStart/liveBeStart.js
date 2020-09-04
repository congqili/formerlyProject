import {startLive, getSelfLive, getLiveGoodsList, goodsTop} from '../../api/live'
import {createShare} from '../../api/share'
import {showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import {AppConfig} from "../../config/config";
let plugin = requirePlugin("liveRoomPlugin")
Page({
    data: {
        //直播间信息
        streamInfo: {},
        //商品列表是否展示
        showProduct: false,
        //商品列表
        goodsList: [],
        //开播时间
        time: '',
        showBar:false,
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
        liveRoomPushComponent:null
    },
    showBar(){
        this.setData({showBar:true})
    },
    mirror(){
        this.data.pluginsInfo.mirror = !this.data.pluginsInfo.mirror
        this.setData({pluginsInfo:this.data.pluginsInfo},()=>{
            console.log(this.data.pluginsInfo.mirror)
        })
    },
    turn(){
        this.data.liveRoomPushComponent.switchCamera()
        this.data.pluginsInfo.devicePosition = this.data.pluginsInfo.devicePosition == 'front'?'back':'front'
        console.log(this.data.pluginsInfo.devicePosition);
    },
    onSkin(event) {
        let skinNum = Math.floor(event.detail.value / 10);
        console.log(skinNum)
        this.data.pluginsInfo.whiteness = skinNum
        this.setData({pluginsInfo:this.data.pluginsInfo})
    },
    //滤镜
    onFilter(event) {
        let filterNum = Math.floor(event.detail.value / 10);
        console.log(filterNum)
        this.data.pluginsInfo.beauty = filterNum
        this.setData({pluginsInfo:this.data.pluginsInfo})
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.data.isEnter = true
        this.initStartLive()
    },
    closeProduct() {
        this.setData({showProduct: false,showBar:false})
    },
    openProduct() {
        this.setData({showProduct: true})
    },
    //开始直播
    startLive() {
        startLive().then(res => {
            console.log(res)
            if(res.status==true){
                wx.setStorageSync("pluginsInfo", this.data.pluginsInfo);
                Navigate.livePush().redirect()
            }else {
                console.log(res.msg)
            }
        })
    },
    //初始化开始直播间数据
    initStartLive() {
        getSelfLive().then(res => {
            console.log(res)
            this.data.streamerInfo = res.info
            this.data.pluginsInfo.pushUrl = res.info.live_stream_data.ls_stream_we
            this.data.pluginsInfo.mode = res.info.live_stream_data.ls_sharpness

            this.setData({streamInfo: res.info,pluginsInfo:this.data.pluginsInfo},()=>{
                this.data.liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance();
                this.data.liveRoomPushComponent.startPreview();
            })
            this.timeFilter(res.info.live_stream_data.ls_start_time)

            this.share = Share.instance().setType('live_stream').setTarget(res.info.live_stream_data.id).setPage('live').setParams({id: res.info.id}).setTitle(res.info.live_stream_data.ls_title).setImage(res.info.live_stream_data.ls_image).get()

            getLiveGoodsList({id: res.info.live_stream_data.id}).then(goodsRes => {
                Helper.reSizeGoodsImage(goodsRes)
                this.setData({goodsList: goodsRes.info})
            })
        })
    },
    onShow() {
       if(this.data.isEnter) this.initStartLive()
    },
    toSelect() {
        Navigate.liveSelectProduct('live').to()
    },
    back() {
        Navigate.back()
    },
    //置顶商品
    goodsTop(e) {
        let {index, code} = e.currentTarget.dataset;
        goodsTop({goods_code: code}).then((res) => {
            if (res.status) {
                let goodsData = this.data.goodsList.splice(index, 1)
                goodsData = goodsData.concat(this.data.goodsList)
                this.setData({goodsList: goodsData}, () => {
                    console.log(this.data.goodsList)
                })
            }
        })
    },
    //过滤时间格式
    timeFilter(str) {
        // console.log(str)
        let arr = str.split(' ')
        let date = arr[0].split('-')
        let time = arr[1].split(':')
        // console.log(date,time)
        this.setData({time: date[1] + '月' + date[2] + '日' + time[0] + ':' + time[1]})
    },
    Notify(data){
      showNotify(data)
    },
    onShareAppMessage() {
        if(this.share) return this.share.to()
    }
})