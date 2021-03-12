function requestError(that, code, code2) {
	let error;
	switch (code) {
		case '401':
			error = that.i18n.login.loginOverdue //'登录过期'
			break;
		case '402':
			switch (code2) {
				case 'userId':
					error = that.i18n.login.checkParam //检查参数
					break;
				case 'oldPassword':
					error = that.i18n.login.oldPasswordError //旧密码错误
					break;
				default:
					error = that.i18n.login.checkParam //检查参数
			}
			break;
		case '403':
			error = that.i18n.login.authorityDeficiency //权限不足
			break;
		case '501':
			error = that.i18n.login.againLater //稍后重试
			break;
		case '502':
			error = settingError(that,code2)
			break;
		default:
			error = that.i18n.login.unknownError //未知错误
	}
	return {
		code,
		code2,
		error
	}
}


function settingError(that, code) {
	let error;
	switch (code) {
		case '1':
			error = that.i18n.deviceController.wrongPort //'端口有误'
			break;
		case '2':
			error = that.i18n.deviceController.wrongCommand //'命令有误'
			break;
		case '3':
			error = that.i18n.deviceController.wrongParameter //'参数有误'
			break;
		case '4':
			error = that.i18n.setFail //'设置失败'
			break;
		case '5':
			error = that.i18n.deviceController.hardwareNotSupport //'硬件不支持'
			break;
		case '602':
			error = that.i18n.deviceController.operateTooFast //'操作过快'
			break;
		case '603':
			error = that.i18n.deviceController.equipmentOffline //'设备不在线'
			break;
		case '604':
			error = that.i18n.deviceController.deviceResponseTimeout //'设备回应超时'
			break;
		case '606':
			error = that.i18n.deviceController.serviceNotSupport //'服务不支持'
			break;
	}
	return error
}


export {
	requestError,
	settingError
}
