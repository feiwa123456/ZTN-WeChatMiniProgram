(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/deviceStatus/deviceStatus"],{"3cab":function(t,e,i){"use strict";var n=i("fc45"),a=i.n(n);a.a},4896:function(t,e,i){"use strict";var n;i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return n}));var a=function(){var t=this,e=t.$createElement,i=(t._self._c,t._f("formatDate")(t.initEndTimestamp)),n=t._f("formatDate")(t.initEndTimestamp);t.$mp.data=Object.assign({},{$root:{f0:i,f1:n}})},s=[]},"629f":function(t,e,i){"use strict";(function(t){i("91b7"),i("921b");n(i("66fd"));var e=n(i("c50a"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,i("543d")["createPage"])},baa3:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=c(i("ed3d")),a=c(i("1c66")),s=o(i("b060"));function o(t){return t&&t.__esModule?t:{default:t}}function r(){if("function"!==typeof WeakMap)return null;var t=new WeakMap;return r=function(){return t},t}function c(t){if(t&&t.__esModule)return t;if(null===t||"object"!==typeof t&&"function"!==typeof t)return{default:t};var e=r();if(e&&e.has(t))return e.get(t);var i={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){var s=n?Object.getOwnPropertyDescriptor(t,a):null;s&&(s.get||s.set)?Object.defineProperty(i,a,s):i[a]=t[a]}return i.default=t,e&&e.set(t,i),i}var u={mixins:[s.default],data:function(){return{CustomBar:this.CustomBar,isToHome:!1,fromLoginBack:!1,isLoginOverdue:!1,navigationBarTextColor:"",downOption:{use:!0,auto:!1},upOption:{auto:!1,empty:{use:!0,fixed:!0,top:"20%"}},style:"",isShowList:!1,startDate:"",endDate:"",startTimestamp:"",endTimestamp:"",initEndTimestamp:"",initEndDate:"",deviceStatusList:[],deviceName:"",deviceCore:null,currentPage:1,pageSize:10}},computed:{i18n:function(){return this.$i18nMsg()},themei18n:function(){return this.$themei18nOption()}},onLoad:function(e){var i=t.getStorageSync("isLogin")||!1;this.initOption=e,i?this.init(e):t.navigateTo({url:"/pages/login/login"}),this.navigationBarTextColor=this.themei18n.navigationBarTextColor},onShow:function(){this.$uniUtilsApi.toHome(this);var t=this.initOption,e=this.fromLoginBack;e&&(this.init(t),this.fromLoginBack=!1,this.isLoginOverdue=!1)},methods:{downCallback:function(){this.currentPage=1,this.deviceStatusList=[],this.mescroll.resetUpScroll()},init:function(t){this.deviceName=t.deviceName||null,this.deviceCore=t.deviceCore||null,this.initDate()},initDate:function(){var t=new Date;this.startTimestamp=Math.round(t.getTime()/1e3-604800).toString(),this.endTimestamp=Math.round(t.getTime()/1e3+10).toString(),this.startDate=n.formatDate(this.startTimestamp),this.endDate=n.formatDate(this.endTimestamp),this.initEndTimestamp=this.endTimestamp,this.getDeviceStatus()},getDeviceStatus:function(e){var i=this,s=this.deviceCore,o=this.startTimestamp,r=this.endTimestamp,c=this.currentPage,u=this.pageSize;a.getDeviceStatus(this,s,o,r,c,u).then((function(e){if("200"==e.code){var a=e.data,s=a.currentPage,o=a.data,r=a.total,c=t.getStorageSync("fixedHeight");c?(i.style="margin-top:".concat(c,"px"),i.isShowList=!0):i.$nextTick((function(){setTimeout((function(){t.createSelectorQuery().select("#fixedBlock").boundingClientRect((function(e){var n=e.height;i.style="margin-top:".concat(n,"px"),i.isShowList=!0,t.setStorageSync("fixedHeight",n)})).exec()}),0)}));for(var u=0;u<o.length;u++){var l=i.$uniUtilsApi.handleDeviceStatus(i.i18n.status,o[u].status),d=l.deviceStatu;o[u].deviceStatu=d,o[u].timestamp=n.formatDateTime(o[u].timestamp,i.i18n.unknown)}i.mescroll.endByPage(o.length,r);var f=s-1;i.$set(i.deviceStatusList,f,o),i.currentPage=s+1}}))},startDateChange:function(t){var e=t.detail.value.replace(/-/g,"/"),i=(new Date(e).getTime()/1e3).toString(),n=this.endTimestamp;n<i||n==i?this.$uniUtilsApi.showToast(this.i18n.lessEndDate,"none",1e3,!1):(this.startTimestamp=i,this.startDate=t.detail.value,this.currentPage=1,this.deviceStatusList=[],this.mescroll.scrollTo(0,300),this.mescroll.resetUpScroll())},endDateChange:function(t){var e=t.detail.value.replace(/-/g,"/"),i=(new Date(e).getTime()/1e3+86400).toString(),n=this.startTimestamp;n>i||n==i?this.$uniUtilsApi.showToast(this.i18n.greaterStartDate,"none",1e3,!1):(this.endTimestamp=i,this.endDate=t.detail.value,this.currentPage=1,this.deviceStatusList=[],this.mescroll.scrollTo(0,300),this.mescroll.resetUpScroll())},deviceNavigation:function(e,i,n){t.navigateTo({url:"/pages/deviceNavigation/deviceNavigation?deviceName=".concat(e,"&deviceCore=").concat(i,"&pageCur=").concat(n)})}},onShareAppMessage:function(e){var i=this.deviceName,n=this.deviceCore,a=t.getStorageSync("nickName"),s=t.getStorageSync("shortCompanyName");return{title:null==i?"".concat(a).concat(this.i18n.moreOperate.share).concat(s):"".concat(a).concat(this.i18n.moreOperate.share).concat(i),path:null==n?"/pages/deviceStatus/deviceStatus":"/pages/deviceStatus/deviceStatus?deviceName=".concat(i,"&&deviceCore=").concat(n),success:function(t){}}}};e.default=u}).call(this,i("543d")["default"])},c50a:function(t,e,i){"use strict";i.r(e);var n=i("4896"),a=i("d784");for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);i("3cab");var o,r=i("f0c5"),c=Object(r["a"])(a["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);e["default"]=c.exports},d784:function(t,e,i){"use strict";i.r(e);var n=i("baa3"),a=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);e["default"]=a.a},fc45:function(t,e,i){}},[["629f","common/runtime","common/vendor"]]]);