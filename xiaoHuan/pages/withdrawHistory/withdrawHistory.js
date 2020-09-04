import {getWithDraw,getBill} from "../../api/user";
import {showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data:{
        isHistory:true,
        billList:[],
        historyList:[]
    },
    onLoad(options){
        if (!socketOnload(this, options)) return
        let {type} = options
        this.data.type = options.type
        this.setData({isHistory:type == 'history'?true:false})
        wx.setNavigationBarTitle({
            title:type == 'history'?'提现历史':'结算帐单'
        })
        this.getPageData()
    },
    //跳转到订单详情
    goOrderDetail(e){
        let detailId=e.currentTarget.dataset.id
        Navigate.memberOrderDetail(detailId).to()
    },
    Notify(data) {
        showNotify(data)
    },
    getPageData(){
        let status = this.data.type == 'history'?'history':'bill'
        let fun = this.data.type == 'history'?getWithDraw:getBill

        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        console.log(this.fun)
        fun().then(res=>{
            Helper.hideLoading()
            this.loadingList = false
            console.log(res)
            if(!res.status) return Helper.showError(res.msg)
            if(!res.info.length) return /*Helper.showError('没有数据')*/
            this.setData({[status+'List']:res.info})
        })
    }
})