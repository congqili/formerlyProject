<template>
	<view class="main-page" v-if="TabList.length > 0">
		<view class='fixed-tabs'>
			<!-- <tip-collect @closeBar="closeBar" :shopconfig="shopconfig"></tip-collect> -->
			<ms-tabs :list="TabList" v-model="current" v-if="TabList.length > 1"></ms-tabs>
		</view>
		
		<article-list :shopconfig="shopconfig" :title="TabList[current].title" :loading="status" :articleList="articleList"></article-list>
		<!-- <to-about></to-about> -->
		<uni-popup ref="popup" type="center" :custom="true" class="uni-custom">
			<view class="uni-tip">
				<text class="uni-tip-title">提醒</text>
				<text class="uni-tip-content" >{{ popcontent }}</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel">取消</text>
					<text class="uni-tip-button" @click="copytext('text')">复制</text>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="premss" type="center" :custom="true" class="uni-custom">
			<view class="uni-tip">
				<text class="uni-tip-title">提醒</text>
				<text class="uni-tip-content">您好, 请先授权，再保存图片。</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="savePremss">确定</text>
				</view>
			</view>
		</uni-popup>
		
		<tip-score :tips="tip" ref="tipScorePopup"></tip-score>
		<check-login-page ref="loginPopup" @goCopy="goCopy" :copyType="copyType" :loginMsg="shopconfig.not_login"></check-login-page>
		<tab-bar checked='3'></tab-bar>
	</view>
</template>

<script>
import MsTabs from '@/components/ms-tabs/ms-tabs.vue';
import ArticleList from './comlist.vue';
import ToAbout from '../user/about.vue'
import { mapState } from 'vuex';
import TipCollect from '../user/tip_collect.vue';
import BtnMinix from '../../minix/btn.js'
import tabBar from '@/components/tarbbar/tabbar.vue'

export default {
	components: { MsTabs, ArticleList, ToAbout, TipCollect ,tabBar },
	data() {
		return {
			current: 0,
			TabList: [],
			status: 'loading',
			articleList: [],
			shopconfig: {},
			barShow: true,
			page: {
				page: 1,
				total: 1
			},
            requesting: false
		};
	},
	computed: {
		...mapState(['userToken'])
	},
	onShow() {
			console.log(this.articleList)
			if (this.userToken == '') {
				uni.hideShareMenu();
			} else {
				uni.showShareMenu();
			}
		},
	mixins: [BtnMinix],
	watch: {
		current(index) {
			this.page.page = 1
			this.articleList = [];
			this.get(this.TabList[index].id);
			this.current = index;
		}
	},
	onLoad(e) {
		uni.showLoading({
			title: '加载中...'
		});
		let curRoute  = this.$mp.page.route;
		this.get(2);
	},
	//下拉加载
	onReachBottom() {
		if (this.page.page >= this.page.total) {
			this.status = 'no more';
		} else {
			++this.page.page;
			this.get(this.TabList[this.current].id);
		}
	},
	//上拉更新
	onPullDownRefresh() {
		this.articleList = [];
		this.page.page = 1;
		this.get(this.TabList[this.current].id);
	},
    onPageScroll(res) {
        let that = this;
        let query = wx.createSelectorQuery();
        query.select('.main-page').boundingClientRect(function(rect) {
            if(rect && rect.height){
                //console.log(res.scrollTop, rect.height - 500 * 2, that.requesting);
                if(res.scrollTop >= rect.height - 400 * 2 && !that.requesting){
                    that.requesting = true;
                    if (that.page.page >= that.page.total) {
                        that.status = 'no more';
                    } else {
                        ++that.page.page;
                        that.get(that.TabList[that.current].id);
                    }
                }
            }
        }).exec();
    },
	methods: {
		// 获取所有的分类
		get(cateid) {
            let that = this
			this.status = 'loading';
			this.$api
				.getArticleCategory({ type: 3, cateId: cateid, page: this.page.page})
				.then(res => {
					console.log(res)
					if (res.code == 1) {
						this.page.page = res.data.article.page.current;
						this.page.total = res.data.article.page.pages;
						this.TabList = res.data.category;
						for (let i in res.data.article.list) {
							this.articleList.push(res.data.article.list[i]);
						}
						if (this.page.page >= this.page.total) {
							this.status = 'no more';
						}
						this.shopconfig = res.data.config
                        that.$nextTick(()=>{
                            that.requesting = false;
                        })
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					console.log(err, 'getArticleCategory');
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		closeBar(){
			this.barShow = false	
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
<style>
	.content-container{
		 margin-top: 95upx;
	}
</style>