import {getDetail, getGoodsBrand,getBrandLive, getGoodsBrander, getGoodsBrandGoods} from "../../api/goods";
import Navigate from "../../utils/Navigate";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
Page({
  data: {
    GoodsDetail:[],
    Brander:'',
    BrandGoodsId:'',
    BrandGoodsPage:1
  },
  path: 'pages/brandDetail/brandDetail',
  onPreload(options) {
    console.log("Preload: " + this.path);
    this.initData(options)
  },
  initData(options) {
    if (this.isInit) return
    this.isInit = true

    let {id}               = options;
    this.data.BrandGoodsId = id
    this.getGoodsBrander(id)
  },
  onLoad(options) {
    if (!socketOnload(this, options)) return
    this.initData(options)
  },
  getGoodsBrandGoods(clear=true){
    if(this.loadingList) return Helper.hideLoading()
    this.loadingList = true
    if(clear){this.setData({GoodsDetail: [], BrandGoodsPage:1})
    }
    console.log(this.data.BrandGoodsPage)
    getGoodsBrandGoods({
      id       : this.data.BrandGoodsId,
      page_size: 6,
      page_no:this.data.BrandGoodsPage++
    }).then(res => {
      if(!res.status) return
      console.log(res)
      Helper.reSizeGoodsImage(res)
      this.appendData('GoodsDetail',res.info,()=>{
        this.loadingList = false;
        Helper.hideLoading()
       })
    })
  },
  toMemberVip(){
    Navigate.memberVip().to()
  },
  getGoodsBrander(param){
    Helper.showLoading()
    getGoodsBrander({id:param}).then(res=>{
      if(!res.status) return
      console.log(res)
      wx.setNavigationBarTitle({title: res.info.gb_title})
      this.setData({Brander:res.info})
      this.getGoodsBrandGoods()
    })
  },
  toDetail(e){
    Navigate.productDetail(e.currentTarget.dataset.code).to()
  },
  downScroll(){
    this.getGoodsBrandGoods(false)
    console.log('触底了')
  },
  scrollToUp(){
    this.getGoodsBrander(this.data.BrandGoodsId)
  }
})