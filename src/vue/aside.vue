<template>
	<aside class=pr>
		<div class=info :style='{opacity:Number(!!info.UserName)}' @mouseleave='plus=0'>
			<img width=60 height=60 class='vm img' :src=img||info.ImgSrc @mouseover='plus=1'>
			<span class='ellipsis vm name f12' :title=info.UserName @mouseover='plus=1'>{{info.UserName}}</span>
			<div class='pa plus' v-show=plus>
				<div class='pr plus_delta'></div>
				<div class=plus_content>
					<div>
						<span class='f12 plus_mobile'>{{info.Mobile}}</span>
						<a class='f12 plus_exit' @click.prevent=Exit>退出</a>
					</div>
					<a class='f12 tc' href=/UserCenter/Index>个人中心</a>
					<a class='f12 tc' href=javascript:;>官网</a>
					<a class='f12 tc' href=javascript:;>关于</a>
				</div>
			</div>
			<div class='pr progress' :style='{width:progress}'></div>
			<span class=f12>{{used}} / {{had}}</span>
		</div>
		<nav>
			<a class=ext v-for='item in list' :class='[item.ext,{sel:item.ext == ext}]' @click.prevent=link(item.ext)>
				<img width=16 height=16 class=vm :src='"../image/ext/"+item.ext+".svg"'>
				<span class='f14 vm'>{{item.name}}</span>
			</a>
		</nav>
	</aside>
</template>

<script>
  var Post = require('../module/ajax_post');
  var Byte = require('../module/computed_byte');
  export default {
    props: ['info','list','ext','img','link'],
    data(){
      return {
        plus: ''
      }
    },
    computed: {
      used(){
        return Byte(this.info.UseSpace);
      },
      had(){
        return Byte(this.info.HadSpace);
      },
      progress(){
        return this.info.HadSpace ? (this.info.UseSpace / this.info.HadSpace * 156).toFixed(2) + 'px' : '0px';
      }
    },
    methods: {
    	Exit(){
				Post('/LoginReg/Logout',null,function(){});
			}
    }
  }
</script>

<style scoped>
	@import url(./css/aside.css);
</style>