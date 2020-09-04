import {
	mapState
} from 'vuex';
import common from '@/common/common';
export default {
	data() {
		return {
			tip: {
				type: 'scuccess',
				isLottery: false,
				isInvite: false,
				msg: ''
			},
			copyType: '',
			currItem: {},
			popcontent: '',
		}
	},
	computed: {
		...mapState(['userToken'])
	},
	methods: {
		tipSuccess(res) {
			console.log(res)
			this.tip.msg = res.msg
			this.tip.type = 'success'
			if (res.lottery !== undefined) {
				this.tip.isLottery = true
			} else {
				this.tip.isLottery = false
			}
			if (res.invite !== undefined) {
				this.tip.isInvite = true
			} else {
				this.tip.isInvite = false
			}
			this.tip_show = true
		},
		tipError(res) {
			this.tip.msg = res.msg
			this.tip.type = 'error'
			this.tip_show = true
		},

		// 检测是否登录
		checkLogin(type, currItem) {
			let that = this;
			this.copyType = type;
			this.currItem = currItem
			if (that.userToken == '') {
				that.$refs.loginPopup.$refs.loginPopup.open()
				return false;
			}
			return true
		},

		goCopy() {
			let that = this
			if (that.copyType == 'text'){
				that.addCopyNums(that.currItem.id, that.copyType)
			}
			if (that.copyType == 'goodsText') {
				common.copyless(that.popcontent);
				that.$refs.popup.close();
				that.$refs.loginPopup.$refs.loginPopup.close()
			}
			if (that.copyType == 'image' || that.copyType == 'goodsImage') {
				that.$refs.loginPopup.$refs.loginPopup.close()
				that.saveImages(false);
			}
			if (that.copyType == 'video') {
				uni.navigateTo({
					url: '/pages/checksee/index?src=' + that.currItem.video + '&title=' + that.currItem.title
				});
			}
		},
		
		addCopyNums(id, type){
			this.$api
				.setClickNum({
					id: id,
					type: type
				})
				.then(res => {
					if (res.code == 1) {
						common.copyless(this.popcontent);
					}
					this.$refs.popup.close();
					this.$refs.loginPopup.$refs.loginPopup.close()
				})
				.catch(err => {
					console.log(err, 'setClickNum');
					uni.hideLoading();
				});
		},

		copy(type, currItem) {
			this.copyType = type;
			this.currItem = currItem
			if (type === 'text') {
				this.$refs.popup.open();
				this.popcontent = this.getText(currItem.content);
			} else if (type === 'image') {
				let flag = this.checkLogin(type, currItem);
				if (!flag) {
					return false
				}
				this.saveImages(true, type)
			}
		},
		
		// 复制内容
		copytext(type, vid) {
			console.log(vid, 111)
			let flag = this.checkLogin(type, this.currItem);
			let that = this
			if (flag) {
				let id = type === 'text' || type === 'image' ? this.currItem.id : this.currItem.code;
				if( type === 'video' || type === 'goodsVideo'){
					id = vid;
				}
				this.$api
					.upIntegralApi({
						id: id,
						type: type
					})
					.then(res => {
						if (res.code == 1) {
							if(type === 'text' || type === 'goodsText'){
								common.copyless(this.popcontent);
								this.cancel();
							}
							that.tipSuccess(res)
						} else {
							that.tipError(res)
						}
						that.$refs.tipScorePopup.$refs.popupMsg.open()
						that.tip_show = true
					})
					.catch(err => {
						console.log(err, 'setClickNum');
						uni.hideLoading();
					});
			}
		},

		// 视频
		toVideo(type, currItem) {
			this.currItem = currItem
			let copyType = type
			let isSigned = this.checkLogin(type, currItem)
			if (isSigned) {
				let id = ''
				if(type === 'video'){
					id = currItem.id
				}else{
					id = currItem.code
				}
				console.log(type, id)
				uni.navigateTo({
					url: '/pages/checksee/index?src=' + currItem.video + '&title=' + currItem.title + '&type=' + type + '&id='+ id
				});
			}
		},

		// 一键保存所有图片
		saveImages(isLogined = false, type) {

			let that = this
			uni.showLoading({
				title: '保存中,请稍后'
			});
			// 清除缓存文件 微信缓存只有10M
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
			let src = this.currItem.image
			let success = true
			src.forEach((val, key) => {
				uni.downloadFile({
					url: val, //仅为示例，并非真实的资源
					success: res => {
						if (res.statusCode === 200) {
							uni.hideLoading();
						}
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(red) {
								common.showToast('保存成功', 'check');
							},
							fail: function(err) {
								uni.hideLoading()
								if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
									that.$refs.premss.open();
								} else {
									common.showToast('图片保存失败');
								}
								success = false
							}
						});
					}
				});
			});
			if (success && isLogined) {
				this.copytext(type)
			}
		},

		getText(text) {
			return text.replace(/<[^>]+>|&[^>]+;/g, '');
		},
		// 预览图片
		previewImage(src,inx) {
			common.imagePreview(src,inx);
		},

		// 关闭弹出窗口
		cancel() {
			this.$refs.popup.close();
		},
		savePremss() {
			let that = this
			uni.openSetting({
				//进入小程序授权设置页面
				success(settingdata) {
					if (settingdata.authSetting['scope.writePhotosAlbum']) {
						that.$refs.premss.close();
					} else {
						uni.showModal({
							title: '温馨提示',
							content: '授权失败，请稍后重新获取',
							showCancel: false
						});
					}
				}
			});
		},
	}
}
