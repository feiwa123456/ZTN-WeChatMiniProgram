function getProductGroupList(that, userId) {
	let promise = that.$uniBaseRequest(that, '/device/group/list', {
		userId: userId
	})
	return promise
}

export {
	getProductGroupList,
}
