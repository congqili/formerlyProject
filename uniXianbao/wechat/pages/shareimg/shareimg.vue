<template>
	<view class="share-page">
		<view class="content">
			<view class="img-list">
				<view class="img-item" @click="selectImg(index+1)" v-for="(item,index) in imgList">
					<view :class="[check==index+1?'check':'']">{{check==index+1?index+1:''}}</view>
					<image :src="item" mode=""></image>
				</view>
				<!-- <view class="img-item" @click="selectImg(1)">
					<view :class="[check==1?'check':'']">{{check==1?'1':''}}</view>
					<image src="../../static/avatar.png" mode=""></image>
				</view>
				<view class="img-item" @click="selectImg(2)">
					<view :class="[check==2?'check':'']">{{check==2?'2':''}}</view>
					<image src="../../static/goodsimg.png" mode=""></image>
				</view>
				<view class="img-item" @click="selectImg(3)">
					<view :class="[check==3?'check':'']">{{check==3?'3':''}}</view>
					<image src="../../static/testa.png" mode=""></image>
				</view> -->
			</view>
			<view class="canvas-body" @click="previewImage(canvasImg)">
				<canvas canvas-id="myCanvas"></canvas>
			</view>
		</view>
		<view class="bottom-btn">
			<view>保存到手机相册</view>
			<view>预览并长按分享</view>
		</view>
	</view>
</template>

<script>
	import common from '@/common/common.js';
	export default {
		data() {
			return {
				imgList:['../../static/goodsimg.png','../../static/avatar.png','../../static/testa.png'],
				check: 1,
				canvasImg:'',
				canvasObj:{
					goodsimg:'/static/goodsimg.png',
					tit:'多层编织置物架收纳盒框架扣题是办公室桌面分格收纳盒杂物收纳筐',
					qrcode:'/static/copyright.jpg',
					username:'   我就是那个邱继凯   ',
					price:'25.8',
					coupon:'5'
				}
			}
		},
		created(){
			this.drawImg()
		},
		methods: {
			previewImage(url) {
				// console.log(url)
				if(!Array.isArray(url)){
					common.imagePreview([url])
				}else{
					common.imagePreview(url)
				}
			
			},
			selectImg(index) {
				this.check = index
				this.canvasObj.goodsimg = this.imgList[index-1]
				this.drawImg()
				
			},
			drawImg() {
				uni.showLoading({
					title: '加载中,请稍后'
				});
				let that = this
				
				wx.getSystemInfo({
					success(res) {
						//计算物理像素比
							
						let maxWidth = res.windowWidth;
						let maxHeight = res.windowHeight;
						let dpr = maxWidth / 750
						
						const ctx = uni.createCanvasContext('myCanvas')
						
						ctx.fillStyle = '#fff';
						ctx.fillRect(0, 0, 624*dpr, 1000*dpr);
						//商品图
						ctx.drawImage(that.canvasObj.goodsimg, 30*dpr, 30*dpr, 558 * dpr, 643 * dpr)
						
						ctx.setFontSize(24 * dpr)
						ctx.setFillStyle('#666');
						ctx.fillText(that.canvasObj.tit, 95 * dpr, 716 * dpr)
						
						ctx.drawImage(that.canvasObj.qrcode, 440*dpr, 800*dpr, 118 * dpr, 118 * dpr)
						
						ctx.setFontSize(17 * dpr)
						ctx.setFillStyle('#6a6a6a');
						ctx.fillText('好 友'+that.canvasObj.username+'向 您 推 荐', 86 * dpr, 895 * dpr)
						ctx.fillText('可 享 受 苏 宁 内 购 优 惠', 86 * dpr, 920 * dpr)
						
						//优惠券
						ctx.drawImage('/static/youhuiquan-.png', 164*dpr, 810*dpr, 62 * dpr, 30 * dpr)
						ctx.setFontSize(19 * dpr)
						ctx.setFillStyle('#fb6b3c');
						ctx.fillText('￥'+that.canvasObj.coupon, 180 * dpr, 832 * dpr)
						
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

			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '素材分享'
			})
		},
		props: ['type', 'imgs', 'tit']
	}
</script>

<style lang="less">
	.share-page {
		padding-bottom: 160upx;

		.bottom-btn {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 138upx;
			background: #FFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 76upx;

			view {
				color: #FFF;
				background: #d6b16d;
				width: 280upx;
				height: 60upx;
				text-align: center;
				line-height: 60upx;
				border-radius: 6upx;
				font-size: 25upx;
			}
		}

		.content {
			margin-top: 10upx;

			.img-list {
				height: 135upx;
				padding: 0 24upx;
				display: flex;

				.img-item {
					position: relative;
					width: 135upx;
					height: 135upx;
					margin-right: 20upx;

					view {
						height: 32upx;
						width: 32upx;
						background: rgba(0, 0, 0, .3);
						position: absolute;
						border-radius: 50%;
						color: #FFF;
						top: 16upx;
						font-size: 25upx;
						text-align: center;
						line-height: 32upx;
						right: 16upx;
					}

					.check {
						background: #d6b16d;
					}

					image {
						width: 135upx;
						height: 135upx;
					}
				}
			}

			.canvas-body {
				margin: 60upx 64upx 0;
				background: #FFF;
				border-radius: 14upx;
				overflow: hidden;

				canvas {
					width: 100%;
					height: 1000upx;
				}
			}
		}
	}
</style>
