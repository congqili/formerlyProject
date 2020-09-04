import {getBillOrders} from '../../api/user'
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
Page({
    data: {
        id:'',
        billList:[]
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return

        let {id} = options;
        this.data.id=id;
        this.getBillOrders()
    },
    getBillOrders(init = true){
        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();

        getBillOrders({
            bill_id:this.data.id,
            page_no:'1',
            page_size:'10'
        }).then(res=>{
            Helper.hideLoading()
            this.loadingList = false
            if(!res.status) return Helper.showError(res.msg)
            if(!res.info.list) return /*Helper.showError(init?'没有数据':'没有更多数据')*/
            Helper.reSizeGoodsImage(res)
            let result = init ? res.info.list : this.data.billList.concat(res.info.list)
            this.setData({billList:result})
        })
    },
    onReachBottom(){
        this.getBillOrders(false)
    }
})