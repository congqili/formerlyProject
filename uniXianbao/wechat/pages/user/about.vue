<template>
	<view class="float-btn" @tap="toArticle">去<br />抽奖</view>
</template>

<script>
	export default {
	    data() {
	        return {}
	    },
	    methods: {
			toArticle() {
				uni.navigateTo({
					url: '/pages/user/index'
				});
			},
		}
	}
	
</script>

<style>
</style>
