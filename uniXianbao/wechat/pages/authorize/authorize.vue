<template>
	<view class="authorize">
		<view class="input-group">
			<view class="input-item">
				<view>手机号码</view>
				<input placeholder="请输入手机号码" type="text" value="" />
			</view>
			<view class="input-item">
				<view>推广位ID</view>
				<input type="text" placeholder="请输入ID" value="" />
			</view>
		</view>
		<view class="btn-group">
			<view @click="open(0)">绑定说明</view>
			<view @click="open(1)">确认提交</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popup" v-if="!submit">
				<view class="pop-tit">绑定说明</view>
			</view>
			<view class="success" v-else>
				<image src="/static/success.png"></image>
				<view>绑定成功</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

	export default {
		components:{uniPopup,uniPopupDialog,uniPopupMessage},
		data() {
			return {
				submit:false
			}
		},
		methods: {
			open(type){
				this.submit = type?true:false
				this.$refs.popup.open()
		    }
		}
	}
</script>

<style lang="less">
.authorize{
	padding-top: 20upx;
	.input-group{
		margin: 0 24upx;
		background: #FFF;
		border-radius: 15upx;
		padding: 0 36upx;
		.input-item{
			display: flex;
			border-bottom: 1upx solid #d9d9d9;
			view{
				height: 88upx;
				font-size: 28upx;
				color: #414141;
				line-height: 88upx;
			}
			input{
				height: 88upx;
				margin-left: 32upx;
				font-size: 24upx;
			}
			input::-webkit-input-placeholder {
			  color: #989898;
			  font-size: 24upx;
			}
		}
		.input-item:last-child{
			border: 0;
		}
	}
	.btn-group{
		display: flex;
		justify-content: space-between;
		margin: 30upx 24upx;
		view{
			color: #FFF;
			width: 342upx;
			height: 65upx;
			background: #bea577;
			line-height: 65upx;
			text-align: center;
			border-radius: 8upx;
		}
	}
}
.popup{
	overflow: hidden;
	width: 650upx;
	font-size: 30upx;
	color: #333333;
	background: #FFF;
	min-height: 480upx;
	border-radius: 20upx;
	.pop-tit{
		text-align: center;
		margin: 45upx 0;
	}
}
.success{
	display: flex;
	justify-content: space-between;
	padding: 0 220upx;
	box-sizing: border-box;
	align-items: center;
	height: 100upx;
	font-size: 36upx;
	background: #FFF;
	border-radius: 20upx;
	color: #333333;
	width: 650upx;
	image{
		width: 45upx;
		height: 42upx;
	}
}
</style>
