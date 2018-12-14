// Author: AIOS | QQ: 1070053575

require('../css/reset.min');
require('../css/base');
require('../css/recycle');
require('../css/explorer');

var vue = require('vue');
var Post = require('../module/ajax_post');

vue.config.debug = true;

var Log = message => console.log(message);

new vue({
	el: '#recycle',
	data: {
		user_info: '',
		ext: 'recycle',
		ext_list: [
			{name: '全部文件',ext: 'all'},
			{name: '文档',ext: 'doc'},
			{name: '图片',ext: 'images'},
			{name: '视频',ext: 'video'},
			{name: '音乐',ext: 'music'},
			{name: '其它',ext: 'others'},
			{name: '回收站',ext: 'recycle'}
		],
		dir: '',
		dir_file: [],
		dir_folder: [],
		dir_had_sort : '',
		index: [],
		fixed_dir: '',
		fixed_file: '',
		menu_target: '',
		shift_bak : '',
		alert_config: '',
		tips_uuid: '',
		tips_config: ''
	},
	computed: {
		isAll(){
			return this.index.length == this.dir.length && this.dir[0];
		},
		context_dir(){
			return [
				{name: '全部还原',todo: this.ReCoverAll},
				{name: '全部删除',todo: this.DelAll,line:true},
				{
					name: '排序方式',
					todo(){event.stopPropagation()},
					child : [
						{name: '文件名',todo: this.Sort,type:'name'},
						{name: '创建时间',todo: this.Sort,type:'time'},
						{name: '文件大小',todo: this.Sort,type:'size'},
						{name: '文件类别',todo: this.Sort,type:'ext'}
					]
				},
				{name: '刷新',todo: this.ReLoad,line:true},
				{name: '属性',todo(){Log('lalala')}}
			]
		},
		context_file(){
			return [
				{name: '还原',todo: this.ReCoverFile},
				{name: '删除',todo: this.DelFile,line:true},
				{name: '属性',todo(){Log('lalala')}}
			]
		}
	},
	methods: {
		ExtLink(ext){
			this.ext = ext;
			if(ext == 'recycle'){
				this.LoadDir();
			}else{
				sessionStorage.setItem('pomelo_aios_ext',ext);
				location.href = '/Home';
			}
		},
		LoadDir(){
			Post('/Home/Recycle',null,data => {
				if(data.Code == 1){
					this.SetDir(data.Data);
					this.Reset();
				}else{
					this.ShowTips(data.Msg,'error');
				}
			})
		},
		SetDir(data){
			this.dir_file = [];
			this.dir_folder = [];
			this.dir = data.map(item => {
				var _item = {
					sel : '',
					ext : item.FileExt,
					vir : item.VirName,
					name : item.FileName,
					type : item.FileType,
					size : Number(item.FileSize),
					time : item.DeleteTime.replace(/-/g,'/').substr(0,16).replace(/\s/,'　')
				}

				if(_item.type == 'dir')
					this.dir_folder.push(_item);
				else
					this.dir_file.push(_item);

				return _item;
			})
		},
		ReLoad(){
			this.LoadDir();
			Post('/Home/GetUserInfo',null,data => {
				if(data.Code == 1)
					this.user_info = data.Data;
				else
					this.ShowTips(data.Msg,'error');
			})
		},
		SelAll(){
			if(this.isAll)
				this.Reset();
			else{
				this.index = [];
				this.dir.forEach((item,index) => {
					item.sel = true;
					this.index.push(index);
				})
			}
		},
		Sort(type){
			this.fixed_dir = '';
			this.fixed_file = '';

			var Sort = (list,mode) => {
				if(type == 'size' && mode) return;

				var time = list.length;
				while(time){
					var flag;
					for(var i=0 ; i<time-1 ; i++)
						if( list[i][type] > list[i+1][type] ){
							[ list[i] , list[i+1] ] = [ list[i+1] , list[i] ];
							this.dir_had_sort = true;
							flag = true;
						}
					if(!flag) break;
					time--;
				}
			}

			Sort(this.dir_folder,1);
			Sort(this.dir_file);

			if(this.dir_had_sort){
				this.dir = this.dir_folder.concat(this.dir_file);
				this.dir_had_sort = '';
			}else{
				this.dir.reverse();
			}
		},
		DelFile(){
			this.alert_config = {
				title: '彻底删除',
				message: '确定彻底删除所选文件（夹）？',
				buttons: [
					{title: '取消',todo: this.CloseAlert,type: 'button',},
					{title: '确定',todo: this.DelFileSure,type: 'submit',color: 'red'}
				]
			}
		},
		DelFileSure(){
			this.alert_config = '';
			var json = [];

			for(var i of this.index)
				json.push({VirName:this.dir[i].vir,FileType:this.dir[i].type});

			Post('/Home/DeleteFile',{DeleteArray:JSON.stringify(json)},data => {
				if(data.Code == 1){
					this.ShowTips('文件删除成功');
					this.ReLoad();
				}else
					this.alert_config = {
						title: '提示',
						message: '文件删除失败',
						buttons: [{title: '确定',todo: this.CloseAlert,type: 'submit',color: 'red'}]
					}
			})
		},
		DelAll(){
			this.alert_config = {
				title: '全部删除',
				message: '确定彻底删除全部文件（夹）？',
				buttons: [
					{title: '取消',todo: this.CloseAlert,type: 'button',},
					{title: '确定',todo: this.DelAllSure,type: 'submit',color: 'red'}
				]
			}
		},
		DelAllSure(){
			for(var i in this.dir)
				this.index.push(i);
			this.DelFileSure();
		},
		ReCoverFile(){
			this.alert_config = {
				title: '恢复文件',
				message: '确定要恢复所选文件（夹）吗？',
				buttons: [
					{title: '取消',todo: this.CloseAlert,type: 'button'},
					{title: '确定',todo: this.ReCoverFileSure,type: 'submit',color: 'blue'}
				]
			}
		},
		ReCoverFileSure(){
			this.alert_config = '';
			for(var i of this.index)
				Post('/Home/RecoverFile',{VirName:this.dir[i].vir},data => {
					if(data.Code == 1){
						this.ShowTips('恢复文件成功');
						this.ReLoad();
					}else{
						this.ShowTips(data.Msg,'error');
					}
				})
		},
		ReCoverAll(){
			this.alert_config = {
				title: '全部还原',
				message: '确定要恢复全部文件（夹）吗？',
				buttons: [
					{title: '取消',todo: this.CloseAlert,type: 'button'},
					{title: '确定',todo: this.ReCoverAllSure,type: 'submit',color: 'blue'}
				]
			}
		},
		ReCoverAllSure(){
			for(var i in this.dir)
				this.index.push(i);
			this.ReCoverFileSure();
		},
		FileClick(index){
			var list = this.dir;
			var type = event.target.dataset.type;

			this.fixed_dir = '';
			this.fixed_file = '';

			var Select = index => {
				list[index].sel = !list[index].sel;
				if(list[index].sel){
					this.index.push(index);
				}else{
					for(var item of this.index){
						if(item == index){
							this.index.splice(i,1);
							break;
						}
					}
				}
			}

			if(event.shiftKey){
				if(this.index.length){
					this.index = [];
					list.forEach(item => item.sel = '');
					for(var i=0;i <= Math.abs(index-this.shift_bak);i++){
						var j = index > this.shift_bak ? this.shift_bak+i : this.shift_bak-i;
						Select(j);
					}
				}else{
					Select(index);
					this.shift_bak = index;
				}
			}else{
				if(type == 'check' || event.ctrlKey){
					Select(index);
					this.shift_bak = index;
				}
			}
		},
		ShowMenu(index){
			this.fixed_dir = '';
			this.fixed_file = '';
			this.upload_show = '';
			if(typeof index == 'object'){
				this.fixed_dir = {left:event.clientX,top:event.clientY};
			}else{
				this.menu_target = index;
				if(!this.dir[index].sel){
					this.Reset();
					this.dir[index].sel = true;
					this.index.push(index);
				}
				this.fixed_file = {left:event.clientX,top:event.clientY};
			}
		},
		CloseAlert(){
			this.alert_config = '';
		},
		ShowTips(message,type='normal'){
    	this.tips_uuid = Math.random();
    	this.tips_config = {
    		message,
    		type
    	}
    },
   	CloseTips(){
			this.tips_config = '';
		},
		Reset(){
			this.index = [];
			this.dir.forEach(item => item.sel = '');
		}
	},
	components: {
		'a-tips': require('../vue/tips'),
		'a-side': require('../vue/aside'),
		'a-head': require('../vue/header'),
		'a-item': require('../vue/file_item'),
		'a-menu': require('../vue/contextmenu'),
		'a-alert': require('../vue/alert')
	},
	created(){
		document.addEventListener('click',() => {
			this.fixed_dir = '';
			this.fixed_file = '';
		})

		document.addEventListener('contextmenu',() => {
			this.fixed_dir = '';
			this.fixed_file = '';
		})

		document.addEventListener('keydown',event => {
			var key = event.keyCode;

			if((event.metaKey || event.ctrlKey) && key == 65 && event.target.type != 'text'){
				event.preventDefault();
				this.SelAll();
			}

			if(key == 46 && this.index.length)
				this.DelFile({});
		})

		// Post('/Home/GetUserInfo',null,data => {
		// 	if(data.Code == 1){
		// 		this.user_info = data.Data;
		// 		this.LoadDir();
		// 	}else{
		// 		this.ShowTips(data.Msg,'error');
		// 	}
		// })

		setTimeout(()=>{
			this.user_info = {
				UserName: "木木",
				UseSpace: 104857600,
				HadSpace: 1073741824,
				ImgSrc: 'http://img.muops.cn/muyun/headimg.jpg',
				Mobile: 18814373213
			}

			this.SetDir(require('../json/file_list_test'));
		},1000)
	}
})