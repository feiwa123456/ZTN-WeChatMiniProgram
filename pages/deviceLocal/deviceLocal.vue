<template>
	<view class="">
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<map v-if="isShowMap" id="myMap" style="width: 100%;height: 400upx" :scale="scale" :longitude="longitude" :latitude="latitude"
		 :markers="markers"></map>
		<scroll-view scroll-y="true" :style="scrollStyle">
			<view class="cu-timeline" v-for="(item,index) in deviceLocalList" :key="index">
				<view class="cu-time" v-if="item.status=='OFFLINE'">{{i18n.precision}}:{{item.radius}}</view>
				<view class="cu-item cuIcon-attentionfill" :style="[{color:lightColor}]">
					<view class="content" style="background-color:#f8f8f8;">
						<view class="flex justify-between align-center">
							<view style="flex-basis:90%;" @tap="tapMarker(item)">
								<view><text class="text-gray">{{i18n.serial}}:{{index+1}}</text><text class="text-gray margin-left">{{item.timestamp | formatDateTime(i18n.unknown)}}</text></view>
								<view style="color:#666666">{{item.address}}</view>
							</view>
							<view @tap="navigation(item)">
								<text class="cuIcon-footprint" style="font-size: 44upx;" :style="[{color:emphasizeColor}]"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="cu-modal" :class="[isShowAuthorizeModal ?'show':'']">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{i18n.authorize}}</view>
					<view class="action" @tap="hideAuthorizeModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{i18n.leadGoAuthorize}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" :style="[{borderColor:emphasizeColor,color:emphasizeColor}]" @tap="hideAuthorizeModal">{{i18n.cancel}}</button>
						<button class="cu-btn bg-green margin-left" :style="[{backgroundColor:emphasizeColor}]" open-type="openSetting"
						 @opensetting='authorizeManage'>{{i18n.confirm}}</button>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import * as deviceLocalApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceLocalApi/deviceLocalApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				navigationBarTextColor: '',
				emphasizeColor: '',
				lightColor: '',
				scrollStyle: '',
				isShowMap: false,
				scale: 8,
				longitude: '',
				latitude: '',
				markers: [],
				deviceLocalList: [],
				deviceName: '',
				deviceCore: '',
				currentPage: 1,
				pageSize: 50,
				isShowAuthorizeModal: false,
				navigationItem: null,
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
		onReady: function() {
			this.navigationBarTextColor = this.themei18n.navigationBarTextColor
			let theme = this.themei18n.theme
			let light;
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
			this.lightColor = this.themei18n.lightColor[light]
			this.emphasizeColor = this.themei18n.emphasizeColor
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.initOption = option
			isLogin ? this.init(option) : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let initOption = this.initOption
			let fromLoginBack = this.fromLoginBack
			fromLoginBack ? (this.init(initOption), this.fromLoginBack = false, this.isLoginOverdue = false) : ''
		},
		methods: {
			init: function(option) {
				this.deviceName = option.deviceName
				this.deviceCore = option.deviceCore
				this.getDeviceLocal();
			},
			getDeviceLocal: function() {
				let deviceCore = this.deviceCore
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceLocalApi.getDeviceLocal(this, deviceCore, currentPage, pageSize).then((res) => {
					if (res.code == '200') {
						let data = res.data.data;
						let page = currentPage - 1
						if (data.length < 1) {
							let title = this.i18n.noData
							this.$uniUtilsApi.showToast(title, 'none', 1000, false)
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1000);
							return
						}
						for (let i = 0; i < data.length; i++) {
							let marker = {}
							let list = {}
							var latitude = Number(data[i].lat)
							var longitude = Number(data[i].lng)
							marker.width = 25;
							marker.height = 25;
							marker.latitude = latitude
							marker.longitude = longitude
							marker.iconPath = `../../static/numsImage/local_${i + 1}.png`;
							this.$set(this.markers, i, marker)
							list.timestamp = data[i].timestamp
							list.radius = data[i].radius + '米'
							list.address = data[i].address
							list.lat = data[i].lat
							list.lng = data[i].lng
							this.$set(this.deviceLocalList, i, list)
						}
						this.latitude = latitude
						this.longitude = longitude
						this.isShowMap = true
						let CustomBar = this.CustomBar
						let screenHeight = uni.getStorageSync('screenHeight')
						let mapHeight = uni.getStorageSync('mapHeight')
						if (mapHeight) {
							//#ifdef MP-WEIXIN
							this.scrollStyle = `height:${screenHeight - mapHeight - CustomBar}px`
							//#endif
							//#ifdef H5 || APP-PLUS
							this.scrollStyle = `height:calc(${screenHeight}px - ${mapHeight}upx - ${CustomBar}px)`
							//#endif
						} else {
							this.$nextTick(() => {
								setTimeout(() => {
									//#ifdef MP-WEIXIN
									uni.createSelectorQuery().select('#myMap').boundingClientRect((e) => {
										let height = e.height
										this.scrollStyle = `height:${screenHeight - height - CustomBar}px`
										uni.setStorageSync('mapHeight', height)
									}).exec()
									//#endif
									//#ifdef H5 || APP-PLUS
									this.scrollStyle = `height:calc(${screenHeight}px - 400upx - ${CustomBar}px)`
									uni.setStorageSync('mapHeight', 400)
									//#endif
								}, 200)
							})
						}
					}
				})
			},
			tapMarker: function(e) {
				let latitude = e.lat
				let longitude = e.lng
				this.latitude = latitude
				this.longitude = longitude
			},
			navigation: function(e) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, true)
				let deviceName = this.deviceName
				let latitude = e.lat
				let longitude = e.lng
				let address = e.address
				uni.getLocation({ //获取当前经纬度
					type: 'wgs84',
					success: (res) => {
						this.$uniUtilsApi.hideLoading()
						uni.openLocation({ //​使用微信内置地图查看位置。
							latitude: latitude,
							longitude: longitude,
							name: deviceName,
							address: address,
						})
					},
					fail: (err) => {
						this.$uniUtilsApi.hideLoading()
						this.navigationItem = e
						this.showAuthorizeModal()
					}
				})
			},
			showAuthorizeModal: function() {
				this.isShowAuthorizeModal = true
			},
			hideAuthorizeModal: function() {
				this.isShowAuthorizeModal = false
			},
			authorizeManage: function(e) {
				let authSetting = e.detail.authSetting
				if (authSetting['scope.userLocation']) {
					let navigationItem = this.navigationItem
					this.hideAuthorizeModal()
					this.navigation(navigationItem)
				}
			}
		},
		onShareAppMessage: function(res) {
			let deviceName = this.deviceName
			let deviceCore = this.deviceCore
			let nickName = uni.getStorageSync('nickName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${deviceName}`,
				path: `/pages/deviceLocal/deviceLocal?deviceName=${deviceName}&&deviceCore=${deviceCore}`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style>
</style>
