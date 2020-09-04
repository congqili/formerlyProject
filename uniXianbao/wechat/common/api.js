import Request from './request/index';
import store from '../store/index'

const request = (url, method, data) => {
	let h = {}
	console.log(store.state.userToken)
	// h.Authorization = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMiwiYXVkIjoiIiwiZXhwIjoxNTg5MjEwNTk2LCJpYXQiOjE1ODg2MDU3OTYsImlzcyI6IiIsImp0aSI6IjNiNGRhY2M5YTJhMjU2Zjc0MzNkM2M0YmJlMmVlMGZjIiwibmJmIjoxNTg4NjA1Nzk2LCJzdWIiOiIifQ.wT4tOc5uBV22rUC95ihOznRtAkHE4UcxB0BiGEKPi3U'
	if (store.state.userToken !== undefined && store.state.userToken != '') {
		h.Authorization = 'bearer ' + store.state.userToken
	} else {

		for (let i in useAuth) {
			console.log(url, url.indexOf(useAuth[i]))
			if (url.indexOf(useAuth[i]) >= 0) {
				uni.reLaunch({
					url: '/pages/login/index'
				})
				return false
			}
		}
	}
	return global.$http.request({
		url: url,
		method: method,
		header: h,
		data: data
	});
}

const useAuth = [
	'wechat/api.user/index',
	'wechat/api.user/getLoginId',
	'wechat/api.user/signIn',
	'wechat/api.user/upIntegral'
]

export default {
	// 获取文章类别
	getArticleCategory(params) {
		return request('article/api.article/get', 'get', params)
	},

	// 获取榜单商品
	getRankGoods(params) {
		return request('shop/api.rank/get', 'get', params)
	},

	// 获取商品详情
	getRankDetail(params) {
		return request('shop/api.rank/getDetail', 'get', params)
	},

	// 获取文章详情
	getArticleDetail(params) {
		return request('api/article/list', 'get', params)
	},

	// 设计点击复制量 + 1
	setClickNum(params) {
		return request('article/api.article/setVisit', 'post', params)
	},

	// 登录 
	wechatLoginApi(params) {
		return request('wechat/api.login/code_login', 'post', params)
	},
	// 更新手机号
	upMobile(params) {
		return request('wechat/api.user/upMobile', 'post', params)
	},
	// 获取用互信息 
	getUserInfoApi(params) {
		return request('wechat/api.user/index', 'post', params)
	},

	// 获取抽奖地址API
	getLotteryUrlApi(params) {
		return request('wechat/api.user/getLoginId', 'post', params)
	},

	// 设置积分API
	upIntegralApi(params) {
		return request('wechat/api.user/upIntegral', 'post', params)
	},

	// 签到API
	signinApi(params) {
		return request('wechat/api.user/signIn', 'post', params)
	},
	
	//转链
	tranformLinkApi(params){
		return request('api/goods/transform_link','post',params)
	},
	
	//首页布局
	getIndexLayout(params){
		return request('api/layout/index','get',params)
	},
	
	//团长推荐
	getCaptainLayout(params){
		return request('api/layout/captain','get',params)
	},
	
	//快抢
	getQuickLayout(params){
		return request('api/layout/quick','get',params)
	},
	
	//获取商品
	getCategoryGoods(params){
		return request('api/goods/list','get',params)
	}
}
