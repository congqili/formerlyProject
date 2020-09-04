<template>
	<view class="share">
		<image mode="widthFix" class="bg" src="../../static/bg2.png"></image>
		<image class="log" mode="widthFix" src="../../static/log.png"></image>
		<view class="rule" @click="toggleRule">规则&gt;</view>
		<view class="mask" v-if="show">
			<view class="close" @click="toggleMask">×</view>
			<view class="qr-code">
				<view>保存至相册扫码领取奖励</view>
				<view class="code-btn" @click="save(qr_code)">立即保存</view>
				<image class="code" :src="qr_code" @click="previewImage(qr_code)"></image>

				<image src="../../static/hongbao.png"></image>
			</view>
		</view>
		<view class="rule-mask" v-if="ruleShow">
			<view class="close" @click="toggleRule">×</view>
			<view class="rule-content">
				<view>规则</view>
				<rich-text :nodes="rule" space='nbsp'></rich-text>
			</view>
		</view>
		<view class="message">
			<image :src="info.user.user_head"></image>
			<view class="text">
				<view class="arrow"></view>
				<view>老铁，我正在参加联合利华好友助力，</view>
				<view>让我的佣金膨胀<text>{{multiple}}</text>倍</view>
				<view>快来帮忙顶一下</view>
			</view>
		</view>

		<button :class="btn_show?'btn':'btn gray'" @click="boost">{{btn_show?'帮他助力':'已完成助力'}}</button>
		<view class="join" @click="toggleMask">我也要领膨胀奖励 &gt;</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup">不能给自己助力哦！</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		toBoost
	} from '../../common/newApi.js';
	import common from '@/common/common.js';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				show: false,
				id: '',
				config: {},
				qr_code: '',
				info: {},
				ruleShow: false,
				btn_show: true,
				multiple: 0,
				rule: ''
			}
		},
		 
		methods: {
			toggleMask() {
				this.show = !this.show
			},
			toggleRule() {
				this.ruleShow = !this.ruleShow
			},
			boostApi(id,help){
				toBoost({id,help})
				.then()
			},
			boost() {
				if (!this.info.is_self && !this.info.is_help) {
					toBoost({
						id: this.id,
						help: 1
					}).then((res) => {
						uni.showToast({
							title: '助力成功！'
						})
						this.btn_show = false;
					})
				}else{
					// uni.showToast({
					// 	title: '已经助力过了！' 
					// })
				}
			},
			previewImage(url) {
				common.imagePreview([url])
			},
			save(url) {
				common.saveImage(url)
			}
		},
		onLoad(options) {
			this.id = options.id
			console.log(this.id)

			if (!uni.getStorageSync('userToken')) {
				return uni.redirectTo({
					url: '/pages/login/index?url=toboost&params=' + options.id + "&key=id"
				})
			}
			toBoost({
				id: options.id,
				help: 0
			}).then((res) => {
				// console.log(res)
				if (!res.status) {
					return common.showToast(res.msg);
				}
				console.log(res)
				
				this.info = res.info;
				this.multiple = this.info.multiple;
				
				if (this.info.is_help || this.info.remain_num <= 0) {
					 this.btn_show = false;
				}
				this.qr_code = res.info.qrcode;
				this.config = res.info.config;
				this.rule = this.config.boost_rule.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
				if (res.info.is_self) {
					return uni.redirectTo({
						url: '/pages/boost/boost?code=' + this.info.code
					})
				}
			})
			.catch((err)=>{
				console.log(err)
				uni.showToast('数据请求失败')
			})
		},
		onShareAppMessage() {
			return {
				title: "易线报",
				imageUrl: 'https://cdn.iyizhanke.com/fb/05416c715039fd0874139c808d633e.jpg',
				path: "/pages/toboost/toboost?id=" + this.id + "&invitation=" + uni.getStorageSync('userInfo').id
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #f8afa7;
	}

	.share {
		overflow: hidden;

		.log {
			width: 200rpx;
			left: calc(50% - 100rpx);
			position: absolute;
			top: 20rpx;
		}

		.popup {
			position: fixed;
			width: 430rpx;
			height: 320rpx;
			background: #FFF;
			text-align: center;
			line-height: 320rpx;
			font-size: 40rpx;
			left: calc(50% - 215rpx);
			top: -640rpx;
			border-radius: 10rpx;
		}

		.bg {
			width: 100%;
			position: absolute;
			z-index: -1;
			top: 0;
		}

		.rule {
			color: #FFF;
			font-size: 26rpx;
			position: absolute;
			right: 44rpx;
			top: 40rpx;
		}

		.rule-mask {
			position: fixed;
			background: rgba(0, 0, 0, .5);
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 50;

			.close {
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				color: #FFF;
				font-size: 100rpx;
			}

			.rule-content {
				width: 526rpx;
				height: 718rpx;
				background: #FFF;
				border-radius: 30rpx;
				position: absolute;
				overflow-x: hidden;
				overflow-y: auto;
				top: calc(50% - 359rpx);
				left: calc(50% - 263rpx);

				view:first-child {
					text-align: center;
					color: 32rpx;
					margin: 58rpx 0 30rpx 10rpx;
				}

				rich-text {
					text-overflow: ellipsis;

					word-wrap: break-word;
					font-size: 24rpx;
					padding: 0 40rpx;
				}
			}
		}

		.mask {
			position: fixed;
			background: rgba(0, 0, 0, .5);
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 50;

			.close {
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				color: #FFF;
				font-size: 100rpx;
			}

			.qr-code {
				width: 432rpx;
				height: 620rpx;
				position: absolute;
				left: calc(50% - 216rpx);
				top: calc(50% - 310rpx);

				view {
					text-align: center;
					position: absolute;
					z-index: 20;
					width: 100%;
				}

				.code {
					width: 182rpx;
					height: 182rpx;
					position: absolute;
					z-index: 50;
					left: calc(50% - 91rpx);
					top: 144rpx;
				}

				view:first-child {
					font-size: 24rpx;
					color: #595959;
					top: 360rpx;
				}

				.code-btn {
					width: 252rpx;
					height: 74rpx;
					font-size: 43rpx;
					color: #FFF;
					line-height: 74rpx;
					border-radius: 5rpx;
					background: #ffce00;
					bottom: 52rpx;
					left: calc(50% - 126rpx);
				}

				image:last-child {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
		}

		.message {
			margin-top: 930rpx;
			display: flex;
			align-items: center;

			&>image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 50rpx;
				margin-left: 30rpx;
			}

			.text {
				width: 534rpx;
				padding: 30rpx 0;
				font-size: 26rpx;
				background: #fbcfca;
				color: #46080b;
				border-radius: 12rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;

				.arrow {
					margin: 0;
					position: absolute;
					left: -45rpx;
					width: 0px;
					height: 0px;
					border-top: 16rpx solid transparent;
					border-left: 24rpx solid transparent;
					border-right: 24rpx solid #fbcfca;
					border-bottom: 16rpx solid transparent;

				}

				view:nth-child(3) {
					font-size: 38rpx;
					margin: 16rpx 0 16rpx 30rpx;

					text {
						font-size: 44rpx;
						margin: 0 16rpx;
					}
				}

				view {
					margin-left: 30rpx;
					position: relative;
				}
			}

		}

		.btn {
			width: 406rpx;
			height: 77rpx;
			background: #ea6a5a;
			color: #fee400;
			text-align: center;
			line-height: 77rpx;
			font-weight: bold;
			border-radius: 10rpx;
			margin: 70rpx auto 0;
		}

		.gray {
			background: gray;
			color: #FFF;
		}

		.join {
			text-align: center;
			font-size: 27rpx;
			background: #ffaba4;
			color: #812c26;
			width: 406rpx;
			height: 77rpx;
			text-align: center;
			line-height: 77rpx;
			margin: 0 auto;
			border-radius: 10rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			margin-bottom: 40rpx;
			border: 2rpx solid #fc5f52;
		}
	}
</style>
