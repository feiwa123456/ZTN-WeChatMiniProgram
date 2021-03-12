<template>
	<view :style="[{paddingBottom:`${tabbarHeight}px`}]">
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText" class="text-white" :style="[{color:navigationBarTextColor}]">{{deviceName}}</block>
		</cu-custom>
		<view class="margin-bottom" :style="cameraStyle">
			<view class="flex align-center bg-white padding-tb" :class="[cameraList.length != index+1 ? 'solid-bottom' : '']"
			 @tap="tapCamera(item)" v-for="(item,index) in cameraList" :key="index">
				<view class="margin-left margin-right-xl">
					<view class="cu-avatar lg text-gray" :class="[item.picturePath?'':'cuIcon-pic']" :style="[{backgroundImage:`url(${item.picturePath})`}]"
					 style="background-color:rgba(0,0,0,0);font-size:96rpx;"></view>
				</view>
				<view class=" flex-sub flex align-center justify-between margin-right">
					<view>
						<view class="text-xl margin-bottom-sm">
							{{item.name}}
						</view>
					</view>
					<view class="cuIcon-right text-black text-xl"></view>
				</view>
			</view>
		</view>
		<view id="ztnCustom-sensor">
			<view class="flex align-center bg-white padding-tb" :class="[sensorsList.length != index+1 ? 'solid-bottom' : '']"
			 @tap='tapSensor(item)' v-for="(item,index) in sensorsList" :key="index">
				<view class="margin-left margin-right-xl">
					<view class="cu-avatar lg" :style="[{backgroundImage:`url(${item.iconUrl})`}]" style="background-color:rgba(0,0,0,0)"></view>
				</view>
				<view class="flex-sub flex align-center justify-between margin-right">
					<view>
						<view class="text-xl margin-bottom-sm">
							{{item.sensorName}}
						</view>
						<view class="flex align-center">
							<view class="text-grey text-lg margin-right">
								{{item.type}}
							</view>
							<view class="text-gray">
								{{i18n.deviceSensor.port}}:{{item.port}}
							</view>
						</view>
					</view>
					<view class="cuIcon-right text-black text-xl"></view>
				</view>
			</view>
		</view>

		<!-- <view class="bg-white margin-top margin-lr" style="width:calc(100% - 2*30rpx);box-shadow: 0 5upx 15upx -5upx rgba(26, 26, 26, 0.2);border-radius:15upx"
		 v-for="(item,index) in sensorsList" :key="index" @tap="tapSensor(item)">
			<view class="flex align-center padding-tb-xs">
				<view class="cu-tag bg-blue">史诗</view>
				<view class="cu-avatar radius sm margin-left flex align-start justify-end" :style="[{backgroundImage:`url(${item.iconUrl})`}]"
				 style="width: 65rpx;height: 65rpx;background-color:rgba(0,0,0,0)">
				</view>
				<view class="flex-sub cu-bar bg-white" style="border-bottom-right-radius:15upx;border-top-right-radius:15upx;">
					<view class="action flex align-center">
						<text class="margin-right-sm">{{item.sensorName}}</text>
						<text class="text-grey">
						</text>
					</view>
					<view class="action text-xxl" :style="[{color:emphasizeColor}]" >
						<view>{{item.port}}</view>
					</view>
				</view>
			</view> -->
			<!-- [ {{item.type}} ] -->
			
			<!-- <view class="flex justify-between align-center" style="position: relative;">
				<view>
					<circleComponent style="position: absolute !important;z-index: 1024;left:20upx;bottom: 70rpx" :circleWidth="10"
					 :circleHeight="10" :circleBgColor="circleBgColor" :circleBorder="''">
					</circleComponent>
					<circleComponent style="position: absolute !important;z-index: 1024;left:20upx;bottom: 50rpx" :circleWidth="10"
					 :circleHeight="10" :circleBgColor="circleBgColor" :circleBorder="''">
					</circleComponent>
					<circleComponent style="position: absolute !important;z-index: 1024;left:20upx;bottom: 30rpx" :circleWidth="10"
					 :circleHeight="10" :circleBgColor="circleBgColor" :circleBorder="''">
					</circleComponent>
				</view>
				<view class="margin-right-sm  margin-tb text-xxl" :style="[{color:emphasizeColor}]">{{item.port}}</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import circleComponent from '@/components/ztn-custom/circleComponent/circleComponent.vue'
	import * as deviceSensorApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceSensorApi/deviceSensorApi.js'
	import * as deviceCameraApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceCameraApi/deviceCameraApi.js'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isLoginOverdue: false,
				navigationBarTextColor: '',
				emphasizeColor: '',
				circleBgColor: '#ffffff',
				sensorsList: [],
				cameraList: [],
				cameraStyle: 'display:none',
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
		},
		methods: {
			init: function() {
				this.getSensorList()
				this.getCameraList()
				this.navigationBarTextColor = this.themei18n.navigationBarTextColor
				let theme = this.themei18n.theme
				let light;
				switch (theme) {
					case 'default':
						light = 'orangeLight'
						break;
					case 'darkColor' :
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
			getSensorList: function(e) {
				let deviceCore = this.deviceCore
				deviceSensorApi.getSensorList(this, deviceCore).then((res) => {
					if (res.code == '200') {
						let data = res.data
						let list = data.filter(function(item, index) {
							return item.hidden == false
						})
						if (list.length > 0) {
							for (let i = 0; i < list.length; i++) {
								let index = list[i].type
								list[i].type = this.i18n.deviceSensor.sensorType[index]
							}
							this.sensorsList = list
						}
					}
				})
			},
			getCameraList: function(e) {
				let deviceCore = this.deviceCore
				let userId = uni.getStorageSync('userId')
				deviceCameraApi.getCameraList(this, userId, deviceCore).then((res) => {
					if (res.code == '200') {
						let data = res.data
						this.cameraStyle = data.length == 0 ? 'display:none' : 'display:block'
						for (let index = 0; index < data.length; index++) {
							let {
								picturePath,
								deviceId,
								name
							} = data[index]
							let obj = {
								picturePath : picturePath ? `${picturePath}` : null,
								deviceId : deviceId,
								name : name
							}
							this.$set(this.cameraList, index, obj)
						}
					}
				})
			},
			tapCamera: function(e) {
				let {
					deviceId,
					name
				} = e
				uni.navigateTo({
					url: `/pages/devicePlayer/devicePlayer?deviceId=${deviceId}&name=${name}`
				})
			},
			tapSensor: function(e) {
				let {
					sensorId,
					sensorName,
					deviceCore,
					port
				} = e
				let deviceName = this.deviceName
				uni.navigateTo({
					url: `/pages/deviceSensorExplain/deviceSensorExplain?sensorId=${sensorId}&sensorName=${sensorName}&deviceCore=${deviceCore}&deviceName=${deviceName}&port=${port}`
				})
			}
		},
		components: {
			circleComponent,
		},
	}
</script>

