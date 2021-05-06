import io from '@hyoga/uni-socket.io'
import messages from '@/common/utils/messages/messages.js'
import * as formatTime from '@/common/utils/filter/formatTime/formatTime.js'
import * as tokenApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/tokenApi/tokenApi.js'
import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
import * as companyApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/companyApi/companyApi.js'
import * as deviceInfoApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/deviceApi/deviceInfoApi/deviceInfoApi.js'
import * as clipboard from '@/common/utils/clipboard/clipboard.js'


function showToast(title, icon, duration, mask = true) {
	uni.showToast({
		title: title,
		icon: icon,
		duration: duration,
		mask: mask,
	});
}

function showLoading(title, mask = true) {
	uni.showLoading({
		title: title,
		mask: mask,
	});
}

function hideLoading() {
	uni.hideLoading();
}

function showModal(title, content, showCancel = true, confirmText = '确认', cancelText = '取消', success, cancel) {
	uni.showModal({
		title: title,
		content: content,
		showCancel: showCancel,
		confirmText: confirmText,
		cancelText: cancelText,
		success: (res) => {
			if (res.confirm) {
				success()
			} else if (res.cancel) {
				cancel()
			}
		}
	});
}

function copy(that, text) {
	// #ifdef H5
	clipboard.handleClipboard(text, event, () => {
		uni.showToast({
			title: that.i18n.copySuccess
		})
	}, () => {
		uni.showToast({
			title: that.i18n.copyFail
		})
	})
	// #endif
	// #ifndef H5
	uni.setClipboardData({
		data: text,
		success: () => {
			uni.showToast({
				title: that.i18n.copySuccess
			})
		},
		fail: () => {
			uni.showToast({
				title: that.i18n.copyFail
			})
		}
	})
	// #endif
}

function parseUrl(url) {
	let result = [];
	let query = url.split('?')[1];
	if (query == null) {
		return null
	}
	let obj = {};
	let queryArr = query.split('&');
	if (queryArr.length < 1) {
		let split = query.split('=')
		let key = split[0];
		let value = split[1];
		obj[key] = value;
	} else {
		queryArr.forEach(function(item) {
			let split = item.split('=')
			let key = split[0];
			let value = split[1];
			obj[key] = value;
		});
	}
	return obj;
}

function handleScan(that) {
	uni.scanCode({
		success: (res) => {
			let param = parseUrl(res.result);
			if (param != null && param.deviceCore) {
				try {
					that.$uniUtilsApi.showToast(that.i18n.operateSuccess, 'success', 1000, false) //操作成功
					uni.navigateTo({
						url: `/pages/deviceNavigation/deviceNavigation?deviceCore=${param.deviceCore}&settingName=${param.settingName}&command=${param.function}&setting=${param.setting}&value=${param.value}&port=${param.port}&childPort=${param.childPort}&pageCur=deviceInfo`
					});
				} catch (e) {
					that.$uniUtilsApi.showToast(that.i18n.moreSetting.QRCodefail, 'none', 1000, false) //二维码有误
				}
			} else {
				that.$uniUtilsApi.showToast(that.i18n.moreSetting.QRCodefail, 'none', 1000, false) //二维码有误
			}
		},
		fail: (res) => {
			that.$uniUtilsApi.showToast(that.i18n.operateFail, 'none', 1000, false) //操作失败
		}
	});
}

function handleProductType(that, data) {
	let productTypeList = [...that.i18n.list.productTypeList]
	let productTypeData = [{
		productId: null,
		name: '全部产品'
	}]
	if (data.length != 0) {
		for (let i = 0; i < data.length; i++) {
			let obj = {
				productId: data[i].productId,
				name: data[i].name
			}
			productTypeList.push(data[i].name);
			productTypeData.push(obj);
		}
	}
	return {
		productTypeList,
		productTypeData
	}
}

