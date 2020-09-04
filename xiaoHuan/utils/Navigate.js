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

import Helper from "./Helper";

class BaseNavigate {
    page    = '';
    params  = {}
    shareId = ''
    timeout = 0
    failMsg = ''

    constructor(...args) {
        console.log(args);
    }

    /**
     * @param args
     * @returns {Navigate}
     */
    static instance = (...args) => {
        return new Navigate(...args);
    }

    get = (page = null, params = {}) => {
        if (!page) {
            page   = this.page
            params = this.params
        }
        let query = [];
        if (typeof params === "object") {
            if (this.shareId) {
                params['share_id'] = this.shareId
            }
            for (let key in params) {
                query.push(key + '=' + encodeURIComponent(params[key]))
            }
            query = query.join('&')
        } else {
            query = params;
        }
        query = query && query !== '' ? '?' + query : ''
        return '/pages/' + page + '/' + page + query;
    }

    _to = (page = null, params = {}, callback) => {
        if (!page) {
            page   = this.page
            params = this.params
        }
        if (this.failMsg && this.failMsg != '') {
            Helper.showError(this.failMsg, true, this.timeout)
        }else{
            Helper.showLoading();
        }
        let url = this.get(page, params)
        if (this.timeout > 0) {
            setTimeout(() => {
                callback(url);
            }, this.timeout)
        } else {
            callback(url);
        }
        return this
    }

    to = (page = null, params = {}) => {
        return this._to(page, params, (url) => {
            wx.navigateTo({
                url     : url,
                complete: () => {
                    Helper.hideLoading()
                }
            })
        })
    }

    launch = (page = null, params = {}) => {
        return this._to(page, params, (url) => {
            wx.reLaunch({
                url     : url,
                complete: () => {
                    Helper.hideLoading()
                }
            })
        })
    }

    switchTab = (page = null, params = {}) => {
        return this._to(page, params, (url) => {
            wx.switchTab({
                url     : url,
                complete: () => {
                    Helper.hideLoading()
                }
            })
        })
    }

    redirect = (page = null, params = {}) => {
        return this._to(page, params, (url) => {
            wx.redirectTo({
                url     : url,
                complete: () => {
                    Helper.hideLoading()
                }
            })
        })
    }

    preload = (page = null, params = {}) => {
        return this._to(page, params, (url) => {
            const pages = getCurrentPages();
            let ctx     = pages[pages.length - 1];
            ctx.$preload(url)
            wx.navigateTo({
                url     : url,
                complete: () => {
                    Helper.hideLoading()
                }
            })
        })
    }

    /**
     * 设置超时跳转
     * @param time
     * @returns {BaseNavigate}
     */
    setTimeout = (time = 1000) => {
        this.timeout = time;
        return this;
    }

    /**
     * 设置分享ID
     * @param shareId
     * @returns {BaseNavigate}
     */
    setShareId = (shareId) => {
        this.shareId = shareId;
        return this
    }

    /**
     * 设置失败消息
     * @param msg
     * @returns {BaseNavigate}
     */
    setFailMsg = (msg = '') => {
        this.timeout = this.timeout || 1500
        this.failMsg = msg
        return this
    }

    /**
     * 设置分享页面，例如 index
     * @param page
     * @returns {BaseNavigate}
     */
    setPage = (page = 'index') => {
        this.page = page
        return this
    }

    /**
     * 设置分享页面参数
     * @param params
     * @returns {BaseNavigate}
     */
    setParams = (params = {}) => {
        this.params = params
        return this
    }
}

