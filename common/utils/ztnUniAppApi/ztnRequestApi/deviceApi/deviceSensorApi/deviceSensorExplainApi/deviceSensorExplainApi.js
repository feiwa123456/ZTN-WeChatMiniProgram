function getRealTimeList(that, sensorId) {
	let promise = that.$uniBaseRequest(that, '/device/explain/list', {
		sensorId: sensorId,
	})
	return promise
}

function setAlarmValue(that, explainId, sensorId, less, greater, equal, wave) {
	let promise = that.$uniBaseRequest(that, '/device/explain/update', {
		explainId: explainId,
		sensorId: sensorId,
		less: less,
		greater: greater,
		equal: equal,
		wave: wave
	})
	return promise
}

export {
	getRealTimeList,
	setAlarmValue
}
