<template>
	<view>
		<homeComponent v-if="pageCur=='home'" ref="home" :isLogin="isLogin" :tabbarHeight="tabbarHeight" @list='list'></homeComponent>
		<mapComponent v-if="pageCur=='map'" ref="map" :isLogin="isLogin" @isShowNav='isShowNav'>
		</mapComponent>
		<listComponent v-if="pageCur=='list'" ref="mescrollItem" :isLogin="isLogin" :tabbarHeight="tabbarHeight"
		 :currentProductId="currentProductId"></listComponent>
		<centerComponent v-if="pageCur=='center'" ref="center" :isLogin="isLogin" @themeChange='themeChange' @languageChange='languageChange'
		 @unLogin='unLogin'></centerComponent>
		<tabbar v-if="isShow" ref="tabbar" :tabbarList='tabbarList' :pageCur='pageCur' @navChange="navChange"
		 @getTabbarHeight="getTabbarHeight"></tabbar>
	</view>
</template>

<script>
	import tabbar from '@/components/ztn-custom/tabbar/tabbar.vue'
	import homeComponent from '@/pages/home/home.vue'
	import mapComponent from '@/pages/map/map.vue'
	import listComponent from '@/pages/list/list.vue'
	import centerComponent from '@/pages/center/center.vue'
	import * as tokenApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/tokenApi/tokenApi.js'
	import * as userApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/userApi/userApi.js'
	import * as companyApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/companyApi/companyApi.js'
	import MescrollCompMixin from '@/components/mescroll-uni/mixins/mescroll-comp.js';
	export default {
		mixins: [MescrollCompMixin],
		data() {
			return {
				CustomBar: this.CustomBar,
				fromLoginBack: false,
				refresh: false,
				isLogin: false,
				pageCur: '',
				tabbarList: [],
				tabbarHeight: '',
				isShow: true,
				themeColor: '#70c8e2',
				currentProductId: null,
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onReady: function() {},
		onLoad: function() {
			this.getCompanyInfo()
			this.initTabbar()
		},
		onShow: function() {
			let fromLoginBack = this.fromLoginBack
			let refresh = this.refresh
			if (fromLoginBack || refresh) {
				let language = uni.getStorageSync('language')
				fromLoginBack && this.lang(language)
				let pageCur = this.pageCur
				this.pageCur = ''
				this.$nextTick(() => {
					this.connectSocket()
					this.pageCur = pageCur
					this.fromLoginBack = false
					this.refresh = false
					this.isLogin = true
				})
			}
		},
		methods: {
			getCompanyInfo: function() {
				let promise = this.$uniUtilsApi.getCompanyInfo(this)
				promise.then(() => {
					this.pageCur = 'home'
					this.init()
				})
			},
			initTabbar: function() {
				this.tabbarList = [{
						tabbar: 'home',
						tabbarName: this.i18n.nav.home,
						tabbarCuIcon: 'cuIcon-homefill'
					},
					{
						tabbar: 'map',
						tabbarName: this.i18n.nav.map,
						tabbarCuIcon: 'cuIcon-locationfill'
					},
					{
						tabbar: 'list',
						tabbarName: this.i18n.nav.list,
						tabbarCuIcon: 'cuIcon-circlefill'
					},
					{
						tabbar: 'center',
						tabbarName: this.i18n.nav.center,
						tabbarCuIcon: 'cuIcon-peoplefill'
					}
				]
			},
			init: function() {
				let openid = uni.getStorageSync('openid')
					//#ifdef MP-WEIXIN
					!openid ? this.WEIXINGetOpenid() : (this.openid = openid, this.useOpenidLogin())
					//#endif
					//#ifdef H5
					!openid ? this.H5GetOpenid() : (this.openid = openid, this.useOpenidLogin())
				//#endif
				// #ifdef APP-PLUS
				let userName = uni.getStorageSync('userName')
				let password = uni.getStorageSync('password')
				let isLogin = uni.getStorageSync('isLogin')
				let companyId = uni.getStorageSync('companyId')
				if (isLogin && userName != '' && password != '') {
					let promise = tokenApi.userLogin(this, {
						companyId:companyId,
						userName: userName,
						password: password
					})
					this.useOpenidLogin(promise)
				}
				// #endif
			},
			getTabbarHeight: function(tabbarHeight) {
				this.tabbarHeight = tabbarHeight
			},
			navChange: function(pageCur) {
				let isLogin = uni.getStorageSync('isLogin')
				let lastPageCur = this.pageCur
				if (lastPageCur !== pageCur) {
					this.pageCur = pageCur
					lastPageCur === 'list' && (this.currentProductId = null)
				} else {
					if (isLogin) {
						pageCur === 'home' && this.$refs[`${pageCur}`].initResource()
						pageCur === 'list' ? this.$refs.mescrollItem.refresh() : this.$refs[`${pageCur}`].init()
						this.$uniUtilsApi.showToast(this.i18n.refreshSuccess, 'none', 1000, false)
					}
				}
			},
			isShowNav: function(bool) {
				this.isShow = bool
			},
			showMapFav: function(data) {
				uni.$emit('MapFavValue', data)
			},
			list: function(option) {
				this.currentProductId = option.productId
				this.pageCur =option.pageCur
			},
			themeChange: function() {
				this.$refs.tabbar.themeChange();
			},
			languageChange: function() {
				this.initTabbar()
			},
			unLogin: function() {
				this.isLogin = false
			},
			WEIXINGetOpenid: function() {
				let companyId = uni.getStorageSync('companyId')
				uni.login({
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
				})
			},
			H5GetOpenid: function() {
				// let url = 'http://iot.ztn-tech.com/m/index.html'
				// let url =
				// 	'http://iot.ztn-tech.com/m/index.html?from=singlemessage&openid=oZEul5Hry_3fLCDRSdArxYWzROa0&companyId=4#/'
				let url = window.location.href;
				let params = url.split('?')[1];
				if (params) {
					let urlSearchParams = new URLSearchParams(params);
					if (urlSearchParams && urlSearchParams.get('from') == 'singlemessage') {
						this.openid = urlSearchParams.get('openid')
						uni.setStorageSync('openid', this.openid)
						this.useOpenidLogin()
					}
				}
			},
			useOpenidLogin: function(promise) {
				let openid = this.openid
				let companyId = uni.getStorageSync('companyId')
				//#ifdef MP-WEIXIN
				var promise = tokenApi.userLogin(this, {
					companyId:companyId,
					openid: openid,
					getType: 'wxApp',
				})
				//#endif
				//#ifdef H5
				var promise = tokenApi.userLogin(this, {
					companyId:companyId,
					openid: openid,
					getType: 'gzh'
				})
				//#endif
				promise.then((res) => {
					if (res.status) {
						switch (res.code) {
							case '200':
								let {
									userId,
									userName,
									devKey,
									accessToken,
									singleLogin,
									language
								} = res.data
								let languageIndex = language == 'zh' ? 0 : 1
								uni.setStorageSync('userId', userId)
								uni.setStorageSync('userName', userName)
								uni.setStorageSync('devKey', devKey)
								uni.setStorageSync('accessToken', accessToken)
								uni.setStorageSync('singleLogin', singleLogin)
								uni.setStorageSync('language', language)
								uni.setStorageSync('languageIndex', languageIndex)
								uni.setStorageSync('isLogin', true)
								this.isLogin = true
								this.lang(language)
								this.connectSocket()
								break;
							case '201':
								uni.setStorageSync('isLogin', false)
								this.isLogin = false
								this.$uniUtilsApi.showToast(this.i18n.login.bindUser, 'none', 1000, false) //请先绑定用户
								this.lang(uni.getStorageSync('language'))
								break;
							default:
								this.$uniUtilsApi.showToast(this.i18n.login.unknownError, 'none', 1000, false) //未知错误
								break;
						}
					}
				})
			},
			connectSocket:function(){
				let openMessageTxt = this.i18n.openMessage
				let closeMessageTxt = this.i18n.closeMessage
				this.$uniUtilsApi.connectSocket()
				this.$uniUtilsApi.openSocket(this,openMessageTxt, closeMessageTxt)
			},
			lang: function(language) {
				this.$i18n.locale = language
				this.languageChange()
			},
		},
		components: {
			homeComponent,
			mapComponent,
			listComponent,
			centerComponent,
			tabbar
		},
		onShareAppMessage: function(res) {
			let pageCur = this.pageCur
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/nav/nav?pageCur=${pageCur}`,
				success: (res) => {
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
