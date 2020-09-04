import {getFansList, userGet} from '../../api/user'
import {errMsg, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Navigate from "../../utils/Navigate";

Page({
    data: {
        //直播粉丝数据列表
        liveFans: [],
        //推客粉丝数据列表
        userFans: [],
        storageData: [],
        //当前页对象
        page_no: {user: 1, live: 1},
        page_size: 10,
        //当前选中标签页索引
        index_no: 0,
        //默认选中的索引
        selIndex:0,
        userInfo:{},
        loadData:{
            status:'noMore',
            title:'您还没有粉丝',
            show:false,
            color:"#f9f7f3"
        }
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.setData({userInfo: this.userInfo})
        if (options.stream||options.type==1) {
            this.setData({
                selIndex: 1,
                index_no: 1
            })
            this.getFansData('live')
        } else {
            this.getFansData('user')
        }
    },
    //初始化粉丝数据
    getFansData() {
        this.getFansListData()
    },

    //tab标签页切换
    tabSelect(e) {
        //根据切换的索引请求不同的粉丝数据
        this.data.index_no = e.detail.index
        console.log(e.detail.index)
        this.getFansListData()
    },
    //获取粉丝数据
    getFansListData(clear = true){
        if(this.loadingList) return
        this.loadingList = true

        // Helper.showLoading();

        let key = this.data.index_no ? 'live' : 'user'

        if(clear){
            this.data.page_no[key] = 0
            this.setData({[key + 'Fans']: []})
        }
        this.data.page_no[key]++
        this.data.loadData.status = 'load'
        this.data.loadData.show = true
        this.setData({loadData:this.data.loadData})
        getFansList({
            type: key,
            page_no: this.data.page_no[key]
        }).then(res=>{
            console.log(res,this.data.page_no[key])
            wx.stopPullDownRefresh()
            if(clear){
                this.data.loadData.show = false
            }
            if(res.info.list.length<=0){
                this.data.loadData.show = true
                this.data.loadData.status = clear?'noMore':'bottom'
            }
            this.setData({loadData:this.data.loadData})
            if(!res.status) {
                this.loadingList = false
                Helper.hideLoading()
                return Helper.showError(res.msg)
            }

            this.appendData(key + 'Fans', res.info.list, () => {
                this.loadingList = false
                Helper.hideLoading()
            })
        })
    },
    //上拉加载
    onReachBottom() {
        this.getFansListData(false)
    },
    //下拉刷新
    onPullDownRefresh() {
        // console.log(111)
        this.getFansListData()
    },
    Notify(data){
        showNotify(data)
    }
})