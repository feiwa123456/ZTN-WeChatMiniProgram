(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/moreOperate/moreOperate"],{"06a2":function(e,t,n){"use strict";n.r(t);var i=n("910c"),o=n.n(i);for(var a in i)"default"!==a&&function(e){n.d(t,e,(function(){return i[e]}))}(a);t["default"]=o.a},4683:function(e,t,n){"use strict";n.r(t);var i=n("bcff"),o=n("06a2");for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);n("b1f7");var s,r=n("f0c5"),u=Object(r["a"])(o["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);t["default"]=u.exports},5587:function(e,t,n){},"910c":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r(n("870a")),o=r(n("1b64")),a=r(n("5891"));function s(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return s=function(){return e},e}function r(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=s();if(t&&t.has(e))return t.get(e);var n={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var a=i?Object.getOwnPropertyDescriptor(e,o):null;a&&(a.get||a.set)?Object.defineProperty(n,o,a):n[o]=e[o]}return n.default=e,t&&t.set(e,n),n}var u={data:function(){return{CustomBar:this.CustomBar,isToHome:!1,fromLoginBack:!1,isLoginOverdue:!1,navigationBarTextColor:"",webViewList:[],isShowBindDeviceModal:!1,isShowModifyModal:!1,oldPassword:"",newPassword:""}},computed:{i18n:function(){return this.$i18nMsg()},themei18n:function(){return this.$themei18nOption()}},onLoad:function(){this.navigationBarTextColor=this.themei18n.navigationBarTextColor;var t=e.getStorageSync("isLogin")||!1;t?this.getWebViewList():e.navigateTo({url:"/pages/login/login"})},onShow:function(){this.$uniUtilsApi.toHome(this);var e=this.fromLoginBack;e&&(this.getWebViewList(),this.fromLoginBack=!1,this.isLoginOverdue=!1)},methods:{deviceCamera:function(){e.navigateTo({url:"/pages/deviceCamera/deviceCamera"})},tapScan:function(){this.$uniUtilsApi.handleScan(this)},bindDeviceModal:function(){this.isShowBindDeviceModal=!this.isShowBindDeviceModal},bindDevice:function(e){var t=this,n=e.detail.value.deviceCore.replace(/\s/g,"");this.isShowBindDeviceModal=!1,o.getDeviceInfo(this,n).then((function(e){if("200"==e.code){t.$uniUtilsApi.showToast(t.i18n.bindSuccess,"none",1e3,!1);var n=getCurrentPages(),i=n[n.length-2];i&&(i.$vm.refresh=!0)}else t.$uniUtilsApi.showToast(t.i18n.bindFail,"none",1e3,!1)}))},modifyModal:function(){this.isShowModifyModal=!this.isShowModifyModal},changeOldPasswordInput:function(e){this.oldPassword=e.detail.value.replace(/\s/g,"")},changeNewPasswordInput:function(e){this.newPassword=e.detail.value.replace(/\s/g,"")},modifyPassword:function(t){var n=this,o=e.getStorageSync("userId"),a=this.oldPassword,s=this.newPassword;a.length<6||s.length<6?this.$uniUtilsApi.showToast(this.i18n.moreOperate.passwordLeastLength,"none",1e3,!1):a===s?this.$uniUtilsApi.showToast(this.i18n.moreOperate.passwordEqual,"none",1e3,!1):(i.updatePassword(this,o,a,s).then((function(e){"200"==e.code?(n.modifyModal(),n.$uniUtilsApi.showToast(n.i18n.setSuccess,"none",1e3,!1)):n.$uniUtilsApi.showToast(n.i18n.setFail,"none",1e3,!1)})),this.oldPassword="",this.newPassword="")},getWebViewList:function(){var t=this,n=e.getStorageSync("companyId");a.getCompanyResource(this,"message",n).then((function(e){if("200"==e.code){for(var n=e.data,i=[],o=0;o<n.length;o++){var a={},s=n[o],r=s.title,u=s.url;a.title=r,a.url=u,i.push(a)}t.webViewList=i}}))},tapWebView:function(t){var n=t.url;e.navigateTo({url:"/pages/web/web?url=".concat(n)})}},onShareAppMessage:function(t){var n=e.getStorageSync("nickName"),i=e.getStorageSync("shortCompanyName");return{title:"".concat(n).concat(this.i18n.moreOperate.share).concat(i),path:"/pages/nav/nav",success:function(e){}}}};t.default=u}).call(this,n("543d")["default"])},b1f7:function(e,t,n){"use strict";var i=n("5587"),o=n.n(i);o.a},bcff:function(e,t,n){"use strict";var i;n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return i}));var o=function(){var e=this,t=e.$createElement;e._self._c},a=[]},ede0:function(e,t,n){"use strict";(function(e){n("91b7"),n("921b");i(n("66fd"));var t=i(n("4683"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])}},[["ede0","common/runtime","common/vendor"]]]);