function handleProductSeries(that, data) {
	let productSeriesList = [...that.i18n.list.productSeriesList]
	let productSeriesData = [{
		seriesId: null,
		name: '全部系列'
	}]
	if (data.length != 0) {
		for (let i = 0; i < data.length; i++) {
			let obj = {
				seriesId: data[i].seriesId,
				name: data[i].name
			}
			productSeriesList.push(data[i].name);
			productSeriesData.push(obj);
		}
	}
	return {
		productSeriesList,
		productSeriesData
	}
}

function handleProductGroup(that, data) {
	let productGroupList = [...that.i18n.list.productGroupList]
	let productGroupData = [{
		groupId: null,
		groupName: '分组模式'
	}]
	if (data.length != 0) {
		for (let i = 0; i < data.length; i++) {
			let obj = {
				groupId: data[i].groupId,
				groupName: data[i].groupName
			}
			productGroupList.push(data[i].groupName)
			productGroupData.push(obj)
		}
	}
	return {
		productGroupList,
		productGroupData
	}
}

function handleDeviceStatus(statusList, option) {
	let deviceStatu, statusColor;
	switch (option) {
		case 'ONLINE':
			deviceStatu = statusList[0];
			statusColor = '#67c23a'
			break;
		case 'OFFLINE':
			deviceStatu = statusList[1];
			statusColor = '#f56c6c'
			break;
		case 'UNACTIVE':
			deviceStatu = statusList[2]
			statusColor = '#8799a3'
			break;
		case 'DISABLE':
			deviceStatu = statusList[3];
			statusColor = '#f56c6c'
			break;
		default:
			deviceStatu = statusList[3];
			statusColor = '#8799a3'
			break;
	}

	return {
		deviceStatu,
		statusColor
	}
}

function initDeviceList(statusList, data) {
	let list = [];
	for (let i in data) {
		let item = {};
		item.netSignal = data[i].netSignal;
		item.warnNum = data[i].warnNum;
		item.deviceId = data[i].deviceKey;
		item.surplus = data[i].surplus;
		item.powerType = data[i].powerType
		item.charging = data[i].charging;
		item.deviceName = data[i].deviceName;
		item.deviceCore = data[i].deviceCore;
		item.deviceAddr = data[i].address;
		item.deviceLat = data[i].lat;
		item.deviceLng = data[i].lng;
		item.productId = data[i].productId;
		item.serverMessage = data[i].serverMessage;
		item.deviceIcon = data[i].iconUrl;
		item.status = data[i].status
		let {
			deviceStatu,
			statusColor
		} = handleDeviceStatus(statusList, data[i].status)
		item.deviceStatu = deviceStatu;
		item.statusColor = statusColor;
		list.push(item);
	}
	return list
}

function UrlSearch() {
	let name, value;
	// let str = 'http://iot.ztn-tech.com/m/index.html?companyId=2#/pages/login/login' 
	let str = window.location.href; //取得整个地址栏
	let startIndex = str.indexOf('?')
	let endIndex = str.indexOf('#')
	str = str.substr(startIndex + 1, endIndex - 1 - startIndex); //取得所有参数   stringvar.substr(start [, length ]

	let arr = str.split('&'); //各个参数放到数组里
	for (let i = 0; i < arr.length; i++) {
		startIndex = arr[i].indexOf('=');
		if (startIndex > 0) {
			name = arr[i].substring(0, startIndex);
			value = arr[i].substr(startIndex + 1);
			this[name] = value;
		}
	}
}

