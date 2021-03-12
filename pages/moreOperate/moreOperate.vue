<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{i18n.moreOperate.moreOperate}}</block>
		</cu-custom>

		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{i18n.moreOperate.moreOperate}}</block>
		</cu-custom>

		<view class="bg-white" style="margin-top:45upx;">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.moreOperate.convenientOperate}}</text>
				</view>
			</view>
			<view class="cu-list grid col-4 no-border" style="background:rgba(0,0,0,0) ">
				<view class="cu-item" style="margin:-10upx 0">
					<button class="custom-button" @tap="tapScan">
						<view class="cuIcon-scan text-blue" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.moreOperate.scan}}</view>
					</button>
				</view>
				<view class="cu-item" style="margin:-10upx 0">
					<button class="custom-button" open-type="share">
						<view class="cuIcon-share text-olive" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.moreOperate.share}}</view>
					</button>
				</view>
				<view class="cu-item" style="margin:-10upx 0">
					<button class="custom-button" @tap="bindDeviceModal">
						<view class="cuIcon-add text-orange" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.bindDevice}}</view>
					</button>
				</view>
				<view class="cu-item" style="margin:-10upx 0" >
					<button class="custom-button" @tap="modifyModal">
						<view class="cuIcon-post text-yellow" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.moreOperate.modifyPassword}}</view>
					</button>
				</view>
			</view>
		</view>
		
		<view class="bg-white" style="margin-top:45upx;">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.moreOperate.infoManage}}</text>
				</view>
			</view>
			<view class="cu-list grid col-4 no-border" style="background:rgba(0,0,0,0) ">
				<view class="cu-item" style="margin:-10upx 0">
					<button class="custom-button" @tap="deviceCamera">
						<view class="cuIcon-recordfill text-xxl text-blue" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.moreOperate.cameraManager}}</view>
					</button>
				</view>
				<view class="cu-item" style="margin:-10upx 0">
					<button class="custom-button" open-type="openSetting">
						<view class="cuIcon-safe text-xxl text-olive" style="font-size: 54upx;">
						</view>
						<view class="padding-sm" style="font-size:28rpx;color:#666666">{{i18n.authorize}}</view>
					</button>
				</view>
			</view>
		</view>

		<view class="bg-white" style="margin-top:45upx;" v-if="webViewList.length != 0">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.moreOperate.companyWebPage}} </text>
				</view>
			</view>
			<view>
				<view class="cu-bar bg-white solid-bottom" @tap="tapWebView(item)" v-for="(item,index) in webViewList" :key="index">
					<view class="action">
						{{item.title}}
					</view>
					<view class="action">
						<view class="cuIcon-right"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="[isShowBindDeviceModal?'show':'']" style="text-align: start">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white">
					<view class="action text-bold">
						{{i18n.bindDevice}}
					</view>
					<view class='action text-bold'>
						<view class="cuIcon-close text-grey" @tap="bindDeviceModal"></view>
					</view>
				</view>
				<form @submit='bindDevice'>
					<view class="cu-form-group" style="border-bottom: 1upx solid #eee;">
						<view class="title">{{i18n.deviceCore}}</view>
						<input type="text" :placeholder="i18n.inputDeviceCore" placeholderStyle='color:#aaaaaa;letter-spacing:2px'
						 name="deviceCore"></input>
					</view>
					<button class="cu-btn block line-grey margin lg" form-type="submit">{{i18n.confirm}}</button>
				</form>
			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="[isShowModifyModal?'show':'']" style="text-align: start">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white">
					<view class="action text-bold">
						{{i18n.moreOperate.modifyPassword}}
					</view>
					<view class='action text-bold'>
						<view class="cuIcon-close text-grey" @tap="modifyModal"></view>
					</view>
				</view>
				<form>
					<view class="cu-form-group">
						<view class="title">{{i18n.moreOperate.oldPassword}}</view>
						<input type="password" @input='changeOldPasswordInput' :placeholder="i18n.moreOperate.inputOldPassword"
						 placeholderStyle='color:#aaaaaa;letter-spacing:2px' name="oldPassword"></input>
					</view>
					<view class="cu-form-group" style="border-bottom: 1upx solid #eee;">
						<view class="title">{{i18n.moreOperate.newPassword}}</view>
						<input type="password" @input='changeNewPasswordInput' :placeholder="i18n.moreOperate.inputNewPassword"
						 placeholderStyle='color:#aaaaaa;letter-spacing:2px' name="newPassword"></input>
					</view>
					<button class="cu-btn block line-grey margin lg" @tap="modifyPassword" form-type="reset">{{i18n.confirm}}</button>
				</form>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
	import * as deviceInfoApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceInfoApi/deviceInfoApi.js'
	import * as companyApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/companyApi/companyApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				navigationBarTextColor: '',
				webViewList: [],
				isShowBindDeviceModal: false,
				isShowModifyModal: false,
				oldPassword: '',
				newPassword: '',
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			},
			themei18n() {
				return this.$themei18nOption()
			}
		},
		onLoad: function() {
			this.navigationBarTextColor = this.themei18n.navigationBarTextColor
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin ? this.getWebViewList() : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.getWebViewList(), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			deviceCamera: function() {
				uni.navigateTo({
					url: `/pages/deviceCamera/deviceCamera`
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
			bindDeviceModal: function() {
				this.isShowBindDeviceModal = !this.isShowBindDeviceModal
			},
			bindDevice: function(e) {
				let deviceCore = e.detail.value.deviceCore.replace(/\s/g, '')
				this.isShowBindDeviceModal = false
				deviceInfoApi.getDeviceInfo(this, deviceCore).then((res) => {
					if (res.code == '200') {
						this.$uniUtilsApi.showToast(this.i18n.bindSuccess, 'none', 1000, false)
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; //上一个页面
						prevPage && (prevPage.$vm.refresh = true)
					} else {
						this.$uniUtilsApi.showToast(this.i18n.bindFail, 'none', 1000, false)
					}
				})
			},
			modifyModal: function() {
				this.isShowModifyModal = !this.isShowModifyModal
			},
			changeOldPasswordInput: function(e) {
				this.oldPassword = e.detail.value.replace(/\s/g, '')
			},
			changeNewPasswordInput: function(e) {
				this.newPassword = e.detail.value.replace(/\s/g, '')
			},
			modifyPassword: function(e) {
				let userId = uni.getStorageSync('userId')
				let oldPassword = this.oldPassword
				let newPassword = this.newPassword
				if (oldPassword.length < 6 || newPassword.length < 6) {
					this.$uniUtilsApi.showToast(this.i18n.moreOperate.passwordLeastLength, 'none', 1000, false)
				} else if (oldPassword === newPassword) {
					this.$uniUtilsApi.showToast(this.i18n.moreOperate.passwordEqual, 'none', 1000, false)
				} else {
					userApi.updatePassword(this, userId, oldPassword, newPassword).then((res) => {
						if (res.code == '200') {
							this.modifyModal()
							this.$uniUtilsApi.showToast(this.i18n.setSuccess, 'none', 1000, false)
						} else {
							this.$uniUtilsApi.showToast(this.i18n.setFail, 'none', 1000, false)
						}
					})
					this.oldPassword = ''
					this.newPassword = ''
				}
			},
			getWebViewList: function() {
				var companyId = uni.getStorageSync('companyId')
				companyApi.getCompanyResource(this, 'message', companyId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let i = 0; i < data.length; i++) {
							let obj = {}
							let {
								title,
								url
							} = data[i]
							obj.title = title
							obj.url = url
							list.push(obj)
						}
						this.webViewList = list
					}
				})
			},
			tapWebView: function(e) {
				let webViewUrl = e.url
				uni.navigateTo({
					url: `/pages/web/web?url=${webViewUrl}`
				});
			},
		},
		onShareAppMessage: function(res) {
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/nav/nav`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	.custom-button {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 0px;
		padding-right: 0px;
		box-sizing: border-box;
		font-size: 18px;
		text-align: center;
		text-decoration: none;
		line-height: 1;
		border-radius: 0px;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		background-color: #fff;
	}

	.custom-button::after {
		border: 0;
	}

	.custom-button-hover {
		background-color: #fff;
	}
</style>
