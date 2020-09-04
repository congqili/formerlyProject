import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userToken: '',
		userInfo: {},
		inviteId: '',
		state:0,
		closeInviteDialog: false,
		config:{}
	},
	mutations: {
		getToken(state, provider) {
			state.userToken = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userToken',  
			    data: provider  
			}) 
		},
		setCloseInviteDialog(state, provider){
			state.closeInviteDialog = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'closeInviteDialog',  
			    data: provider  
			}) 
		},
		setUserInfo(state, info) {
			state.userInfo = info;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: info  
			}) 
		},
		getInvite(state, inviteId) {
			state.inviteId = inviteId;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInvite',  
			    data: inviteId  
			}) 
		},
		logout(state) {
			state.userToken = '';
			uni.removeStorage({  
                key: 'userToken'  
            })
		}
	},
	actions: {
	
	}
})

export default store
