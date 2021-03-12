function getDeviceError(that, deviceCore, startDate, endDate, currentPage, pageSize) {
	let promise = that.$uniBaseRequest(that, '/device/warn/pageGet', {
		deviceCore: deviceCore,
		startDate: startDate,
		endDate: endDate,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

export {
	getDeviceError
}
