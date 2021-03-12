<template>
	<view>
		<cu-custom v-if="isToHome" :isHome="true">
			<block slot="homeText">{{i18n.moreSetting.moreSetting}}</block>
		</cu-custom>
		<cu-custom v-else :isBack="true">
			<block slot="backText">{{i18n.moreSetting.moreSetting}}</block>
		</cu-custom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin ? this.init() : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.init(), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			init: function(option) {},
		},
		onShareAppMessage: function(res) {
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/moreSetting/moreSetting`,
				success: (res) => {
					// console.log(res)
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
