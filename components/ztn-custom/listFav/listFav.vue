<template>
	<view class="ztnCustom-listFav">
		<image :src="imageSrc" style="height:400rpx; width:400rpx"></image>
		<view class="action text-center">
			<text class="text-grey">{{unLogStatuTxt}}</text>
		</view>
		<view class="action text-center margin-top">
			<button class="cu-btn round margin-tb-sm lg text-white" style="width:400rpx;background-color:#70cdfd" @tap="tapChild">{{immediateLoginText}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		name: 'listFav',
		props: {
			imageSrc: {
				type: String,
				default: ''
			},
			unLogStatuTxt: {
				type: String,
				default: ''
			},
			immediateLoginText: {
				type: String,
				default: ''
			}
		},
		mounted: function() {},
		methods: {
			tapChild: function() {
				this.$emit('parentEvent')
			}
		},
	}
</script>

<style scoped>
	.ztnCustom-listFav {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
