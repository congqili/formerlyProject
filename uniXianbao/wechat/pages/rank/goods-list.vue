<template>
	<view class="goods-list" v-if="isLoad">
		<view class="coupon-page clearfix" v-if="goodsData.length > 0" v-for="(item, index) in goodsData" :key="index">
			<view class="image" @tap="navToDetailPage(item.code)"><image :src="item.image[0]"></image></view>
			<view class="content">
				<view class="title" @tap="navToDetailPage(item.code)">
					<uni-tag type="primary" class="list-tag" text="苏宁" size="small"></uni-tag>
					{{ item.detail.commodityInfo.commodityName }}
				</view>
				<view class="num">
					<text class="tmprice" v-if="item.detail.couponInfo.couponUrl === ''">优惠价 ¥{{ item.detail.commodityInfo.commodityPrice }}</text>
					<text class="tmprice" v-else>券后价 ¥ {{ item.detail.price.coupon }}</text>
					<text class="volume">月销量{{ getSales(item.detail.commodityInfo.monthSales) }}件</text>
				</view>
				<view class="coupon">
					<text class="quan" v-if="item.detail.couponInfo.couponUrl !== ''">券 ¥{{ item.detail.couponInfo.couponValue }}</text>
					<text v-else></text>
					<text class="v2 upgrade-tip">佣金比例: {{ item.detail.price.rate }}%</text>
				</view>
				<view class="money clearfix">
<!--					<button v-if="shopconfig.showVideo != 0 && item.video !== ''" @tap="toVideo(item)" class="mini-btn" type="warn" size="mini">保存视频</button>-->
<!--					<button @tap="saveImages(item.code, item.image)" class="mini-btn" type="warn" size="mini">保存图片</button>-->
<!--					<button @tap="copy(item.code, item.content)" class="mini-btn" type="warn" size="mini">复制文字</button>-->
					<button v-if="shopconfig.showVideo != 0 && item.video !== ''" @tap="toVideo('goodsVideo',item)" class="mini-btn" type="warn" size="mini">保存视频</button>
					<button @tap="copy('image',item)" class="mini-btn" type="warn" size="mini">保存图片</button>
					<button @tap="copy('text',item)" class="mini-btn" type="warn" size="mini">复制文字</button>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>

		<uni-popup ref="popup" type="center" :custom="true" class="uni-custom">
			<view class="uni-tip">
				<text class="uni-tip-title">提醒</text>
				<text class="uni-tip-content">{{popcontent}}</parser></text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel">取消</text>
					<text class="uni-tip-button" @click="copytext('goodsText')">复制</text>
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
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import parser from '@/components/Parser/index';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import TipScore from '../user/tip_score.vue'
import MixinBtns from '@/minix/btn.js'
import common from '@/common/common';
import CheckLoginPage from '../login/check-login.vue'
export default {
	components: { uniTag, uniLoadMore, uniPopup, parser, uniPopupMessage, TipScore, CheckLoginPage },

	data() {
		return {
		};
	},

	onLoad() {
		// #ifdef H5
		this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
		// #endif
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},
	props: {
		goodsData: {
			type: Array,
			default: () => {
				return [];
			}
		},
		shopconfig: {
			type: Object,
			default: () => {
				return {};
			}
		},
		isSort: {
			type: Boolean,
			default: false
		},
		sort: {
			type: String,
			default: 'default'
		},
		isLoad: {
			type: Boolean,
			default: true
		},
		loadStatus: {
			type: String,
			default: 'loading'
		},
		showSort: {
			type: Boolean,
			default: true
		}
	},
	mixins: [MixinBtns],
	methods: {
		//详情
		navToDetailPage(code) {
			uni.navigateTo({
				url: `/pages/rank/detail?code=` + code
			});
		},
		
		getSales(num){
			return common.getSales(num)
		}
	},
};
</script>

<style lang="scss">
.goods-list {
	margin-top: 110upx;
	.coupon-page {
		background: #fff;
		padding: 10px;
		.image {
			float: left;
			width: 40%;
			image {
				width: 260rpx;
				height: 260rpx;
				border-radius: 3px;
			}
		}
		.content {
			float: right;
			width: 60%;
			.coupon {
				display: flex;
				align-items: center;
				margin: 18upx 0;
				justify-content: space-between;
				.quan {
					border-radius: 6upx;
					border: 4upx solid $uni-color-primary;
					color: rgb(153, 153, 153);
					font-size: $font-base - 2upx;
					padding: 0upx 20upx;
				}
			}
			.title {
				color: #333;
				font-weight: 400;
				font-size: 30upx;
				text-overflow: ellipsis;
				height: 84upx;
				margin-bottom: 10upx;
				overflow: hidden;
				/* #ifdef H5 */
				.uni-tag {
					margin-right: 10upx;
					padding: 0 6upx;
					line-height: 40upx;
					&.list-tag {
						color: #fff;
						background: $uni-color-primary;
						border-color: $uni-color-primary;
					}
				}
				.uni-tag {
					color: #fff;
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
				/* #endif */
				/* #ifndef H5 */
				uni-tag {
					.uni-tag {
						color: #fff;
						background: $uni-color-primary !important;
						border-color: $uni-color-primary !important;
					}
				}
				/* #endif */
			}
			.num {
				color: rgb(153, 153, 153);
				line-height: 20px;
				font-size: 28upx;
				.tmprice {
					padding-right: 10px;
					margin-right: 10px;
					position: relative;
					z-index: 1;
					zoom: 1;
					display: inline-block;
				}
				.volume {
					float: right;
				}
			}

			.money {
				font-size: 20px;
				margin-top: 5px;

				.coupon-price {
					color: #333;
					font-weight: bold;
					font-size: 26upx;
					text {
						padding-left: 5px;
					}
				}
				.mini-btn {
					background: $uni-color-primary;
					padding: 0 10upx;
					margin-right: 18upx;
					border-color: $uni-color-primary;
					float: right;
				}
			}
			.upgrade-tip {
				&.v1,
				&.v2 {
					font-size: 24upx;
					color: #666;
					font-weight: bold;
					padding: 1px 15px;
					border-radius: 6upx;
				}
				&.v2 {
					color: $uni-color-primary;
				}
			}
		}
	}
}
.navbar {
	position: fixed;
	left: 0;
	top: var(--window-top);
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
	z-index: 10;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30upx;
		border-bottom: 1px solid #ebebeb;
		color: $font-color-dark;
		position: relative;
		&.current {
			color: $uni-color-primary;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 120upx;
				height: 0;
				border-bottom: 4upx solid $uni-color-primary;
			}
		}
	}
	.p-box {
		display: flex;
		flex-direction: column;
		.iconfont {
			color: rgb(204, 204, 204);
			line-height: 0;
			&.active {
				color: $uni-color-primary;
			}
		}
	}
	.cate-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 80upx;
		position: relative;
		font-size: 44upx;
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			border-left: 1px solid #ddd;
			width: 0;
			height: 36upx;
		}
	}
}
</style>
