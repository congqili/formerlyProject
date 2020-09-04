import {getAccountInfo, userGet} from "../../api/user";
import {errMsg, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data:{
        accountInfo:{}
    },
    onLoad(){
        if (!socketOnload(this)) return
        this.getAccountInfo()
    },
    toWithdraw(){
        Navigate.memberWithdraw().to()
    },
    toShowList(e){
        Navigate.withdrawHistory(e.currentTarget.dataset.type).to()
    },
    getAccountInfo(){
        Helper.showLoading()
        getAccountInfo().then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            console.log(res)
            res.info.rule = res.info.rule.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
            Helper.hideLoading()
            this.setDataStorage({accountInfo:res.info})
        })
    },
    Notify(data) {
        showNotify(data)
    }
})