<template>
	<view class="rob tab-container">
		<view class="rob-content">
			<swiper class="rob-banner">
				<swiper-item v-for="(item,index) in bannerList" :key='index'>
					<image :src="item.layout_image"></image>
				</swiper-item>
			</swiper>
			<view class="goods-item">
				<image src="../../static/goodsimg.png" mode=""></image>
				<view class="goods-info">
					<view class="goods-tit">
						<view>苏宁</view>
						<view>麦兆阿Q果冻布丁4斤整箱约90个多口味混搭休闲零食</view>
					</view>
					<view class="bar">
						<view></view>
						<view></view>
						<view>已抢61件</view>
						<view>20%</view>
					</view>
					<view class="goods-time">
						<view>距结束还有5天14:35:30</view>
						<view>佣金比例：20%</view>
					</view>
					<view class="bottom-btn">
						<view><text>￥</text>25.8</view>
						<view><image src="../../static/youhuiquan-.png" mode=""></image><text>￥</text>5</view>
						<view class="btn">
							<view>保存图片</view>
							<view><image src="../../static/zhuanfa.png"></image>赚￥2.1</view>
						</view>
					</view>
				</view>
			</view>
			<view class="preferred" :style="">
				<view>磐石优选·验货实拍</view>
				<view>
					<view>
						<image src="../../static/tabs/tuijian.png"></image>
						实拍验货
					</view>
					<view>
						<image src="../../static/tabs/tuijian.png"></image>
						实拍验货
					</view>
					<view>
						<image src="../../static/tabs/tuijian.png"></image>
						实拍验货
					</view>
				</view>
			</view>
		</view>
		<tab-bar checked='1'></tab-bar>
	</view>
</template>

<script>
import tabBar from '@/components/tarbbar/tabbar.vue'
	export default {
		components:{ tabBar },
		data() {
			return {
				bannerList:[]
			}
		},
		onLoad(){
			this.getQuickLayout()
		},
		methods: {
			getQuickLayout(){
				this.$api.getQuickLayout().then(res=>{
					console.log(res);
					this.bannerList = res.info.quick_banner
				})
			}
		}
	}
</script>

<style lang="less">
.rob{
	.rob-content{
		.rob-banner{
			margin: 0 23upx;
			border-radius: 14upx;
			height: 274upx;
			image{
				display: block;
				width: 100%;
				height: 274upx;
			}
		}
		.goods-item{
			background: #FFF;
			display: flex;
			margin: 0 23upx;
			padding: 18upx 10upx;
			margin-top: 26upx;
			&>image{
				width: 223upx;
				height: 210upx;
			}
			.goods-info{
				width: 450upx;
				margin-left: 5upx;
				&>view{
					width: 450upx;
				}
				.goods-tit{
					display: flex;
					justify-content: space-between;
					view:first-child{
						color: #FFF;
						width: 61upx;
						height: 24upx;
						font-size: 18upx;
						text-align: center;
						line-height: 24upx;
						border-radius: 5upx;
						background: #f1d5a3;
					}
					view:last-child{ 
						width: 383upx;
						font-size: 21upx;
						color: #33270f;
						line-height: 28upx;
					}
				}
				.bar{
					width: 242upx;
					position: relative;
					height: 22upx;
					margin-top: 15upx;
					view:first-child{
						width: 242upx;
						height: 22upx;
						border-radius: 11upx;
						background: #f1d5a3;
					}
					view:nth-child(2){
						position: absolute;
						left: 0;
						top: 0;
						background: #eabc67;
						width: 51upx;
						border-radius: 11upx;
						height: 22upx;
					}
					view:nth-child(3){
						position: absolute;
						color: #FFF;
						left: 10upx;
						font-size: 16upx;
						line-height: 22upx;
						top: 0;
					}
					view:last-child{
						position: absolute;
						right: 10upx;
						font-size: 16upx;
						color: #ed6a3c;
						line-height: 22upx;
						top: 0;
					}
				}
				.goods-time{
					color: #ea744a;
					display: flex;
					justify-content: space-between;
					margin: 12upx 0 16upx;
					view:first-child{
						font-size: 18upx;
					}
					view:last-child{
						font-size: 24upx;
					}
				}
				.bottom-btn{
					display: flex;
					justify-content: space-between;
					align-items: center;
					view:first-child{
						font-size: 34upx;
						color: #ea744a;
						text{
							font-size: 23upx;
						}
					}
					view:nth-child(2){
						position: relative;
						text-align: center;
						width: 55upx;
						height: 29upx;
						line-height: 29upx;
						font-size: 19upx;
						color: #ea744a;
						image{
							left: 0;
							top: 0;
							width: 55upx;
							height: 29upx;
							position: absolute;
						}
						text{
							font-size: 12upx;
						}
					}
					.btn{
						display: flex;
						width: 228upx;
						justify-content: space-between;
						view:first-child{
							width: 107upx;
							height: 34upx;
							border-radius: 17upx;
							text-align: center;
							line-height: 34upx;
							color: #d0b276;
							font-size: 19upx;
							box-sizing: border-box;
							border: 1upx solid #d0b276;
						}
						view:last-child{
							background: #d0b276;
							color: #FFF;
							width: 107upx;
							height: 34upx;
							border-radius: 17upx;
							display: flex;
							align-items: center;
							padding: 10upx;
							box-sizing: border-box;
							justify-content: space-between;
							image{
								position: static;
								width: 17upx;
								height: 17upx;
							}
						}
					}
				}
			}
		}
		.preferred{
			background: #FFF;
			border-radius: 12rpx;
			overflow: hidden;
			width: 704rpx;
			margin: 20upx auto;
			&>view:first-child{
				font-size: 23rpx;
				color: #9b9b9b;
				text-align: center;
				letter-spacing: 4rpx;
				margin: 16rpx 0 22rpx;
			}
			&>view:last-child{
				display: flex;
				justify-content: space-between;
				padding: 0 50rpx;
				margin-bottom: 24rpx;
				view{
					display: flex;
					align-items: center;
					font-size: 21rpx;
					color: #d0b276;
					image{
						height: 25rpx;
						width: 22rpx;
						margin-right: 14rpx;
					}
				}
			}
		}
	}
}
</style>
