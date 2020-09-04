import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {getLiveCategories, getSelfLive, getLive, createLive, updateLive} from '../../api/live'
import {AppConfig} from '../../config/config'
import {userGet} from "../../api/user";
import {errMsg, showNotify} from "../../utils/btn";
import {socketOnload} from "../../utils/socketBtn";
import Navigate from "../../utils/Navigate";
import Helper from "../../utils/Helper";

Page({
    data: {
        //标题
        title: '',
        //上传的图片
        image: '',
        //内容简介
        desc: '',
        //开播时间
        time: '',
        //地址
        address: '',
        //选择的商品
        goods: [],
        beginLive: '发布预告',
        beginLiveFlag: false,
        setTime: null,
        minTime: null,
        maxTime: null,
        showTime: false,
        setAddress: true,
        //栏目开关
        showa: false,
        //栏目内容
        actions: [],
        //栏目对应的value值
        option1: [],
        //所选栏目id
        category_id: '',
        showText: ''
    },
    onLoad() {
        if (!socketOnload(this)) return
        // this.changeTime()

        if (!this.userInfo || this.userInfo.user_streamer == 0) {
            Navigate.memberVip('push').setFailMsg('您还不是主播').launch()
        } else {
            this.getSelfLive(this.getLiveCategories)
        }
    },
    onShow() {
        this.setData({
            setTime: new Date().getTime(),
            minTime: new Date().getTime(),
            maxTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
        })
        //将存储的值赋给所填的信息
        this.initCreateData()
    },
    //将存储的值赋给所填的信息
    initCreateData() {
        if (!wx.getStorageSync('createLiveInfo')) return
        let createLiveInfo = wx.getStorageSync('createLiveInfo');
        let checkBaby = wx.getStorageSync('checkBaby');
        let goods = [];
        console.log(this.data.option1)
        this.setData({
            //image: createLiveInfo.image,
            title: createLiveInfo.title,
            //time: createLiveInfo.time,
            desc: createLiveInfo.desc,
            category_id: createLiveInfo.category_id,
            address: createLiveInfo.address,
            showText:createLiveInfo.showText

        })
        if (checkBaby.length > 0) {
            checkBaby.map(item => {
                if (item.checked) goods.push(item.goods_goodsCode)
            })
        }
        this.setData({
            goods
        })
    },
    //选择封面的方法
    addCover() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // console.log(res)
                that.setData({image: res.tempFilePaths})
            }
        })
    },
    //文件上传
    uploadFile(callback) {
        let that = this
        console.log(this.data.image)
        if(typeof this.data.image === "string" && this.data.image.indexOf('http') >= 0) return callback()
        wx.uploadFile({
            url: AppConfig.apiUrl + 'upload/image',
            filePath: this.data.image[0],
            name: 'upfile',
            formData: {},
            header: {
                "Authorization": 'Bearer ' + wx.getStorageSync('userToken'),
                'content-type': 'multipart/form-data'
            },
            success(uploadRes) {
                if (!uploadRes.statusCode) {
                    return Helper.showError(uploadRes.errMsg)
                }
                // console.log(uploadRes)
                const data = JSON.parse(uploadRes.data)
                console.log(data)
                that.data.image = data.info.url
                callback(data.info.url)
                that.setData({image: data.info.url}, () => {
                    console.log(that.data.image)
                })
            },
            fail() {
                Helper.showError('背景图片未添加');
            }
        })
    },
    // 输入值与data数据进行绑定
    onInput(e) {
        // console.log(e)
        let {type} = e.currentTarget.dataset;
        this.setData({[type]: e.detail.value}, () => {
            console.log(this.data)
        })
    },
    //获取自己的直播间信息
    //live_state onLine在线 offline 离线 ready准备
    getSelfLive(callback) {
        getSelfLive().then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            console.log(res)
            if (res.info.live_stream_data) {
                this.setData({
                    title  : res.info.live_stream_data.ls_title,
                    desc   : res.info.live_stream_data.ls_desc,
                    image  : res.info.live_stream_data.ls_image,
                    address: res.info.live_stream_data.ls_address,
                })
            }
            switch (res.info.live_state) {
                case "online":
                    Navigate.livePush().setFailMsg('你还有未结束的直播，为您返回！').redirect()
                    break;
                case "ready":
                    Navigate.liveBeStart().setFailMsg('你还有未结束的直播，为您返回！').redirect()
                    break;
                default:
                    callback();
                    break;
            }
        })
    },
    //获取频道栏目
    getLiveCategories() {
        this.initCreateData()
        getLiveCategories().then((res) => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            let resInfo = res.info;
            console.log(resInfo)
            let option = [];
            let action = [];
            resInfo.map(item => {
                option.push({
                    text: item.lc_title,
                    value: item.id
                })
                action.push({
                    name: item.lc_title
                })
            })
            this.setData({
                option1: option,
                actions: action
            });
        })
    },
    //获取地理位置
    getLocation() {
        let that = this;
        if (this.data.setAddress) {
            wx.getLocation({
                success: function (res) {
                    // if(!res.status){
                    //     debugger
                    //     return Helper.showError(res.msg)
                    // }
                    let locationString = res.latitude + "," + res.longitude;
                    wx.request({
                        url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
                        data: {
                            "key": "YLFBZ-WHAWI-ZXUGH-53Q65-TOJ7E-ADBNQ",
                            "location": locationString
                        },
                        method: 'GET',
                        // header: {},
                        success: function (res) {
                            console.log(res);
                            // success
                            if (res.data.status == 121 && res.data.message == '此key每日调用量已达到上限') {
                                that.setData({
                                    setAddress: false,
                                    address: '火星'
                                })
                            } else {
                                let city = res.data.result.address_component.city;
                                that.setData({
                                    address: city
                                })
                            }
                        },
                        fail: function () {
                            that.setData({
                                address: "火星"
                            })
                        },
                        complete: function () {
                            // complete
                            console.log("请求完成");
                        }
                    })
                }
            })
        } else {
            console.log('获取位置失败')
        }

    },
    // 修改直播  // SD: 标清// HD: 高清// FHD: 超清// RTC: 实时通话
    updateLive(hfd) {
        let params = {sharpness: hfd}
        updateLive(params).then(res => {
            if (!res.status) {
                return Helper.showError(res.msg)
            }
            console.log(res)
            if (res.status == true) {
                Navigate.liveBeStart().redirect()
            } else {
                Helper.showError(res.msg)
            }
        }).catch(() => {
            Helper.showError('设置失败')
        })
    },
    jumpToAdd() {
        //存储所填的信息
        this.saveAllMessage()
        Navigate.liveCreateProduct().to()
    },
    //存储所填的信息
    saveAllMessage() {
        let {image, title, time, desc, category_id, address, goods, showText} = this.data;
        let createLiveInfo = {
            image, title, time, desc, category_id, address, goods, showText
        }
        wx.setStorageSync("createLiveInfo", createLiveInfo)
    },
    //按钮bind
    showDialog() {
        let that = this
        if (this.data.beginLiveFlag) {
            Dialog.confirm({
                title: '',
                message: '清晰度选择',
                confirmButtonText: '高清 720P',
                cancelButtonText: '标清 360P'
            })
                .then(() => {
                    that.updateLive('HD')
                })
                .catch(() => {
                    that.updateLive('SD')
                });
        } else {
            this.createLive()
        }
    },
    //创建直播
    createLive() {
        Helper.showLoading();
        let {image, title, time, desc, category_id, address, goods, showText} = this.data;
        console.log(image, title, time, desc, category_id, address, goods)
        if (image != '' && title != '' && time != '' && desc != '' && category_id != '' && address != '' && goods.length > 0) {

            let create = () => {
                let {image, title, time, desc, category_id, address, goods, showText} = this.data;
                let params                                                            = {
                    image,
                    title,
                    time,
                    desc,
                    category_id,
                    address,
                    goods,
                    showText
                }
                createLive(params).then((res) => {
                    if (!res.status) {
                        return Helper.showError(res.msg)
                    }
                    Helper.hideLoading()
                    if (res.status == true) {
                        this.setData({
                            beginLive    : '开始直播',
                            beginLiveFlag: true
                        })
                        wx.setNavigationBarTitle({
                            title: '开始直播'
                        })
                        Helper.showSuccess('创建成功，开始直播吧');
                    } else {
                        Helper.showError(res.msg);
                    }
                }).catch((err) => {
                    Helper.showError('创建直播失败');
                })
            }
            if(typeof image == "object"){
                this.uploadFile((img) => {
                    this.saveAllMessage()
                    this.setData({image: img}, create)
                })
            }else{
                create()
            }
        } else {
            Helper.showError('请填写完整,亲');
        }
    },
    //修改时间
    changeTime(time) {
        time = time || null;
        let oDate = new Date(time);
        let oYear = oDate.getFullYear();
        let oMonth = oDate.getMonth() + 1;
        let oDay = oDate.getDate();
        let oHour = oDate.getHours();
        let oMin = oDate.getMinutes();
        let oSen = "00";
        let setTime = oYear + "-" + this.getBz(oMonth) + "-" + this.getBz(oDay) + " " + this.getBz(oHour) + ":" + this.getBz(oMin) + ":" + this.getBz(oSen); //拼接时间
        return setTime.toString()
    },
    //将个位数前加0
    getBz(num) {
        if (parseInt(num) < 10) {
            num = "0" + parseInt(num);
        }
        return num;
    },
    onTime(e) {
        let time = this.changeTime(e.detail)
        console.log(time);
        this.setData({
            time,
            showTime: false
        })
    },
    checkTime() {
        this.setData({
            showTime: true
        })
    },
    cancelTime() {
        this.setData({
            showTime: false
        })
    },
    Notify(data) {
        showNotify(data)
    },
    onClosea() {
        this.setData({showa: false});
    },
    onSelect(event) {
        let showText = event.detail.name;
        let category_id = '';
        this.data.option1.map(item => {
            item.text == showText ? category_id = item.value : ''
        })
        this.setData({showText, category_id})
    },
    theme() {
        this.setData({showa: true})
    }
})