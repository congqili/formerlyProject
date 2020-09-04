import {showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        checkBaby: [],//select选取的宝贝
    },
    onLoad() {
        if (!socketOnload(this)) return
    },
    onShow() {
        let checkBaby = wx.getStorageSync("checkBaby")
        if (checkBaby.length > 0) {
            //将所选的商品放到data中
            this.setData({
                checkBaby: checkBaby
            })
        }
    },
    //跳转到选择商品
    jumpselect() {
        Navigate.liveSelectProduct().to()
    },
    //切换选中状态
    toggleCheck(e) {
        let index = e.currentTarget.dataset.index;
        let checkBaby = this.data.checkBaby;
        checkBaby[index].checked = !checkBaby[index].checked;
        this.setData({checkBaby: checkBaby});
    },
    //删除商品
    delectgoods() {
        if (this.data.checkBaby.length > 0) {
            let deletCheckBaby = this.data.checkBaby;
            for (let i = 0; i < deletCheckBaby.length; i++) {
                if (deletCheckBaby[i].checked) {
                    deletCheckBaby.splice(i, 1)
                    i--
                }
            }
            wx.setStorageSync("checkBaby", deletCheckBaby)
            this.setData({
                checkBaby: deletCheckBaby
            })
        } else {
            Helper.showError('还未添加宝贝，亲');
        }
    },
    entergoods() {
        let checkBaby = this.data.checkBaby;
        wx.setStorageSync("checkBaby", checkBaby)
        Navigate.back()
        //Navigate.liveCreate().to()
    },
    Notify(data){
        showNotify(data)
    }
})