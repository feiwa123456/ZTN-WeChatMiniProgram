<template>
	<view>
		<view v-if="powerType === 'electricity'">
			<text class="iconfont icon-eletrical" style="font-size:60upx;"></text>
		</view>
		<view v-else-if="charging && status == 'ONLINE'" class="battery-icon">
			<text class="text" style="color:#666666;">{{surplus}}%</text>
			<view class="charge" :style="{'--time': delayTime}" ></view>
		</view>
		<view v-else-if="surplus <=100 && surplus>=80" class="battery-icon hundred-percent">
			<text class="text">{{surplus}}%</text>
		</view>
		<view v-else-if="surplus < 80 && surplus >= 20" class="battery-icon fifty-percent">
			<text class="text">{{surplus}}%</text>
		</view>
		<view v-else-if="surplus < 20 && surplus > 0" class="battery-icon ten-percent">
			<text class="text">{{surplus}}%</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				delayTime:''
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
				default: ''
			},
			powerType: {
				type: String,
				default: '',
			},
		},
		mounted: function() {
			let delayTime = Math.floor(Math.random() * 2)
			this.delayTime = `${delayTime}s`
		}
	}
</script>

<style scoped>
	.battery-icon {
		height: 20px;
		line-height: 20px;
		width: 34px;
		border-radius: 2px;
		top: -1px;
		color: #fff;
		text-align: center;
		font-weight: normal;
		font-size: 24rpx;
		border: 1px solid #666666;
		background: #fff;
		display: inline-block;
		position: relative;
		vertical-align: middle;
	}

	.battery-icon:before {
		background: #666666;
		content: "";
		position: absolute;
		width: 2px;
		bottom: 2px;
		right: -3px;
		top: 2px;
	}

	.battery-icon:after {
		background: #fff;
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
	}

	.hundred-percent:after {
		background: #67c23a;
	}

	.fifty-percent:after {
		background: #fad361;
	}

	.ten-percent:after {
		background: #f56c6c;
	}

	.text {
		position: absolute;
		top: 0;
		left: 50%;
		z-index: 2;
		transform: translateX(-50%)
	}

	.charge {
		position: absolute;
		bottom: 0;
		left: 0;
		top: 0;
		z-index: 1;
		animation:charging 6s linear infinite var(--time)
	}

	@keyframes charging {
		0% {
			right: 34px;
			background-color: #f56c6c;
		}

		50% {
			right: 19px;
			background-color: #fad361;
		}

		100% {
			right: 0px;
			background-color: #67c23a;
		}
	}
</style>
