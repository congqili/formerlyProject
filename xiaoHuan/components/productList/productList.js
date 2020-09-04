// components/productList/productList.js
import Navigate from '../../utils/Navigate'
import Helper from '../../utils/Helper';

Component({
  properties: {
    list:{
      type:Object
    }
  },
  data: {
  },
  attached(){
    this.userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({CommonUserLevel: this.userInfo.user_level || 0})
    // console.log(this.data.list)
  },
  pageLifetimes: {
    show: function() {
      this.userInfo = wx.getStorageSync('userInfo') || {};
      this.setData({CommonUserLevel: this.userInfo.user_level || 0})
    }
  },
  methods: {
    toComment(e) {
        let {code} = e.currentTarget.dataset
        if(!code){return Helper.showError('数据加载中，请稍后重试')}
        Navigate.productDetail(code).to()
    },
    toMemberVip(){
      Navigate.memberVip().to()
    }
  }
})
