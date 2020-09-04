import {
    getBannerLayout,
    getSelectCategory,
    getHotGoods,
    getGoodsExplain,
    getStreams,
    getTopCategory,
    getStreamerExplain,
    getTabCategory,
    getBrandLayout,
    getPopularityGoods,
    getSuperGoods
} from '../../api/api'
import { createShare } from "../../api/share";
import checkType from "../../utils/checkType";
import { errMsg, filterPrice, showNotify } from '../../utils/btn'
import { getGoodsList } from "../../api/goods";
import { socketOnload } from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        //轮播图列表
        banner: [],
        liveList: [],
        //分类
        top_category: [],
        //主播推荐
        streamer_explain: [],
        //超值爆品
        hot_goods: [],
        //直播间列表
        streamers: [],
        //商品讲解
        goods_explain: [],
        //顶部标签列表
        top_tab_category: [],
        //标签分类列表
        tab_category: [],
        //分享id
        share_id: '',
        tab_goods_list: [],
        //展示分类弹窗
        showCategoryPop: false,
        //搜索列表页码
        page_no: 1,
        tab_page_no: 0,
        //当前选中标签页的索引
        tab_index: 0,
        //搜索结果列表
        searchList: [],
        //加载完成判断条件
        loadingFlag: [false, false, false, false, false],
        //当前轮播图索引
        currentSwiper: 0,
        scrollHeight: 0,
        brandList: [],
        popularityList: [],
        popGoodsList: [],
        pop_page_no: 1,
        loadData: {
            status: 'bottom',
            title: '暂无商品',
            show: true,
            color: "#f3f3f3"
        },
        superGoods: []
    },
    //轮播图组件发生修改
    swiperChange(e) {
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    //关闭分类列表
    onClose() {
        this.setData({ showCategoryPop: false })
    },
    //打开分类列表
    onOpen() {
        // console.log(111)
        this.setData({ showCategoryPop: true })
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.data.isEnter = true

        let scene = getApp().parseQuery(options)

        if (scene.li) {
            Navigate.live(scene.li, scene.gi).to()
        } else if (scene.gid) {
            Navigate.productVideo(scene.gid).to()
        }
        //关闭默认tabbar
        wx.hideTabBar();
        this.init()
        this.share = Share.instance().get()
        // let VideoContext = wx.createVideoContext('index-video')
        // VideoContext.seek(50)

        wx.createSelectorQuery().select('.scroll-view').boundingClientRect((rect) => {
            this.data.scrollHeight = rect.height
        }).exec()
    },
    Notify(data) {
        showNotify(data)
    },
    onShow() {
        //if(this.data.isEnter) this.init()
    },
    init() {
        this.getLayout(this.checkLoading, this.data.goods_explain.length <= 0)
    },
    //检测加载状态
    checkLoading() {
        if (this.data.loadingFlag.indexOf(false) == -1) {
            this.getLayouting = false
            Helper.hideLoading()
            this.data.loadingFlag = [false, false, false, false, false]
            wx.stopPullDownRefresh()
        }
    },
    //搜索框确认
    inputConfirm(e) {
        let value = e.detail.value
        if (value === "") return
        this.setData({ searchVal: '' })
        return Navigate.productList('oth', '', value).to()
    },
    onUnload() {
        this.setData({ showCategoryPop: false })
    },
    //过滤商品信息
    filterGoods(res) {
        let arr = []
        for (let i = 0; i < res.info.length; i++) {
            if (!res.info[i].goods_data) {
                continue;
            }
            if (res.info[i].goods_data.couponInfo.couponValue != '') {
                res.info[i].goods_data.couponInfo.couponValue = filterPrice(res.info[i].goods_data.couponInfo.couponValue)[0]
            }
            let gainArr = filterPrice(res.info[i].goods_data.commission.commission)
            res.info[i].goods_data.commission.commission = gainArr[0] + '.' + gainArr[1]
            arr.push(res.info[i])
        }
        return arr
    },
    //获取布局数据
    getLayout(callback, showLoading = true) {
        if (this.getLayouting) return
        this.getLayouting = true
        if (showLoading) Helper.showLoading()

        if (showLoading) {
            getTabCategory().then(res => {
                let top_tab_category = JSON.parse(JSON.stringify(res.info))
                top_tab_category.push({
                    layout_title: '&&&',
                    layout_link_data: {}
                })
                console.log(top_tab_category)
                this.setDataStorage({
                    tab_category: res.info,
                    top_tab_category
                })
            })
        }

        //轮播图布局
        if (showLoading) {
            getBannerLayout().then((res) => {
                this.data.loadingFlag[0] = true
                if (!res.status) {
                    return /*Helper.showError(res.msg)*/
                }
                Helper.reSizeGoodsImage(res, 800)
                // console.log(res.info)
                this.setDataStorage({ banner: res.info })
                callback();
            }).catch((err) => {
                console.log(err)
                //Helper.showError('数据获取失败');
            })
        } else {
            this.data.loadingFlag[0] = true
        }

        //热销商品
        getGoodsList({ category: 'hot', page_size: 5 }).then(res => {
            this.data.loadingFlag[1] = true
            if (!res.status) {
                return /*Helper.showError(res.msg)*/
            }
            Helper.reSizeGoodsImage(res)
            console.log(res)
            this.setDataStorage({ hot_goods: res.info })
        })

        //获取品牌特卖
        getBrandLayout().then(res => {
            console.log(res);
            Helper.reSizeGoodsImage(res)
            this.setDataStorage({ brandList: res.info })
        })

        //人气特卖顶部
        getPopularityGoods().then(res => {
            console.log(res);
            Helper.reSizeGoodsImage(res)
            this.setDataStorage({ popularityList: res.info })
        })
        this.getPopGoodsList()
        getSuperGoods().then(res => {
            Helper.reSizeGoodsImage(res)
            console.log(res)
            // this.setDataStorage({})
            this.setData({ superGoods: res.info })
        })
        //分类
        if (showLoading) {
            getTopCategory().then((res) => {
                this.data.loadingFlag[2] = true
                if (!res.status) {
                    return /*Helper.showError(res.msg)*/
                }
                Helper.reSizeGoodsImage(res, 80)
                console.log(res.info)
                this.setDataStorage({ top_category: res.info })
                callback();
            }).catch((err) => {
                console.log(err)
                //Helper.showError('数据获取失败');
            })
        } else {
            this.data.loadingFlag[2] = true
        }

        //主播推荐
        getStreamerExplain().then((res) => {
            this.data.loadingFlag[3] = true
            return
            this.data.loadingFlag[3] = true
            if (!res.status) {
                return /*Helper.showError(res.msg)*/
            }
            Helper.reSizeGoodsImage(res, 150)
            // console.log(res.info)
            this.setDataStorage({ streamer_explain: res.info })
            callback();
        }).catch((err) => {
            console.log(err)
            //Helper.showError('数据获取失败');
        })

        this.getBottomList(callback)
    },
    getPopGoodsList(clear = true) {
        if (this.loadingList) return
        this.loadingList = true
        // Helper.showLoading()
        this.data.loadData.status = 'load'
        this.data.loadData.show = true
        this.setData({ loadData: this.data.loadData })
        getGoodsList({
            category: 'pop',
            page_no: clear ? 1 : ++this.data.pop_page_no
        }).then(res => {
            Helper.hideLoading()
            this.loadingList = false
            // if(!res.status) return Helper.showError(res.msg)
            if (clear) {
                this.data.loadData.show = false
            }
            if (!res.info.length) {
                this.data.loadData.show = true
                this.data.loadData.status = clear ? 'noMore' : 'bottom'
                this.setData({ loadData: this.data.loadData })
            }
            console.log(res)
            let result = clear ? res.info : this.data.popGoodsList.concat(res.info)
            this.setDataStorage({ popGoodsList: result })
        })
    },
    jumpIndex() {
        this.setData({ tab_index: 0 })
        this.setData({ showCategoryPop: false })
    },
    jumpProduct(e) {
        let { id } = e.currentTarget.dataset
        this.setData({ showCategoryPop: false })
        console.log(this.data.top_tab_category)
        this.data.tab_category.map((item, index) => {
            if (item.layout_link_data && item.layout_link_data.id == id) {
                this.setData({ tab_index: index + 1 })
                this.getGoodsListData(id, true)
            }
        })
        // Navigate.productList(id, title).to()
    },
    //获取直播间和商品讲解列表
    getBottomList(callback) {
        getStreams().then((res) => {
            this.data.loadingFlag[4] = true
            if (!res.status) {
                return /*Helper.showError(res.msg)*/
            }
            Helper.reSizeGoodsImage(res)
            console.log(res)
            this.setData({ streamers: res.info })
            callback();
        })
            .catch((err) => {
                console.log(err)
                /*Helper.showError('数据获取失败');*/
            })
        //商品讲解列表
        this.getGoodsExplain(true)
    },
    //页面跳转
    jumpPage(e) {
        //商品编码
        console.log(this.data.brandList)
        let params = e.currentTarget.dataset
        console.log(params);
        // let targetaddress=params.target.split('/')[3]
        // console.log(targetaddress)
        // Navigate[](params.id).to()
        checkType(params.type, params, this)
    },
    onChange(e) {
        // console.log(e)
        let { index } = e.detail
        this.data.tab_index = index
        this.setData({ tab_index: index })
        if (index == 0) return
        let category_id = this.data.top_tab_category[index - 1].layout_link_data.id
        this.getGoodsListData(category_id, true)
    },
    //下拉刷新
    onPullDownRefresh() {
        this.getLayout(this.checkLoading, false)
    },
    scrollToUp() {
        //if(this.data.tab_index>0) return
        Helper.showLoading()
        this.onPullDownRefresh()
    },

    //获取商品列表数据
    getGoodsListData(category_id, clear = false) {
        if (this.loadGoodsList) return
        this.loadGoodsList = true

        // Helper.showLoading()
        this.data.loadData.status = 'load'
        this.data.loadData.show = true
        this.setData({ loadData: this.data.loadData })

        if (clear) {
            this.data.tab_page_no = 0;
            this.setData({ tab_goods_list: [] })
        }
        this.data.tab_page_no++;

        getGoodsList({
            category: category_id,
            page_no: this.data.tab_page_no
        }).then(res => {
            // Helper.hideLoading()
            console.log(res)
            if (clear) {
                this.data.loadData.show = false
            }
            if (!res.info.length) {
                this.data.loadData.show = true
                this.data.loadData.status = clear ? 'noMore' : 'bottom'
            }
            this.setData({ loadData: this.data.loadData })
            if (!res.status) {
                this.loadGoodsList = false
                return /*Helper.showError(res.msg)*/
            }

            Helper.reSizeGoodsImage(res)
            this.filterGoods(res)
            // console.log(res);

            this.appendData('tab_goods_list', res.info, () => {
                this.loadGoodsList = false
            })
        })
    },
    getGoodsExplain(clear = false) {
        return
        if (this.loadGoodsExplain) return
        this.loadGoodsExplain = true

        if (clear) {
            this.goodsExplainPage = 0;
            this.setData({ goods_explain: [] })
        }
        this.goodsExplainPage++
        //if (!clear) Helper.showLoading();

        let complete = () => {
            //if (!clear) Helper.hideLoading();
            this.loadGoodsExplain = false

        }
        this.data.loadData.status = 'load'
        this.data.loadData.show = true
        this.setData({ loadData: this.data.loadData })

        getGoodsExplain({
            page_no: this.goodsExplainPage,
            page_size: 4
        }).then((res) => {
            console.log(res)
            if (clear) {
                this.data.loadData.show = false
            }
            if (!res.info.length) {
                this.data.loadData.show = true
                this.data.loadData.status = clear ? 'noMore' : 'bottom'
            }
            this.setData({ loadData: this.data.loadData })
            if (!res.status) {
                complete()
                return /*Helper.showError(res.msg)*/
            }
            Helper.reSizeGoodsImage(res, 500)
            res.info.map(item => {
                let price = item.layout_link_data.lg_goods_data.goods_data.commission.price
                item.layout_link_data.lg_goods_data.goods_data.commission.price = filterPrice(price)
            })

            this.appendData('goods_explain', res.info, complete)
        }).catch(() => {
            complete()
        })
    },
    onScroll(e) {
        // if(!this.data.tab_index){
        //     if(e.detail.scrollTop >= e.detail.scrollHeight - this.data.scrollHeight - Helper.toPx(530) * 4) {
        //     // console.log(Helper.throttle(()=>{ console.log(1111)},1000))
        //         // this.getGoodsExplain()
        //     }
        // }else{
        //     /*if (e.detail.scrollTop >= e.detail.scrollHeight - this.data.scrollHeight - Helper.toPx(260) * 3) {
        //         let category_id = this.data.top_tab_category[this.data.tab_index - 1].layout_link_data.id
        //         this.getGoodsListData(category_id)
        //     }*/
        // }
    },
    onViewScroll: Helper.throttle(function () {
        if (!this.data.tab_index) {
            this.getGoodsExplain()
            this.getPopGoodsList(false)
        } else {
            let category_id = this.data.top_tab_category[this.data.tab_index - 1].layout_link_data.id
            this.getGoodsListData(category_id)
        }
    }, 100),
    toGoodsDetail(e) {
        let code = e.currentTarget.dataset.code;
        Navigate.productDetail(code).to()
    },
    lookMoreThing() {
        Navigate.productHotList().to()
    },
    toComment(e) {
        let { code } = e.currentTarget.dataset
        // this.$preload('/pages/productVideos/productVideos?code='+code)
        Navigate.productDetail(code).to()
    },
    //分享
    onShareAppMessage() {
        if (this.share) return this.share.to()
    },
})
