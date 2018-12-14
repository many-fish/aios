<template>
	<div class=holder :class='{move:isMoving}' @click.self='$emit("close")' @mouseup=Up ondragstart='return false'>
		<div class=alert :style='{left:left+"px",top:top+"px"}'>
			<header class=title @mousedown.self=Down>
				<span>{{config.title}}</span>
				<div class=close title='关闭' @click='$emit("close")'></div>
			</header>
			<div class=content :class='[config.plus?"plus":"normal"]'>
				<span>{{config.message}}</span>
				<input v-model.trim.lazy=config.value v-select v-if=config.plus>
			</div>
			<div class=buttons>
				<button v-for='item in config.buttons' :class=item.color @click=item.todo(config.value,config.index)>{{item.title}}</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['config'],
		data(){
			return {
				win: [document.body.clientWidth, document.body.clientHeight],
				bak: [document.body.clientWidth / 2 - 200, document.body.clientHeight / 2 - 120],
				down: '',
				left: document.body.clientWidth / 2 - 200,
				top: document.body.clientHeight / 2 - 120,
				isMoving: ''
			}
		},
		methods: {
			Key(event){
				var key = event.keyCode;
				if(key == 27)
					this.config.buttons[0].todo();

				if(key == 13 || key == 108)
					this.config.buttons[this.config.buttons.length-1].todo(this.config.value,this.config.index);

				if((event.metaKey || event.ctrlKey) && key == 65 && event.target.type != 'text')
					event.preventDefault();
			},
			Move(event){
				var Calc = (mouse,type) => {
					var value =  mouse + this.bak[type] - this.down[type];

					if(value < 0)	value = 0;
					if(value > this.win[type] - (type ? 208 : 400)) value = this.win[type] - (type ? 208 : 400);

					return value;
				}

				this.left = Calc(event.clientX,0);
				this.top = Calc(event.clientY,1);
				this.isMoving = true;
			},
			Down(event){
				this.down = [event.clientX, event.clientY];
				document.addEventListener('mousemove',this.Move);
				document.addEventListener('mouseleave',this.Up);
				// this.isMoving = true;
			},
			Up(){
				this.bak = [this.left, this.top];
				document.removeEventListener('mousemove',this.Move);
				document.removeEventListener('mouseleave',this.Up);
				this.isMoving = '';
			}
		},
		directives: {
			select: {
				inserted(el){
					el.select();
				}
			}
		},
		created(){
			document.addEventListener('keydown',this.Key);
		},
		destroyed(){
			document.removeEventListener('keydown',this.Key);
		}
	}
</script>

<style scoped>
	.move{cursor:move;}
	.holder{position:fixed;z-index:999;left:0;top:0;right:0;bottom:0;}
	.alert{position:absolute;width:400px;height:208px;background:#FFF;border-radius:4px;box-shadow:0 0 3px #272822;}
	.title{padding:0 20px;height:45px;border-bottom:1px solid #DDD;}
	.title span{font-size:16px;line-height:46px;}

	.content span{font-size:14px;}

	.plus{height:84px;padding-left:80px;padding-top:28px;}
	.plus input{display:block;width:234px;height:30px;margin-top:10px;border:1px solid #DDD;border-radius:6px;text-indent:1em;}
	.normal{height:112px;line-height:112px;text-align:center;}

	.buttons{text-align:center;}
	button{width:100px;height:32px;font-size:14px;border-radius:4px;border:0;background:#EEE;}
	button+button{margin-left:36px;}
	button:hover{background:#D2D2D2;}
	.red,.blue{color:#FFF;}
	.red,.red:hover{background:#C33;}
	.blue,.blue:hover{background:#0078D7;}
</style>