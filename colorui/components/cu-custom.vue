<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'']">
				<view class="action" @tap="BackPage" v-if="isBack" :style="[{color: textColor ? textColor : themei18n.navigationBarTextColor}]">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="toHome" v-if="isHome" :style="[{color:textColor ? textColor : themei18n.navigationBarTextColor}]">
					<text class="cuIcon-homefill"></text>
					<slot name="homeText"></slot>
				</view>
				<view class="action" @tap="parentEvent" v-if="isCustom" :style="[{color:themei18n.navigationBarHighlightColor}]">
					<text :class="[customIcon]" style="font-size: 50upx;font-weight: bold;"></text>
					<slot name="customText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		name: 'cu-custom',
		computed: {
			themei18n() {
				return this.$themei18nOption()
			},
			style() {
				let StatusBar = this.StatusBar;
				let CustomBar = this.CustomBar;
				let bgColor = this.bgColor || this.themei18n.navigationBarBackgroundColor
				let bgImage = this.bgImage;
				let style = `height:${CustomBar}px;padding-top:${StatusBar}px;background-color:${bgColor}`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			},
		},
		props: {
			isBack: {
				type: Boolean,
				default: false
			},
			isHome: {
				type: Boolean,
				default: false
			},
			isCustom: {
				type: Boolean,
				default: false
			},
			customParam: {
				type: [String, Number, Boolean, Object],
				default: null
			},
			customIcon: {
				type: String,
				default: ''
			},
			textColor: {
				type: String,
				default: ''
			},
			bgColor: {
				type: String,
				default: ''
			},
			bgImage: {
				type: String,
				default: ''
			}
		},
		methods: {
			BackPage: function() {
				let currentPages = getCurrentPages();
				if (currentPages.length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = '/' + __wxConfig.pages[0]
					return uni.redirectTo({
						url
					})
				}
				uni.navigateBack({
					delta: 1,
				})
			},
			toHome: function() {
				uni.reLaunch({
					url: '/pages/nav/nav',
				})
			},
			parentEvent: function() {
				this.$emit('parentEvent')
			},
		}
	}
</script>

<style>

</style>
