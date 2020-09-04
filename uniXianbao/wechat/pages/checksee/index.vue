<template>
	<view>
		<video id="myVideo" :src="src" @error="videoErrorCallback" controls></video>
		<button class="sys-btn-primary" @click="save">保存</button>
		<text class="process" v-if="process > 0 && process < 100">已下载 {{ process }}%</text>
		<uni-popup ref="popupMsg" type="message" class="popup-tip">
		    <uni-popup-message :type="tip.type" :message="tip.msg" :duration="3000"></uni-popup-message>
		</uni-popup>
		<tip-score :tips="tip" ref="tipScorePopup"></tip-score>
	</view>
</template>
<script>
import common from '@/common/common.js';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import BtnMinix from '@/minix/btn.js'
import TipScore from '../user/tip_score.vue'
export default {
	components:{uniPopupMessage, TipScore},
	data() {
		return {
			src: '',
			showVideo: false,
			process: 0,
			id: '',
			title: '',
			type: 'video'
		};
	},
	onReady: function(res) {
		// #ifndef MP-ALIPAY || MP-TOUTIAO
		this.videoContext = uni.createVideoContext('myVideo');
		// #endif
		// #ifdef APP-PLUS || MP-BAIDU
		setTimeout(() => {
			this.showVideo = true;
		}, 350);
		// #endif
		// #ifndef APP-PLUS || MP-BAIDU
		this.showVideo = true;
		// #endif
	},
	onShow() {
		// #ifdef MP
		uni.hideHomeButton();
		// #endif
	},
	onLoad(e) {
		this.src = e.src;
		uni.setNavigationBarTitle({
			title: e.title
		});
		this.id = e.id
		this.type = e.type
		this.title = e.title;
	},
	mixins: [BtnMinix],
	methods: {
		videoErrorCallback: function(e) {
			uni.showModal({
				content: e.target.errMsg,
				showCancel: false
			});
		},
		save() {
			let that = this;
			uni.showLoading({
				title: '下载中,请稍后'
			});
			that.copytext(that.type, that.id)
			const downloadTask = uni.downloadFile({
				url: that.src, //仅为示例，并非真实的资源
				success: res => {
					if (res.statusCode === 200) {
						console.log(res, 7777);
						uni.hideLoading();
						// 获取文件列表 并清除
						uni.getSavedFileList({
							success(resp) {
								resp.fileList.forEach((val, key) => {
									// 遍历文件列表里的数据
									// 删除存储的垃圾数据
									uni.removeSavedFile({
										filePath: val.filePath
									});
								});
							}
						});
					}
					uni.saveVideoToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function(red) {
						},
						fail: function(red) {
							console.log(red);
						}
					});
				}
			});
			downloadTask.onProgressUpdate(res => {
				that.process = res.progress;
				console.log('下载进度' + res.progress);
				// console.log('已经下载的数据长度' + res.totalBytesWritten);
				// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
			});
		}
	}
};
</script>
<style lang="scss">
#myVideo {
	width: 100%;
	height: 100vh;
}
.sys-btn-primary {
	position: absolute;
	top: 20upx;
	right: 20upx;
	z-index: 99;
}
.process {
	position: fixed;
	bottom: 20upx;
	right: 40upx;
	z-index: 99;
	color: #ffffff;
	font-size: $font-base;
}
</style>
