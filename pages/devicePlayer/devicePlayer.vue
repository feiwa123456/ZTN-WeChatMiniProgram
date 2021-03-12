<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true">
		</cu-custom>
		<cu-custom v-else :isBack="true">
		</cu-custom>

		<!-- #ifdef MP-WEIXIN  -->
		<view v-if="videoType=='rtmp'">
			<live-player style="width:100vw; height: 225px;" id="livePlayer" :src="playUrl" :orientation="direction" mode="live"
			 muted="false" object-fit='contain' autoplay @statechange="statechange" @error="error" @fullscreenchange="fullscreenChange" />
			<cover-view style="width:100vw;display:flex;flex-direction:row;justify-content:space-between;position:absolute;right:0%;top:255px">
				<cover-view style="width: 25px;height:25px;margin-left:10px;" @tap="tapPlay">
					<cover-image style="width: 25px;height:25px" :src='isPlay ? pauseIcon : playIcon' />
				</cover-view>
				<cover-view style="width: 25px;height:25px;margin-right:10px;" @tap="tapFullscreen">
					<cover-image style="width: 25px;height:25px" :src='fullscreenIcon' />
				</cover-view>
			</cover-view>
		</view>
		<video v-if="videoType=='m3u8' || videoType=='httpflv'" id="liveplayer" :src="playUrl" controls="true" show-progress="false"
		 autoplay="true">
		</video>
		<!--  #endif -->
		<!-- #ifdef H5  -->
		<view ref="video" class="video-js" style="position: fixed;width:100vw;height:225px">
		</view>
		<!--  #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="video">
			<video :src="playUrl" autoplay="true" controls style="position: fixed;width:100vw;height:225px">
			</video>
		</view>
		<!--  #endif -->

		<!-- v-if="isShowActionText" -->
		<view v-if="isLogin" style="margin-top:50rpx" class="text-center">{{actionText}}</view>
		<!-- :style="(isShowActionText ? '' : style)" -->
		<view v-if="isLogin" class="flex margin-top">
			<view class="flex-sub grid col-2">
				<view>
					<view id='ptzZoomOut' class="cu-btn block line-black margin-lr-xs" style="padding-left: 14px;padding-right: 14x"
					 type="default" @tap='tapAction' data-label="缩小">{{i18n.camera.ptzZoomOut}}</view>
				</view>
				<view>
					<view id='ptzZoomIn' class="cu-btn block line-black margin-lr-xs " style="padding-left: 14px;padding-right: 14px;"
					 type="default" @tap='tapAction' data-label="放大">{{i18n.camera.ptzZoomIn}}</view>
				</view>
				<view>
					<view id='zoomOut' class="cu-btn block line-black margin-lr-xs" style="padding-left: 14px;padding-right: 14x"
					 type="default" @tap='tapAction' data-label="聚焦远">{{i18n.camera.zoomOut}}</view>
				</view>
				<view>
					<view id='zoomIn' class="cu-btn block line-black margin-lr-xs " style="padding-left: 14px;padding-right: 14px;"
					 type="default" @tap='tapAction' data-label="聚焦近">{{i18n.camera.zoomIn}}</view>
				</view>
				<view>
					<view id='aroundHorizontal' class="cu-btn block line-black margin-lr-xs" style="padding-left: 14px;padding-right: 14x"
					 type="default" @tap='tapAction' data-label="垂直循航">{{i18n.camera.aroundHorizontal}}</view>
				</view>
				<view>
					<view id='aroundVertical' class="cu-btn block line-black margin-lr-xs " style="padding-left: 14px;padding-right: 14px;"
					 type="default" @tap='tapAction' data-label="水平循航">{{i18n.camera.aroundVertical}}</view>
				</view>
			</view>
			<view class="flex-sub flex justify-center">
				<view style="width:240rpx;height:240rpx;border-radius:50%;border:1px solid #333333">
					<view class="flex align-center justify-center" style="width:240rpx;height:80rpx;">
						<view id='ptzUp' data-label="向上" class="cuIcon-fold text-xxl text-bold" @tap='tapAction'></view>
					</view>
					<view class="flex align-center justify-between" style="width:240rpx;height:80rpx;">
						<view id='ptzLeft' class="cuIcon-back text-xxl text-center" style="width:80rpx;height:80rpx;line-height:80rpx"
						 @tap='tapAction' data-label="向左"></view>
						<view style="border-radius: 50%;height: 80rpx;width: 80rpx;border:1px solid #333333"></view>
						<view id='ptzRight' class="cuIcon-right text-xxl text-center" style="width:80rpx;height:80rpx;line-height:80rpx"
						 @tap='tapAction' data-label="向右"></view>
					</view>
					<view class="flex align-center justify-center" style="width:240rpx;height:80rpx;">
						<view id='ptzDown' class="cuIcon-unfold text-xxl text-bold" @tap='tapAction' data-label="向下"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as deviceCameraApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceCameraApi/deviceCameraApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLogin: false,
				isLoginOverdue: false,
				videoType: 'rtmp',
				playUrl: '',
				playerContext: null,
				direction: 'vertical',
				fullscreenIcon: '../../static/images/cam/full.png',
				playIcon: '../../static/images/cam/play.png',
				pauseIcon: '../../static/images/cam/pause.png',
				isHidden: false,
				isPlay: false,
				isFull: false,
				actionText: '',
				isShowActionText: false,
				deviceId: null,
				pushTime: 60,
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onReady: function() {
			// #ifdef H5
			let video = document.createElement('video')
			video.id = 'video'
			video.style = 'width:100%;height:100%;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);'
			video.autoplay = true
			video.controls = true
			let source = document.createElement('source')
			source.src = this.playUrl
			video.appendChild(source)
			this.$refs.video.$el.appendChild(video)
			videojs('video')
			// #endif
			// #ifdef MP-WEIXIN
			this.playerContext = uni.createLivePlayerContext('livePlayer', this);
			// #endif
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.initOption = option
			this.isLogin = isLogin
			isLogin ? this.init(option) : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let initOption = this.initOption
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(initOption), this.fromLoginBack = false, this.isLoginOverdue = false, this.isLogin =
				true)
		},
		onUnload: function() {
			let isLogin = this.isLogin
			let deviceId = this.deviceId
			isLogin && deviceCameraApi.stopCloud(this, deviceId).then((res) => {
				if (res.code == '200') {
					// console.log('stopCloud')
				}
			})
		},
		methods: {
			init: function(option) {
				this.deviceId = option.deviceId
				this.pushCloud()
				// this.playUrl = 'rtmp://58.200.131.2:1935/livetv/hunantv'
				// this.videoType = 'rtmp'
				// this.isPlay = true
			},
			pushCloud: function() {
				let deviceId = this.deviceId
				let pushTime = this.pushTime
				deviceCameraApi.pushCloud(this, deviceId, pushTime).then((res) => {
					if (res.code == '200') {
						let playUrl = res.data.playUrl
						if (playUrl != null) {
							let mediaType = res.data.mediaType
							this.playUrl = playUrl
							this.videoType = mediaType == 'm3u8' || mediaType == 'httpflv' ? mediaType : 'rtmp'
							this.isPlay = true
							// let interval = setInterval(function() {
							// 	this.count = this.count + 1
							// 	this.count > pushTime && clearInterval(interval);
							// }, 1000);
						} else {
							this.$uniUtilsApi.showToast(this.i18n.invalidAddress, 'none', 1000, false) //'播放地址无效'
						}
					} else {
						if (res.code == '201') {
							switch (res.msg) {
								case 'serverCompany':
									this.$uniUtilsApi.showToast(this.i18n.camera.equipmentNotSupported, 'none', 1000, false) //'设备不支持'
									break
								case 'OFFLINE':
									this.$uniUtilsApi.showToast(this.i18n.camera.equipmentOffline, 'none', 1000, false) //'设备不在线'
									break
								default:
									this.$uniUtilsApi.showToast(this.i18n.camera.pushFailure, 'none', 1000, false) //'推流失败'
									break
							}
						} else {
							this.$uniUtilsApi.showToast(this.i18n.camera.pushFailure, 'none', 1000, false) //'推流失败'
						}
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					}
				})
			},
			tapAction: function(e) {
				let actionCode = e.currentTarget.id
				this.actionText = e.currentTarget.dataset.label
				this.sendActionCommand(actionCode)
			},
			showActionText: function() {
				this.isShowActionText = true
				setTimeout(() => {
					this.isShowActionText = false
				}, 3000);
			},
			sendActionCommand: function(code) {
				let deviceId = this.deviceId
				deviceCameraApi.sendActionCommand(this, deviceId, code).then((res) => {
					if (res.code == '200') {
						this.showActionText()
						this.$uniUtilsApi.showToast(this.i18n.commandSentSuccess, 'none', 1000, false) //发送命令成功
					} else {
						this.$uniUtilsApi.showToast(this.i18n.commandSentfail, 'none', 1000, false)
					}
				})
			},
			//微信小程序  兼容
			tapPlay: function(e) {
				let isPlay = this.isPlay
				isPlay ? this.playerContext.pause() : this.playerContext.resume()
				this.isPlay = !isPlay
			},
			tapFullscreen: function(e) {
				let isFull = this.isFull
				isFull ? this.playerContext.exitFullScreen({}) : this.playerContext.requestFullScreen({})
				this.isFull = !isFull
			},
			statechange: function(e) {
				// console.log('livePlayer code:', e.detail.code)
			},
			error: function(e) {
				// console.error('livePlayer error:', e.detail.errMsg)
			},
			fullscreenChange: function(e) {
				let fullScreen = e.detail.fullScreen
				this.direction = fullScreen ? 'horizontal' : 'vertical'
			},
		},
		onShareAppMessage: function(res) {
			let deviceId = this.deviceId
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/devicePlayer/devicePlayer?deviceId=${deviceId}`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style scoped>
</style>
