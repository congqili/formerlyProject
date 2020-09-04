//用户相关
import request from '../utils/request'

//小程序登录
let wxLogin = function (params) {
    return request.post('user/wechat_mini_login', params)
}

//绑定手机号
let upMobile = function (params) {
    return request.post('user/mobile', params)
}

//关注状态
let getFollow = function (params) {
    return request.get('user/follow', params)
}

//关注 jwt
let toFollow = function (params) {
    return request.post('user/follow', params)
}

//判断登录态
let userGet = function () {
    return request.get('user')
}

//获取粉丝列表
let getFansList = function (params) {
    return request.get('user/fans', params)
}

//获取粉丝数量
let getFansNum = function (params) {
    return request.get('user/fans_num',params)
}

//获取订单列表
let getOrderList = function (params) {
    return request.get('user/orders',params)
}

//获取订单数量
let getOrderNum = function () {
    return request.get('user/order_num')
}

//取消关注 jwt
let unFollow = function (params) {
    return request.delete('user/follow', params)
}

//获取预估收益
let getCommissions = function () {
    return request.get('user/commissions')
}

//修改微信号
let updataWechat = function (params) {
    return request.post('user/wechat',params)
}
//用户中心广告
let getAdvert = function () {
    return request.get('layout/user_center_ad')
}
//获取主播信息
let getAdstreamer = function () {
    return request.get('user/streamer')
}
// 提现申请
let toWithDraw = function (params) {
    return request.post('user/withdraw',params)
}

// 提现记录
let getWithDraw = function () {
    return request.get('user/withdraws')
}

//账单记录
let getBill = function () {
    return request.get('user/bill')
}
//获取主播信息
let userStreamer = function (params) {
    return request.get('user/streamer',params)
}

//签到
let userSign = function () {
    return request.post('user/sign')
}

//签到记录
let signHistory = function (params) {
    return request.get('user/signs',params)
}

//是否签到
let isSingn = function (params) {
    return request.get('user/is_sign',params)
}

//任务配置
let getTaskConfig = function () {
    return request.get('user/task_config')
}

//今日以获得积分
let getTodayIntergral = function () {
    return request.get('user/today_integral')
}

//提现获取信息
let getWithdrawInfo = function () {
    return request.get('user/withdraw_info')
}
//获取用户升级条件
let getUserUpgrade = function () {
    return request.get('user/upgrade')
}
// 获取邀请二维码
let inviteQrcode=function () {
    return request.get('user/invite_qrcode')
}
//获取账户余额相关信息
let getAccountInfo = function () {
    return request.get('user/money')
}
//获取账单中的订单
let getBillOrders=function(params){
    return request.get('user/bill_orders',params)
}
//生成二维码
let genQrcode=function(params){
    return request.post('user/custom_qrcode',params)
}

//获取积分记录
let getIntegrals = function (params) {
    return request.get('user/integrals',params)
}

//积分兑换记录
let getIntegralDividend = function (params) {
    return request.get('user/integral_dividend',params)
}

//意见反馈
let feedback = function (params) {
    return request.post('user/feedback',params)
}
export {
    getCommissions,
    feedback,
    wxLogin,
    getTodayIntergral,
    getIntegralDividend,
    getAccountInfo,
    getIntegrals,
    getWithdrawInfo,
    getTaskConfig,
    userSign,
    getUserUpgrade,
    getFollow,
    signHistory,
    toFollow,
    isSingn,
    unFollow,
    upMobile,
    userGet,
    getFansList,
    getFansNum,
    getOrderList,
    getOrderNum,
    updataWechat,
    getAdvert,
    toWithDraw,
    getBill,
    getWithDraw,
    userStreamer,
    getBillOrders,
    inviteQrcode,
    genQrcode
}
