<template>
	<view :style="[{paddingBottom:`calc(${tabbarHeight}px + 30rpx)`}]">
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<!-- <view class="cu-list menu-avatar" v-for="(item,index) in paramList" :key="index" style="margin-top:-20rpx">
			<view class="cu-item" id="cu-item">
				<view class="cu-avatar" :style="[{backgroundImage:`url(${item.iconUrl})`}]" style="background-color:rgba(0,0,0,0);width: 55rpx;height:55rpx;"></view>
				<view class="content">
					<view><text class="margin-right-sm">{{item.name}}</text></view>
					<view class="text-gray text-sm">{{item.value}} {{item.unit}}</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="bg-white margin-top margin-lr" style="width:calc(100% - 2*30rpx);box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius:15upx"
		 v-for="(item,index) in paramList" :key="index">
			<view class="flex align-center padding-tb-xs">
				<view class="cu-avatar radius sm margin-left flex align-start justify-end" :style="[{backgroundImage:`url(${item.iconUrl})`}]"
				 style="width: 65rpx;height: 65rpx;background-color:rgba(0,0,0,0)">
				</view>
				<view class="flex-sub cu-bar bg-white" style="border-bottom-right-radius:15upx;border-top-right-radius:15upx;">
					<view class="action">
						<text>{{item.name}}</text>
					</view>
					<view class="action">
						<text class="text-df text-gray">{{item.value}} {{item.unit}}</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="flex justify-between flex-wrap" style="margin-left:20upx;margin-right:20upx;margin-top:10upx;margin-bottom:10upx;">
			<view v-for="(item,index) in paramList" :key="index" class="bg-white" :style="(item.isFullLine ? 'width:calc(100% - 10rpx)':'width:calc(50% - 10rpx)')"
			 style="box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius:15upx;margin-left:5upx;margin-right:5upx;margin-bottom:10upx;">
				<view class="flex justify-start margin-top">
					<view class="cu-avatar radius sm margin-left-sm margin-right-xs" :style="[{backgroundImage:`url(${item.iconUrl})`}]"
					 style="width: 55rpx;height: 55rpx;background-color:rgba(0,0,0,0)">
					</view>
					<view class="text-xs flex-sub">
						<view class="flex justify-between align-center" style="width: 100%;">
							<view style="color: #666666;">{{item.name}}</view>
						</view>
						<view class="text-gray">{{item.updateDate | formatDateTime(i18n.unknown)}}</view>
					</view>
				</view>
				<view style="margin-top:35upx;margin-bottom:35upx" class="flex justify-start align-center">
					<view style="margin-left:20upx;">
						<view class="cuIcon-title" :style="[{color:circleBgColor}]"></view>
						<view class="cuIcon-title" :style="[{color:circleBgColor}]"></view>
						<view class="cuIcon-title" :style="[{color:circleBgColor}]"></view>
					</view>
					<view class="text-xxl text-center flex-sub" :style="[{color:emphasizeColor}]">{{item.value}} {{item.unit}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import * as formatTime from '@/common/utils/filter/formatTime/formatTime.js'
	import * as deviceParamApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceParamApi/deviceParamApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isLoginOverdue: false,
				paramList: [],
				emphasizeColor: '',
				circleBgColor: '',
				navigationBarTextColor: '',
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
				default: ''
			},
			isToHome: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			},
			themei18n() {
				return this.$themei18nOption()
			}
		},
		mounted: function() {
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin && this.init()
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
			let lightColor = this.themei18n.lightColor
			this.circleBgColor = lightColor[light]
			this.emphasizeColor = this.themei18n.emphasizeColor
		},
		methods: {
			init: function(option) {
				this.getParamList()
			},
			getParamList: function(e) {
				let CustomBar = this.CustomBar
				let deviceCore = this.deviceCore
				let screenHeight = uni.getStorageSync('screenHeight')
				deviceParamApi.getOtherParam(this, deviceCore).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = []
						for (let i = 0; i < data.length; i++) {
							let obj = {}
							let {
								iconUrl,
								name,
								updateDate,
								unit,
								value,
							} = data[i]
							obj.iconUrl = iconUrl
							obj.name = name
							obj.updateDate = updateDate
							obj.unit = unit
							obj.value = value
							if (value.length > 10 || name.length > 8) {
								obj.isFullLine = true
							} else {
								obj.isFullLine = false
							}
							list.push(obj)
						}
						this.paramList = list
					} else {
						this.$uniUtilsApi.showToast(this.i18n.noData, 'none', 1000, false)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.cu-list.menu-avatar>.cu-item:after {
		border-bottom: 1upx solid rgba(255, 255, 255, 0);
	}
</style>
