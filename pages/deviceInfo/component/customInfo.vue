<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true" :bgColor="emphasizeColor" :textColor="commonColor">
		</cu-custom>
		<cu-custom v-else :isBack="true" :bgColor="emphasizeColor" :textColor="commonColor">
		</cu-custom>
		<view>customInfo</view>
	</view>
</template>

<script>
	import * as deviceInfoApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceInfoApi/deviceInfoApi.js'
	import * as deviceControllerApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceControllerApi/deviceControllerApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isLoginOverdue: false,
				emphasizeColor: '#ffffff',
				commonColor: '#ffffff',
				uniInterface: '',
				deviceName: '',
				status:'',
				deviceStatu: '',
				charging: '',
				surplus: '',
				powerType: '',
				netSignal: '',
				connectType: '',
				phoneNumber: '',
				product: '',
				series: '',
				address: '',
				hardVersion: '',
				softVersion: '',
				offLineNum: '',
				serverAddress: '',
				deviceKey: '',
				deviceSecret: '',
				remark: '',
				lastOffLineTimer: '',
				lastOnLineTimer: '',
				createdDate: '',
				sellTime: '',
				isSell: '',
				showErrorModal: false,
				settingError: '',
				
			}
		},
		props: {
			deviceCore: {
				type: String,
				default: ''
			},
			tabbarHeight: {
				type: [Number, String],
				default: 0
			},
			settingName: {
				type: String,
				default: ''
			},
			command: {
				type: [Number, String],
			},
			value: {
				type: [Number, String],
			},
			setting: {
				type: [Number, String],
			},
			port: {
				type: [Number, String],
			},
			childPort: {
				type: [Number, String],
			},
			isToHome: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			},
			themei18n() {
				return this.$themei18nOption()
			}
		},
		beforeMount: function() {
			let {
				emphasizeColor,
				commonColor,
			} = this.themei18n
			this.emphasizeColor = emphasizeColor
			this.commonColor = commonColor
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin && this.init()
		},
		methods: {
			init: function() {
				let deviceCore = this.deviceCore
				let promise = this.$uniUtilsApi.getDeviceInfo(this, deviceCore)
				promise.then((res) => {
					this.command == 'setting' && this.executeCommand()
				})
			},
			executeCommand: function() {
				let settingName = this.settingName
				let command = this.i18n.deviceInfo.command
				let isExecuteCommand = `${this.i18n.deviceInfo.isExecute}${settingName}${command}`
				let confirmText = this.i18n.confirm
				let cancelText = this.i18n.cancel
				this.$uniUtilsApi.showModal(command, isExecuteCommand, true, confirmText, cancelText, (res) => {
					let deviceCore = this.deviceCore
					let value = this.value
					let setting = this.setting
					let port = this.port
					let childPort = this.childPort
					deviceControllerApi.saveSetting(this, deviceCore, value, setting, port, childPort).then((res) => {
						if (res.code == '200') {
							this.$uniUtilsApi.showToast(this.i18n.setSuccess, 'none', 1000, true)
						}
					})
				}, (res) => {
					return
				})
			},
			hideErrorModal: function() {
				this.showErrorModal = false
			}
		},
		components: {
		}
	}
</script>
