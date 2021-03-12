<template>
	<view>
		<view v-if="powerType === 'electricity'">
			<text class="iconfont icon-eletrical" style="font-size:60upx" :style="{color:emphasizeColor}"></text>
		</view>
		<view v-else-if="charging && status == 'ONLINE'" class="charging" :style="{'--color': emphasizeColor}"></view>
		<view v-else-if="surplus <=100 && surplus>=80" class="hundred-percent-battery" :style="{'--color': emphasizeColor}"></view>
		<view v-else-if="surplus < 80 && surplus >= 20" class="twenty-percent-battery" :style="{'--color': emphasizeColor}"></view>
		<view v-else-if="surplus < 20 && surplus >= 0" class="zero-percent-battery" :style="{'--color': emphasizeColor}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emphasizeColor: '',
			}
		},
		name: 'surplus',
		props: {
			charging: {
				type: Boolean,
				default: false
			},
			status:{
				type: String,
				default: ''
			},
			surplus: {
				type: [String, Number],
				default: Number,
			},
			powerType: {
				type: String,
				default: '',
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
			this.emphasizeColor = this.themei18n.emphasizeColor
		}
	}
</script>

<style scoped>
	.view {
		font-family: sans-serif;
		text-transform: uppercase;
		font-weight: bold;
	}

	.charging,
	.hundred-percent-battery,
	.twenty-percent-battery,
	.zero-percent-battery {
		margin: 0 auto;
		width: 40rpx;
		height: 32rpx;
		background-color: #FFFFFF;
		border-width: 5rpx;
		border-style: solid;
		border-radius: 8rpx;
		border-color: var(--color);
		position: relative;
	}

	.charging:before,
	.hundred-percent-battery:before,
	.twenty-percent-battery:before,
	.zero-percent-battery:before {
		position: absolute;
		content: '';
		display: block;
		width: 6rpx;
		height: 10rpx;
		right: -10rpx;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--color);
	}

	.hundred-percent-battery:after,
	.twenty-percent-battery:after,
	.zero-percent-battery:after {
		position: absolute;
		content: "";
		left: 5rpx;
		top: 5rpx;
		bottom: 5rpx;
		background-color: var(--color);
		border-radius: 3rpx;
	}

	.hundred-percent-battery:after {
		right: 5rpx;
	}

	.twenty-percent-battery:after {
		right: 15rpx;
	}

	.zero-percent-battery:after {
		right: 20rpx;
	}

	.charging:after {
		position: absolute;
		content: '⌁';
		left: 0;
		top: 40%;
		right: 0;
		transform: translateY(-50%);
		color: var(--color);
		font-size: 42rpx;
	}
</style>
