<template>
	<view class="share-page">
		<view class="content"></view>
		<view class="bottom-btn">
			<view>保存到手机相册</view>
			<view>预览并长按分享</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{}
		},
		methods:{},
		props:['type','imgs',]
	}
</script>

<style lang="less">
.share-page{
	.bottom-btn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 138upx;
		background: #FFF;
		display: flex;
		align-items: center;
		view{
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
}
</style>
