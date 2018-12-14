<template>
	<div class='pr item' :class='{menu:menu==focus}'>
		<span>{{title}}</span>
		<span>{{message}}</span>
		<span @click='$emit("open",menu)'>修改</span>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: ['menu','title','focus','message']
	}
</script>

<style scoped>
span{line-height:70px;}
span:first-child{margin-left:15px;margin-right:38px;}
span:last-of-type{float:right;height:0;margin-right:15px;cursor:pointer;}

form{height:1px;background:#999;overflow:hidden;transition:all .5s;}

div:not(.item){margin-bottom:10px;}
div:first-child{margin-top:24px;}

input{width:160px;height:26px;margin-left:20px;border:1px solid #999;text-indent:10px;}
.mn_secure_sms{width:98px;margin-right:14px;}
.email input{width:180px;}

button{width:48px;height:24px;border:0;border-radius:6px;background:#0078D7;color:#FFF;font:12px/2 '微软雅黑';}
.cancel{margin-left:38px;background:#535353;}

.item::after{content:'';position:absolute;top:57px;transition:top .5s;}
.menu::after{top:52px;right:16px;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:14px solid #DCDCDC;}
.menu form{margin-top:-5px;background:#DCDCDC;border-radius:6px;}

.menu .phone{height:148px;}
.menu .email{height:108px;}
.menu .pword{height:188px;}

.mn_secure_pword{margin-right:-28px;}
</style>