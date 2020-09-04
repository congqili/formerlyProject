// pages/selectionGoods/selectionGoods.js
import Helper from "../../utils/Helper";
import { getGoodsList, getGroupGoods } from "../../api/goods";
import Navigate from "../../utils/Navigate";
import { socketOnload } from "../../utils/socketBtn";

Page({
    data: {
        changeIndex: 0,
        scrollPlace: 0,
        phoneWidth: '',
        tabList: [],
        gcg_title: '',
        gcg_image: '',
        gcg_main_color: '',
        gcg_minor_color: '',
        select_id: '',
        selectGoods: [],
        page_no: 1,
        pulldown: false,
        pulldownStatus: false,
        loadData: {
            status: 'load',
            title: '暂无商品',
            show: false,
            color: "#f3f3f3",
            fontColor: "#FFF"
        }
    },
    path: 'pages/productGroup/productGroup',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.initData(options)
    },
    initData(options) {
        // console.log(options)
        this.data.id = options.id
        if (this.isInit) return
        this.isInit = true
        this.initPageData()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        // wx.hideTabBar()
        this.initData(options)
    },
    onShow() {
        let top = wx.getMenuButtonBoundingClientRect().top
        let statusBar = wx.getSystemInfoSync().statusBarHeight
        console.log(statusBar)
        this.setData({ barTop: Helper.toRpx(top), statusBar: Helper.toRpx(statusBar) })
    },
    backPage() {
        Navigate.back()
    },
    changeTab(e) {
        let index = e.currentTarget.dataset.index;
        // console.log(e)
        this.setData({
            changeIndex: index
        })

        if (index >= 3 || index <= this.data.tabList.length - 3) {
            let pxNum = (165 * (index + 1 - 3)) + 35
            let num = Helper.toPx(pxNum)
            console.log(num)
            this.setData({
                scrollPlace: num
            })
        }

        this.setData({ selectGoods: [], page_no: 1 }, () => {
            this.data.select_id = this.data.tabList[index].id
            this.getGoodsList()
        })
    },
    getGoodsList(clear = true) {
        if (this.loadingList) return
        this.loadingList = true
        console.log(this.data.select_id, this.data.selectGoods)
        if (clear) {
            this.data.selectGoods = []
            this.data.page_no = 1
        }
        this.data.loadData.show = true
        this.data.loadData.status = 'load'
        this.data.loadData.color = this.data.gcg_main_color
        this.setData({ loadData: this.data.loadData })
        getGoodsList({
            category: this.data.select_id,
            page_no: clear ? 1 : ++this.data.page_no
        }).then(res => {
            this.loadingList = false
            wx.stopPullDownRefresh()
            if(clear){
                this.data.loadData.show = false
            }
            if(!res.info.length){
                this.data.loadData.show = true
                this.data.loadData.status = clear?'noMore':'bottom'
            }
            console.log(res)
            this.setData({ pulldown: false ,loadData:this.data.loadData})
            if (!res.status) return
            this.appendData('selectGoods', res.info, () => {

            })
        })
    },
    onPullDownRefresh() {
        this.getGoodsList()
    },
    initPageData() {
        getGroupGoods({ id: this.data.id }).then(res => {
            console.log(res)
            if (!res.status) return
            let { gcg_title, gcg_image, gcg_main_color, gcg_minor_color } = res.info
            this.setData({ gcg_title, gcg_image, gcg_main_color, gcg_minor_color })
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: gcg_main_color,
                animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                }
            })
            this.appendData('tabList', res.info.gcg_categories, () => {
                this.data.select_id = res.info.gcg_categories[0].id
                this.getGoodsList()
            })

        })
    },
    scrollToBottom() {
        this.getGoodsList(false)
    },
    customPullDown() {
        this.data.pulldownStatus = true
        this.onPullDownRefresh()
    },
    changeNum() {

    }
})