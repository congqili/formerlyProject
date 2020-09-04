/*
              .======.
              |      |         专
              |      |         注
              |      |         于
 .============'      '============.
 |        _  Physton.com   _   互 |
 |       /_;-.__ / _\  _.-;_\  联 |
 |         `-._`'`_/'`.-'      网 |
 '============.`\   /`============'
              | |  / |         项
     P        |/-.(  |         目
      h       |\_._\ |         工
       y      | \ \`;|         程
        s     |  > |/|         研
         t    | / // |         究
          o   | |//  |         与
           n  | \(\  |         开
              |  ``  |         发
              |      |         ！
              |      |
  \    _  _\| \//  |//_   _ \// _
 ^ `^`^ ^`` `^ ^` ``^^`  `^^` `^ `^
*/

export default class Helper {
    /**
     * 显示加载进度条
     * @param title
     * @param mask
     * @param timeout
     */
    static showLoading(title = '加载中···', mask = true, timeout = 5000) {
        wx.hideLoading()
        wx.showLoading({
            title: title,
            mask : mask
        })
        if (timeout) {
            setTimeout(wx.hideLoading, timeout)
        }
    }

    /**
     * 隐藏加载进度条
     */
    static hideLoading() {
        wx.hideLoading()
    }

    static hideToast() {
        wx.hideToast()
    }

    /**
     * 显示成功消息
     * @param title
     * @param mask
     * @param duration
     */
    static showSuccess(title = '加载成功', mask = false, duration = 1500) {
        this.hideLoading()
        wx.showToast({
            title   : title,
            icon    : 'success',
            duration: duration,
            mask    : mask
        })
    }

    /**
     * 显示失败消息
     * @param title
     * @param mask
     * @param duration
     */
    static showError(title = '加载失败', mask = false, duration = 1500) {
        this.hideLoading()
        wx.showToast({
            title   : title,
            icon    : 'none',
            duration: duration,
            mask    : mask
        })
    }

    static reSizeImage(image, size) {
        if (typeof image !== "string") return image;
        if (image.indexOf("cdn.iyizhanke.com") >= 0) {
            if (image.indexOf("resize,w_") >= 0) {
                return image.replace(/resize,w_/i, 'resize,w_' + size)
            } else {
                return image + '?x-oss-process=image/resize,w_' + size;
            }
        } else {
            return image.replace(/_[0-9]+w_[0-9]+h_/i, '_' + size + 'w_' + size + 'h_')
        }
    }

    /**
     * 重置商品图片大小
     * @param goods 商品列表数组、商品数组、其他任意数组
     * @param size 重置后的大小
     * @returns {*[]}
     */
    static reSizeGoodsImage(goods = [], size = 300) {
        if (typeof goods != "object") return goods
        for (let key in goods) {
            if (key === 'goods_images') {
                for (let i = 0; i < goods[key].length; i++) {
                    goods[key][i] = this.reSizeImage(goods[key][i], size);
                }
            } else if (key === 'goods_image' || key === 'pictureUrl' || key === 'layout_image') {
                goods[key] = this.reSizeImage(goods[key], size);
            } else {
                this.reSizeGoodsImage(goods[key], size)
            }
        }
        return goods
    }

    static getScreenFactor() {
        if (!this.screenFactor) {
            const sysInfo     = wx.getSystemInfoSync();
            const screenWidth = sysInfo.screenWidth;
            this.screenFactor = screenWidth / 750; // 获取比例
        }
        return this.screenFactor
    }
    static throttle(fn,delay){
        var lastTime = 0;
        
        return function(){
            var nowTime = Date.now()
            if(nowTime - lastTime > delay){
                fn.call(this)
                lastTime = nowTime
            }
        }
        
    }
    static toPx(rpx) {
        return rpx * this.getScreenFactor();
    }

    static toRpx(px) {
        return px / this.getScreenFactor();
    }
}