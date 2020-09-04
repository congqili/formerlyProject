<template>
	<view :class="barShow ? 'bar content-container' : 'content-container'">
		<view class="friends-article" v-for="(article, index) in articleList" :key="index" @click="toDetail(article.goods_code)">
			<view class="list-header">
				<image class="avatar" src="/static/avatar.png"></image>
				<view>
					<text class="nickname">易线报小助手</text>
					<view>已分享25555次</view>
					<text class="time">{{ article.time }}</text>
				</view>
				<view @tap.stop='openReward'><text>?</text>带单奖励{{ article.award || 0 }}元</view>
			</view>
			<view class="content">
				<parser :html="getContent(article, false)"></parser>
				<view>
					<view class="image-panel">
						<image v-if="article.goods_image != ''" :key="inx" v-for="(imgs, inx) in article.goods_images" class="bottom-image"
						 @click.stop="previewImage(article.goods_images,inx)" mode="aspectFit" :src="imgs"></image>
					</view>
					<view class="tips">
						<view class="coupon">
							<view>
								<!-- <text class="text">佣金比例：{{ article.goods.price.rate }}%</text> -->
							</view>
							<view class="award" v-if="article.award > 0">
								<text>带单奖励{{ article.award || 0 }}元</text>
							</view>
						</view>
						<view class="btns" :class="[{ video: article.video != '' }]">
							<button class="mini-btn save-btn" size="mini" @tap.stop="copy('image',article)">
								保存素材
							</button>
							<button class="copy mini-btn" plain="true" size="mini" @tap.stop="copy('text',article)">
								<image src="../../static/zhuanfa.png"></image>
								赚￥2.1
							</button>
							<button v-if="shopconfig.showVideo != 0 && article.video != ''" class="copy mini-btn" plain="true" size="mini"
							 @tap="toVideo('video', article)">保存视频</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="reward" type="center" :custom="true" class="uni-custom">
			<view class="uni-tip">
				<text class="uni-tip-title">带单奖励</text>
				<text class="reward-content">带单奖励是平台给予推手的额外奖励，所有带有带单奖励标签的商品，商品出单后会自动结算对应的带单奖励</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @tap='close'>取消</text>
					<text class="uni-tip-button" style="color: #000;" @tap='close'>确定</text>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="popup" type="center" :custom="true" class="uni-custom">
			<view class="uni-tip">
				<text class="uni-tip-title">提醒</text>
				<text class="uni-tip-content">{{ popcontent }}</text>
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

		<uni-load-more class="loading-more-top" iconType="auto" :status="loading" />

		<tip-score :tips="tip" ref="tipScorePopup"></tip-score>
		<check-login-page ref="loginPopup" @goCopy="goCopy" :copyType="copyType" :loginMsg="shopconfig.not_login"></check-login-page>
	</view>
</template>

<script>
	import common from '@/common/common.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import parser from '@/components/Parser/index';
	import TipScore from '../user/tip_score.vue'
	import MixinBtns from '@/minix/btn.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import CheckLoginPage from '../login/check-login.vue'
	export default {
		components: {
			parser,
			uniPopup,
			uniLoadMore,
			TipScore,
			CheckLoginPage
		},
		data() {
			return {};
		},
		props: {
			articleList: {
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
			barShow: {
				type: Boolean,
				default: () => {
					return true;
				}
			},
			loading: {
				type: String,
				default: () => {
					return 'loading';
				}
			},
			title: {
				type: String,
				default: () => {
					return '易起推';
				}
			}
		},
		mixins: [MixinBtns],
		onLoad() {},
		methods: {

			// 生成内容
			getContent($article, filterHtml = true) {
				let content = $article.content;
				if (filterHtml) {
					return this.getText(content);
				} else {
					return content;
				}
			},
			openReward() {
				this.$refs.reward.open()
			},
			close() {
				this.$refs.reward.close()
			},
			toDetail(code) {
				uni.navigateTo({
					url: '/pages/goods/detail?code=' + code
				})
			}
		}
	};
</script>

<style lang="scss">
	.content-container {
		// margin-top: 95upx;
	}

	.friends-article {
		background: #ffffff;
		margin: 0 20upx 20upx;
		padding: 40upx 40upx;
		border-radius: 20upx;

		.list-header {
			display: flex;
			font-size: $font-base;
			color: #999;
			margin-bottom: 20upx;
			align-items: center;

			.avatar {
				width: 68upx;
				margin-right: 22upx;
				height: 68upx;
				border-radius: 50%;
			}

			.nickname {
				color: #333;
				font-size: $font-base + 2upx;
				font-size: 24upx;
				color: #66532c;
				padding-bottom: 8upx;
				display: block;
			}

			&>view {
				view {
					font-size: 20upx;
					color: #969595;
				}
			}

			&>view:last-child {
				margin: 0 0 0 180upx;

				text {
					width: 23upx;
					height: 23upx;
					border-radius: 50%;
					text-align: center;
					line-height: 23upx;
					font-size: 20upx;
					color: #FFF;
					margin-right: 15upx;
					background: linear-gradient(to top, #c2a26f, #e1d1ad);
				}

				color: #b89d6e;
				font-size: 25upx;
				display: flex;
				align-items: center;
			}
		}

		.content {
			font-size: $font-base;
			color: #666666;
			font-size: 26upx;

			&.between {
				.left {
					width: 70%;
					float: left;
				}

				uni-button {
					float: right;
				}
			}
		}

		.image-panel {
			max-height: 270upx;
			margin: 20upx 0upx 20upx 0;
			white-space: nowrap;
			overflow: auto;
			overflow-y: hidden;

			image {
				border: 1px solid #e7e7e7;
			}
		}

		.bottom-image {
			width: 152upx;
			height: 152upx;
			margin: 0 20upx 0 0;
		}

		.gen-poster {
			color: $uni-color-primary;
			display: block;
			margin-top: 20upx;
		}

		.tips {
			justify-content: space-between;
			display: flex;
			align-items: center;
			margin-top: 16upx;

			.text {
				background: #fff1d6;
				font-size: 26upx;
				color: #bb8621;
				padding: 6upx 20upx;
				border-radius: 30upx;
			}

			.btns {
				text-align: right;

				&.video {
					min-width: 440upx;
				}
			}

			uni-button,
			button {
				padding: 0 10upx;
				margin-left: 14upx;
				line-height: 1.8;
			}

			.award {
				font-size: 24upx;
				text-align: center;
				padding-top: 15upx;
				color: $uni-color-primary;
			}
		}

	}

	.mini-btn {
		border-color: #d6b16d !important;
		border: 0;

		&.copy {
			width: 156upx;
			height: 50upx;
			border-radius: 25upx;
			background: #d6b16d;
			color: #FFF;
			line-height: 50upx !important;

			image {
				width: 26upx;
				height: 26upx;
				float: left;
				margin: 11upx 8upx 0;
			}
		}
	}

	.save-btn {
		width: 156upx;
		height: 50upx;
		border-radius: 25upx;
		line-height: 50upx !important;
		color: #d6b16d;
		border: 1upx solid #d6b16d;
		background: rgba(0, 0, 0, 0);
		box-sizing: border-box;
	}

	.reward-content {
		font-size: 21upx;
		line-height: 38upx;
		padding: 20upx;
		box-sizing: border-box;
		border: 0;
	}

	button::after {

		border: none;

	}
</style>
