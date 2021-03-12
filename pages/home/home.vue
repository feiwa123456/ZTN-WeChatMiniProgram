<template>
	<view class="bg-white">
		<scroll-view scroll-y="true" class="scrollPage">
			<cu-custom :isCustom="isLogin" :customIcon="customIcon" v-on:parentEvent="bindDeviceModal">
			</cu-custom>
			<!-- <video :src="playUrl" autoplay="true" controls style="width:100%;height:100%;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);">
			</video> -->
			<!-- <view class="cuIcon-videofill" style="font-size:65rpx;position:absolute;left:50%;top:50%;transform: translate(-50%, -50%);"></view>
			<view style="position:absolute;left:15rpx;bottom:15rpx">{{item.title}}</view> -->
			<swiper v-if="show == 'cardSwiper'" id="cardSwiper" class="card-swiper" :indicator-dots="indicatorDots" :circular="circular"
			 :autoplay="autoplay" :interval="interval" :duration="duration" @change="cardSwiperChange" :indicator-active-color="indicatorActiveColor">
				<swiper-item class="card-swiper-item" v-for="(item,index) in cardSwiperList" :key="index">
					<view class="swiper-item">
						<image :src="item.url" mode="aspectFill" v-if="item.type=='phoneSlideshow'"></image>
					</view>
				</swiper-item>
			</swiper>
			<view v-else :style="[{height:videoHeight + 'px'}]" style="background-color:#f8f8f8" class="padding-bottom" ref="parent">
				<!-- #ifdef H5  -->
				<!-- style="width:100vw;height:100vh;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);" -->
				<view class="video-js" :style="[{height:`calc(${videoHeight}px - 30rpx)`}]" style="width: 100vw;" ref="video">
				</view>
				<!--  #endif -->
				<!--  #ifdef MP-WEIXIN || APP-NVUE -->
				<video v-if="show == 'agricultureVideo'" id="myVideo" :style="[{height:`calc(${videoHeight}px - 30rpx)`}]" style="width: 100%;"
				 :src="playUrl" :autoplay="autoplay" controls>
				</video>

				<live-player v-else-if="show == 'cameraVideo'" id="livePlayer" :style="[{height:`calc(${videoHeight}px - 30rpx)`}]"
				 style="width:100vw" :src="playUrl" :orientation="direction" mode="live" muted="false" object-fit='contain'
				 autoplay />
				<!--  #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="cuIcon-roundclose text-gray padding-right padding-top" :style="[{top:CustomBar+'px'}]" style="position:absolute;right:0%;font-size:60rpx;"
				 @tap="closeVideo"></view>
				<!-- #endif -->
			</view>

			<view v-if="videoList.length != 0" class="cu-bar bg-white" style="border-top-left-radius:20upx;border-top-right-radius:20upx;">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.home.intelligentAgriculture}}</text>
				</view>
			</view>
			<view v-if="videoList.length != 0" class="nav-list text-white">
				<view v-for="(item,index) in videoList" :key="index" :style="[{backgroundImage:`url(${item.iconUrl})`}]" style="border-radius: 12rpx;width: 45%;height:180rpx;margin: 20rpx 2.5% ;background-size: cover;background-position: center;position:relative"
				 @tap="tapVideo(item)">
					<image :src="playUrl == item.url ? pauseIcon : playIcon" style="width:65rpx;height:65rpx;position:absolute;left:50%;top:50%;transform: translate(-50%, -50%);"></image>
				</view>
			</view>

			<view v-if="cameraList.length != 0" class="cu-bar bg-white" style="border-top-left-radius:20upx;border-top-right-radius:20upx;">
				<view class="action">
					<text class="text-bold ztnCustom-color-black">{{i18n.camera.cameraDevice}}</text>
				</view>
				<view class="action" @tap="deviceCamera()">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view v-if="cameraList.length != 0" class="nav-list ">
				<view v-for="(item,index) in cameraList" :key="index" :class="[item.picturePath?'':'cuIcon-pic']" class="text-grey"
				 :style="[{backgroundImage:`url(${item.picturePath})`}]" style="border-radius: 12rpx;width: 45%;height:180rpx;margin: 20rpx 2.5% ;background-size: cover;background-position: center;position:relative"
				 @tap="tapCamera(item)">
					<image :src="deviceId == item.deviceId ? pauseIcon : playIcon" style="width:65rpx;height:65rpx;position:absolute;left:50%;top:50%;transform: translate(-50%, -50%);"></image>
				</view>
			</view>

			<view v-if="productTypeList.length != 0" class="cu-bar" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
				<view class="action">
					<text class="text-bold">{{i18n.home.productType}}</text>
				</view>
			</view>
			<view v-if="productTypeList.length != 0" class='nav-list' :style="[{paddingBottom:`${tabbarHeight}px`}]">
				<view class="nav-li text-white" :style="[{backgroundColor:`${item.color}`}]" @tap="list(item)" v-for="(item,index) in productTypeList"
				 :key="index">
					<view class="nav-title">{{item.num}}</view>
					<view class="nav-name">{{item.name}}</view>
					<view class="cu-avatar round  bg-white margin-right-sm nav-image" :style="[{backgroundImage:`url(${item.iconUrl})`}]"
					 style="background-color:rgba(0, 0, 0, 0)"></view>
				</view>
			</view>
		</scroll-view>

		<view v-if="isShowBindDeviceModal" class="cu-modal bottom-modal" :class="[isShowBindDeviceModal?'show':'']" style="text-align: start">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white">
					<view class='action text-bold'>
						{{i18n.bindDevice}}
					</view>
					<view class='action text-bold'>
						<view class="cuIcon-close text-grey" @tap="bindDeviceModal"></view>
					</view>
				</view>
				<form @submit='bindDevice'>
					<view class="cu-form-group" style="border-bottom: 1upx solid #eee;">
						<view class="title">{{i18n.deviceCore}}</view>
						<input type="text" :placeholder="i18n.inputDeviceCore" placeholderStyle='color:#aaaaaa;letter-spacing:2px' name="deviceCore"></input>
					</view>
					<button class="cu-btn block line-grey margin lg" form-type="submit">{{i18n.confirm}}</button>
				</form>
			</view>
		</view>

	</view>
