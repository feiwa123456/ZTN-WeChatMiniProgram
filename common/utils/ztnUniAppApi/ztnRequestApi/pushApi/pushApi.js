function getPushUserNotice(that) {
	let promise = that.$uniBaseRequest(that, '/push/user/notice/pageGet', {
		currentPage: 1,
		pageSize: 999
	})
	return promise
}

export {
	getPushUserNotice
}
