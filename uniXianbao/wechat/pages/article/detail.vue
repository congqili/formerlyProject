<template>
	<view class="article-detail">
		<parser :html="article.content"></parser>
	</view>
</template>

<script>
	import parser from "@/components/Parser/index"
	export default {
		components:{parser},
		data() {
			return {
				article:'',
				title: ''
			}
		},
		onLoad(e) {
			this.$_getArticleInfoApiData(e.id)
			if(e.title != undefined){
				this.title = e.title
			}
		},
		methods: {
			// 获取文章
			$_getArticleInfoApiData(id){
				wx.showLoading({
				  title: '加载中...',
				})
				this.$api.getArticleDetail({id: id}).then(res => {
					if (res.code == 1){
						this.article = res.data;
						uni.setNavigationBarTitle({
						　　title: this.title == '' ? this.article.title : this.title
						})
					}
					uni.hideLoading()
				}).catch(err => {
					this.err = err;
				})
			},
		},
	}
</script>
<style lang="scss">
	page{
		background: $page-color-base;
	}
	.article-detail{
		padding: 40upx;
		font-size: $font-base+2upx;
	}
</style>
