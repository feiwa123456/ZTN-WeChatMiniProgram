<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true" :bgColor="emphasizeColor" :textColor="commonColor">
		</cu-custom>
		<cu-custom v-else :isBack="true" :bgColor="emphasizeColor" :textColor="commonColor">
		</cu-custom>

		<view :style="[{paddingBottom:`calc(${tabbarHeight}px + ${CustomBar}px)`,background:commonColor}]">
			<view :style="[{background:emphasizeColor}]">
				<view class="padding-top-xs padding-bottom padding-lr" :style="[{color:commonColor}]">
					<view class="flex justify-between">
						<view class="flex justify-content align-center">
							<input style="width: 300upx" class="text-xxl" :value="deviceName" :focus="focusDeviceName" @input='changeDeviceNameInput'></input>
							<view :class="[isChangeDeviceName && changeDeviceName != deviceName ? 'cuIcon-roundcheckfill' : 'cuIcon-writefill']"
							 class="text-xxl margin-left-xs" style="font-size: 44upx;" @tap="isChangeDeviceName && changeDeviceName != deviceName ? updateInfo() : getFocus()"></view>
						</view>
						<view class="flex justify-content align-center">
							<circleComponent class="margin-left" :circleWidth="75" :circleHeight="75" :circleBgColor="'#ffffff'"
							 :circleBorder="''">
								<text class="text-xs" :style="[{color:emphasizeColor}]">{{isSell}}</text>
							</circleComponent>
							<circleComponent class="margin-left" :circleWidth="75" :circleHeight="75" :circleBgColor="'#ffffff'"
							 :circleBorder="''">
								<signal :connectType="connectType" :netSignal="netSignal"></signal>
							</circleComponent>
							<circleComponent class="margin-left" :circleWidth="75" :circleHeight="75" :circleBgColor="'#ffffff'"
							 :circleBorder="''">
								<solidColorSurplus :status="status" :charging="charging" :powerType="powerType" :surplus="surplus"></solidColorSurplus>
							</circleComponent>
						</view>
					</view>
					<view class="flex justify-start align-center padding-top">
						<view class="text-sm" @longpress="copyDeviceCore">
							{{i18n.deviceInfo.deviceCode}}：{{deviceCore}}
						</view>
						<view class="cuIcon-copy margin-lr-xs" style="font-size: 42upx;" @tap="copyDeviceCore"></view>
						<view class="text-sm flex-sub">{{i18n.deviceInfo.internetCardNumber}}：<text class="text-cut">{{phoneNumber}}</text></view>
					</view>
					<view class="flex justify-start align-center padding-top">
						<view class="text-sm basis-sm">{{i18n.deviceInfo.productType}}：{{product}}</view>
						<view class="text-sm basis-df">{{i18n.deviceInfo.productSeries}}：{{series}}</view>
					</view>
					<view class="text-sm padding-top">{{i18n.deviceInfo.deviceAddress}}：{{address}}</view>
					<view class="text-sm padding-top">{{i18n.deviceInfo.belongToCompany}}：{{companyName}}</view>
					<view class="flex justify-between align-center padding-top">
						<view class="flex-sub text-cut margin-right">
							<view class="text-sm">{{i18n.deviceInfo.hardwareVersion}}</view>
							<view class="text-xl padding-top-sm">{{hardVersion}}</view>
						</view>
						<view class="flex-sub text-cut margin-right">
							<view class="text-sm">{{i18n.deviceInfo.softwareVersion}}</view>
							<view class="text-xl padding-top-sm">{{softVersion}}</view>
						</view>
						<view class="flex-sub text-cut margin-right">
							<view class="text-sm">{{i18n.deviceInfo.offlineCount}}</view>
							<view class="text-xl padding-top-sm">{{offLineNum}}</view>
						</view>
						<view class="flex-sub text-cut">
							<view class="text-sm">{{i18n.deviceInfo.deviceInfoStatu}}</view>
							<view class="text-xl padding-top-sm">{{deviceStatu}}</view>
						</view>
					</view>
				</view>
			</view>
			<view :style="[{background:commonColor}]" class="margin-top-sm">
				<view class="flex justify-between align-center text-center">
					<view class="flex-sub margin-sm padding-tb" style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius: 10upx;"
					 @tap="refreshStatus">
						<view class="cuIcon-refresh" :style="[{color:emphasizeColor}]" style="font-size: 44upx;"></view>
						<view class="padding-top-xs" style="color:#666666">{{i18n.deviceInfo.refresh}}</view>
					</view>
					<view class="flex-sub margin-sm padding-tb" style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius: 10upx;"
					 @tap="deviceStatus">
						<view class="cuIcon-order" :style="[{color:emphasizeColor}]" style="font-size: 44upx;"></view>
						<view class="padding-top-xs" style="color:#666666">{{i18n.deviceInfo.upperAndlowerLine}}</view>
					</view>
					<view class="flex-sub margin-sm padding-tb" style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius: 10upx;"
					 @tap="deviceError">
						<view class="cuIcon-warn" :style="[{color:emphasizeColor}]" style="font-size: 44upx;"></view>
						<view class="padding-top-xs" style="color:#666666">{{i18n.deviceInfo.warn}}</view>
					</view>
					<view class="flex-sub margin-sm padding-tb" style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius: 10upx;"
					 @tap="deviceLocal">
						<view class="cuIcon-location" :style="[{color:emphasizeColor}]" style="font-size: 44upx;"></view>
						<view class="padding-top-xs" style="color:#666666">{{i18n.deviceInfo.Location}}</view>
					</view>
				</view>
			</view>

			<view :style="[{background:commonColor}]">
				<view class="cu-bar margin-left-sm margin-top-sm">
					<view class="action">
						<text class="cuIcon-form" style="font-size: 32upx;color:#666666;"><text class="margin-left-sm">{{i18n.deviceInfo.info}}</text></text>
					</view>
				</view>
				<view class="margin-left-lg" style="color:#666666">
					<view class="margin-bottom-xs">{{i18n.deviceInfo.deviceIP}}：{{serverAddress}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.deviceID}}：{{deviceKey}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.deviceKey}}：{{deviceSecret}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.equipmentInformation}}：{{remark}}</view>
				</view>
				<view class="cu-bar margin-left-sm margin-top-sm">
					<view class="action">
						<text class="cuIcon-time" style="font-size: 32upx;color:#666666;"><text class="margin-left-sm">{{i18n.deviceInfo.time}}</text></text>
					</view>
				</view>
				<view class="margin-left-lg" style="color:#666666;">
					<view class="margin-bottom-xs">{{i18n.deviceInfo.offlineTime}}：{{lastOffLineTimer}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.onlineTime}}：{{lastOnLineTimer}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.dateCreated}}：{{createdDate}}</view>
					<view class="margin-bottom-xs">{{i18n.deviceInfo.salesTime}}：{{sellTime}}</view>
				</view>
			</view>

			<view class="cu-modal bottom-modal" :class="[showErrorModal?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white">
						<view class="action text-red" @tap="hideErrorModal">{{i18n.close}}</view>
					</view>
					<view class="padding-xl">
						{{settingError}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import solidColorSurplus from '@/components/ztn-custom/surplus/solidColorSurplus.vue'
	import signal from '@/components/ztn-custom/signal/signal.vue'
	import circleComponent from '@/components/ztn-custom/circleComponent/circleComponent.vue'
	import * as formatTime from '@/common/utils/filter/formatTime/formatTime.js'
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
				status: '',
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
				companyName: '',
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
				focusDeviceName: false,
				changeDeviceName: '',
				isChangeDeviceName: false,
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
							this.$uniUtilsApi.showToast(this.i18n.setSuccess, 'none', 1000, false)
						}
					})
				}, (res) => {
					return
				})
			},
			hideErrorModal: function() {
				this.showErrorModal = false
			},
			refreshStatus: function() {
				this.$uniUtilsApi.showLoading(this.i18n.loading, false)
				let deviceCore = this.deviceCore
				deviceInfoApi.refreshStatus(this, deviceCore).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let deviceStatu = this.$uniUtilsApi.handleDeviceStatus(this.i18n.status, data.status).deviceStatu
						this.status = data.status || null
						this.deviceStatu = deviceStatu || null
						this.$uniUtilsApi.hideLoading()
						this.$uniUtilsApi.showToast(this.i18n.refreshSuccess, 'none', 1000, true)
					} else {
						this.$uniUtilsApi.hideLoading()
						this.$uniUtilsApi.showToast(this.i18n.refreshFail, 'none', 1000, true)
					}
				})
			},
			deviceStatus: function() {
				let deviceName = this.deviceName
				let deviceCore = this.deviceCore
				uni.navigateTo({
					url: `/pages/deviceStatus/deviceStatus?deviceName=${deviceName}&deviceCore=${deviceCore}`
				})
			},
			deviceError: function() {
				let deviceName = this.deviceName
				let deviceCore = this.deviceCore
				uni.navigateTo({
					url: `/pages/deviceError/deviceError?deviceName=${deviceName}&deviceCore=${deviceCore}`
				})
			},
			deviceLocal: function() {
				let deviceName = this.deviceName
				let deviceCore = this.deviceCore
				uni.navigateTo({
					url: `/pages/deviceLocal/deviceLocal?deviceName=${deviceName}&deviceCore=${deviceCore}`,
				})
			},
			getFocus: function() {
				this.focusDeviceName = true
			},
			changeDeviceNameInput: function(e) {
				this.isChangeDeviceName = true
				this.changeDeviceName = e.detail.value
			},
			updateInfo: function(e) {
				let deviceCore = this.deviceCore
				let deviceName = this.changeDeviceName
				if (deviceName == '') {
					this.$uniUtilsApi.showToast(this.i18n.currentEmpty, 'none', 1000, false)
					return
				}
				let params = {
					deviceCore: deviceCore,
					deviceName: deviceName
				}
				deviceInfoApi.updateDeviceInfo(this, params).then((res) => {
					if (res.code == '200') {
						this.deviceName = deviceName
						this.focusDeviceName = false
						this.isChangeDeviceName = false
						this.changeDeviceName = ''
						this.$uniUtilsApi.showToast(this.i18n.updateSuccess, 'none', 1000, false)
					}
				})
			},
			copyDeviceCore: function() {
				let deviceCore = this.deviceCore
				this.$uniUtilsApi.copy(this, deviceCore)
			},
		},
		components: {
			circleComponent,
			signal,
			solidColorSurplus,
		}
	}
</script>
