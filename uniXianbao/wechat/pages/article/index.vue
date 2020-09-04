<template>
	<view>
		<uni-list><uni-list-item @click="to(article.id)" :title="article.title" v-for="(article, index) in articles" :key="index"></uni-list-item></uni-list>
		<uni-load-more v-if="isLoadBottom" :status="loading"></uni-load-more>
		<copyright :sysconfig="sysconfig.copyright"></copyright>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import copyright from '../user/copyright.vue';
import { mapState } from 'vuex';
export default {
	components: { uniList, uniListItem, uniLoadMore, copyright },
	data() {
		return {
			sysconfig: {},
			current: 0,
			articles: [],
			showTime: false,
			cate_id: 0,
			isLoadBottom: true,
			loading: 'loading',
			cate_name: '文章列表',
			page: {
				page: 1,
				pageTotal: 1
			}
		};
	},
	//下拉加载
	onReachBottom() {
		if (this.page.page >= this.page.pageTotal) {
			this.loading = 'no more';
			this.isLoadBottom = true;
		} else {
			this.page.page++;
			this.$_getArticleListApiData();
		}
	},
	//上拉更新
	onPullDownRefresh() {
		this.articles = [];
		this.page.page = 1;
		this.$_getArticleListApiData();
	},
	onLoad(options) {
		this.$_getArticleListApiData();
	},
	computed: {
		...mapState(['userToken'])
	},
	onShow() {
		if (this.userToken == '') {
			uni.hideShareMenu();
		} else {
			uni.showShareMenu();
		}
	},
	methods: {
		// 获取文章
		$_getArticleListApiData() {
			let data = {
				cateId: 6,
				page: this.page.page,
				pagesize: 20
			};
			wx.showLoading({
				title: '加载中...'
			});
			this.loading = 'loading';
			this.isLoadBottom = true;
			this.$api
				.getArticleCategory(data)
				.then(res => {
					if (res.code == 1) {
						this.sysconfig = res.data.config
						this.page.page = res.data.article.page.current;
						this.page.pageTotal = res.data.article.page.pages;
						this.articles = res.data.article.list;
						this.isLoadBottom = false;
						this.loading = 'no more';
					}
					uni.hideLoading();
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					this.err = err;
				});
		},
		// 跳转到详情页面
		to(id) {
			uni.navigateTo({
				url: '/pages/article/detail?id=' + id
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
<style lang="scss">
page {
	background: $page-color-base;
}
.task-list {
	padding: 0;
	.task-item {
		background: #fff;
		padding: 20upx 30px;
		margin-bottom: 6upx;
		.title {
			display: block;
			font-size: $font-base + 4upx;
			font-weight: bold;
		}
		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.desc {
				width: calc(100% - 200upx);
				display: block;
				padding: 18upx 0;
				font-size: $font-base;
				line-height: 1.6;
			}
			uni-button,
			button {
				float: right;
				margin: 0;
			}
		}
	}
}
</style>
