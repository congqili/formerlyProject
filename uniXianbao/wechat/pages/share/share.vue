<template>
	<view class="share">
		<image mode="widthFix" class="bg" src="../../static/bg2.png"></image>
		<view class="message">
			<image :src="userInfo.wechat.headimgurl"></image>
			<view class="text">
				<view>{{userInfo.wechat.nickname}}</view>
				<view>我在参与好友助力，快来助我一臂之力吧</view>
			</view>
			<view class="code">
				<image :src="qrcode" @click="previewImage"></image>
			</view>
		</view>
		<view class="bottom-btn">
			<button open-type="share">一键分享</button>
		</view>
	</view>
</template>

<script>
import {mapState} from 'vuex'
	export default {
		data() {
			return {
				qrcode:'',
				userInfo:{}
			}
		},
		onLoad(options){
			this.id = options.id
			this.qrcode = wx.getStorageSync('qrcode');
			this.userInfo = wx.getStorageSync('userInfo')
		},
		methods: {
			previewImage: function (e){
				let that = this
				wx.previewImage({
				  urls: [that.qrcode] ,
				  success: () => {
				  	console.log('success')
				  },
				  fail:(res)=>{
					  console.log(res)
				  }
				})
			  }
		},
		computed:{
			...mapState(['inviteId'])
		},
		onShareAppMessage(){
			return {
				title:"易线报",
				imageUrl: 'https://cdn.iyizhanke.com/fb/05416c715039fd0874139c808d633e.jpg',
				path:"/pages/toboost/toboost?id="+this.id+"&invitation="+this.userInfo.id
			}
		}
	}
</script>

<style lang="less" scoped>
.share{
	.bg{
		width: 100%;
		position: absolute;
		z-index: -1;
		top: 0;
	}
	.message{
		margin-top: 930rpx;
		display: flex;
		align-items: center;
		&>image{
			float: left;
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			margin: 0 19rpx 0 50rpx;
		}
		&>view{
			float: left;
		}
		.text{
			width: 242rpx;
			color: #82352f;
			margin-right: 80rpx;
			view:first-child{
				font-size: 42rpx;
			}
			view:last-child{
				font-size: 26rpx;
			}
		}
		.code{
			width: 180rpx;
			height: 180rpx;
			border: 2rpx solid rgba(255,255,255,.3);
			border-radius: 5rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 164rpx;
				height: 164rpx;
			}
		}
	}
	.bottom-btn{
		background: #FFF;
		margin-top: 128rpx;
		overflow: hidden;
		button{
			width: 406rpx;
			height: 77rpx;
			background: #ea6a5a;
			color: #fee400;
			text-align: center;
			line-height: 77rpx;
			font-weight: bold;
			border-radius: 10rpx;
			margin: 50rpx auto;
		}
	}
}
</style>
