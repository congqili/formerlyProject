import {upMobile, wxLogin} from '../../api/user'
import {socketOnload} from "../../utils/socketBtn";
import Helper from "../../utils/Helper";
import Navigate from "../../utils/Navigate";

Page({
    data: {
        //邀请码
        invite: '',
        //展示手机号获取框
        show: false,
        //分享id
        shareId: '',
        //展示邀请码输入框
        showInvite: false,
        params: {},
        url: null
    },
    //输入框数据绑定
    onInput(e) {
        this.setData({invite: e.detail.value},()=>{
            // console.log(this.data.invite)
        })
    },
    //关闭获取手机号弹窗
    closePopup() {
        this.setData({show: false})
    },
    //关闭邀请码输入框
    onInivteClose() {
        this.setData({showInvite: false}, () => {
            // this.login()
        })
    },
    onLoad(option) {
        if(option && option.url) this.data.url = decodeURIComponent(option.url)

        if (!socketOnload(this)) return
        this.setData({shareId: wx.getStorageSync('share_id')})
    },
    // 登录方法
    login() {
        Helper.showLoading('登陆中，请稍后');
        let that = this
        //获取用户唯一code
        wx.login({
            success(res) {
                // console.log(res)
                if (res.code) {
                    //获取用户信息
                    wx.getUserInfo({
                        success(infoRes) {
                            Helper.hideLoading()
                            console.log(infoRes)
                            if (infoRes.errMsg != 'getUserInfo:ok') {
                                console.log(infoRes);
                                Helper.showError('登陆失败！')
                                //获取信息失败
                                return;
                            }
                            var params = {
                                invite: that.data.invite,
                                share_id: that.data.shareId,
                                iv: infoRes.iv,
                                code: res.code,
                                encrypted: infoRes.encryptedData,
                                session: ''
                            }

                            console.log(params)
                            that.data.params = params
                            that.wxLogin(params)
                            //调用登录接口
                        },
                        fail(res) {
                            console.log(res);
                            Helper.showError('登陆失败！')
                        },
                    })
                } else {
                    //  登录失败
                    Helper.showError('授权失败，请重新登录！')
                }

            },
            fail(err){
                console.log(err)
                Helper.hideLoading()
            }
        })
    },
    //登录接口
    wxLogin(params) {
        Helper.showLoading('登陆中，请稍后');
        console.log(params)
        let that = this
        that.data.params.invite = that.data.invite

        wxLogin(params).then((loginRes) => {
            console.log(loginRes)
            //if(!loginRes.status) Helper.showError(loginRes.msg)
            //如果存在invite且为false,弹出邀请码的输入框
            if (typeof loginRes.info.invite == 'boolean' && !loginRes.info.invite) {
                that.setData({showInvite: true})
                Helper.hideLoading();
            } else if (loginRes.status) {
                Helper.hideLoading();
                wx.setStorageSync('userToken', loginRes.info.token)
                wx.setStorageSync('userInfo', loginRes.info.user)
                if(!loginRes.info.user.user_mobile){
                    return that.setData({show:true})
                }
                if(this.data.url){
                    if(this.data.url.indexOf('member/member') >= 0 || this.data.url.indexOf('index/index') >= 0 || this.data.url.indexOf('liveSquare/liveSquare') >= 0 || this.data.url.indexOf('brand/brand') >= 0){
                        wx.switchTab({url: this.data.url})
                        //wx.reLaunch({url: this.data.url})
                    }else{
                        wx.redirectTo({url: this.data.url})
                    }
                }else{
                    return Navigate.back()
                }
            } else {
                return Helper.showError("登陆失败，请刷新后再试！")
            }

        }).catch(err=>{
            console.log(err)
            Helper.hideLoading();
        })
    },
    //获取用户手机号
    getPhoneNumber(data) {
        console.log(data);
        let that = this
        wx.login({
            success(res) {
                if (data.detail.errMsg == 'getPhoneNumber:ok') {
                    let params = {
                        code: res.code,
                        iv: data.detail.iv,
                        encrypted: data.detail.encryptedData
                    };
                    console.log(params)
                    upMobile(params).then(infoRes => {
                        console.log(infoRes)

                        if(infoRes.status){
                            return Navigate.back()
                        }else{
                            return Helper.showError(infoRes.msg)
                        }
                    });
                } else {

                }
            }
        })
    },
})