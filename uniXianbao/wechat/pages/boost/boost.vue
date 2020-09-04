<template>
	<view class="boost">
		<image class="bg" mode="widthFix" src="../../static/bg.png"></image>
		<image class="log" mode="widthFix" src="../../static/log.png"></image>
		<view class="rule" @click="toggleRule">规则&gt;</view>
		<view class="mask" v-show="showReward">
			<view class="close" @click="toggleMask">×</view>
			<view class="qr-code">
				<view>领取奖励</view>
				<view>保存至相册扫码领取奖励</view>
				<view class="code-btn" @click="saveImage(qr_code)">立即保存</view>
				<image class="code" :src="qr_code" @click="previewImage(qr_code)"></image>

				<image src="../../static/hongbao.png"></image>
			</view>
		</view>
		<view class="share-pop" v-show="showShare">
				<view class="close" @click="toggleShare">×</view>
				<canvas @click="previewImage(canvasImg)" style="" class="canvasImg" canvas-id="myCanvas"></canvas>
				<view class="save-btn" @click="saveImage(canvasImg)">保存至相册</view>
				<button @click="previewImage(canvasImg)" class="share-btn">长按预览并分享</button>
			
		</view>
		<view class="rule-mask" v-show="ruleShow">
			<view class="close" @click="toggleRule">×</view>
			<view class="rule-content">
				<view>规则</view>
				<rich-text :nodes="rule" space='nbsp'></rich-text>
			</view>
		</view>
		<view class="todo">
			<view>邀请{{config.boost_max_help_num}}个好友助力</view>
			<view>佣金膨胀<text>{{boost.boost_multiple}}</text>倍</view>
		</view>
		<view class="text">
			<view>联合利华好友助力</view>
			<view>最高得<text>{{boost.boost_money * boost.boost_multiple}}元</text>红包</view>
		</view>
		<view class="progress-bar">
			<view class="line"></view>

			<view class="bar" :style="{'width':barWidth+'rpx'}"></view>
			<view class="step">
				<view :key='index' :class="boostList.length>=index+1?'':'unsuccess'" v-for="(item,index) in config.boost_max_help_num">
					{{boostList.length>=index+1?'√':index+1}}
				</view>
			</view>
		</view>
		<view class="step-text">
			<view :key='index' v-for="(item,index) in config.boost_max_help_num">{{index+1}}人助力</view>
		</view>

		<view class="btn" v-if="boost.boost_is_success" @click="toggleMask">

			前往领取奖励
		</view>
		<button @click="toggleShare" class="btn" v-else>
			邀请好友助力
		</button>
		<view class="boost-list" v-if="boostList.length>0">
			<view class="boost-item" :key='index' v-for="(item,index) in boostList">
				<image :src="item.user_head"></image>
				<view>{{item.user_nickname}}</view>
				<view>{{item.user_boost_time}}</view>
				<view>助力成功</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getBoostList,
		getBoostShareQrcode
	} from '../../common/newApi';
	import common from '@/common/common.js';
	import share from "../share/share";
	export default {
		data() {
			return {
				code: '',
				boost:{},
				boostList: [],
				config: {},
				qr_code: '',
				//显示控制
				showReward: false,
				showShare: false,
				ruleShow: false,
				
				shareImage: '',
				barWidth: 0,
				shareImg: '',
				rule: '',
				canvasImg: '',
				canvasObj: {
					headImg: "",
					nickName: "",
					num: 5
				}
			}
		},
		onShow() {

		},
		onLoad(options) {
			this.code = options.code;
			let that = this;

			if (!wx.getStorageSync('userToken')) {
				return wx.redirectTo({
					url: '/pages/login/index?url=boost&params=' + that.code + "&key=code"
				})
			}
			that.canvasObj.headImg = uni.getStorageSync('userInfo').wechat.headimgurl;
			that.canvasObj.nickName = uni.getStorageSync('userInfo').name;

			this.getBoostMessage(this.code);
			
			/*if (uni.getStorageSync('canvasImg-' + this.code)) {
				this.canvasImg = wx.getStorageSync('canvasImg-' + this.code)
			}*/
		},
		methods: {
			toggleMask() {
				this.showReward = !this.showReward;

			},
			drawImg() {
				uni.showLoading({
					title: '加载中,请稍后'
				});
				let that = this
				that.showShare = true;

				uni.downloadFile({
					url: that.shareImage,
					success(shareRes) {

						// 获取设备尺寸
						wx.getSystemInfo({
							success(res) {
								//计算物理像素比
								let maxWidth = res.windowWidth;
								let maxHeight = res.windowHeight;
								let dpr = maxWidth / 750

								//创建canvas上下文
								const ctx = wx.createCanvasContext('myCanvas')

								//绘制背景图
								ctx.drawImage(shareRes.tempFilePath, 0, 0, 600 * dpr, 978 * dpr)

								//昵称文字
								ctx.setFontSize(35 * dpr)
								ctx.setFillStyle('#680d09');
								ctx.fillText(that.canvasObj.nickName.substr(0, 8), 160 * dpr, 800 * dpr); //本来设置的0，现在需要加上fontWidth

								//倍数文字
								ctx.setFontSize(22 * dpr)
								ctx.setFillStyle('#680d09');
								ctx.fillText(that.canvasObj.num, 290 * dpr, 860 * dpr)

								//绘制分享二维码
								//ctx.drawImage(shareRes.tempFilePath, 422.5 * dpr, 755* dpr, 135 * dpr, 135 * dpr)

								//绘制头像
								//ctx.arc(87 * dpr, 830 * dpr, 50 * dpr, Math.PI * 2);
								//ctx.clip();
								//ctx.drawImage(headRes.tempFilePath, 36 * dpr, 780 * dpr, 100 * dpr, 100 * dpr);

								ctx.draw(false, function() {
									wx.canvasToTempFilePath({
										x: 0,
										y: 0,
										canvasId: 'myCanvas',
										success: function(sres) {
											uni.hideLoading();
											that.canvasImg = sres.tempFilePath
											//wx.setStorageSync('canvasImg-' + that.code, sres.tempFilePath)

										},
										fail: (err) => {
											console.log(err)
											return common.showToast('海报获取失败！')
										}
									})
								});
							}
						})
					},
					fail: (downloaderr) => {
						// console.log(downloaderr)
						return common.showToast('图片获取失败！')
					}
				})
			},
			toggleRule() {
				this.ruleShow = !this.ruleShow
			},
			//切换分享页显示
			toggleShare() {
				let that = this
				//关闭不再请求
				if (that.showShare) return that.showShare = false;
				
				getBoostShareQrcode({
						code: this.code
					})
					.then((res) => {
						if (!res.status) {
							return common.showToast(res.msg);
						}
						that.shareImage = res.info.image;
						console.log(this.shareImage)
						this.drawImg()
					})
					.catch((err) => {
						return common.showToast(res.err)
					})
			},
			//图片预览方法
			previewImage(url) {
				// console.log(url)
				common.imagePreview([url])

			},
			//保存图片方法
			saveImage(url) {
				common.saveImage(url)
			},
			//获取助力相关信息
			getBoostMessage(code) {
				getBoostList({
						code
					})
					.then((res) => {
						let that = this;
						// console.log(res)
						if (!res.status) {
							uni.switchTab({
								url: '/pages/index/index'
							})

						} else {
							//助力信息
							this.boost = res.info.boost;
							this.boostList = this.boost.boost_users;
							
							//配置信息
							this.config = res.info.config;
							
							this.qr_code = res.info.boost.boost_qrcode;
							
							this.rule = this.config.boost_rule.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
							// console.log(res)
							
							that.canvasObj.num = this.boost.boost_multiple;
							
							//进度条宽度
							this.barWidth = this.boostList.length / this.config.boost_max_help_num * 590.0;
							//宽度限制
							if (this.barWidth > 580) {
								this.barWidth = 580;
							}
							uni.setStorageSync('id', this.boost.id)
							uni.setStorageSync("qrcode", this.qr_code)
							
						}
					})
					//助力信息错误捕获
					.catch((err) => {
						console.log(err)
						return common.showToast('数据获取失败')
					})
			}
		},
		//用户分享信息
		onShareAppMessage() {

			return {
				title: "易线报",
				imageUrl: this.qr_code,
				path: "/pages/toboost/toboost?id=" + this.boost.id + "&invitation=" + this.userInfo.id
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #f8afa7;
	}

	.boost {
		.log {
			width: 200rpx;
			left: calc(50% - 100rpx);
			position: absolute;
			top: 20rpx;
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
				padding: 0 10rpx;
				box-sizing: border-box;
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

				view:first-child {
					color: #595959;
					font-size: 33rpx;
					top: 66rpx;
				}

				.code {
					width: 182rpx;
					height: 182rpx;
					position: absolute;
					z-index: 50;
					left: calc(50% - 91rpx);
					top: 144rpx;
				}

				view:nth-child(2) {
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

		overflow: hidden;

		.bg {
			position: absolute;
			z-index: -1;
			width: 100%;
		}

		.todo {
			width: 520rpx;
			height: 56rpx;

			color: #fdf353;
			font-size: 32rpx;
			text-align: center;
			border-radius: 28rpx;
			margin: 394rpx auto 0;

			view {
				font-style: italic;
				background: linear-gradient(to top, #ffff38, #FFFFFa);
				-webkit-background-clip: text;
				background-clip: text;
				color: transparent;
			}

			view:first-child {
				font-size: 34rpx;
				letter-spacing: 12rpx;
			}

			view:last-child {
				font-size: 44rpx;
				letter-spacing: 4rpx;

				text {
					font-size: 60rpx;
					vertical-align: top;
				}
			}
		}

		.text {
			margin-top: 320rpx;
			text-align: center;
			color: #62241d;

			view:first-child {
				font-size: 42rpx;
			}

			view:last-child {
				font-size: 26rpx;

				text {
					margin: 0 10rpx;
				}
			}
		}

		.progress-bar {
			width: 590rpx;
			height: 50rpx;
			margin: 60rpx auto 12rpx;
			position: relative;

			.line {
				height: 13.2rpx;
				position: absolute;
				width: 570rpx;
				top: calc(50% - 6.6rpx);
				left: calc(50% - 285rpx);
				background: #f09e8b;
				z-index: 1;
			}

			.bar {
				height: 13.2rpx;
				position: absolute;
				width: 350rpx;
				top: calc(50% - 6.6rpx);
				left: 10rpx;
				background: #e96c5b;
				z-index: 2;
				border-radius: 6.6rpx;
			}

			.step {
				width: 590rpx;
				display: flex;
				justify-content: space-between;
				position: relative;
				z-index: 10;

				view {
					box-sizing: border-box;
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					border: 2rpx solid #feed00;
					background: #e96c5b;
					line-height: 50rpx;
					color: #feed00;
					text-align: center;
					font-size: 30rpx;
				}

				.unsuccess {
					color: #e96c5b;
					background: #FFF;
				}
			}
		}

		.step-text {
			color: #62241d;
			font-size: 25rpx;
			width: 628rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
		}

		.btn {
			width: 406rpx;
			height: 77rpx;
			background: #ea6a5a;
			color: #fee400;
			text-align: center;
			line-height: 77rpx;
			font-weight: bold;
			margin: 58rpx auto 0;
			border-radius: 10rpx;
		}

		.boost-list {
			width: 620rpx;
			padding: 36rpx 0;
			background: rgba(255, 255, 255, .3);
			margin: 52rpx auto 64rpx;
			border-radius: 16rpx;
			font-size: 23rpx;
			color: #000;

			.boost-item {
				height: 50rpx;
				width: 578rpx;
				margin-left: 15rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 18rpx;

				image {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
				}
			}

			.boost-item:first-child {
				margin-top: 0;
			}
		}

		.share-pop {
			position: fixed;
			background: rgba(0, 0, 0, .5);
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 50;

			&>view {
				height: 1300rpx;
			}

			.close {
				position: absolute;
				right: 30rpx;
				top: 10rpx;
				color: #FFF;
				font-size: 100rpx;
				line-height: 100rpx;
			}

			.canvasImg {
				width: 580rpx;
				height: 920rpx;
				position: absolute;
				top: 100rpx;
				left: calc(50% - 290rpx);
			}

			// image {
			// 	width: 580rpx;
			// 	height: 920rpx;
			// 	position: absolute;
			// 	left: calc(50% - 290rpx);
			// 	top: calc(50% - 500rpx);
			// }

			.save-btn {
				width: 580rpx;
				height: 70rpx;
				font-size: 43rpx;
				color: #FFF;
				line-height: 70rpx;
				border-radius: 5rpx;
				background: #fd6003;
				top: 1030rpx;
				left: calc(50% - 290rpx);
				position: absolute;
				text-align: center;
				font-size: 25rpx;
			}

			.share-btn {
				position: absolute;
				width: 580rpx;
				height: 70rpx;
				color: #FFF;
				font-size: 25rpx;
				top: 1110rpx;
				background: #e64240;
				line-height: 70rpx;
				text-align: center;
				left: calc(50% - 290rpx);
			}
		}
	}
</style>
