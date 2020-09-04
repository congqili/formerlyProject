<template>
	<view class="commaner container">
		<view>
			<view class="goods-item" v-for="(article,index) in articleList" :key='index'>
				<image @click="previewImage(article.image)" :src="article.image[0]" mode=""></image>
				<view class="goods-info">
					<view class="goods-tit">
						<view>苏宁</view>
						<view class="tit">{{article.title}}</view>
					</view>
					<view class="goods-time">
						<view></view>
						<view>佣金比例：{{article.goods.price.rate}}%</view>
					</view>
					<view class="bottom-btn">
						<view><text>￥</text>{{article.goods.price.price}}</view>
						<view><image src="../../static/youhuiquan-.png" mode=""></image><text>￥</text>5</view>
						<view class="btn">
							<view @tap="copy('image',article)">保存图片</view>
							<view @tap="copy('text',article)"><image src="../../static/zhuanfa.png" ></image>赚￥2.1</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
	components: { parser, uniPopup, uniLoadMore, TipScore, CheckLoginPage },
	data() {
		return {
		};
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
	onLoad() {
		console.log(this.articleList)
	},
	methods: { 

		// 生成内容
		getContent($article, filterHtml = true) {
			let content = $article.content;
			if (filterHtml) {
				return this.getText(content);
			} else {
				return content;
			}
		}
	}
};
</script>

<style lang="scss">
	.commaner{
		margin-top: 90upx;
		&>view{
			display: flex;
			flex-direction: column;
			min-height: 2000upx;
			padding-bottom: 80upx;
		}
		.goods-item{
			background: #FFF;
			display: flex;
			margin: 0 23upx;
			padding: 18upx 22upx;
			margin-top: 26upx;
			&>image{
				width: 165upx;
				height: 165upx;
				border-radius: 4upx;
			}
			.goods-info{
				width: 450upx;
				margin-left: 20upx;
				&>view{
					width: 450upx;
				}
				.goods-tit{
					display: flex;
					justify-content: space-between;
					view:first-child{
						color: #FFF;
						width: 61upx;
						height: 24upx;
						font-size: 18upx;
						text-align: center;
						line-height: 24upx;
						border-radius: 5upx;
						background: #f1d5a3;
					}
					.tit{ 
						width: 383upx;
						font-size: 21upx;
						color: #33270f;
						line-height: 28upx;
						height: 56upx;
						overflow:hidden;
						text-overflow: ellipsis;//显示省略号
						display:-webkit-box;
						-webkit-line-clamp:2;//块元素显示的文本行数
						-webkit-box-orient:vertical;
					}
				}
				.goods-time{
					color: #ea744a;
					display: flex;
					justify-content: space-between;
					margin: 12upx 0 16upx;
					view:first-child{
						font-size: 18upx;
					}
					view:last-child{
						font-size: 24upx;
					}
				}
				.bottom-btn{
					display: flex;
					justify-content: space-between;
					align-items: center;
					view:first-child{
						font-size: 34upx;
						color: #ea744a;
						text{
							font-size: 23upx;
						}
					}
					view:nth-child(2){
						position: relative;
						text-align: center;
						width: 55upx;
						height: 29upx;
						line-height: 29upx;
						font-size: 19upx;
						color: #ea744a;
						image{
							left: 0;
							top: 0;
							width: 55upx;
							height: 29upx;
							position: absolute;
						}
						text{
							font-size: 12upx;
						}
					}
					.btn{
						display: flex;
						width: 228upx;
						justify-content: space-between;
						view:first-child{
							width: 107upx;
							height: 34upx;
							border-radius: 17upx;
							text-align: center;
							line-height: 34upx;
							color: #d0b276;
							font-size: 19upx;
							box-sizing: border-box;
							border: 1upx solid #d0b276;
						}
						view:last-child{
							background: #d0b276;
							color: #FFF;
							width: 107upx;
							height: 34upx;
							border-radius: 17upx;
							display: flex;
							align-items: center;
							padding: 10upx;
							box-sizing: border-box;
							justify-content: space-between;
							image{
								position: static;
								width: 17upx;
								height: 17upx;
							}
						}
					}
				}
			}
		}
	}
</style>
