<template>
	<view>
		<view  v-if="pageCur=='deviceInfo' && isLogin" >
			<defaultInfoComponent v-if="!isShowCustom" ref="deviceInfo"  :deviceCore="deviceCore"
			 :tabbarHeight="tabbarHeight" :isToHome="isToHome" :settingName="settingName" :command="command" :setting="setting"
			 :value="value" :port="port" :childPort="childPort"></defaultInfoComponent>
			<customInfoComponent v-if="isShowCustom" ref="deviceInfo"  :deviceCore="deviceCore"
			 :tabbarHeight="tabbarHeight" :isToHome="isToHome" :settingName="settingName" :command="command" :setting="setting"
			 :value="value" :port="port" :childPort="childPort"></customInfoComponent>
		</view>
		<paramComponent v-if="pageCur=='deviceParam' && isLogin" ref="deviceParam" :deviceCore="deviceCore" :deviceName="deviceName"
		 :tabbarHeight="tabbarHeight" :isToHome="isToHome"></paramComponent>
		<sensorComponent v-if="pageCur=='deviceSensor' && isLogin" ref="deviceSensor" :deviceCore="deviceCore" :deviceName="deviceName"
		 :tabbarHeight="tabbarHeight" :isToHome="isToHome"></sensorComponent>
		<controllerComponent v-if="pageCur=='deviceController' && isLogin" ref="deviceController" :deviceCore="deviceCore"
		 :deviceName="deviceName" :tabbarHeight="tabbarHeight" :isToHome="isToHome"></controllerComponent>
		<tabbar :tabbarList='tabbarList' :pageCur='pageCur' v-on:navChange="navChange" v-on:getTabbarHeight="getTabbarHeight"></tabbar>
	</view>
</template>

<script>
	import {
		customDeviceInfoCompanyIdArr
	} from '@/common/utils/config/config.js'
	import tabbar from '@/components/ztn-custom/tabbar/tabbar.vue'
	import defaultInfoComponent from '@/pages/deviceInfo/component/defaultInfo.vue'
	import customInfoComponent from '@/pages/deviceInfo/component/customInfo.vue'
	import paramComponent from '@/pages/deviceParam/deviceParam.vue'
	import sensorComponent from '@/pages/deviceSensor/deviceSensor.vue'
	import controllerComponent from '@/pages/deviceController/deviceController.vue'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isLogin: false,
				isToHome: false,
				fromLoginBack: false,
				pageCur: 'deviceInfo',
				isShowCustom: false,
				tabbarList: [],
				tabbarHeight: '',
				deviceCore: '',
				deviceName: '',
				settingName: '',
				command: '',
				setting: '',
				value: '',
				port: '',
				childPort: '',
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.isLogin = isLogin
			!isLogin && uni.navigateTo({
				url: '/pages/login/login'
			})
			this.infoComponent()
			this.init(option)
			this.initTabbar()
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			if (fromLoginBack) {
				let pageCur = this.pageCur
				this.pageCur = ''
				this.$nextTick(() => {
					this.pageCur = pageCur
					this.fromLoginBack = false
					this.isLogin = true
				})
			}
		},
		methods: {
			infoComponent:function(){
				let companyId = uni.getStorageSync('companyId')
				this.isShowCustom = customDeviceInfoCompanyIdArr.indexOf(companyId) === -1 ? false : true
			},
			initTabbar: function() {
				this.tabbarList = [{
						tabbar: 'deviceInfo',
						tabbarName: this.i18n.deviceNavigation.deviceInfo,
						tabbarCuIcon: 'cuIcon-newsfill'
					},
					{
						tabbar: 'deviceParam',
						tabbarName: this.i18n.deviceNavigation.deviceParam,
						tabbarCuIcon: 'cuIcon-btn'
					},
					{
						tabbar: 'deviceSensor',
						tabbarName: this.i18n.deviceNavigation.deviceSensor,
						tabbarCuIcon: 'cuIcon-rankfill'
					},
					{
						tabbar: 'deviceController',
						tabbarName: this.i18n.deviceNavigation.deviceController,
						tabbarCuIcon: 'cuIcon-settingsfill'
					},
				]
			},
			init: function(option) {
				let {
					pageCur,
					deviceCore,
					deviceName,
					settingName,
					command,
					setting,
					value,
					port,
					childPort
				} = option
				this.pageCur = pageCur || 'deviceInfo'
				this.deviceCore = deviceCore
				this.deviceName = deviceName
				this.settingName = settingName
				this.command = command
				this.setting = setting
				this.value = value
				this.port = port
				this.childPort = childPort
			},
			getTabbarHeight: function(tabbarHeight) {
				this.tabbarHeight = tabbarHeight
			},
			navChange: function(pageCur) {
				let lastPageCur = this.pageCur
				if (lastPageCur !== pageCur) {
					this.pageCur = pageCur
				} else {
					this.$uniUtilsApi.showToast(this.i18n.refreshSuccess, 'none', 1000, false)
					this.$refs[`${pageCur}`].init()
				}
			},
		},
		components: {
			defaultInfoComponent,
			customInfoComponent,
			paramComponent,
			sensorComponent,
			controllerComponent,
			tabbar,
		},
		onShareAppMessage: function(res) {
			let pageCur = this.pageCur
			let deviceName = this.deviceName
			let deviceCore = this.deviceCore
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: deviceName ? `${nickName}${this.i18n.moreOperate.share}${deviceName}` : `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&&deviceCore=${deviceCore}&&pageCur=${pageCur}`,
			}
		}
	}
</script>


<style>
	page {
		background-color: #f8f8f8;
	}
</style>

