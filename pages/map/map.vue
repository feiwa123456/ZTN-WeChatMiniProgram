<template>
	<view>
		<cu-custom :isBack="false"></cu-custom>
		<map id="myMap" ref="myMap" style="width:100%;height:100vh" :scale="scale" :longitude="longitude" :latitude="latitude"
		 :markers="markers" @markertap="markertap" @regionchange="regionchange"></map>
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
					 :up="upOption" @up="markerGetDeviceList">
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
				scale: 4.5,
				enlargeScale: false,
				longitude: 114.324520,
				latitude: 27.099994,
				markers: [],
				markerId: Number,
				productId: null,
				status: null,
				currentPage: 1,
				pageSize: 10,
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
			}
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.isLogin = isLogin
			isLogin && this.init()
		},
		methods: {
			init: function() {
				this.getProductTypeList()
				this.enlargeScale ? this.getCityDeviceNum() : this.getProvinceDeviceNum()
			},
			goToLogin: function(e) {
				uni.navigateTo({
					url: `/pages/login/login`
				});
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
			getProvinceDeviceNum: function() {
				deviceBelongApi.getProvinceDeviceNum(this).then((res) => {
					if (res.code == '200') {
						let markers = res.data
						this.setMarkers(markers)
					}
				})
			},
			getCityDeviceNum: function() {
				deviceBelongApi.getCityDeviceNum(this).then((res) => {
					if (res.code == '200') {
						let markers = res.data
						this.setMarkers(markers)
					}
				})
			},
			setMarkers: function(markers) {
				this.markers = []
				for (let i = 0; i < markers.length; i++) {
					let marker = {}
					marker.id = Number(markers[i].cityId ? markers[i].cityId : markers[i].provinceId)
					marker.width = 25;
					marker.height = 25;
					marker.latitude = Number(markers[i].lat);
					marker.longitude = Number(markers[i].lng);
					if (markers[i].num >= 99) {
						marker.iconPath = '../../static/numsImage/local_99.png';
					} else {
						marker.iconPath = '../../static/numsImage/local_' + markers[i].num + '.png';
					}
					this.$set(this.markers, i, marker)
				}
			},
			markertap: function(e) {
				// console.log(typeof e.detail.markerId)
				this.markerId = e.detail.markerId
				this.isShowDeviceList = true
				this.$emit('isShowNav', false);
				this.currentPage = 1
			},
			markerGetDeviceList: function() {
				let enlargeScale = this.enlargeScale
				let provinceId = enlargeScale ? null : this.markerId
				let cityId = enlargeScale ? this.markerId : null
				let productId = this.productId
				let status = this.status
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceBelongApi.MarkerGetDeviceList(this, provinceId, cityId, productId, status, currentPage, pageSize).then((res) => {
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
			regionchange: function() {
				let promise = new Promise((resolve) => {
					uni.createMapContext('myMap', this).getScale({
						success: (e) => {
							resolve(e)
						}
					})
				})
				promise.then((e) => {
					this.getDeviceNum(e)
				})
			},
			getDeviceNum: function(e) {
				let enlargeScale = this.enlargeScale
				let scale = e.scale
				if (scale < 7 && enlargeScale) {
					this.getProvinceDeviceNum()
					this.enlargeScale = false
				} else if (scale >= 7 && !enlargeScale) {
					this.getCityDeviceNum()
					this.enlargeScale = true
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
