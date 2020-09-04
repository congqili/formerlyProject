import {getOrderList, userGet} from '../../api/user'
import {changTimeFormat, showNotify,filterPrice} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data:{
        userInfo:{},
        isStreamer:false,
        orderList_all:[],
        orderList_pay:[],
        orderList_receipt:[],
        orderList_fail:[],
        setTime: new Date().getTime(),
        // minTime: new Date().getTime(),
        maxTime: new Date().getTime(),
        showTime: false,
        active:0,
        tabIndex:0,
        status:'all',
        pages:{
            all: 0,
            pay: 0,
            receipt: 0,
            fail: 0
        }
    },
    onLoad(){
        if (!socketOnload(this)) return
        this.share = Share.instance().get();
        if (this.userInfo.user_streamer !== 0) {
            this.setData({isStreamer: true})
        } else {
            this.setData({isStreamer: false})
        }
        this.setData({userInfo: this.userInfo})
        this.getOrderList(true)
    },
    clearTime(){
        this.setData({time:''})
        this.getOrderList()
    },
    onChangeTab(e) {
        this.data.status = ['all', 'pay', 'receipt', 'fail'][e.detail.index]
        if(this.data.pages[this.data.status] == 0 || this.time != '') this.getOrderList(true);
    },
    tabSelect(e){

    },
    Notify(data) {
        showNotify(data)
    },
    onReachBottom() {
        this.getOrderList(true);
    },
    onShareAppMessage() {
        if(this.share) return this.share.to();
    },
    //确认时间
    onTime(e) {
        let time = this.changeTime(e.detail)
        console.log(time);
        this.setData({
            time,
            showTime: false
        })
        this.getOrderList(true)
    },
    getOrderList(clear=false){
        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        if(clear) this.data.pages[this.data.status] = 0
        getOrderList({
            status   : this.data.status,
            date     : this.data.time,
            page_no  : ++this.data.pages[this.data.status],
            page_size: 10
        }).then(res => {
            Helper.hideLoading()
            this.loadingList = false
            console.log(res)
            if (res.status) {
                let key = 'orderList_' + this.data.status;
                if(res.info.list.length){
                    Helper.reSizeGoodsImage(res)
                    let orderList = clear ? res.info.list : this.data[key].concat(res.info.list)
                    this.setData({[key]: orderList})
                }else{
                    if(clear){
                        this.setData({[key]: []})
                        //Helper.showError('没有数据')
                    }else{
                        //Helper.showError('没有更多数据了')
                    }
                }
            } else {
                Helper.showError(res.msg)
            }
        }).catch((err) => {
            this.loadingList = false
            Helper.showError('数据获取失败')
        })
    },
    checkTime() {
        this.setData({
            showTime: true
        })
    },
    cancelTime() {
        this.setData({
            showTime: false
        })
    },
    //修改时间
    changeTime(time) {
        return changTimeFormat(time)
    },
    //下拉加载
    scrollDown(){
        this.getOrderList()
    },
    //清除日期
    cleanIpt(){
        this.setData({time:''})
        this.getOrderList(true)
    },
    toGoodsDetail(e){
        let code = e.currentTarget.dataset.code;
        Navigate.productDetail(code).to()
    },
    toMemberVip(){
        Navigate.memberVip().to()
    }
})
