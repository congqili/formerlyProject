<template>
	<uni-popup ref="popupMsg" type="top" class="popup-tip" :maskShow="false">
		<view class="popup-container">
			<view class="text">
				<text>{{ tipObj.msg }}</text>
				<button v-if="tipObj.isLottery" @click="goLottery" class="go-lottery" type="primary" size="mini">去抽奖</button>
				<button v-if="tipObj.isInvite" open-type="share" class="go-lottery" type="primary" size="mini">去邀请</button>
			</view>
			<uni-icons type="closeempty" @click="close" size="25"></uni-icons>
		</view>
	</uni-popup>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapState } from 'vuex';
export default {
	components: { uniPopup, uniIcons },
	data() {
		return {
			tipObj: this.tips
		};
	},
	methods: {
		close() {
			this.$refs.popupMsg.close();
		},
		goLottery(){
			this.$api.getLotteryUrlApi().then(res => {
				if (res.code == 1) {
					uni.navigateTo({
						url: '/pages/user/lottery?lotteryurl='+encodeURIComponent(res.path)
					});
				}
			});
		},
	},
	computed: {
		...mapState(['userInfo'])
	},
	props:{
		tip_show: {
			type:Boolean,
			default: ()=>{
				return false
			}
		},
		tips: {
			type:Object,
			default: ()=>{
				return {}
			}
		}
	},
	watch:{
		tip_show(v){
			console.log(v)
			if(v){
				this.$refs.popupMsg.open();
			}
		},
		tips(v){
			console.log(v)
			this.tipObj = v
		}
	},
	onShareAppMessage() {
		let share = {
			title: '易线报-苏宁首个实拍验货平台',
			imageUrl: 'https://cdn.iyizhanke.com/fb/05416c715039fd0874139c808d633e.jpg',
			path: '/pages/index/index?invitation='+this.userInfo.id
		};
		return share;
	}
};
</script>

<style lang="scss">
.popup-tip {
	.popup-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #e1f3d8;
		color: #67c23a;
		padding: 20upx 30upx;
		border-color: #eee;
		border-style: solid;
		border-width: 2upx;
		.text {
			align-items: center;
			width: 80vw;
			display: flex;
			font-size: 32upx;
		}
		.go-lottery {
			margin-left: 20upx;
			width: 225upx;
		}
	}
}
</style>
