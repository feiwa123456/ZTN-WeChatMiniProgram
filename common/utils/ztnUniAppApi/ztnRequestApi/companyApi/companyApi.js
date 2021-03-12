function getCompanyResource(that, type, companyId) {
	let promise = that.$uniBaseRequest(that, '/company/resource/list', {
		type: type,
		companyId: companyId
	})
	return promise
}


function getCompanyInfo(that, params) {
	let promise = that.$uniBaseRequest(that, '/company/info', params)
	return promise
}

export {
	getCompanyResource,
	getCompanyInfo
}
