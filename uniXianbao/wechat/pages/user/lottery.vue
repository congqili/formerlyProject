<template>
	<web-view :src="url" />
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad(e) {
			this.url = decodeURIComponent(e.lotteryurl)
			console.log(e)
		}
	}
</script>

<style>
</style>
