<template>
	<div class='pa upload_window'>
		<div class='pr upload_delta'></div>
		<div class='pa upload_content' @click.stop>
			<header class=u_hd>
				<a class=u_clear @click.prevent='complete = []'>清除已完成</a>
				<span class=u_count>
					{{complete.length}} / {{wait.length + error.length + cancel.length + complete.length + Number(!!loading)}}
				</span>
			</header>
			<div class=u_core>
				<div class=loading v-show=loading>
					<div class=loading_top>
						<span class='name ellipsis'>{{name}}</span>
						<i class=u_icon @click=CancelUpload></i>
					</div>
					<div class=progress>
						<div class=progress_inner :style='{width:progress}'></div>
					</div>
					<div class=loading_bottom>
						<span class=loading_speed>{{speed}}</span>
						<span class=loading_total>{{loaded}}/{{total}}</span>
					</div>
				</div>
				<ul is=list :list=wait type=wait @del=DelItem></ul>
				<ul is=list :list=error type=error @del=DelItem></ul>
				<ul is=list :list=cancel type=cancel @del=DelItem></ul>
				<ul is=list :list=complete type=complete @del=DelItem></ul>
			</div>
		</div>
	</div>
</template>

<script>
	var Byte = require('../module/computed_byte');
	var Upload = require('../module/file_upload');
	export default {
		props: ['wait'],
		data(){
			return {
				loading: '',
				loaded_size: 0,
				loading_size: 0,
				load_timer: '',
				speed: '',
				progress: '',
				xhr: '',
				error: [],
				cancel: [],
				complete: []
			}
		},
		watch: {
			loading(file){
				if(file){
					this.xhr = Upload(file,data => {

						if(data.Code == 1){
							this.complete.unshift({file:{name:file.file.name}});
							this.$emit('complete');
						}else{
							console.log(data);
							this.error.push(file);
						}
					
						clearInterval(this.load_timer);
						this.Reset();
						if(this.wait.length)
							setTimeout(() => {
								this.loading = this.wait.shift();
							},700)
					},
					event => {
						this.loading_size = event.loaded;
						this.ComputedSpeed();
					})
				}
			},
			loaded_size(newVal){
				if(this.loading)
					this.progress = newVal / this.loading.file.size * 540 + 'px';
			}
		},
		computed: {
			loaded(){
				return this.loaded_size ? Byte(this.loaded_size/1024,2) : '0.00KB';
			},
			total(){
				return this.loading ? Byte(this.loading.file.size/1024) : '0.0KB';
			},
			name(){
				return this.loading ? this.loading.file.name : 'null';
			}
		},
		methods: {
			CheckLoading(){
				if(!this.loading)
					setTimeout(() => {
						this.loading = this.wait.shift();
					},700)
			},
			ComputedSpeed(){
				this.speed = Byte((this.loading_size - this.loaded_size)/1024 , 0) + '/S';
				this.loaded_size = this.loading_size;
			},
			CancelUpload(){
				this.cancel.push(this.loading);
				this.Reset();

				this.xhr.abort();

				if(this.wait.length)
					setTimeout(() => {
						this.loading = this.wait.shift();
					},700)
			},
			DelItem(list,index){
				var file = list.splice(index,1)[0];
				if(list == this.wait){
					this.cancel.push(file);
				}else if(list != this.complete){
					this.wait.push(file);
					this.CheckLoading();
				}
			},
			Reset(){
				this.loading = '';
				this.loaded_size = 0;
				this.loading_size = 0;
				this.progress = '0px';
				clearInterval(this.load_timer);
			}
		},
		components: {
			list: require('./upload_list')
		}
	}
</script>

<style scoped>
	.upload_window{z-index:999;text-align:left;cursor:default;}
	.upload_delta{left:6px;top:38px;width:22px;height:12px;overflow:hidden;z-index:10;}
	.upload_delta::after{content:'';display:block;position:absolute;left:3px;top:4px;width:16px;height:16px;transform:rotate(45deg);background:#FFF;box-shadow:0 0 3px 0 #272822;}
	.upload_content{background:#FFF;top:50px;right:-50px;width:540px;height:264px;padding:20px 20px 2px;box-shadow:0 0 4px #272822;border-radius:6px;overflow:hidden;}
	.u_hd{height:26px;border-bottom:1px solid #DDD;}
	.u_clear{color:#0078D7;font-size:12px;}
	.u_clear:hover{text-decoration:underline;color:#0078D7;}
	.u_count{float:right;font-size:12px;}
	
	.u_core{width:540px;height:264px;overflow:auto;padding-right:60px;}
	.u_hd,.loading{width:540px;}
	.loading{border-bottom:1px solid #DDD;}
	.u_icon{float:right;display:inline-block;width:24px;height:24px;background:no-repeat 4px 4px;background-size:16px 16px;border-radius:4px;cursor:pointer;}
	.u_icon:hover{background-color:#DDD;}

	.loading{height:77px;padding-top:7px;}
	.loading_top{height:32px;}
	.name{display:inline-block;width:400px;font-size:14px;line-height:32px;}
	.loading_top i{margin-top:4px;background-image:url(../image/upload/loading.svg);}

	.progress{width:540px;background:#DDD;border-radius:5px;overflow:hidden;}
	.progress,.progress_inner{height:10px;}
	.progress_inner{width:0;background:#3DC456;transition:width .6s;}

	.loading_bottom{margin-top:4px;font-size:12px;}
	.loading_total{float:right;}	
	.loading_top i:hover{background-image:url(../image/upload/del.svg) !important;}
</style>