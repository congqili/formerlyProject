class Check{
	checkType(type,params){
		console.log(type,params);
		switch (type){
			case "page":
				console.log(111);
				uni.navigateTo({
					url:'/pages/link/link'
				})
				break;
			case "url":
				break;
			case "goods":
				break;
			case "goods_category":
				break;
			case "article":
				break;
			case "article_category":
				break;
			default:
				break;
		}
	}
}

module.exports =  new Check();