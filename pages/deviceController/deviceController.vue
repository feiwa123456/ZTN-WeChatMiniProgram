<template>
	<view class="page" :style="paddingBottomStyle">
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<cu-custom v-else-if="isLogin && showVideo" :isCustom="true" v-on:parentEvent="closeVideo">
			<block slot="customText" class="text-white" :style="[{color:navigationBarTextColor}]">{{i18n.close}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>

		<!-- #ifdef MP-WEIXIN  -->
		<view v-if="showVideo" :style="liveplayerStyle" style="position: fixed; z-index: 1024">
			<view v-if="videoType=='rtmp'">
				<live-player style="width:100vw; height: 225px;" id="livePlayer" :src="playUrl" :orientation="direction" mode="live"
				 muted="false" object-fit='contain' autoplay @statechange="statechange" @error="error" />
				<cover-view style="width:100vw;display:flex;flex-direction:row;justify-content:space-between;position:absolute;right:0%;top:195px">
					<cover-view style="width: 25px;height:25px;margin-left:10px;" @tap="tapPlay">
						<cover-image style="width: 25px;height:25px" :src='isPlay ? pauseIcon : playIcon' />
					</cover-view>
				</cover-view>
			</view>
			<video v-if="videoType=='m3u8' || videoType=='httpflv'" :src="playUrl" controls="true" show-progress="false"
			 autoplay style="width:100vw">
			</video>
		</view>
		<!--  #endif -->
		<!-- #ifdef H5  -->
		<view v-if="showVideo" ref="video" class="video-js" style="position: fixed;width:100vw;height:225px"></view>
		<!--  #endif -->
		<!-- #ifdef APP-PLUS -->
		<view v-if="showVideo" class="video" style="position:fixed;width:100vw;height:225px">
			<video :src="playUrl" autoplay="true" controls="true" style="width:100%;height:100%;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);">
			</video>
		</view>
		<!--  #endif -->
		<scroll-view :style="style" scroll-y="true">
			<view v-for="(arrItem,arrIndex) in sensorWithSetting" :key="arrIndex">
				<view class="padding-lr margin-bottom">
					<view v-if="arrItem.settingList.length != 0" class="text-grey text-lg padding-tb">{{arrItem.sensorName}} <text class="margin-left-sm">[{{arrItem.type}}{{i18n.deviceController.port}}:{{arrItem.port}}]</text></view>
					<view v-for="(item,index) in arrItem.settingList" :key="index">
						<view style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius:15upx;" class="bg-white padding-sm margin-bottom">
							<view class="flex align-center">
								<view class="cu-avatar margin-right-sm bg-white" style="width:55rpx;height:55rpx;" :style="[{backgroundImage:`url(${item.iconUrl})`}]"></view>
								<view>{{item.name}}<text v-if="item.remark != ''" class="margin-left-xs">[ {{item.remark}} ]</text>
								<text v-if="item.childPort != ''" class="margin-left-xs text-grey">[{{i18n.deviceController.subport}}:{{item.childPort}}]</text></view>
							</view>
							<view>
								<view v-if="item.type=='custom' || item.type=='customProtocol'" class="margin-top-sm">
									<!-- 自定义 -->
									<form @submit="changeParam" :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort"
									 data-change="custom">
										<view class="flex align-center justify-end ">
											<input :disabled="item.disabled" class=" margin-right-sm ztnCustom-custominput flex-sub " style="border: 1upx solid rgba(135, 153, 163, 0.5);margin-left:120upx"
											 type='text' name="custom" :value="item.value"></input>
											<button :disabled="item.disabled" class="cu-btn block" :style="[{backgroundColor:emphasizeColor}]" style="padding-left: 14px;padding-right: 14px;color: #fff;"
											 hover-class="btn-hover-class" size='mini' form-type="submit">{{i18n.confirm}}</button>
										</view>
									</form>
								</view>
								<view v-else-if="item.type=='fixedParam'" class="margin-top-sm">
									<!-- 固定参数 -->
									<view id="fixedParam" class='flex align-center justify-end flex-wrap'>
										<view v-for="(arrItem,index) in item.paramList" :key="index" style="margin-left:20upx">
											<button :disabled="item.disabled" class="custom-button" size='mini' :class="[item.value == arrItem.value ? 'selectButton' : 'noSelectButton']"
											 :style="{'--color': emphasizeColor}" @tap="changeParam" :data-keyName="item.keyName" :data-port="item.port"
											 :data-childport="item.childPort" :data-value="arrItem.value" data-change="fixed">{{arrItem.name}}</button>
										</view>
									</view>
								</view>
								<view v-else-if="item.type=='switch'">
									<!-- 开关量 -->
									<view class="flex justify-end">
										<switch :class="[theme == 'default'?'orange sm':'blue sm']" :disabled="item.disabled" :checked="item.value"
										 @change="changeParam" :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort"
										 data-change='switch'></switch>
									</view>
								</view>
								<view v-else-if="item.type=='time'" class="margin-top-sm">
									<!-- 定时设置 -->
									<view class='flex justify-end' style="margin-left:120upx">
										<picker :disabled="item.disabled" class="flex-sub" mode="time" :value="item.value" @change="changeParam"
										 :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort" data-change='timeSet'>
											<view class="ztnCustom-custominput " style="border: 1upx solid rgba(135, 153, 163, 0.5)">{{item.value}}</view>
										</picker>
									</view>
								</view>
								<view v-else-if="item.type=='timeSlot'" class="margin-top-sm">
									<!-- 时间段设置 -->
									<view class='flex justify-end' style="margin-left:120upx">
										<picker :disabled="item.disabled" class="flex-sub" mode="multiSelector" @change="changeParam" :data-keyName="item.keyName"
										 :data-port="item.port" :data-childport="item.childPort" data-change='periodTime' :value="item.multiIndex"
										 :range="multiArray">
											<view class="ztnCustom-custominput" style="border: 1upx solid rgba(135, 153, 163, 0.5)">{{item.value}}</view>
										</picker>
									</view>
								</view>
								<view v-else-if="item.type=='noParam'">
									<!-- 无参数命令 -->
									<view class='flex  justify-end'>
										<button :disabled="item.disabled" class="cu-btn block" :style="[{backgroundColor:emphasizeColor}]" style="padding-left: 14px;padding-right: 14px;color: #fff"
										 @tap="changeParam" :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort"
										 data-change='nop'>{{i18n.confirm}}</button>
									</view>
								</view>
								<view v-else-if="item.type=='slider'" class="margin-top-sm">
									<!-- 拖动条 -->
									<view class='flex justify-end' style="margin-left:120upx">
										<slider :disabled="item.disabled" class="flex-sub" style="margin-right:0upx;margin-left:0upx" show-value max="100"
										 min="0" step="5" :value="item.value" :activeColor="emphasizeColor" block-size="20" @change="changeParam"
										 :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort" data-change="slider"></slider>
									</view>
								</view>
								<view v-else-if="item.type=='unKnow'">
									<!-- 未知类型 -->
									<form @submit="changeParam" :data-keyName="item.keyName" :data-port="item.port" :data-childport="item.childPort"
									 data-change="custom">
										<view class="flex align-center justify-end ">
											<input :disabled="item.disabled" class="margin-right-sm ztnCustom-custominput flex-sub " style="border: 1upx solid rgba(135, 153, 163, 0.5);margin-left:120upx"
											 type='text' name="custom" :value="item.value"></input>
											<button :disabled="item.disabled" class="cu-btn block" :style="[{backgroundColor:emphasizeColor}]" style="padding-left: 14px;padding-right: 14px;color: #fff;"
											 hover-class="btn-hover-class" size='mini' form-type="submit">{{i18n.confirm}}</button>
										</view>
									</form>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<circleComponent v-if="!showVideo && cameraList.length != 0 && isLogin" :style="[{bottom:`calc(${tabbarHeight}px + 30rpx)`}]"
		 style="position: fixed !important;z-index: 1024;right:40upx" :circleWidth="85" :circleHeight="85" :circleBgColor="circleBgColor"
		 :circleBorder="''">
			<text @tap="openCameraListModal" class="cuIcon-camera" style="font-size:0.7em" :style="[{color:emphasizeColor}]"></text>
		</circleComponent>

		<view class="cu-modal drawer-modal justify-start" :class="[showCameraListModal?'show':'']" @tap="hideCameraListModal">
			<view class="cu-dialog basis-lg" :style="cameraListModalStyle">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in cameraList" :key="index" @tap="tapCamera(item)">
						<view class="content">
							<view>
								<view>{{item.name}}</view> #{{item.deviceId}}
							</view>
						</view>
					</view>
				</view>
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
</template>

<script>
	import circleComponent from '@/components/ztn-custom/circleComponent/circleComponent.vue'
	import * as deviceControllerApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceControllerApi/deviceControllerApi.js'
	import * as deviceSensorApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceSensorApi/deviceSensorApi.js'
	import * as deviceCameraApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceCameraApi/deviceCameraApi.js'
	const hours = [];
	const minutes = [];
	const thours = [];
	const tminutes = [];
	for (let i = 0; i < 24; i++) {
		let n = i + ''
		hours[i] = n[1] ? n : '0' + n
	}
	for (let i = 0; i < 60; i++) {
		let n = i + ''
		minutes[i] = n[1] ? n : '0' + n
	}
	for (let i = 0; i < 24; i++) {
		let n = i + ''
		thours[i] = n[1] ? n : '0' + n
	}
	for (let i = 0; i < 60; i++) {
		let n = i + ''
		tminutes[i] = n[1] ? n : '0' + n
	}

	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isLogin: false,
				isLoginOverdue: false,
				navigationBarTextColor: '',
				// 监控
				showVideo: false,
				cameraList: [],
				cameraListModalStyle: '',
				showCameraListModal: false,
				videoType: '',
				playUrl: '',
				playerContext: null,
				direction: 'vertical',
				isPlay: false,
				pushTime: 60,
				playIcon: '../../static/images/cam/play.png',
				pauseIcon: '../../static/images/cam/pause.png',
				circleBgColor: '#f8f8f8',
				// 控制
				style: '',
				sensorWithSetting: [],
				multiArray: [hours, minutes, thours, tminutes],
				multiIndex: [0, 0, 0, 0],
				settingError: '',
				showErrorModal: false,
				emphasizeColor: '',
				selectButton: '',
				paddingBottomStyle: '',
				theme: '',
			}
		},
		props: {
			deviceName: {
				type: String,
				default: ''
			},
			deviceCore: {
				type: String,
				default: ''
			},
			tabbarHeight: {
				type: [Number, String],
				default: 0
			},
			isToHome: {
				type: Boolean,
				default: false
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
		beforeMount: function() {
			let emphasizeColor = this.themei18n.emphasizeColor
			let theme = this.themei18n.theme
			let light;
			this.theme = theme
			switch (theme) {
				case 'default':
					light = 'orangeLight'
					break;
				case 'darkColor':
					light = 'blueLight'
					break;
				case 'lightColor':
					light = 'blueLight'
					break;
				default:
					break;
			}
			let lightColor = this.themei18n.lightColor
			this.circleBgColor = lightColor[light]
			this.emphasizeColor = emphasizeColor
			this.selectButton = 'background:${emphasizeColor};color:#fff; border: 1upx solid ${emphasizeColor}'
		},
		// onReady: function() {
		// 	// #ifdef H5
		// 	// let video = document.createElement('video')
		// 	// video.id = 'video'
		// 	// video.style = "width:100%;height:100%;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);"
		// 	// video.autoplay = true
		// 	// video.controls = true
		// 	// let source = document.createElement('source')
		// 	// source.src = this.playUrl
		// 	// source.type = this.videoType
		// 	// video.appendChild(source)
		// 	// this.$refs.video.$el.appendChild(video)
		// 	// videojs("video")
		// 	// #endif
		// 	// #ifdef MP-WEIXIN
		// 	this.playerContext = uni.createLivePlayerContext('livePlayer', this);
		// 	// #endif
		// },
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.isLogin = isLogin
			isLogin && this.init()
		},
		methods: {
			init: function() {
				this.sensorWithSetting = []
				this.cameraList = []
				this.getListWith()
				this.getCameraList()
				this.navigationBarTextColor = this.themei18n.navigationBarTextColor
			},
			getListWith: function() {
				let deviceCore = this.deviceCore
				let withExplain = false
				let withParam = false
				let withSetting = true
				deviceSensorApi.getListWith(this, deviceCore, withExplain, withParam, withSetting).then((res) => {
					if (res.code == '200') {
						let data = res.data.filter(function(item, index) {
							return item.hidden == false
						})
						if (data.length > 0) {
							let list = data.filter(function(item, index) {
								return item.settingList.length != 0
							})
							for (let i = 0; i < list.length; i++) {
								let index = list[i].type
								list[i].type = this.i18n.deviceSensor.sensorType[index]
								list[i].settingList = this.getSettingList(list[i].settingList)
							}
							this.sensorWithSetting = list
						}
					}
				})
			},
			getSettingList: function(list) {
				let data = list.filter((item, index, arr) => item.hidden == false)
				for (let i = 0; i < data.length; i++) {
					if (data[i].type == 'switch') {
						data[i].value = data[i].value == 1 ? true : false
					} else if (data[i].type == 'timeSlot') {
						if (data[i].value.indexOf('/') != -1) {
							let value = data[i].value.split(' / ');
							let fvalue = value[0].split(':');
							let svalue = value[1].split(':');
							data[i].multiIndex = fvalue.concat(svalue)
							data[i].value = fvalue.map(this.formatNumber).join(':') + ' / ' + svalue.map(this.formatNumber).join(':')
						} else {
							data[i].multiIndex = [0, 0, 0, 0]
						}
					}
				}
				return data
			},
			formatNumber: function(n) {
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			changeParam: function(e) {
				let data = e.currentTarget.dataset
				let change = data.change
				let keyName = data.keyname || ''
				let port = data.port || ''
				let childPort = data.childport || ''
				switch (change) {
					case 'custom':
						let customValue = e.detail.value.custom
						this.saveSetting(customValue, keyName, port, childPort)
						break;
					case 'fixed':
						let fixedValue = data.value
						this.saveSetting(fixedValue, keyName, port, childPort)
						break;
					case 'switch':
						let switchValue = e.detail.value ? '1' : '0'
						this.saveSetting(switchValue, keyName, port, childPort)
						break;
					case 'timeSet':
						let timeSetValue = e.detail.value
						this.saveSetting(timeSetValue, keyName, port, childPort)
						break;
					case 'periodTime':
						let index = e.detail.value;
						let hour = this.multiArray[0][index[0]]
						let minute = this.multiArray[1][index[1]]
						let thour = this.multiArray[2][index[2]]
						let tminute = this.multiArray[3][index[3]]
						let periodTime = hour + ':' + minute + ' / ' + thour + ':' + tminute
						this.saveSetting(periodTime, keyName, port, childPort)
						break;
					case 'nop':
						this.saveSetting(null, keyName, port, childPort)
						break;
					case 'slider':
						let sliderValue = e.detail.value;
						this.saveSetting(sliderValue, keyName, port, childPort)
						break;
					default:
				}
			},
			saveSetting: function(value, keyName, port, childPort) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, true)
				let deviceCore = this.deviceCore
				deviceControllerApi.saveSetting(this, deviceCore, value, keyName, port, childPort).then((res) => {
					if (res.code == '200') {
						this.$uniUtilsApi.hideLoading()
						this.$uniUtilsApi.showToast(this.i18n.setSuccess, 'none', 1000, true)
						this.getListWith()
					}
				})
			},
			hideErrorModal: function() {
				this.showErrorModal = false
			},
			getCameraList: function() {
				let deviceCore = this.deviceCore
				let userId = uni.getStorageSync('userId')
				deviceCameraApi.getCameraList(this, userId, deviceCore).then((res) => {
					let tabbarHeight = this.tabbarHeight
					if (res.code == '200') {
						this.cameraList = res.data
						this.paddingBottomStyle = `padding-bottom:calc(${tabbarHeight}px + 110rpx)`;
					} else {
						this.paddingBottomStyle = `padding-bottom:${tabbarHeight}px`;
					}
				})
			},
			openCameraListModal: function() {
				let CustomBar = this.CustomBar
				this.cameraListModalStyle = `top:${CustomBar}px;height:calc(100vh - {{CustomBar}}px)`
				this.showCameraListModal = true
			},
			hideCameraListModal: function() {
				this.showCameraListModal = false
			},
			tapCamera: function(e) {
				let deviceId = e.deviceId
				let pushTime = this.pushTime
				this.pushCloud(deviceId, pushTime)
				// this.hideCameraListModal()
				// let CustomBar = this.CustomBar + 'px'
				// let screenHeight = wx.getStorageSync('screenHeight') + 'px'
				// this.style = `height:calc(${screenHeight} - 225px - ${CustomBar});margin-top:225px`
				// this.showVideo = true
				// this.playUrl = 'rtmp://58.200.131.2:1935/livetv/hunantv'
				// this.videoType = 'rtmp'
				// this.isPlay = true
			},
			pushCloud: function(deviceId, pushTime) {
				deviceCameraApi.pushCloud(this, deviceId, pushTime).then((res) => {
					if (res.code == '200') {
						let playUrl = res.data.playUrl
						if (playUrl != null) {
							let mediaType = res.data.mediaType
							this.videoType = mediaType == 'm3u8' || mediaType == 'httpflv' ? mediaType : 'rtmp'
							this.playUrl = playUrl
							this.isPlay = true
							let CustomBar = this.CustomBar + 'px'
							let screenHeight = wx.getStorageSync('screenHeight') + 'px'
							this.style = `height:calc(${screenHeight} - 225px - ${CustomBar});margin-top:225px`
							this.showVideo = true
						} else {
							this.$uniUtilsApi.showToast(this.i18n.camera.invalidAddress, 'none', 1000, false) //'播放地址无效'
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
					}
				})
			},
			closeVideo: function() {
				this.showVideo = false
				this.style = ''
			},
			tapPlay: function() {
				let isPlay = this.isPlay
				isPlay ? this.playerContext.pause() : this.playerContext.resume()
				this.isPlay = !isPlay
			},
			statechange: function(e) {
				// console.log('livePlayer code:', e.detail.code)
			},
			error: function(e) {
				// console.error('livePlayer error:', e.detail.errMsg)
			},

		},
		components: {
			circleComponent
		}
	}
</script>
<style scoped>
	.ztnCustom-custominput {
		text-align: center;
		height: 64upx;
		line-height: 64upx;
	}

	.custom-button {
		background-color: #fff;
	}

	.custom-button::after {
		border: 0;
	}

	.selectButton {
		color: #fff;
		border: 1upx solid var(--color);
		background-color: var(--color)
	}

	.noSelectButton {
		color: var(--color);
		border: 1upx solid var(--color);
		background-color: #fff
	}
</style>
