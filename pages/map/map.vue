<template>
	<view>
		<cu-custom :isBack="false"></cu-custom>
		<map v-if="isShowMap" id="myMap" ref="myMap" style="width:100%;height:100vh" :scale="scale" :longitude="longitude"
		 :latitude="latitude" :markers="markers" @markertap="markertap" @regionchange="regionchange"></map>
		<view v-if="isShowDeviceList" class="ztnCustom-background-color" style="background: rgba(112, 200, 226,0.2);">
			<view class="cu-bar bg-white solid-bottom" :style="[{top:CustomBar + 'px'}]">
				<view class="flex align-center justify-start margin" style="white-space: nowrap">
					<text>{{i18n.number}} : {{totalDeviceNum}}</text>
				</view>
				<view class="flex align-center justify-end margin flex-sub" style="white-space: nowrap;">
					<picker @change="productStatusChange" :value="currentStatusIndex" :range='i18n.map.productStatusList'>
						<view class="padding-right-sm" :class="[currentStatusIndex != 0 ? 'text-bold text-lg text-grey':'text-grey']">{{i18n.map.productStatusList[currentStatusIndex]}}</view>
					</picker>
					<view>|</view>
					<picker @change="productTypeChange" :value="currentTypeIndex" :range='productTypeList'>
						<view class="padding-left-sm" :class="[currentTypeIndex != 0 ? 'text-bold text-lg text-grey':'text-grey']">{{productTypeList[currentTypeIndex]}}</view>
					</picker>
				</view>

				<view class="bg-white" style="height:865upx;position:fixed;width:100%;bottom:0;z-index:998;border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
					<view class="padding-tb-xs text-center" id="hideButton" @tap="hideDeviceList">
						<image class="ztnCustom-hideIcon" :src="hideIcon"></image>
					</view>
					<mescroll-uni ref="mescrollRef" @init="mescrollInit" height="800upx" top="10" :down="downOption" @down="downCallback"
					 :up="upOption" @up="byMarkerPageGetDeviceList">
						<view v-for="(arrItem,arrIndex) in deviceList" :key="arrIndex">
							<view v-for="(item,index) in arrItem" :key="index">
								<view :class="modalDeviceName == item.deviceName?'ztnCustom-move-cur':''" class="flex align-center padding-tb solid-bottom ztnCustom-cur"
								 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-deviceName="item.deviceName">
									<view class="cu-avatar lg margin-lr" :style="[{backgroundImage:`url(${item.deviceIcon})`}]" style="background-color:rgba(0,0,0,0)"></view>
									<view class="flex-sub" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceInfo")'>
										<view class="flex align-center justify-between">
											<view class="margin-bottom-xs text-cut text-lg text-bold" style="width:42vw">{{item.deviceName}}</view>
											<view class="flex align-center justify-center margin-bottom-xs">
												<surplus class="surplus" id="surplus" :surplus="item.surplus"></surplus>
												<text :style="{color:item.statusColor}" style="width:16vw" class="text-center">{{item.deviceStatu}}</text>
											</view>
										</view>
										<view class=" margin-bottom-xs">{{item.deviceCore}}</view>
										<view class="text-cut text-gray" style="width:75vw">{{item.deviceAddr}}</view>
									</view>
									<view class="ztnCustom-move">
										<view class='bg-green light text-center view' @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceController")'>
											<text class="cuIcon-repairfill padding-right-xs text-xl"></text>
											<text>{{i18n.map.controller}}</text>
										</view>
										<view class='bg-blue light text-center view' @tap='navigation(item)'>
											<text class="cuIcon-footprint padding-right-xs text-xl"></text>
											<text>{{i18n.map.navigation}}</text>
										</view>
									</view>

								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</view>

		<view v-else style="position:fixed;top:0;right:0;z-index: 1024" :style="[{top:CustomBar + 'px'}]">
			<view class="text-center margin">
				<text class="cuIcon-list" style="border-top-left-radius:6px;border-bottom-left-radius:6px;padding: 15rpx 30rpx;font-size: 36rpx"
				 :style="showMode == 'listMode' ? selectStyle : unselectStyle" @tap="tapMode('listMode')"></text>
				<text class="cuIcon-radiobox" style="border-top-right-radius:6px;border-bottom-right-radius:6px;padding: 15rpx 30rpx;font-size: 36rpx;"
				 :style="showMode == 'pointMode' ? selectStyle : unselectStyle" @tap="tapMode('pointMode')"></text>
			</view>
		</view>

		<!--  #ifdef H5 || MP-WEIXIN  -->
		<mapFav v-if="!isLogin" class="ztnCustom-mapFav" v-on:parentEvent="goToLogin" :loginForMore="i18n.leadGotoLogin.loginForMore"
		 :immediateLoginText="i18n.leadGotoLogin.immediateLoginText"></mapFav>
		<!-- #endif -->
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import surplus from '@/components/ztn-custom/surplus/surplus.vue'
	import mapFav from '@/components/ztn-custom/mapFav/mapFav.vue'
	import * as deviceBelongApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceBelongApi/deviceBelongApi.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				downOption: {
					use: false,
					auto: false, //是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					empty: {
						use: true,
						fixed: true,
						top: '10%'
					}
				},
				CustomBar: this.CustomBar,
				isLogin: true,
				isLoginOverdue: false,
				isShowMap: true,
				showMode: '',
				selectStyle: '',
				unselectStyle: '',
				enlargeScaleToListMode: false,
				enlargeScaleToPointMode: false,
				scale: 4.5,
				beforeScale: 4.5,
				longitude: 114.324520,
				latitude: 27.099994,
				markers: [],
				markerId: Number,
				currentPage: 1,
				pageSize: 10,
				productId: null,
				status: null,
				currentStatusIndex: 0,
				currentTypeIndex: 0,
				productTypeList: [],
				productTypeData: [],
				deviceList: [],
				isShowDeviceList: false,
				totalDeviceNum: 0,
				hideIcon: '../../static/images/down.png',
				modalDeviceName: '',
				listTouchStart: 0,
				listTouchDirection: null,
			}
		},
		name: 'mapComponent',
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
			this.selectStyle = `background:${emphasizeColor};color:#fff;border:2upx solid ${emphasizeColor}`
			this.unselectStyle = `background:#fff;color:${emphasizeColor};border:2upx solid ${emphasizeColor}`
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.isLogin = isLogin
			isLogin && this.init()
		},
		methods: {
			init: function() {
				let showMode = uni.getStorageSync('showMode') || 'listMode'
				this.showMode = showMode
				this.getProductTypeList()
				this.getProvinceDeviceNum()
			},
			tapMode: function(option) {
				let showMode = this.showMode
				if (showMode == option) return
				this.isShowMap = false
				this.$nextTick(() => {
					this.markers = []
					this.isShowMap = true
					this.showMode = option
					this.enlargeScaleToListMode = false
					this.enlargeScaleToPointMode = false
					this.scale = 4.5
					this.longitude = 114.324520
					this.latitude = 27.099994
					this.markerId = null
					this.getProvinceDeviceNum()
					uni.setStorageSync('showMode', option)
				})
			},
			getProvinceDeviceNum: function() {
				deviceBelongApi.getProvinceDeviceNum(this).then((res) => {
					if (res.code == '200') {
						let data = res.data
						this.setMarkers(data)
					}
				})
			},
			getCityDeviceNum: function() {
				deviceBelongApi.getCityDeviceNum(this).then((res) => {
					if (res.code == '200') {
						let data = res.data
						this.setMarkers(data)
					}
				})
			},
			setMarkers: function(data) {
				this.markers = []
				let markers = []
				for (let i = 0; i < data.length; i++) {
					let marker = {}
					marker.id = Number(data[i].cityId ? data[i].cityId : data[i].provinceId)
					marker.width = 25
					marker.height = 25
					marker.latitude = Number(data[i].lat)
					marker.longitude = Number(data[i].lng)
					if (data[i].num >= 99) {
						marker.iconPath = '../../static/numsImage/local_99.png'
					} else {
						marker.iconPath = '../../static/numsImage/local_' + data[i].num + '.png'
					}
					markers.push(marker)
				}
				this.markers = markers
			},
			setPointMarkers: function(data) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, true)
				this.markers = []
				let markers = []
				for (let i = 0; i < data.length; i++) {
					let marker = {}
					marker.id = i
					marker.width = 25
					marker.height = 25
					marker.latitude = Number(data[i].lat)
					marker.longitude = Number(data[i].lng)
					marker.mode = 'point'
					marker.iconPath = '../../static/images/gps.png'
					marker.deviceName = data[i].deviceName
					marker.deviceCore = data[i].deviceCore
					marker.pageCur = 'deviceInfo'
					markers.push(marker)
				}
				this.markers = markers.length > 6000 ? markers.slice(0, 6000) : markers
				setTimeout(() => {
					this.$uniUtilsApi.hideLoading()
				}, 1000)
			},
			markertap: function(e) {
				let markerId = e.detail.markerId
				this.markerId = markerId
				let showMode = this.showMode
				showMode == 'listMode' ? this.markertapListMode() : this.markertapPointMode()
			},
			markertapListMode: function() {
				this.isShowDeviceList = true
				this.$emit('isShowNav', false);
				this.currentPage = 1
			},
			markertapPointMode: function() {
				let markers = this.markers
				let mode = markers[0].mode
				if (mode == 'point') {
					let markerId = this.markerId
					let {
						deviceName,
						deviceCore,
						pageCur
					} = markers[markerId]
					this.deviceNavigation(deviceName, deviceCore, pageCur)
				} else {
					this.byMarkerGetDeviceList()
				}
			},
			byMarkerPageGetDeviceList: function() {
				let enlargeScaleToListMode = this.enlargeScaleToListMode
				let provinceId = enlargeScaleToListMode ? null : this.markerId
				let cityId = enlargeScaleToListMode ? this.markerId : null
				let productId = this.productId
				let status = this.status
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceBelongApi.byMarkerPageGetDeviceList(this, provinceId, cityId, productId, status, currentPage, pageSize).then(
					(
						res) => {
						if (res.code == '200') {
							let {
								currentPage,
								data,
								total
							} = res.data
							this.totalDeviceNum = total
							this.mescroll.endByPage(data.length, total)
							let index = currentPage - 1
							let list = this.$uniUtilsApi.initDeviceList(this.i18n.status, data)
							this.$set(this.deviceList, index, list)
							this.currentPage = currentPage + 1
						}
					})
			},
			byMarkerGetDeviceList: function() {
				let provinceId = this.markerId
				deviceBelongApi.byMarkerGetDeviceList(this, provinceId).then((res) => {
					if (res.code == '200') {
						this.isShowMap = false
						this.$nextTick(() => {
							this.isShowMap = true
							let data = res.data
							this.setPointMarkers(data)
							this.latitude = data[0].lat
							this.longitude = data[0].lng
							this.scale = 7
							setTimeout(() => {
								this.enlargeScaleToPointMode = true
							}, 1000)
						})
					}
				})
			},
			getScale: function() {
				let mapContext = uni.createMapContext('myMap', this);
				let promise = new Promise((resolve) => {
					mapContext.getScale({
						success: (e) => {
							resolve(e)
						}
					})
				})
				return promise
			},
			regionchange: function() {
				let promise = this.getScale()
				promise.then((e) => {
					let showMode = this.showMode
					if (showMode == 'listMode') {
						this.getDeviceNumToListMode(e)
					} else if (showMode == 'pointMode') {
						this.getDeviceNumToPointMode(e)
					}
				})
			},
			getDeviceNumToListMode: function(e) {
				let scale = e.scale
				let enlargeScaleToListMode = this.enlargeScaleToListMode
				if (scale < 6 && enlargeScaleToListMode) {
					this.getProvinceDeviceNum()
					this.enlargeScaleToListMode = false
				} else if (scale >= 6 && !enlargeScaleToListMode) {
					this.getCityDeviceNum()
					this.enlargeScaleToListMode = true
				}
			},
			getDeviceNumToPointMode: function(e) {
				let scale = e.scale
				let beforeScale = this.beforeScale
				this.beforeScale = e.scale
				let enlargeScaleToPointMode = this.enlargeScaleToPointMode
				if (scale < 6 && scale < beforeScale && enlargeScaleToPointMode) {
					this.enlargeScaleToPointMode = false
					this.getProvinceDeviceNum()
				}
			},
			hideDeviceList: function() {
				this.isShowDeviceList = false
				this.$emit('isShowNav', true);
				this.currentStatusIndex = 0
				this.currentTypeIndex = 0
				this.status = null
				this.productId = null
				this.currentPage = 1
				this.deviceList = []
			},
			ListTouchStart: function(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			ListTouchMove: function(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			ListTouchEnd: function(e) {
				if (this.listTouchDirection == 'left') {
					this.modalDeviceName = e.currentTarget.dataset.devicename
				} else {
					this.modalDeviceName = null
				}
				this.listTouchDirection = null
			},
			deviceNavigation: function(deviceName, deviceCore, pageCur) {
				uni.navigateTo({
					url: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&deviceCore=${deviceCore}&pageCur=${pageCur}`
				})
			},
			navigation: function(e) {
				let deviceLat = e.deviceLat
				let deviceLng = e.deviceLng
				let deviceName = e.deviceName
				let deviceAddr = e.deviceAddr
				uni.getLocation({ //获取当前经纬度
					type: 'wgs84',
					success: (res) => {
						uni.openLocation({ //​使用微信内置地图查看位置。
							latitude: deviceLat,
							longitude: deviceLng,
							name: deviceName,
							address: deviceAddr,
							success: () => {}
						})
					}
				})
			},
			getProductTypeList: function() {
				let userId = uni.getStorageSync('userId')
				deviceBelongApi.getProductTypeList(this, userId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let {
							productTypeList,
							productTypeData
						} = this.$uniUtilsApi.handleProductType(this, data)
						this.productTypeList = productTypeList
						this.productTypeData = productTypeData
					}
				})
			},
			productStatusChange: function(e) {
				let statusArray = [null, 'ONLINE', 'OFFLINE', 'UNACTIVE', 'DISABLE']
				let index = e.detail.value
				this.currentStatusIndex = index
				this.status = statusArray[index]
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.resetUpScroll()
			},
			productTypeChange: function(e) {
				let index = e.detail.value
				this.currentTypeIndex = index
				this.productId = this.productTypeData[index].productId
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.resetUpScroll()
			},
			goToLogin: function(e) {
				uni.navigateTo({
					url: `/pages/login/login`
				})
			},
		},
		components: {
			mapFav,
			surplus,
		}
	}
</script>

<style scoped>
	.ztnCustom-background-color {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		z-index: 998;
		background: rgba(0, 0, 0, 0.6);

	}

	.ztnCustom-hideIcon {
		width: 45upx;
		height: 45upx;
		background-size: 100% 100%;
	}

	.ztnCustom-cur {
		transition: all .6s ease-in-out 0s;
		transform: translateX(0upx)
	}

	.ztnCustom-move-cur {
		transform: translateX(-300rpx)
	}

	.ztnCustom-move {
		position: absolute;
		z-index: 999;
		right: 0;
		display: flex;
		width: 300rpx;
		height: 100%;
		transform: translateX(100%);
	}

	.ztnCustom-move .view {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center
	}

	.ztnCustom-mapFav {
		position: fixed;
		width: 100%;
		bottom: 15%;
	}

	/*说明*/
	.notice {
		font-size: 30upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}

	/*展示上拉加载的数据列表*/
	.news-li {
		font-size: 32upx;
		padding: 32upx;
		border-bottom: 1upx solid #eee;
	}

	.news-li .new-content {
		font-size: 28upx;
		margin-top: 10upx;
		margin-left: 20upx;
		color: #666;
	}
</style>
