//异步请求
export default function baseRequest(that, url, params = {}, path = null) {
	const baseURL = that.$uniBaseURL || 'https://core.ztn-tech.com'
	const httpDefaultOpts = {
		url: `${baseURL}${url}`,
		data: params,
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'dev-key': uni.getStorageSync('devKey'),
			'access-token': uni.getStorageSync('accessToken'),
			'language': uni.getStorageSync('language'),
			'app': 'iot'
		},
	}
	let promise = new Promise((resolve, reject) => {
		uni.request(httpDefaultOpts).then(
			(response) => {
				let data = response[1].data
				if (data.status) {
					resolve(data)
				} else {
					handleError(that, data)
				}
			}
		).catch(
			(response) => {
				that.$uniUtilsApi.showToast(that.i18n.login.unknownError, 'none', 1000, false) //'未知错误'
			}
		)
	})
	return promise
}

function handleError(that, data) {
	console.log('handleError')
	let {
		code,
		code2,
		error
	} = that.$error.requestError(that, data.code, data.code2)
	switch (code) {
		case '401':
			if (!that.isLoginOverdue) {
				that.$uniUtilsApi.showToast(error, 'none', 1000, false)
				that.isLoginOverdue = true
				setTimeout((res) => {
					uni.navigateTo({
						url: `/pages/login/login`
					})
				}, 1000)
			}
			break;
		case '402':
			code2 == 'userId' && uni.navigateTo({
				url: `/pages/login/login`
			})
			that.$uniUtilsApi.showToast(error, 'none', 1000, false)
			break;
		case '502':
			that.$uniUtilsApi.hideLoading()
			that.showErrorModal = true,
			that.settingError = error
			break;
		default:
		that.$uniUtilsApi.showToast(error, 'none', 1000, false)
	}
}
