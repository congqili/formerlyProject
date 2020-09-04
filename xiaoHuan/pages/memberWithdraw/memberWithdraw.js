import {userGet, getWithdrawInfo, toWithDraw, updataWechat} from "../../api/user";
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import {showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";
import Share from "../../utils/Share";

Page({
    data: {
        withdrawMoney: '',
        withdrawInfo: {},
        canWithdraw: false,
        showWithdraw: false
    },
    onLoad() {
        if (!socketOnload(this)) return

        this.getWithdrawInfo()
    },
    getWithdrawInfo() {
        userGet().then(userRes => {
            if (!userRes.status) return Navigate.login().redirect()
            this.setData({withdrawMoney: userRes.info.user_money})
            getWithdrawInfo().then(res => {
                console.log(res)
                res.info.rule = res.info.rule.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
                res.info.money = userRes.info.user_money
                this.setData({withdrawInfo: res.info, rule: res.info.rule}, () => {
                    this.checkWithdraw()
                    delete this.data.withdrawInfo.rule
                    console.log(this.data.withdrawInfo)
                })
            })
            this.share = Share.instance().get()
        })
    },
    onShareAppMessage() {
        if (this.share) return this.share.to()
    },
    //判断是否可以提交
    checkWithdraw() {
        this.data.canWithdraw = true
        for (let i in this.data.withdrawInfo) {
            if (this.data.withdrawInfo[i] == '') {
                this.data.canWithdraw = false
            }
        }
        this.setData({canWithdraw: this.data.canWithdraw})
    },
    //输入方法
    onInput(e) {
        let {type} = e.currentTarget.dataset
        this.data.withdrawInfo[type] = e.detail.value
        this.setData({withdrawInfo: this.data.withdrawInfo}, () => {
            // console.log(this.data.withdrawInfo)
            this.checkWithdraw()
        })
    },
    onClose() {
        this.setData({showWithdraw: false})
    },
    onConfirm() {
        console.log(this.data.withdrawInfo)
        toWithDraw(this.data.withdrawInfo).then(res => {
            console.log(res)
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            Dialog.alert({
                title: '提交成功',
                message: '提现金额将会在1~3个工作日到账\n注意查收',
                confirmButtonText: '知道了',
            }).then(() => {
                Navigate.withdrawHistory('history').to()
            })
        })
    },
    withdraw() {
        this.setData({showWithdraw: true})
    },
    bindWechat() {
        console.log(this.data.withdrawInfo.wechat)
        updataWechat({wechat: this.data.withdrawInfo.wechat}).then(res => {
            console.log(res)
            if (res.status) {
                Helper.showSuccess(res.msg)
                this.getWithdrawInfo()
            } else {
                Helper.showError(res.msg)
            }
        })
    },
    showDialog() {
        let that = this
        Dialog.confirm({
            title: '注意',
            message: '每个用户一个月只能绑定一次微信号是否确认绑定？',
        }).then(() => {
            console.log(111)
            if (that.data.withdrawInfo.wechat == '') {
                return Helper.showError('请先输入微信号')
            }
            console.log(this.data.withdrawInfo.wechat)
            that.bindWechat()
        }).catch(() => {

        })
    },
    Notify(data) {
        showNotify(data)
    },
})