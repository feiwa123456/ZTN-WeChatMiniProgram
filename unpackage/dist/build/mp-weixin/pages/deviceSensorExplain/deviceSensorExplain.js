(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/deviceSensorExplain/deviceSensorExplain"],{1614:function(t,e,i){"use strict";var n;i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return n}));var a=function(){var t=this,e=t.$createElement,i=(t._self._c,"realTime"==t.showModel?t.__map(t.realTimeList,(function(e,i){var n=t.__get_orig(e),a=t._f("formatDateTime")(e.valueDate,t.i18n.unknown);return{$orig:n,f0:a}})):null),n="history"==t.showModel?t._f("formatDate")(t.initEndTimestamp):null,a="history"==t.showModel?t._f("formatDate")(t.initEndTimestamp):null;t._isMounted||(t.e0=function(e){t.isLogin&&t.tapHistorical()}),t.$mp.data=Object.assign({},{$root:{l0:i,f1:n,f2:a}})},s=[]},"3eb5":function(t,e,i){"use strict";i.r(e);var n=i("1614"),a=i("90f6");for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);i("ddec");var o,r=i("f0c5"),c=Object(r["a"])(a["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);e["default"]=c.exports},"5e89":function(t,e,i){},"90f6":function(t,e,i){"use strict";i.r(e);var n=i("c4ac"),a=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);e["default"]=a.a},c4ac:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=u(i("a34a")),a=(u(i("83b6")),l(i("ed3d"))),s=l(i("f477")),o=l(i("505c")),r=l(i("a549")),c=l(i("bda4"));function h(){if("function"!==typeof WeakMap)return null;var t=new WeakMap;return h=function(){return t},t}function l(t){if(t&&t.__esModule)return t;if(null===t||"object"!==typeof t&&"function"!==typeof t)return{default:t};var e=h();if(e&&e.has(t))return e.get(t);var i={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){var s=n?Object.getOwnPropertyDescriptor(t,a):null;s&&(s.get||s.set)?Object.defineProperty(i,a,s):i[a]=t[a]}return i.default=t,e&&e.set(t,i),i}function u(t){return t&&t.__esModule?t:{default:t}}function d(t,e,i,n,a,s,o){try{var r=t[s](o),c=r.value}catch(h){return void i(h)}r.done?e(c):Promise.resolve(c).then(n,a)}function m(t){return function(){var e=this,i=arguments;return new Promise((function(n,a){var s=t.apply(e,i);function o(t){d(s,n,a,o,r,"next",t)}function r(t){d(s,n,a,o,r,"throw",t)}o(void 0)}))}}var f=function(){Promise.all([i.e("common/vendor"),i.e("mpvue-echarts/src/echarts")]).then(function(){return resolve(i("ad3f"))}.bind(null,i)).catch(i.oe)},g=function(){i.e("components/ztn-custom/circleComponent/circleComponent").then(function(){return resolve(i("165c"))}.bind(null,i)).catch(i.oe)},p={data:function(){return{echarts:c,isToHome:!1,fromLoginBack:!1,isLogin:!1,isLoginOverdue:!1,emphasizeColor:"",circleBgColor:"#ffffff",chartItemStyle:"",chartAreaStyle:"",screenHeight:0,showModel:"realTime",ModelHeight:"",realTimeList:[],explainId:"",explainName:"",less:"",greater:"",equal:"",wave:"",settingError:"",showErrorModal:!1,isShowAlarm:!1,isShowFilter:!0,historyMarginTop:"",chartList:[],startTimestamp:"",endTimestamp:"",initEndTimestamp:"",initStartTimestamp:"",startDate:"",endDate:"",endcreatedTime:"",selectItemHistory:null,lazyLoad:!1}},computed:{i18n:function(){return this.$i18nMsg()},themei18n:function(){return this.$themei18nOption()}},onReady:function(){var e,i=this.themei18n.theme,n=this.themei18n.navigationBarTextColor,a=this.themei18n.navigationBarBackgroundColor;switch(i){case"default":e="orangeLight";break;case"darkColor":e="blueLight";break;case"lightColor":e="blueLight";break;default:break}var s=this.themei18n.lightColor;this.circleBgColor=s[e],this.emphasizeColor=this.themei18n.emphasizeColor,this.chartItemStyle=this.themei18n.chartItemStyle,this.chartAreaStyle=this.themei18n.chartAreaStyle,t.setNavigationBarColor({frontColor:n,backgroundColor:a})},onLoad:function(e){var i=t.getStorageSync("isLogin")||!1;this.screenHeight=t.getStorageSync("screenHeight")+"px",this.initOption=e,this.isLogin=i,i?this.init(e):t.navigateTo({url:"/pages/login/login"})},onShow:function(){this.$uniUtilsApi.toHome(this);var t=this.initOption,e=this.fromLoginBack;e&&(this.init(t),this.fromLoginBack=!1,this.isLoginOverdue=!1,this.isLogin=!0)},onUnload:function(t){var e=this.isLogin;e&&this.unBindUserSocket(),e&&this.socketTask.close({success:function(t){},fail:function(t){}})},methods:{init:function(t){this.deviceName=t.deviceName,this.deviceCore=t.deviceCore,this.sensorId=t.sensorId,this.sensorName=t.sensorName,this.port=t.port,this.getRealTimeList(),this.connectSocket(),this.openSocket()},tapRealTime:function(){var t=this.showModel;"history"==t&&(this.showModel="realTime",this.selectItemHistory=null,this.getRealTimeList())},tapHistorical:function(){var t=this.showModel;"realTime"==t&&(this.showModel="history",this.$uniUtilsApi.showLoading(this.i18n.loading,!1),this.getCurrentDate(),this.getListWithExplain(void 0,!0))},getRealTimeList:function(){var e=this,i=this.sensorId;this.deviceCore;o.getRealTimeList(this,i).then((function(i){if("200"==i.code){var n=i.data;if(null==n)return void e.$uniUtilsApi.showToast(e.i18n.nodata,"none",1e3,!1);var a=t.getStorageSync("ModelHeight"),s=n.filter((function(t,e,i){return 0==t.hidden}));a?(e.ModelHeight=a-.5,e.realTimeList=s):e.$nextTick((function(){setTimeout((function(){t.createSelectorQuery().select("#showModelStyle").boundingClientRect((function(i){var n=i.height;e.ModelHeight=n-.5,e.realTimeList=s,t.setStorageSync("ModelHeight",n)})).exec()}),0)}))}}))},isShowAlarmModel:function(t){var e=t.explainId,i=t.name,n=t.less,a=t.greater,s=t.equal,o=t.wave;this.explainId=e,this.explainName=i,this.less=n,this.greater=a,this.equal=s,this.wave=o,this.isShowAlarm=!0},setAlarmValue:function(t){var e=this,i=this.sensorId,n=this.explainId,a=t.detail.value,s=a.less,r=a.greater,c=a.equal,h=a.wave;o.setAlarmValue(this,n,i,s,r,c,h).then((function(t){"200"==t.code&&(e.isShowAlarm=!1,e.$uniUtilsApi.showToast(e.i18n.setSuccess,"none",1e3,!1),e.getRealTimeList())}))},cancelSetAlarm:function(){this.isShowAlarm=!1},deviceController:function(){var e=this.deviceName,i=this.deviceCore,n="deviceController";t.navigateTo({url:"/pages/deviceNavigation/deviceNavigation?deviceName=".concat(e,"&deviceCore=").concat(i,"&pageCur=").concat(n)})},updateData:function(){var t=this;this.$uniUtilsApi.showLoading(this.i18n.loading,!0);var e=this.deviceCore,i=this.port;r.saveSetting(this,e,void 0,"getData",i,void 0).then((function(e){"200"==e.code?(t.$uniUtilsApi.hideLoading(),t.$uniUtilsApi.showToast(t.i18n.updateSuccess,"none",1e3,!0)):(t.$uniUtilsApi.hideLoading(),t.$uniUtilsApi.showToast(t.i18n.updateFail,"none",1e3,!0))}))},hideErrorModal:function(){this.showErrorModal=!1},connectSocket:function(){var e=t.getStorageSync("userId"),i=t.getStorageSync("companyId"),n=t.getStorageSync("devKey"),a=t.getStorageSync("accessToken"),s=t.getStorageSync("language"),o=(this.sensorId,"wss://core.ztn-tech.com/ws?userId=".concat(e,"&companyId=").concat(i,"&devKey=").concat(n,"&accessToken=").concat(a,"&language=").concat(s,"&app=iot"));this.socketTask=t.connectSocket({url:o,header:{"content-type":"application/json"},method:"GET",success:function(){}})},openSocket:function(){var t=this;this.socketTask.onOpen((function(e){t.bindUserSocket(),t.socketTask.onMessage((function(e){t.handleSocketData(e.data)})),t.socketTask.onClose((function(t){}))}))},bindUserSocket:function(){var t=this.sensorId,e={cmd:"bindSensor",param:t};this.socketTask.send({data:JSON.stringify(e),success:function(){return m(n.default.mark((function t(){return n.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()}})},unBindUserSocket:function(){var t=this.sensorId,e={cmd:"unBindSensor",param:t};this.socketTask.send({data:JSON.stringify(e),success:function(){return m(n.default.mark((function t(){return n.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()}})},handleSocketData:function(t){var e=this.realTimeList,i=JSON.parse(t);if("deviceOnline"!=i.type){this.$uniUtilsApi.showToast(this.i18n.uploadData,"none",1e3,!1);var n=JSON.parse(i.msg),a=i.timestamp;for(var s in n)for(var o in e){var r=e[o].keyName;r==s&&(e[o].value=n[r],e[o].valueDate=a,this.realTimeList=e)}}},goItemHistoryData:function(t){this.showModel="history",this.$uniUtilsApi.showLoading(this.i18n.loading,!1),this.getCurrentDate(),this.getListWithExplain(t,!0),this.selectItemHistory=t},getCurrentDate:function(){var t=new Date;this.startTimestamp=t.setTime(t.getTime()/1e3-604800).toString(),this.endTimestamp=Math.round((new Date).getTime()/1e3).toString(),this.startDate=a.formatDate(this.startTimestamp),this.endDate=a.formatDate(this.endTimestamp),this.initStartTimestamp=this.startTimestamp,this.initEndTimestamp=this.endTimestamp},getListWithExplain:function(t,e){var i=this;e&&(this.chartList=[]);var n=this.sensorId,a=this.initStartTimestamp,o=this.startTimestamp,r=this.endTimestamp;o>a||o==a?s.getListWithExplain(this,n,o,r).then((function(n){i.handleListWithExplain(t,e,n)})):s.getHistoryListWithExplain(this,n,o,r).then((function(n){i.handleListWithExplain(t,e,n)}))},handleListWithExplain:function(e,i,n){var a=this;if("200"==n.code){var s=parseInt(this.ModelHeight),o=t.getStorageSync("fixedHeight");o?this.historyMarginTop=o+s:this.$nextTick((function(){setTimeout((function(){t.createSelectorQuery().select("#fixedBlock").boundingClientRect((function(e){var i=null==e?0:e.height;a.historyMarginTop=i+s,t.setStorageSync("fixedHeight",i)})).exec()}),0)}));var r=n.data.explainList,c=n.data.dataList;if(e){var h=[];h.push(e),this.initChartData(h,c,i)}else this.initChartData(r,c,i)}},initChartData:function(t,e,i){var n=this;this.$uniUtilsApi.hideLoading();for(var a=[],s=0;s<t.length;s++){if(0==e.length)return void this.$uniUtilsApi.showToast(this.i18n.noData,"none",1e3,!1);if("static"!=t[s].type&&1!=t[s].hidden){for(var o=t[s].keyName,r={},c=[],h=0;h<e.length;h++){var l=e[h].val,u=new Date,d=e[h].createdTime;u.setTime(1e3*d),void 0!=l[o]&&c.push({time:u.getMonth()+1+"/"+u.getDate()+" "+u.getHours()+":"+u.getMinutes(),val:parseInt(l[o])})}r.data=c,r.name=t[s].name,r.unit=t[s].unit,r.ref=o,r.canvasId="mychart-dom-multi-"+o.replace(".","_"),0!=r.data.length?a.push(r):this.selectItemHistory&&this.$uniUtilsApi.showToast(this.i18n.noData,"none",1e3,!1)}else this.selectItemHistory&&this.$uniUtilsApi.showToast(this.i18n.noData,"none",1e3,!1)}this.chartList=a,this.$nextTick((function(){for(var t=n.chartList,e=0;e<t.length;e++){var i=t[e].ref;n.$refs[i][0].refresh()}})),this.endcreatedTime=d},initChart:function(t){var e=t.canvas,i=t.width,n=t.height,a=t.comIndex;i-=20,c.setCanvasCreator((function(){return e}));var s=c.init(e,null,{width:i,height:n});e.setChart(s);for(var o=this.chartItemStyle,r=this.chartAreaStyle,h=this.chartList[a],l=h.name,u=h.data,d=[],m=[],f=0;f<u.length;f++)d.push(u[f].time),m.push(u[f].val);var g={title:{text:l,top:"4%",textStyle:{color:"grey",fontSize:"15"}},grid:{left:"5%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},dataZoom:[{type:"inside",start:0,end:100},{start:0,end:100,top:"84%",handleIcon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",handleSize:"80%",handleStyle:{color:"#fff",shadowBlur:3,shadowColor:"rgba(0, 0, 0.3, 0.6)",shadowOffsetX:2,shadowOffsetY:2}}],xAxis:{type:"category",boundaryGap:!1,data:d,axisLine:{show:!0,lineStyle:{color:"grey"}},axisLabel:{textStyle:{color:"grey"}}},yAxis:{type:"value",axisLine:{show:!0,lineStyle:{color:"grey"}},axisLabel:{textStyle:{color:"grey"}}},series:[{data:m,type:"line",smooth:!0,markPoint:{data:[{type:"max",name:"最大值"},{type:"min",name:"最小值"}]},markLine:{data:[{type:"average",name:"平均值"}]},symbol:"none",sampling:"average",itemStyle:{normal:{color:o}},areaStyle:{normal:{color:r}}}]};s.setOption(g);var p=this.chartList[a].ref;this.$refs[p][0].setChart(s)},startDateChange:function(t){this.$uniUtilsApi.showLoading(this.i18n.loading,!1),this.chartList=[];var e=t.detail.value.replace(/-/g,"/"),i=(new Date(e).getTime()/1e3).toString(),n=this.endTimestamp;if(n<i||n==i)this.$uniUtilsApi.showToast(this.i18n.lessEndDate,"none",1e3,!1);else{this.startDate=t.detail.value,this.startTimestamp=i;var a=this.selectItemHistory;null==a?this.getListWithExplain(void 0,!1):this.getListWithExplain(a,!1)}},endDateChange:function(t){this.$uniUtilsApi.showLoading(this.i18n.loading,!1),this.chartData=[];var e=t.detail.value.replace(/-/g,"/"),i=(new Date(e).getTime()/1e3+86400).toString(),n=this.startTimestamp;if(n>i||n==i)this.$uniUtilsApi.showToast(this.i18n.greaterStartDate,"none",1e3,!1);else{this.endDate=t.detail.value,this.endTimestamp=i;var a=this.selectItemHistory;null==a?this.getListWithExplain(void 0,!1):this.getListWithExplain(a,!1)}},timeChange:function(t){this.$uniUtilsApi.showLoading(this.i18n.loading,!0),this.chartData=[];var e=parseInt(t.detail.value),i=[60,300,600,1800,3600,18e3,36e3,54e3,72e3],n=this.endcreatedTime;this.startTimestamp=(parseInt(n)-i[e]).toString();var a=this.selectItemHistory;null==a?this.getListWithExplain(void 0,!1):this.getListWithExplain(a,!1)}},components:{circleComponent:g,mpvueEcharts:f},onShareAppMessage:function(e){var i=this.deviceName,n=this.deviceCore,a=this.sensorId,s=this.sensorName,o=t.getStorageSync("nickName");return{title:"".concat(o).concat(this.i18n.moreOperate.share).concat(i),path:"/pages/deviceSensorExplain/deviceSensorExplain?deviceName=".concat(i,"&&deviceCore=").concat(n,"&&sensorId=").concat(a,"&&sensorName=").concat(s),success:function(t){}}}};e.default=p}).call(this,i("543d")["default"])},ddec:function(t,e,i){"use strict";var n=i("5e89"),a=i.n(n);a.a},e78a:function(t,e,i){"use strict";(function(t){i("91b7"),i("921b");n(i("66fd"));var e=n(i("3eb5"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,i("543d")["createPage"])}},[["e78a","common/runtime","common/vendor"]]]);