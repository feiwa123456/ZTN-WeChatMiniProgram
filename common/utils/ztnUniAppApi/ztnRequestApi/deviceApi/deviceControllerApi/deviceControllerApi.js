function getSettingList(that, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/device/setting/list', {
		deviceCore: deviceCore
	})
	return promise
}

function saveSetting(that, deviceCore, value = null, setting = null, port = null, childPort = null) {
	let promise = that.$uniBaseRequest(that, '/device/setting/send', {
		deviceCore: deviceCore,
		value: value,
		setting: setting,
		port: port,
		childPort: childPort
	})
	return promise
}

export {
	getSettingList,
	saveSetting
}
