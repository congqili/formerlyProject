//直播相关
import request from '../utils/request'

//获取所有直播间栏目
let getLiveCategories = function () {
    return request.get('live/categories')
}

//获取指定直播间栏目
let getLiveCategory = function (params) {
    return request.get('live/category', params)
}

//获取直播间
let getLive = function (params) {
    return request.get('live', params)
}

//获取自己的直播间，附带jwt信息
let getSelfLive = function () {
    return request.get('live/self')
}

//创建直播 附带jwt
let createLive = function (params) {
    return request.post('live', params)
}

//修改直播 附带jwt
let updateLive = function (params) {
    return request.put('live', params)
}

//删除直播，附带jwt
let deleteLive = function (params) {
    return request.delete('live', params)
}

//开始直播,附带jwt
let startLive = function () {
    return request.put('live/start')
}

//停止直播 附带jwt
let stopLive = function () {
    return request.put('live/stop')
}

//开始录制视频 附带jwt
let startRecord = function (params) {
    return request.put('live/start_record', params)
}

//停止录制视频 附带jwt
let stopRecord = function (params) {
    return request.put('live/stop_record', params)
}
//喜欢直播
let liveLike = function (params) {
    return request.post('live/like', params)
}
//取消喜欢
let cancelLike = function (params) {
    return request.delete('live/like', params)
}
//获取主播所有录播视频
let getRecordVideo = function (params) {
    return request.get('live/videos', params)
}

//是否喜欢
let likeLike = function (params) {
    return request.get('live/like', params)
}
//获取点赞量
let likeNumApi = function (params) {
    return request.get('live/like_num', params)
}

//添加商品
let addProduct = function (params) {
    return request.post('live/goods', params)
}

//置顶商品
let goodsTop = function (params) {
    return request.put('live/goods_top', params)
}

//进入直播间
let liveEnter = function (params) {
    return request.post('live/enter', params)
}

//离开直播间
let liveLeave = function (params) {
    return request.post('live/leave', params)
}

//获取主播的直播间
let getUserLiveHome = function (params) {
    return request.get('live/user_live', params)
}

//获取观众列表
let getLiveViewers = function (params) {
    return request.get('live/viewers', params)
}

//获取视频
let getVideo = function (params) {
    return request.get('live/video',params)
}

//获取直播商品列表
let getLiveGoodsList = function (params) {
    return request.get('live/goods',params)
}
//发表评论
let liveTalk = function (params) {
    return request.post('live/talk',params)
}
//获取评论 默认上10条
let getLastTalk = function (params) {
    return request.get('live/last_talks',params)
}
//获取所有直播流
let getAllLiveFlow = function (params) {
    return request.get('live/streams',params)
}

//获取直播流
let getStreamFlow = function (params) {
    return request.get('live/stream',params)
}
let getLiveQrcode = function(params) {
    return request.get('live/qrcode', params)
}
let getLiveVideoQrcode = function(params) {
    return request.get('live/video_qrcode', params)
}
export {
    getLiveCategories,
    getStreamFlow,
    getAllLiveFlow,
    getVideo,
    getLiveViewers,
    liveTalk,
    getLiveGoodsList,
    getLiveCategory,
    getLastTalk,
    getLive,
    liveEnter,
    addProduct,
    getSelfLive,
    goodsTop,
    createLive,
    updateLive,
    deleteLive,
    startLive,
    stopLive,
    startRecord,
    stopRecord,
    getRecordVideo,
    liveLeave,
    likeLike,
    likeNumApi,
    cancelLike,
    liveLike,
    getUserLiveHome,
    getLiveQrcode,
    getLiveVideoQrcode,
}
