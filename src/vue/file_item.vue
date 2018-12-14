<template>
	<li class=item :class='{sel:item.sel}' :title=item.name @click.stop=click(index) @contextmenu.prevent.stop=menu(index)>
		<div data-type=check class=e_checkbox :class='{e_tick:item.sel}'></div>
		<div data-type=icon class=item_icon :class='item.ext||"dir"'></div>
 		<span class='ellipsis item_name'>{{item.name}}</span>
 		<div class=item_plus>
 			<img width=20 height=20 title='下载' @click.stop=down(index) :src="'../../contents/image/download.png'">
 			<img width=20 height=20 title='分享' :src="'../../contents/image/share.png'">
			<span class=item_size>{{size}}</span>
 			<time class=item_time>{{item.time}}</time>
 		</div>
 	</li>
</template>

<script>
	var Byte = require('../module/computed_byte');
	export default {
		props: ['item','index','click','down','menu'],
		computed: {
			size(){
				return this.item.ext ? Byte(this.item.size) : '--';
			}
		}
	}
</script>

<style scoped>
	@import url(./css/file_item.css);
</style>