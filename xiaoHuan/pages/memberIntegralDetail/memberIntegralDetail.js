import {getIntegrals} from "../../api/user";
import Helper from "../../utils/Helper";

Page({
    data:{
        integralInfo:[],
        page_no:1,
        page_size:30
    },
    onLoad(options){
        console.log(options)
        this.data.date = options.date
        this.getIntegralDetail()
    },
    getIntegralDetail(init = true){
        if(this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        getIntegrals({
            data:this.data.date,
            page_no:init?1:++this.data.page_no,
            page_size: this.data.page_size
        }).then(res=>{
            console.log(res)
            Helper.hideLoading()
            this.loadingList = false
            console.log(res)
            if(!res.status) return Helper.showError(res.msg)
            if(!res.info.list.length) return /*Helper.showError(init?'没有数据':'没有更多数据')*/
            let result = init?res.info.list:this.data.integralInfo.concat(res.info.list)
            this.setData({integralInfo:result})
        })
    },
    onReachBottom(){
        this.getIntegralDetail(false)
    }
})