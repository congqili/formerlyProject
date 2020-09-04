<template>
	<view class="copyright">
		<view>{{sysconfig.company}}</view>
		<view v-if="sysconfig.desc !== ''">{{sysconfig.desc}}</view>
		<image mode="aspectFit" :src="sysconfig.img"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		sysconfig: {
			type: Object,
			default: () => {
				return {};
			}
		}
	}
};
</script>

<style lang="scss">
.copyright {
	text-align: center;
	font-size: 26upx;
	margin-top: 30upx;
	line-height: 1.5;
	color: #666;
	image {
		margin-top: 10upx;
		width: 200upx;
		height: 200upx;
	}
}
</style>
