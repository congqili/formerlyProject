<template>
	<view v-if="TabList.length > 0">
		<ms-tabs :list="TabList" class="fixed-tabs" v-model="current"></ms-tabs>
		<goods-list :shopconfig="shopconfig" :goodsData="goodsList" :loadStatus="status"></goods-list>
		<to-about></to-about>
	</view>
</template>

<script>
	import ToAbout from '../user/about.vue'
import MsTabs from '@/components/ms-tabs/ms-tabs.vue';
import GoodsList from './goods-list.vue';
import { mapState } from 'vuex';
import BtnMinix from '../../minix/btn.js'
export default {
	components: { MsTabs, GoodsList, ToAbout },
	data() {
		return {
			current: 0,
			TabList: [],
			status: 'loading',
			goodsList: [],
			shopconfig: {},
			page: {
				page: 1,
				hasData: true,
				total: 1
			}
		};
	},
	watch: {
		current(index) {
			this.goodsList = [];
			this.page.page = 1
			this.get(this.TabList[index].id);
			this.current = index;
		}
	},
	onLoad() {
		uni.showLoading({
			title: '加载中...'
		});
		this.get(0);
	},
	onShow() {
		if (this.userToken == '') {
			uni.hideShareMenu();
		} else {
			uni.showShareMenu();
		}
	},
	computed: {
		...mapState(['userToken'])
	},
	//下拉加载
	onReachBottom() {
		if (this.page.hasData) {
			++this.page.page;
			this.get(this.TabList[this.current].id);
		}
	},
	//上拉更新
	onPullDownRefresh() {
		this.goodsList = [];
		this.page.page = 1;
		this.get(this.TabList[this.current].id);
	},
	methods: {
		// 获取所有的分类
		get(id) {
			this.status = 'loading';
			this.$api
				.getRankGoods({ cate: id, page: this.page.page })
				.then(res => {
					console.log(res)
					if (res.code == 1) {
						for(let i in res.data.goods){
							this.goodsList.push(res.data.goods[i])
						}
						this.shopconfig = res.data.config
						this.TabList = res.data.category;
						if(res.data.goods.length <= 0){
							this.page.hasData = false
							this.status = 'no more';
						}
						if(res.data.goods.length <= 3 && this.page.page == 1){
							++this.page.page
							this.get(id)
						}
					}
					uni.hideLoading();
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					console.log(err, 'getRankList');
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		}
	},
	onShareAppMessage() {
		return {
			title: '易线报-苏宁首个实拍验货平台',
			imageUrl: 'https://cdn.iyizhanke.com/fb/05416c715039fd0874139c808d633e.jpg',
			path: '/pages/index/index?invitation='+this.userInfo.id
		};
	}
};
</script>

<style lang="scss"></style>
