<template>
	<view>
		<view class="cu-avatar round lg light" :style="{'width':circleWidth+'rpx','height':circleHeight+'rpx','background-color':circleBgColor,'border':circleBorder}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		name: 'circleComponent',
		props: {
			circleWidth:{
				type: Number,
				default: 75
			},
			circleHeight:{
				type: Number,
				default: 75
			},
			circleBgColor:{
				type: String,
				default: ''
			},
			circleBorder:{
				type: String,
				default: ''
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
			this.themeColor = this.themei18n.emphasizeColor
		},
		methods:{
		}
	}
</script>

<style>
</style>
