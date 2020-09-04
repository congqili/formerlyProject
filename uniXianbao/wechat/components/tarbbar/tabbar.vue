<template>
	<view class="tabbar">
		<view @click="jump('index')" :class="[checked==0?'checked':'']">
			<image mode="aspectFit" :src="checked==0?'/static/tabs/indexselect.png':'/static/tabs/index.png'"></image>
			<view>精选</view>
		</view>
		<view @click="jump('rob')" :class="[checked==1?'checked':'']">
			<image mode="aspectFit" :src="checked==1?'/static/tabs/kuaiqiangselect.png':'/static/tabs/kuaiqiang.png'"></image>
			<view>快抢</view>
		</view>
		<view @click="jump('reward')" :class="[checked==2?'checked':'']">
			<image mode="aspectFit" :src="checked==2?'/static/tabs/daidanjiangliselect.png':'/static/tabs/daidanjiangli.png'"></image>
			<view>带单奖励</view>
		</view>
		<view @click="jump('commander')" :class="[checked==3?'checked':'']">
			<image mode="aspectFit" :src="checked==3?'/static/tabs/commselect.png':'/static/tabs/comm.png'"></image>
			<view>团长推荐</view>
		</view>
		<view @click="jump('member')" :class="[checked==4?'checked':'']">
			<image mode="aspectFit" :src="checked==4?'/static/tabs/memberselect.png':'/static/tabs/member.png'"></image>
			<view>会员</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:['checked'],
		methods:{
			jump(url){
				console.log(url)
				switch (url){
					case 'commander':
						uni.switchTab({
							url:`/pages/index/${url}`
						})
						break;
					case 'reward':
						uni.switchTab({
							url:`/pages/order/${url}`
						})
						break;
					default:
						uni.switchTab({
							url:`/pages/${url}/${url}`
						})
						break;
				}
			}
		}
	}
</script>

<style lang="less">
.tabbar{
	width: 100%;
	position: fixed;
	bottom: 0;
	height: 125rpx;
	background: #FFF;
	border-top: 1rpx solid #e2e2e0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&>view{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width: 40rpx;
			height: 40rpx;
		}
		view{
			margin-top: 14rpx;
			color: #999999;
			font-size: 20rpx;
		}
		
	}
	.checked{
		view{
			color: #d0b276;
		}
	}
}
</style>
