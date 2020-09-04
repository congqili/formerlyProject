<template>
	<view class="reward">
		<order-list></order-list>
		<tab-bar checked='2'></tab-bar>
	</view>
</template>

<script>
import orderList from './orderList.vue'
import tabBar from '@/components/tarbbar/tabbar.vue'
	export default {
		components:{orderList,tabBar}
	}
</script>

<style>
</style>
