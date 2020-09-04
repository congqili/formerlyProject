import {getCommissions,userGet} from '../../api/user'
import {errMsg, showNotify} from "../../utils/btn";
import {createShare} from "../../api/share";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data:{
      activeIndex:0,
      user:{},
      live:{}
    },
    onLoad(options){
        if (!socketOnload(this)) return
        if(options.type){
            console.log(options.type)
            this.setData({activeIndex:Number(options.type)})
        }
        this.data.isEnter = true
        this.getCommission()
        this.share = Share.instance().get()
    },
    onShow(){
        if(this.data.isEnter )this.getCommission()
    },
    getCommission(){
        Helper.showLoading()
        getCommissions().then((res)=>{
            if(!res.status){
                Helper.hideLoading()
                return Helper.showError(res.msg)
            }
            console.log(res);
            this.setData({user:res.info.user,live:res.info.live}, Helper.hideLoading)
        })
    },
    Notify(data){
        showNotify(data)
    },
    onShareAppMessage(){
        if(this.share) return this.share.to()
    }
})