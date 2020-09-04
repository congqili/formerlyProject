<template>
	<view>
		<view class="input-item">
			<view>下单时间</view>
			<input  />
			<view>清空</view>
		</view>
		<view class="order-list">
			<view class="order-item">
				<view class="order-head">
					<view class="order-num-info">
						<view class="order-num">
							<view>订单号：1243718371237</view>
							<view>带单奖励:￥1.00</view>
						</view>
						<view class="order-time">
							<view>下单时间：2020-05-25<text>09:25:24</text></view>
							<view v-show="orderState">膨胀红包</view>
						</view>
					</view>
				</view>
				<view class="order-info">
					<image src="../../static/goodsimg.png" mode=""></image>
					<view class="info-text">
						<view class="info-tit">
							<view>苏宁</view>
							<view>麦兆阿Q果冻布丁4斤整箱约90多个口味混搭休闲零食<text>×4</text></view>
						</view>
						<view class="info-status">
							<view>订单状态：支付成功</view>
							<view v-show="!orderState">预估佣金：￥10.8</view>
						</view>
						<view class="info-price">
							<view>实付金额：￥108.8</view>
							<view class="paymoney" v-if="!orderState"><image src="../../static/zhuanfa.png" mode=""></image>膨胀红包赚￥2.1</view>
							<view class="orderState" v-else>预估佣金：￥10.8</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['orderState']
	}
</script>

<style lang="less">
	.input-item{
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;
		view:first-child{
			color: #6a5225;
			font-size: 28upx;
		}
		view:last-child{
			color: #FFF;
			width: 68upx;
			height: 36upx;
			border-radius: 6upx;
			font-size: 22upx;
			text-align: center;
			line-height: 36upx;
			background: #d6b16d;
		}
		input{
			height: 48upx;
			width: 385upx;
			box-sizing: border-box;
			border: 2upx solid #d6b16d;
			border-radius: 5upx;
			background: #FFF;
			margin: 0 20upx 0 15upx;
		}
	}
.order-list{
	.order-item{
		background: #FFF;
		padding: 20upx 18upx;
		margin: 28upx 20upx 0;
		.order-head{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.order-num-info{
				width: 100%;
				&>view{
					display: flex;
					align-items: center;
					justify-content: space-between;
					view:first-child{
						font-size: 22upx;
						color: #66532c;
					}
					view:last-child{
						font-size: 24upx;
						color: #d0b276;
					}
				}
				.order-time{
					margin-bottom: 30upx;
					view:first-child{
						text{
							margin-left: 15upx;
						}
					}
				}
				.order-num{
					margin-bottom: 20upx;
				}
			}
		}
		.order-info{
			display: flex;
			&>image{
				width: 165upx;
				height: 165upx;
			}
			.info-text{
				width: 482upx;
				margin-left: 20upx;
				.info-tit{
					display: flex;
					width: 476upx;
					position: relative;
					justify-content: space-between;
					 view:first-child{
						 width: 64upx;
						 font-size: 17upx;
						 color: #FFF;
						 background: #f1d5a3;
						 line-height: 24upx;
						 height: 24upx;
						 border-radius: 4upx;
						 text-align: center;
					 }
					 view:last-child{
						 width: 402upx;
						 color: #666666;
						 font-size: 24upx; 
						 line-height: 32upx;
						 text{
							 position: absolute;
							 right: 0;
							 // top: 21upx;
						 }
					 }
				}
				.info-status{
					display: flex;
					justify-content: space-between;
					margin: 22upx 0 12upx;
					view:first-child{
						color: #66532c;
						font-size: 24upx;
					}
					view:last-child{
						font-size: 24upx;
						color: #353038;
					}
				}
				.info-price{
					display: flex;
					justify-content: space-between;
					view:first-child{
						color: #66532c;
						font-size: 24upx;
					}
					.paymoney{
						display: flex;
						color: #FFF;
						padding: 0 10upx;
						height: 34upx;
						border-radius: 17upx;
						font-size: 19upx;
						text-align: center;
						line-height: 34upx;
						justify-content: center;
						align-items: center;
						background: #d6b16d;
						image{
							width: 17upx;
							height: 17upx;
							margin-right: 6upx;
						}
					}
					.orderState{
						font-size: 24upx;
						color: #353038;
					}
				}
			}
		}
	}
}
</style>
