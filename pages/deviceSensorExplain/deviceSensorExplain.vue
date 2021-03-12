<template>
	<view class="container">
		<cover-view id="showModelStyle" class="flex text-center" style="position:fixed;left:0;width:100%;z-index: 1024;background-color: #FFFFFF;">
			<cover-view class="flex-sub" @tap="tapRealTime">
				<cover-view class="padding">{{i18n.deviceSensorExplain.realtimeMonitor}}</cover-view>
				<cover-view class="margin-bottom-xs" v-if="showModel == 'realTime'" style="width:100%;height:4rpx;background-color:#aaaaaa"></cover-view>
			</cover-view>
			<cover-view class="flex-sub" @tap="isLogin&&tapHistorical()">
				<cover-view class="padding">{{i18n.deviceSensorExplain.historyData}}</cover-view>
				<cover-view class="margin-bottom-xs" v-if="showModel == 'history'" style="width:100%;height:4rpx;background-color:#aaaaaa"></cover-view>
			</cover-view>
		</cover-view>
		<view v-if="showModel=='realTime'" :style="[{paddingTop:ModelHeight + 'px'}]">
			<view class="cu-list menu-avatar">
				<view class="cu-item cur ztnCustom-realTime" :style="{borderBottom: realTimeList.length == index+1 ? '0.5px solid #fff' : ''}"
				 v-for="(item,index) in realTimeList" :key="index">
					<view class="cu-avatar radius sm" @tap="isShowAlarmModel(item)" :style="[{backgroundImage:`url(${item.iconUrl})`}]"
					 style="width: 80rpx;height: 80rpx;background-color:rgba(0,0,0,0)">
						<view class="cu-tag badge" v-if="item.less != '' || item.greater != '' || item.equal != '' || item.wave != ''"></view>
					</view>
					<view class="content" @tap="goItemHistoryData(item)" style="width:350upx;">
						<view>
							<text class="text-cut">{{item.name}}</text>
						</view>
						<view class="text-gray text-sm flex">
							<text class="text-cut">{{item.valueDate | formatDateTime(i18n.unknown)}}</text>
						</view>
					</view>
					<view class="text-grey text-lg" style="width:310upx;margin-right:30upx;text-align: end">
						<view style="display:inline-block;word-break:break-all">{{item.value}}
							<view style="display:inline-block;">{{item.unit}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="showModel=='realTime'" style="width: 100%;height: 115rpx;"></view>
		<circleComponent v-if="showModel=='realTime' && isLogin" style="position: fixed !important;z-index: 1024;right:40upx;bottom: 30rpx"
		 :circleWidth="85" :circleHeight="85" :circleBgColor="circleBgColor" :circleBorder="''">
			<text @tap="updateData" class="cuIcon-refresh" style="font-size:0.7em" :style="[{color:emphasizeColor}]"></text>
		</circleComponent>
		
		<view class="cu-modal bottom-modal" :class="[showModel=='realTime' && showErrorModal?'show':'']">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-red" @tap="hideErrorModal">{{i18n.close}}</view>
				</view>
				<view class="padding-xl">
					{{settingError}}
				</view>
			</view>
		</view>
		
		<view class="cu-modal bottom-modal" :class="[isShowAlarm && showModel=='realTime'?'show':'']" style="text-align: start">
			<view class="cu-dialog bg-white" style="border-top-left-radius:20rpx;border-top-right-radius:20rpx;">
				<view class="cu-bar bg-white text-bold">
					<view class='action'>
						{{i18n.deviceSensorExplain.setAlarmValue}}
					</view>
					<view class='action padding-right'>
						<text>{{explainName}}</text>
					</view>
				</view>
				<form @submit="setAlarmValue">
					<view class="cu-form-group">
						<view class="title">{{i18n.deviceSensorExplain.lowAlarmValue}}：</view>
						<input type="text" name="less" :value="less"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">{{i18n.deviceSensorExplain.highAlarmValue}}：</view>
						<input type="text" name="greater" :value="greater"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">{{i18n.deviceSensorExplain.equalAlarmValue}}：</view>
						<input type="text" name="equal" :value="equal"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">{{i18n.deviceSensorExplain.fluctuationAlarm}}：</view>
						<input type="text" name="wave" :value="wave"></input>
					</view>
					<view class="cu-form-group" style="min-height:30rpx;">
					</view>
					<view class="flex justify-between align-center">
						<button class="cu-btn block line-grey margin lg" @tap="cancelSetAlarm">{{i18n.cancel}}</button>
						<button class="cu-btn block line-grey margin lg" form-type="submit">{{i18n.confirm}}</button>
					</view>
				</form>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="showModel=='history'" class="flex" style="width:100%;">
			<picker mode="date" :value="startDate " :end="initEndTimestamp | formatDate" @change='startDateChange'>
				<cover-view id="fixedBlock" :style="[{top:ModelHeight + 'px'}]" style="position:fixed;left:0;width:40%;z-index: 1024;background-color: #FFFFFF;"
				 class="text-grey padding-tb text-center">{{startDate}}</cover-view>
			</picker>
			<cover-view :style="[{top:ModelHeight + 'px'}]" class="padding-tb text-center" style="position:fixed;left:40%;width:20%;z-index: 1024;background-color: #FFFFFF;">{{i18n.to}}</cover-view>
			<picker mode="date" :end="initEndTimestamp | formatDate" @change='endDateChange'>
				<cover-view :style="[{top:ModelHeight + 'px'}]" style="position:fixed;left:60%;width:40%;z-index: 1024;background-color: #FFFFFF;"
				 class="text-grey padding-tb text-center">{{endDate}}</cover-view>
			</picker>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view v-if="showModel=='history'" class="flex" style="width:100%;">
			<picker mode="date" :value="startDate " :end="initEndTimestamp | formatDate" @change='startDateChange'>
				<cover-view id="fixedBlock" :style="[{top:historyMarginTop + 'px'}]" style="position:fixed;left:0;width:40%;z-index: 1024;background-color: #FFFFFF;"
				 class="text-grey padding-tb text-center">{{startDate}}</cover-view>
			</picker>
			<cover-view :style="[{top:historyMarginTop + 'px'}]" class="padding-tb text-center" style="position:fixed;left:40%;width:20%;z-index: 1024;background-color: #FFFFFF;">{{i18n.to}}</cover-view>
			<picker mode="date" :end="initEndTimestamp | formatDate" @change='endDateChange'>
				<cover-view :style="[{top:historyMarginTop + 'px'}]" style="position:fixed;left:60%;width:40%;z-index: 1024;background-color: #FFFFFF;"
				 class="text-grey padding-tb text-center">{{endDate}}</cover-view>
			</picker>
		</view>
		<!-- #endif -->

		<view v-if="showModel == 'history'" style="width:100%;background-color:#FFFFFF" :style="[{height:historyMarginTop + 'px'}]"></view>
		<mpvue-echarts v-if="showModel == 'history'" v-for="(item,index) in chartList" :key="index" :ref="item.ref" :comIndex="index"
		 :echarts="item.echarts" @onInit="initChart" :canvasId="item.canvasId" :lazyLoad="lazyLoad" />
		<view v-if="showModel=='history'" style="width: 100%;height: 115rpx;"></view>
		<picker v-if="showModel == 'history'" :range="i18n.deviceSensorExplain.timeList" value="timeIndex" @change='timeChange'>
			<cover-view class="flex align-center justify-center" :style="[{backgroundColor:circleBgColor}]" style="width: 85rpx;height: 85rpx;border-radius: 50%;position:fixed !important;z-index: 1024;right:40upx;bottom: 30rpx">
				<cover-view class="text-sm" :style="[{color:emphasizeColor}]">{{i18n.deviceSensorExplain.time}}</cover-view>
			</cover-view>
		</picker>
	</view>
</template>

<script>
	import io from '@hyoga/uni-socket.io'
	import * as formatTime from '@/common/utils/filter/formatTime/formatTime.js'
	import * as deviceSensorApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceSensorApi/deviceSensorApi.js'
	import * as deviceSensorExplainApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceSensorApi/deviceSensorExplainApi/deviceSensorExplainApi.js'
	import * as deviceControllerApi from '../../common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceControllerApi/deviceControllerApi.js'
	import * as echarts from '@/echarts/echarts.min.js'
	import mpvueEcharts from '@/mpvue-echarts/src/echarts.vue'
	import circleComponent from '@/components/ztn-custom/circleComponent/circleComponent.vue'
	export default {
		data() {
			return {
				echarts,
				isToHome: false,
				fromLoginBack: false,
				isLogin: false,
				isLoginOverdue: false,
				emphasizeColor: '',
				circleBgColor: '#ffffff',
				chartItemStyle: '',
				chartAreaStyle: '',
				screenHeight: 0,
				showModel: 'realTime',
				ModelHeight: '',
				realTimeList: [],
				explainId: '',
				explainName: '',
				less: '',
				greater: '',
				equal: '',
				wave: '',
				settingError: '',
				showErrorModal: false,
				isShowAlarm: false,
				isShowFilter: true,
				historyMarginTop: '',
				chartList: [],
				startTimestamp: '',
				endTimestamp: '',
				initEndTimestamp: '',
				initStartTimestamp: '',
				startDate: '',
				endDate: '',
				endcreatedTime: '',
				selectItemHistory: null,
				lazyLoad: false,
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
			let theme = this.themei18n.theme
			let navigationBarTextColor = this.themei18n.navigationBarTextColor
			let navigationBarBackgroundColor = this.themei18n.navigationBarBackgroundColor
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
			this.chartItemStyle = this.themei18n.chartItemStyle
			this.chartAreaStyle = this.themei18n.chartAreaStyle
			uni.setNavigationBarColor({
				frontColor: navigationBarTextColor, //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
				backgroundColor: navigationBarBackgroundColor, //背景颜色值，有效值为十六进制颜色
			})
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			this.screenHeight = uni.getStorageSync('screenHeight') + 'px'
			this.initOption = option
			this.isLogin = isLogin
			isLogin ? this.init(option) : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let initOption = this.initOption
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(initOption), this.fromLoginBack = false, this.isLoginOverdue = false, this.isLogin =
				true)
		},
		onUnload: function(e) {
			let isLogin = this.isLogin
			isLogin && this.unBindUserSocket()
			isLogin && this.socketTask.close({
				success: (res) => {
					// console.log('关闭成功', res)
				},
				fail: (err) => {
					// console.log('关闭失败', err)
				}
			})
		},
		methods: {
			init: function(option) {
				this.deviceName = option.deviceName
				this.deviceCore = option.deviceCore
				this.sensorId = option.sensorId
				this.sensorName = option.sensorName
				this.port = option.port
				this.getRealTimeList()
				this.connectSocket()
				this.openSocket()
			},
			tapRealTime: function() {
				let showModel = this.showModel
				showModel == 'history' && (this.showModel = 'realTime', this.selectItemHistory = null, this.getRealTimeList())
			},
			tapHistorical: function() {
				let showModel = this.showModel
				showModel == 'realTime' && (this.showModel = 'history', this.$uniUtilsApi.showLoading(this.i18n.loading, false),
					this.getCurrentDate(), this.getListWithExplain(undefined, true))
			},
			getRealTimeList: function() {
				let sensorId = this.sensorId
				let deviceCore = this.deviceCore
				deviceSensorExplainApi.getRealTimeList(this, sensorId).then((res) => {
					if (res.code == '200') {
						let data = res.data
						if (data == null) {
							this.$uniUtilsApi.showToast(this.i18n.nodata, 'none', 1000, false)
							return
						} else {
							let ModelHeight = uni.getStorageSync('ModelHeight')
							let realTimeList = data.filter((item, index, arr) => item.hidden == false)
							if (ModelHeight) {
								this.ModelHeight = ModelHeight - 0.5
								this.realTimeList = realTimeList
							} else {
								this.$nextTick(() => {
									setTimeout(() => {
										uni.createSelectorQuery().select('#showModelStyle').boundingClientRect((e) => {
											let height = e.height
											this.ModelHeight = height - 0.5
											this.realTimeList = realTimeList
											uni.setStorageSync('ModelHeight', height)
										}).exec()
									}, 0)
								})
							}
						}
					}
				})
			},
			isShowAlarmModel: function(e) {
				let {
					explainId,
					name,
					less,
					greater,
					equal,
					wave
				} = e
				this.explainId = explainId
				this.explainName = name
				this.less = less
				this.greater = greater
				this.equal = equal
				this.wave = wave
				this.isShowAlarm = true
			},
			setAlarmValue: function(e) {
				var sensorId = this.sensorId
				var explainId = this.explainId
				var {
					less,
					greater,
					equal,
					wave
				} = e.detail.value
				deviceSensorExplainApi.setAlarmValue(this, explainId, sensorId, less, greater, equal, wave).then((res) => {
					if (res.code == '200') {
						this.isShowAlarm = false
						this.$uniUtilsApi.showToast(this.i18n.setSuccess, 'none', 1000, false)
						this.getRealTimeList()
					}
				})
			},
			cancelSetAlarm: function() {
				this.isShowAlarm = false
			},
			deviceController: function() {
				let deviceName = this.deviceName
				let deviceCore = this.deviceCore
				let pageCur = 'deviceController'
				uni.navigateTo({
					url: `/pages/deviceNavigation/deviceNavigation?deviceName=${deviceName}&deviceCore=${deviceCore}&pageCur=${pageCur}`
				})
			},
			updateData: function() {
				this.$uniUtilsApi.showLoading(this.i18n.loading, true)
				let deviceCore = this.deviceCore
				let port = this.port
				deviceControllerApi.saveSetting(this, deviceCore, undefined, 'getData', port, undefined).then((res) => {
					if (res.code == '200') {
						this.$uniUtilsApi.hideLoading()
						this.$uniUtilsApi.showToast(this.i18n.updateSuccess, 'none', 1000, true) //'更新成功'
					} else {
						this.$uniUtilsApi.hideLoading()
						this.$uniUtilsApi.showToast(this.i18n.updateFail, 'none', 1000, true) //'更新失败'
					}
				})
			},
			hideErrorModal: function() {
				this.showErrorModal = false
			},
			connectSocket: function() {
				let userId = uni.getStorageSync('userId')
				let companyId = uni.getStorageSync('companyId')
				let devKey = uni.getStorageSync('devKey')
				let accessToken = uni.getStorageSync('accessToken')
				let language = uni.getStorageSync('language')
				let sensorId = this.sensorId
				let socketUrl =
					`wss://core.ztn-tech.com/ws?userId=${userId}&companyId=${companyId}&devKey=${devKey}&accessToken=${accessToken}&language=${language}&app=iot`
				this.socketTask = uni.connectSocket({
					url: socketUrl,
					header: {
						'content-type': 'application/json'
					},
					method: 'GET',
					success: () => {
						// console.log("success")
					},
				});
			},
			openSocket: function() {
				this.socketTask.onOpen((res) => {
					// console.log("WebSocket连接正常打开中...！");
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					this.bindUserSocket()
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						this.handleSocketData(res.data)
					});
					this.socketTask.onClose((res) => {
						// console.log("关闭回调--------------" + res.data);
					})
				})
			},
			bindUserSocket: function() {
				let sensorId = this.sensorId
				let data = {
					cmd: 'bindSensor',
					param: sensorId
				}
				this.socketTask.send({
					data: JSON.stringify(data),
					async success() {
						// console.log("绑定成功");
					},
				});
			},
			unBindUserSocket: function() {
				let sensorId = this.sensorId
				let data = {
					cmd: 'unBindSensor',
					param: sensorId
				}
				this.socketTask.send({
					data: JSON.stringify(data),
					async success() {
						// console.log("解绑成功");
					}
				});
			},
			handleSocketData: function(e) {
				let option = this.realTimeList;
				let data = JSON.parse(e);
				if (data.type == 'deviceOnline') {
					return
				} else {
					this.$uniUtilsApi.showToast(this.i18n.uploadData, 'none', 1000, false)
					let msg = JSON.parse(data.msg);
					let timestamp = data.timestamp;
					for (let name in msg) {
						for (let j in option) {
							let keyName = option[j].keyName
							if (keyName == name) {
								option[j].value = msg[keyName]
								option[j].valueDate = timestamp
								this.realTimeList = option
							}
						}
					}
				}
			},
			goItemHistoryData: function(e) {
				this.showModel = 'history'
				this.$uniUtilsApi.showLoading(this.i18n.loading, false)
				this.getCurrentDate()
				this.getListWithExplain(e, true)
				this.selectItemHistory = e
			},
			getCurrentDate: function() {
				let time = new Date()
				this.startTimestamp = time.setTime(time.getTime() / 1000 - 7 * 24 * 60 * 60).toString();
				this.endTimestamp = Math.round(new Date().getTime() / 1000).toString();
				this.startDate = formatTime.formatDate(this.startTimestamp)
				this.endDate = formatTime.formatDate(this.endTimestamp)
				this.initStartTimestamp = this.startTimestamp
				this.initEndTimestamp = this.endTimestamp
			},
			getListWithExplain: function(e, first) {
				first && (this.chartList = [])
				let sensorId = this.sensorId
				let initStartTimestamp = this.initStartTimestamp
				let startTimestamp = this.startTimestamp
				let endTimestamp = this.endTimestamp
				if (startTimestamp > initStartTimestamp || startTimestamp == initStartTimestamp) {
					deviceSensorApi.getListWithExplain(this, sensorId, startTimestamp, endTimestamp).then((res) => {
						this.handleListWithExplain(e, first, res)
					})
				} else {
					deviceSensorApi.getHistoryListWithExplain(this, sensorId, startTimestamp, endTimestamp).then((res) => {
						this.handleListWithExplain(e, first, res)
					})
				}
			},
			handleListWithExplain: function(e, first, res) {
				if (res.code == '200') {
					let ModelHeight = parseInt(this.ModelHeight)
					let fixedHeight = uni.getStorageSync('fixedHeight')
					if (fixedHeight) {
						this.historyMarginTop = fixedHeight + ModelHeight
					} else {
						this.$nextTick(() => {
							setTimeout(() => {
								uni.createSelectorQuery().select('#fixedBlock').boundingClientRect((e) => {
									let height = e == null ? 0 : e.height
									this.historyMarginTop = height + ModelHeight
									uni.setStorageSync('fixedHeight', height)
								}).exec()
							}, 0)
						})
					}
					let explainList = res.data.explainList
					let historyData = res.data.dataList
					if (e) {
						let arr = []
						arr.push(e)
						this.initChartData(arr, historyData, first)
					} else {
						this.initChartData(explainList, historyData, first)
					}
				}
			},
			initChartData: function(options, data, first) {
				this.$uniUtilsApi.hideLoading()
				let list = []
				for (let i = 0; i < options.length; i++) {
					if (data.length == 0) {
						this.$uniUtilsApi.showToast(this.i18n.noData, 'none', 1000, false)
						return
					} else if (options[i].type != 'static' && options[i].hidden != true) {
						let keyName = options[i].keyName;
						let item = {};
						let details = []
						for (let j = 0; j < data.length; j++) {
							let obj = data[j].val;
							let newDate = new Date();
							var createdTime = data[j].createdTime;
							newDate.setTime(createdTime * 1000);
							if (obj[keyName] != undefined) {
								details.push({
									time: (newDate.getMonth() + 1) + '/' + newDate.getDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes(),
									val: parseInt(obj[keyName]),
								});
							}
						}
						item.data = details;
						item.name = options[i].name
						item.unit = options[i].unit
						item.ref = keyName
						item.canvasId = 'mychart-dom-multi-' + keyName.replace('.', '_')
						if (item.data.length != 0) {
							list.push(item)
						} else if (this.selectItemHistory) {
							this.$uniUtilsApi.showToast(this.i18n.noData, 'none', 1000, false);
						}
					} else if (this.selectItemHistory) {
						this.$uniUtilsApi.showToast(this.i18n.noData, 'none', 1000, false);
					}
				}
				this.chartList = list
				this.$nextTick(() => {
					let chartList = this.chartList
					for (let i = 0; i < chartList.length; i++) {
						let ref = chartList[i].ref
						this.$refs[ref][0].refresh()
					}
				})
				this.endcreatedTime = createdTime
			},
			initChart: function(e) {
				let {
					canvas,
					width,
					height,
					comIndex
				} = e;
				width = width - 20;
				echarts.setCanvasCreator(() => canvas);
				const chart = echarts.init(canvas, null, {
					width: width,
					height: height,
				})
				canvas.setChart(chart)
				let itemStyle = this.chartItemStyle
				let areaStyle = this.chartAreaStyle
				let thisChart = this.chartList[comIndex]
				let thisChartName = thisChart.name
				let thisChartData = thisChart.data
				let timeData = [];
				let timeValue = [];
				for (let i = 0; i < thisChartData.length; i++) {
					timeData.push(thisChartData[i].time)
					timeValue.push(thisChartData[i].val)
				}
				let option = {
					title: {
						text: thisChartName,
						top: '4%',
						textStyle: {
							color: 'grey',
							fontSize: '15',
						},
					},
					grid: {
						left: '5%',
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					dataZoom: [{
							type: 'inside',
							start: 0,
							end: 100,
						},
						{
							start: 0,
							end: 100,
							top: '84%',
							handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
							handleSize: '80%',
							handleStyle: {
								color: '#fff',
								shadowBlur: 3,
								shadowColor: 'rgba(0, 0, 0.3, 0.6)',
								shadowOffsetX: 2,
								shadowOffsetY: 2
							}
						}
					],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: timeData,
						axisLine: {
							show: true,
							lineStyle: {
								color: 'grey'

							}
						},
						axisLabel: {
							textStyle: {
								color: 'grey'
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							show: true,
							lineStyle: {
								color: 'grey'

							}
						},
						axisLabel: {
							textStyle: {
								color: 'grey'
							}
						}
					},
					series: [{
						data: timeValue,
						type: 'line',
						smooth: true,
						markPoint: {
							data: [{
									type: 'max',
									name: '最大值'
								},
								{
									type: 'min',
									name: '最小值'
								}
							]
						},
						markLine: {
							data: [{
								type: 'average',
								name: '平均值'
							}]
						},
						symbol: 'none',
						sampling: 'average',
						itemStyle: {
							normal: {
								color: itemStyle //'#70c8e2'
							}
						},
						areaStyle: {
							normal: {
								color: areaStyle //'#f5f8fd'
							}
						}
					}],
				};
				chart.setOption(option)
				let ref = this.chartList[comIndex].ref
				this.$refs[ref][0].setChart(chart)
			},
			startDateChange: function(e) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, false)
				this.chartList = []
				let date = e.detail.value.replace(/-/g, '/')
				let timestamp = (new Date(date).getTime() / 1000).toString();
				let endTimestamp = this.endTimestamp
				if (endTimestamp < timestamp || endTimestamp == timestamp) {
					this.$uniUtilsApi.showToast(this.i18n.lessEndDate, 'none', 1000, false) //请选择小于结束日期
				} else {
					this.startDate = e.detail.value
					this.startTimestamp = timestamp
					let selectItemHistory = this.selectItemHistory
					selectItemHistory == null ? this.getListWithExplain(undefined, false) : this.getListWithExplain(selectItemHistory,
						false)
				}
			},
			endDateChange: function(e) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, false)
				this.chartData = []
				let date = e.detail.value.replace(/-/g, '/');
				let timestamp = (new Date(date).getTime() / 1000 + 1 * 24 * 60 * 60).toString();
				let startTimestamp = this.startTimestamp
				if (startTimestamp > timestamp || startTimestamp == timestamp) {
					this.$uniUtilsApi.showToast(this.i18n.greaterStartDate, 'none', 1000, false) //请选择大于开始日期
				} else {
					this.endDate = e.detail.value
					this.endTimestamp = timestamp
					let selectItemHistory = this.selectItemHistory
					selectItemHistory == null ? this.getListWithExplain(undefined, false) : this.getListWithExplain(selectItemHistory,
						false)
				}
			},
			timeChange: function(e) {
				this.$uniUtilsApi.showLoading(this.i18n.loading, true)
				this.chartData = []
				let index = parseInt(e.detail.value)
				let timeList = [60, 60 * 5, 60 * 10, 60 * 30, 60 * 60, 60 * 60 * 5, 60 * 60 * 10, 60 * 60 * 15, 60 * 60 * 20]
				let endcreatedTime = this.endcreatedTime
				this.startTimestamp = (parseInt(endcreatedTime) - timeList[index]).toString()
				let selectItemHistory = this.selectItemHistory
				selectItemHistory == null ? this.getListWithExplain(undefined, false) : this.getListWithExplain(selectItemHistory,
					false)
			}
		},
		components: {
			circleComponent,
			mpvueEcharts
		},
		onShareAppMessage: function(res) {
			let deviceName = this.deviceName
			let deviceCore = this.deviceCore
			let sensorId = this.sensorId
			let sensorName = this.sensorName
			let nickName = uni.getStorageSync('nickName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${deviceName}`,
				path: `/pages/deviceSensorExplain/deviceSensorExplain?deviceName=${deviceName}&&deviceCore=${deviceCore}&&sensorId=${sensorId}&&sensorName=${sensorName}`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style>
	page,
	.container {
		background-color: #FFFFFF;
	}

	.ztnCustom-realTime-value {
		background-color: red;
		width: 200rpx;
		margin-right: 30rpx;
		text-align: right;
		display: -webkit-box;
		overflow: hidden;
		white-space: normal;
		text-overflow: ellipsis;
		word-wrap: break-word;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	/* .ztnCustom-realTime:last-child {
		margin-bottom: 150rpx
	} */
</style>
