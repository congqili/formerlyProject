import {createShare} from '../api/share'
import Notify from "../miniprogram_npm/@vant/weapp/notify/notify";
import Helper from "./Helper";

//文本拷贝
function copyText(text) {
    wx.setClipboardData({
        data: text,
        success: function (res) {
            wx.hideToast()
            Helper.showSuccess('复制成功');
        },
        fail(err) {
            wx.hideToast()
            Helper.showError('复制失败');
        }
    })
}

function isEmpty(obj) {
    //检验null和undefined
    if (!obj && obj !== 0 && obj !== '') {
        return true;
    }
    //检验数组
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
        return true;
    }
    //检验对象
    if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
        return true;
    }
    return false;
}

function color16() {//十六进制颜色随机
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}

//图片预览方法，参数为数组格式
function previewImage(src, current) {
    wx.previewImage({
        urls: src,
        current: src[current] || src[0],
        longPressActions: {
            itemList: ['发送给朋友', '保存图片', '收藏'],
            success: function (data) {
                console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
            },
            fail: function (err) {
                console.log(err.errMsg);
            }
        }
    });
}

//价格过滤结果为数组
function filterPrice(num) {
    let arr = num.toString().split('.')
    if (arr.length == 1) {
        arr.push('00')
    } else if (arr[1].length == 1) {
        arr[2] += '0'
    }else if(arr[1].length>2){
        arr[1] = arr[1].slice(0,2)
    }
    return arr
}


function saveImage(src) {
    let saveImage = function (file) {
        wx.saveImageToPhotosAlbum({
            filePath: file,
            success(res) {
                console.log(res);
                Helper.showSuccess('保存成功')
            },
            fail(err) {
                console.log(err)
                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    wx.showModal({
                        title: '提示',
                        content: '需要您授权保存相册',
                        showCancel: false,
                        success: modalSuccess => {
                            wx.openSetting({
                                success(settingdata) {
                                    console.log("settingdata", settingdata)
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        wx.showModal({
                                            title: '提示',
                                            content: '获取权限成功,再次点击图片即可保存',
                                            showCancel: false,
                                        })
                                    } else {
                                        wx.showModal({
                                            title: '提示',
                                            content: '获取权限失败，将无法保存到相册哦~',
                                            showCancel: false,
                                        })
                                    }
                                },
                                fail(failData) {
                                    console.log("failData", failData)
                                },
                                complete(finishData) {
                                    console.log("finishData", finishData)
                                }
                            })
                        }
                    })
                } else {
                    Helper.showError('保存失败请重试')
                }
            }
        })
    }
    if (src.indexOf("wxfile://") >= 0) {
        saveImage(src)
    } else {
        wx.downloadFile({
            url: src,
            success: function (res) {
                console.log(src);
                console.log(res.tempFilePath);
                saveImage(res.tempFilePath);
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }
}


//创建分享id
function createShared(params, that) {
    createShare({type: params[0], target: params[1]}).then(res => {
        that.setData({
            share_id: res.info.data.id
        })
    })
}

//展示提示框方法
function showNotify(data) {
    console.log(data)
    Notify({type: 'success', message: data.info.msg})
}

function getBz(num) {
    if (parseInt(num) < 10) {
        num = "0" + parseInt(num);
    }
    return num;
}

//日期格式化
function changTimeFormat(time) {
    let oDate = new Date(time);
    let oYear = oDate.getFullYear();
    let oMonth = oDate.getMonth() + 1;
    let oDay = oDate.getDate();
    let setTime = oYear + "-" + getBz(oMonth) + "-" + getBz(oDay); //拼接时间
    return setTime.toString()
}

//直播时间过滤 起始时间 结束时间
function timeFilter(str1='',str2='') {

    // console.log(str1,str2)

    let arr1 = str1.split(' ')
    let date1 = arr1[0].split('-')
    let time1 = arr1[1].split(':')

    if(!str2){
        return date1[1]+'/'+date1[2]+' '+time1[0]+':'+time1[1]
    }

    let arr2 = str2.split(' ')
    let date2 = arr2[0].split("-")
    let time2 = arr2[1].split(':')

    return date1[1]+'/'+date1[2]+' '+time1[0]+':'+time1[1]+'-'+time2[0]+':'+time2[1]

}

function computedTime(time) {

    let secondTime = parseInt(time)//将传入的秒的值转化为Number
    let min = 0// 初始化分
    let h = 0// 初始化小时
    let result = ''
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
        if (min > 60) {//如果分钟大于60，将分钟转换成小时
            h = parseInt(min / 60)//获取小时，获取分钟除以60，得到整数小时
            min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        }
    }
    result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
    return result
}

function errMsg(res) {
    if(!res.status){
        return Helper.showError(res.msg)
    }
}

export {copyText ,isEmpty,errMsg, computedTime , timeFilter, previewImage, changTimeFormat, filterPrice, showNotify, color16, createShared, saveImage}