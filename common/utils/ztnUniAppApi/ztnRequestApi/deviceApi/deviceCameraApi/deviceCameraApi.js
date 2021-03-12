function getCameraList(that, userId, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/camera/bind/list', {
		userId: userId,
		deviceCore: deviceCore,
	})
	return promise
}

function getCameraDeviceList(that, userId, currentPage, pageSize) {
	let promise = that.$uniBaseRequest(that, '/camera/device/pageGet', {
		userId: userId,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

function getCameraAuthList(that, userId, currentPage, pageSize) {
	let promise = that.$uniBaseRequest(that, '/camera/auth/pageGet', {
		userId: userId,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

function pushCloud(that, deviceId, pushTime = 60) {
	let promise = that.$uniBaseRequest(that, '/camera/device/pushCloud', {
		mediaType: 'rtmp',
		deviceId: deviceId,
		pushTime: pushTime
	})
	return promise
}

function stopCloud(that, deviceId) {
	let promise = that.$uniBaseRequest(that, '/camera/device/stopCloud', {
		deviceId: deviceId,
	})
	return promise
}

function keepPushCloud(that, deviceId) {
	let promise = that.$uniBaseRequest(that, '/camera/device/keepPushCloud', {
		mediaType: 'rtmp',
		deviceId: deviceId,
	})
	return promise
}

function sendActionCommand(that, deviceId, action) {
	let promise = that.$uniBaseRequest(that, '/camera/device/controlAction', {
		deviceId: deviceId,
		action: action,
	})
	return promise
}

export {
	getCameraList,
	getCameraDeviceList,
	getCameraAuthList,
	pushCloud,
	stopCloud,
	keepPushCloud,
	sendActionCommand,
}
