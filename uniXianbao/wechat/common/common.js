const $ = {};
/**
 *
 *  判断是否在微信浏览器 true是
 */
$.isWeiXinBrowser = function() {
	// #ifdef H5
	// window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
	let ua = window.navigator.userAgent.toLowerCase()
	// 通过正则表达式匹配ua中是否含有MicroMessenger字符串
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true
	} else {
		return false
	}
	// #endif

	return false
}

// 消息提示
$.showToast = function(msg, icon) {
		uni.showToast({
			title: msg,
			icon: icon || 'none'
		})
	},

/**
 * 图片预览
 * @param {Object} src 图片地址数组
 */
$.imagePreview = function(src,inx) {
	uni.previewImage({
		urls: src,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function(data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function(err) {
				console.log(err.errMsg);
			}
		},
		current:inx || 0
	});
}

$.saveImage = function(src){
	let saveImage = function(file) {
		uni.saveImageToPhotosAlbum({
			filePath: file,
			success(res) {
				console.log(res);
				uni.showToast({
					title   : '保存成功',
					icon    : "success",
					duration: 1000
				})
			},
			fail(err) {
				console.log(err)
				if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
					wx.showModal({
						title     : '提示',
						content   : '需要您授权保存相册',
						showCancel: false,
						success   : modalSuccess => {
							wx.openSetting({
								success(settingdata) {
									console.log("settingdata", settingdata)
									if (settingdata.authSetting['scope.writePhotosAlbum']) {
										wx.showModal({
											title     : '提示',
											content   : '获取权限成功,再次点击图片即可保存',
											showCancel: false,
										})
									} else {
										wx.showModal({
											title     : '提示',
											content   : '获取权限失败，将无法保存到相册哦~',
											showCancel: false,
										})
									}
								},
								fail(failData) {
									console.log("failData", failData)
								},
								complete(finishData) {
									console.log("finishData", finishData)
								}
							})
						}
					})
				} else {
					uni.showToast({
						title   : '保存失败请重试',
						icon    : "none",
						duration: 1000
					})
				}
			}
		})
	}
	if(src.indexOf("wxfile://") >= 0){
		saveImage(src)
	}else{
		uni.downloadFile({
			url    : src,
			success: function(res) {
				console.log(src);
				console.log(res.tempFilePath);
				saveImage(res.tempFilePath);
			},
			fail   : (err) => {
				console.log(err)
			}
		})
	}
}
/**
 * 保留两位小数  两位后舍去
 * @param {Object} value
 */
$.numFilter = function(value) {
	let realVal = ''
	if (value) {
		let tempVal = parseFloat(value).toFixed(3)
		realVal = tempVal.substring(0, tempVal.length - 1)
	}
	return realVal
}


// 手机号隐藏中间4位
$.passPhone = function(phone) {
	if(phone !== ''){
		var passPhone = phone.substr(0, 3) + "****" + phone.substr(7);
		return passPhone
	}
	return ''
}

/**
 * 直接复制
 * @param {Object} text
 */
$.copyless = function(text) {
	uni.setClipboardData({
		data: text
	});
};

// 获取销量
$.getSales = function(nums){
	if( nums >= 10000){
		return (nums / 10000).toFixed(1) + '万'
	}
	return nums
}

export default $;
