<template>
	<view class="main-page" v-if="TabList.length > 0">
		<view class='fixed-tabs'>
			<!-- <tip-collect @closeBar="closeBar" :shopconfig="shopconfig"></tip-collect> -->
			<ms-tabs :list="TabList" v-model="current" v-if="TabList.length > 1"></ms-tabs>
		</view>
		<swiper class="banner">
			<swiper-item v-for="(item,index) in bannerList" :key='item'>
				<image :src="(item.layout_image)" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="category">
			<view v-for="(item,index) in categoryList" :key='item' @click="checkType(item.layout_link_type,{data:item.layout_link_data,target:item.layout_link_target})">
				<image :src="item.layout_image"></image>
				<view>{{item.layout_title}}</view>
			</view>
		</view>
		<!-- <button class="scale-btn" @click="scaleCode">扫一扫</button> -->
		<article-list :barShow="barShow" :shopconfig="shopconfig" :title="TabList[current].title" :loading="status" :articleList="articleList"></article-list>
		<!-- <to-about></to-about> -->
		
		<uni-popup ref="popupInvite" type="dialog" v-if="!closeInviteDialog">
			<uni-popup-dialog :beforeClose="true" type="info"  @close="close" :okBtnText='invites.is_prize ? "去抽奖" : "去采集"' :content="invites.txt" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<tab-bar checked='0'></tab-bar>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import ToAbout from '../user/about.vue';
import MsTabs from '@/components/ms-tabs/ms-tabs.vue';
import ArticleList from './list.vue';
import BtnMinix from '../../minix/btn.js';
import { mapMutations, mapState } from 'vuex';
import TipCollect from '../user/tip_collect.vue';
import common from '@/common/common.js';
import $ from "../../common/common";
import tabBar from '@/components/tarbbar/tabbar.vue'
import Check from '../../minix/chekType.js'

export default {
	components: { MsTabs, ArticleList, ToAbout, TipCollect, uniPopup, uniPopupDialog ,tabBar },
	data() {
		return {
			current: 0,
			TabList: [],
			status: 'loading',
			articleList: [],
			shopconfig: {},
			page: {
				page: 1,
				total: 1
			},
            requesting: false,
			from: '',
			barShow: true,
			invites: {},
			bannerList:[],
			categoryList:[]
		};
	},
	computed: {
		...mapState(['userInfo', 'userToken', 'closeInviteDialog'])
	},
	watch: {
		current(index) {
			this.page.page = 1;
			this.articleList = [];
			// this.get(this.TabList[index].id);
			this.current = index;
		}
	},
	onShow(query) {
		if (this.userToken == '') {
			uni.hideShareMenu();
		} else {
			uni.showShareMenu();
		}
	},
	onLoad(e) {
		// uni.showLoading({
		// 	title: '加载中...'
		// });
		let _this=this, curRoute = this.$mp.page.route;
		if (e.invitation) {
			_this.getInvite(e.invitation);
		}

		e.scene && this.switchScene(e.scene)

		// this.get(0);
		this.getIndexLayout()
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
        this.requesting = false;
	},
    onPageScroll(res) {
        let that = this;
        let query = wx.createSelectorQuery();
        query.select('.main-page').boundingClientRect(function(rect) {
            if(rect && rect.height){
                //console.log(res.scrollTop, rect.height - 500 * 2, that.requesting);
                if(res.scrollTop >= rect.height - 550 * 2 && !that.requesting){
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
		...mapMutations(['getInvite', 'setCloseInviteDialog']),
		//TODO:缓存setStorageData
		checkType(type,params){
			// console.log(Check);
			Check.checkType(type,params)
		},

		switchScene(scene){
			scene = decodeURIComponent(scene)
			const query = this.parseScene(scene);
			console.log(query);
			if (query.t) {
				switch (query.t) {
					case 'boo':
						wx.redirectTo({url: "/pages/boost/boost?code=" + query.c})
						break;
					case 'tob':
						wx.redirectTo({url: "/pages/toboost/toboost?id=" + query.i + "&invitation=" + query.c})
						break;
				}
			}
		},
		
		parseScene(query) {
			let params     = [];
			let queryParts = query.split('-');
			queryParts.map(function(item) {
				var a        = item.split('_')
				params[a[0]] = a[1]
			})
			return params
		},
		scaleCode(){
			let that = this
			wx.scanCode({
			  success (res) {
				  console.log(res);
				  const query = res.path.split('?')[1].split("=");
				  if(query.length == 2 && query[0] == "scene") that.switchScene(query[1]);
			  }
			})
		},
		
		closeBar(){
			this.barShow = false	
		},
		
		confirm(done){
			if(this.invites.is_prize){
				this.$api.getLotteryUrlApi().then(res => {
					if (res.code == 1) {
						uni.navigateTo({
							url: '/pages/user/lottery?lotteryurl='+encodeURIComponent(res.path)
						});
					}
				});
			}else{
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
			done()
		},
		
		close(done){
			this.setCloseInviteDialog(true)
			done()
		},
		
		getIndexLayout(){
			this.$api.getIndexLayout().then(res=>{
				console.log(res);
				this.bannerList = res.info.banner
				for(let i = 0;i <  res.info.top_category.length;i++){
					console.log();
					this.TabList.push({title:res.info.top_category[i].layout_title,params:res.info.top_category[i]})
				}
				// this.TabList = res.info.top_category
				this.categoryList = res.info.index_category
				this.getCategoryGoods(res.info.top_category[0].id)
			})
		},
		
		getCategoryGoods(id){
			this.$api.getCategoryGoods({category:id,page_no:0}).then(res=>{
				console.log(res);
				this.articleList = res.info
			})
		}
		
		// // 获取所有的分类
		// get(cateid) {
		// 	let that = this
		// 	this.status = 'loading';
		// 	this.$api
		// 		.getArticleCategory({ category_id: cateid, page_no: this.page.page ,page_size:5})
		// 		.then(res => {
		// 			console.log(res)
		// 			if (res.code == 1) {
		// 				this.page.page = res.data.article.page.current;
		// 				this.page.total = res.data.article.page.pages;
		// 				this.TabList = res.data.category;
		// 				for (let i in res.data.article.list) {
		// 					this.articleList.push(res.data.article.list[i]);
		// 				}						
		// 				if (this.page.page >= this.page.total) {
		// 					this.status = 'no more';
		// 				}
		// 				this.shopconfig = res.data.config;
		// 				if(res.data.invites !== undefined){
		// 					that.$nextTick(()=>{
		// 						that.invites = res.data.invites
		// 						that.$refs.popupInvite.open()
		// 					})
		// 				}
  //                       that.$nextTick(()=>{
  //                           that.requesting = false;
  //                       })
		// 			}
		// 			uni.stopPullDownRefresh();
		// 			uni.hideLoading();
		// 		})
		// 		.catch(err => {
		// 			console.log(err, 'getArticleCategory');
		// 			uni.stopPullDownRefresh();
		// 			uni.hideLoading();
		// 		});
		// }
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
<style lang="less">
.scale-btn{
	position: fixed;
}
.banner{
	width: 750upx;
	height: 294upx;
	margin-top: 90upx;
	image{
		height: 100%;
		width: 100%;
	}
}
.category{
	display: flex;
	height: 170rpx;
	&>view{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width: 50upx;
			height: 43upx;
			margin: 42upx 0 33upx;
		}
		view{
			font-size: 21upx;
			color: #2f2e2e;
		}
	}
}
</style>
