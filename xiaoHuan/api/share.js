//分享
import request from '../utils/request'

//分享相关
let createShare = function (params) {
    return request.post('share',params)
}

let toShare = function(params) {
    return request.put('share', params)
}

export {createShare, toShare}
