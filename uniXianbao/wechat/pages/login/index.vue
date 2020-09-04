<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome"><image mode="aspectFit" src="/static/logo.png"></image></view>

			<!-- #ifdef MP-WEIXIN -->
			
			<button type="primary" class="confirm-btn" open-type="getUserInfo" @getuserinfo="login" :disabled="logining">
				微信一键登录
			</button>
			<view class="forget-section" @click="toIndex">拒绝登录，返回首页</view>
			<!-- #endif -->
		</view>
		<view class="register-section">99% 商品都有优惠券和返利</view>
		
		<uni-popup ref="popup" type="dialog">
			<view class="bing-phone">
				<view class="header">
					<h4>绑定手机号</h4>
					<text @tap="$refs.popup.close()" class="iconfont">&#xe63c;</text>
				</view>
				<view class="contdesc">您还未绑定手机号，点击“获取手机号”按钮绑定手机号</view>
				<view class="footer">
					<button @click="$refs.popup.close()">取消</button>
					<button open-type="getPhoneNumber" type="primary" ref="getphone" @getphonenumber="getPhoneNumber">获取手机号</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
import { mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			code:'',
			boostcode:'',
			boostid:'',
			invitation:'',	//邀请码		链接中邀请码参数赋值到这里
		};
	},
	onLoad(options) {
		this.params = options.params;
		this.url = options.url;
		this.key = options.key;
		console.log(options)
		
	},
	computed: {
		...mapState(['inviteId'])
	},
	methods: {
		...mapMutations(['getToken', 'setUserInfo']),
		
		// 获取手机号
		getPhoneNumber(infoRes){
			let _this = this
			console.log(infoRes);
			if(infoRes.detail.errMsg=='getPhoneNumber:ok'){
				let params = {
					code: _this.code,
					iv: infoRes.detail.iv,
					encryptedData: infoRes.detail.encryptedData
				};
				_this.$api.upMobile(params).then(res => {
					if (res.code == 1) {
						_this.$refs.popup.close()
						_this.toIndex()
					}
				});
			}else{
				this.getToken('')

			}
		},
		
		toIndex(){
			if(this.url){
				console.log(`/pages/${this.url}/${this.url}?${this.key}=${this.params}`)
				uni.redirectTo({
					url:`/pages/${this.url}/${this.url}?${this.key}=${this.params}`
				})
			}else{
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		},
		showGetMobileButton(){
			let _this = this
			uni.login({
				success(res){
					_this.code=res.code;
					_this.$refs.popup.open()
				},fail: function(err) {
					console.log(err);
				}
			})
		},
		login() {
			let _this = this
			uni.showLoading({
				title: '加载中...'
			});
			uni.login({
				success(res) {
					if (res.code) {
						uni.getUserInfo({
							// provider: 'weixin',
							success: function(infoRes) {
								console.log(infoRes);
								if(infoRes.errMsg!='getUserInfo:ok'){
									//获取用户信息失败
									uni.hideLoading()
									return;
								}
								let params = {
									invitation: _this.inviteId,
									// invitation: 7,
									code: res.code,
									iv: infoRes.iv,
									encryptedData: infoRes.encryptedData
								};
								_this.$api.wechatLoginApi(params).then(res => {
									uni.hideLoading()
									if (res.code == 1) {
										_this.getToken(res.data.token);
										_this.setUserInfo(res.data.userInfo)
										if(res.data.mobile){
											
												_this.toIndex()
											
											return;
										}
										_this.showGetMobileButton();
									}
								});
							},
							fail: function(err) {
								console.log(err);
							}
						});
					} else {
						uni.hideLoading()
						console.log('登录失败！' + res.errMsg);
					}
				},fail: function(err) {
					uni.hideLoading()
					console.log(err);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 120upx;

	position: relative;
	width: 100vw;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	text-align: center;
	margin: 80upx 0;
}

.confirm-btn {
	width: 86vw;
	background: $uni-color-primary;
}
.forget-section {
	font-size: $font-base + 4upx;
	color: rgb(153, 153, 153);
	text-align: center;
	margin-top: 40upx;
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
.bing-phone{
	background: #fff;
	font-size: 32upx;
	border-radius: 10rpx;
	width: 80vw;
	.header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx 30upx;
		border-bottom: 2upx solid #ccc;
		
	}
	.contdesc{
		 word-break: normal;
		 font-size: 30upx;
		 line-height: 1.5;
		padding: 40upx 30upx;
	}
	.footer{
		display: flex;
		align-items: center;
		justify-content: space-between;
		button{
			width: 50%;
			border-radius: 0;
			&::after{
				border-radius: 0;
			}
			&:first-child{
				border-bottom-left-radius: 10upx;
				background: #fff;
			}
			&:last-child{
				border-bottom-right-radius: 10upx;
			}
		}
	}
}
</style>
