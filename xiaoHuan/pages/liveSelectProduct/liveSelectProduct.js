import {getSelectCategory} from '../../api/api'
import {getGoodsList} from '../../api/goods'
import {addProduct} from '../../api/live'
import {errMsg, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Navigate from "../../utils/Navigate";

Page({
    data: {
        live_goods_cate: [],
        select_list_length: 0,
        active: 0,
        page: [],
        changeNum: [0],//记录选的类别，仅第一次加载
        result: [],//多选框
        resultS:[],//搜索框多选
        flag: true,
        type: '',
        showSearchList:false,
        searchList:[],
        search_page:1,
        searchVal:''
    },
    path: 'pages/liveSelectProduct/liveSelectProduct',
    onPreload(options) {
        console.log("Preload: " + this.path);
        this.userInfo = wx.getStorageSync('userInfo');
        this.initData(options)
    },
    initData(options) {
        if (!this.data.live_goods_cate.length) Helper.showLoading('加载中···', true, 3000)
        if (this.isInit) return
        this.isInit = true

        this.data.type = options.type
        this.getSelectCategory()
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return
        this.initData(options)
    },
    inputConfirm(e){
        this.data.keywords = e.detail.value
        this.getSearchGoodsList()
    },
    getSearchGoodsList(clear = true){
        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        getGoodsList({
            category:'oth',
            keywords:this.data.keywords,
            page_no:clear?1:++this.data.search_page
        }).then(res=>{
            console.log(res)
            this.loadingList = false
            Helper.hideLoading()
            if(res.info.length <= 0){
                Helper.showError(clear?'没有数据':'没有更多数据')
            }
            let list = clear?res.info:this.data.searchList.concat(res.info)
            this.setData({showSearchList:true,searchList:list})
        })
    },
    searchDown(){
        console.log(111);
        this.getSearchGoodsList(false)
    },
    clearInput(){
        console.log(111);
        
        this.setData({showSearchList:false,searchVal:''})
    },
    onChange(e) {
        let index = e.detail.index;
        let changeNum = this.data.changeNum;
        //防止重复加载
        console.log(index)
        if (!changeNum.includes(index)) {
            changeNum.push(index)
            this.setData({
                changeNum: changeNum,
            }, () => {
                this.getSelectList();
            })
        }
        this.setData({
            active: index
        })
    },
    //获取主播选择商品的分类列表
    getSelectCategory() {
        getSelectCategory().then((res) => {

            if(!res.status){
                return Helper.showError(res.msg)
            }

            let data = res.info;
            let live_goods_cate = this.data.live_goods_cate;
            let page = this.data.page;
            console.log(data)
            data.map((item) => {
                live_goods_cate.push({
                    live_goods_title: item.layout_title,
                    live_goods_id: item.layout_link_data.id,
                    live_goods_list: []
                })
                page.push({
                    page_type: item.layout_title,
                    page_num: 1
                })
            })
            this.setData({
                live_goods_cate,
                page
            }, () => {
                this.getSelectList()
            })
        }).catch(() => {
            Helper.showError('分类列表获取失败')
        })
    },
    //获取商品列表
    getSelectList(page) {
        this.data.flag=false
        console.log(this.data.flag)
        Helper.showLoading('加载中...', false)
        //选择的类型
        let check_num = this.data.active || 0;
        console.log(this.data.live_goods_cate, check_num);
        //商品类型id
        let category = this.data.live_goods_cate[check_num].live_goods_id;
        // console.log(category)
        let list_param = {
            category: category,
            keywords: '',
            page_no: page || '1',
            page_size: '10',
            sort: '1',
        }
        console.log(list_param)
        getGoodsList(list_param).then(res => {
            Helper.reSizeGoodsImage(res)
            console.log(res)
            this.data.flag=true
            if(!res.status){
                return Helper.showError(res.msg)
            }
            let live_goods_cate = this.data.live_goods_cate;
            //获取所看所有列表的条数
            let sl_len = 0;
            //判断数据是否为空
            console.log(res)
            res.info.map((item,index)=>{
                if(item.goods_code==''||item.goods_code==undefined){
                    res.info.splice(index,1)
                }
            })
            live_goods_cate[check_num].live_goods_list.push(...res.info);
            for (let i = 0; i < live_goods_cate.length; i++) {
                sl_len += live_goods_cate[i].live_goods_list.length
            }
            this.setData({
                live_goods_cate: live_goods_cate,
                select_list_length: sl_len,
                flag: true
            },()=>{
                // wx.hideLoading()
                Helper.hideLoading()
            })
        }).catch(() => {
            this.data.flag=true
            Helper.showError('获取商品列表失败')
        })
    },
    //选择结果
    changeState(e) {
        this.setData({
            result: e.detail,
        });
    },
    //搜索框选择结果
    changeStateS(e){
        this.setData({
            resultS: e.detail,
        });
    },
    //触底加载
    scroll_down() {
        let now_title_type = this.data.active;
        let page = this.data.page[now_title_type].page_num;
        if (this.data.flag) {
            this.getSelectList(++page)
            this.data.page[now_title_type].page_num = page;
        }

    },
    //TODO:搜索框，搜索显示搜索列表，隐藏tab标签页，点击叉清空内容显示标签页
    //TODO:主播界面，显示删除商品按钮
    //选择的结果
    checkResult() {
        let {result,resultS,live_goods_cate,searchList} =this.data;

        //选择的结果
        let check_result = [];
        result.map(item => {
            let item_split = item.split("_");
            let liveData = live_goods_cate[item_split[0]].live_goods_list[item_split[1]];
            console.log(liveData)
            check_result.push({
                goods_goodsCode: liveData.goods_code,
                goods_pictureUrl: liveData.goods_image,
                goods_title: liveData.goods_title,
                goods_commission: liveData.goods_data.commission,
                checked: true
            });
        })
        resultS.map(item=>{
            let liveData=searchList[item]
            check_result.push({
                goods_goodsCode: liveData.goods_code,
                goods_pictureUrl: liveData.goods_image,
                goods_title: liveData.goods_title,
                goods_commission: liveData.goods_data.commission,
                checked: true
            })

        })

        console.log(this.data.type)
        let data = wx.getStorageSync('checkBaby')
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < check_result.length; j++) {
                    if (data[i].goods_goodsCode == check_result[j].goods_goodsCode) {
                        check_result.splice(j, 1)
                    }
                }
            }
            let checkBaby = check_result.concat(data)
            // wx.setStorageSync('checkBaby', data)
            wx.setStorageSync('checkBaby', checkBaby)
        } else {
            wx.setStorageSync("checkBaby", check_result);
        }
        if (this.data.type == 'live') {
            for (let i = 0; i < check_result.length; i++) {
                addProduct({goods_code: check_result[i].goods_goodsCode}).then((res) => {
                    if(!res.status){
                        return Helper.showError(res.msg)
                    }
                    console.log(res)
                })
            }
        }
        Navigate.back()
        // Navigate.liveCreateProduct().to()
    },
    Notify(data){
        showNotify(data)
    }
})