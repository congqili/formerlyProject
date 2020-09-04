<template>
	<view class="member tab-container">
		<uni-notice-bar v-if='showNotice' showClose="true" showIcon="true" :text="noticeMsg"></uni-notice-bar>
		<view class="info">
			<view class="advatar">
				<view>注册会员</view>
				<image :src="userInfo.wechat.headimgurl"></image>
			</view>
			<view class="info-text" @click="easter">
				<view>{{userInfo.name}}<text>领袖</text></view>
				<view>{{userInfo.mobile | filterMobile}}</view>
			</view>
			<image @click="sign" src="/static/ios/qiandao@2x.png" class="sign"></image>
		</view>
		<view class="message">
			<view class="message-item">
				<view>{{userInfo.integral}}</view>
				<view>积分</view>
			</view>
			<text>|</text>
			<view class="message-item">
				<view>56.8</view>
				<view>钱包</view>
			</view>
			<text>|</text>
			<view class="message-item">
				<view>901</view>
				<view>粉丝</view>
			</view>
		</view>
		<view class="order-info">
			<view class="order-item">
				<view class="item-tit">
					<view>
						<image src="/static/dingdan.png"></image>
						我的订单
					</view>
					<view>更多</view>
				</view>
				<view class="item-txt">
					<view>
						<view>今日新增订单</view>
						<view>98<text>单</text></view>
					</view>
					<view>
						<view>昨日新增订单</view>
						<view>3556<text>单</text></view>
					</view>
				</view>
			</view>
			<view class="order-item">
				<view class="item-tit">
					<view>
						<image src="/static/shouyi.png"></image>
						我的粉丝
					</view>
					<view>更多</view>
				</view>
				<view class="item-txt">
					<view>
						<view>今日新增粉丝</view>
						<view>116<text>人</text></view>
					</view>
					<view>
						<view>昨日新增粉丝</view>
						<view>2375<text>人</text></view>
					</view>
				</view>
			</view>
			<view class="order-item">
				<view class="item-tit">
					<view>
						<image src="/static/fensi1.png"></image>
						预估收益
					</view>
					<view>更多</view>
				</view>
				<view class="item-txts">
					<view>
						<view><text>￥</text>116</view>
						<view>佣金收益</view>
					</view>
					<view>
						<view><text>￥</text>2735</view>
						<view>带单奖励</view>
					</view>
					<view>
						<view><text>￥</text>2735</view>
						<view>膨胀红包</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lead" v-if="showLead">
			<view>邀请粉丝<image mode="widthFix" src="../../static/triangle.png"></image></view>
			<view>苏宁授权<image mode="widthFix" src="../../static/triangle.png"></image></view>
			<view>新手教程<image mode="widthFix" src="../../static/triangle.png"></image></view>
			<view>建议反馈<image mode="widthFix" src="../../static/triangle.png"></image></view>
			<view>关于我们<image mode="widthFix" src="../../static/triangle.png"></image></view>
			<view>开通助理 （自动群推广）<image mode="widthFix" src="../../static/triangle.png"></image></view>
		</view>
		<view class="preferred" :style="{marginTop:showLead?'':'-26rpx'}">
			<view>磐石优选·验货实拍</view>
			<view>
				<view>
					<image mode="aspectFit" src="/static/shipaiyanhuo.png"></image>
					实拍验货
				</view>
				<view>
					<image mode="aspectFit" src="/static/zhiliangyankong.png"></image>
					质量严控
				</view>
				<view>
					<image mode="aspectFit" src="/static/qiangxianyibu.png"></image>
					抢先一步
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" content='我就是那个邱继凯' message="成功消息" :duration="2000" :before-close="true" @close="close" @confirm="close">
				
			</uni-popup-dialog>
		</uni-popup>
		<tab-bar checked='4'></tab-bar>
	</view>
</template>

