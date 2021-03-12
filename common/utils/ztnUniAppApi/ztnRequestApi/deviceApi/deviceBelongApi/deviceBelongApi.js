
// 按省级获取设备数量
function getProvinceDeviceNum(that) {
	let promise = that.$uniBaseRequest(that, '/device/belong/provinceNum', {})
	return promise
}

// 按城市获取设备数量
function getCityDeviceNum(that, param) {
	let promise = that.$uniBaseRequest(that, '/device/belong/cityNum', param)
	return promise
}

// 按城市获取设备数量
function getAreaDeviceNum(that, cityId, currentPage, pageSize) {
	let promise = that.$uniBaseRequest(that, '/device/belong/pageGetDevice', {
		cityId: cityId,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

// 点击Marker获取设备列表
function MarkerGetDeviceList(that, provinceId, cityId, productId, deviceStatus, currentPage, pageSize) {
	return pageGetDevice(that, {
		provinceId: provinceId,
		cityId: cityId,
		productId: productId,
		status: deviceStatus,
		currentPage: currentPage,
		pageSize: pageSize,
	})
}

//deviceList页面获取设备列表
function getDeviceList(that, userId, deviceStatus, productId, seriesId, deviceName, todayOnline, warnDesc, groupId,
	currentPage,
	pageSize) {
	return pageGetDevice(that, {
		userId: userId,
		status: deviceStatus,
		productId: productId,
		seriesId: seriesId,
		deviceName: deviceName,
		todayOnline: todayOnline,
		warnDesc: warnDesc,
		groupId: groupId,
		currentPage: currentPage,
		pageSize: pageSize,
	})
}

function pageGetDevice(that, param) {
	let promise = that.$uniBaseRequest(that, '/device/belong/pageGetDevice', param)
	return promise
}

function getDeviceStatusCount(that) {
	let promise = that.$uniBaseRequest(that, '/device/belong/statusNum', {})
	return promise
}

// 获取类型列表
function getProductTypeList(that, userId) {
	let promise = that.$uniBaseRequest(that, '/device/belong/productNum', {
		userId: userId
	})
	return promise
}

function getProductSeries(that, userId, productId) {
	let promise = that.$uniBaseRequest(that, '/device/belong/seriesNum', {
		userId: userId,
		productId: productId,
	})
	return promise
}

export {
	getProvinceDeviceNum,
	getCityDeviceNum,
	getAreaDeviceNum,
	MarkerGetDeviceList,
	getDeviceList,
	getProductTypeList,
	getDeviceStatusCount,
	getProductSeries
}

