import request from '../utils/request'

//获取配置
let getConfig = function() {
    return request.get('common/config')
}
export {
    getConfig
}
