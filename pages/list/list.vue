<template>
	<view>
		<cu-custom :isCustom="isLogin" :customIcon="customIcon" v-on:parentEvent="areaList">
		</cu-custom>
		<view v-if="isLogin && isShowNavScroll" id="navScroll" style="position: fixed;width:100%;z-index: 1024;box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);"
		 :style="[{top:`${CustomBar}px`}]">
			<view class="cu-bar bg-white search" style="box-shadow: 0 0 0 rgba(0, 0, 0, 0);">
				<view class="search-form round margin" style="width:80rpx;height:80rpx;">
					<text class="cuIcon-search" style="color:grey;font-size: 36upx;"></text>
					<input style="width:80rpx;height:80rpx;" type="text" confirm-type="search" :placeholder="i18n.list.searchDevice"
					 @confirm="tapSearchName" :value="searchNameInput" @input="searchNameInputChange">
					</input>
					<view v-if="searchNameInput!=''" class="cuIcon-roundclosefill text-gray" style="font-size: 40upx;" @tap="deleteSearchName"></view>
				</view>
				<button v-if="isShowSearchButton" class="cu-btn margin-right bg-red" @tap="tapSearchName">{{i18n.search}}</button>
			</view>
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation>
				<view class="flex text-center">
					<view class="cu-item flex-sub">
						<picker @change="productStatusChange" :value="currentStatusIndex" :range='i18n.list.productStatusList'>
							<view :class="currentStatusIndex != 0 ?'text-bold text-lg':''">{{i18n.list.productStatusList[currentStatusIndex]}}</view>
						</picker>
					</view>
					<view class="cu-item flex-sub">
						<picker mode="multiSelector" @change="typeSeriesChange" @columnchange="typeSeriesColumnchange" :value="currentTypeSeriesIndexCopy"
						 :range='productTypeSeriesListCopy'>
							<view :class="currentTypeSeriesIndex[0] != 0 || currentTypeSeriesIndex[1] != 0 ?'text-bold text-lg':''">{{productTypeSeriesList[0][currentTypeSeriesIndex[0]]}}({{productTypeSeriesList[1][currentTypeSeriesIndex[1]]}})</view>
						</picker>
					</view>
					<view class="cu-item flex-sub">
						<picker @change="productAlarmChange" :value="currentAlarmIndex" :range='i18n.list.productAlarmList'>
							<view :class="currentAlarmIndex != 0 ?'text-bold text-lg':''">{{i18n.list.productAlarmList[currentAlarmIndex]}}</view>
						</picker>
					</view>
					<view class="cu-item flex-sub" v-if="productGroupList.length != 0">
						<picker @change="productGroupChange" :value="currentGroupIndex" :range='productGroupList'>
							<view :class="currentGroupIndex != 0 ?'text-bold text-lg':''">{{productGroupList[currentGroupIndex]}}</view>
						</picker>
					</view>
					<view class="cu-item flex-sub" v-if="productPageList.length != 0">
						<picker @change="productPageChange" :value="currentPageIndex" :range='productPageList'>
							<view :class="currentPageIndex != 0 ?'text-bold text-lg':''">{{productPageList[currentPageIndex]}}</view>
						</picker>
					</view>
				</view>
			</scroll-view>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="getDeviceList">
			<view v-if="isLogin && isShowList" class="bg-white" :style="{'marginTop':`${navScrollHeight}px`}">
				<view v-for="(arrItem,arrIndex) in deviceList" :key="arrIndex">
					<view v-for="(item,index) in arrItem" :key="index">
						<view class="flex align-center justify-between padding-top padding-left-sm padding-right">
							<image class="ztnCustom-deviceIcon" style="margin-right: 20rpx;
			width: 96upx;
			height: 96upx;" :src='item.deviceIcon'
							 @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceInfo")'></image>
							<view class="flex-sub">
								<view class=" flex align-center justify-between">
									<view class="padding-bottom-xs text-lg text-bold text-cut" style="width:42vw" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceInfo")'>{{item.deviceName}}</view>
									<view class="flex align-center justify-center padding-bottom-xs ">
										<surplus class="surplus margin-right-sm" id="surplus" :status="item.status" :charging="item.charging"
										 :surplus="item.surplus" :powerType="item.powerType"></surplus>
										<view :style="{color:`${item.statusColor}`}" style="width:85rpx" class="text-center">{{item.deviceStatu}}</view>
									</view>
								</view>
								<view class="flex align-center justify-between">
									<view>
										<view class="padding-bottom-xs" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceInfo")'>{{item.deviceCore}}</view>
										<view class="text-cut text-gray" style="width:60vw" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceInfo")'>
											{{item.deviceAddr}}
										</view>
									</view>
									<view class="cuIcon-settingsfill text-bold text-center" @tap='deviceNavigation(item.deviceName,item.deviceCore,"deviceController")'
									 style="font-size:44rpx;width:85rpx"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<listFav v-if="!isLogin" v-on:parentEvent="goToLogin" :imageSrc="imageSrc" :unLogStatuTxt="i18n.leadGotoLogin.unLogStatuTxt"
			 :immediateLoginText="i18n.leadGotoLogin.immediateLoginText"></listFav>
		</mescroll-body>
		<view :style="[{paddingBottom:`${tabbarHeight}px`}]"></view>
	</view>
