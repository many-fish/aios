// Author: AIOS | QQ: 1070053575

require('../css/reset.min');
require('../css/base');
require('../css/personal');

var vue = require('vue');
var cites = require('../json/chinese_cites');
var Post = require('../module/ajax_post');

vue.config.debug = true;

var Log = message => console.log(message);

vue.directive('focus',{
	update(el,binding,vnode){
		if(el.dataset.focus == binding.value){
			if(el.dataset.menu)
				setTimeout(function(){
					el.focus();
					vnode.context.focus = '';
				},700)
			else{
				el.focus();
				vnode.context.focus = '';
			}
		}
	}
})

new vue({
	el: '#personal',
	data: {
		user_info: '',
		info_bak: {},
		ext: 'self',
		ext_list: [
			{name:'个人信息',ext:'self'},
			{name:'安全中心',ext:'secure'}
		],
		head_img: '',
		isEdit: '',
		name: '',
		sex: '',
		organ: '',
		email: '',
		email_bak: '',
		phone: '',
		reg_date: '',
		birth_a: 1960,
		birth_b: 1,
		birth_c: 1,
		month: [1,2,3,4,5,6,7,8,9,10,11,12],
		day: [],
		live_a: '广东省',
		live_b: '广州市',
		live_c: '白云区',
		focus: '',
		menu: '',
		sms: '',
		re_sms: '',
		new_phone: '',
		new_email: '',
		pword: '',
		new_pword: '',
		re_new_pword: '',
		tips_uuid: '',
		tips_config: ''
	},
	computed: {
		year(){
			var year = [];
			for(var i = new Date().getFullYear();i >= 1960;i--)
				year.push(i);
			return year;
		},
		isLeap(){
			return this.birth_a % 4 == 0;
		},
		isBig(){
			return [1,3,5,7,8,10,12].indexOf(Number(this.birth_b)) != -1;
		},
		area_a(){
			var area = [];
			for(var key in cites)
				area.push(key);
			return area;
		},
		area_b(){
			if(this.live_a && cites[this.live_a].constructor == Array)
				return cites[this.live_a];
			var area = [];
			for(var key in cites[this.live_a])
				area.push(key);
			return area;
		},
		area_c(){
			if(this.live_a && cites[this.live_a].constructor != Array) return cites[this.live_a][this.live_b];
			return '';
		},
		finish(){
			var name = !this.CheckInput(this.name) && !!this.name && this.name.length<=8,
				birth = this.birth_a && this.birth_b,
				live = this.live_a && (cites[this.live_a].constructor == Array ? this.live_b : this.live_c),
				oran = !this.CheckInput(this.organ) && !!this.organ && this.organ.length<=50 && this.organ!='未填写';
			return (name+!!birth+!!live+oran+1)*20;
		}
	},
	watch: {
		live_a(newVal,oldVal){
			if(oldVal) this.live_b = '';
		},
		live_b(newVal,oldVal){
			if(oldVal) this.live_c = '';
		}
	},
	methods: {
		ExtLink(ext){
			this.ext = ext;
			this.LoadInfo();
			this.isEdit = '';
			if(ext == 'secure'){
				this.menu = '';
				this.sms = '';
				this.re_sms = '';
				this.new_phone = '';
				this.new_email = '';
				this.pword = '';
				this.new_pword = '';
				this.re_new_pword = '';
			}
		},
		SetInfo(data){
			function calc(data){
				if(!data) return '';
				var temp = data.match(/\w{3}(\w*)\w{3}@/)[1];
				var star = '';
				for(var i=0;i<temp.length;i++)
					star += '*';
				return data.replace(temp,star);
			}

			this.info_bak = data;
			this.sex = data.Sex;
			this.email = calc(data.Email);
			this.email_bak = data.Email;
			this.name = data.UserName;
			this.reg_date = data.CreateTime;
			this.organ = data.Organiztion || '未填写';
			this.phone = data.Mobile.replace(data.Mobile.substr(3,5),'*****') + '（可登陆）';
			if(data.Address)
				[this.live_a,this.live_b,this.live_c] = data.Address.split(',');
   		if(data.Birthday){
   			[this.birth_a,this.birth_b,this.birth_c] = data.Birthday.split('-');
   			this.MakeDay();
   		}
		},
		Toggle(){
			var err;

   		if(this.isEdit){
   			var Error = (message,type) => {
    			this.ShowTips(message,'error');
    			err = 1;
    			this.focus = type;
    		}

	    	if(!this.name)
	    		Error('用户名不能为空哦','name');

	    	if(this.name.length>8)
	    		Error('用户名不能长于8个字符哦','name');

	    	if(this.CheckInput(this.name))
	    		Error('用户名不能有奇奇怪怪的字符哦','name');

	    	if(this.birth_a && !this.birth_c)
	    		Error('你得给我们一个明确的出生日期哦');

				if(this.live_a && !(cites[this.live_a].constructor == Array ? this.live_b : this.live_c))
					Error('所在地也要填写完全哦');

	    	if(this.organ.length>50)
	    		Error('麻烦给你的组织起个小名','organ');

	    	if(this.CheckInput(this.organ))
	    		Error('原来你来自一个奇奇怪怪的地方呀','organ');

	    	if(!err){
		   		this.SubmitSelf();
	    	}
   		}else{
   			this.isEdit = true;
   		}

			if(this.isEdit){
				if(this.organ == '未填写') this.organ = '' ;
			}else{
				if(this.organ == '') this.organ = '未填写' ;
			}   
		},
		Upload(event){
			var target = event.target;
			var file = target.files[0];
			if(file){
				var data = new FormData(target.form);
				data.append('img',file);

				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(){
					target.form.reset();
				}

				var xhr = new XMLHttpRequest();
				xhr.onload = () => {
					if(xhr.status == 200)
						this.head_img = reader.result;
				}

				xhr.open('post','/UserCenter/SetHeadImg');
				xhr.send(data);
			}
		},
		ClearName(){
			this.name = '';
			this.focus = 'name';
		},
		CheckInput(text){
			var regexp = [/\?/,/\!/,/\</,/\>/,/\|/,/\*/,/\:/,/\'/,/\'/,/\//,/\\/];
			for(var item of regexp)
				if(text.search(item)+1)
					return true;
			return false;
		},
		SubmitSelf(){
   		Post('/UserCenter/UserInfoEdit',{
    			UserName:this.name,
    			Sex:this.sex,
    			Birthday:`${this.birth_a}-${this.birth_b}-${this.birth_c}`,
    			Address:`${this.live_a},${this.live_b}` + (this.area_c ? `,${this.live_c}` : ''),
    			Organiztion:this.organ,
    			Email:this.email_bak,
    		},data => {
    			if(data.Code == 1){
	    			this.ShowTips('成功提交了咯');
	    			this.isEdit = '';
    			}else
	    			this.ShowTips(data.Msg,'error');
   			}
   		)
		},
		MakeDay(){
			var num;
			this.day = [];
			if(this.isBig){
				num = 31;
			}else if(this.birth_b == 2){
				num = 28 + this.isLeap;
			}else{
				num = 30;
			}
			for(var i=1;i<=num;i++) this.day.push(i);
			if(this.day.indexOf(Number(this.birth_c)) == -1) this.birth_c = 1;
		},
		ShowMenu(focus){
			var type = this.menu == focus ? '' : focus;
			this.focus = type;
			this.menu = type;
		},
		GetSMS(){
   		Post('/SMS/ReSetMobileSMS',null,data => {
   			Log(data);
   			// this.re_sms = data;
   		})
    },
		ReMobile(){
			if(this.sms != this.re_sms)
    		Log('验证码错误啦');
    	else if(!this.new_mobile)
    		Log('你怎么可以不输入新的手机号呢');
    	else
    		Post('/UserCenter/ReSetMobile',null,data => {
    			Log(data);
    		})
    },
		ReEmail(){
			if(this.CheckInput(this.new_email))
				Log('你的邮箱有些不合符规范哦');
			else if(!this.new_email)
				Log('邮箱不能为空哦');
			else
				Post('',{},data => {
					Log(data);
				})
		},
		RePword(){
			if(!this.pword)
   			Log('怎么可以不输入原来的密码呢');
    	else if(this.new_pword != this.re_new_pword)
   			Log('哎呀你两次输入的密码不一样哦');
    	else
    		Post('/UserCenter/ReSetPWD',{},data => {
    			Log(data);
    		})
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
		LoadInfo(){
			Post('/Home/GetUserInfo',null,data => {
				if(data.Code == 1){
					this.user_info = data.Data;
					this.head_img = data.Data.HeadImg;
				}else
					this.ShowTips(data.Msg,'error');
			})

			Post('/UserCenter/Index',null,data => {
				if(data.Code == 1)
					this.SetInfo(data.Data);
				else
					this.ShowTips(data.Msg,'error');
			})
		}
	},
	components: {
		'a-tips': require('../vue/tips'),
		'a-side': require('../vue/aside'),
		'a-head': require('../vue/header'),
		'a-menu': require('../vue/personal_menu')
	},
	created(){
		this.MakeDay();
		// this.LoadInfo();

		setTimeout(()=>{
			this.user_info = {
				UserName: '木木',
				UseSpace: 104857600,
				HadSpace: 1073741824,
				ImgSrc: 'http://img.muops.cn/muyun/headimg.jpg',
				Mobile: 18814373213
			}
		},1000)

		this.SetInfo({
			UserName: '木木',
			Sex: 'man',
			Email: 'mu951899341@gmail.com',
			CreateTime: '2016-11-08 23:25:06',
			Mobile: '18814373213',
			Address: '广东省,广州市,白云区',
			Organiztion: '广东白云学院',
			Birthday: '1994-11-1'
		})

		this.head_img = 'http://img.muops.cn/muyun/headimg.jpg';
	}
})