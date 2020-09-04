<template>
	<view class="container" v-if="isLoad">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in goods.image" :key="index">
					<view class="image-wrapper"><image :src="item" class="loaded" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<view class="title">
				<uni-tag class="list-tag" text="苏宁" type="primary" size="small"></uni-tag>
				{{ goods.detail.commodityInfo.commodityName }}
			</view>
			<view class="bot-row">
				<text class="tmprice" v-if="goods.detail.couponInfo.couponUrl === ''">优惠价 ¥{{ goods.detail.commodityInfo.commodityPrice }}</text>
				<text class="tmprice" v-else>券后价 ¥ {{ goods.detail.price.coupon }}</text>
				<text>月销量：{{ getSale(goods.detail.commodityInfo.monthSales) }}</text>
				<text @tap="toBuy(goods.link)">
					查看详情 >
					<text class="yticon icon-you"></text>
				</text>
			</view>
			<template v-if="goods.detail.couponInfo.couponUrl !== ''">
				<view class="coupon">
					<text class="quan">优惠券 ¥{{ goods.detail.couponInfo.couponValue }}</text>
				</view>
			</template>
			<view class="coupon" v-else><text class="quan none"></text></view>
			<text class="tip-text">佣金比例：{{ goods.detail.price.rate }}%</text>
		</view>
		<view class="c-list">
			<view class=" clearfix">
				<view class="col"><uni-tag @click="copyContent(goods, true)" text="复制文字" type="warning" :circle="true"></uni-tag></view>
				<view class="col"><uni-tag text="分享图片" type="error" :circle="true" @tap="previewImage(goods.image)"></uni-tag></view>
				<view class="col" v-if="shopconfig.showVideo != 0 && goods.video != ''">
					<uni-tag text="保存视频" type="primary" :circle="true" @tap="toVideo(goods.video, goods.commodityInfo.commodityName)"></uni-tag>
				</view>
			</view>
			<view class=" clearfix"><parser :html="goods.content"></parser></view>
		</view>

		<view class="c-list">
			<view class="c-row clearfix">
				<text class="tit">商品编号</text>
				<view class="bz-list con">
					<text>{{ goods.detail.commodityInfo.commodityCode }}</text>
				</view>
			</view>
			<view class="c-row clearfix">
				<text class="tit">推荐理由</text>
				<view class="bz-list con">
					<text>{{ goods.detail.commodityInfo.sellingPoint }}</text>
				</view>
			</view>
		</view>

		<view class=" c-desc">
			<text class="tit">
				<text class="iconfont">&#xe616;</text>
				苏宁商品
			</text>
			<text class="tit">
				<text class="iconfont">&#xe616;</text>
				品质保证
			</text>
			<text class="tit">
				<text class="iconfont">&#xe616;</text>
				无忧售后
			</text>
		</view>
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import common from '@/common/common.js';
import { mapState } from 'vuex';
import config from '@/common/config';
import parser from '@/components/Parser/index';
export default {
	components: {
		parser,
		uniTag
	},
	computed: {
		...mapState(['userToken'])
	},
	data() {
		return {
			goods: {},
			shopconfig: {},
			isLoad: false
		};
	},
	onLoad(e) {
		this.$_getGoodsDetailApiData(e.code);
	},
onShow() {
		if (this.userToken == '') {
			uni.hideShareMenu();
		} else {
			uni.showShareMenu();
		}
	},
	methods: {
		getText(text) {
			return text.replace(/<[^>]+>|&[^>]+;/g, '');
		},
		copyContent(goods, hasLink = false) {
			let cont = this.getText(goods.content);
			if (hasLink) {
				cont = cont + goods.link.wapExtendUrl;
			}
			common.copyless(cont);
		},

		// 获取商品详情
		$_getGoodsDetailApiData(code) {
			uni.showLoading({
				title: '数据加载中'
			});
			let that = this;
			let params = { code: code };
			that.$api
				.getRankDetail(params)
				.then(res => {
					if (res.code == 1) {
						this.isLoad = true;
						this.goods = res.data.goods;
						this.shopconfig = res.data.config
					}
					uni.hideLoading();
				})
				.catch(err => {
					that.err = err;
				});
		},

		toBuy(link) {
			let appid = link.appId,
				path = link.spPageUrl;
			console.log(appid);
			uni.navigateToMiniProgram({
				appId: appid,
				path: path,
				success(res) {
					console.log(res);
				}
			});
		},

		// 查看视频
		toVideo(videoSrc, title) {
			uni.navigateTo({
				url: '/pages/strategy/video?src=' + videoSrc + '&title' + title
			});
		},

		// 预览图片
		previewImage(src) {
			common.imagePreview(src);
		},
		getSale(num){
			console.log(num)
			return common.getSales(num*1)
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
	padding-bottom: 120upx;
	padding-bottom: 0 !important;
}
.icon-you {
	font-size: $font-base + 2upx;
	color: #888;
}
.carousel {
	height: 722upx;
	position: relative;
	swiper {
		height: 100%;
	}
	.image-wrapper {
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		height: 750upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 标题简介 */
.introduce-section {
	background: #fff;
	position: relative;
	padding: 20upx 30upx;

	.title {
		font-size: 32upx;
		color: $font-color-dark;
		height: 100upx;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.5;
		.uni-tag {
			margin-right: 6upx;
			padding: 0 3px;
		}
	}
	.price-box {
		display: flex;
		align-items: baseline;
		height: 64upx;
		padding: 10upx 0;
		font-size: 26upx;
		color: $uni-color-primary;
	}
	.price {
		font-size: $font-lg + 2upx;
	}
	.m-price {
		margin: 0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
	}
	.bot-row {
		display: flex;
		text-align: center;
		align-items: center;
		height: 60upx;
		font-size: $font-sm;
		color: $font-color-light;
		text {
			flex: 1;
		}
	}
}

.c-list {
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	background: #fff;
	padding: 20upx 30upx;
	border-top: 10upx solid $border-color-base;
	&:after {
		border: 0;
	}
	.clearfix {
		padding: 20upx 0;
		display: flex;
		align-items: center;
		&:first-child {
			padding-top: 0;
			padding-bottom: 10upx;
		}
		.col {
			width: 50%;
			text-align: center;
		}
	}
	.tit {
		width: 20%;
		float: left;
	}
	.bz-list {
		width: 80%;
		float: left;
	}
}
.c-desc {
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	background: #fff;
	padding: 20upx 30upx;
	border-top: 1px solid #e4e7ed;
	text-align: center;
	.tit {
		width: 33.333%;
		display: inline-block;
		.iconfont {
			margin-right: 10upx;
			font-size: $font-base + 8upx;
		}
	}
}
.goods-nav {
	position: fixed;
	bottom: 0;
	width: 100%;
}
.uni-share {
	uni-button,
	button {
		border-radius: 0;
		&:after {
			border-radius: 0;
		}
	}
}

.coupon {
	.fan,
	.quan {
		border-radius: 6upx;
		border: 4upx solid $uni-color-primary;
		color: rgb(153, 153, 153);
		font-size: $font-base + 4upx;
		padding: 0upx 20upx 0upx 4upx;
		&.none {
			border: 0;
		}
	}
	.del {
		text-decoration: line-through;
		font-size: $font-base + 4upx;
		margin-left: 50upx;
		color: rgb(153, 153, 153);
	}
}
.coupon-price {
	margin: 10upx 0;
	display: block;
	font-size: $font-base + 2upx;
	color: $uni-color-primary;
	.price {
		font-size: $font-base + 16upx;
		font-weight: bold;
	}
}

.tip-text {
	background: #fff1d6;
	font-size: 26upx;
	color: #bb8621;
	position: absolute;
	right: 40upx;
	bottom: 15upx;
	padding: 6upx 30upx;
	border-radius: 30upx;
}
</style>
