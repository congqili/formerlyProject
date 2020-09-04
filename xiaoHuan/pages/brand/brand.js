// pages/supBrand/supBrand.js
import {getDetail, getGoodsBrand,getBrandLive, getGoodsBrander, getGoodsBrandGoods} from "../../api/goods";
import {getBrandTopPit} from "../../api/api"
import {wxLogin} from "../../api/user";
import {getVideo, likeLike} from "../../api/live";
import Navigate from "../../utils/Navigate";
import {filterPrice} from "../../utils/btn";
import Share from "../../utils/Share";
import Helper from "../../utils/Helper";
import checkType from "../../utils/checkType";
import {socketOnload} from "../../utils/socketBtn";

Page({
    data: {
        active: 1,
        goods:['推荐','热门','生鲜','视频','家具','个护','女装'],
        goodsBrands:[],
        brandTopPit:[]
    },
    path: 'pages/brand/brand',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.initData(options)
    },
    initData(options) {
        if (this.isInit) return
        this.isInit = true

        this.getGoodsBrand(true)
        this.getBrandTopPit()
    },
    onLoad(options){
        if (!socketOnload(this, options)) return
        wx.hideTabBar()
        this.initData(options)
    },
    onChange(event) {
    },
    toDetail(e){
      Navigate.productDetail(e.currentTarget.dataset.code).to()
    },
    getGoodsBrand(clear=true){
        let that = this
        if(clear){
            this.setData({goodsBrands: []})
        }
        Helper.showLoading();
        getGoodsBrand().then(res=>{
            this.appendData('goodsBrands', res.info, () => {
                if(!res.info.length) Helper.hideLoading();
                for (let i = 0; i < res.info.length; i++) {
                    getGoodsBrandGoods({
                        id       : res.info[i].id,
                        page_size: 3
                    }).then(GoodsRes => {
                        Helper.reSizeGoodsImage(GoodsRes)
                        console.log(GoodsRes.info);
                        let key = 'goodsBrands[' + i + '].goodsList'
                        that.setData({[key]: GoodsRes.info}, () => {
                            Helper.hideLoading()
                        })
                    })
                    getBrandLive({id:res.info[i].id}).then(liveRes=>{
                        console.log(liveRes,res.info[i].id)
                        if(liveRes.info.length>0){
                            let key = 'goodsBrands[' + i + '].live'
                            that.setData({[key]: liveRes.info[0]}, () => {
                                console.log(this.data.goodsBrands)
                                Helper.hideLoading()
                                // that.setDataStorage({goodsBrands: this.data.goodsBrands})
                            })
                        }
                    })
                }
            })
        })
    },
    bindToLive(e){
        let {id,videoid} = e.currentTarget.dataset
        Navigate.live(id,videoid).to()
    },
    getBrandTopPit(){
        getBrandTopPit().then(res=>{
            console.log(res)
            this.setDataStorage({
                brandTopPit:res.info
            })
        })
    },
    toLive(){
        let params = e.currentTarget.dataset
        console.log(params);
        checkType(params.type, params,this)
    },
    downScroll(){
        console.log('触底')
    },
    toBrandDetail(param){
        let {id}=param.currentTarget.dataset;
        console.log(id)
        Navigate.brandDetail(id).to()
    },
    scrollToUp(){
        Helper.showLoading()
        this.getGoodsBrand(true)
        this.getBrandTopPit()
    },
})