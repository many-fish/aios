<template>
	<div class=tips :class=config.type @mouseover=Clear @mouseleave=Start>
		<span>{{config.message}}</span>
		<div class=close @click='$emit("close")'></div>
	</div>
</template>

<script>
	export default {
		props: ['config','uuid'],
		data(){
			return {
				auto_close: ''
			}
		},
		watch: {
			uuid(){
				this.Clear();
				this.Start();
			}
		},
		methods: {
			Clear(){
				clearTimeout(this.auto_close);
			},
			Start(){
				this.auto_close = setTimeout(() => {
					this.$emit('close');
				},3000)
			}
		},
		created(){
			this.Start();
		}
	}
</script>

<style scoped>
	.tips{position:fixed;z-index:999;right:20px;bottom:20px;width:286px;height:54px;padding:0 20px;border-radius:4px;box-shadow:0 4px 4px #DDD;background:#0078D7;}
	.error{background:#C03;}
	.tips span{font:16px/54px '微软雅黑';color:#FFF;}
	.close{top:20px;}
	.close::before,.close::after{background:#FFF;}
</style>