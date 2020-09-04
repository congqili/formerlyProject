// components/tabbar/tabbar.js
import Navigate from "../../utils/Navigate";

Component({
    properties   : {
        check: {
            type: 'string'
        }
    },
    data         : {
        isLogin: false,
        icon   : 0
    },
    pageLifetimes: {
        show: function() {
            let userInfo = wx.getStorageSync("userInfo");
            if (userInfo && userInfo.id) {
                this.data.isLogin = true
                if (userInfo.user_level > 1 || userInfo.user_streamer) {
                    this.setData({icon: 1})
                } else {
                    this.setData({icon: 0})
                }
            } else {
                this.setData({icon: 0})
            }
        }
    },
    methods      : {
        jump() {
            if (!this.data.isLogin) return Navigate.login().to()
            if (this.data.icon) {
                Navigate.liveDetail().to()
            } else {
                Navigate.memberVip().to()
            }
        }
    }
})
