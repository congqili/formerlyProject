<template>
	<uni-notice-bar :scrollable="true" speed="10px" class="tip-collect" showClose="true" :single="true" @close="close" :text="shopconfig.tip_collect"></uni-notice-bar>
</template>

<script>
import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
export default {
	components: { uniNoticeBar },
	data() {
		return {};
	},
	props: {
		shopconfig: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	methods: {
		close(){
			this.$emit('closeBar')
		}
	}
};
</script>
