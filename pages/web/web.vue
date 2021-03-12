<template>
	<view>
		<!--  #ifdef H5 || APP-PLUS  -->
		<cu-custom :isBack="true">
		</cu-custom>
		<!--  #endif -->
		<web-view :webview-styles="webViewStyles" :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webViewStyles: {
					progress: false 
				},
				webUrl: ''
			}
		},
		onReady() {
		},
		onLoad: function(e) {
			this.webUrl = e.url
		},
	}
</script>

<style>
</style>
