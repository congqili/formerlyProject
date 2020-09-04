import {getIntegralDividend, getIntegrals} from "../../api/user";
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Navigate from "../../utils/Navigate";

Page({
    data: {
        page_no  : 0,
        page_size: 10,
        integrals: {},
    },
    onLoad() {
        if (!socketOnload(this)) return
        this.getIntegralDividend()
    },
    getIntegralDividend() {
        if (this.loadingList) return
        this.loadingList = true
        Helper.showLoading();
        getIntegralDividend({
            page_no  : ++this.data.page_no,
            page_size: this.data.page_size,
            get_list : 1
        }).then(res => {
            Helper.hideLoading();
            this.loadingList = false
            if (!res.status) return Helper.showError(res.msg)
            if (!res.info.list.length) return /*Helper.showError(this.data.page_no == 1 ? "没有数据" : "没有更多数据了")*/
            console.log(res);

            this.setData({integrals: res.info.list})
        })
    },
    toIntegralDetail(e){
        Navigate.memberIntegralDetail(e.currentTarget.dataset.date).to()
    },
    onReachBottom() {
        this.getIntegralDividend();
    }
})