</template>

<script>
	import * as deviceBelongApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceBelongApi/deviceBelongApi.js'
	import * as deviceCameraApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceCameraApi/deviceCameraApi.js'
	import * as deviceInfoApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceInfoApi/deviceInfoApi.js'
	import * as companyApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/companyApi/companyApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				customIcon: 'cuIcon-add',
				customColor: '',
				isShowBindDeviceModal: false,
				isLoginOverdue: false,
				show: 'cardSwiper',
				indicatorDots: true,
				circular: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				indicatorActiveColor: '#70c8e2',
				cardSwiperList: [],
				videoHeight: '',
				videoList: [],
				playUrl: '',
				productTypeList: [],
				currentPage: 1,
				pageSize: 10,
				cameraList: [],
				playIcon: '../../static/images/cam/play.png',
				pauseIcon: '../../static/images/cam/pause.png',
				deviceId: '',
				pushTime: 60,
			}
		},
		name: 'homeComponent',
		props: {
			isLogin: {
				type: Boolean,
			},
			tabbarHeight: {
				type: [Number, String],
				default: ''
			},
		},
		watch: {
			isLogin: {
				immediate: true,
				handler(newValue, oldValue) {
					newValue && this.initResource()
				},
				deep: true
			}
		},
		computed: {
			themei18n() {
				return this.$themei18nOption()
			},
			i18n() {
				return this.$i18nMsg()
			},
		},
		mounted: function() {
			this.init()
		},
		methods: {
			init: function() {
				let companyId = uni.getStorageSync('companyId')
				this.getCardSwiperList(companyId)
				this.getVideoList(companyId)
				this.getCardSwiperHeight()
			},
			initResource: function() {
				this.getCameraList()
				this.getProductTypeList()
			},
			getCardSwiperList: function(companyId) {
				companyApi.getCompanyResource(this, 'phoneSlideshow', companyId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let i = 0; i < data.length; i++) {
							let obj = {}
							let {
								type,
								url
							} = data[i]
							obj.id = i
							obj.type = type
							obj.url = url
							list.push(obj)
						}
						this.cardSwiperList = list
					}
				})
			},
			getCardSwiperHeight: function() {
				let videoHeight = uni.getStorageSync('videoHeight')
				if (videoHeight) {
					this.videoHeight = videoHeight
				} else {
					uni.createSelectorQuery().in(this).select('#cardSwiper').boundingClientRect((e) => {
						this.videoHeight = e.height
						uni.setStorageSync('videoHeight', e.height)
					}).exec()
				}
			},
			cardSwiperChange: function(e) {
				this.cardCur = e.detail.current
			},
			getVideoList: function(companyId) {
				companyApi.getCompanyResource(this, 'video', companyId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let i = 0; i < data.length; i++) {
							let obj = {}
							let {
								iconUrl,
								url,
								title
							} = data[i]
							obj.iconUrl = iconUrl
							obj.url = url
							obj.title = title
							list.push(obj)
						}
						this.videoList = list
					}
				})
			},
			tapVideo: function(e) {
				this.show = 'agricultureVideo'
				this.playUrl = e.url
				// #ifdef H5
				this.$nextTick(() => {
					let video = document.createElement('video')
					video.id = 'video'
					// video.style ="width:100%;height:100%;position:absolute;top:50%;left: 50%;transform: translate(-50%,-50%);"
					video.autoplay = true
					video.controls = true
					let source = document.createElement('source')
					source.src = e.url
					video.appendChild(source)
					this.$refs.video.$el.appendChild(video)
					videojs('video')
				})
				// #endif
			},
			closeVideo: function(e) {
				this.show = 'cardSwiper'
				this.playUrl = ''
				this.stopCloud()
				this.deviceId = ''
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
							this.cameraList = []
							return
						}
						for (let index = 0; index < data.length; index++) {
							let obj = {}
							let {
								picturePath,
								deviceId,
								hid
							} = data[index]
							obj.picturePath = picturePath && `${picturePath}`
							obj.deviceId = deviceId
							obj.hid = hid
							arr.push(obj)
						}
						if (currentPage == 1 && arr.length > 3) {
							this.cameraList = arr.slice(1, 5)
						} else {
							this.cameraList = arr
						}
						this.currentPage = currentPage + 1
					}
				})
			},
			tapCamera: function(e) {
				this.show = 'cameraVideo'
				this.playUrl = ''
				this.stopCloud()
				let deviceId = e.deviceId
				this.deviceId = deviceId
				let pushTime = this.pushTime
				deviceCameraApi.pushCloud(this, deviceId, pushTime).then((res) => {
					if (res.code == '200') {
						let playUrl = res.data.playUrl
						if (playUrl != null) {
							let mediaType = res.data.mediaType
							this.playUrl = playUrl
							this.videoType = mediaType == 'm3u8' || mediaType == 'httpflv' ? mediaType : 'rtmp'
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
			stopCloud: function() {
				let deviceId = this.deviceId
				deviceId && deviceCameraApi.stopCloud(this, deviceId).then((res) => {
					if (res.code == '200') {}
				})
			},
			deviceCamera: function() {
				uni.navigateTo({
					url: `/pages/deviceCamera/deviceCamera`
				})
			},
			getProductTypeList: function() {
				let userId = uni.getStorageSync('userId')
				deviceBelongApi.getProductTypeList(this, userId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let standardColor = this.themei18n.standardColor
						let colorArr = []
						for (let color in standardColor) {
							if (color == 'grey') {
								break
							} else {
								colorArr.push(standardColor[color])
							}
						}
						let colorIndex = 0
						let colorLength = colorArr.length
						for (let i = 0; i < data.length; i++) {
							if (colorIndex < colorLength) {
								data[i].color = colorArr[colorIndex]
								colorIndex = colorIndex + 1
							} else {
								data[i].color = colorArr[0]
								colorIndex = 1
							}
						}
						this.productTypeList = data
					}
				})
			},
			list: function(item) {
				let option = {
					pageCur: 'list',
					productId: item.productId
				}
				this.$emit('list', option);
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
					} else {
						this.$uniUtilsApi.showToast(this.i18n.bindFail, 'none', 1000, false)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.scrollPage {
		height: 100vh;
	}

	.card-swiper-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		overflow: unset;
	}

	.ztnCustom-videoImage:nth-child(odd) {
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.ztnCustom-videoImage:nth-child(even) {
		margin-right: 30rpx;
	}

	.cardTitle {
		color: #fff;
		padding: 60rpx 30rpx;
		font-size: 40rpx;
		font-weight: 300;
		/* transform: skew(-10deg, 0deg); */
		position: relative;
		text-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.3)
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-image {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}
</style>
