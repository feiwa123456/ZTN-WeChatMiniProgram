import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import messages from '@/common/utils/messages/messages.js'
import themeColors from '@/common/utils/themeColors/themeColors.js'
import * as utils from '@/common/utils/utils.js'
import * as error from '@/common/utils/error/error.js'
import baseRequest from '@/common/utils/ztnUniAppApi/baseRequest/baseRequest.js'
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
import cuCustom from '@/colorui/components/cu-custom.vue'
import md5 from 'js-md5';

Vue.config.productionTip = false
import filters from '@/common/utils/filter/filters.js'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

Vue.use(VueI18n)
let language =  wx.getStorageSync('language') || 'zh'
wx.setStorageSync('language',language)
const i18n = new VueI18n({  
  locale: language,  // 默认选择的语言
  messages 
}) 
Vue.prototype._i18n = i18n    
Vue.prototype.$i18nMsg = function(){  
    return i18n.messages[i18n.locale]  
}
let theme = wx.getStorageSync('theme') || 'default'
const themei18n = new VueI18n({
	locale:theme,
	messages:themeColors
})
Vue.prototype.$themei18n= themei18n
Vue.prototype.$themei18nOption = function(){  
    return themei18n.messages[themei18n.locale]
}
Vue.prototype.$uniUtilsApi =utils;
Vue.prototype.$uniBaseURL = 'https://core.ztn-tech.com';
Vue.prototype.$uniBaseRequest = baseRequest
Vue.prototype.$md5 = md5;
Vue.prototype.$error = error
// 注册全局组件
Vue.component('cu-custom',cuCustom)
Vue.component('mescroll-body', MescrollBody)
App.mpType = 'app'

const app = new Vue({
	i18n,
	...App
})
app.$mount()