class Navigate extends BaseNavigate {
    static index              = () => {
        return BaseNavigate.instance().setPage('index').setParams()
    }
    static back = () =>{
        if(getCurrentPages().length < 2){
            Navigate.index().launch()
        }else {
            wx.navigateBack()
        }
    }
    static productDetail      = (code, flowId = '',type) => {
        return BaseNavigate.instance()
                           .setPage('productDetail')
                           .setParams({
                               code,
                               flowId,
                               type
                           })
    }
    static article            = (id) => {
        return BaseNavigate.instance().setPage('article').setParams({id})
    }
    static articleList        = (id, title) => {
        return BaseNavigate.instance()
                           .setPage('articleList')
                           .setParams({
                               id,
                               title
                           })
    }
    static live               = (id, goods_video_id = '') => {
        return BaseNavigate.instance()
                           .setPage('live')
                           .setParams({
                               id,
                               goods_video_id
                           })
    }
    static productVideo       = (videoid, type = '') => {
        return BaseNavigate.instance()
                           .setPage('productVideo')
                           .setParams({
                               videoid,
                               type
                           })
    }
    static productVideos      = (code) => {
        return BaseNavigate.instance().setPage('productVideos').setParams({code})
    }
    static  productList       = (id, title = '',keywords='', image = '') => {
        return BaseNavigate.instance()
                           .setPage('productList')
                           .setParams({
                               id,
                               title,
                               keywords,
                               image
                           })
    }
    static  productHotList    = () => {
        return BaseNavigate.instance().setPage('productHotList').setParams({})
    }
    static  livePush          = () => {
        return BaseNavigate.instance().setPage('livePush').setParams({})
    }
    static liveStreamer       = (userid) => {
        return BaseNavigate.instance().setPage('liveStreamer').setParams({userid})
    }
    static liveSelectProduct  = (type = '') => {
        return BaseNavigate.instance().setPage('liveSelectProduct').setParams({type})
    }
    static login              = () => {
        let pages       = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let page        = currentPage.route
        let options     = currentPage.options
        let query       = ''
        if (options) {
            query = []
            for (let key in options) {
                query.push(key + '=' + options[key])
            }
            query = query.join('&')
        }
        let url = '/' + page + '?' + query
        return BaseNavigate.instance().setPage('login').setParams({url})
    }
    static  memberVip         = (type = '',) => {
        return BaseNavigate.instance().setPage('memberVip').setParams({type})
    }
    static  memberIntegralDetail         = (date = '',) => {
        return BaseNavigate.instance().setPage('memberIntegralDetail').setParams({date})
    }
    static liveBeStart        = () => {
        return BaseNavigate.instance().setPage('liveBeStart').setParams({})
    }
    static liveBeEnd          = () => {
        return BaseNavigate.instance().setPage('liveBeEnd').setParams({})
    }
    static liveCreateProduct  = () => {
        return BaseNavigate.instance().setPage('liveCreateProduct').setParams({})
    }
    static liveCreate         = () => {
        return BaseNavigate.instance().setPage('liveCreate').setParams({})
    }
    static liveHistoryDetail  = (id) => {
        return BaseNavigate.instance().setPage('liveHistoryDetail').setParams({id})
    }
    static liveData           = (id) => {
        return BaseNavigate.instance().setPage('liveData').setParams({id})
    }
    static liveDetail           = () => {
        return BaseNavigate.instance().setPage('liveDetail').setParams({})
    }
    static member             = (type) => {
        return BaseNavigate.instance().setPage('member').setParams({type})
    }
    static memberWithdraw     = () => {
        return BaseNavigate.instance().setPage('memberWithdraw').setParams({})
    }
    static  withdrawHistory   = (type) => {
        return BaseNavigate.instance().setPage('withdrawHistory').setParams({type})
    }
    static  memberOrderDetail = (id) => {
        return BaseNavigate.instance().setPage('memberOrderDetail').setParams({id})
    }
    static  memberGain        = (type)=>{
        return BaseNavigate.instance().setPage('memberGain').setParams({type})
    }
    static  memberFans        = (type)=>{
        return BaseNavigate.instance().setPage('memberFans').setParams({type})
    }
    static  webview           = (url) => {
        return BaseNavigate.instance().setPage('webview').setParams({url})
    }
    static  brandDetail           = (id) => {
        return BaseNavigate.instance().setPage('brandDetail').setParams({id})
    }
    static  brand                 = (id) => {
        return BaseNavigate.instance().setPage('brand').setParams({id})
    }
    static  productGroup        = (id) => {
        return BaseNavigate.instance().setPage('productGroup').setParams({id})
    }
}

export default Navigate