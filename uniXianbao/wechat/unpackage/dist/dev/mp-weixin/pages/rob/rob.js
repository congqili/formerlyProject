(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/rob/rob"],{154:
/*!**********************************************************************************************!*\
  !*** C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/main.js?{"page":"pages%2Frob%2Frob"} ***!
  \**********************************************************************************************/
/*! no static exports found */function(n,t,e){"use strict";(function(n){e(/*! uni-pages */4);r(e(/*! vue */3));var t=r(e(/*! ./pages/rob/rob.vue */155));function r(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,e(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */2)["createPage"])},155:
/*!***************************************************************************!*\
  !*** C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue ***!
  \***************************************************************************/
/*! no static exports found */function(n,t,e){"use strict";e.r(t);var r=e(/*! ./rob.vue?vue&type=template&id=538d4892& */156),u=e(/*! ./rob.vue?vue&type=script&lang=js& */158);for(var o in u)"default"!==o&&function(n){e.d(t,n,(function(){return u[n]}))}(o);e(/*! ./rob.vue?vue&type=style&index=0&lang=less& */160);var c,i=e(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */12),a=Object(i["default"])(u["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],c);a.options.__file="pages/rob/rob.vue",t["default"]=a.exports},156:
/*!**********************************************************************************************************!*\
  !*** C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=template&id=538d4892& ***!
  \**********************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */function(n,t,e){"use strict";e.r(t);var r=e(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./rob.vue?vue&type=template&id=538d4892& */157);e.d(t,"render",(function(){return r["render"]})),e.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),e.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),e.d(t,"components",(function(){return r["components"]}))},157:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=template&id=538d4892& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */function(n,t,e){"use strict";var r;e.r(t),e.d(t,"render",(function(){return u})),e.d(t,"staticRenderFns",(function(){return c})),e.d(t,"recyclableRender",(function(){return o})),e.d(t,"components",(function(){return r}));var u=function(){var n=this,t=n.$createElement;n._self._c},o=!1,c=[];u._withStripped=!0},158:
/*!****************************************************************************************************!*\
  !*** C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************/
/*! no static exports found */function(n,t,e){"use strict";e.r(t);var r=e(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./rob.vue?vue&type=script&lang=js& */159),u=e.n(r);for(var o in r)"default"!==o&&function(n){e.d(t,n,(function(){return r[n]}))}(o);t["default"]=u.a},159:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(){e.e(/*! require.ensure | components/tarbbar/tabbar */"components/tarbbar/tabbar").then(function(){return resolve(e(/*! @/components/tarbbar/tabbar.vue */247))}.bind(null,e)).catch(e.oe)},u={components:{tabBar:r},data:function(){return{bannerList:[]}},onLoad:function(){this.getQuickLayout()},methods:{getQuickLayout:function(){var n=this;this.$api.getQuickLayout().then((function(t){console.log(t),n.bannerList=t.info.quick_banner}))}}};t.default=u},160:
/*!*************************************************************************************************************!*\
  !*** C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=style&index=0&lang=less& ***!
  \*************************************************************************************************************/
/*! no static exports found */function(n,t,e){"use strict";e.r(t);var r=e(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--10-oneOf-1-2!./node_modules/postcss-loader/src??ref--10-oneOf-1-3!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--10-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./rob.vue?vue&type=style&index=0&lang=less& */161),u=e.n(r);for(var o in r)"default"!==o&&function(n){e.d(t,n,(function(){return r[n]}))}(o);t["default"]=u.a},161:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--10-oneOf-1-2!./node_modules/postcss-loader/src??ref--10-oneOf-1-3!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--10-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/mir LI/Desktop/YiXianBaoWechatNew/wechat/pages/rob/rob.vue?vue&type=style&index=0&lang=less& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(n,t,e){}},[[154,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/rob/rob.js.map