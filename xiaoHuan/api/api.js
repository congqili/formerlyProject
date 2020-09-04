import request from '../utils/request'

//获取首页布局
let getBannerLayout = function () {
    return request.get('layout/banner')
}
let getTopCategory = function () {
    return request.get('layout/top_category')
}
let getStreamerExplain = function () {
    return request.get('layout/streamer_explain')
}

let getHotGoods = function () {
    return request.get('layout/hot_goods')
}

let getStreams = function () {
    return request.get('layout/streamers')
}

let getGoodsExplain = function (params) {
    return request.get('layout/goods_explain', params)
}

//获取主播选择商品的分类列表
let getSelectCategory = function () {
    return request.get('layout/live_goods_cate')
}

//获取首页主类目列表
let getCategory=function(){
    return request.get('layout/index_category')
}
//获取会员页更多信息
let getMemberMore = function () {
    return request.get('layout/user_center_more')
}
//获取分类
let getTabCategory = function () {
    return request.get('layout/index_category')
}
//超级超级品牌顶部品牌列表
let getBrandTopPit = function () {
    return request.get('layout/brand_top_pit')
}
//获取商品分类广告
/*let getCategoryAdvert = function(){
    return request.get('layout/goods_cate_ad')
}*/

let getBrandLayout = function(){
    return request.get('layout/index_brand')
}

let getPopularityGoods = function(){
    return request.get('layout/popularity_goods')
}

let getSuperGoods = function(){
    return request.get('layout/super_goods')
}

let getLiveSquare = function (param) {
    return request.get('layout/lives',param)
}
export {
    getMemberMore,
    getPopularityGoods,
    getBannerLayout,
    getLiveSquare,
    getSelectCategory,
    getTabCategory,
    getBrandLayout,
    getSuperGoods,
    /*getCategoryAdvert,*/
    getHotGoods,
    getGoodsExplain,
    getStreams,
    getTopCategory,
    getStreamerExplain,
    getCategory,
    getBrandTopPit
}
