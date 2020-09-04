import {errMsg, showNotify} from "../../utils/btn";
import {getArticle} from "../../api/article";
import {createShare} from "../../api/share";
import {socketOnload} from "../../utils/socketBtn";
import Share from "../../utils/Share";
import Helper from "../../utils/Helper";

Page({
    data: {
        //文章标题
        title: '',
        //文章内容
        content: '',
        //文章id
        id:''
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return

        let {id} = options
        this.data.id = id
        Helper.showLoading()

        this.share = Share.instance().setType('article').setTarget(this.data.id).setPage('article').setParams({id: this.data.id}).get()

        this.getArticle(id,()=>{
            // console.log(this.data)
            wx.setNavigationBarTitle({
                title:this.data.title,
                success(res) {
                    Helper.hideLoading()
                }
            })
        })
    },
    //获取文章信息
    getArticle(id,callback){
        getArticle({id}).then(res=>{
            if(!res.status){
                return Helper.showError(res.msg)
            }
            this.setData({title:res.info.article_title,content:res.info.article_content},callback)
        })
    },
    Notify(data) {
        showNotify(data)
    },
    onShareAppMessage(){
        if(this.share) return this.share.to();
    }
})