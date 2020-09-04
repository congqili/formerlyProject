<template>
	<view>
		<ms-tabs :list='list' v-model="current" lineColor='#bea577' v-if="list.length > 1" itemColor='#bea577'></ms-tabs>
		<reward-list :month='month'></reward-list>
	</view>
</template>

<script>
import RewardList from './list.vue'
import MsTabs from '@/components/ms-tabs/ms-tabs.vue'

	export default {
		components:{
			RewardList
		},
		data() {
			return {
				list:[
					{
						title:'本月预估'
					},{
						title:'上月预估'
					}
				],
				current:0,
				month:'本月'
			}
		},
		methods: {
			
		},
		watch:{
			current(newValue){
				if(newValue==0) {
					 this.month='本月'
				}else{
					this.month='上月'
				}
				
			}
		}
	}
</script>

<style lang="less">
.tabBlock {
	margin-bottom: 30upx;
	color: #4d4d4d;
	font-size: 30upx;
	.tab__item-title{
		font-size: 30upx;
	}
}
</style>
