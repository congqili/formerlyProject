const $ = {};
if (uni.getSystemInfoSync().platform == "android") {
	$.apiUrl = 'https://yxb.iyizhanke.com/';
} else {
	$.apiUrl = 'https://yxb.iyizhanke.com/';
}
$.apiUrl = 'https://y-test.iyizhanke.com/'
$.newUrl = 'https://y.iyizhanke.com';
export default $;