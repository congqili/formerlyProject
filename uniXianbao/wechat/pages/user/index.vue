<template>
	<view v-if="!loading">
		<view class="userinfo">
			<image class="portrait" :src="userInfo.wechat.headimgurl || '/static/missing-face.png'"></image>
			<view class="info-box">
				<view class="username">
					<text>{{nickname | passPhone}}</text>
					<uni-tag
						:disabled="isSigned"
						@click="sign"
						:text="isSigned ? '今日已签到' : '签到去抽奖'"
						class="signin"
						:class="[{ is_signed: isSigned }]"
						:type="!isSigned ? 'primary' : 'default'"
						:inverted="true"
					></uni-tag>
				</view>
				<text class="phone">{{ userInfo.mobile }}</text>
				<text>注册时间：{{ userInfo.create_time }}</text>
			</view>
		</view>
		<view @click="navTo('lottery')" class="lottery-image" v-if="config.lottery_image !== ''"><image class="image" mode="widthFix" :src="config.lottery_image"></image></view>
		<uni-list class="list">
			<uni-list-item class="go-lottery"><button open-type="share" class="invite-btn">邀请赚积分抽大奖</button></uni-list-item>
			<uni-list-item title="帮助中心" @click="navTo('help')"></uni-list-item>
			<uni-list-item title="关于我们" @click="navTo('about')"></uni-list-item>
		</uni-list>

		<tip-score :tips="tip" ref="tipScorePopup"></tip-score>
		<copyright :sysconfig="config.copyright"></copyright>
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import common from '@/common/common.js';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
import copyright from './copyright.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import BtnMinix from '@/minix/btn.js';
import TipScore from './tip_score.vue';
export default {
	components: { uniTag, uniList, uniListItem, copyright, uniPopupMessage, TipScore },
	data() {
		return {
			userInfo: {},
			loading: false,
			isSigned: false,
			config: {},
			invites: {},
			nickname:'游客'
		};
	},
	filters: {
		passPhone(value) {
			return common.passPhone(value);
		}
	},
	mixins: [BtnMinix],
	onLoad() {
		this.getUserInfo();
	},

	methods: {
		// 获取用户信息
		getUserInfo() {
			this.loading = true;
			if(!this.$api.getUserInfoApi()) {return false}
			this.$api.getUserInfoApi().then(res => {
				if (res.code == 1) {
					this.userInfo = res.data;
					this.nickname = this.userInfo.wechat.nickname;
					this.config = res.config;
					this.isSigned = res.isSigned;
				}
				this.loading = false;
			});
		},

		// 邀请用户
		toInvite() {},

		// 跳转页面
		navTo(type) {
			if (type == 'help') {
				uni.navigateTo({
					url: '/pages/article/index'
				});
			} else if (type == 'about') {
				uni.navigateTo({
					url: '/pages/article/detail?id=105'
				});
			} else if (type == 'lottery') {
				this.$api.getLotteryUrlApi().then(res => {
					if (res.code == 1) {
						uni.navigateTo({
							url: '/pages/user/lottery?lotteryurl=' + encodeURIComponent(res.path)
						});
					}
					this.loading = false;
				});
			}
		},

		sign() {
			this.$api.signinApi({ type: 'sign' }).then(res => {
				if (res.code == 1) {
					this.tipSuccess(res);
					this.isSigned = true;
					this.$refs.tipScorePopup.$refs.popupMsg.open()
				} else {
					this.tipError(res);
				}
			});
		}
	},
	onShareAppMessage() {
		let that = this;
		let share = {
			title: '易线报-苏宁首个实拍验货平台',
			imageUrl: 'https://cdn.iyizhanke.com/fb/05416c715039fd0874139c808d633e.jpg',
			path: '/pages/index/index?invitation='+this.userInfo.id,
			success: function(res) {
				// 转发成功之后的回调
				if (res.errMsg == 'shareAppMessage:ok') {
					this.tip.msg = '分享邀请成功，好友成功注册，您将获得' + that.config.invite_score + '积分，积分可抽奖';
				}
			}
		};
		return share;
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.list {
	margin-top: 20upx;
	.go-lottery {
		.uni-list-item--first {
			padding-left: 0 !important;
			padding-top: 0 !important;
			border-bottom: 0 !important;
			padding-bottom: 0 !important;
			margin-bottom: -1px !important;
		}
	}
}
.lottery-image {
	.image {
		width: 100%;
		display: block;
	}
}
.invite-btn {
	width: 100%;
	background: #fff;
	font-size: 28upx;
	text-align: left;
	border-radius: 0;
	color: #3b4144;
	padding: 15upx 30upx 15upx 0;
	&:after {
		border-radius: 0;
		border-left: 0;
		border-right: 0;
	}
}
.userinfo {
	display: flex;
	padding: 20upx;
	align-items: center;
	.portrait {
		width: 160upx;
		height: 160upx;
		border-radius: 160upx;
		margin-right: 20upx;
	}

	text {
		display: block;
		font-size: $font-base;
	}
	.username {
		font-weight: bold;
		text {
			display: inline-block;
			font-size: $font-base + 4upx;
		}
	}
	.phone {
		padding: 6upx 0;
	}
	.signin {
		position: absolute;
		right: 20px;
		box-shadow: 0 1px 3px rgba(245, 154, 35, 0.2), 0 1px 1px rgba(245, 154, 35, 0.14), 0 2px 1px -1px rgba(245, 154, 35, 0.12);
		&.is_signed {
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
		}
	}
}
</style>