</template>

<script>
	import * as deviceBelongApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceBelongApi/deviceBelongApi.js'
	import * as deviceGroupApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceGroupApi/deviceGroupApi.js'
	import surplus from '@/components/ztn-custom/surplus/surplus.vue'
	import listFav from '@/components/ztn-custom/listFav/listFav.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				CustomBar: this.CustomBar,
				isLogin: true,
				isLoginOverdue: false,
				customIcon: 'cuIcon-sort',
				downOption: {
					use: true,
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					use: true,
					auto: false,
					empty: {
						use: true,
						fixed: true,
						top: '25%'
					},
				},
				imageSrc: '/static/images/noContent.png',
				navScrollHeight: 0,
				isShowNavScroll: false,
				isShowList: false,
				searchNameInput: '',
				isShowSearchButton: false,
				productTypeList: [],
				productTypeData: [],
				productSeriesList: [],
				productSeriesData: [],
				productTypeSeriesList: [],
				productTypeSeriesListCopy: [],
				productGroupList: [],
				productGroupData: [],
				productPageList: [],
				currentStatusIndex: 0,
				currentTypeSeriesIndex: [0, 0],
				currentTypeSeriesIndexCopy: [0, 0],
				currentAlarmIndex: 0,
				currentGroupIndex: 0,
				currentPageIndex: 0,
				deviceList: [],
				searchStatus: null,
				productId: null,
				seriesId: null,
				groupId: null,
				searchName: null,
				todayOnline: false,
				warnDesc: false,
				currentPage: 1,
				pageSize: 10,
			}
		},
		name: 'listComponent',
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		props: {
			currentProductId: {
				type: [Number, String],
				default: null
			},
			tabbarHeight: {
				type: [Number, String],
				default: ''
			},
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.isLogin = isLogin
			isLogin && this.init()
		},
		methods: {
			refresh: function() {
				this.mescroll.scrollTo(0, 300)
				setTimeout(()=>{
					this.mescroll.triggerDownScroll()
				},500)
			},
			init: function() {
				let productId = this.currentProductId
				this.productId = productId
				this.getDeviceList()
				this.getProductGroupList()
				this.getTypeSeries().then(res => {
					let productTypeList = this.productTypeList
					let productTypeData = this.productTypeData
					let productSeriesList = this.productSeriesList
					this.productTypeSeriesList = [productTypeList, productSeriesList]
					this.productTypeSeriesListCopy = [productTypeList, productSeriesList]
					let index = productTypeData.findIndex((item) => item.productId === productId)
					this.currentTypeSeriesIndex = [index, 0]
					this.currentTypeSeriesIndexCopy = [index, 0]
				})
			},
			downCallback: function() {
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.resetUpScroll()
			},
			getTypeSeries: async function() {
				let productId = this.productId
				await this.getProductTypeList();
				if (productId) {
					await this.getProductSeriesList();
				} else {
					this.handleProductSeriesList([])
				}
			},
			getProductTypeList: function() {
				let userId = uni.getStorageSync('userId')
				return new Promise((resolve, reject) => {
					deviceBelongApi.getProductTypeList(this, userId).then((res) => {
						if (res.code == '200') {
							let data = res.data
							let {
								productTypeList,
								productTypeData
							} = this.$uniUtilsApi.handleProductType(this, data)
							this.productTypeList = productTypeList
							this.productTypeData = productTypeData
							resolve()
						}
					})
				})
			},
			getProductSeriesList: function() {
				let userId = uni.getStorageSync('userId')
				let productId = this.productId
				return new Promise((resolve, reject) => {
					deviceBelongApi.getProductSeries(this, userId, productId).then((res) => {
						if (res.code == '200') {
							let data = res.data
							this.handleProductSeriesList(data)
							resolve()
						}
					})
				})
			},
			handleProductSeriesList: function(data) {
				let {
					productSeriesList,
					productSeriesData
				} = this.$uniUtilsApi.handleProductSeries(this, data)
				this.productSeriesList = productSeriesList
				this.productSeriesData = productSeriesData
			},
			getProductGroupList: function() {
				let userId = uni.getStorageSync('userId')
				deviceGroupApi.getProductGroupList(this, userId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let {
							productGroupList,
							productGroupData
						} = this.$uniUtilsApi.handleProductGroup(this, data)
						this.productGroupList = productGroupList
						this.productGroupData = productGroupData
					}
				})
			},
			getDeviceList: function() {
				let userId = uni.getStorageSync('userId')
				let searchStatus = this.searchStatus
				let productId = this.productId
				let seriesId = this.seriesId
				let searchName = this.searchName
				let todayOnline = this.todayOnline
				let warnDesc = this.warnDesc
				let groupId = this.groupId
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceBelongApi.getDeviceList(this, userId, searchStatus, productId, seriesId, searchName, todayOnline, warnDesc,
					groupId,
					currentPage,
					pageSize).then((res) => {
					if (res.code == '200') {
						let {
							currentPage,
							data,
							total
						} = res.data
						if (!this.isShowNavScroll) {
							this.isShowNavScroll = true
							let navScrollHeight = uni.getStorageSync('navScrollHeight')
							if (navScrollHeight) {
								this.navScrollHeight = navScrollHeight
								this.isShowList = true
							} else {
								this.$nextTick(() => {
									setTimeout(() => {
										uni.createSelectorQuery().in(this).select('#navScroll').boundingClientRect((e) => {
											let height =  e.height
											this.navScrollHeight = height
											this.isShowList = true
											uni.setStorageSync('navScrollHeight', height)
										}).exec()
									}, 200)
								})
							}
						}
						let lastPage = Math.ceil(total / pageSize)
						let pageList = [];
						for (let i = 1; i <= lastPage; i++) {
							let page = this.i18n.list.page
							let the = this.i18n.list.the
							pageList.push(this._i18n.locale == 'en' ? page + i : the + i + page)
						}
						this.productPageList = pageList
						this.mescroll.endByPage(data.length, total)
						let list = this.$uniUtilsApi.initDeviceList(this.i18n.status, data)
						let index = currentPage - 1
						this.$set(this.deviceList, index, list)
						this.currentPageIndex = index
						this.currentPage = currentPage + 1
					}
				})
			},
			productStatusChange: function(e) {
				let statusArray = [null, 'ONLINE', 'OFFLINE', 'UNACTIVE', 'DISABLE']
				let index = e.detail.value
				this.currentStatusIndex = index
				this.searchStatus = statusArray[index]
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			typeSeriesColumnchange: function(e) {
				// console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				let column = e.detail.column
				let value = e.detail.value
				switch (column) {
					case 0: //拖动第1列
						if (value != 0) {
							let productTypeData = this.productTypeData
							this.productId = productTypeData[value].productId
							let promise = this.getProductSeriesList()
							promise.then((res) => {
								let productSeriesList = this.productSeriesList
								let productSeriesData = this.productSeriesData
								this.$set(this.productTypeSeriesListCopy, 1, productSeriesList)
								this.currentTypeSeriesIndexCopy = [value, 0]
							})
						} else {
							this.$set(this.productTypeSeriesListCopy, 1, this.i18n.list.productSeriesList)
							this.currentTypeSeriesIndexCopy = [0, 0]
						}
						break;
					default:
						break;
				}
				this.$forceUpdate()
			},
			typeSeriesChange: function(e) {
				let index = e.detail.value
				let productTypeData = this.productTypeData
				let productSeriesData = this.productSeriesData
				this.currentTypeSeriesIndex = index
				this.currentTypeSeriesIndexCopy = index
				this.productId = productTypeData[index[0]].productId
				this.seriesId = productSeriesData[index[1]].seriesId
				this.productTypeSeriesList = [...this.productTypeSeriesListCopy]
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			productAlarmChange: function(e) {
				let index = e.detail.value
				this.currentAlarmIndex = index
				let todayOnline;
				let warnDesc;
				if (index == 0) {
					todayOnline = false
					warnDesc = false
				} else if (index == 1) {
					todayOnline = true
					warnDesc = false
				} else if (index == 2) {
					todayOnline = false
					warnDesc = true
				} else if (index == 3) {
					todayOnline = true
					warnDesc = true
				}
				this.todayOnline = todayOnline
				this.warnDesc = warnDesc
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			productGroupChange: function(e) {
				let index = e.detail.value
				this.currentGroupIndex = index
				this.groupId = this.productGroupData[index].groupId
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			productPageChange: function(e) {
				let index = e.detail.value
				this.currentPageIndex = index
				this.currentPage = parseInt(index) + 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			searchNameInputChange: function(e) {
				let value = e.detail.value.replace(/\s/g, '')
				if (value == '') {
					this.deleteSearchName()
				} else {
					this.searchNameInput = value
					this.isShowSearchButton = true
				}
			},
			deleteSearchName: function(e) {
				this.searchNameInput = ''
				this.searchName = null
				this.isShowSearchButton = false
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			tapSearchName: function(e) {
				this.searchName = this.searchNameInput
				this.isShowSearchButton = false
				this.currentPage = 1
				this.deviceList = []
				this.mescroll.scrollTo(0, 300)
				this.mescroll.resetUpScroll()
			},
			deviceNavigation: function(deviceName, deviceCore, pageCur) {
				uni.navigateTo({
					url: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&deviceCore=${deviceCore}&pageCur=${pageCur}`
				})
			},
			areaList: function(e) {
				uni.navigateTo({
					url: `/pages/areaList/areaList`
				})
			},
			goToLogin: function(e) {
				uni.navigateTo({
					url: `/pages/login/login`
				});
			},
		},
		components: {
			listFav,
			surplus
		}
	}
</script>


