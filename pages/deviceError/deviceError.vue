<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName != null ? deviceName : ''}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName != null ? deviceName : ''}}</block>
		</cu-custom>
		<view id="fixedBlock" class="padding bg-white " style="position:fixed;left:0;width:100%;z-index: 1024;box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.1);">
			<view class="flex justify-around align-center">
				<picker mode="date" :value="startDate" :end="initEndTimestamp | formatDate" @change='startDateChange'>
					<view class="text-grey">{{startDate}}</view>
				</picker>
				<!-- 至 -->
				<view>{{i18n.to}}</view>
				<picker mode="date" :end="initEndTimestamp | formatDate" @change='endDateChange'>
					<view class="text-grey">{{endDate}}</view>
				</picker>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="getDeviceError">
			<view v-if="isShowList" v-for="(arrItem,arrIndex) in deviceErrorlist" :key="arrIndex" :style="(arrIndex == 0 ? style : '')">
				<view class="cu-timeline" v-for="(item,index) in arrItem" :key="index">
					<view class="cu-item text-yellow" @tap="deviceNavigation(item.deviceName,item.deviceCore,'deviceInfo')">
						<view class="text-gray text-df flex justify-start">
							{{item.startDate | formatDateTime(i18n.unknown)}} - {{item.endDate | formatDateTime(i18n.unknown)}}
						</view>
						<view class="bg-yellow light" style="border-radius: 15rpx;margin-top:20rpx">
							<view class="cu-capsule radius">
								<view class="padding" style="color:#666666">
									{{item.target}} {{i18n.deviceError[item.logic]}} {{item.logicValue}}
								</view>
							</view>
							<view class="padding-top-xs padding-bottom padding-lr text-content">
								<text class="margin-right-sm" style="color:#666666">{{i18n.statu}}:</text><text>{{item.status}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import * as formatTime from '@/common/utils/filter/formatTime/formatTime.js'
	import * as deviceErrorApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceErrorApi/deviceErrorApi.js'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				navigationBarTextColor: '',
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
					},
				},
				style: '',
				isShowList: false,
				startDate: '',
				endDate: '',
				startTimestamp: '',
				endTimestamp: '',
				initEndTimestamp: '',
				initEndDate: '',
				deviceErrorlist: [],
				deviceName: '',
				deviceCore: null,
				currentPage: 1,
				pageSize: 10,
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
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.initOption = option
			isLogin ? this.init(option) : uni.navigateTo({
				url: '/pages/login/login'
			})
			this.navigationBarTextColor = this.themei18n.navigationBarTextColor
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let initOption = this.initOption
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(initOption), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			downCallback: function() {
				this.currentPage = 1
				this.deviceErrorlist = []
				this.mescroll.resetUpScroll()
			},
			init: function(option) {
				this.deviceName = option.deviceName || null
				this.deviceCore = option.deviceCore || null
				this.initDate()
			},
			initDate: function() {
				let time = new Date()
				this.startTimestamp = Math.round(time.getTime() / 1000 - 7 * 24 * 60 * 60).toString()
				this.endTimestamp = Math.round(time.getTime() / 1000 + 1 * 10).toString()
				this.startDate = formatTime.formatDate(this.startTimestamp)
				this.endDate = formatTime.formatDate(this.endTimestamp)
				this.initEndTimestamp = this.endTimestamp
				this.getDeviceError()
			},
			getDeviceError: function(first) {
				let deviceCore = this.deviceCore
				let startTimestamp = this.startTimestamp
				let endTimestamp = this.endTimestamp
				let currentPage = this.currentPage
				let pageSize = this.pageSize
				deviceErrorApi.getDeviceError(this, deviceCore, startTimestamp, endTimestamp, currentPage, pageSize).then((res) => {
					if (res.code == '200') {
						let {
							currentPage,
							data,
							total
						} = res.data
						let fixedHeight = uni.getStorageSync('fixedHeight')
						if (fixedHeight) {
							this.style = `margin-top:${fixedHeight}px`
							this.isShowList = true
						} else {
							this.$nextTick(() => {
								setTimeout(() => {
									uni.createSelectorQuery().select('#fixedBlock').boundingClientRect((e) => {
										let height = e.height
										this.style = `margin-top:${height}px`
										this.isShowList = true
										uni.setStorageSync('fixedHeight', height)
									}).exec()
								}, 0)
							})
						}
						for (let i = 0; i < data.length; i++) {
							let statusIndex = data[i].status
							data[i].status = this.i18n.deviceError.errorHandleStatus[statusIndex] //'未处理' "误报" "已处理"
						}
						this.mescroll.endByPage(data.length, total)
						let deviceErrorIndex = currentPage - 1
						this.$set(this.deviceErrorlist, deviceErrorIndex, data)
						this.currentPage = currentPage + 1
					}
				})
			},
			startDateChange: function(e) {
				let date = e.detail.value.replace(/-/g, '/');
				let timestamp = (new Date(date).getTime() / 1000).toString();
				let endTimestamp = this.endTimestamp
				if (endTimestamp < timestamp || endTimestamp == timestamp) {
					this.$uniUtilsApi.showToast(this.i18n.lessEndDate, 'none', 1000, false) //请选择小于结束日期
				} else {
					this.startTimestamp = timestamp
					this.startDate = e.detail.value
					this.currentPage = 1
					this.deviceErrorlist = []
					this.mescroll.scrollTo(0, 300)
					this.mescroll.resetUpScroll()
				}
			},
			endDateChange: function(e) {
				let date = e.detail.value.replace(/-/g, '/');
				let timestamp = (new Date(date).getTime() / 1000 + 1 * 24 * 60 * 60).toString();
				let startTimestamp = this.startTimestamp
				if (startTimestamp > timestamp || startTimestamp == timestamp) {
					this.$uniUtilsApi.showToast(this.i18n.greaterStartDate, 'none', 1000, false) //请选择大于开始日期
				} else {
					this.endTimestamp = timestamp
					this.endDate = e.detail.value
					this.currentPage = 1
					this.deviceErrorlist = []
					this.mescroll.scrollTo(0, 300)
					this.mescroll.resetUpScroll()
				}
			},
			deviceNavigation: function(deviceName, deviceCore, pageCur) {
				uni.navigateTo({
					url: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&deviceCore=${deviceCore}&pageCur=${pageCur}`
				})
			},
		},
		onShareAppMessage: function(res) {
			let deviceName = this.deviceName
			let deviceCore = this.deviceCore
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: deviceName == null ? `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}` : `${nickName}${this.i18n.moreOperate.share}${deviceName}`,
				path: deviceCore == null ? `/pages/deviceError/deviceError` : `/pages/deviceError/deviceError?deviceName=${deviceName}&&deviceCore=${deviceCore}`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