<script>
	import tabBar from '@/components/tarbbar/tabbar.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	
	export default {
		components: {
			tabBar,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			uniNoticeBar,
		},
		data() {
			return {
				showLead: true,
				count: 0,
				dialogShow: false,
				userInfo:{},
				noticeMsg:'',
				showNotice:false
			}
		},
		onLoad() {
			wx.hideTabBar();
			// this.getUserInfo()
		},
		filters:{
			filterMobile(mobile){
				if(!mobile) return ''
				
				return mobile
			}
		},
		methods: {
			easter() {
				this.count++;
				if (this.count == 2) {
					this.count = 0;
					// this.$refs.popup.open()
				}
			},
			getUserInfo(){
				if(uni.getStorageSync('userToken') && uni.getStorageSync('userInfo')) {
					this.userInfo = uni.getStorageSync('userInfo')
					return
				}
				this.$api.getUserInfoApi().then(res=>{
					console.log(res)
					this.userInfo = res.data
				})
			},
			sign(){
				this.$api.signinApi().then(res=>{
					console.log(res)
					this.noticeMsg = res.msg
					this.showNotice = true
					setTimeout(()=>{
						this.showNotice = false
					},3000)
				})
			},
			close(){
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #f9f7f3;
	}

	.member {
		view {
			line-height: 1;
		}

		.info {
			overflow: hidden;
			background: #ffe3a5;

			&>view {
				float: left;
			}
			&>image:last-child{
				float: right;
			}
			.advatar {
				position: relative;
				margin-left: 22rpx;

				view {
					position: absolute;
					height: 24rpx;
					width: 80rpx;
					font-size: 16rpx;
					color: #FFF;
					text-align: center;
					line-height: 24rpx;
					background: #d6b16d;
					bottom: 0;
					right: 0;
					border-radius: 12rpx;
				}

				image {
					width: 126rpx;
					height: 126rpx;
					border-radius: 50%;
				}
			}

			.info-text {
				margin-left: 18rpx;

				view:first-child {
					position: relative;
					font-size: 33rpx;
					color: #6a5225;
					margin: 30rpx 0 14rpx;

					text {
						position: absolute;
						width: 46rpx;
						height: 20rpx;
						top: 0;
						color: #FFF;
						font-size: 14rpx;
						text-align: center;
						background: #d6b16d;
						line-height: 20rpx;
					}
				}

				view:last-child {
					font-size: 22rpx;
				}
			}

			.sign {
				width: 50rpx;
				height: 52rpx;
				margin-right: 74rpx;
				margin-top: 30rpx;
			}
		}

		.message {
			background: #ffe3a5;
			display: flex;
			justify-content: space-between;
			padding: 0 80rpx;

			text {
				font-size: 30rpx;
				margin-top: 73rpx;
			}

			.message-item {
				view:first-child {
					font-size: 34rpx;
					color: #6a5225;
					text-align: center;
					margin: 50rpx 0 14rpx;
				}

				view:last-child {
					font-size: 25rpx;
					color: #bf9b53;
					text-align: center;
					margin-bottom: 90rpx;
				}
			}
		}

		.order-info {
			width: 704rpx;
			background: #FFF;
			border-radius: 8rpx;
			padding: 26rpx 20rpx 0;
			box-sizing: border-box;
			margin: 0 auto;
			position: relative;
			top: -52rpx;

			.order-item {
				.item-tit {
					display: flex;
					justify-content: space-between;
					padding-bottom: 24rpx;
					border-bottom: 2rpx solid #f9efdc;

					view:first-child {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #66532c;

						image {
							width: 29rpx;
							height: 27rpx;
							margin-right: 15rpx;
						}
					}

					view:last-child {
						color: #d0b276;
						font-size: 21rpx;
					}

				}

				.item-txt {
					display: flex;
					justify-content: space-between;
					padding: 0 23rpx;
					&>view {
						text-align: center;
						view:first-child {
							display: inline-block;
							font-size: 26rpx;
							color: #d0b276;
							margin: 35rpx 0 63rpx 0;
						}
						view:last-child {
							display: inline-block;
							color: #66532c;
							font-size: 34rpx;
							margin-left: 17rpx;
							text {
								margin-left: 7rpx;
								font-size: 16rpx;
							}
						}
					}
				}
				.item-txts{
					display: flex;
					justify-content: space-between;
					padding: 0 35rpx;
					&>view{
						text-align: center;
						margin: 33rpx 0 35rpx 0;
					}
					view:first-child {
						font-size: 34rpx;
						color: #66532c;
						margin-bottom: 17rpx;
						text{
							font-size: 18rpx;
						}
					}
					view:last-child {
						color: #d0b276;
						font-size: 26rpx;
					}
				}
			}
		}

		.preferred {
			background: #FFF;
			border-radius: 12rpx;
			overflow: hidden;
			width: 704rpx;
			margin: 0 auto;

			&>view:first-child {
				font-size: 23rpx;
				color: #9b9b9b;
				text-align: center;
				letter-spacing: 4rpx;
				margin: 16rpx 0 22rpx;
			}

			&>view:last-child {
				display: flex;
				justify-content: space-between;
				padding: 0 50rpx;
				margin-bottom: 24rpx;

				view {
					display: flex;
					align-items: center;
					font-size: 21rpx;
					color: #d0b276;
					image {
						width: 30rpx;
						height: 26rpx;
						margin-right: 14rpx;
					}
				}
			}
		}

		.lead {
			width: 704rpx;
			margin: 0 auto;
			background: #FFF;
			padding: 0 26rpx;
			box-sizing: border-box;
			margin-bottom: 28rpx;
			margin-top: -26rpx;
			font-size: 26rpx;
			overflow: hidden;
			view {
				padding: 16upx 0;
				color: #d0b276;
				box-sizing: border-box;
				border-bottom: 1rpx solid #f4dfb9;
				display: flex;
				justify-content: space-between;
				align-items: center;
				image{
					width: 14upx;
				}
			}
			view:first-child{
				margin-top: 22upx;
			}
			view:last-child {
				border: 0;
				margin-bottom: 22upx;
			}
		}
	}
</style>