function getCompanyInfo(that) {
	let promise;
	//#ifdef MP-WEIXIN
	let APPID = wx.getAccountInfoSync().miniProgram.appId;
	promise = companyApi.getCompanyInfo(that, {
		wxAppAppId: APPID
	})
	//#endif
	//#ifdef H5
	let param = new UrlSearch();
	let companyId = param.companyId
	if (companyId != null) {
		promise = companyApi.getCompanyInfo(that, {
			companyId: companyId
		})
	} else {
		// let domainName = 'iot.ztn-tech.com'
		let domainName = window.location.hostname
		promise = companyApi.getCompanyInfo(that, {
			domainName: domainName
		})
	}
	//#endif
	//#ifdef APP-PLUS
	let domainName = 'iot.ztn-tech.com'
	let promise = companyApi.getCompanyInfo(that, {
		domainName: domainName
	})
	//#endif
	promise.then((res) => {
		let {
			companyId,
			companyName,
			iconUrl,
			language,
			shortCompanyName,
			enableRegister,
			enablePhoneRegister
		} = res.data
		let index = language == 'zh' ? 0 : 1
		uni.setStorageSync('companyId', companyId)
		uni.setStorageSync('companyName', companyName)
		uni.setStorageSync('language', language)
		uni.setStorageSync('languageIndex', index)
		uni.setStorageSync('iconUrl', iconUrl)
		uni.setStorageSync('shortCompanyName', shortCompanyName)
		uni.setStorageSync('enableRegister', enableRegister)
		uni.setStorageSync('enablePhoneRegister', enablePhoneRegister)
	})
	return promise
}

function getDeviceInfo(that, deviceCore) {
	return new Promise((resolve, reject) => {
		deviceInfoApi.getDeviceInfo(that, deviceCore).then((res) => {
			if (res.code == '200') {
				let data = res.data
				let unknown = that.i18n.unknown
				let noData = that.i18n.no
				let {
					deviceStatu
				} = handleDeviceStatus(that.i18n.status, data.status)
				that.uniInterface = data.uniInterface || null
				that.deviceName = data.deviceName || null
				that.status = data.status || null
				that.deviceStatu = deviceStatu || null
				that.charging = data.charging || null
				that.surplus = data.surplus || null
				that.powerType = data.powerType || null
				that.netSignal = data.netSignal || null
				that.connectType = data.connectType || null
				that.product = data.product || null
				that.series = data.series || null
				that.phoneNumber = data.phoneNumber || noData
				that.address = data.address || noData
				that.companyName = data.companyName || noData
				that.hardVersion = data.hardVersion || noData
				that.softVersion = data.softVersion || noData
				that.offLineNum = data.offLineNum || noData
				that.serverAddress = data.serverAddress || noData
				that.deviceKey = data.deviceKey || noData
				that.deviceSecret = data.deviceSecret || noData
				that.remark = data.remark || noData
				that.lastOffLineTimer = data.lastOffLineTimer ? formatTime.formatDateTime(data.lastOffLineTimer, unknown) :
					noData
				that.lastOnLineTimer = data.lastOnLineTimer ? formatTime.formatDateTime(data.lastOnLineTimer, unknown) :
					noData
				that.createdDate = data.createdDate ? formatTime.formatDateTime(data.createdDate, unknown) : noData
				that.sellTime = data.sellTime ? formatTime.formatDateTime(data.sellTime, unknown) : noData,
					that.isSell = data.isSell == 0 ? that.i18n.deviceInfo.unsold : that.i18n.deviceInfo.sell //出售 未出售
				resolve()
			}
		})
	})
}

function getPages() {
	let pages = getCurrentPages();
	return pages
}

function getPrevPage() {
	let pages = getPages()
	let prevPage = pages[pages.length - 2];
	return prevPage
}

function toHome(that) {
	let prevPage = getPrevPage()
	prevPage == undefined && (that.isToHome = true)
}

var socketTask;
var intervalID;

function connectSocket() {
	if(socketTask){closeSocket()}
	let accessToken = uni.getStorageSync('accessToken')
	let language = uni.getStorageSync('language')
	let socketUrl =
		`wss://core.ztn-tech.com/ws?accessToken=${accessToken}&language=${language}&app=iot`
	socketTask = uni.connectSocket({
		url: socketUrl,
		header: {
			'content-type': 'application/json'
		},
		method: 'GET',
		success: () => {
			// console.log('连接成功')
		},
	});
}

