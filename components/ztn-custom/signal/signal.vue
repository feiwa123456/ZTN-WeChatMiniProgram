<template>
	<view>
		<view v-if="connectType === 'Ethernet'">
			<text class="iconfont icon-wangkou text-xxl" :style="{color:emphasizeColor}"></text>
		</view>
		<view v-else class="view_sign">
			<view class="view first-view" style="backgroundColor:#fff" :style="{backgroundColor:netSignal > -1 ? emphasizeColor:ghostWhite}"></view>
			<view class="view second-view" style="backgroundColor:#fff" :style="{backgroundColor: netSignal > 15 ? emphasizeColor:ghostWhite}"></view>
			<view class="view third-view" style="backgroundColor:#fff" :style="{backgroundColor:netSignal > 20 ? emphasizeColor:ghostWhite}"></view>
			<view class="view fourth-view" style="backgroundColor:#fff" :style="{backgroundColor:netSignal > 25 ? emphasizeColor:ghostWhite}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emphasizeColor: '',
				ghostWhite: ''
			}
		},
		name: 'signal',
		props: {
			netSignal: {
				type: [String, Number],
				default: ''
			},
			connectType: {
				type: String,
				default: '',
			}
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
			let {
				emphasizeColor,
				standardColor
			} = this.themei18n
			this.emphasizeColor = emphasizeColor
			this.ghostWhite = standardColor['ghostWhite']
		}
	}
</script>

<style scoped>
	.view_sign {
		display: flex;
		align-items: flex-end;
		height: 32upx;
	}

	.view {
		width: 8upx;
		/* border: 1upx solid #666; */
	}

	.first-view {
		height: 10upx;
	}

	.second-view {
		height: 17upx;
		margin-left: 5upx;
	}

	.third-view {
		height: 24upx;
		margin-left: 5upx;
	}

	.fourth-view {
		height: 32upx;
		margin-left: 5upx;
	}
</style>
