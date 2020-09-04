import {getGoodsList} from '../../api/goods'
import {errMsg, filterPrice, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
// import {getCategoryAdvert} from "../../api/api";
import checkType from "../../utils/checkType";
import {userGet} from "../../api/user";

Page({
    data: {
        page_no: 1,
        page_size: 10,
        goodsList: [],
        id: '',
        skeletonLoading:true,
        keywords:'',
        advertImage:'',
        loadData:{
            status:'noMore',
            title:'暂无商品',
            show:false,
            color:"#f9f7f3"
        }
    },
    path: 'pages/productList/productList',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (!this.data.goodsList.length) Helper.showLoading('加载中···', true, 3000)
        if (this.isInit) return
        this.isInit = true

        let {id, title, keywords, image} = options
        keywords                         = decodeURIComponent(keywords)
        this.data.keywords               = keywords
        title                            = decodeURIComponent(title)
        wx.setNavigationBarTitle({
            title: keywords ? '"' + keywords + '"' + '的搜索结果' : title
        })
        if (image && image != '') {
            this.setData({advertImage: decodeURIComponent(image)})
        }
        this.data.id = id;
        this.getProductListData()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    //前往商品讲解
    toComment(e) {
        let {code} = e.currentTarget.dataset
        Navigate.productDetail(code).to()
    },
    //下拉刷新
    onPullDownRefresh() {
        this.getProductListData(true)
    },
    jumpPage(e){
        let params = e.currentTarget.dataset
        console.log(params);
        checkType(params.type, params)
    },
    /*getAdvertImage(){
        getCategoryAdvert().then(res=>{
            console.log(res)
            this.setData({advertImage:res.info})
        })
    },*/
    getProductListData(clear = true){
        if(this.loadingList) return
        this.loadingList = true

        // Helper.showLoading()
        if(clear){
            this.data.page_no = 0
            this.setData({goodsList: []})
        }
        this.data.page_no++

        this.data.loadData.show = true
        this.data.loadData.status = 'load'
        this.setData({loadData:this.data.loadData})

        getGoodsList({
            category:this.data.id,
            page_no:this.data.page_no,
            keywords:this.data.keywords
        }).then(res=>{
            console.log(res)
            wx.stopPullDownRefresh()
            this.loadingList = false
            if(clear){
                this.data.loadData.show = false
            }
            if(!res.info.length){
                this.data.loadData.show = true
                this.data.loadData.status = clear?'noMore':'bottom'
            }
            this.setData({loadData:this.data.loadData})
            if(!res.status){
                Helper.hideLoading()
                return /*Helper.showError(res.msg)*/
            }

            Helper.reSizeGoodsImage(res)
            let arr = []
            for(let i = 0;i < res.info.length;i++){
                if(!res.info[i].goods_data){
                    continue;
                }
                if(res.info[i].goods_data.couponInfo.couponValue!=''){
                    res.info[i].goods_data.couponInfo.couponValue = filterPrice(res.info[i].goods_data.couponInfo.couponValue)[0]
                }
                arr.push(res.info[i])
            }
            this.appendData('goodsList', arr, () => {
                Helper.hideLoading()
            })
        })
    },
    //上拉加载
    onReachBottom() {
        this.getProductListData(false)
    },
    Notify(data) {
        showNotify(data)
    },
})