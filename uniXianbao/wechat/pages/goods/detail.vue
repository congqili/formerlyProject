<template>
	<view class="goods-detail">
		<view class="goods-info">
			<image class="main-img" :src="goodsInfo.goods_images[0]" @click="previewImage(goodsInfo.goods_images)"></image>
			<view class="info-text">
				<!-- <view class="desc">顺滑修复干枯烫染受损抚顺毛躁</view>
				<view class="title">三谷氨基酸洗发水洗护套装</view>
				<view class="price">
					<view>预估推广收益￥<text>{{goodsInfo.goods_data.price.gain}}</text></view>
					<view>￥<text>{{goodsInfo.goods_data.price.price}}</text></view>
				</view> -->
				<view class="int_price">
					<view>折后价</view>
					<view class="intp_gain">预估推广收益：<text>￥</text>{{goodsInfo.goods_data.price.gain}}</view>
				</view>
				<view class="intp_detail">
					<view class="intpd_price">￥<text class="ip_comprice">{{goodsInfo.goods_data.price.price}}</text>.00<text class="ip_snprice">￥{{goodsInfo.goods_data.commodityInfo.snPrice}}</text></view>
					<view class="intpd_subsify">单品补贴：￥0.5元</view>
				</view>
				<view class="intp_tit">{{goodsInfo.goods_data.commodityInfo.sellingPoint}}</view>
				<view class="intp_gdetail">{{goodsInfo.goods_title}}</view>
			</view>
		</view>
		<view class="detail-tit">
			<view></view>
			<view>宝贝详情</view>
		</view>
		<image @click="previewImage(goodsInfo.goods_images,index)" :src="item" :key='index' v-for="(item,index) in goodsInfo.goods_images"
		 mode="widthFix" class="detail-image"></image>
		<view class="share-btn" @click="mustShare">立即分享</view>
		<view class="share-pop" v-show="showShare" @click="toggleShare">
			<view class="share-body">
				<view class="close" @click.stop="toggleShare" style="display:block;">
					<image style="width:50rpx;height:50rpx" src="../../static/haibaocha.png" />
				</view>
				<image mode="widthFix" @click.stop="previewImagea" :src="canvasImg"></image>
				<button class="save-btn" @click.stop="saveImage">保存到手机相册</button>
				<button class="share-btn" @click.stop='previewImagea'>长按预览并分享</button>
			</view>
		</view>
		<poster class="poster" id="poster" v-bind:config="posterConfig" @success="onPosterSuccess" @fail="onPosterFail">
		</poster>
	</view>
</template>

