<template>
	<view>
		<defaultInfoComponent v-if="isShow && !isShowCustom" :deviceCore="deviceCore" :isToHome="isToHome" :settingName="settingName" :command="command"
		 :setting="setting" :value="value" :port="port" :childPort="childPort"></defaultInfoComponent>
		<customInfoComponent v-if="isShow && isShowCustom" :deviceCore="deviceCore" :isToHome="isToHome" :settingName="settingName" :command="command"
		 :setting="setting" :value="value" :port="port" :childPort="childPort"></customInfoComponent>
	</view>
</template>

<script>
	import {
		customDeviceInfoCompanyIdArr
	} from '@/common/utils/config/config.js'
	import defaultInfoComponent from '@/pages/deviceInfo/component/defaultInfo.vue'
	import customInfoComponent from '@/pages/deviceInfo/component/customInfo.vue'
	export default {
		data() {
			return {
				isToHome: false,
				fromLoginBack: false,
				isShow: false,
				isShowCustom: false,
				deviceCore: '',
				settingName: '',
				command: '',
				setting: '',
				value: '',
				port: '',
				childPort: '',
			}
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.initOption = option
			isLogin ? this.init(option) : uni.navigateTo({
				url: '/pages/login/login'
			})
			this.infoComponent()
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let initOption = this.initOption
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(initOption), this.fromLoginBack = false)
		},
		methods: {
			init: function(option) {
				this.isShow = true
				let q = decodeURIComponent(option.q);
				if (option.deviceCore) {
					this.deviceCore = option.deviceCore
					this.settingName = option.settingName
					this.command = `${option.function}`
					this.setting = option.setting
					this.value = option.value
					this.port = option.port
					this.childPort = option.childPort
				} else if (typeof(q) != 'undefined') {
					this.deviceCore = this.getQueryString(q, 'deviceCore')
					this.settingName = this.getQueryString(q, 'settingName')
					this.command = this.getQueryString(q, 'function')
					this.setting = this.getQueryString(q, 'setting')
					this.value = this.getQueryString(q, 'value')
					this.port = this.getQueryString(q, 'port')
					this.childPort = this.getQueryString(q, 'childPort')
				} else {
					this.$uniUtilsApi.showToast(this.i18n.deviceInfo.entryError, 'none', 1000, false) //入口出错
				}
			},
			infoComponent:function(){
				let companyId = uni.getStorageSync('companyId')
				this.isShowCustom = customDeviceInfoCompanyIdArr.indexOf(companyId) === -1 ? false : true
			},
			getQueryString: function(url, name) {
				let reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
				let r = url.substr(1).match(reg)
				if (r != null) {
					return r[2]
				}
				return null;
			},
		},
		components: {
			defaultInfoComponent,
			customInfoComponent
		},
	}
</script>

<style>
</style>
