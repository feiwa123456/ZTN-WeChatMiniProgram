function getOtherParam(that, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/device/param/list', {
		deviceCore: deviceCore
	})
	return promise
}

export {
	getOtherParam
}
