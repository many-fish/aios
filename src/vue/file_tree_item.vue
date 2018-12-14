<template>
	<li @click.stop=Click>
		<span :class='{sel:sel==item.VirName}'>{{item.PathName}}</span>
		<ul v-show=open>
			<li is=tree v-for='child in item.Children' :item=child :sel=sel @select=Select></li>
			<li v-if=!item.Children.length @click.stop>
				<span class=nothing>nothing</span>
			</li>
		</ul>
	</li>
</template>

<script>
	export default {
		name: 'tree',
		props: ['item','sel'],
		data(){
			return {
				open: ''
			}
		},
		methods: {
			Click(){
				this.open = !this.open;
				this.$emit('select',this.item.VirName + '/',this.item.VirName);
			},
			Select(vir,sel){
				this.$emit('select',this.item.VirName + '/' + vir,sel);
			}
		}
	}
</script>

<style scoped>
	li{font-size:16px;padding-left:10px;}
	span:not(.nothing){cursor:pointer;}
	.sel{background:#272822;color:#FFF;}
</style>