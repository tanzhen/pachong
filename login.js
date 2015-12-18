var nowTime = Math.ceil(Date.now()/1000);
// 本地cookie
var baseCookie = {
	//前面三个实时时间
	Hm_lpvt_d1cb55eae9757438f24e73fdcedc27c5:nowTime,
	Hm_lpvt_d2f8cf438a1c60b4c14e6983620b37ae:nowTime,
	Hm_lpvt_e4d658be0097faa61e8ec41cf5405f2d:nowTime,
	// 后面三个固定时间
	Hm_lvt_d1cb55eae9757438f24e73fdcedc27c5:'1450409439',
	Hm_lvt_d2f8cf438a1c60b4c14e6983620b37ae:'1450409439',
	Hm_lvt_e4d658be0097faa61e8ec41cf5405f2d:'1450409439',
	appcan_uuid:'ffdb8ff9-06f0-10cd-70fa-57ead455e46b',
	// 登录页面的ID
	JSESSIONID:'',
	// 用户ID
	PHPSESSID:'',
	APPDO_TGC:''
}
function appcanGet (url,callfn) {
	http.get(url,function(res){
		var html = '';
		res.on('data',function(data){
			html+=data;
		});
		res.on('end',function(){
			callfn(res,html);
		});
	});
}
// appcan登录
var AppcanLogin = {
	login:function(user,pwd){
		var _this = this;
		appcanGet('http://newsso.appcan.cn/login',function(r,h){
			var sCookie = r.headers['set-cookie'][0];
			// console.log(querystring.parse(sCookie.substr(0,sCookie.indexOf(';'))));
			baseCookie.JSESSIONID = querystring.parse(sCookie.substr(0,sCookie.indexOf(';'))).JSESSIONID;
			var $ = cheerio.load(h);
			var userForm = {
				username:user,
				password:pwd,
				lt:$('form').find('[name="lt"]').val(),
				execution:$('form').find('[name="execution"]').val(),
				_eventId:$('form').find('[name="_eventId"]').val(),
				rememberMe:'on'
			};
			_this.userForm = userForm;
			_this.formSubmit();
		});
	},
	// 表单提交
	formSubmit:function(){
		var formData = querystring.stringify(this.userForm);
		var urlObj = url.parse('http://newsso.appcan.cn/login?service=http://www.appcan.cn/', true, true);
		var requestApp = http.request({
			host:urlObj.host,
			method:'POST',
			path:urlObj.path,
			headers:{
				'Cookie':querystring.stringify(baseCookie,';'),
				'Connection':'keep-alive',
				'Content-Type':'application/x-www-form-urlencoded',
				'Upgrade-Insecure-Requests':'1',
				'Host':urlObj.host,
				'Content-Length':formData.length,
				'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.10 Safari/537.36'
			}
		},function(res){
			var html = '';
			res.on('data',function(data){
				html+=data;
			});
			res.on('end',function(){
				console.log(html);
				console.log(res.headers);
			});
		});
		requestApp.write(formData);
		requestApp.end();
	}
}
// AppcanLogin.login('service@dfs168.com','dfs168');

function openAppcan () {
	appcanGet('http://dashboard.appcan.cn/login/info?callback=jQuery19106836791520472616_1450415514770&_='+Date.now(),function(r,h){
		console.log(r.headers);
		// var $ = cheerio.load(h);
		// var userForm = {
		// 	username:user,
		// 	password:pwd,
		// 	lt:$('form').find('[name="lt"]').val(),
		// 	execution:'e2s1',
		// 	_eventId:'submit',
		// 	rememberMe:'on'
		// };
		// _this.userForm = userForm;
		// _this.formSubmit();
	});
}
// openAppcan();