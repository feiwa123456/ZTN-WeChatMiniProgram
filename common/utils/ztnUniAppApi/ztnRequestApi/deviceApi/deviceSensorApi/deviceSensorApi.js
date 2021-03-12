function getSensorList(that, deviceCore) {
	let promise = that.$uniBaseRequest(that, '/device/sensor/list', {
		deviceCore: deviceCore,
		currentPage: 1,
		pageSize: 999,
	})
	return promise
}


function getListWithExplain(that, sensorId, startTimestamp, endTimestamp) {
	let promise = that.$uniBaseRequest(that, '/device/sensor/data/listWithExplain', {
		enableEval: true,
		sensorId: sensorId,
		startTime: startTimestamp,
		endTime: endTimestamp,
	})
	return promise
}

function getHistoryListWithExplain(that, sensorId, startTimestamp, endTimestamp) {
	let promise = that.$uniBaseRequest(that, '/history/device/sensor/data/listWithExplain', {
		enableEval: true,
		sensorId: sensorId,
		startTime: startTimestamp,
		endTime: endTimestamp,
	})
	return promise
}

function getListWith(that, deviceCore, withExplain, withParam, withSetting) {
	let promise = that.$uniBaseRequest(that, '/device/sensor/listWith', {
		deviceCore: deviceCore,
		withExplain: withExplain,
		withParam: withParam,
		withSetting: withSetting,
	})
	return promise
}

export {
	getSensorList,
	getListWithExplain,
	getHistoryListWithExplain,
	getListWith
}