function openSocket(that,openMessageTxt, closeMessageTxt) {
	let openMessage = uni.getStorageSync('openMessage') || false
	socketTask.onOpen((res) => {
		// console.log("WebSocket连接正常打开中...！");
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		if (openMessage) {
			let time = 1000 * 60 * 60 * 1
			intervalID = setInterval(bindUserSocket,time)
			bindUserSocket(openMessageTxt)
		} else {
			unBindUserSocket()
		}
		// 注：只有连接正常打开中 ，才能正常收到消息
		socketTask.onMessage((res) => {
			let msg = JSON.parse(res.data).msg
			showToast(msg, 'none', 1000, false)
		});
		socketTask.onClose((res) => {
			// console.log('onClose-------------')
			// let date = new Date ()
			// console.log(date)
			let promise = useOpenidLogin(that)
			promise.then(()=>{
				let isLogin = uni.getStorageSync('isLogin')
				if (isLogin) {
					// console.log('重连-------------')
					connectSocket()
					openSocket()
				} else {
					// console.log("关闭回调" + res['reason']);
				}
			})
		})
		socketTask.onError((res) => {
			// console.log("发生错误--------------" + res);
		})
	})
}

function closeSocket() {
	clearInterval(intervalID)
	socketTask.close({
		success: (res) => {
			// console.log('关闭成功', res)
		},
		fail: (err) => {
			// console.log('关闭失败', err)
		}
	})
}

function bindUserSocket(openMessageTxt) {
	openMessageTxt && showToast(openMessageTxt, 'none', 1000, false)
	let userId = uni.getStorageSync('userId')
	let data = {
		cmd: 'bindRoom',
		param:`iot:user:${userId}` 
	}
	socketTask.send({
		data: JSON.stringify(data),
		async success() {
			// console.log('绑定成功');
		},
	});
}

function unBindUserSocket(closeMessageTxt) {
	closeMessageTxt && showToast(closeMessageTxt, 'none', 1000, false)
	let userId = uni.getStorageSync('userId')
	let data = {
		cmd: 'unBindRoom',
		param:`iot:user:${userId}`  
	}
	socketTask.send({
		data: JSON.stringify(data),
		async success() {
			// console.log('解绑成功');
		},
	});
}

function useOpenidLogin(that) {
	let openid = uni.getStorageSync('openid')
	let companyId = uni.getStorageSync('companyId')
	return new Promise((resolve, reject) => {
		//#ifdef MP-WEIXIN
		var promise = tokenApi.userLogin(that, {
			companyId: companyId,
			openid: openid,
			getType: 'wxApp',
		})
		//#endif
		//#ifdef H5
		var promise = tokenApi.userLogin(that, {
			companyId: companyId,
			openid: openid,
			getType: 'gzh'
		})
		//#endif
		promise.then((res) => {
			if (res.status) {
				switch (res.code) {
					case '200':
						let {
							userId,
							userName,
							devKey,
							accessToken,
							singleLogin,
							language
						} = res.data
						let languageIndex = language == 'zh' ? 0 : 1
						uni.setStorageSync('userId', userId)
						uni.setStorageSync('userName', userName)
						uni.setStorageSync('devKey', devKey)
						uni.setStorageSync('accessToken', accessToken)
						uni.setStorageSync('singleLogin', singleLogin)
						uni.setStorageSync('language', language)
						uni.setStorageSync('languageIndex', languageIndex)
						uni.setStorageSync('isLogin', true)
						break;
					case '201':
						uni.setStorageSync('isLogin', false)
						break;
					default:
						that.$uniUtilsApi.showToast(that.i18n.login.unknownError, 'none', 1000, false) //未知错误
						break;
				}
				resolve()
			}
		})
	})
}


export {
	showToast,
	showLoading,
	hideLoading,
	showModal,
	copy,
	handleScan,
	handleProductType,
	handleProductSeries,
	handleProductGroup,
	handleDeviceStatus,
	initDeviceList,
	getCompanyInfo,
	getDeviceInfo,
	getPages,
	getPrevPage,
	toHome,
	connectSocket,
	openSocket,
	closeSocket,
	bindUserSocket,
	unBindUserSocket
}
