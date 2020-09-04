import {getTransform} from '../../api/goods'
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import {copyText} from "../../utils/btn";
import Helper from "../../utils/Helper";

Page({
    data: {
        areaValue: '',
        flag:false,
        show:false
    },
    onLoad(options) {
    },
    onkeyChain() {
        if (!this.data.areaValue) return Helper.showError('请将内容填充完整')
        if(this.data.flag) return
        Helper.showLoading('生成中...')
        // wx.showLoading({title:'生成中...'})
        this.data.flag=true
        this.setData({show:true})
        getTransform({text: this.data.areaValue}).then(res => {
            this.data.flag=false
            console.log(res.info.text)
            Helper.hideLoading()
            if (res.status){
                Dialog.alert({
                    title: '转链成功',
                    message: res.info.text,
                    confirmButtonText: '点击复制'
                }).then(() => {
                    // on close
                    copyText(res.info.text)
                    setTimeout(()=>{this.setData({show:false})},1500)
                });
            }else {
                Dialog.alert({
                    title: '转链失败',
                    message: res.info.text,
                    confirmButtonText: '确认'
                }).then(() => {
                    // on close
                    Helper.showError('请检查内容是否正确')
                    setTimeout(()=>{this.setData({show:false})},1500)
                });
            }
        }).catch(err=>{
            this.data.flag=false;
            Helper.hideLoading();
            Helper.showError('转链失败');
            setTimeout(()=>{this.setData({show:false})},1500)
        })
    },
    oninput(e) {
        console.log(e)
        this.setData({
            areaValue: e.detail.value
        })
    }
})