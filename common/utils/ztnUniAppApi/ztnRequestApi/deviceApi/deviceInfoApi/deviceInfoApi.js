// 按省级获取设备数量
function getDeviceInfo(that, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/device/get', {
		deviceCore: deviceCore
	})
	return promise
}

function buyDevice(that, deviceCore, buyUserId, deviceKey) {
	let promise = that.$uniBaseRequest(that, '/device/buy', {
		deviceCore: deviceCore,
		buyUserId: buyUserId,
		deviceKey: deviceKey,
	})
	return promise
}

function updateDeviceInfo(that, params) {
	let promise = that.$uniBaseRequest(that, '/device/update', params)
	return promise
}

function refreshStatus(that, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/device/getStatus', {
		deviceCore: deviceCore
	})
	return promise
}

export {
	getDeviceInfo,
	buyDevice,
	updateDeviceInfo,
	refreshStatus
}
