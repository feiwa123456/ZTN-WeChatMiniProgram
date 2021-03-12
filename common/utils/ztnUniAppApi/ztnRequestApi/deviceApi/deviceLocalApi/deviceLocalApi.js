function getDeviceLocal(that, deviceCore, currentPage, pageSize) {
	let promise = that.$uniBaseRequest(that, '/device/local/pageGet', {
		deviceCore: deviceCore,
		currentPage: currentPage,
		pageSize: pageSize,
	})
	return promise
}

export {
	getDeviceLocal
}
