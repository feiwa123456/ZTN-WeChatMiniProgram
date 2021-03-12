<template>
	<view class="">
		<cu-custom v-if="isToHome" :isHome="true">
		</cu-custom>
		<cu-custom v-else :isBack="true">
		</cu-custom>

		<view v-for="(item,index) in notices" :key="index">
			<view class="cu-card case margin-lr margin-top-xl">
				<view class="margin-top text-sm text-gray text-center">{{item.publicTime | formatDateTime(i18n.unknown)}}</view>
				<view class="cu-item shadow" style="margin-top:20upx;">
					<view class="cu-list menu-avatar">
						<view class="cu-item margin-lr margin-top-sm" style="border-bottom:1upx solid rgba(0, 0, 0, 0.1);">
							<view class="cu-avatar round bg-yellow light" style="width: 88upx;height: 88upx;font-size: 2em;	margin-left: -20upx;">
								<view class="cuIcon-warnfill" style="z-index: 1;"></view>
							</view>
							<view class="content flex-sub">
								<view style="color:#666666">{{item.title}}</view>
							</view>
						</view>
					</view>
					<view class="margin text-grey">{{item.msg}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as pushApi from '@/common/utils/ztnUniAppApi/ztnRequestApi/pushApi/pushApi.js'
	export default {
		data() {
			return {
				isToHome: false,
				fromLoginBack: false,
				isLoginOverdue: false,
				notices: [],
			}
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			}
		},
		onLoad: function(option) {
			let isLogin = uni.getStorageSync('isLogin') || false
			isLogin ? this.getPushUserNotice() : uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		onShow: function() {
			this.$uniUtilsApi.toHome(this)
			let fromLoginBack = this.fromLoginBack
			fromLoginBack && (this.getPushUserNotice(), this.fromLoginBack = false, this.isLoginOverdue = false)
		},
		methods: {
			getPushUserNotice: function() {
				pushApi.getPushUserNotice(this).then((res) => {
					if (res.code == '200') {
						this.notices = res.data.data;
					}
				})
			}
		},
		onShareAppMessage: function(res) {
			let nickName = uni.getStorageSync('nickName')
			let shortCompanyName = uni.getStorageSync('shortCompanyName')
			return {
				title: `${nickName}${this.i18n.moreOperate.share}${shortCompanyName}`,
				path: `/pages/deviceNotice/deviceNotice`,
				success: (res) => {
					// console.log(res)
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #f8f8f8;
	}
</style>
