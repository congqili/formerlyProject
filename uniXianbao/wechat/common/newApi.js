const request = require('./request')
import config from './config'

let getBoostList = function (data) {
    return request.get(config.newUrl+'/api/boost/',data)
}


let toBoost = function(data){
	return request.put(config.newUrl+'/api/boost',data,'application/json')
}

let getBoostShareQrcode = function(data){
    return request.get(config.newUrl + '/api/boost/share_qrcode', data, 'application/json')
}

let getGoodsDetail = function(data){
	return request.get(config.newUrl + '/api/goods/detail',data)
}

export  {
    getBoostList,toBoost, getBoostShareQrcode,getGoodsDetail
}