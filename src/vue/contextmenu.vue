<template>
	<menu class=tc :style='{top:top+"px",left:left+"px"}' @contextmenu.prevent v-show=fixed>
		<li v-for='(item,index) in list' class=f14 :class='{line:item.line,parent:item.child}' @click=item.todo(item.type||target)>
			{{item.name}}
			<menu is=contextmenu class=child v-if=item.child :list=item.child :fixed=ChildFixed(index) child=true></menu>
		</li>
	</menu>
</template>

<script>
	export default {
		name: 'contextmenu',
		props: ['list','fixed','target','child'],
		computed: {
			top(){
				return this.Calc(this.fixed.top , document.body.clientHeight , this.list.length*30 , 'top');
			},
			left(){
				return this.Calc(this.fixed.left , document.body.clientWidth , 120);
			}
		},
		methods: {
			Calc(base,max,menu,plus){
				if(base + menu > max){
					if(this.child){
						plus = (plus == 'top') ? 30 : -120 ;
						return base - menu + plus;
					}
					return base - menu;
				}
				return base;
			},
			ChildFixed(index){
				return {
					top: this.top + index * 30,
					left: this.left + 120
				}
			}
		}
	}
</script>

<style scoped>
	menu{position:fixed;z-index:999;border-radius:4px;background:#FFF;box-shadow:0 0 4px 0 #272822;}

	li{width:120px;height:30px;line-height:30px;cursor:pointer;}
	li:hover{background:#0078D7;color:#FFF;}
	li:first-child{border-radius:4px 4px 0 0;}
	li:last-child{border-radius:0 0 4px 4px;}
	.line{border-bottom:1px solid #DDD;}
	.parent{position:relative;}
	.parent::after{content:'';position:absolute;top:11px;right:8px;border-left:5px solid #272822;border-top:4px solid transparent;border-bottom:4px solid transparent;}
	.parent:hover::after{border-left:5px solid #FFF;}

	.child{display:none;color:#272822;}
	.parent:hover .child{display:block;}
</style>