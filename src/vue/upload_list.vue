<template>
	<ul>
		<li v-for='(item,index) in list'>
			<span class='f14 name ellipsis'>{{item.file.name}}</span>
			<i class=u_icon :class='"type_"+type' @click='$emit("del",list,index)'></i>
			<span class='f14 warn' v-if='type == "error"'>上传错误</span>
			<span class='f14 warn' v-if='type == "cancel"'>已取消</span>
		</li>
	</ul>
</template>

<script>
	export default {
		props: ['list','type']
	}
</script>

<style scoped>
	ul:last-child{margin-bottom:40px;}
	li{width:540px;height:35px;padding-top:13px;border-bottom:1px solid #DDD;}

	.u_icon{float:right;display:inline-block;width:24px;height:24px;background:no-repeat 4px 4px;background-size:16px 16px;border-radius:4px;cursor:pointer;}
	.u_icon:hover{background-color:#DDD;}

	.name{display:inline-block;width:400px;line-height:24px;}
	.warn{float:right;margin-right:14px;line-height:24px;}
	.type_wait{background-image:url(../image/upload/wait.svg);}
	.type_error{background-image:url(../image/upload/error.svg);}
	.type_cancel,.type_error:hover{background-image:url(../image/upload/reload.svg);background-size:20px 20px;background-position:2px 2px;}
	.type_complete{background-image:url(../image/upload/complete.svg);}
	.type_wait:hover,.type_complete:hover{background-image:url(../image/upload/del.svg) !important;}
</style>