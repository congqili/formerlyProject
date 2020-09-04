<template>
	<view class="list">
		<view class="list-item">
			<view>{{month}}预估总收益</view>
			<view>￥0.00</view>
		</view>
		<view class="list-item">
			<view>{{month}}预估返利收益</view>
			<view>￥0.00</view>
		</view>
		<view class="list-item">
			<view>{{month}}商品推广收益</view>
			<view>￥0.00</view>
		</view>
		<view class="list-item">
			<view>{{month}}平台奖励收益</view>
			<view>￥0.00</view>
		</view>
		<view class="list-item">
			<view>{{month}}合伙人收益</view>
			<view>￥0.00</view>
		</view>
		<view class="list-item">
			<view>{{month}}推广收益</view>
			<view>￥0.00</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['month'],
		data(){
			return{
			}
		},
		created(){
			console.log(this)
		}
	}
</script>

<style lang="less">
.list{
	margin: 0 24upx;
	background: #FFF;
	border-radius: 30upx;
	padding: 0 42upx;
	.list-item{
		display: flex;
		justify-content: space-between;
		border-bottom: 1upx solid #dbdbdb;
		view{
			font-size: 24upx;
			line-height: 76upx;
		}
		view:first-child{
			width: 220upx;
			color: #353038;
		}
		view:last-child{
			width: 110upx;
			color: #bda475;
		}
	}
	.list-item:last-child{
		border: 0;
	}
}
</style>
