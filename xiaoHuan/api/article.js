//文章相关

import request from '../utils/request'

//获取分类列表
let getCategories = function () {
    return request.get('article/categories')
}

//获取分类
let getCategory = function (params) {
    return request.get('article/category',params)
}

//获取文章列表
let getArticleList = function (params) {
    return request.get('article/list',params)
}

//获取文章
let getArticle = function (params) {
    return request.get('article',params)
}

export {getArticle,getArticleList,getCategories,getCategory}
