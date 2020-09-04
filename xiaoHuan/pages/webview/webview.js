import {showNotify} from "../../utils/btn";
import Helper from "../../utils/Helper";
Page({
    data:{
      url:''
    },
    onLoad(options){
        Helper.showLoading()
        this.setData({
            url:options.url
        })
    },
    loadSuccess(){
        Helper.hideLoading()
    },
    Notify(data) {
        showNotify(data)
    },
})