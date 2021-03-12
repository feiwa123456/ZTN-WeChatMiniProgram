function userLogin(that, params) {
	let promise = that.$uniBaseRequest(that, '/token/get', params)
	return promise
}

function loginOut(that, params) {
	let promise = that.$uniBaseRequest(that, '/token/delete', params)
	return promise
}

function experience(that, params) {
	let promise = that.$uniBaseRequest(that, '/token/get', params)
	return promise
}

export {
	userLogin,
	loginOut,
	experience
}
