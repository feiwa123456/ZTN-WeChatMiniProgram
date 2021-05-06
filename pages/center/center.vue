<template>
	<view style="background-color: #f8f8f8;height:100vh">
		<cu-custom :isBack="false"></cu-custom>
		<view class="bg-white padding-top">
			<view class="flex justify-end padding-top-xs padding-lr-xl" @tap="isLogin ? tapCurrentVersion() : unLogin()">
				<view class="action">
					<text class="cuIcon-info text-grey" style="font-size:36upx;"></text>
				</view>
			</view>
			<view class="content">
				<view class="padding-bottom">
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="isLogin" class="cu-avatar xl round margin-left bg-gray" :style="[{backgroundImage:`url(${avatarUrl})`}]">
					</view>
					<view v-else class="cu-avatar xl round margin-left bg-gray">
						<text class="cuIcon-people text-sl text-white"></text>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<view class="cu-avatar xl round margin-left bg-gray"><text class="cuIcon-people text-sl text-white"></text></view>
					<!-- #endif -->
					<view v-if="isLogin" class="cu-btn round lines-grey shadow margin-left">{{userName}}</view>
					<button v-else class="cu-btn round lines-grey shadow margin-left" @tap="goToLogin">{{i18n.login.login}}</button>
				</view>
			</view>
			<view class="cu-list grid col-4 no-border text-black" style="background:rgba(0,0,0,0);padding:20upx 0upx;">
				<view class="cu-item" v-for="(item,index) in deviceStatusList" :key="index">
					<view class="text-lg padding-xs">{{item.num}}</view>
					<view style="color:#666666">{{i18n.status[index]}}</view>
				</view>
			</view>
		</view>

		<view class="shadow-warp bg-white" style="border-radius:20upx;margin-top:65upx;">
			<view class="cu-bar bg-white solid-bottom" style="border-top-left-radius:20upx;border-top-right-radius:20upx;" @tap="isLogin ? moreOperate() : unLogin()">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.moreOperate.moreOperate}}</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-list grid col-4 no-border" style="background:rgba(0,0,0,0)">
				<view class="cu-item" style="margin:-10upx 0" @tap="isLogin ? deviceNotice() : unLogin()">
					<view class="cuIcon-noticefill text-xxl text-olive">
					</view>
					<view class="padding-xs">{{i18n.moreOperate.notice}}</view>
				</view>
				<view class="cu-item" style="margin:-10upx 0" @tap="isLogin ? tapScan() : unLogin()">
					<view class="cuIcon-scan text-xxl text-blue"></view>
					<view class="padding-xs">{{i18n.moreOperate.scan}}</view>
				</view>
				<view class="cu-item" style="margin:-10upx 0" @tap="isLogin ? deviceError() : unLogin()">
					<view class="cuIcon-warnfill text-xxl text-orange"></view>
					<view class="padding-xs">{{i18n.moreOperate.warn}}</view>
				</view>
				<view class="cu-item" style="margin:-10upx 0" @tap="isLogin ? deviceStatus() : unLogin()">
					<view class="cuIcon-order text-xxl text-yellow"></view>
					<view class="padding-xs">{{i18n.moreOperate.upperAndlowerLine}}</view>
				</view>
			</view>
		</view>
		<!--  @tap="isLogin ? moreSetting() : unLogin()" -->
		<!-- shadow -->
		<view class="shadow-warp bg-white" style="border-radius:20upx;margin-top:65upx;">
			<view class="cu-bar bg-white solid-bottom" style="border-top-left-radius:20upx;border-top-right-radius:20upx;" @tap="isLogin ? more() : unLogin()">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.moreSetting.moreSetting}}</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-list grid col-4 no-border" style="background:rgba(0,0,0,0) ">
				<view class="cu-item" style="margin:-10upx 0" @tap="isLogin ? pushMessage() : unLogin()">
					<view class="cuIcon-pullup text-xxl text-olive"></view>
					<view class="padding-xs">{{i18n.moreSetting.pushMessage}}</view>
					<view class="text-gray text-sm" v-if="isLogin">{{i18n.moreSetting.messageList[currentMessageIndex]}}</view>
				</view>
				<view class="cu-item" style="margin:-10upx 0">
					<picker @change="languagePickerChange" :value="currentLanguageIndex" :range="i18n.moreSetting.languageList">
						<view class="cuIcon-settings text-xxl text-blue"></view>
						<view class="padding-xs">{{i18n.moreSetting.language}}</view>
						<view class="text-gray text-sm" v-if="isLogin">{{i18n.moreSetting.languageList[currentLanguageIndex]}}</view>
					</picker>
				</view>
				<view class="cu-item" style="margin:-10upx 0">
					<picker @change="themePickerChange" :value="currentThemeIndex" :range="i18n.moreSetting.themeList">
						<view class="cuIcon-magic text-xxl text-orange"></view>
						<view class="padding-xs">{{i18n.moreSetting.theme}}</view>
						<view class="text-gray text-sm" v-if="isLogin">{{i18n.moreSetting.themeList[currentThemeIndex]}}</view>
					</picker>
				</view>
				<view v-if="isLogin" class="cu-item" @tap="tapLogout" style="margin:-10upx 0">
					<view class="cuIcon-exit text-xxl text-yellow"></view>
					<view class="padding-xs">{{i18n.moreSetting.logout}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
	import * as deviceInfoApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceInfoApi/deviceInfoApi.js'
	import * as deviceBelongApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceBelongApi/deviceBelongApi.js'
	import * as tokenApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/tokenApi/tokenApi.js'
	import messages from '@/common/utils/messages/messages.js'
	export default {
		data() {
			return {
				isLogin: false,
				isLoginOverdue: false,
				userName: '',
				avatarUrl: '',
				deviceStatusList: [{},{},{},{}],
				deviceStatusNumberList: [0, 0, 0, 0],
				currentMessageIndex: 0,
				currentLanguageIndex: 0,
				currentThemeIndex: 0,
				openMessage: false,
			}
		},
		name: 'centerComponent',
		computed: {
			i18n() {
				return this.$i18nMsg()
			},
			themei18n() {
				return this.$themei18nOption()
			}
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin')
			this.isLogin = isLogin
			isLogin ? this.init() : this.getUnLoginDeviceStatusCount()
		},
		methods: {
			init: async function() {
				this.getDeviceStatusCount()
				this.userName = uni.getStorageSync('userName')
				// #ifdef MP-WEIXIN
				this.avatarUrl = uni.getStorageSync('avatarUrl')
				// #endif
				this.openMessage = uni.getStorageSync('openMessage') || false
				this.currentMessageIndex = uni.getStorageSync('messageIndex') || 0
				this.currentThemeIndex = uni.getStorageSync('themeIndex') || 0
				this.currentLanguageIndex = uni.getStorageSync('languageIndex') || 0
			},
			goToLogin: function(e) {
				uni.navigateTo({
					url: `/pages/login/login`
				});
			},
			getUnLoginDeviceStatusCount: function() {
				let deviceStatusList = this.deviceStatusList
				for (let i = 0; i < deviceStatusList.length; i++) {
					this.$set(this.deviceStatusList, i, {
						num: '--',
						status: this.i18n.status[i]
					})
				}
			},
			getDeviceStatusCount: function() {
				deviceBelongApi.getDeviceStatusCount(this).then((res) => {
					if (res.code == '200') {
						let data = res.data
						for (let i = 0; i < data.length; i++) {
							let num = data[i].num
							switch (data[i].status) {
								case 'ONLINE':
									this.$set(this.deviceStatusNumberList, 0, num)
									break;
								case 'OFFLINE':
									this.$set(this.deviceStatusNumberList, 1, num)
									break;
								case 'UNACTIVE':
									this.$set(this.deviceStatusNumberList, 2, num)
									break;
								case 'DISABLE':
									this.$set(this.deviceStatusNumberList, 3, num)
									break;
								default:
									break;
							}
						}
						let j = 0
						let deviceStatusList = this.deviceStatusList
						let deviceStatusNumberList = this.deviceStatusNumberList
						let numDH = () => {
							if (j < 20) {
								setTimeout(() => {
									for (let i = 0; i < deviceStatusList.length; i++) {
										this.$set(this.deviceStatusList, i, {
											num: this.deviceStatusNumberList[i] === 0 ? 0 : j,
											status: this.i18n.status[i]
										})
									}
									j++
									numDH()
								}, 10)
							} else {
								for (let i = 0; i < deviceStatusList.length; i++) {
									this.$set(this.deviceStatusList, i, {
										num: this.deviceStatusNumberList[i],
										status: this.i18n.status[i]
									})
								}
							}
						}
						numDH()
					}
				})
			},
			tapCurrentVersion: function() {
				let currentVersion = this.i18n.currentVersion
				let browserVersion = wx.getStorageSync('browserVersion') || '1.1.24'
				let confirmText = this.i18n.confirm
				let cancelText = this.i18n.cancel
				this.$uniUtilsApi.showModal(currentVersion, browserVersion, false, confirmText, cancelText, (res) => {
					return
				})
			},
			moreOperate: function() {
				uni.navigateTo({
					url: `/pages/moreOperate/moreOperate`
				})
			},
			deviceNotice: function() {
				uni.navigateTo({
					url: `/pages/deviceNotice/deviceNotice`
				})
			},
			tapScan: function() {
				// #ifdef H5
				this.$uniUtilsApi.showToast(this.i18n.noSupport, 'none', 1000, false)
				// #endif
				// #ifdef MP-WEIXIN || APP-PLUS
				this.$uniUtilsApi.handleScan(this)
				// #endif
			},
			deviceError: function() {
				uni.navigateTo({
					url: `/pages/deviceError/deviceError`
				})
			},
			deviceStatus: function() {
				uni.navigateTo({
					url: `/pages/deviceStatus/deviceStatus`
				})
			},
			moreSetting: function() {
				uni.navigateTo({
					url: `/pages/moreSetting/moreSetting`
				})
			},
			pushMessage: function() {
				let openMessage = !this.openMessage
				if (openMessage) {
					let openMessageTxt = this.i18n.openMessage
					this.$uniUtilsApi.bindUserSocket(openMessageTxt)
				} else {
					let closeMessageTxt = this.i18n.closeMessage
					this.$uniUtilsApi.unBindUserSocket(closeMessageTxt)
				}
				this.openMessage = openMessage
				this.currentMessageIndex = openMessage ? 1 : 0
				uni.setStorageSync('openMessage', openMessage)
				uni.setStorageSync('messageIndex', this.currentMessageIndex)
			},
			languagePickerChange: function(e) {
				let isLogin = this.isLogin
				let languageIndex = parseInt(e.detail.value)
				let language = languageIndex == 0 ? 'zh' : 'en'
				if (isLogin) {
					let userId = wx.getStorageSync('userId')
					userApi.updateLanguage(this, language, userId).then((res) => {
						if (res.code == '200') {
							this.currentLanguageIndex = languageIndex
							this.$i18n.locale = language
							this.$emit('languageChange')
							uni.setStorageSync('language', language)
							uni.setStorageSync('languageIndex', languageIndex)
							this.$uniUtilsApi.showToast(this.i18n.changeLanguage, 'none', 1000, false)
						}
					})
				} else {
					this.$i18n.locale = language
					this.$emit('languageChange')
					this.$uniUtilsApi.showToast(this.i18n.changeLanguage, 'none', 1000, false)
				}
			},
			themePickerChange: function(e) {
				let isLogin = this.isLogin
				if (isLogin) {
					let index = e.detail.value
					let themeList = ['default', 'darkColor', 'lightColor']
					let theme = themeList[index]
					this.currentThemeIndex = index
					this.$themei18n.locale = theme
					uni.setStorageSync('theme', theme)
					uni.setStorageSync('themeIndex', index)
					this.$emit('themeChange')
					this.$uniUtilsApi.showToast(this.i18n.changeTheme, 'none', 1000, false)
				} else {
					this.unLogin()
				}
			},
			tapLogout: function() {
				let logout = this.i18n.moreSetting.logout
				let logoutContent = this.i18n.moreSetting.logoutContent
				let confirmText = this.i18n.confirm
				let cancelText = this.i18n.cancel
				this.$uniUtilsApi.showModal(logout, logoutContent, true, confirmText, cancelText, (res) => {
					let openid = uni.getStorageSync('openid')
					let promise;
					//#ifdef MP-WEIXIN
					promise = userApi.loginOut(this, {
						openid: openid,
						type: 'wxAPP'
					})
					//#endif
					// #ifdef H5
					promise = userApi.loginOut(this, {
						openid: openid,
						type: 'gzh'
					})
					// #endif
					// #ifdef APP-PLUS
					promise = tokenApi.loginOut(this, {})
					// #endif
					promise.then((res) => {
						if (res.status) {
							let openMessage = uni.getStorageSync('openMessage') || false
							let closeMessageTxt = this.i18n.closeMessage
							if(openMessage) this.$uniUtilsApi.unBindUserSocket(closeMessageTxt)
							// #ifdef APP-PLUS
							uni.removeStorageSync('password')
							// #endif
							// #ifdef H5 || MP-WEIXIN
							uni.removeStorageSync('openid')
							// #endif
							uni.removeStorageSync('nickName')
							uni.removeStorageSync('avatarUrl')
							uni.removeStorageSync('userId')
							uni.removeStorageSync('userName')
							uni.removeStorageSync('devKey')
							uni.removeStorageSync('accessToken')
							uni.removeStorageSync('singleLogin')
							uni.setStorageSync('isLogin', false)
							this.isLogin = false
							if(openMessage) this.$uniUtilsApi.closeSocket()
							this.$uniUtilsApi.showToast(this.i18n.logoutSuccess, 'success', 1000, false)
							this.$emit('unLogin')
							this.getUnLoginDeviceStatusCount()
						}
					})
				}, (res) => {
					return
				})
			},
			unLogin: function() {
				this.$uniUtilsApi.showToast(this.i18n.leadGotoLogin.unLogStatuTxt, 'none', 1000, false)
			},
			more: function() {
				this.$uniUtilsApi.showToast(this.i18n.noSupport, 'none', 1000, false)
			}
		}
	}
</script>
<style>
</style>
