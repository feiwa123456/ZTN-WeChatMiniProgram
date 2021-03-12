<template>
	<view>
		<view class="cu-bar tabbar bg-white shadow foot" id="tabbar">
			<view v-for="(item,index) in tabbarList" :key="index" class="action" :style="{color:pageCur == item.tabbar ? emphasizeColor:''}"
			 @tap="navChange(item.tabbar)">
				<view :class="[item.tabbarCuIcon]" style="font-size:44upx;"></view>
				<view>{{item.tabbarName}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emphasizeColor: '',
			}
		},
		name: 'tabbar',
		props: {
			pageCur: {
				type: String,
				default: ''
			},
			tabbarList: {
				type: Array
			},
		},
		computed: {
			i18n() {
				return this.$i18nMsg()
			},
			themei18n() {
				return this.$themei18nOption()
			}
		},
		mounted: function() {
			this.themeChange()
			let tabbarHeight = uni.getStorageSync('tabbarHeight')
			if (tabbarHeight) {
				this.$emit('getTabbarHeight', tabbarHeight)
			} else {
				uni.createSelectorQuery().in(this).select('#tabbar').boundingClientRect((e) => {
					uni.setStorageSync('tabbarHeight', e.height)
					this.$emit('getTabbarHeight', e.height)
				}).exec()
			}
		},
		methods: {
			navChange: function(e) {
				this.$emit('navChange', e)
			},
			themeChange: function() {
				this.emphasizeColor = this.themei18n.emphasizeColor
			},
		}
	}
</script>

<style>
</style>
