(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-deviceSensor-deviceSensor"],{"0b74":function(e,t,i){"use strict";function n(e,t,i){var n=e.$uniBaseRequest(e,"/camera/bind/list",{userId:t,deviceCore:i});return n}function a(e,t,i,n){var a=e.$uniBaseRequest(e,"/camera/device/pageGet",{userId:t,currentPage:i,pageSize:n});return a}function r(e,t,i,n){var a=e.$uniBaseRequest(e,"/camera/auth/pageGet",{userId:t,currentPage:i,pageSize:n});return a}function s(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60,n=e.$uniBaseRequest(e,"/camera/device/pushCloud",{mediaType:"rtmp",deviceId:t,pushTime:i});return n}function o(e,t){var i=e.$uniBaseRequest(e,"/camera/device/stopCloud",{deviceId:t});return i}function c(e,t){var i=e.$uniBaseRequest(e,"/camera/device/keepPushCloud",{mediaType:"rtmp",deviceId:t});return i}function u(e,t,i){var n=e.$uniBaseRequest(e,"/camera/device/controlAction",{deviceId:t,action:i});return n}Object.defineProperty(t,"__esModule",{value:!0}),t.getCameraList=n,t.getCameraDeviceList=a,t.getCameraAuthList=r,t.pushCloud=s,t.stopCloud=o,t.keepPushCloud=c,t.sendActionCommand=u},"165c":function(e,t,i){"use strict";i.r(t);var n=i("fba9"),a=i("e585");for(var r in a)"default"!==r&&function(e){i.d(t,e,(function(){return a[e]}))}(r);var s,o=i("f0c5"),c=Object(o["a"])(a["default"],n["b"],n["c"],!1,null,"a52c58ee",null,!1,n["a"],s);t["default"]=c.exports},"4d50":function(e,t,i){"use strict";i("a9e3"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{}},name:"circleComponent",props:{circleWidth:{type:Number,default:75},circleHeight:{type:Number,default:75},circleBgColor:{type:String,default:""},circleBorder:{type:String,default:""}},computed:{i18n:function(){return this.$i18nMsg()},themei18n:function(){return this.$themei18nOption()}},mounted:function(){this.themeColor=this.themei18n.emphasizeColor},methods:{}};t.default=n},"7b95":function(e,t,i){"use strict";var n;i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return r})),i.d(t,"a",(function(){return n}));var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{style:[{paddingBottom:e.tabbarHeight+"px"}]},[e.isToHome?i("cu-custom",{attrs:{isHome:!0}},[i("template",{staticClass:"text-white",style:[{color:e.navigationBarTextColor}],attrs:{slot:"homeText"},slot:"homeText"},[e._v(e._s(e.deviceName))])],2):i("cu-custom",{attrs:{isBack:!0}},[i("template",{staticClass:"text-white",style:[{color:e.navigationBarTextColor}],attrs:{slot:"backText"},slot:"backText"},[e._v(e._s(e.deviceName))])],2),i("v-uni-view",{staticClass:"margin-bottom",style:e.cameraStyle},e._l(e.cameraList,(function(t,n){return i("v-uni-view",{key:n,staticClass:"flex align-center bg-white padding-tb",class:[e.cameraList.length!=n+1?"solid-bottom":""],on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.tapCamera(t)}}},[i("v-uni-view",{staticClass:"margin-left margin-right-xl"},[i("v-uni-view",{staticClass:"cu-avatar lg text-gray",class:[t.picturePath?"":"cuIcon-pic"],staticStyle:{"background-color":"rgba(0,0,0,0)","font-size":"96rpx"},style:[{backgroundImage:"url("+t.picturePath+")"}]})],1),i("v-uni-view",{staticClass:" flex-sub flex align-center justify-between margin-right"},[i("v-uni-view",[i("v-uni-view",{staticClass:"text-xl margin-bottom-sm"},[e._v(e._s(t.name))])],1),i("v-uni-view",{staticClass:"cuIcon-right text-black text-xl"})],1)],1)})),1),i("v-uni-view",{attrs:{id:"ztnCustom-sensor"}},e._l(e.sensorsList,(function(t,n){return i("v-uni-view",{key:n,staticClass:"flex align-center bg-white padding-tb",class:[e.sensorsList.length!=n+1?"solid-bottom":""],on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.tapSensor(t)}}},[i("v-uni-view",{staticClass:"margin-left margin-right-xl"},[i("v-uni-view",{staticClass:"cu-avatar lg",staticStyle:{"background-color":"rgba(0,0,0,0)"},style:[{backgroundImage:"url("+t.iconUrl+")"}]})],1),i("v-uni-view",{staticClass:"flex-sub flex align-center justify-between margin-right"},[i("v-uni-view",[i("v-uni-view",{staticClass:"text-xl margin-bottom-sm"},[e._v(e._s(t.sensorName))]),i("v-uni-view",{staticClass:"flex align-center"},[i("v-uni-view",{staticClass:"text-grey text-lg margin-right"},[e._v(e._s(t.type))]),i("v-uni-view",{staticClass:"text-gray"},[e._v(e._s(e.i18n.deviceSensor.port)+":"+e._s(t.port))])],1)],1),i("v-uni-view",{staticClass:"cuIcon-right text-black text-xl"})],1)],1)})),1)],1)},r=[]},a190:function(e,t,i){"use strict";var n=i("dbce"),a=i("4ea4");i("99af"),i("4de4"),i("a9e3"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(i("165c")),s=n(i("f477")),o=n(i("0b74")),c={data:function(){return{CustomBar:this.CustomBar,isLoginOverdue:!1,navigationBarTextColor:"",emphasizeColor:"",circleBgColor:"#ffffff",sensorsList:[],cameraList:[],cameraStyle:"display:none"}},props:{deviceName:{type:String,default:""},deviceCore:{type:String,default:""},tabbarHeight:{type:[Number,String],default:0},isToHome:{type:Boolean,default:!1}},computed:{i18n:function(){return this.$i18nMsg()},themei18n:function(){return this.$themei18nOption()}},mounted:function(){var e=uni.getStorageSync("isLogin")||!1;e&&this.init()},methods:{init:function(){this.getSensorList(),this.getCameraList(),this.navigationBarTextColor=this.themei18n.navigationBarTextColor;var e,t=this.themei18n.theme;switch(t){case"default":e="orangeLight";break;case"darkColor":e="blueLight";break;case"lightColor":e="blueLight";break;default:break}var i=this.themei18n.lightColor;this.circleBgColor=i[e],this.emphasizeColor=this.themei18n.emphasizeColor},getSensorList:function(e){var t=this,i=this.deviceCore;s.getSensorList(this,i).then((function(e){if("200"==e.code){var i=e.data,n=i.filter((function(e,t){return 0==e.hidden}));if(n.length>0){for(var a=0;a<n.length;a++){var r=n[a].type;n[a].type=t.i18n.deviceSensor.sensorType[r]}t.sensorsList=n}}}))},getCameraList:function(e){var t=this,i=this.deviceCore,n=uni.getStorageSync("userId");o.getCameraList(this,n,i).then((function(e){if("200"==e.code){var i=e.data;t.cameraStyle=0==i.length?"display:none":"display:block";for(var n=0;n<i.length;n++){var a=i[n],r=a.picturePath,s=a.deviceId,o=a.name,c={picturePath:r?"".concat(r):null,deviceId:s,name:o};t.$set(t.cameraList,n,c)}}}))},tapCamera:function(e){var t=e.deviceId,i=e.name;uni.navigateTo({url:"/pages/devicePlayer/devicePlayer?deviceId=".concat(t,"&name=").concat(i)})},tapSensor:function(e){var t=e.sensorId,i=e.sensorName,n=e.deviceCore,a=e.port,r=this.deviceName;uni.navigateTo({url:"/pages/deviceSensorExplain/deviceSensorExplain?sensorId=".concat(t,"&sensorName=").concat(i,"&deviceCore=").concat(n,"&deviceName=").concat(r,"&port=").concat(a)})}},components:{circleComponent:r.default}};t.default=c},aff7:function(e,t,i){"use strict";i.r(t);var n=i("a190"),a=i.n(n);for(var r in n)"default"!==r&&function(e){i.d(t,e,(function(){return n[e]}))}(r);t["default"]=a.a},d907:function(e,t,i){"use strict";i.r(t);var n=i("7b95"),a=i("aff7");for(var r in a)"default"!==r&&function(e){i.d(t,e,(function(){return a[e]}))}(r);var s,o=i("f0c5"),c=Object(o["a"])(a["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],s);t["default"]=c.exports},e585:function(e,t,i){"use strict";i.r(t);var n=i("4d50"),a=i.n(n);for(var r in n)"default"!==r&&function(e){i.d(t,e,(function(){return n[e]}))}(r);t["default"]=a.a},f477:function(e,t,i){"use strict";function n(e,t){var i=e.$uniBaseRequest(e,"/device/sensor/list",{deviceCore:t,currentPage:1,pageSize:999});return i}function a(e,t,i,n){var a=e.$uniBaseRequest(e,"/device/sensor/data/listWithExplain",{enableEval:!0,sensorId:t,startTime:i,endTime:n});return a}function r(e,t,i,n){var a=e.$uniBaseRequest(e,"/history/device/sensor/data/listWithExplain",{enableEval:!0,sensorId:t,startTime:i,endTime:n});return a}function s(e,t,i,n,a){var r=e.$uniBaseRequest(e,"/device/sensor/listWith",{deviceCore:t,withExplain:i,withParam:n,withSetting:a});return r}Object.defineProperty(t,"__esModule",{value:!0}),t.getSensorList=n,t.getListWithExplain=a,t.getHistoryListWithExplain=r,t.getListWith=s},fba9:function(e,t,i){"use strict";var n;i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return r})),i.d(t,"a",(function(){return n}));var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",[i("v-uni-view",{staticClass:"cu-avatar round lg light",style:{width:e.circleWidth+"rpx",height:e.circleHeight+"rpx","background-color":e.circleBgColor,border:e.circleBorder}},[e._t("default")],2)],1)},r=[]}}]);