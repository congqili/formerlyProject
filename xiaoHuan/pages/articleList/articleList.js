import {getArticleList} from '../../api/article'
import {errMsg, showNotify} from '../../utils/btn'
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        //当前页
        page: 1,
        //每页最大数据量
        page_size: 10000,
        //文章列表
        articleList: []
    },
    onLoad(options) {
        if (!socketOnload(this, options)) return

        let {id,title} = options
        title = decodeURIComponent(title)
        wx.setNavigationBarTitle({
            title
        })
        console.log(id)
        this.getArticleList(id)
    },
    //获取文章列表数据
    getArticleList(category_id) {
        Helper.showLoading()
        getArticleList({category_id, page_no: this.data.page, page_size: this.data.page_size}).then((res) => {
            Helper.hideLoading()
            if(!res.status){
                return /*Helper.showError(res.msg)*/
            }
            this.setData({articleList: res.info.list})
        })
    },
    toArticle(e){
        let {id} = e.currentTarget.dataset
        Navigate.article(id).to()
    },
    Notify(data) {
        showNotify(data)
    },
})