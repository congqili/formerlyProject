import {getGoodsList} from "../../api/goods";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data:{
        showCategoryPop:false,
        checkIndex:0,
        goods_list:[],
        goods_list_tomorrow:[],
        page_no:[0,0],
        time:[]
    },
    path: 'pages/productHotList/productHotList',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (!this.data.goods_list.length) Helper.showLoading('加载中···', true, 3000)
        if (this.isInit) return
        this.isInit = true

        this.data.time = [
            this.changeTime(new Date().getTime()),
            this.changeTime(new Date().getTime() + 1000 * 60 * 60 * 24)
        ]
        this.getGoodsList(true);
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        // Helper.showLoading()
        this.initData(options)
    },
    onClose(){
        this.setData({showCategoryPop:false})
    },
    onOpen(){
        this.setData({showCategoryPop:true})
    },
    select(e){
        let {index} = e.currentTarget.dataset
        console.log(index)
        this.setData({checkIndex:index})
        this.getGoodsList(true)
    },
    getGoodsList(clear = false) {
        if (this.loadingList) return
        this.loadingList = true
        Helper.showLoading();

        let key = this.data.checkIndex == 0 ? 'goods_list' : 'goods_list_tomorrow'
        if (clear){
            this.data.page_no[this.data.checkIndex] = 0
            this.setData({[key]: []})
        }
        this.data.page_no[this.data.checkIndex]++

        getGoodsList({
            category : 'hot',
            page_no  : this.data.page_no[this.data.checkIndex],
            page_size: 10,
            online   : this.data.time[this.data.checkIndex]
        }).then(res => {
            wx.stopPullDownRefresh()
            console.log(res);
            if (res.status) {
                Helper.reSizeGoodsImage(res)

                this.appendData(key, res.info, () => {
                    this.loadingList = false
                    Helper.hideLoading()
                })
            } else {
                this.loadingList = false
                Helper.hideLoading()
                //Helper.showError(res.msg)
            }
        }).catch((err) => {
            this.loadingList = false
            Helper.showError('数据获取失败')
        })
    },
    changeTime(time) {
        let oDate = new Date(time);
        let oYear = oDate.getFullYear();
        let oMonth = oDate.getMonth() + 1;
        let oDay = oDate.getDate();
        let setTime = oYear + "-" + this.getBz(oMonth) + "-" + this.getBz(oDay) ; //拼接时间
        return setTime.toString()
    },
    //将个位数前加0
    getBz(num) {
        if (parseInt(num) < 10) {
            num = "0" + parseInt(num);
        }
        return num;
    },
    onReachBottom: function() {
        this.getGoodsList();
    },
    onPullDownRefresh() {
        this.getGoodsList(true)
    },
    toComment(e){
        let {code} = e.currentTarget.dataset
        Navigate.productDetail(code).to()
    }
})