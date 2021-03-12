function WEIXINGetOpenid(that, code, companyId) {
	let promise = that.$uniBaseRequest(that, '/user/thirdParty/getWxAppSession', {
		code: code,
		companyId: companyId
	})
	return promise
}

function h5UsePswBindUser(that,companyId, userName, password, openid) {
	let promise = that.$uniBaseRequest(that, '/user/thirdParty/bindUser', {
		companyId:companyId,
		userName: userName,
		password: password,
		openid: openid,
		type: 'gzh'
	})
	return promise
}

function WEIXINUsePswBindUser(that,companyId, userName, password, avatarUrl, nickName, openid) {
	let promise = that.$uniBaseRequest(that, '/user/thirdParty/bindUser', {
		companyId:companyId,
		userName: userName,
		password: password,
		headimgurl: avatarUrl,
		nickName: nickName,
		openid: openid,
		type: 'wxApp'
	})
	return promise
}

function loginOut(that, params) {
	let promise = that.$uniBaseRequest(that, '/user/thirdParty/delete', params)
	return promise
}

function updateLanguage(that, language, userId) {
	let param = {
		language: language,
		userId: userId
	}
	return update(that, param)
}

function updatePassword(that,userId,oldPassword, newPassword) {
	let param = {
		userId:userId,
		oldPassword: oldPassword,
		password: newPassword,
	}
	return update(that, param)
}

function update(that, param) {
	let promise = that.$uniBaseRequest(that, '/user/update', param)
	return promise
}

function obtainVerifyCode(that, params) {
	let promise = that.$uniBaseRequest(that, '/user/sendAuthCode', params)
	return promise
}

function register(that, params) {
	let promise = that.$uniBaseRequest(that, '/user/register', params)
	return promise
}

function userExperience(that, params) {
	let promise = that.$uniBaseRequest(that, '/user/thirdParty/bindUser', params)
	return promise
}



export {
	WEIXINGetOpenid,
	h5UsePswBindUser,
	WEIXINUsePswBindUser,
	loginOut,
	updateLanguage,
	updatePassword,
	obtainVerifyCode,
	register,
	userExperience
}
