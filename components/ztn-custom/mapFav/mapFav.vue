<template>
	<view class="ztnCustom-mapFav">
		<text>{{loginForMore}}</text>
		<text class="ztnCustom-mapFav-btn" @tap="tapChild" >{{immediateLoginText}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		name:'mapFav',
		props: {
			loginForMore: {
				type: String,
				default: ''
			},
			immediateLoginText: {
				type: String,
				default: ''
			}
		},
		methods: {
			tapChild: function() {
				this.$emit('parentEvent')
			}
		},
		
	}
</script>

<style scoped>
	.ztnCustom-mapFav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
		margin: auto;
		border-radius: 80rpx;
		color: #fff;
		padding: 0rpx 20rpx 0px 40rpx;
		font-size: 24rpx;
		letter-spacing: 5rpx;
		background: rgba(0, 0, 0, 0.6);
	}

	.ztnCustom-mapFav-btn {
		margin: 2em 0em;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 30rpx;
		border-radius: 40rpx;
		background: #e54d42; 
	}
</style>
