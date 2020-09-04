<template>
	<view class='trans'>
		<view class='textarea'>
			<view>{{text.length}}/1000</view>
			<textarea maxlength="1000" v-model="text" placeholder-class="place-style" placeholder="请将您要推广的苏宁商品链接(链接加文案),推广链接(链接+文案)完整复制到这里进行转链"></textarea>
		</view>
		<view class="btn">
			<button>一键转链生成我的链接</button>
		</view>
		<view class="text">
			<view>转链说明：</view>
			<view>通过易线报一键转链成功的推广链接，用户下单后可以在苏宁推客APP订单列表查看计入您的苏宁推客佣金中，同时出现在易线报订单列表，产生额外的平台补贴。转链不成功的链接会用红色标识，请删除后再次转链</view>
		</view>
		<tab-bar checked='2'></tab-bar>
	</view>
</template>

<script>
import tabBar from '@/components/tarbbar/tabbar.vue'
	export default {
		components:{ tabBar },
		data() {
			return {
				text:''
			}
		},
		methods: {
			transformLink(){
				this.$api.transformLink({text:this.text}).then(res=>{
					console.log(res);
				})
			}
		}
	}
</script>

<style lang="less">
page{
	background: #f9f7f3;
}
.trans{
	overflow: hidden;
	.textarea{
		margin: 10rpx auto 0;
		position: relative;
		width: 704rpx;
		view{
			color:#e5e5e5;
			font-size:18rpx;
			line-height: 26rpx;
			position: absolute;
			top: 16rpx;
			left: 14rpx;
			z-index: 5;
		}
		.place-style{
			color:#e5e5e5;
			font-size:18rpx;
			line-height: 26rpx;
		}
		textarea{
			width: 100%;
			height: 474rpx;
			font-size:18rpx;
			line-height: 26rpx;
			box-sizing: border-box;
			border: 1.5rpx solid #dcdcdc;
			background: #FFF;
			padding: 45rpx 0 0 14rpx;
		}
	}
	.btn{
		margin: 32rpx 0 46rpx;
		button{
			width: 375rpx;
			height: 50rpx;
			background: #d6b16d;
			color: #FFF;
			border: 0;
			font-size: 18rpx;
			text-align: center;
			line-height: 50rpx;
			margin: 0 auto;
			border: 1rpx solid #dcdcdc;
			border-radius: 5rpx;
		}
		button::after{
			border: 0;
		}
	}
	.text{
		color: #b0b0b0;
		font-size: 18rpx;
		view{
			width: 670rpx;
			margin: 0 auto;
			line-height: 26rpx;
		}
	}
}
</style>
