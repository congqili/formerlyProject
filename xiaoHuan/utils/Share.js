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

import {createShare, toShare} from "../api/share";
import Navigate from "./Navigate";

export default class Share {
    title   = ''
    page    = 'index'
    params  = {}
    image   = ''
    type    = 'default'
    target  = null
    shareId = ''

    constructor(...args) {
        console.log(args);
    }

    /**
     * 实例化
     * @param args
     * @returns {Share}
     */
    static instance = (...args) => {
        return new Share(...args);
    }

    /**
     * 设置分享标题
     * @param title
     * @returns {Share}
     */
    setTitle = (title = '') => {
        this.title = title
        return this
    }

    /**
     * 设置分享页面，例如 index
     * @param page
     * @returns {Share}
     */
    setPage = (page = 'index') => {
        this.page = page
        return this
    }

    /**
     * 设置分享页面参数
     * @param params
     * @returns {Share}
     */
    setParams = (params = {}) => {
        this.params = params
        return this
    }

    /**
     * 设置分享图片
     * @param image
     * @returns {Share}
     */
    setImage = (image) => {
        this.image = image
        return this
    }

    /**
     * 设置分享类型，传送到后台分享接口的type
     * @param type
     * @returns {Share}
     */
    setType = (type = 'default') => {
        this.type = type
        return this
    }

    /**
     * 设置分享目标，传送到后台分享接口的target
     * @param target
     * @returns {Share}
     */
    setTarget = (target) => {
        this.target = target
        return this
    }

    get = () => {
        let post = {
            type  : this.type,
            target: this.target || Navigate.instance().get(this.page, this.params)
        }
        createShare(post).then((res) => {
            console.log(res);
            //if (!res) return Helper.showError(result.msg)
            if (res) this.shareId = res.info.id
        });
        return this;
    }

    to = () => {
        let result = {
            title   : this.title || wx.getStorageSync("CommonConfig").store_title,
            path    : Navigate.instance().setShareId(this.shareId).get(this.page, this.params),
            imageUrl: this.image || wx.getStorageSync("CommonConfig").store_poster
        }
        if (this.shareId && this.shareId !== '') toShare({id: this.shareId})
        console.log(result);
        return result
    }
}