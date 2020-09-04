import Vue from 'vue'
import App from './App'
import store from './store'
import Api from '@/common/api';
import Request from '@/common/request/index'
global.$http = Request();
Vue.config.productionTip = false
Vue.prototype.$api = Api
Vue.prototype.$store = store;
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