<script>
	import {
		getGoodsDetail
	} from '../../common/newApi.js'
	import {
		previewImage,
		saveImage
	} from '../../minix/newBtn.js'
	import common from '../../common/common.js'
	import poster from '@/components/plugin-cavas/poster.vue'
	import Helper from '../../minix/helper.js'

	export default {
		components: {
			poster
		},
		data() {
			return {
				code: '',
				goodsInfo: {},
				showShare: false,
				posterConfig: {
					flag: false
				},
				canvasImg: ''
			}
		},
		onLoad(options) {
			this.code = options.code
			this.getGoodsDetail()
		},
		methods: {
			//画布生成成功回调
			onPosterSuccess(e) {
				Helper.hideLoading()
				console.log(e)
				this.canvasImg = e
				this.showShare = true
			},
			//画布生成失败回调
			onPosterFail(err) {
				Helper.hideLoading()
				console.error(err);
			},
			//x按钮
			toggleShare() {
				this.showShare = false
			},
			//预览图片
			previewImagea() {
				let url = this.canvasImg
				previewImage([url])
			},
			//保存图片
			saveImage() {
				let url = this.canvasImg
				saveImage(url)
			},
			//立即分享
			mustShare() {
				that.createPoster();
				if(this.canvasImg=='') {
					console.log(123)
					Helper.showLoading('生成中')
					let that = this;
					that.createPoster();
				}else{
					this.showShare = true
				}
				
				// Helper.showLoading('生成中')
				// that.getPopUrl('0', (res) => {
				// 	this.data.popUrl = res.info;
				// 	let url = res.info.wapExtendUrl;
				// 	genQrcode({
				// 		content: url
				// 	}).then((ress) => {
				// 		console.log(ress)
				// 		//Helper.hideLoading()
				// 		that.setData({
				// 			QRcode: ress.info.url
				// 		}, () => {
				// 			that.createPoster();
				// 			that.onShareAppMessage();
				// 		})
				// 	})
				// })
			},
			getGoodsDetail() {
				getGoodsDetail({
					code: this.code
				}).then(res => {
					console.log(res)
					this.goodsInfo = res.info.goods
				})
			},
			previewImage(src, inx) {
				common.imagePreview(src, inx);
			},
			//创建海报
			createPoster() {
				let config = {
					width: Helper.toRpx(652),
					height: Helper.toRpx(1010),
					backgroundColor: '#FFF',
					debug: false,
					pixelRatio: 1,
					blocks: [{
						x: Helper.toRpx(22),
						y: Helper.toRpx(702),
						height: Helper.toRpx(27),
						width: Helper.toRpx(61),
						borderRadius: Helper.toRpx(10),
						backgroundColor: '#ffe1e7',
						text: {
							baseLine: 'middle',
							text: '苏宁',
							fontSize: Helper.toRpx(17),
							color: '#ff0837',
						},
					}],
					texts: [{
							x: Helper.toRpx(37),
							y: Helper.toRpx(690),
							baseLine: 'middle',
							width: Helper.toRpx(79),
							lineHeight: Helper.toRpx(27),
							text: '券后价',
							fontSize: Helper.toRpx(26),
							color: '#000000',
						},
						{
							x: Helper.toRpx(127),
							y: Helper.toRpx(876),
							baseLine: 'middle',
							text: '￥18.50',
							fontSize: Helper.toRpx(30),
							color: '#ff0837',
							width:Helper.toRpx(140),
						},
						{
							x: Helper.toRpx(260),
							y: Helper.toRpx(885),
							baseLine: 'middle',
							text:'￥20.5',
							textdecoration:'line-through',
							width:Helper.toRpx(26),
							fontSize: Helper.toRpx(20),
							color: '#666666',
						},
						{
							x: Helper.toRpx(99),
							y: Helper.toRpx(948),
							baseLine: 'middle',
							text: 'sssssssssssssss',
							width:Helper.toRpx(342),
							lineNum: 2,
							lineHeight:Helper.toRpx(37),
							fontSize: Helper.toRpx(26),
							color: '#666666',
						},
						{
							x: Helper.toRpx(501),
							y: Helper.toRpx(1055),
							baseLine: 'middle',
							textAlign: 'center',
							lineNum: 2,
							width: Helper.toRpx(80),
							text: '长按识别二维码去购买',
							fontSize: Helper.toRpx(14),
							color: '#666',
						},
					],
					images: [{
							width: Helper.toRpx(595),
							height: Helper.toRpx(620),
							x: Helper.toRpx(29),
							y: Helper.toRpx(29),
							url: this.goodsInfo.goods_images[0],
						},
						{
							width: Helper.toRpx(652),
							height: Helper.toRpx(57),
							x: Helper.toRpx(0),
							y: Helper.toRpx(951),
							url: this.goodsInfo.goods_images[0],
						},
						{
							width: Helper.toRpx(169),
							height: Helper.toRpx(169),
							x: Helper.toRpx(501),
							y: Helper.toRpx(878),
							url: this.goodsInfo.goods_images[0],
						},
					]
				}
				console.log(config)
				this.posterConfig.flag = true
				this.posterConfig.value = config
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #FFF;
	}

	.poster {
		opacity: 0;
		z-index: -1;
	}

	.goods-detail {
		.detail-image {
			width: 750upx;
			display: block;
		}

		.goods-info {
			.main-img {
				display: block;
				width: 750upx;
				height: 708upx;
			}

			.info-text {
				padding: 50upx 32upx 50upx;

				.int_price {
					font-size: 26upx;
					color: #b89d6e;
					margin-bottom: 15upx;
					display: flex;
					justify-content: space-between;

					.intp_gain {
						text {
							font-size: 22upx;
						}
					}
				}

				.intp_detail {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.intpd_price {
						font-size: 30rpx;
						color: #baa071;

						.ip_comprice {
							font-size: 40rpx;
						}

						.ip_snprice {
							color: #999999;
							margin-left: 20upx;
							text-decoration: line-through;
						}
					}

					.intpd_subsify {
						font-size: 22rpx;
						color: rgb(156, 110, 77);
						background-color: rgb(255, 241, 214);
						height: 32rpx;
						padding: 0 20rpx;
						border-radius: 32rpx;
						line-height: 32rpx;
					}
				}

				.intp_tit {
					font-size: 34rpx;
					color: #000000;
					font-weight: bolder;
					margin: 30rpx 0 20rpx 0;
					width: 686rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.intp_gdetail {
					font-size: 25rpx;
					color: #000000;
					width: 686rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		.detail-tit {
			position: relative;
			width: 750rpx;
			height: 106rpx;
			background: #f9f7f3;

			view:last-child {
				text-align: center;
				position: absolute;
				margin: 0 auto;
				height: 106upx;
				line-height: 106upx;
				width: 130rpx;
				background: #FFF;
				font-size: 26upx;
				left: 50%;
				top: 0;
				transform: translate(-50%);
				color: #808080;
				background: #f9f7f3;
			}

			view:first-child {
				width: 280upx;
				height: 2upx;
				position: absolute;
				top: calc(50% - 1upx);
				background: #c2c2c2;
				left: calc(50% - 140upx);
			}

		}

		.share-btn {
			width: 750upx;
			height: 80upx;
			color: #FFF;
			font-size: 29upx;
			line-height: 80upx;
			letter-spacing: 16upx;
			background: #d0b276;
			position: fixed;
			bottom: 0;
			text-align: center;
		}
	}
	.share-pop {
	  position: fixed;
	  background: rgba(0, 0, 0, 0.7);
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  z-index: 1000;
	}
	.share-pop .share-body {
	  position: absolute;
	  left: 50%;
	  transform: translate(-50%);
	  top: calc(5vh);
	  top: calc(5vh + env(safe-area-inset-bottom));
	}
	.share-pop .share-body .close {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  position: absolute;
	  right: 20rpx;
	  top: 20rpx;
	}
	.share-pop .share-body .close image {
	  width: 50rpx;
	  height: 50rpx;
	}
	.share-pop .share-body image {
	  width: 80vw;
	  height: 77vh;
	  border-radius: 20rpx;
	}
	.share-pop .share-body button {
	  position: relative;
	  width: 80vw;
	  height: 5vh !important;
	  font-size: 25rpx;
	  color: #FFF;
	  line-height: 5vh;
	  border-radius: 5rpx;
	  background: linear-gradient(to right, #39dfbf, #13a6bf);
	  text-align: center;
	  margin-top: 3vh;
	  /*margin-top: 40rpx;*/
	}
	.share-pop .share-body .share-btn {
	  margin-top: 2vh;
	}
</style>
