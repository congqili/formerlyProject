<style lang="scss">
@import './common/common.scss';
</style>
<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		uni.hideTabBar();
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
page{
	background: #f9f7f3;
	line-height: 1;
}
.tab-container{
	padding-bottom: 140upx;
}
</style>
