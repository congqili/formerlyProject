// pages/liveSquare/liveSquare.js
import Navigate from "../../utils/Navigate";
import {getGoodsExplain,getLiveSquare} from '../../api/api'
import Helper from "../../utils/Helper";
import {filterPrice} from '../../utils/btn'
import checkType from "../../utils/checkType";

Page({
    data: {
        goods_explainStart:[],
        goods_explain: [],
        checkIndex:0,
        page_no:1,
        stream_page:1,
        page_noStart:1,
        streamers:[],
        liveOver:false
    },
    //todo 直播没有数据先用的商品讲解的
    onLoad(query) {
        this.getGoodsExplain()
        this.getStreams()
        wx.hideTabBar()
    },
    onPageScroll(e){
    },
    select(e){
        let {index} = e.currentTarget.dataset;
        this.setData({checkIndex:index},()=>{
            if(index==0){
                // this.getStreams()
            }else {
                this.getGoodsExplain()
            }

        })
    },
    jumpPage(e) {
        //商品编码
        let params = e.currentTarget.dataset
        console.log(params);
        checkType(params.type, params,this)
    },
    //获取所有商品讲解视频
    getGoodsExplain(clear = true) {
        // if(this.data.checkIndex!=1) return
        if (this.loadingList) return
        this.loadingList = true
        // Helper.showLoading();
        if(clear){
            this.setData({goods_explain:[]})
        }
        getGoodsExplain({
            page_no: clear?1:++this.data.page_no,
            page_size:8
        }).then((res) => {
            Helper.hideLoading()
            // console.log(res)
            wx.stopPullDownRefresh()
            if(!res.status){
                this.loadingList = false
            }
            res.info.map((item,index)=>{
                let price                                                       = item.layout_link_data.lg_goods_data.goods_data.commission.price
                item.layout_link_data.lg_goods_data.goods_data.commission.price = filterPrice(price)
            })
            // let result = clear?res.info:this.data.goods_explain.concat(res.info)
            this.appendData('goods_explain' , res.info,()=>{
                this.loadingList = false
                console.log(this.data.goods_explain)
            })
        })
            .catch((err) => {
                Helper.hideLoading()
                console.log(err)
            })
    },
    onPullDownRefresh(){
        this.getStreams()
        this.getGoodsExplain()
    },
    //获取直播
    getStreams(clear = true){
        if(this.loadStreamers)return
        this.loadStreamers = true
        if(clear){
            this.setData({streamers:[]})
        }
        getLiveSquare({
            page_no:clear?1:++this.data.stream_page,
            page_size:1000
        }).then((res) => {
            console.log(res)
            this.loadStreamers = false
            this.data.loadingList = false
            this.setData({pulldown:false})
            if(!res.info.length)this.data.liveOver = true
            this.appendData('streamers',res.info,()=>{

            })
        })
    },
    startLive(){
        if(this.data.CommonUserLevel>1 || this.userInfo.user_streamer){
            Navigate.liveDetail().to()
        }else{
            Navigate.memberVip().to()
        }
    },
    // getStreams(clear = true){
    //     if(this.data.checkIndex=1) return
    //     if (this.loadingListStart) return
    //     this.loadingListStart = true
    //     Helper.showLoading();
    //     console.log(this.data.checkIndex)
    //     getStreams({
    //         page_no: clear?1:++this.data.page_noStart,
    //         page_size:8
    //     }).then((res) => {
    //         Helper.hideLoading()
    //         console.log(res)
    //         this.loadingListStart = false
    //
    //         res.info.map((item,index)=>{
    //             let price                                                       = item.layout_link_data.lg_goods_data.goods_data.commission.price
    //             item.layout_link_data.lg_goods_data.goods_data.commission.price = filterPrice(price)
    //         })
    //         let result = clear?res.info:this.data.goods_explainStart.concat(res.info)
    //         this.setData({goods_explainStart: result})})
    //         .catch((err) => {
    //             Helper.hideLoading()
    //             console.log(err)
    //         })
    // },
    onReachBottom(){
      this.onViewScroll()
    },
    customPullDown(){
        this.onPullDownRefresh()
    },
    onViewScroll(){
        if(this.data.liveOver){
            this.getGoodsExplain(false)
        }else{
            this.getStreams(false)
        }
    }
})