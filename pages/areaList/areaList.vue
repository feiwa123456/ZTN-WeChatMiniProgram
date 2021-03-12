<template>
	<view class="">
		<cu-custom v-if="isToHome" :isHome="true">
		</cu-custom>
		<cu-custom v-else :isBack="true">
		</cu-custom>

		<view class="bg-white flex justify-between" :style="[{top:CustomBar + 'px'}]" style="position:fixed;right: 0;bottom: 0;left: 0;width:100%;height:100%;z-index: 1024;background-color: #f8f8f8;">
			<view class="bg-white" style="width:30%;height:100%;">
				<view id="areaModel" class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange"></text>{{i18n.areaList.areaModel}}
					</view>
				</view>
				<scroll-view scroll-y :style="style">
					<view class="ztnCustom-provinceBlock" v-for="(item,index) in provinceList" :key="index">
						<view @tap="showCityModal(item)" class="cu-bar bg-white" :style="(provinceId == item.provinceId ? 'background-color:#f8f8f8':'background-color:#ffffff')">
							<view class="action">
								{{item.province}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<view class="bg-white" style="width:66%;height:100%">
				<view class="cu-bar bg-white">
					<view class="action">
						<!-- {{i18n.number}} : {{cityTotal}} -->
						<text class="text-grey">{{city}}</text>
					</view>
				</view>
				<scroll-view @scrolltolower="scrolltolower" scroll-y :style="style" >
					<view class="margin-top-xs" v-for="(arrItem,arrIndex) in areaList" :key="arrIndex">
						<view v-for="(item,index) in arrItem" :key="index">
							<view class="flex justify-start align-center margin-bottom">
								<surplus class="surplus margin-right margin-left" id="surplus" :surplus="item.surplus"></surplus>
								<view class="text-lg" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceSensor")' :style="(item.statusColor == '#67c23a' ? 'color:#67c23a':'')">{{item.deviceName}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<view v-if="cityModal" style="position:fixed;left:0;bottom:0;width:100%;height:100%;background: rgba(0, 0, 0, 0.6);z-index: 1024">
			<view class="bg-white padding-bottom " style="position:fixed;width:100%;bottom:0;z-index: 1024;border-top-left-radius:20upx;border-top-right-radius:20upx">
				<view class="flex justify-between">
					<view class="margin lg" @tap="hideCityModal">{{i18n.cancel}}</view>
				</view>
				<view class="flex justify-start flex-wrap">
					<view class="margin margin-bottom-xs" v-for="(item,index) in cityList" :key="index">
						<button @tap="selectCity(item)" class="cu-btn block lg" :class="cityId == item.cityId ? 'bg-grey' : 'line-grey'">{{item.city}}</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as deviceBelongApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceBelongApi/deviceBelongApi.js'
	import surplus from '@/components/ztn-custom/surplus/surplus.vue'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				style: '',
				provinceList: [],
				provinceId: '',
				currentProvinceId: '',
				cityModal: false,
				cityList: [],
				cityId: Number,
				city: '',
				currentPage: 1,
				pageSize: 30,
				areaList: [],
				hasMoreData: true
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onReady: function() {
			let CustomBar = this.CustomBar
			let screenHeight = uni.getStorageSync('screenHeight')
			let areaHeight = uni.getStorageSync('areaHeight')
			if (areaHeight) {
				this.style = `height:${screenHeight - areaHeight - CustomBar}px`
			} else {
				uni.createSelectorQuery().select('#areaModel').boundingClientRect((e) => {
					this.style = `height:${screenHeight - e.height - CustomBar}px`
					uni.setStorageSync('areaHeight', e.height)
				}).exec()
			}
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin ? this.getProvinceList() : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.getProvinceList(), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			getProvinceList: function() {
				deviceBelongApi.getProvinceDeviceNum(this).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let index = 0; index < data.length; index++) {
							let {
								province,
								provinceId
							} = data[index];
							list.push({
								province,
								provinceId
							})
						}
						this.provinceList = list
						this.provinceId = list[0].provinceId
						this.getCityList(this.provinceId, true)
					}
				})
			},
			getCityList: function(provinceId, first) {
				deviceBelongApi.getCityDeviceNum(this, {
					provinceId: provinceId
				}).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let index = 0; index < data.length; index++) {
							let {
								cityId,
								city
							} = data[index];
							list.push({
								cityId,
								city,
							})
						}
						this.cityList = list
						if (first) {
							let {cityId,city} = list[0]
							this.cityId = cityId
							this.city = city
							this.getAreaList()
						}
					}
				})
			},
			getAreaList: function() {
				let cityId = this.cityId
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceBelongApi.getAreaDeviceNum(this, cityId, currentPage, pageSize).then((res) => {
					if (res.code == '200') {
						let {
							currentPage,
							data,
							total
						} = res.data
						// this.cityTotal = total
						let lastPage = Math.ceil(total / pageSize)
						let list = this.$uniUtilsApi.initDeviceList(this.i18n.status, data)
						let index = currentPage - 1
						this.$set(this.areaList, index, list)
						this.hasMoreData = lastPage >= currentPage ? true : false
						this.currentPage = currentPage + 1
					}
				})
			},
			showCityModal: function(provinceItem) {
				let provinceId = provinceItem.provinceId
				this.currentProvinceId = provinceId
				this.getCityList(provinceId, false)
				this.cityModal = true
			},
			hideCityModal: function() {
				this.cityModal = false
			},
			selectCity: function(cityItem) {
				this.city = cityItem.city
				this.cityId = cityItem.cityId
				this.provinceId = this.currentProvinceId
				this.areaList = []
				this.currentPage = 1
				this.getAreaList()
				this.hideCityModal()
			},
			deviceNavigation: function(deviceName, deviceCore, pageCur) {
				uni.navigateTo({
					url: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&deviceCore=${deviceCore}&pageCur=${pageCur}`
				})
			},
			scrolltolower: function() {
				let hasMoreData = this.hasMoreData
				hasMoreData ?  this.getAreaList() :this.$uniUtilsApi.showToast(this.i18n.hasMoreData, 'none', 1000, false)
			}
		},
		components: {
			surplus
		},
		onShareAppMessage: function(res) {
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: '/pages/areaList/areaList',
				success: (res) => {
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #f8f8f8;
	}
</style>
