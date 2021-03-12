<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText">{{i18n.camera.cameraManager}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText">{{i18n.camera.cameraManager}}</block>
		</cu-custom>

		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="getCameraList">
			<view v-if="cameraList.length != 0" class="cu-bar" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
				<view class="action">
					<text class="text-bold">{{i18n.camera.cameraDevice}}</text>
				</view>
			</view>
			<view v-if="cameraList.length != 0" v-for="(arrItem,arrIndex) in cameraList" :key="arrIndex">
				<view v-for="(item,index) in arrItem" :key="index" class="flex align-center bg-white" @tap="tapCamera(item)">
					<view class="margin-left margin-right-lg ">
						<image :src="item.picturePath" class="text-gray" style="width:96rpx;height:96rpx;font-size:96rpx;" :class="[item.picturePath?'':'cuIcon-pic']"></image>
					</view>
					<view class="flex-sub padding-tb solid-bottom">
						<view class="text-df" style="height:96rpx;line-height:96rpx">{{item.hid}}</view>
					</view>
				</view>
			</view>
		</mescroll-body>

		<view :style="[{height:bottomBarHeight + 'px'}]"></view>
		<view id="cameraAuth" v-if="cameraAuthList.length != 0" class="bg-white text-center" style="position:fixed;width:100%;bottom:0;z-index: 1024;box-shadow: 0 -1rpx 6rpx rgba(0, 0, 0, 0.1);">
			<view class="padding text-gray text-lg" @tap="openCameraAuth">
				{{i18n.camera.cameraAuth}}
			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="[isShowCameraAuth?'show':'']" style="text-align: start">
			<view class="cu-dialog bg-white" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
				<view class="cu-bar bg-white">
					<view class='action text-bold'>
						{{i18n.camera.cameraAuth}}
					</view>
				</view>
				<view class="cu-bar bg-white solid-bottom flex" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
					<view class="flex-sub text-center text-grey text-bold" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis ">{{i18n.camera.name}}</view>
				</view>
				<view v-for="(item,index) in cameraAuthList" :key="index" class="cu-bar bg-white solid-bottom flex" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
					<view class="flex-sub text-center" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{item.userName}}</view>
				</view>
				<button class="cu-btn block line-grey margin lg" @tap="openCameraAuth">{{i18n.close}}</button>
			</view>
		</view>

	</view>
</template>

<script>
	import * as deviceCameraApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceCameraApi/deviceCameraApi.js'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				CustomBar: this.CustomBar,
				downOption: {
					use: true,
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					auto: false,
					empty: {
						use: true,
						fixed: true,
						top: '20%'
					}
				},
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				currentPage: 1,
				pageSize: 10,
				cameraList: [],
				cameraAuthList: [],
				bottomBarHeight: '',
				isShowCameraAuth: false
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
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin ? this.init() : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			init: function(option) {
				this.getCameraList()
				this.getCameraAuthList()
			},
			downCallback: function() {
				this.currentPage = 1
				this.cameraList = []
				this.mescroll.resetUpScroll()
			},
			getCameraList: function() {
				let userId = uni.getStorageSync('userId')
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				let arr = []
				deviceCameraApi.getCameraDeviceList(this, userId, currentPage, pageSize).then((res) => {
					if (res.code == '200') {
						let {
							data,
							total
						} = res.data
						if (total < 1) {
							let title = this.i18n.noData
							this.$uniUtilsApi.showToast(title, 'none', 1000, false)
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1000);
							return
						}
						for (let index = 0; index < data.length; index++) {
							let {
								picturePath,
								deviceId,
								hid
							} = data[index]
							let obj = {
								picturePath: picturePath && `${picturePath}`,
								deviceId: deviceId,
								hid: hid
							}
							arr.push(obj)
						}
						this.mescroll.endByPage(data.length, total)
						let cameraIndex = currentPage - 1
						this.$set(this.cameraList, cameraIndex, arr)
						this.currentPage = currentPage + 1
					}
				})
			},
			tapCamera: function(e) {
				let deviceId = e.deviceId
				uni.navigateTo({
					url: `/pages/devicePlayer/devicePlayer?deviceId=${deviceId}`
				})
			},
			getCameraAuthList: function() {
				let authList = []
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				let userId = uni.getStorageSync('userId')
				deviceCameraApi.getCameraAuthList(this, userId, currentPage, pageSize).then((res) => {
					if (res.code == '200') {
						let data = res.data.data
						for (let index = 0; index < data.length; index++) {
							let {
								userName,
								serverCompany
							} = data[index]
							authList.push({
								userName,
								serverCompany
							})
						}
						this.cameraAuthList = authList
						let bottomBarHeight = uni.getStorageSync('bottomBarHeight')
						if (bottomBarHeight) {
							this.bottomBarHeight = bottomBarHeight
						} else {
							this.$nextTick(() => {
								setTimeout(() => {
									uni.createSelectorQuery().select('#cameraAuth').boundingClientRect((e) => {
										if(e){
											let height = e.height
											this.bottomBarHeight = height
											uni.setStorageSync('bottomBarHeight', height)
										}
									}).exec()
								}, 0)
							})
						}
					}
				})
			},
			openCameraAuth: function() {
				this.isShowCameraAuth = !this.isShowCameraAuth
			}
		},
		onShareAppMessage: function(res) {
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/deviceError/deviceError`,
				success:(res) => {
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
</style>
<style scoped>
	page {
		background-color: #ffffff;
	}
</style>
