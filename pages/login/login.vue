<template>
	<view style="background-color: #FFFFFF;height:100vh">
		<cu-custom v-if="isToHome">
		</cu-custom>
		<cu-custom v-else :isBack="true">
		</cu-custom>

		<view>
			<view class="ztnCustom-companyInfo">
				<image :src="iconUrl" class="png" mode="widthFix"></image>
				<text class="text-df">{{companyName}}</text>
			</view>

			<view class="cu-list menu card-menu margin-top solid-bottom ">
				<view class="cu-item">
					<view class="action">
						<input id="userNameInput" @input='changeUserNameInput' :adjustPosition="true" :focus="true" maxlength="300"
						 :cursorSpacing="10" :value="userName" :placeholder="i18n.inputUsername" placeholderStyle='color:#aaaaaa;letter-spacing:2px;'
						 class="text-lg"></input>
					</view>
					<view class="action">
						<text class="cuIcon-close text-xl" style="color:#aaaaaa;" v-if="userName.length != 0" @tap="cleanUserName"></text>
					</view>
				</view>
			</view>

			<view class="cu-list menu card-menu margin-top solid-bottom ">
				<view class="cu-item">
					<view class="action">
						<input id="passwordInput" :type="attention ? 'text':'password'" @input='changePasswordInput' :adjustPosition="false"
						 :focus="focusPasswordInput" maxlength="300" :cursorSpacing="10" :value="password" :placeholder="i18n.inputPassword"
						 placeholderStyle='color:#aaaaaa;letter-spacing:2px;' class="text-lg"></input>
					</view>
					<view class="action">
						<view>
							<text :class="attention ? 'cuIcon-attentionfill':'cuIcon-attentionforbidfill'" class="text-xl" style="color:#aaaaaa;"
							 @tap="changeAttention"></text>
							<text class="text-df text-black padding-left-sm" @tap="userForgetpsw">{{i18n.login.forgetpsw}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="padding-left-xs padding-right-xs">
				<view class="padding flex flex-direction margin-top">
					<!-- #ifdef MP-WEIXIN -->
					<button v-if="userName.length == 0 || password.length == 0" class="cu-btn round bg-green margin-tb-sm lg" disabled
					 type="">{{i18n.login.login}}</button>
					<button v-else class="cu-btn round bg-green margin-tb-sm lg" open-type="getUserInfo" @getuserinfo="usePswLogin">{{i18n.login.login}}</button>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<button v-if="userName.length == 0 || password.length == 0 " class="cu-btn round bg-green margin-tb-sm lg"
					 disabled type="">{{i18n.login.login}}</button>
					<button v-else class="cu-btn round bg-green margin-tb-sm lg" @tap="usePswLogin">{{i18n.login.login}}</button>
					<!-- #endif -->
					<view class="cu-bar bg-white">
						<!-- #ifdef MP-WEIXIN -->
						<view class="action">
							<button class="custom-button" style="font-size:28rpx;color:#666666" open-type="getUserInfo" @getuserinfo="userExperience">{{i18n.login.experienceAccount}}</button>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 || APP-PLUS -->
						<view class="action">
							<text class="text-df" @tap="userExperience">{{i18n.login.experienceAccount}}</text>
						</view>
						<!-- #endif -->
						<view class="action" v-if="enableRegister">
							<text class="text-df" @tap="userRegister">{{i18n.login.registerUser}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="text-center">
				<view class="ztnCustom-middle-line">
					<view class="ztnCustom-line-text text-sm" style="color: grey">{{i18n.login.loginKnow}}</view>
				</view>
			</view>

			<view class="padding-lg flex align-center">
				<view class="flex-sub text-center">
					<view class="text-sl padding">
						<text class="cuIcon-roundcheckfill text-green"></text>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view class="text-sm padding" style="color:grey">{{i18n.login.privacypolicyOne}}
						<text class="text-blue">{{i18n.login.privacypolicyTwin}}</text>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<!-- #endif -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
	import * as tokenApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/tokenApi/tokenApi.js'
	import * as companyApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/companyApi/companyApi.js'
	export default {
		data() {
			return {
				isToHome: false,
				openid: '',
				companyName: '',
				iconUrl: '',
				userName: '',
				password: '',
				focusPasswordInput: false,
				attention: false,
				enableRegister: false
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onLoad: function() {
			this.getCompanyInfo()
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
		},
		methods: {
			getCompanyInfo: function() {
				let promise = this.$uniUtilsApi.getCompanyInfo(this)
				promise.then(() => {
					this.init()
				})
			},
			init: function() {
				let openid = uni.getStorageSync('openid')
				let iconUrl = uni.getStorageSync('iconUrl')
				let companyName = uni.getStorageSync('shortCompanyName')
				let enableRegister = uni.getStorageSync('enableRegister')
				this.iconUrl = iconUrl
				this.companyName = companyName
				this.enableRegister = enableRegister
					//#ifdef MP-WEIXIN
					!openid ? this.WEIXINGetOpenid() : (this.openid = openid, this.useOpenidLogin())
					//#endif
					//#ifdef H5
					!openid ? this.H5GetOpenid() : (this.openid = openid, this.useOpenidLogin())
				//#endif
			},
			WEIXINGetOpenid: function() {
				let companyId = uni.getStorageSync('companyId')
				wx.login({
					success: (res) => {
						userApi.WEIXINGetOpenid(this, res.code, companyId).then((res) => {
							this.openid = res.data.openid
							uni.setStorageSync('openid', this.openid)
							this.useOpenidLogin()
						})
					},
					fail: (err) => {
						this.$uniUtilsApi.showToast(this.i18n.login.userInfoFail, 'none', 1000, false)
					}
				});
			},
			H5GetOpenid: function() {
				// let url = 'http://iot.ztn-tech.com/m/index.html'
				// let url = 'http://iot.ztn-tech.com/m/index.html?from=singlemessage&openid=oiaeO1t3P66l3p7mPexHpNFuZiGg&companyId=4#/'
				let url = window.location.href;
				let params = url.split('?')[1];
				if (params) {
					let urlSearchParams = new URLSearchParams(params);
					if (urlSearchParams && urlSearchParams.get('from') == 'singlemessage') {
						this.openid = urlSearchParams.get('openid');
						uni.setStorageSync('openid', this.openid)
						this.useOpenidLogin()
					}
				} else {
					return
				}
			},
			changeUserNameInput: function(e) {
				let password = this.password
				let userName = e.detail.value.replace(/\s/g, '')
				this.userName = userName
			},
			cleanUserName: function() {
				this.userName = ''
			},
			changePasswordInput: function(e) {
				let userName = this.userName
				let password = e.detail.value.replace(/\s/g, '')
				this.password = password
			},
			changeAttention: function() {
				this.attention = !this.attention
				this.focusPasswordInput = true
			},
			userForgetpsw: function() {
				this.$uniUtilsApi.showToast(this.i18n.noSupport, 'none', 1000, false) //暂没开通
			},
			useOpenidLogin: function(promise, type) {
				let openid = this.openid
				let companyId = uni.getStorageSync('companyId')
				//#ifdef MP-WEIXIN
				var promise = promise || tokenApi.userLogin(this, {
					companyId:companyId,
					openid: openid,
					getType: 'wxApp',
				})
				//#endif
				//#ifdef H5
				var promise = promise || tokenApi.userLogin(this, {
					companyId:companyId,
					openid: openid,
					getType: 'gzh'
				})
				//#endif
				promise.then((res) => {
					if (res.status) {
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; //上一个页面
						switch (res.code) {
							case '200':
								var {
									userId,
									userName,
									devKey,
									accessToken,
									singleLogin,
									language
								} = res.data
								let isLogin = true
								let languageIndex = language == 'zh' ? 0 : 1
								uni.setStorageSync('userId', userId)
								uni.setStorageSync('userName', userName)
								uni.setStorageSync('devKey', devKey)
								uni.setStorageSync('accessToken', accessToken)
								uni.setStorageSync('singleLogin', singleLogin)
								uni.setStorageSync('language', language)
								uni.setStorageSync('languageIndex', languageIndex)
								uni.setStorageSync('isLogin', isLogin)
								this.$uniUtilsApi.showToast(this.i18n.bindSuccess, 'none', 1000, false)
								prevPage ? (prevPage.$vm.fromLoginBack = true, uni.navigateBack()) : uni.navigateTo({
									url: `/pages/nav/nav`
								})
								break;
							case '201':
								if (type == 'H5Bind') {
									this.$uniUtilsApi.showToast(this.i18n.login.noExistUser, 'none', 1000, false)
								} else {
									this.$uniUtilsApi.showToast(this.i18n.login.bindUser, 'none', 1000, false)
								}
								var language = uni.getStorageSync('language');
								!prevPage && (this.$i18n.locale = language)
								break;
							default:
								break;
						}

					}
				})
			},
			usePswLogin: function(e) {
				let userName = this.userName
				let password = this.$md5(this.password)
				let openid = this.openid
				let companyId = uni.getStorageSync('companyId')
				//#ifdef MP-WEIXIN
				if (e.detail.userInfo == null) {
					return
				} else {
					let {
						avatarUrl,
						nickName
					} = e.detail.userInfo
					let promise = userApi.WEIXINUsePswBindUser(this, companyId, userName, password, avatarUrl, nickName, openid)
					promise.then((res) => {
						uni.setStorageSync('nickName', nickName)
						uni.setStorageSync('avatarUrl', avatarUrl)
						if (res.status) {
							if (res.code == '200') {
								this.$uniUtilsApi.showToast(this.i18n.bindSuccess, 'none', 1000, false)
								this.useOpenidLogin()
							} else {
								this.$uniUtilsApi.showToast(this.i18n.login.noExistUser, 'none', 1000, false)
							}
						} else if (res.code == '202') { // 重复绑定
							let pages = getCurrentPages()
							pages[pages.length - 2] != undefined ? uni.navigateBack() : uni.navigateTo({
								url: `/pages/nav/nav`
							})
						} else {
							this.$uniUtilsApi.showToast(this.i18n.login.noExistUser, 'none', 1000, false)
						}
					})
				}
				//#endif
				//#ifdef H5
				if (openid) {
					let promise = userApi.h5UsePswBindUser(this,companyId, userName, password, openid)
					promise.then((res) => {
						this.useOpenidLogin()
					})
				} else {
					uni.setStorageSync('userName', userName)
					uni.setStorageSync('password', password)
					let promise = tokenApi.userLogin(this, {
						companyId:companyId,
						userName: userName,
						password: password
					})
					this.useOpenidLogin(promise, 'H5Bind')
				}

				//#endif
				//#ifdef APP-PLUS
				uni.setStorageSync('password', password)
				let promise = tokenApi.userLogin(this, {
					companyId:companyId,
					userName: userName,
					password: password
				})
				this.useOpenidLogin(promise)
				//#endif
			},
			userExperience: function(e) {
				let companyId = uni.getStorageSync('companyId')
				// #ifdef MP-WEIXIN
				if (e.detail.userInfo == null) {
					return
				} else {
					let openid = this.openid
					var {
						avatarUrl,
						nickName
					} = e.detail.userInfo
					var promise = userApi.userExperience(this, {
						companyId: companyId,
						openid: openid,
						isDemoAccount: true,
						nickName: nickName,
						headimgurl: avatarUrl,
						type: 'wxApp',
					})
				}
				// #endif 
				// #ifdef H5 || APP-PLUS
				var promise = tokenApi.experience(this, {
					companyId: companyId,
					isDemoAccount: true
				})
				// #endif 
				promise.then((res) => {
					if (res.code == '200') {
						// #ifdef MP-WEIXIN
						uni.setStorageSync('nickName', nickName)
						uni.setStorageSync('avatarUrl', avatarUrl)
						this.$uniUtilsApi.showToast(this.i18n.bindSuccess, 'none', 1000, false)
						this.useOpenidLogin()
						// #endif 
						// #ifdef H5 || APP-PLUS
						this.useOpenidLogin(promise)
						// #endif 
					} else {
						this.$uniUtilsApi.showToast(this.i18n.login.noExistUser, 'none', 1000, false)
					}
				})
			},
			userRegister: function() {
				uni.navigateTo({
					url: `/pages/register/register`
				});
			},
		}
	}
</script>

<style scoped>
	.ztnCustom-companyInfo {
		padding-top: 40rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.ztnCustom-companyInfo text {
		opacity: 0.8;
	}

	.ztnCustom-companyInfo image {
		width: 200rpx;
		height: 200rpx;
	}

	.ztnCustom-middle-line:before {
		content: '';
		display: block;
		height: 2rpx;
		width: 100%;
		background-color: #ddd;
		/*颜色需与主题大背景色一致*/
		position: relative;
		top: 18rpx;
		left: 0;

	}

	.ztnCustom-line-text {
		display: inline-block;
		background: #fff;
		padding: 0 20rpx 0 20rpx;
		position: relative;
	}

	.custom-button {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 0px;
		padding-right: 0px;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
		line-height: 1;
		border-radius: 5px;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0);
	}

	.custom-button::after {
		border: 0;
	}

	.custom-button-hover {
		background-color: #fff;
	}
</style>
