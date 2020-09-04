import Helper from "../../utils/Helper";
import {feedback} from "../../api/user";

Page({
    data: {
        areaValue: '',
        flag:false,
        isFeedback:false,
        title:''
    },
    onLoad(options) {},
    submit(){
        if (!this.data.areaValue) return Helper.showError('请将内容填充完整')
        if(this.data.flag) return
        feedback({title:this.data.title,content:this.data.areaValue}).then(res=>{
            this.data.flag=false
            Helper.showError(res.msg)
            if(res.status){
                this.setData({title:'',areaValue:''})
            }
        })
    },
    oninput(e) {
        this.setData({
            areaValue: e.detail.value
        })
    },
    inputTit(e){
        this.setData({
            title: e.detail.value
        })
    }
})