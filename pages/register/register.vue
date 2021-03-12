<template>
	<view class="a-swiper-dot">
		<cu-custom :isBack="true">
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<!-- 注册 -->
				<text class="cuIcon-titles text-orange"></text>{{i18n.register.register}}
			</view>
		</view>
		<view class="bg-white padding">
			<view class="cu-steps">
				<view class="cu-item " :class="[index > numStep ? '':'text-olive']" v-for="(item,index) in numStepList" :key="index">
					<text class="num" :data-index="index + 1"></text> <text style="color:#666666">{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="bg-white padding-sm">
			<view v-if="numStep == 0">
				<!-- #ifdef MP-WEIXIN  -->
				<view class="padding content ">
					<!-- 需要你的授权 -->
					<view class="cuIcon-infofill text-df text-orange"><text class="margin-left-xs  ztnCustom-color-grey">{{i18n.register.needYourAuthorize}}</text></view>
					<view class="text-gray text-sm flex">
						<text class="text-cut margin-top-xs">
							<!-- 授权将会获得你的公开信息（昵称、头像等） -->
							<text>{{i18n.register.publicInfo}}</text>
						</text>
					</view>
					<view class="text-gray text-sm flex">
						<text class="text-cut margin-top-xs">
							<!-- 为了提供更好的服务，请在稍后的授权提示中点击允许  -->
							<text>{{i18n.register.clickAllow}}</text>
						</text>
					</view>
				</view>

				<view class="padding action">
					<checkbox-group @change="checkboxChange">
						<checkbox class="round olive margin-right" value="agree"></checkbox>
						<!-- 阅读并同意以下协议 服务协议 -->
						<text class="text-df">{{i18n.register.readAndAgreeProtocol}}<text class="text-blue" style="text-indent:2em;" @tap="privacyPolicy">
								{{i18n.register.agreeProtocol}}</text></text>
					</checkbox-group>
				</view>

				<view class="padding flex flex-direction margin-top">
					<!-- 获取 -->
					<button v-if="disabledGetUserInfo" class="cu-btn round bg-green margin-tb-sm lg" disabled type="">{{i18n.obtain}}</button>
					<button v-else class="cu-btn round bg-green margin-tb-sm lg" open-type="getUserInfo" @getuserinfo="getUserInfo">{{i18n.obtain}}</button>
				</view>
				<!--  #endif -->
				<!--  #ifdef H5 || APP-PLUS  -->
				<view class="padding flex flex-direction margin-top">
					<!-- 同意 -->
					<button class="cu-btn round bg-green margin-tb-sm lg" @tap="agreeProtocol">{{i18n.agree}}</button>
				</view>
				<!--  #endif -->
			</view>

			<view v-if="numStep == 1">
				<view class="padding content ">
					<!-- 请设置常用的联系方式-->
					<view class="cuIcon-infofill text-df text-orange"><text class="margin-left-xs  ztnCustom-color-grey">{{i18n.register.commonContactInfo}}</text></view>
					<view class="text-gray text-sm flex">
						<text class="text-cut margin-top-xs">
							<!-- 验证码没收到? 60秒后可再次获取 -->
							<text>{{i18n.register.acceptCodeFail}}</text>
						</text>
					</view>
				</view>
				<view class="cu-list menu card-menu margin-top solid-bottom ">
					<view class="cu-item">
						<view class="action flex" v-if="useEmailRegister">
							<text class="cuIcon-mail text-xxl text-olive margin-right-sm"></text>
							<!-- 请输入电子邮箱 -->
							<input id="emailInput" @input='changeEmailInput' :adjust-position="true" :focus="true" maxlength="300"
							 cursor-spacing="10" :value="email" :placeholder="i18n.register.inputEmail" placeholder-style='color:#aaaaaa;letter-spacing:2px;'
							 class="text-lg"></input>
						</view>
						<view class="action flex" v-else>
							<text class="cuIcon-phone text-xxl text-olive margin-right-sm "></text>
							<!-- 请输入手机号码 -->
							<input id="phoneNumberInput" @input='changePhoneNumberInput' :adjust-position="true" :focus="true" maxlength="300"
							 cursor-spacing="10" :value="phoneNumber" :placeholder="i18n.register.inputPhoneNumber" placeholder-style='color:#aaaaaa;letter-spacing:2px;'
							 class="text-lg"></input>
						</view>
					</view>
				</view>

				<view class="cu-list menu card-menu margin-top solid-bottom ">
					<view class="cu-item">
						<view class="action flex">
							<!-- 请输入验证码 -->
							<input id="verificationCodeInput" @input='changeVerificationCodeInput' :adjust-position="true" maxlength="300"
							 cursor-spacing="10" :value="verificationCode" :placeholder="i18n.register.inputVerificationCode"
							 placeholder-style='color:#aaaaaa;letter-spacing:2px;' class="text-lg"></input>
						</view>
						<view class="action">
							<!-- 秒 -->
							<button v-if="isCountDown" class="cu-btn bg-green shadow">{{verificationCodeBtn}}{{i18n.seconds}}</button>
							<button v-else class="cu-btn bg-green shadow" @tap="obtainVerificationCode">{{verificationCodeBtn}}</button>
						</view>

					</view>
				</view>

				<view v-if="enablePhoneRegister" class="margin-top text-sm text-olive" style="margin-left:60rpx" @tap="changeRegisterWay">{{phoneRegisterText}}</view>

				<view class="padding flex flex-direction margin-top">
					<button v-if="disabledNextStep" class=" cu-btn round bg-green margin-tb-sm lg" disabled type="">{{i18n.nextStep}}</button>
					<button v-else class=" cu-btn round bg-green margin-tb-sm lg" @tap="nextStep">{{i18n.nextStep}}</button>
				</view>
			</view>

			<view v-if="numStep == 2">
				<view class="padding content">
					<!-- 规范 -->
					<view class="cuIcon-infofill text-df text-orange"><text class="margin-left-xs  ztnCustom-color-grey">{{i18n.standard}}</text></view>
					<view class="text-gray text-sm flex">
						<text class="text-cut margin-top-xs">
							<!-- 输入的用户名不为空,最短为 4 个字符 -->
							<text>{{i18n.register.userNameRules}}</text>
						</text>
					</view>
					<view class="text-gray text-sm flex">
						<text class="text-cut margin-top-xs">
							<!-- 输入的密码不为空,最短为 6 个字符 -->
							<text>{{i18n.register.passwordRules}}</text>
						</text>
					</view>
				</view>

				<view class="cu-list menu card-menu margin-top solid-bottom ">
					<view class="cu-item">
						<view class="action flex">
							<text class="cuIcon-peoplefill text-xxl text-olive margin-right-sm "></text>
							<!-- 请输入用户名 -->
							<input id="userNameInput" @input='changeUserNameInput' :adjust-position="true" :focus="true" maxlength="300"
							 cursor-spacing="10" :value="userName" :placeholder="i18n.inputUsername" placeholder-style='color:#aaaaaa;letter-spacing:2px;'
							 class="text-lg"></input>
						</view>
						<view class="action">
						</view>
					</view>
				</view>

				<view class="cu-list menu card-menu margin-top solid-bottom ">
					<view class="cu-item ">
						<view class="action flex">
							<text class="cuIcon-lock text-xxl text-olive margin-right-sm "></text>
							<!-- 请输入密码 -->
							<input id="passwordInput" @input='changePasswordInput' type="password" :adjust-position="false" maxlength="300"
							 cursor-spacing="10" :value="password" :placeholder="i18n.inputPassword" placeholder-style='color:#aaaaaa;letter-spacing:2px;'
							 class="text-lg"></input>
						</view>
					</view>
				</view>

				<view class="cu-list menu card-menu margin-top solid-bottom ">
					<view class="cu-item ">
						<view class="action flex">
							<text class="cuIcon-lock text-xxl text-olive margin-right-sm "></text>
							<!-- 请再次输入密码 -->
							<input id="passwordInput" type="password" @input='changeAgainPasswordInput' :adjust-position="false" maxlength="300"
							 cursor-spacing="10" :value="againPassword" :placeholder="i18n.register.inputAgainPassword" placeholder-style='color:#aaaaaa;letter-spacing:2px;'
							 class="text-lg"></input>
						</view>
					</view>
				</view>

				<view class="padding flex flex-direction margin-top">
					<button v-if="disabledNextToEnd" class=" cu-btn round bg-green margin-tb-sm lg" disabled type="">{{i18n.nextStep}}</button>
					<button v-else class=" cu-btn round bg-green margin-tb-sm lg" @tap="nextStepToEnd">{{i18n.nextStep}}</button>
				</view>
			</view>

			<view v-if="numStep == 3" class="padding-xl">
				<view class="cu-modal show">
					<view class="cu-dialog" style="width:400rpx">
						<view :class="[isRegisterSuccess?'cuIcon-roundcheckfill text-green':'cuIcon-roundclosefill text-red']" class="padding-top-xl"
						 style="height:220rpx;font-size: 120upx;">
						</view>
						<view class="cu-bar bg-white">
							<view class="action margin-0 flex-sub  solid-left" @tap="hideModal" :data-status="isRegisterSuccess?'success':'fail'"><text
								 class="text-lg">{{isRegisterSuccess? i18n.register.registerSuccess : i18n.register.againRegister }}</text></view>
							<!-- '注册成功':'注册失败,请重新注册' -->
						</view>
					</view>
					<text class="cuIcon-roundclose text-white" style="position: absolute;top:30%;left:80%;font-size:50upx;"
					 :data-status="isRegisterSuccess?'success':'fail'" @tap="hideModal"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
	export default {
		data() {
			return {
				numStepList: [],
				numStep: 0,
				disabledGetUserInfo: true,
				useEmailRegister: true,
				email: '',
				enablePhoneRegister: false,
				phoneRegisterText: '',
				phoneNumber: '',
				verificationCode: '',
				verificationCodeBtn: '',
				isCountDown: false,
				vCodeValue: '',
				disabledNextStep: true,
				userName: '',
				password: '',
				againPassword: '',
				disabledNextToEnd: true,
				isRegisterSuccess: false
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onLoad: function() {
			//#ifdef MP-WEIXIN
			this.$set(this.numStepList, 0, {
				name: this.i18n.register.wechatAuthorize //微信授权
			})
			//#endif
			//#ifdef H5 || APP-PLUS
			this.$set(this.numStepList, 0, {
				name: this.i18n.register.agreeProtocol //同意协议
			})
			//#endif
			this.$set(this.numStepList, 1, {
				name: this.i18n.register.verificationCode //验证码
			})
			this.$set(this.numStepList, 2, {
				name: this.i18n.register.userInformation //用户信息
			})
			this.$set(this.numStepList, 3, {
				name: this.i18n.register.registerSuccess //注册成功
			})
			this.enablePhoneRegister = uni.getStorageSync('enablePhoneRegister')
			this.phoneRegisterText = this.i18n.register.usePhoneRegister //用手机获取验证码
			this.verificationCodeBtn = this.i18n.register.getCode //获取验证码
		},
		methods: {
			numSteps: function() {
				this.numStep = this.numStep == this.numStepList.length - 1 ? 0 : this.numStep + 1
			},
			checkboxChange: function() {
				this.disabledGetUserInfo = !this.disabledGetUserInfo
			},
			getUserInfo: function(e) {
				let userInfo = e.detail.userInfo
				if (userInfo == null) {
					return
				} else {
					this.numSteps()
					uni.setStorageSync('userInfo', userInfo)
				}
			},
			agreeProtocol: function() {
				this.numSteps()
			},
			changeEmailInput: function(e) {
				let email = e.detail.value.replace(/\s/g, '')
				let verificationCode = this.verificationCode
				this.email = email
				this.disabledNextStep = email != '' && verificationCode != '' ? false : true
			},
			changePhoneNumberInput: function(e) {
				let phoneNumber = e.detail.value.replace(/\s/g, '')
				let verificationCode = this.verificationCode
				this.phoneNumber = phoneNumber
				this.disabledNextStep = phoneNumber != '' && verificationCode != '' ? false : true
			},
			changeVerificationCodeInput: function(e) {
				let verificationCode = e.detail.value.replace(/\s/g, '')
				let useEmailRegister = this.useEmailRegister
				let phoneNumber = this.phoneNumber
				let email = this.email
				let disabledNextStep
				if (useEmailRegister) {
					disabledNextStep = email != '' && verificationCode != '' ? false : true
				} else {
					disabledNextStep = phoneNumber != '' && verificationCode != '' ? false : true
				}
				this.verificationCode = verificationCode
				this.disabledNextStep = disabledNextStep
			},
			checkEmail: function(email) {
				let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if (!myreg.test(email)) {
					return false;
				} else {
					return true;
				}
			},
			checkPhoneNumber: function(mobile) {
				if (!/^1[3|4|5|8][0-9]\d{8}$/.test(mobile)) {
					return false;
				} else {
					return true;
				}
			},
			countDown: function(countDown) {
				let interval = setInterval(() => {
					this.verificationCodeBtn = countDown--
					if (countDown == -1) {
						clearInterval(interval)
						this.verificationCodeBtn = this.i18n.againGet //"重新获取"
						this.isCountDown = false
					}
				}, 1000)
			},
			obtainVerificationCode: function() {
				let useEmailRegister = this.useEmailRegister
				useEmailRegister ? this.useEmailObtainVerifyCode() : this.usePhoneObtainVerifyCode()
			},
			useEmailObtainVerifyCode: function() {
				let email = this.email
				let companyId = uni.getStorageSync('companyId')
				if (this.checkEmail(email)) {
					let promise = userApi.obtainVerifyCode(this, {
						email: email,
						registerType: 'email',
						companyId:companyId
					})
					this.obtainVerifyCode(promise)
				} else {
					this.$uniUtilsApi.showToast(this.i18n.register.wrongEmail, 'none', 1000, false)
				}
			},
			usePhoneObtainVerifyCode: function() {
				let phoneNumber = this.phoneNumber
				let companyId = uni.getStorageSync('companyId')
				if (this.checkPhoneNumber(phoneNumber)) {
					let promise = userApi.obtainVerifyCode(this, {
						phoneNumber: phoneNumber,
						registerType: 'phone',
						companyId:companyId
					})
					this.obtainVerifyCode(promise)
				} else {
					this.$uniUtilsApi.showToast(this.i18n.register.wrongPhone, 'none', 1000, false)
				}
			},
			obtainVerifyCode: function(promise) {
				let countDown = 60
				promise.then((res) => {
					if (res.code == '200') {
						this.$uniUtilsApi.showToast(this.i18n.register.sendCode, 'none', 1000, false)
						this.vCodeValue = res.data
						this.verificationCodeBtn = countDown
						this.isCountDown = true
						this.countDown(countDown)
					} else {
						this.$uniUtilsApi.showToast(this.i18n.register.getCodeFail, 'none', 1000, false)
					}
				})
			},
			nextStep: function() {
				let vCodeValue = this.vCodeValue
				let verificationCode = this.verificationCode
				if (vCodeValue == verificationCode) {
					this.numSteps()
				} else {
					this.$uniUtilsApi.showToast(this.i18n.register.wrongCode, 'none', 1000, false)
				}
			},
			changeRegisterWay: function() {
				let useEmailRegister = !this.useEmailRegister
				this.useEmailRegister = useEmailRegister
				this.phoneRegisterText = useEmailRegister ? this.i18n.register.usePhoneRegister : this.i18n.register.useEmailRegister
			},
			changeUserNameInput: function(e) {
				let userName = e.detail.value.replace(/\s/g, '')
				let password = this.password
				let againPassword = this.againPassword
				this.userName = userName
				this.disabledNextToEnd = userName != '' && password != '' && againPassword != '' ? false : true
			},
			changePasswordInput: function(e) {
				let password = e.detail.value.replace(/\s/g, '')
				let userName = this.userName
				let againPassword = this.againPassword
				this.password = password
				this.disabledNextToEnd = userName != '' && password != '' && againPassword != '' ? false : true
			},
			changeAgainPasswordInput: function(e) {
				let againPassword = e.detail.value.replace(/\s/g, '')
				let userName = this.userName
				let password = this.password
				this.againPassword = againPassword
				this.disabledNextToEnd = userName != '' && password != '' && againPassword != '' ? false : true
			},
			nextStepToEnd: function() {
				let userName = this.userName
				let password = this.password
				let againPassword = this.againPassword
				let phoneNumber = this.phoneNumber
				let email = this.email
				let useEmailRegister = this.useEmailRegister
				if (userName.length < 4) {
					this.$uniUtilsApi.showToast(this.i18n.register.userNameLeastLength, 'none', 1000, false)
				} else if (password.length < 6) {
					this.$uniUtilsApi.showToast(this.i18n.register.passwordLeastLength, 'none', 1000, false)
				} else if (password != againPassword) {
					this.$uniUtilsApi.showToast(this.i18n.register.passwordDifferent, 'none', 1000, false)
				} else {
					let promise = useEmailRegister ? this.useEmailRegisterFun(userName, password, email) : this.usePhoneRegister(
						userName, password, phoneNumber)
					promise.then((res) => {
						if (res.code == '200') {
							this.numSteps()
							this.isRegisterSuccess = true
						} else {
							if (res.code == '201' && res.msg == 'exist') {
								this.$uniUtilsApi.showToast(this.i18n.register.userExist, 'none', 1000, false)
							} else {
								this.numSteps()
								this.isRegisterSuccess = false
							}
						}
					})
				}
			},
			useEmailRegisterFun: function(userName, password, email) {
				let companyId = uni.getStorageSync('companyId')
				return userApi.register(this, {
					userName: userName,
					password: password,
					registerType: 'email',
					email: email,
					companyId: companyId
				})

			},
			usePhoneRegister: function(userName, password, phoneNumber) {
				let companyId = uni.getStorageSync('companyId')
				return userApi.register(this, {
					userName: userName,
					password: password,
					registerType: 'phone',
					phoneNumber: phoneNumber,
					companyId: companyId
				})
			},
			hideModal: function(e) {
				let status = e.currentTarget.dataset.status
				if (status == 'success') {
					uni.navigateBack({
						delta: 1
					})
				} else if (status == 'fail') {
					this.numSteps()
					this.disabledGetUserInfo = true
					this.phoneNumber = ''
					this.verificationCode = ''
					this.isCountDown = ''
					this.vCodeValue = ''
					this.disabledNextStep = true
					this.userName = ''
					this.password = ''
					this.againPassword = ''
					this.disabledNextToEnd = true
				}
			}

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
