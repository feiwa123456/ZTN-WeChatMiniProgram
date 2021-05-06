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

function getExplainWarnList(that, explainId) {
	let promise = that.$uniBaseRequest(that, '/device/explain/config/warn/listWithTemplate', {
		explainId: explainId
	})
	return promise
}

function getDeleteAndInsertList(that, explainId, warnList) {
	let promise = that.$uniBaseRequest(that, '/device/explain/config/warn/deleteAndInsertList', {
		explainId: explainId,
		warnList: warnList
	})
	return promise
}

export {
	getRealTimeList,
	setAlarmValue,
	getExplainWarnList,
	getDeleteAndInsertList
}
