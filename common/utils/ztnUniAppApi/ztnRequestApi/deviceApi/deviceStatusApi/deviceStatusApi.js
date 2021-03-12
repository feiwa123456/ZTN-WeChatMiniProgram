function getDeviceStatus(that, deviceCore, startDate, endDate, currentPage, pageSize, ) {
	let promise = that.$uniBaseRequest(that, '/device/status/pageGet', {
		deviceCore: deviceCore,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

export {
	getDeviceStatus
}
