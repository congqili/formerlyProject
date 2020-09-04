<template>
	<uni-popup ref="loginPopup" type="center" :custom="true" class="uni-custom">
		<view class="uni-tip">
			<text class="uni-tip-title">提醒</text>
			<text class="uni-tip-content">{{ loginMsg }}</text>
			<view class="uni-tip-group-button">
				<text class="uni-tip-button" @click="goLogin">去登录</text>
				<text class="uni-tip-button" @click="goCopy">{{ getBtnText }}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script>
export default {

	data() {
		return {};
	},
	props: {
		loginMsg: {
			type: String,
			default: () => {
				return '';
			}
		},
		copyType: {
			type: String,
			default: () => {
				return '';
			}
		}
	},
	computed:{
		getBtnText(){
			if(this.copyType === 'text' || this.copyType === 'goodsText'){
				return '直接复制'
			}else if(this.copyType === 'video'){
				return '保存视频'	
			}else{
				return '直接保存'
			}
		}
	},
	methods: {
		goLogin() {
			uni.reLaunch({
				url: '/pages/login/index'
			});
		},
		goCopy() {
			this.$emit('goCopy');
		}
	}
};
</script>

<style></style>
