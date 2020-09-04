import {liveEnter} from '../api/live'
import Navigate from "./Navigate";

function checkType(type, params,obj) {
    switch (type) {
        //跳转到外部链接
        case 'url':
            console.log(params)
            Navigate.webview(params.target).to()
            break;
        case 'live':
            Navigate.live(params.params.id).to()
            break;
        case 'live_goods':
        //跳转到用户视角
            console.log(params.params)
            Navigate.live(params.params.id).to()
            break;
        case 'goods_explain':
            //跳转到讲解视频
            console.log(params.params)
            let videoid = params.params.id
            Navigate.productVideo(videoid).to()
            break;
        //跳转到商品讲解
        case 'goods':
            Navigate.productDetail(params.params.goods_code).to()
            break;
        // 跳转到商品分类
        case 'goods_category':
            let {gc_title, gc_image} = params.params
            console.log(params);
            //分类id      分类标题
            // obj.$preload('/pages/productVideos/productVideos?id='+params.id+'&title='+gc_title)
            Navigate.productList(params.params.id, gc_title, '', gc_image).to()
            break;
        //跳转到文章
        case 'article':
            console.log(params)
            Navigate.article(params.params.id).to()
            break;
        //跳转到文章分类
        case 'article_category':
            var {ac_title,id} = params.params
            console.log(params.params);
            //分类标题   分类id
            Navigate.articleList(id, ac_title).to()
            break;
        case 'page':
            console.log(params)
            let target = params.target.split('/')[1]
            console.log(target)
            if(target == 'index' || target == 'brand' || target =='member' || target =='liveSquare'){
                return wx.switchTab({url:'/'+params.target})
            }
            wx.navigateTo({url: '/' + params.target})
            break;
        case 'goods_cate_group':
            console.log(params)
            Navigate.productGroup(params.params.id).to()
            break;
    }
}

export default checkType