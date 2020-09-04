<template>
	<view>
		<view class="container">
			<canvas canvas-id='canvasid' :class="[canvas , debug ? 'debug' : 'pro']" :style="{width:pxWidth+'px', height:pxHeight+'px'}"></canvas>

		</view>
	</view>
</template>

<script>
	import Helper from '../../minix/helper.js'
	import {
		main,
		handle,
		helper
	} from './poster.js'
	export default {
		data() {
			return {
				pxWidth: '',
				pxHeight: '',
				drawArr: []
			}
		},
		props: {
			config: {
				type: Object,
				value: {},
			},
		},
		onReady() {
			console.log(this.config, 123)
		},
		watch: {
			config() {
				if (!this.config.flag) return
				this.onCreate()
			}
		},
		methods: Object.assign({
			onCreate(){
				this.downloadResource({images:this.config.value.images}).then(()=>{
					this.create(this.config.value)
				})
			},
			/**
			 * 计算画布的高度
			 * @param {*} config
			 */
			getHeight(config) {
				const getTextHeight = (text) => {
					let fontHeight = text.lineHeight || text.fontSize;
					let height = 0;
					if (text.baseLine === 'top') {
						height = fontHeight;
					} else if (text.baseLine === 'middle') {
						height = fontHeight / 2;
					} else {
						height = 0;
					}
					return height;
				}
				const heightArr = [];
				(config.blocks || []).forEach((item) => {
					heightArr.push(item.y + item.height);
				});
				(config.texts || []).forEach((item) => {
					let height;
					if (Object.prototype.toString.call(item.text) === '[object Array]') {
						item.text.forEach((i) => {
							height = getTextHeight({ ...i,
								baseLine: item.baseLine
							});
							heightArr.push(item.y + height);
						});
					} else {
						height = getTextHeight(item);
						heightArr.push(item.y + height);
					}
				});
				(config.images || []).forEach((item) => {
					heightArr.push(item.y + item.height);
				});
				(config.lines || []).forEach((item) => {
					heightArr.push(item.startY);
					heightArr.push(item.endY);
				});
				const sortRes = heightArr.sort((a, b) => b - a);
				let canvasHeight = 0;
				if (sortRes.length > 0) {
					canvasHeight = sortRes[0];
				}
				if (config.height < canvasHeight || !config.height) {
					return canvasHeight;
				} else {
					return config.height;
				}
			},
			create(config) {
				this.ctx = wx.createCanvasContext('canvasid', this);
				this.pixelRatio = config.pixelRatio || 1;
				const height = this.getHeight(config);
				this.initCanvas(config.width, height, config.debug)
					.then(() => {
						// 设置画布底色
						if (config.backgroundColor) {
							this.ctx.save();
							this.ctx.setFillStyle(config.backgroundColor);
							this.ctx.fillRect(0, 0, Helper.toPx(config.width), Helper.toPx(height));
							this.ctx.restore();
						}
						const {
							texts = [], images = [], blocks = [], lines = []
						} = config;
						// const queue = this.drawArr
						// const queue = [...this.drawArr,
						// ...texts.map((item) => {
						// 	item.type = 'text';
						// 	item.zIndex = item.zIndex || 0;
						// 	return item;
						// }), ...blocks.map((item) => {
						// 	item.type = 'block';
						// 	item.zIndex = item.zIndex || 0;
						// 	return item;
						// }), ...lines.map((item) => {
						// 	item.type = 'line';
						// 	item.zIndex = item.zIndex || 0;
						// 	return item;
						// })]
						// console.log(this.drawArr,queue,'drawarrqueue')
						const queue = this.drawArr
							.concat(texts.map((item) => {
								item.type = 'text';
								item.zIndex = item.zIndex || 0;
								return item;
							}))
							.concat(blocks.map((item) => {
								item.type = 'block';
								item.zIndex = item.zIndex || 0;
								return item;
							}))
							.concat(lines.map((item) => {
								item.type = 'line';
								item.zIndex = item.zIndex || 0;
								return item;
							}));
						console.log(this.drawArr, queue, 9999999999)
						// 按照顺序排序
						queue.sort((a, b) => a.zIndex - b.zIndex);

						queue.forEach((item) => {
							if (item.type === 'image') {
								this.drawImage(item)
							} else if (item.type === 'text') {
								this.drawText(item)
							} else if (item.type === 'block') {
								this.drawBlock(item)
							} else if (item.type === 'line') {
								this.drawLine(item)
							}
						});

						const res = wx.getSystemInfoSync();
						const platform = res.platform;
						let time = 0;
						if (platform === 'android') {
							// 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
							time = 300;
						}
						this.ctx.draw(false, () => {
							setTimeout(() => {
								wx.canvasToTempFilePath({
									canvasId: 'canvasid',
									success: (res) => {
										this.$emit('success', res.tempFilePath)
									},
									fail: (err) => {
										this.$emit('fail', err)
									},
								}, this);
							}, time);
						});
					})
					.catch((err) => {
						wx.showToast({
							icon: 'none',
							title: err.errMsg || '生成失败'
						});
						console.error(err);
					});
			}
		}, main, handle, helper)
	}
</script>

<style lang="less">
	.canvas {
		width: 750rpx;
		height: 750rpx;
	}

	.canvas.pro {
		position: absolute;
		bottom: 0;
		left: 0;
		transform: translate3d(-9999rpx, 0, 0);
	}

	.canvas.debug {
		position: absolute;
		bottom: 0;
		left: 0;
		border: 1rpx solid #ccc;
	}
</style>
