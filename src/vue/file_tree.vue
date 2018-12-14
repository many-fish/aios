<template>
	<div class=holder v-if=tree @click.self='$emit("close")'>
		<div class=tree>
			<div class=close title='关闭' @click='$emit("close")'></div>
			<ul>
				<li is=item v-for='item in tree' :item=item :sel=sel @select=Select></li>
			</ul>
			<button class=but1 @click.prevent='$emit("close")'>取消</button>
			<button class=but2 @click.prevent='$emit("complete",path,sel)'>决定就是你了</button>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['tree'],
		data(){
			return {
				path: '',
				sel: ''
			}
		},
		methods: {
			Select(path,sel){
				this.path = path.slice(1);
				this.sel = sel;
			}
		},
		components: {
			item: require('./file_tree_item')
		}
	}
</script>

<style scoped>
	.holder{position:fixed;z-index:999;left:0;right:0;top:0;bottom:0;}
	.tree{position:fixed;width:400px;height:250px;left:50%;top:50%;transform:translate(-50%,-50%);background:#FFF;border:1px solid #272822;border-radius:6px;box-shadow:0 4px 2px #DDD;}
	.close{top:10px;right:15px;}
	.but1,.but2{position:absolute;bottom:20px;}
	.but1{left:20px;}
	.but2{left:80px;}
</style>