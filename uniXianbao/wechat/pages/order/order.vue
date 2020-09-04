<template>
	<view class="order">
		<order-list :orderState='orderState'></order-list>
	</view>
</template>

<script>
import orderList from './orderList.vue'
	export default {
		components:{orderList},
		data() {
			return {
				orderState:true
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
.order{
}
</style>
