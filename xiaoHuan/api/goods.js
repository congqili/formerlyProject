//商品相关
import request from '../utils/request'

//获取详情页数据
let getDetail = function (params) {
    return request.get('goods/detail',params)
}

//获取商品列表
let getGoodsList = function (params) {
    return request.get('goods/list',params)
}

//获取商品或店铺的推广链接
let getPopUrl = function (params) {
     return request.post('goods/pop_url',params)
}

//获取商品所有的录播视频
let getVideos = function (params) {
    return request.get('goods/videos',params)
}

//转链
let getTransform = function (params) {
    return request.post('goods/transform_link',params)
}

//获取详情页图片
let getGoodsImages = function (params) {
    return request.get('goods/detail_images',params)
}

let getGoodsLive = function (params) {
    return request.get('goods/lives',params)
}
//获取所有品牌
let getGoodsBrand = function () {
    return request.get('goods/brands')
}
//获取品牌信息
let getGoodsBrander = function (params) {
    return request.get('goods/brand',params)
}
//获取品牌商品列表
let getGoodsBrandGoods = function (params) {
    return request.get('goods/brand_goods',params)
}

//获取品牌直播
let getBrandLive = function (params) {
    return request.get('goods/brand_lives',params)
}

//商品聚合页
let getGroupGoods = function (params) {
    return request.get('goods/category_group',params)
}
export {getGroupGoods,getGoodsBrander,getBrandLive,getGoodsBrandGoods,getGoodsBrand, getPopUrl,getGoodsList,getDetail,getVideos,getTransform,getGoodsImages,getGoodsLive}
